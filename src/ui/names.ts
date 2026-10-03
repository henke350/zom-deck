import { texts } from '../data/texts.en'
import type { CardId, GameState, LocationId } from '../game'

interface CardText {
  readonly name: string
  readonly text: string
  readonly modes?: readonly string[]
}

interface LocationText {
  readonly name: string
  readonly description: string
}

const cardTexts: Readonly<Record<string, CardText>> = texts.cards
const locationTexts: Readonly<Record<string, LocationText>> = texts.locations

export function cardText(id: CardId): CardText {
  return cardTexts[id] ?? { name: id, text: '' }
}

export function locationText(id: LocationId): LocationText {
  return locationTexts[id] ?? { name: id, description: '' }
}

/** Finds which card a uid belongs to, in any pile. */
export function cardIdOf(state: GameState, uid: string): CardId | undefined {
  const { draw, hand, inPlay, discard, removed } = state.piles
  return [hand, inPlay, discard, draw, removed].flat().find((c) => c.uid === uid)?.card
}
