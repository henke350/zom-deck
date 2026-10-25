import type { Balance, ZombieKind } from '../data/balance'

export type { ZombieKind }

/** A weighted choice of zombie kinds (relative chances). */
export type ZombieMix = readonly { readonly kind: ZombieKind; readonly weight: number }[]

export type CardId = string

export type Tag = 'quiet' | 'weapon' | 'move' | 'tool' | 'med'

/**
 * What a card does. The engine resolves effects in the order they are listed.
 * Search noise comes from the balance file; extra noise is set on the card mode.
 */
export type Effect =
  | { readonly kind: 'search'; readonly bonus?: number; readonly silent?: boolean }
  | { readonly kind: 'searchBonus'; readonly amount: number }
  | { readonly kind: 'move'; readonly maxSteps: number; readonly unnoticed?: boolean }
  | {
      readonly kind: 'damage'
      readonly amount: number
      readonly target: 'one' | 'allHere'
      /** Bow: a single target may also stand this many steps away (where you can see zombies). */
      readonly range?: number
    }
  | { readonly kind: 'neutralize'; readonly target: 'one' | 'allHere' }
  | { readonly kind: 'block'; readonly amount: number }
  | { readonly kind: 'heal'; readonly amount: number }
  | { readonly kind: 'loseHp'; readonly amount: number }
  | { readonly kind: 'gainAp'; readonly amount: number }
  | { readonly kind: 'draw'; readonly amount: number }
  | { readonly kind: 'trashFromHand'; readonly filter: 'any' | 'junk' }
  | { readonly kind: 'scout'; readonly scope: 'one' | 'all'; readonly range?: number }
  | { readonly kind: 'burnBuilding' }
  /** Gear: the card stays in front of you (see `CardDef.gear`) instead of being discarded. */
  | { readonly kind: 'equip' }
  /** Kills one zombie here outright, whatever its health. `unaware`: only one that has not seen you. */
  | { readonly kind: 'kill'; readonly target: 'one'; readonly unaware?: boolean }

/** What a piece of gear does while it lies in front of you. */
export type GearEffect =
  /** Takes up to this much damage in each zombie phase (after Block). */
  | { readonly kind: 'absorb'; readonly perPhase: number }
  /** Your free move may go this many steps. */
  | { readonly kind: 'freeMoveSteps'; readonly steps: number }
  /** Every search reveals this many more finds. */
  | { readonly kind: 'searchBonus'; readonly amount: number }
  /** Crossbow: pay `cost` AP to deal `damage` to one zombie up to `range` steps away. */
  | {
      readonly kind: 'shoot'
      readonly damage: number
      readonly range: number
      readonly cost: number
    }

/** When a piece of gear goes to the discard pile. */
export type GearLasts =
  /** After it has taken this much damage in all. */
  | { readonly kind: 'absorbs'; readonly total: number }
  /** As soon as a zombie hurts you. */
  | { readonly kind: 'untilHit' }
  /** After this many of your turns, counting the turn you put it on. */
  | { readonly kind: 'turns'; readonly turns: number }
  /** After you have used it this many times (Crossbow bolts). */
  | { readonly kind: 'uses'; readonly uses: number }

export interface GearDef {
  readonly effect: GearEffect
  readonly lasts: GearLasts
}

export type EffectKind = Effect['kind']

export interface CardMode {
  readonly effects: readonly Effect[]
  /** Extra noise on top of the noise the effects make. */
  readonly noise?: number
  /** "Use up": the card is removed from the game when played in this mode. */
  readonly useUp?: boolean
  /** "Follow-up": these effects replace `effects` if a card with `tag` was played earlier this turn. */
  readonly followUp?: { readonly tag: Tag; readonly effects: readonly Effect[] }
}

export type CardCondition = { readonly kind: 'ownedAtMost'; readonly count: number }

