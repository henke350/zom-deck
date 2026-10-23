/**
 * All balance numbers in one place (decided in docs/plan.md, rounds 1–3).
 * Tune values here after playtests; rules code must never hard-code them.
 */

export type ZombieFollow = 'chase' | 'gentle' | 'off'

export type ZombieKind = 'walker' | 'runner' | 'brute' | 'screamer'

export interface ZombieStats {
  readonly hp: number
  readonly damage: number
  /** How far it follows a player it has seen (0: it never leaves its place). */
  readonly followSteps: number
  /** Noise it makes at the end of each turn while it has seen you. */
  readonly screamNoise: number
}

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
  readonly zombies: Readonly<Record<ZombieKind, ZombieStats>>
  /** Added to the start-zombie range of every building that has one (a tuning knob). */
  readonly extraStartZombies: number
  readonly zombieFollow: ZombieFollow
  /** Unvisited buildings show a zombie range instead of the exact count. */
  readonly hiddenDanger: boolean
  /** Each new city picks its buildings at random and places them in random slots. */
  readonly randomCity: boolean
  /** A building shows as unknown until the player has stood next to it (or scouted it). */
  readonly hiddenBuildings: boolean
  readonly heavyLoadPerPack: number
  /** AP cost of a location service (Workshop: Dismantle, Pharmacy: Patch up). */
  readonly locationServiceCost: number
  /** Rare finds count this much of their loot weight in an ordinary search (0–1). */
  readonly rareFindWeight: number
  /** Buildings that hide a locked stash of rare finds (placed at random). */
  readonly stashesOnMap: number
  /** Rare finds to choose from in an opened stash. */
  readonly stashOptions: number
  /** AP to open a stash with a Tool card. */
  readonly stashToolCost: number
  /** Forcing a stash open without a Tool card. */
  readonly stashForce: { readonly cost: number; readonly noise: number }
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
  zombies: {
    walker: { hp: 2, damage: 1, followSteps: 1, screamNoise: 0 },
    runner: { hp: 1, damage: 1, followSteps: 2, screamNoise: 0 },
    brute: { hp: 4, damage: 2, followSteps: 0, screamNoise: 0 },
    screamer: { hp: 1, damage: 0, followSteps: 1, screamNoise: 2 },
  },
  extraStartZombies: 0,
  zombieFollow: 'chase',
  hiddenDanger: true,
  randomCity: true,
  hiddenBuildings: true,
  heavyLoadPerPack: 1,
  locationServiceCost: 1,
  rareFindWeight: 0.25,
  stashesOnMap: 2,
  stashOptions: 2,
  stashToolCost: 1,
  stashForce: { cost: 2, noise: 2 },
  wounds: { enabled: false, damageInOnePhase: 2 },
  starterDeck: { search: 4, crowbar: 2, run: 1, sneak: 1, nerves: 2 },
}

export function starterDeckSize(b: Balance): number {
  return Object.values(b.starterDeck).reduce((sum, count) => sum + count, 0)
}
