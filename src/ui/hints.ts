import type { Content, GameState } from '../game'
import { cardOptions, freeMoveTargets, packsCarried, previewEndTurn, validate } from '../game'

/** A tip for new players: what a sensible next step is right now. */
export type HintId = 'goHome' | 'campaignHome' | 'zombies' | 'search' | 'walk' | 'endTurn'

/**
 * Picks the tip that fits the moment. It only reads the state and asks the engine what is
 * possible (validate, cardOptions, freeMoveTargets, previewEndTurn); it holds no rules itself.
 */
export function currentHint(state: GameState, content: Content): HintId | null {
  if (state.phase !== 'action') return null
  const here = content.locations[state.player.location]
  if (here?.kind !== 'shelter') {
    // Campaign: you can always go home; the tip comes once tonight's meal is in the bag.
    if (state.campaignDay !== undefined) {
      const { food, water } = packsCarried(state)
      if (food > 0 && water > 0) return 'campaignHome'
    } else if (state.player.packs >= state.balance.packsToWin) {
      return 'goHome'
    }
  }
  if (previewEndTurn(state, content).attackers > 0) return 'zombies'
  if (canSearch(state, content)) return 'search'
  if (freeMoveTargets(state, content).length > 0) return 'walk'
  return 'endTurn'
}

function canSearch(state: GameState, content: Content): boolean {
  if (validate(state, { type: 'quickSearch' }, content).ok) return true
  return state.piles.hand.some((card) => {
    const def = content.cards[card.card]
    if (!def?.modes.some((m) => m.effects.some((e) => e.kind === 'search'))) return false
    return cardOptions(state, card.uid, content).some((o) => o.actions.length > 0)
  })
}
