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
  /**
   * Finds you see when you search its body after killing it (0: nothing to search). A fraction
   * is a chance of one more: 0.5 means one find half the time.
   */
  readonly loot: number
}

/** One step of the danger meter. */
export interface DangerLevel {
  /** Noise that brings zombies at this level. */
  readonly noiseThreshold: number
  /** Zombies that arrive each time the noise meter fills. */
  readonly arrivals: number
  /** The reward: extra finds in every search at this level. */
  readonly extraFinds: number
  /** The reward: how much of its weight a rare find counts in a search at this level. */
  readonly rareFindWeight: number
  /** Extra health for every zombie at this level (they get tougher as you get stronger). */
  readonly zombieHpBonus: number
}

/**
 * The danger meter: the better you do, the wilder the city gets, and the richer. It starts at
 * level 1 and rises one level for every pack and every rare find you take (up to the last
 * level). Higher levels bring more and harder zombies, but also more finds and more rare
 * finds. Each rise can bring a horde to the street (`hordeSize`). Which kinds arrive at each
 * level is content (`arrivals.byDanger`).
 */
export interface DangerBalance {
  readonly enabled: boolean
  /** Level 1 first. */
  readonly levels: readonly DangerLevel[]
  readonly perPack: number
  readonly perRareFind: number
  /** Danger also rises by one each time you have taken this many finds (0: never). */
  readonly perFindsTaken: number
  /** Start zombies in a building get their kind when you first see inside (with the danger mix). */
  readonly rollOnReveal: boolean
  /** Zombies that arrive on the street each time the level rises. */
  readonly hordeSize: number
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
  readonly danger: DangerBalance
  /** Added to the start-zombie range of every building that has one (a tuning knob). */
  readonly extraStartZombies: number
  readonly zombieFollow: ZombieFollow
  /** Unvisited buildings show a zombie range instead of the exact count. */
  readonly hiddenDanger: boolean
  /** Each new city picks its buildings at random and places them in random slots. */
  readonly randomCity: boolean
  /**
   * The shape of a random city: the classic 3 × 3 map (6 buildings), or the large 5 × 3 map
   * (10 buildings, a far downtown). Without `randomCity` the classic map is always used.
   */
  readonly cityMap: 'classic' | 'large'
  /** A building shows as unknown until the player has stood next to it (or scouted it). */
  readonly hiddenBuildings: boolean
  readonly heavyLoadPerPack: number
  /** AP cost of a location service (Workshop: Dismantle, Pharmacy: Patch up). */
  readonly locationServiceCost: number
  /** Rare finds count this much of their loot weight in an ordinary search (0–1). */
  readonly rareFindWeight: number
  /** Taken finds go straight into your hand (true) or onto your discard pile (false). */
  readonly findsToHand: boolean
  /** When choosing finds, you may scrap a card from your hand instead (off since tuning 5). */
  readonly scrapInFinds: boolean
  /** The most finds one body search can show, however many zombies a card killed. */
  readonly bodyLootMax: number
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
  packsOnMap: 5,
  starThresholds: [2, 3, 4],
  zombies: {
    // loot below 1 is a chance: a Walker carries something half the time.
    walker: { hp: 2, damage: 1, followSteps: 1, screamNoise: 0, loot: 0.5 },
    runner: { hp: 1, damage: 1, followSteps: 2, screamNoise: 0, loot: 1 },
    brute: { hp: 4, damage: 2, followSteps: 0, screamNoise: 0, loot: 2 },
    screamer: { hp: 1, damage: 0, followSteps: 1, screamNoise: 2, loot: 0.5 },
  },
  danger: {
    enabled: true,
    // Tuning 2 (24 Oct 2026, after playtests): no hordes, one zombie per full meter at every
    // level, and a reward for pushing on: more finds and more rare finds as danger rises.
    levels: [
      { noiseThreshold: 4, arrivals: 1, extraFinds: 0, rareFindWeight: 0.25, zombieHpBonus: 0 },
      { noiseThreshold: 4, arrivals: 1, extraFinds: 0, rareFindWeight: 0.5, zombieHpBonus: 0 },
      { noiseThreshold: 3, arrivals: 1, extraFinds: 1, rareFindWeight: 0.5, zombieHpBonus: 1 },
      { noiseThreshold: 3, arrivals: 1, extraFinds: 1, rareFindWeight: 1, zombieHpBonus: 1 },
    ],
    perPack: 1,
    perRareFind: 1,
    // Tuning 4 (25 Oct 2026, after a playtest where zombies got too easy): danger follows the
    // deck too, zombies get tougher from danger 3, and buildings roll their zombies when seen.
    perFindsTaken: 4,
    rollOnReveal: true,
    hordeSize: 0,
  },
  extraStartZombies: 0,
  zombieFollow: 'chase',
  hiddenDanger: true,
  randomCity: true,
  cityMap: 'large',
  hiddenBuildings: true,
  heavyLoadPerPack: 1,
  locationServiceCost: 1,
  // Tuning 3 (25 Oct 2026, after playtests): more deckbuilding within one run, and a reward
  // for killing zombies (search the body).
  findsToHand: true,
  bodyLootMax: 3,
  rareFindWeight: 0.25,
  // Tuning 5 (25 Oct 2026, user's call): no scrapping a card while choosing finds. Trashing is
  // done with Toolbox, Painkillers and the Dismantle / Patch up services.
  scrapInFinds: false,
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