export interface CardDef {
  readonly id: CardId
  readonly kind: 'action' | 'junk'
  readonly cost: number
  readonly tags: readonly Tag[]
  /** Ways to play the card. Junk cards have none. */
  readonly modes: readonly CardMode[]
  readonly trashable: boolean
  /** The card can only be played while this holds. */
  readonly requires?: CardCondition
  /** Heavy Load: while this card is in hand, the free move costs this much AP. */
  readonly freeMoveCostWhileInHand?: number
  /** A rare find: seldom in searches, always in locked stashes. */
  readonly rare?: boolean
  /** Gear: what the card does while it lies in front of you, and how long it lasts. */
  readonly gear?: GearDef
}

export type LocationId = string

export interface LocationDef {
  readonly id: LocationId
  /** Shelter: start and goal, safe. Street: a hub with nothing to search. Building: can be searched. */
  readonly kind: 'shelter' | 'street' | 'building'
  /** Position on the city map (SVG units, 640 × 400). */
  readonly mapPos: { readonly x: number; readonly y: number }
  /** Cards a search here can reveal, with relative weights. Buildings only. */
  readonly lootPool?: readonly LootEntry[]
  /** This building always holds a supply pack (the Supermarket). */
  readonly alwaysHasPack?: boolean
  /** Zombies here at the start, rolled between min and max. Shown as a range until you visit. */
  readonly startZombies?: {
    readonly min: number
    readonly max: number
    /** Which kinds start here. Default: only Walkers. */
    readonly kinds?: ZombieMix
  }
  /** Something you can do here for AP (Workshop: Dismantle, Pharmacy: Patch up). */
  readonly service?: LocationService
  /** An empty building slot on a bigger map: a random city always puts a building here. */
  readonly slot?: boolean
  /**
   * Downtown: on a slot, the far, rich part of a bigger map; on a building, it belongs there.
   * A random city puts downtown buildings in downtown slots first.
   */
  readonly downtown?: boolean
}

export type ServiceId = 'dismantle' | 'patchUp'

/** A location service trashes one card from your hand. `junk`: only Nerves and Wound. */
export interface LocationService {
  readonly id: ServiceId
  readonly filter: 'any' | 'junk'
}

export interface LootEntry {
  readonly card: CardId
  readonly weight: number
}

/** What a building looks like during an expedition. */
export interface SiteState {
  readonly searchesLeft: number
  /** A supply pack is still hidden here. It is found by the next search. */
  readonly hasPack: boolean
  /** A supply pack was found here this expedition. */
  readonly packTaken: boolean
  /** District Map showed the exact zombies and whether a pack is hidden here. */
  readonly scouted: boolean
  /** A Molotov burned it: it can't be searched again. */
  readonly burned: boolean
  /** A locked stash with rare finds: hidden until the first search, then found, then opened. */
  readonly stash: StashState
}

/** none: no stash here. lost: it burned with the building. */
export type StashState = 'none' | 'hidden' | 'found' | 'opened' | 'lost'

export interface Zombie {
  readonly uid: string
  readonly kind: ZombieKind
  readonly location: LocationId
  readonly hp: number
  /** It has seen the player and will follow one step. */
  readonly alerted: boolean
  /** Sneak, Alarm Clock or Soft Soles: it won't attack or notice you this turn. */
  readonly neutralized: boolean
  /**
   * A start zombie in a building you have not seen inside yet: its kind is rolled again when
   * you first enter or scout the building, at the danger level of that moment.
   */
  readonly rollOnReveal?: boolean
}

/** A search waiting for the player to choose. */
export interface PendingFind {
  readonly location: LocationId
  readonly options: readonly CardId[]
  readonly packFound: boolean
  /** Noise from the search, added once the player has chosen. */
  readonly noise: number
  /** The finds come from an opened stash, not a search. */
  readonly fromStash?: boolean
  /** The finds come from the bodies of zombies you just killed. */
  readonly fromBody?: boolean
  /** This search also uncovered a locked stash. */
  readonly stashFound?: boolean
}

