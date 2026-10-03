import { shuffle } from './rng'
import type { CardInstance, GameEvent, GameState, Piles } from './types'

/** Cards the player owns: everything except used-up and trashed cards. */
export function ownedCount(piles: Piles): number {
  return piles.draw.length + piles.hand.length + piles.inPlay.length + piles.discard.length
}

/** Every card in the game, including removed ones. */
export function totalCount(piles: Piles): number {
  return ownedCount(piles) + piles.removed.length
}

export function withoutCard(cards: readonly CardInstance[], uid: string): readonly CardInstance[] {
  return cards.filter((c) => c.uid !== uid)
}

/**
 * Draws up to `count` cards. When the draw pile runs out, the discard pile is
 * shuffled into a new draw pile. Cards in play are never reshuffled mid-turn.
 * Stops quietly if both piles are empty.
 */
export function drawCards(state: GameState, count: number, events: GameEvent[]): GameState {
  let { draw, hand, discard } = state.piles
  let rng = state.rng
  const drawn: string[] = []

  for (let i = 0; i < count; i++) {
    if (draw.length === 0) {
      if (discard.length === 0) break
      const [shuffled, next] = shuffle(discard, rng)
      rng = next
      draw = shuffled
      discard = []
      events.push({ type: 'deckShuffled' })
    }
    const [top, ...rest] = draw
    if (!top) break
    draw = rest
    hand = [...hand, top]
    drawn.push(top.uid)
  }

  if (drawn.length > 0) events.push({ type: 'cardsDrawn', uids: drawn })
  return { ...state, rng, piles: { ...state.piles, draw, hand, discard } }
}
