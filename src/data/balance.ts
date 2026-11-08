/**
 * All balance numbers in one place (decided in docs/plan.md, rounds 1–3).
 * Tune values here after playtests; rules code must never hard-code them.
 */

export type ZombieFollow = 'chase' | 'gentle' | 'off'

export type ZombieKind =
  | 'walker'
  | 'runner'
  | 'brute'
  | 'screamer'
  | 'spitter'
  | 'hound'
  | 'bloater'
  | 'sleeper'
  | 'bat'
  | 'boss'

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
  /** Spitter: each attack also poisons you this much (1 damage a turn, fading by 1 a turn). */
  readonly poison?: number
  /** Spitter: it also attacks from this many steps away once it has seen you, without moving. */
  readonly spit?: number
  /** Bloater: when it dies where you stand, it bursts and deals you this much damage. */
  readonly burst?: number
  /** Sleeper: starts asleep; wakes when it is hit or a full noise meter brings zombies to you. */
  readonly sleeps?: boolean
  /** Bat: flies; only shooting and fire can hit it (effects with `hitsFlying`, gear that shoots). */
  readonly flies?: boolean
}

/** The Stray Dog: a companion you can find. It bites, guards you, and smells supplies. */
export interface DogBalance {
  readonly hp: number
  /** Sic: once per turn, 0 AP, this much damage to a zombie where you stand. */
  readonly biteDamage: number
  /** Barking when it attacks. */
  readonly biteNoise: number
  /** Damage it takes for you in each zombie phase (after Block and gear). */
  readonly guardPerPhase: number
  /** Campaign: health it gets back each night. */
  readonly healPerNight: number
  /** Campaign: it eats 1 food every this many nights, or it runs away. */
  readonly foodEvery: number
}

/** Events of the day (inspired by Maximum Apocalypse's Day/Night cards). Texts in texts.en.ts. */
export type DayEventId =
  'quiet' | 'rain' | 'fullMoon' | 'foundMap' | 'restless' | 'supplyDrop' | 'cache' | 'fog'

/** What an event changes for the whole expedition. */
export type DayEventEffect =
  /** Every noise threshold (all danger levels) is this much higher. */
  | { readonly kind: 'noiseThreshold'; readonly amount: number }
  /** Dusk comes this many turns earlier. */
  | { readonly kind: 'duskEarlier'; readonly turns: number }
  /** This many buildings you cannot see yet are scouted at the start. */
  | { readonly kind: 'scout'; readonly count: number }
  /** More start zombies in every building. */
  | { readonly kind: 'extraStartZombies'; readonly amount: number }
  /** More supply packs in the city. */
  | { readonly kind: 'extraPacks'; readonly amount: number }
  /** These cards go into your start deck. */
  | { readonly kind: 'startCards'; readonly cards: readonly string[] }
  /** Zombies follow this many steps more (negative: fewer, at least 0). */
  | { readonly kind: 'followSteps'; readonly amount: number }

export interface DayEvent {
  readonly id: DayEventId
  /** How often it comes up, relative to the others. */
  readonly weight: number
  readonly effects: readonly DayEventEffect[]
}

/** What you can build at the base between campaign days (texts in texts.en.ts). */
export type UpgradeId =
  'lookout' | 'workbench' | 'infirmary' | 'locker' | 'rainCollector' | 'garden'

/**
 * Version 2: a campaign of days (docs/plan.md, section 12). Each day is one expedition in the
 * same city; in the evening you eat and drink, then build on the base with materials.
 */
export interface CampaignBalance {
  readonly days: number
  /** Eaten and drunk every evening. */
  readonly foodPerNight: number
  readonly waterPerNight: number
  /** No food in the evening: this many extra Nerves in the next expedition. */
  readonly hungerNerves: number
  /** No water in the evening: the next expedition starts with this much less health. */
  readonly thirstHp: number
  /** Killed or caught by the dark: today's finds are lost and tomorrow starts with Wounds. */
  readonly woundsAfterLoss: number
  /** How many lost days you can survive; one more ends the campaign. */
  readonly lossesAllowed: number
  /** Packs you need to go home at the end of a day (0: you may go home empty-handed). */
  readonly packsToGoHome: number
  /** More start zombies in every building as the days go by (day 1 first; last value repeats). */
  readonly extraZombiesByDay: readonly number[]
  readonly startFood: number
  readonly startWater: number
  /** Materials each upgrade costs. */
  readonly upgradeCost: Readonly<Record<UpgradeId, number>>
  /** Lookout: buildings scouted at the start of each expedition. */
  readonly lookoutBuildings: number
  /** Workbench: Nerves taken out of the start deck. */
  readonly workbenchNerves: number
  /** Infirmary: extra health (and maximum health) in every expedition. */
  readonly infirmaryHp: number
  /** Rain Collector and Garden produce 1 every this many nights. */
  readonly productionEvery: number
  /** Searches a plundered building gets back each night (others move in, things wash up). */
  readonly searchesRegrowPerNight: number
  /** Today's mission, day 1 first (the last value repeats). Missions are optional. */
  readonly missions: readonly MissionKind[]
  /** What a mission done brings when you get home. */
  readonly missionReward: Readonly<Record<MissionKind, MissionReward>>
  /** Allies at the base: who goes out, what the others do at home, and the night raids. */
  readonly allies: CampaignAllyBalance
}