export interface Content {
  readonly cards: Readonly<Record<CardId, CardDef>>
  readonly locations: Readonly<Record<LocationId, LocationDef>>
  /** Two-way connections between neighbouring locations. */
  readonly connections: readonly (readonly [LocationId, LocationId])[]
  readonly startLocation: LocationId
  /** The junk card added to the deck for each supply pack found (Heavy Load). */
  readonly packCard: CardId
  /** The junk card added by a heavy zombie attack when the Wound variant is on. */
  readonly woundCard: CardId
  /** The kinds of zombie that noise and dusk bring. Default: only Walkers. */
  readonly arrivals?: {
    readonly noise: ZombieMix
    readonly dusk: ZombieMix
    /** With the danger meter: what noise, screams and hordes bring at each level (level 1 first). */
    readonly byDanger?: readonly ZombieMix[]
  }
  /** What zombies carry: the pool a body search draws from (see `ZombieStats.loot`). */
  readonly bodyLoot?: readonly LootEntry[]
  /**
   * More buildings that a random city can use instead of the ones on the classic map.
   * Their map position comes from the building slot they are placed in.
   */
  readonly extraBuildings?: Readonly<Record<LocationId, Omit<LocationDef, 'mapPos'>>>
  /**
   * A bigger city (`balance.cityMap: 'large'`): its own roads and empty building slots. A
   * random city fills every slot with a building from the classic map and `extraBuildings`.
   */
  readonly largeMap?: {
    readonly locations: Readonly<Record<LocationId, LocationDef>>
    readonly connections: readonly (readonly [LocationId, LocationId])[]
  }
}

/**
 * A random city: which building stands in each building slot of the classic map. Slots are
 * named after the classic building that stands there (e.g. the "police" slot is top right).
 */
export type City = Readonly<Record<LocationId, LocationId>>

/** One physical card. Two copies of the same card have different uids. */
export interface CardInstance {
  readonly uid: string
  readonly card: CardId
}

export interface Piles {
  readonly draw: readonly CardInstance[]
  readonly hand: readonly CardInstance[]
  /** Cards played this turn. They go to the discard pile when the turn ends. */
  readonly inPlay: readonly CardInstance[]
  readonly discard: readonly CardInstance[]
  /** Used-up and trashed cards. They never come back. */
  readonly removed: readonly CardInstance[]
  /** Gear in front of you. It goes to the discard pile when it wears out. */
  readonly gear: readonly CardInstance[]
}

export interface PlayerState {
  readonly location: LocationId
  readonly hp: number
  readonly ap: number
  /** The free move (one step) has been used this turn. */
  readonly freeMoveUsed: boolean
  /** Supply packs carried. */
  readonly packs: number
  /** Extra finds on the next search this turn. */
  readonly searchBonus: number
  /** Damage prevented this turn. */
  readonly block: number
}

export interface Outcome {
  readonly result: 'won' | 'lost'
  readonly cause: 'home' | 'killed' | 'darkness'
  /** 1–3 stars when won. */
  readonly stars?: number
}

export interface GameState {
  readonly seed: number
  /** State of the seeded random generator. All randomness goes through it. */
  readonly rng: number
  readonly balance: Balance
  readonly turn: number
  /** chooseFind: a search revealed finds and the player must take, scrap or decline. */
  readonly phase: 'action' | 'chooseFind' | 'gameOver'
  readonly player: PlayerState
  readonly piles: Piles
  /** Buildings only: searches left and hidden packs. */
  readonly sites: Readonly<Record<LocationId, SiteState>>
  readonly pendingFind?: PendingFind
  readonly tagsPlayedThisTurn: readonly Tag[]
  readonly nextUid: number
  readonly zombies: readonly Zombie[]
  readonly nextZombieUid: number
  /** The noise meter. Zombies arrive every time it reaches the threshold of the danger level. */
  readonly noise: number
  /** The danger meter, from 1. Rises with packs and rare finds (see `balance.danger`). */
  readonly danger: number
  /** For each piece of gear in front of you: damage it can still take, or turns it has left. */
  readonly gearLeft: Readonly<Record<string, number>>
  /** Places the player has been this expedition (hidden danger is revealed there). */
  readonly visited: readonly LocationId[]
  /** The buildings of this city and where they stand. Absent: the classic map. */
  readonly city?: City
  /** Running totals for the end screen. Updated from the events of every action. */
  readonly stats: Stats
  readonly outcome?: Outcome
}

