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
  /** Added to the start-zombie range of every building that has one (a tuning knob). */
  readonly extraStartZombies: number
  readonly zombieFollow: ZombieFollow
  /** Unvisited buildings show a zombie range instead of the exact count. */
  readonly hiddenDanger: boolean
  readonly heavyLoadPerPack: number
  /** AP cost of a location service (Workshop: Dismantle, Pharmacy: Patch up). */
  readonly locationServiceCost: number
  /** Variant: losing this much health in one zombie phase adds a Wound to your deck. */
  readonly wounds: { readonly enabled: boolean; readonly damageInOnePhase: number }
  readonly starterDeck: {
    readonly search: number
    readonly crowbar: number
    readonly run: number
    readonly sneak: number
    readonly nerves: number
  }
}

export const balance: Balance = {
  maxHp: 9,
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
  extraStartZombies: 0,
  zombieFollow: 'chase',
  hiddenDanger: true,
  heavyLoadPerPack: 1,
  locationServiceCost: 1,
  wounds: { enabled: false, damageInOnePhase: 2 },
  starterDeck: { search: 4, crowbar: 2, run: 1, sneak: 1, nerves: 2 },
}

export function starterDeckSize(b: Balance): number {
  return Object.values(b.starterDeck).reduce((sum, count) => sum + count, 0)
}