/** What an ally who stays at the base does (keyed by card id in `campaign.allies.jobs`). */
export type AllyJob =
  /** Today's expedition: this many fewer Wounds in the deck and this much more health. */
  | { readonly kind: 'heal'; readonly hp: number; readonly wounds: number }
  /** Tonight: no night raid. */
  | { readonly kind: 'guard' }
  /** Today's expedition: this many more buildings are scouted from the start. */
  | { readonly kind: 'scout'; readonly buildings: number }
  /** Tonight: this much food, every `every` nights. */
  | { readonly kind: 'forage'; readonly food: number; readonly every: number }
  /** Tonight: this many materials. */
  | { readonly kind: 'build'; readonly materials: number }

export interface CampaignAllyBalance {
  /** Allies you can take on one expedition. */
  readonly maxAlong: number
  /** Every ally eats 1 food every this many nights, or leaves. */
  readonly foodEvery: number
  readonly jobs: Readonly<Record<string, AllyJob>>
  /** A night raid takes this much food and water, unless someone stands guard. */
  readonly raid: { readonly chance: number; readonly food: number; readonly water: number }
}

/**
 * Campaign missions (inspired by Maximum Apocalypse's scenarios): rescue (reach the marked
 * building), clear (stand in it with no zombies there) and boss (kill the boss waiting in it).
 */
export type MissionKind = 'rescue' | 'clear' | 'boss'

export interface MissionReward {
  readonly food: number
  readonly water: number
  readonly materials: number
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
  /** The first this many packs you find do not raise danger (a calm start). */
  readonly calmPacks: number
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
  /** What special places do (see `PlaceFeature` on a location). */
  readonly places: {
    /** Hospital: end your turn here and get this much health back (cures poison too). */
    readonly infirmaryHeal: number
    /** Police: bullets you find the first time you go in. */
    readonly armoryAmmo: number
    /** Petrol station: extra finds this turn the first time you go in. */
    readonly fuelSearchBonus: number
    /** Apartments: a trap the first time you go in. */
    readonly trapDamage: number
    /** Church: noise that dies down when you end your turn here. */
    readonly sanctuaryQuiet: number
  }
  /** Bullets for guns (Pistol, Shotgun, Head Shot): at the start, per Ammunition find, at most. */
  readonly ammo: { readonly start: number; readonly perFind: number; readonly max: number }
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
  readonly dog: DogBalance
  /** One event at the start of every expedition (and campaign day). */
  readonly events: { readonly enabled: boolean; readonly options: readonly DayEvent[] }
  /** Who you play: each survivor changes the start deck a little and has one ability. */
  readonly survivors: readonly Survivor[]
  readonly campaign: CampaignBalance
}

export type SurvivorId = 'scavenger' | 'firefighter' | 'hunter' | 'medic' | 'mechanic'

