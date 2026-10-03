import type { Balance } from '../data/balance'

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
  | { readonly kind: 'damage'; readonly amount: number; readonly target: 'one' | 'allHere' }
  | { readonly kind: 'neutralize'; readonly target: 'one' | 'allHere' }
  | { readonly kind: 'block'; readonly amount: number }
  | { readonly kind: 'heal'; readonly amount: number }
  | { readonly kind: 'loseHp'; readonly amount: number }
  | { readonly kind: 'gainAp'; readonly amount: number }
  | { readonly kind: 'draw'; readonly amount: number }
  | { readonly kind: 'trashFromHand'; readonly filter: 'any' | 'junk' }
  | { readonly kind: 'scout'; readonly scope: 'one' | 'all'; readonly range?: number }
  | { readonly kind: 'burnBuilding' }

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
  readonly startZombies?: { readonly min: number; readonly max: number }
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
}

export interface Zombie {
  readonly uid: string
  readonly location: LocationId
  readonly hp: number
  /** It has seen the player and will follow one step. */
  readonly alerted: boolean
  /** Sneak, Alarm Clock or Soft Soles: it won't attack or notice you this turn. */
  readonly neutralized: boolean
}

/** A search waiting for the player to choose. */
export interface PendingFind {
  readonly location: LocationId
  readonly options: readonly CardId[]
  readonly packFound: boolean
  /** Noise from the search, added once the player has chosen. */
  readonly noise: number
}

export interface Content {
  readonly cards: Readonly<Record<CardId, CardDef>>
  readonly locations: Readonly<Record<LocationId, LocationDef>>
  /** Two-way connections between neighbouring locations. */
  readonly connections: readonly (readonly [LocationId, LocationId])[]
  readonly startLocation: LocationId
  /** The junk card added to the deck for each supply pack found (Heavy Load). */
  readonly packCard: CardId
}

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
  /** The noise meter. A zombie arrives every time it reaches the balance threshold. */
  readonly noise: number
  /** Places the player has been this expedition (hidden danger is revealed there). */
  readonly visited: readonly LocationId[]
  readonly outcome?: Outcome
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
    /** uid of a zombie at your location. */
    readonly zombie?: string
  }
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
      readonly reason: 'find' | 'pack'
    }
  | { readonly type: 'cardScrapped'; readonly uid: string; readonly card: CardId }
  | { readonly type: 'findDeclined' }
  | { readonly type: 'noiseAdded'; readonly amount: number; readonly total: number }
  | {
      readonly type: 'zombieArrived'
      readonly uid: string
      readonly location: LocationId
      readonly reason: 'noise' | 'dusk'
    }
  | {
      readonly type: 'zombieFollowed'
      readonly uid: string
      readonly from: LocationId
      readonly to: LocationId
    }
  | { readonly type: 'zombieLostTrack'; readonly uid: string }
  | { readonly type: 'zombieAttacked'; readonly uid: string; readonly damage: number }
  | { readonly type: 'damageBlocked'; readonly amount: number }
  | {
      readonly type: 'zombieHit'
      readonly uid: string
      readonly damage: number
      readonly hpLeft: number
    }
  | { readonly type: 'zombieKilled'; readonly uid: string }
  | { readonly type: 'zombieNeutralized'; readonly uid: string }
  | { readonly type: 'scouted'; readonly locations: readonly LocationId[] }
  | { readonly type: 'buildingBurned'; readonly location: LocationId }
  | { readonly type: 'apGained'; readonly amount: number }
  | { readonly type: 'healed'; readonly amount: number }
  | { readonly type: 'hpLost'; readonly amount: number }
  | { readonly type: 'cardTrashed'; readonly uid: string; readonly card: CardId }
  | { readonly type: 'searchBonusAdded'; readonly amount: number }
  | { readonly type: 'blockAdded'; readonly amount: number }
  | { readonly type: 'cardsKept'; readonly uids: readonly string[] }
  | { readonly type: 'turnEnded'; readonly turn: number }
  | { readonly type: 'gameOver'; readonly outcome: Outcome }

export type Validation = { readonly ok: true } | { readonly ok: false; readonly reason: string }

export interface StepResult {
  readonly state: GameState
  readonly events: readonly GameEvent[]
}