export interface Stats {
  readonly startHp: number
  /** Cards in the deck at the start. */
  readonly startCards: number
  readonly steps: number
  readonly searches: number
  readonly packsFound: number
  /** Finds taken, in order. */
  readonly cardsTaken: readonly CardId[]
  /** Cards trashed, scrapped or used up. */
  readonly cardsRemoved: number
  readonly healed: number
  /** Health lost to zombie attacks, after Block. */
  readonly damageFromZombies: number
  /** Health lost to your own cards (Adrenaline). */
  readonly damageFromCards: number
  /** Damage kept off you by Block and gear (Kevlar Vest). */
  readonly damageBlocked: number
  readonly attacksByFollowers: number
  readonly attacksByZombiesThere: number
  readonly noiseMade: number
  readonly zombiesFromNoise: number
  readonly zombiesFromDusk: number
  /** Zombies brought by Screamers' noise. */
  readonly zombiesFromScreams: number
  /** Zombies brought by the danger meter's hordes. */
  readonly zombiesFromHordes: number
  /** Body searches after killing zombies. */
  readonly bodiesSearched: number
  /** The highest danger level reached. */
  readonly dangerReached: number
  readonly zombiesKilled: number
  /** Wound variant: Wounds added by heavy attacks. */
  readonly woundsGained: number
  readonly stashesOpened: number
}

/** The outcome of one expedition. The version-2 campaign builds on this. */
export interface ExpeditionResult {
  readonly outcome: Outcome
  readonly packs: number
  readonly hpLeft: number
  readonly turnsUsed: number
  readonly cardsFound: readonly CardId[]
  readonly stats: Stats
}

/** How an expedition starts. The version-2 campaign fills this in from the base. */
export interface ExpeditionSetup {
  readonly startDeck?: readonly CardId[]
  readonly startHp?: number
}

export interface PlayCardAction {
  readonly type: 'playCard'
  readonly uid: string
  /** Index into the card's modes. Defaults to 0. */
  readonly mode?: number
  readonly target?: {
    readonly trash?: string
    readonly location?: LocationId
    /** uid of a zombie at your location (or in range, for ranged weapons). */
    readonly zombie?: string
  }
}

/** Use a piece of gear in front of you (the Crossbow). */
export interface UseGearAction {
  readonly type: 'useGear'
  readonly uid: string
  readonly target?: PlayCardAction['target']
}

export interface FreeMoveAction {
  readonly type: 'freeMove'
  readonly to: LocationId
}

/** Search without a card: costs more AP and reveals fewer finds. */
export interface QuickSearchAction {
  readonly type: 'quickSearch'
}

export interface TakeFindAction {
  readonly type: 'takeFind'
  readonly card: CardId
}

/** Instead of taking a find, remove a card from your hand for good. */
export interface ScrapCardAction {
  readonly type: 'scrapCard'
  readonly uid: string
}

/** Open the locked stash where you stand: with a Tool card from hand, or by force (more AP, noise). */
export interface OpenStashAction {
  readonly type: 'openStash'
  /** A Tool card used to open it. Without it, the stash is forced open. */
  readonly uid?: string
}

/** Use the service where you stand (Dismantle, Patch up) on a card in your hand. */
export interface UseServiceAction {
  readonly type: 'useService'
  readonly uid: string
}

export interface DeclineFindAction {
  readonly type: 'declineFind'
}

export interface EndTurnAction {
  readonly type: 'endTurn'
  /** Unplayed cards to keep in hand for the next turn. */
  readonly keep?: readonly string[]
}

export type Action =
  | PlayCardAction
  | FreeMoveAction
  | QuickSearchAction
  | TakeFindAction
  | ScrapCardAction
  | DeclineFindAction
  | UseServiceAction
  | OpenStashAction
  | UseGearAction
  | EndTurnAction

