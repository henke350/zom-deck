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
  | { readonly kind: 'scout'; readonly scope: 'one' | 'all' }
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

export interface Content {
  readonly cards: Readonly<Record<CardId, CardDef>>
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
  readonly hp: number
  readonly ap: number
  /** Extra finds on the next search this turn. */
  readonly searchBonus: number
  /** Damage prevented this turn. */
  readonly block: number
}

export interface Outcome {
  readonly result: 'won' | 'lost'
  readonly cause: 'home' | 'killed' | 'darkness'
}

export interface GameState {
  readonly seed: number
  /** State of the seeded random generator. All randomness goes through it. */
  readonly rng: number
  readonly balance: Balance
  readonly turn: number
  readonly phase: 'action' | 'gameOver'
  readonly player: PlayerState
  readonly piles: Piles
  readonly tagsPlayedThisTurn: readonly Tag[]
  readonly nextUid: number
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
  readonly target?: { readonly trash?: string }
}

export interface EndTurnAction {
  readonly type: 'endTurn'
  /** Unplayed cards to keep in hand for the next turn. */
  readonly keep?: readonly string[]
}

export type Action = PlayCardAction | EndTurnAction

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
