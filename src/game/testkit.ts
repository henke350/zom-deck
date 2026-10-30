import { balance as defaultBalance, type Balance } from '../data/balance'
import { defaultContent } from '../data/content'
import { freshGear } from './gear'
import { emptyStats } from './stats'
import type {
  CardId,
  CardInstance,
  GameState,
  LocationId,
  SiteState,
  Tag,
  Zombie,
  ZombieKind,
} from './types'

/** Builds a game state with exact piles, for tests. Uids show the pile: h1 (hand), d1 (draw), x1 (discard). */
export interface StateSpec {
  readonly hand?: readonly CardId[]
  readonly draw?: readonly CardId[]
  readonly discard?: readonly CardId[]
  readonly inPlay?: readonly CardId[]
  readonly removed?: readonly CardId[]
  /** Gear in front of you (uids g1, g2, …), with what it has left (default: fresh). */
  readonly gear?: readonly CardId[]
  readonly gearLeft?: Readonly<Record<string, number>>
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
  /** Buildings with a locked stash, and how far it is: hidden (default), found or opened. */
  readonly stashAt?: Readonly<Record<LocationId, 'hidden' | 'found' | 'opened'>>
  /** Override searches left per building. */
  readonly searchesLeft?: Readonly<Record<LocationId, number>>
  /** Zombies, with uids z1, z2, … in this order. Default: none. */
  readonly zombies?: readonly {
    readonly at: LocationId
    /** Default: Walker. */
    readonly kind?: ZombieKind
    readonly hp?: number
    readonly alerted?: boolean
    readonly neutralized?: boolean
  }[]
  /** Danger level. Default: 1. */
  readonly danger?: number
  readonly noise?: number
  /** Places already visited. Default: the shelter and the player's location. */
  readonly visited?: readonly LocationId[]
  /** The Stray Dog's health; leave out for no dog. */
  readonly dog?: number
}

function instances(prefix: string, ids: readonly CardId[] = []): CardInstance[] {
  return ids.map((card, i) => ({ uid: `${prefix}${i + 1}`, card }))
}

/** The balance file, but on the classic map (with its 4 packs) and every building in view. Tests use it by default. */
export const classicBalance: Balance = {
  ...defaultBalance,
  randomCity: false,
  cityMap: 'classic',
  hiddenBuildings: false,
  // The small map has 6 buildings; 4 packs is its tuning (the large city has 5).
  packsOnMap: 4,
}

/** The classic map with tougher zombies from danger 3 (the knob tuning 7 turned off). */
export const toughBalance: Balance = {
  ...classicBalance,
  danger: {
    ...classicBalance.danger,
    levels: classicBalance.danger.levels.map((l, i) => (i >= 2 ? { ...l, zombieHpBonus: 1 } : l)),
  },
}

export function makeState(spec: StateSpec = {}): GameState {
  const balance = spec.balance ?? classicBalance
  const location = spec.location ?? 'shelter'
  const zombies: Zombie[] = (spec.zombies ?? []).map((z, i) => ({
    uid: `z${i + 1}`,
    kind: z.kind ?? 'walker',
    location: z.at,
    hp: z.hp ?? balance.zombies[z.kind ?? 'walker'].hp,
    alerted: z.alerted ?? z.at === location,
    neutralized: z.neutralized ?? false,
  }))
  const sites: Record<LocationId, SiteState> = {}
  for (const loc of Object.values(defaultContent.locations)) {
    if (loc.kind !== 'building') continue
    sites[loc.id] = {
      searchesLeft: spec.searchesLeft?.[loc.id] ?? balance.searchesPerBuilding,
      hasPack: spec.packsAt?.includes(loc.id) ?? false,
      packTaken: false,
      scouted: false,
      burned: false,
      stash: spec.stashAt?.[loc.id] ?? 'none',
    }
  }
  const piles = {
    hand: instances('h', spec.hand),
    draw: instances('d', spec.draw),
    discard: instances('x', spec.discard),
    inPlay: instances('p', spec.inPlay),
    removed: instances('r', spec.removed),
    gear: instances('g', spec.gear),
  }
  const hp = spec.hp ?? balance.maxHp
  return {
    seed: spec.seed ?? 1,
    rng: spec.seed ?? 1,
    balance,
    turn: spec.turn ?? 1,
    phase: 'action',
    player: {
      location,
      hp,
      ap: spec.ap ?? balance.apPerTurn,
      freeMoveUsed: spec.freeMoveUsed ?? false,
      packs: spec.packs ?? 0,
      searchBonus: 0,
      block: 0,
    },
    piles,
    sites,
    zombies,
    nextZombieUid: zombies.length + 1,
    noise: spec.noise ?? 0,
    danger: spec.danger ?? 1,
    gearLeft: {
      ...Object.fromEntries(
        piles.gear.flatMap((g) => {
          const def = defaultContent.cards[g.card]?.gear
          return def ? [[g.uid, freshGear(def)]] : []
        }),
      ),
      ...spec.gearLeft,
    },
    visited: spec.visited ?? [...new Set(['shelter', location])],
    tagsPlayedThisTurn: spec.tags ?? [],
    nextUid: 1000,
    stats: emptyStats(hp, Object.values(piles).flat().length),
    ...(spec.dog ? { dog: { hp: spec.dog, bitten: false } } : {}),
  }
}

export function cardsIn(pile: readonly CardInstance[]): CardId[] {
  return pile.map((c) => c.card)
}

export function uidsIn(pile: readonly CardInstance[]): string[] {
  return pile.map((c) => c.uid)
}
