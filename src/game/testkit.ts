import { balance as defaultBalance, type Balance } from '../data/balance'
import { defaultContent } from '../data/content'
import type { CardId, CardInstance, GameState, LocationId, SiteState, Tag } from './types'

/** Builds a game state with exact piles, for tests. Uids show the pile: h1 (hand), d1 (draw), x1 (discard). */
export interface StateSpec {
  readonly hand?: readonly CardId[]
  readonly draw?: readonly CardId[]
  readonly discard?: readonly CardId[]
  readonly inPlay?: readonly CardId[]
  readonly removed?: readonly CardId[]
  readonly location?: LocationId
  readonly hp?: number
  readonly ap?: number
  readonly packs?: number
  readonly freeMoveUsed?: boolean
  readonly turn?: number
  readonly tags?: readonly Tag[]
  readonly balance?: Balance
  readonly seed?: number
  /** Buildings that hide a pack. Default: none. */
  readonly packsAt?: readonly LocationId[]
  /** Override searches left per building. */
  readonly searchesLeft?: Readonly<Record<LocationId, number>>
}

function instances(prefix: string, ids: readonly CardId[] = []): CardInstance[] {
  return ids.map((card, i) => ({ uid: `${prefix}${i + 1}`, card }))
}

export function makeState(spec: StateSpec = {}): GameState {
  const balance = spec.balance ?? defaultBalance
  const sites: Record<LocationId, SiteState> = {}
  for (const loc of Object.values(defaultContent.locations)) {
    if (loc.kind !== 'building') continue
    sites[loc.id] = {
      searchesLeft: spec.searchesLeft?.[loc.id] ?? balance.searchesPerBuilding,
      hasPack: spec.packsAt?.includes(loc.id) ?? false,
      packTaken: false,
    }
  }
  const piles = {
    hand: instances('h', spec.hand),
    draw: instances('d', spec.draw),
    discard: instances('x', spec.discard),
    inPlay: instances('p', spec.inPlay),
    removed: instances('r', spec.removed),
  }
  return {
    seed: spec.seed ?? 1,
    rng: spec.seed ?? 1,
    balance,
    turn: spec.turn ?? 1,
    phase: 'action',
    player: {
      location: spec.location ?? 'shelter',
      hp: spec.hp ?? balance.maxHp,
      ap: spec.ap ?? balance.apPerTurn,
      freeMoveUsed: spec.freeMoveUsed ?? false,
      packs: spec.packs ?? 0,
      searchBonus: 0,
      block: 0,
    },
    piles,
    sites,
    tagsPlayedThisTurn: spec.tags ?? [],
    nextUid: 1000,
  }
}

export function cardsIn(pile: readonly CardInstance[]): CardId[] {
  return pile.map((c) => c.card)
}

export function uidsIn(pile: readonly CardInstance[]): string[] {
  return pile.map((c) => c.uid)
}
