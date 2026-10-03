import { defaultContent } from '../data/content'
import { drawCards, withoutCard } from './deck'
import { activeEffects, freeMoveCost, isFollowUpActive, starsFor } from './rules'
import { chooseFind, performSearch } from './search'
import { validate } from './validate'
import type {
  Action,
  Content,
  Effect,
  EndTurnAction,
  FreeMoveAction,
  GameEvent,
  GameState,
  LocationId,
  Outcome,
  PlayCardAction,
  StepResult,
} from './types'

/**
 * Applies one action and returns the new state plus what happened.
 * Never mutates `state`. Throws if the action is illegal; call `validate` first.
 */
export function applyAction(
  state: GameState,
  action: Action,
  content: Content = defaultContent,
): StepResult {
  const validation = validate(state, action, content)
  if (!validation.ok) throw new Error(`Illegal action ${action.type}: ${validation.reason}`)

  const events: GameEvent[] = []
  switch (action.type) {
    case 'playCard':
      return { state: playCard(state, action, content, events), events }
    case 'freeMove':
      return { state: freeMove(state, action, content, events), events }
    case 'quickSearch': {
      const { cost, options } = state.balance.quickSearch
      const paid = { ...state, player: { ...state.player, ap: state.player.ap - cost } }
      const searched = performSearch(
        paid,
        content,
        { base: options, extra: 0, quick: true },
        events,
      )
      return { state: searched, events }
    }
    case 'takeFind':
      return { state: chooseFind(state, { take: action.card }, events), events }
    case 'scrapCard':
      return { state: chooseFind(state, { scrap: action.uid }, events), events }
    case 'declineFind':
      return { state: chooseFind(state, 'decline', events), events }
    case 'endTurn':
      return { state: endTurn(state, action, events), events }
  }
}

/** Draws up to a full hand and resets action points. Used at game start and after each turn. */
export function startTurn(state: GameState, events: GameEvent[]): GameState {
  const turn = state.turn + 1
  events.push({ type: 'turnStarted', turn })
  const started: GameState = {
    ...state,
    turn,
    phase: 'action',
    player: { ...state.player, ap: state.balance.apPerTurn, freeMoveUsed: false },
    tagsPlayedThisTurn: [],
  }
  return drawCards(started, state.balance.handSize - started.piles.hand.length, events)
}

function playCard(
  state: GameState,
  action: PlayCardAction,
  content: Content,
  events: GameEvent[],
): GameState {
  const instance = state.piles.hand.find((c) => c.uid === action.uid)
  const def = instance && content.cards[instance.card]
  const modeIndex = action.mode ?? 0
  const mode = def?.modes[modeIndex]
  if (!instance || !def || !mode) throw new Error('playCard: validated card is missing')

  const followUp = isFollowUpActive(state, mode)
  const effects = activeEffects(state, mode)
  const usedUp = mode.useUp === true

  // Pay, then move the card out of the hand before its effects run, so a
  // reshuffle caused by drawing can never include it.
  let next: GameState = {
    ...state,
    player: { ...state.player, ap: state.player.ap - def.cost },
    piles: {
      ...state.piles,
      hand: withoutCard(state.piles.hand, instance.uid),
      inPlay: usedUp ? state.piles.inPlay : [...state.piles.inPlay, instance],
      removed: usedUp ? [...state.piles.removed, instance] : state.piles.removed,
    },
  }
  events.push({
    type: 'cardPlayed',
    uid: instance.uid,
    card: instance.card,
    mode: modeIndex,
    followUp,
    usedUp,
  })

  for (const effect of effects) {
    next = resolveEffect(next, effect, action, instance.card, content, events)
    if (next.player.hp <= 0) return gameOver(next, { result: 'lost', cause: 'killed' }, events)
    if (next.phase === 'gameOver') return next
  }

  const tags = new Set([...next.tagsPlayedThisTurn, ...def.tags])
  return { ...next, tagsPlayedThisTurn: [...tags] }
}

