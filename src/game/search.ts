import { texts } from '../data/texts.en'
import type { Balance } from '../data/balance'
import { withoutCard } from './deck'
import { nextInt, shuffle } from './rng'
import { addNoise, zombiesAt } from './zombies'
import type {
  CardId,
  CardInstance,
  Content,
  GameEvent,
  GameState,
  LocationId,
  LootEntry,
  SiteState,
  Validation,
} from './types'

/** Places supply packs: always in `alwaysHasPack` buildings, the rest at random among the others. */
export function placePacks(
  content: Content,
  balance: Balance,
  rng: number,
): [sites: Record<LocationId, SiteState>, rng: number] {
  const buildings = Object.values(content.locations).filter((l) => l.kind === 'building')
  const fixed = buildings.filter((l) => l.alwaysHasPack).map((l) => l.id)
  const others = buildings.filter((l) => !l.alwaysHasPack).map((l) => l.id)
  const randomCount = balance.packsOnMap - fixed.length
  if (randomCount < 0 || randomCount > others.length) {
    throw new Error(`Cannot place ${balance.packsOnMap} packs in ${buildings.length} buildings`)
  }

  const [shuffled, next] = shuffle(others, rng)
  const withPack = new Set([...fixed, ...shuffled.slice(0, randomCount)])
  const sites: Record<LocationId, SiteState> = {}
  for (const building of buildings) {
    sites[building.id] = {
      searchesLeft: balance.searchesPerBuilding,
      hasPack: withPack.has(building.id),
      packTaken: false,
      scouted: false,
      burned: false,
    }
  }
  return [sites, next]
}

/** Can the player search where they stand? */
export function checkSearchHere(state: GameState, content: Content): Validation {
  const here = state.player.location
  const site = state.sites[here]
  if (content.locations[here]?.kind !== 'building' || !site) {
    return { ok: false, reason: texts.reasons.nothingToSearch }
  }
  if (site.burned) return { ok: false, reason: texts.reasons.burned }
  if (site.searchesLeft <= 0) return { ok: false, reason: texts.reasons.searchedOut }
  return { ok: true }
}

/** Picks up to `count` different cards from a weighted pool, without repeats. */
export function drawFinds(
  pool: readonly LootEntry[],
  count: number,
  rng: number,
): [finds: CardId[], rng: number] {
  let remaining = pool.filter((entry) => entry.weight > 0)
  let state = rng
  const finds: CardId[] = []
  while (finds.length < count && remaining.length > 0) {
    const total = remaining.reduce((sum, entry) => sum + entry.weight, 0)
    const [roll, next] = nextInt(state, total)
    state = next
    let acc = 0
    const picked = remaining.find((entry) => (acc += entry.weight) > roll) ?? remaining[0]
    if (!picked) break
    finds.push(picked.card)
    remaining = remaining.filter((entry) => entry.card !== picked.card)
  }
  return [finds, state]
}

interface SearchSpec {
  /** Finds before bonuses: the balance value for a card search or a quick search. */
  readonly base: number
  /** Extra finds from the card itself (Lockpick Follow-up). */
  readonly extra: number
  readonly quick: boolean
  /** Noise added after the player has chosen. */
  readonly noise: number
}

/**
 * Searches the current building: uses up a search, spends the search bonus,
 * adds the "search in peace" bonus when no zombies are here, reveals finds and,
 * on the first search, hands over a hidden pack (with its Heavy Load). The game
 * then waits for the player to choose a find; the noise comes after the choice.
 */
export function performSearch(
  state: GameState,
  content: Content,
  spec: SearchSpec,
  events: GameEvent[],
): GameState {
  const location = state.player.location
  const site = state.sites[location]
  const pool = content.locations[location]?.lootPool ?? []
  if (!site) throw new Error(`performSearch: ${location} cannot be searched`)

  const peaceful = zombiesAt(state, location).length === 0
  const count =
    spec.base +
    spec.extra +
    state.player.searchBonus +
    (peaceful ? state.balance.peacefulSearchBonus : 0)
  const [options, rng] = drawFinds(pool, count, state.rng)
  events.push({ type: 'searched', location, options, quick: spec.quick })

  let next: GameState = {
    ...state,
    rng,
    phase: 'chooseFind',
    player: { ...state.player, searchBonus: 0 },
    sites: { ...state.sites, [location]: { ...site, searchesLeft: site.searchesLeft - 1 } },
    pendingFind: { location, options, packFound: site.hasPack, noise: spec.noise },
  }

  if (site.hasPack) {
    const packs = next.player.packs + 1
    next = {
      ...next,
      player: { ...next.player, packs },
      sites: {
        ...next.sites,
        [location]: {
          ...site,
          searchesLeft: site.searchesLeft - 1,
          hasPack: false,
          packTaken: true,
        },
      },
    }
    events.push({ type: 'packFound', location, packs })
    for (let i = 0; i < state.balance.heavyLoadPerPack; i++) {
      next = gainCard(next, content.packCard, 'pack', events)
    }
  }
  return next
}

/** Adds a new card to the discard pile. */
export function gainCard(
  state: GameState,
  card: CardId,
  reason: 'find' | 'pack',
  events: GameEvent[],
): GameState {
  const instance: CardInstance = { uid: `c${state.nextUid}`, card }
  events.push({ type: 'cardGained', uid: instance.uid, card, reason })
  return {
    ...state,
    nextUid: state.nextUid + 1,
    piles: { ...state.piles, discard: [...state.piles.discard, instance] },
  }
}

/** Ends the find choice: take a find, scrap a card from hand, or take nothing. Then the search makes its noise. */
export function chooseFind(
  state: GameState,
  choice: { take: CardId } | { scrap: string } | 'decline',
  content: Content,
  events: GameEvent[],
): GameState {
  const noise = state.pendingFind?.noise ?? 0
  let next: GameState = { ...state, phase: 'action', pendingFind: undefined }
  if (choice === 'decline') {
    events.push({ type: 'findDeclined' })
  } else if ('take' in choice) {
    next = gainCard(next, choice.take, 'find', events)
  } else {
    const target = state.piles.hand.find((c) => c.uid === choice.scrap)
    if (!target) throw new Error('chooseFind: validated scrap target is missing')
    events.push({ type: 'cardScrapped', uid: target.uid, card: target.card })
    next = {
      ...next,
      piles: {
        ...next.piles,
        hand: withoutCard(next.piles.hand, target.uid),
        removed: [...next.piles.removed, target],
      },
    }
  }
  return addNoise(next, noise, content, 'noise', events)
}