export type GameEvent =
  | { readonly type: 'turnStarted'; readonly turn: number }
  | { readonly type: 'deckShuffled' }
  | { readonly type: 'cardsDrawn'; readonly uids: readonly string[] }
  | {
      readonly type: 'cardPlayed'
      readonly uid: string
      readonly card: CardId
      readonly mode: number
      readonly followUp: boolean
      readonly usedUp: boolean
    }
  | {
      readonly type: 'moved'
      readonly from: LocationId
      readonly to: LocationId
      /** Free move, or the card that moved you. */
      readonly by: 'free' | CardId
      readonly apCost: number
    }
  | {
      readonly type: 'searched'
      readonly location: LocationId
      readonly options: readonly CardId[]
      readonly quick: boolean
    }
  | { readonly type: 'packFound'; readonly location: LocationId; readonly packs: number }
  | {
      readonly type: 'cardGained'
      readonly uid: string
      readonly card: CardId
      readonly reason: 'find' | 'pack' | 'wound'
    }
  | { readonly type: 'cardScrapped'; readonly uid: string; readonly card: CardId }
  | { readonly type: 'findDeclined' }
  | {
      readonly type: 'noiseAdded'
      readonly amount: number
      readonly total: number
      readonly reason: NoiseReason
    }
  | { readonly type: 'zombieScreamed'; readonly uid: string; readonly noise: number }
  | { readonly type: 'dangerRose'; readonly level: number; readonly reason: DangerReason }
  | { readonly type: 'zombiesToughened'; readonly amount: number }
  | {
      readonly type: 'zombieArrived'
      readonly uid: string
      readonly kind: ZombieKind
      readonly location: LocationId
      readonly reason: NoiseReason
    }
  | {
      readonly type: 'zombieFollowed'
      readonly uid: string
      readonly from: LocationId
      readonly to: LocationId
    }
  | { readonly type: 'zombieLostTrack'; readonly uid: string }
  | {
      readonly type: 'zombieAttacked'
      readonly uid: string
      readonly damage: number
      /** It followed you this zombie phase. */
      readonly followed: boolean
    }
  | { readonly type: 'damageBlocked'; readonly amount: number }
  | {
      readonly type: 'zombieHit'
      readonly uid: string
      readonly damage: number
      readonly hpLeft: number
    }
  | { readonly type: 'zombieKilled'; readonly uid: string }
  | { readonly type: 'bodySearched'; readonly options: readonly CardId[] }
  | { readonly type: 'gearEquipped'; readonly uid: string; readonly card: CardId }
  | { readonly type: 'gearUsed'; readonly uid: string; readonly card: CardId }
  | { readonly type: 'gearAbsorbed'; readonly uid: string; readonly amount: number }
  | {
      readonly type: 'gearLost'
      readonly uid: string
      readonly card: CardId
      readonly reason: GearLasts['kind']
    }
  | { readonly type: 'zombieNeutralized'; readonly uid: string }
  | { readonly type: 'scouted'; readonly locations: readonly LocationId[] }
  | { readonly type: 'buildingBurned'; readonly location: LocationId }
  | { readonly type: 'apGained'; readonly amount: number }
  | { readonly type: 'healed'; readonly amount: number }
  | { readonly type: 'hpLost'; readonly amount: number; readonly source: 'zombies' | 'card' }
  | { readonly type: 'cardTrashed'; readonly uid: string; readonly card: CardId }
  | { readonly type: 'serviceUsed'; readonly service: ServiceId; readonly location: LocationId }
  | { readonly type: 'stashFound'; readonly location: LocationId }
  | {
      readonly type: 'stashOpened'
      readonly location: LocationId
      /** The Tool card used, or 'force'. */
      readonly by: CardId | 'force'
      readonly options: readonly CardId[]
    }
  | { readonly type: 'searchBonusAdded'; readonly amount: number }
  | { readonly type: 'blockAdded'; readonly amount: number }
  | { readonly type: 'cardsKept'; readonly uids: readonly string[] }
  | { readonly type: 'turnEnded'; readonly turn: number }
  | { readonly type: 'gameOver'; readonly outcome: Outcome }

/** Where noise comes from: the player, dusk, or a Screamer that has seen the player. */
export type NoiseReason = 'noise' | 'dusk' | 'scream' | 'horde'

export type DangerReason = 'pack' | 'rare' | 'deck'

export type Validation = { readonly ok: true } | { readonly ok: false; readonly reason: string }

export interface StepResult {
  readonly state: GameState
  readonly events: readonly GameEvent[]
}
