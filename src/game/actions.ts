import { defaultContent } from '../data/content'
import { texts } from '../data/texts.en'
import { activeEffects, moveStepsOf, needsZombieTarget, scoutRangeOf, trashFilterOf } from './rules'
import { zombiesAt } from './zombies'
import { validate } from './validate'
import type { Action, CardMode, Content, GameState, LocationId, PlayCardAction } from './types'

/** What a card mode needs the player to pick before it can be played. */
export type TargetKind = 'location' | 'trash' | 'zombie' | undefined

export function targetKindOf(state: GameState, mode: CardMode): TargetKind {
  const effects = activeEffects(state, mode)
  if (trashFilterOf(effects)) return 'trash'
  if (needsZombieTarget(effects)) return 'zombie'
  if (moveStepsOf(effects) !== undefined || scoutRangeOf(effects) !== undefined) return 'location'
  return undefined
}

/** Every way to play one card in one mode, valid or not (targets filled in). */
function candidatesFor(
  state: GameState,
  uid: string,
  modeIndex: number,
  mode: CardMode,
  content: Content,
): PlayCardAction[] {
  const base = { type: 'playCard', uid, mode: modeIndex } as const
  switch (targetKindOf(state, mode)) {
    case 'trash':
      return state.piles.hand
        .filter((target) => target.uid !== uid)
        .map((target) => ({ ...base, target: { trash: target.uid } }))
    case 'location':
      return Object.keys(content.locations).map((location) => ({ ...base, target: { location } }))
    case 'zombie':
      return zombiesAt(state, state.player.location).map((z) => ({
        ...base,
        target: { zombie: z.uid },
      }))
    default:
      return [base]
  }
}

/**
 * Every legal action right now. Used by tests, the UI and, later, by the
 * bots (M6).
 */
export function listActions(state: GameState, content: Content = defaultContent): Action[] {
  if (state.phase === 'gameOver') return []
  const candidates: Action[] = []
  const { hand } = state.piles

  for (const card of hand) {
    const def = content.cards[card.card]
    def?.modes.forEach((mode, modeIndex) => {
      candidates.push(...candidatesFor(state, card.uid, modeIndex, mode, content))
    })
  }

  for (const to of Object.keys(content.locations)) candidates.push({ type: 'freeMove', to })
  candidates.push({ type: 'quickSearch' })

  for (const card of state.pendingFind?.options ?? []) candidates.push({ type: 'takeFind', card })
  for (const card of hand) candidates.push({ type: 'scrapCard', uid: card.uid })
  candidates.push({ type: 'declineFind' })
  for (const card of hand) candidates.push({ type: 'useService', uid: card.uid })

  candidates.push({ type: 'endTurn' })
  if (state.balance.keepCards > 0) {
    for (const card of hand) candidates.push({ type: 'endTurn', keep: [card.uid] })
  }

  return candidates.filter((action) => validate(state, action, content).ok)
}

export interface ModeOption {
  readonly mode: number
  readonly target: TargetKind
  /** Legal ways to play this mode. Empty when it can't be played. */
  readonly actions: readonly PlayCardAction[]
  /** Why it can't be played, when `actions` is empty. */
  readonly reason?: string
}

/** For the UI: how each mode of a card in hand can be played, or why not. */
export function cardOptions(
  state: GameState,
  uid: string,
  content: Content = defaultContent,
): ModeOption[] {
  const instance = state.piles.hand.find((c) => c.uid === uid)
  const def = instance && content.cards[instance.card]
  if (!def || def.modes.length === 0) {
    const check = validate(state, { type: 'playCard', uid }, content)
    return [
      { mode: 0, target: undefined, actions: [], reason: check.ok ? undefined : check.reason },
    ]
  }

  return def.modes.map((mode, modeIndex) => {
    const target = targetKindOf(state, mode)
    const actions = candidatesFor(state, uid, modeIndex, mode, content).filter(
      (action) => validate(state, action, content).ok,
    )
    if (actions.length > 0) return { mode: modeIndex, target, actions }

    const check = validate(state, { type: 'playCard', uid, mode: modeIndex }, content)
    let reason = check.ok ? undefined : check.reason
    if (reason === texts.reasons.chooseTrash) reason = texts.reasons.noTrashTarget
    if (reason === texts.reasons.chooseDestination) reason = texts.reasons.noDestination
    return { mode: modeIndex, target, actions, reason }
  })
}

/** For the UI: where the free move can go right now. */
export function freeMoveTargets(state: GameState, content: Content = defaultContent): LocationId[] {
  return Object.keys(content.locations).filter(
    (to) => validate(state, { type: 'freeMove', to }, content).ok,
  )
}
