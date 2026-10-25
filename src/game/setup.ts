import { balance as defaultBalance, type Balance } from '../data/balance'
import { adoptDog } from './dog'
import { defaultContent } from '../data/content'
import { startTurn } from './engine'
import { normalizeSeed, shuffle } from './rng'
import { contentForCity, mapContent, maybeRollCity } from './city'
import { placePacks } from './search'
import { emptyStats } from './stats'
import { revealZombies, setupZombies } from './zombies'
import type { CardId, CardInstance, Content, ExpeditionSetup, GameEvent, GameState } from './types'

export interface NewGameOptions {
  readonly balance?: Balance
  readonly content?: Content
  readonly setup?: ExpeditionSetup
}

/** The starter deck from the balance file, in a fixed order before shuffling. */
export function starterDeck(b: Balance): CardId[] {
  return Object.entries(b.starterDeck).flatMap(([card, count]) =>
    Array.from({ length: count }, () => card),
  )
}

/** Creates a new expedition: shuffles the deck and draws the first hand (turn 1). */
export function newGame(seed: number, options: NewGameOptions = {}): GameState {
  const balance = options.balance ?? defaultBalance
  const content = options.content ?? defaultContent
  const deckIds = options.setup?.startDeck ?? starterDeck(balance)

  for (const id of deckIds) {
    if (!content.cards[id]) throw new Error(`Unknown card in start deck: ${id}`)
  }
  if (!content.locations[content.startLocation]) {
    throw new Error(`Unknown start location: ${content.startLocation}`)
  }

  const instances: CardInstance[] = deckIds.map((card, i) => ({ uid: `c${i + 1}`, card }))
  const normalized = normalizeSeed(seed)
  const [draw, afterDeck] = shuffle(instances, normalized)
  const setup = options.setup
  // A campaign keeps the same city every day; otherwise each expedition rolls its own.
  const [city, afterCity] = setup?.city
    ? [setup.city, afterDeck]
    : maybeRollCity(content, balance, afterDeck)
  const here = city ? contentForCity(city, mapContent(content, balance.cityMap)) : content
  const campaign = setup?.campaignDay !== undefined
  const [placed, afterPacks, packsPlaced] = placePacks(here, balance, afterCity, {
    ...(setup?.searchesUsed ? { searchesUsed: setup.searchesUsed } : {}),
    ...(setup?.burned ? { burned: setup.burned } : {}),
    packKinds: campaign,
  })
  // Lookout: some buildings are scouted before you set out.
  const sites = { ...placed }
  for (const id of setup?.scouted ?? []) {
    const site = sites[id]
    if (site) sites[id] = { ...site, scouted: true }
  }
  const [zombies, nextZombieUid, rng] = setupZombies(here, balance, afterPacks)

  const startHp = options.setup?.startHp ?? balance.maxHp
  const initial: GameState = {
    seed: normalized,
    rng,
    balance,
    turn: 0,
    phase: 'action',
    player: {
      location: content.startLocation,
      hp: startHp,
      ap: 0,
      freeMoveUsed: false,
      packs: 0,
      searchBonus: 0,
      block: 0,
    },
    piles: { draw, hand: [], inPlay: [], discard: [], removed: [], gear: [] },
    sites,
    tagsPlayedThisTurn: [],
    nextUid: instances.length + 1,
    zombies,
    nextZombieUid,
    noise: 0,
    danger: 1,
    gearLeft: {},
    visited: [content.startLocation],
    ...(city ? { city } : {}),
    ...(campaign
      ? {
          campaignDay: setup.campaignDay,
          known: setup.known ?? [],
          ...(packsPlaced !== balance.packsOnMap ? { packsPlaced } : {}),
        }
      : {}),
    stats: emptyStats(startHp, instances.length),
  }
  const events: GameEvent[] = []
  const scouted = (setup?.scouted ?? []).filter((id) => sites[id])
  const revealed = scouted.reduce((s, id) => revealZombies(s, here, id), initial)
  // Campaign: the dog from earlier days comes along.
  const withDog = setup?.dog ? adoptDog(revealed, setup.dog.hp, events) : revealed
  return startTurn(withDog, events)
}