export interface Survivor {
  readonly id: SurvivorId
  /** Start deck changes: each swap turns one `from` card into a `to` card. */
  readonly swaps: readonly { readonly from: string; readonly to: string }[]
  /** Extra maximum health. */
  readonly maxHp?: number
  /** Every heal from a card heals this much more. */
  readonly healBonus?: number
  /** Buildings you see (zombies and pack) from the start. */
  readonly scout?: number
  /** Gear you put on lasts this much longer (absorbs, turns or uses). */
  readonly gearBonus?: number
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
    // New kinds instead of tougher zombies (inspired by Maximum Apocalypse, 3 Nov 2026).
    spitter: { hp: 1, damage: 1, followSteps: 0, screamNoise: 0, loot: 0.5, poison: 1, spit: 1 },
    hound: { hp: 1, damage: 1, followSteps: 3, screamNoise: 0, loot: 0 },
    bloater: { hp: 3, damage: 1, followSteps: 1, screamNoise: 0, loot: 1, burst: 2 },
    sleeper: { hp: 3, damage: 2, followSteps: 1, screamNoise: 0, loot: 1, sleeps: true },
    bat: { hp: 1, damage: 1, followSteps: 2, screamNoise: 0, loot: 0, flies: true },
    // Campaign only: the boss of a mission. It never leaves its building.
    boss: { hp: 7, damage: 2, followSteps: 0, screamNoise: 0, loot: 3 },
  },
  danger: {
    enabled: true,
    // Tuning 2 (24 Oct 2026, after playtests): no hordes, one zombie per full meter at every
    // level, and a reward for pushing on: more finds and more rare finds as danger rises.
    levels: [
      { noiseThreshold: 4, arrivals: 1, extraFinds: 0, rareFindWeight: 0.25, zombieHpBonus: 0 },
      { noiseThreshold: 4, arrivals: 1, extraFinds: 0, rareFindWeight: 0.5, zombieHpBonus: 0 },
      { noiseThreshold: 3, arrivals: 1, extraFinds: 1, rareFindWeight: 0.5, zombieHpBonus: 0 },
      { noiseThreshold: 3, arrivals: 2, extraFinds: 1, rareFindWeight: 1, zombieHpBonus: 0 },
    ],
    // Tuning 7 (30 Oct 2026, user's call): zombies never get more health; at the top level more
    // of them come instead (2 per full noise meter). About as hard as before.
    perPack: 1,
    // Tuning 6 (25 Oct 2026, user's call): the first pack you find does not raise danger.
    calmPacks: 1,
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
  // Special places (inspired by Maximum Apocalypse's map tiles).
  places: { infirmaryHeal: 1, armoryAmmo: 3, fuelSearchBonus: 1, trapDamage: 1, sanctuaryQuiet: 1 },
  // Guns need bullets (inspired by Maximum Apocalypse): a scarce resource, not a free card.
  ammo: { start: 3, perFind: 3, max: 9 },
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
  // Events of the day (3 Nov 2026, inspired by Maximum Apocalypse): every expedition differs.
  events: {
    enabled: true,
    options: [
      { id: 'quiet', weight: 3, effects: [] },
      { id: 'rain', weight: 1, effects: [{ kind: 'noiseThreshold', amount: 1 }] },
      { id: 'fullMoon', weight: 1, effects: [{ kind: 'duskEarlier', turns: 1 }] },
      { id: 'foundMap', weight: 1, effects: [{ kind: 'scout', count: 2 }] },
      { id: 'restless', weight: 1, effects: [{ kind: 'extraStartZombies', amount: 1 }] },
      { id: 'supplyDrop', weight: 1, effects: [{ kind: 'extraPacks', amount: 1 }] },
      { id: 'cache', weight: 1, effects: [{ kind: 'startCards', cards: ['pistol'] }] },
      { id: 'fog', weight: 1, effects: [{ kind: 'followSteps', amount: -1 }] },
    ],
  },
  // The Stray Dog (25 Oct 2026, the user's idea): it fights, takes hits for you and can die.
  dog: {
    hp: 3,
    biteDamage: 1,
    biteNoise: 1,
    guardPerPhase: 1,
    healPerNight: 1,
    foodEvery: 2,
  },
  // Version 2, K1–K2 (25 Oct 2026): first numbers from docs/plan.md section 12, to be tuned
  // with campaign simulations and playtests.
  // Survivors (3 Nov 2026, inspired by Maximum Apocalypse): the Scavenger is the classic start.
  survivors: [
    { id: 'scavenger', swaps: [] },
    { id: 'firefighter', swaps: [{ from: 'crowbar', to: 'axe' }], maxHp: 2 },
    { id: 'hunter', swaps: [{ from: 'crowbar', to: 'bow' }], scout: 1 },
    {
      id: 'medic',
      swaps: [
        { from: 'nerves', to: 'bandage' },
        { from: 'nerves', to: 'painkillers' },
      ],
      healBonus: 1,
    },
    { id: 'mechanic', swaps: [{ from: 'nerves', to: 'flashlight' }], gearBonus: 1 },
  ],
  campaign: {
    days: 7,
    foodPerNight: 1,
    waterPerNight: 1,
    hungerNerves: 1,
    thirstHp: 2,
    woundsAfterLoss: 1,
    lossesAllowed: 2,
    packsToGoHome: 0,
    extraZombiesByDay: [0, 0, 0, 1, 1, 1, 2],
    startFood: 0,
    startWater: 0,
    upgradeCost: {
      lookout: 2,
      workbench: 3,
      infirmary: 3,
      locker: 4,
      rainCollector: 4,
      garden: 6,
    },
    lookoutBuildings: 2,
    workbenchNerves: 1,
    infirmaryHp: 2,
    productionEvery: 2,
    // First campaign simulation (25 Oct 2026): with no regrowth and one lost day allowed, no bot
    // survived 7 days; with these values 10–63 % do (players can also go home early).
    searchesRegrowPerNight: 1,
    // Missions (3 Nov 2026): a reason to go somewhere new every day, and a boss near the end.
    missions: ['rescue', 'clear', 'rescue', 'clear', 'rescue', 'boss', 'clear'],
    missionReward: {
      rescue: { food: 1, water: 0, materials: 1 },
      clear: { food: 0, water: 1, materials: 1 },
      boss: { food: 1, water: 1, materials: 3 },
    },
    // Allies at the base (8 Nov 2026, the user's idea): take them along (they can be knocked
    // out and must rest a day; lose the day and they are gone) or keep them home for a job.
    allies: {
      maxAlong: 2,
      foodEvery: 2,
      jobs: {
        nurse: { kind: 'heal', hp: 1, wounds: 1 },
        soldier: { kind: 'guard' },
        scout: { kind: 'scout', buildings: 2 },
        streetKid: { kind: 'forage', food: 1, every: 2 },
        bouncer: { kind: 'build', materials: 1 },
      },
      raid: { chance: 0.25, food: 1, water: 1 },
    },
  },
}

export function starterDeckSize(b: Balance): number {
  return Object.values(b.starterDeck).reduce((sum, count) => sum + count, 0)
}
