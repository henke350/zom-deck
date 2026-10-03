import { defaultContent } from '../data/content'
import { activeEffects, trashFilterOf } from './rules'
import { validate } from './validate'
import type { Action, Content, GameState } from './types'

/**
 * Every legal action right now. Used by tests and, later, by the bots (M6)
 * and the UI to decide what to offer.
 */
export function listActions(state: GameState, content: Content = defaultContent): Action[] {
  if (state.phase === 'gameOver') return []
  const candidates: Action[] = []
  const { hand } = state.piles

  for (const card of hand) {
    const def = content.cards[card.card]
    if (!def) continue
    def.modes.forEach((mode, modeIndex) => {
      const base = { type: 'playCard', uid: card.uid, mode: modeIndex } as const
      if (trashFilterOf(activeEffects(state, mode))) {
        for (const target of hand) {
          if (target.uid !== card.uid) candidates.push({ ...base, target: { trash: target.uid } })
        }
      } else {
        candidates.push(base)
      }
    })
  }

  candidates.push({ type: 'endTurn' })
  if (state.balance.keepCards > 0) {
    for (const card of hand) candidates.push({ type: 'endTurn', keep: [card.uid] })
  }

  return candidates.filter((action) => validate(state, action, content).ok)
}
