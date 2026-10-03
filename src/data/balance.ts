/**
 * All balance numbers in one place (decided in docs/plan.md, rounds 1–3).
 * Tune values here after playtests; rules code must never hard-code them.
 */

export type ZombieFollow = 'chase' | 'gentle' | 'off'

export interface Balance {
  readonly maxHp: number
  readonly handSize: number
  readonly apPerTurn: number
  /** Unplayed cards that may stay in hand for the next turn. */
  readonly keepCards: number
  readonly turnLimit: number
  readonly duskFromTurn: number
  /** Noise added at the end of each turn during dusk. */
  readonly duskNoise: number
  readonly searchesPerBuilding: number
  readonly searchOptions: number
  readonly quickSearch: { readonly cost: number; readonly options: number }
  /** Extra finds when searching a location without zombies. */
  readonly peacefulSearchBonus: number
  readonly noiseThreshold: number
  readonly searchNoise: number
  readonly packsToWin: number
  readonly packsOnMap: number
  /** Packs needed for ★, ★★ and ★★★. */
  readonly starThresholds: readonly [number, number, number]
  readonly zombie: { readonly hp: number; readonly damage: number }
  readonly zombieFollow: ZombieFollow
  /** Unvisited buildings show a zombie range instead of the exact count. */
  readonly hiddenDanger: boolean
  readonly heavyLoadPerPack: number
  /** AP cost of a location service (Workshop: Dismantle, Pharmacy: Patch up). */
  readonly locationServiceCost: number
  readonly starterDeck: {
    readonly search: number
    readonly crowbar: number
    readonly run: number
    readonly sneak: number
    readonly nerves: number
  }
}

export const balance: Balance = {
  maxHp: 10,
  handSize: 5,
  apPerTurn: 3,
  keepCards: 1,
  turnLimit: 10,
  duskFromTurn: 8,
  duskNoise: 1,
  searchesPerBuilding: 2,
  searchOptions: 3,
  quickSearch: { cost: 2, options: 2 },
  peacefulSearchBonus: 1,
  noiseThreshold: 4,
  searchNoise: 1,
  packsToWin: 2,
  packsOnMap: 4,
  starThresholds: [2, 3, 4],
  zombie: { hp: 2, damage: 1 },
  zombieFollow: 'chase',
  hiddenDanger: true,
  heavyLoadPerPack: 1,
  locationServiceCost: 1,
  starterDeck: { search: 3, crowbar: 2, run: 2, sneak: 1, nerves: 2 },
}

export function starterDeckSize(b: Balance): number {
  return Object.values(b.starterDeck).reduce((sum, count) => sum + count, 0)
}