function resolveEffect(
  state: GameState,
  effect: Effect,
  action: PlayCardAction,
  card: string,
  content: Content,
  events: GameEvent[],
): GameState {
  const { player, piles } = state
  switch (effect.kind) {
    case 'gainAp':
      events.push({ type: 'apGained', amount: effect.amount })
      return { ...state, player: { ...player, ap: player.ap + effect.amount } }
    case 'draw':
      return drawCards(state, effect.amount, events)
    case 'heal': {
      const hp = Math.min(state.balance.maxHp, player.hp + effect.amount)
      events.push({ type: 'healed', amount: hp - player.hp })
      return { ...state, player: { ...player, hp } }
    }
    case 'loseHp':
      events.push({ type: 'hpLost', amount: effect.amount })
      return { ...state, player: { ...player, hp: player.hp - effect.amount } }
    case 'searchBonus':
      events.push({ type: 'searchBonusAdded', amount: effect.amount })
      return { ...state, player: { ...player, searchBonus: player.searchBonus + effect.amount } }
    case 'block':
      events.push({ type: 'blockAdded', amount: effect.amount })
      return { ...state, player: { ...player, block: player.block + effect.amount } }
    case 'trashFromHand': {
      const target = piles.hand.find((c) => c.uid === action.target?.trash)
      if (!target) throw new Error('trashFromHand: validated target is missing')
      events.push({ type: 'cardTrashed', uid: target.uid, card: target.card })
      return {
        ...state,
        piles: {
          ...piles,
          hand: withoutCard(piles.hand, target.uid),
          removed: [...piles.removed, target],
        },
      }
    }
    case 'search':
      return performSearch(
        state,
        content,
        { base: state.balance.searchOptions, extra: effect.bonus ?? 0, quick: false },
        events,
      )
    case 'move': {
      const to = action.target?.location
      if (!to) throw new Error('move: validated destination is missing')
      // `unnoticed` (Soft Soles) is applied by the zombie rules when zombies arrive in M4.
      return arrive(state, to, card, 0, content, events)
    }
    default:
      throw new Error(`Effect "${effect.kind}" is not implemented yet`)
  }
}

function freeMove(
  state: GameState,
  action: FreeMoveAction,
  content: Content,
  events: GameEvent[],
): GameState {
  const cost = freeMoveCost(state, content)
  const paid: GameState = {
    ...state,
    player: { ...state.player, ap: state.player.ap - cost, freeMoveUsed: true },
  }
  return arrive(paid, action.to, 'free', cost, content, events)
}

/** Moves the player. Entering the shelter with enough packs wins at once. */
function arrive(
  state: GameState,
  to: LocationId,
  by: string,
  apCost: number,
  content: Content,
  events: GameEvent[],
): GameState {
  events.push({ type: 'moved', from: state.player.location, to, by, apCost })
  const moved: GameState = { ...state, player: { ...state.player, location: to } }
  const atShelter = content.locations[to]?.kind === 'shelter'
  if (atShelter && moved.player.packs >= state.balance.packsToWin) {
    const stars = starsFor(moved, moved.player.packs)
    return gameOver(moved, { result: 'won', cause: 'home', stars }, events)
  }
  return moved
}

function endTurn(state: GameState, action: EndTurnAction, events: GameEvent[]): GameState {
  const keep = new Set(action.keep ?? [])
  const kept = state.piles.hand.filter((c) => keep.has(c.uid))
  const discarded = state.piles.hand.filter((c) => !keep.has(c.uid))
  if (kept.length > 0) events.push({ type: 'cardsKept', uids: kept.map((c) => c.uid) })

  const cleaned: GameState = {
    ...state,
    player: { ...state.player, searchBonus: 0, block: 0 },
    piles: {
      ...state.piles,
      hand: kept,
      inPlay: [],
      discard: [...state.piles.discard, ...discarded, ...state.piles.inPlay],
    },
    tagsPlayedThisTurn: [],
  }
  events.push({ type: 'turnEnded', turn: state.turn })

  if (state.turn >= state.balance.turnLimit) {
    return gameOver(cleaned, { result: 'lost', cause: 'darkness' }, events)
  }
  return startTurn(cleaned, events)
}

function gameOver(state: GameState, outcome: Outcome, events: GameEvent[]): GameState {
  events.push({ type: 'gameOver', outcome })
  return { ...state, phase: 'gameOver', outcome }
}
