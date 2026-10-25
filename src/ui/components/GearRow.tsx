import { texts } from '../../data/texts.en'
import type { Content, GameState } from '../../game'
import { cardText } from '../names'

/** Gear in front of you: what it does and how long it lasts. Hidden when you have none. */
export function GearRow({ state, content }: { state: GameState; content: Content }) {
  if (state.piles.gear.length === 0) return null
  const ui = texts.ui
  return (
    <ul className="gear-row" aria-label={ui.gear}>
      <li className="gear-label">{ui.gear}</li>
      {state.piles.gear.map((card) => {
        const def = content.cards[card.card]?.gear
        const left = state.gearLeft[card.uid] ?? 0
        return (
          <li
            key={card.uid}
            className="gear-item"
            data-gear={card.card}
            title={cardText(card.card).text}
          >
            <b>{cardText(card.card).name}</b>{' '}
            <span className="muted">{def ? ui.gearLeft(def.lasts.kind, left) : ''}</span>
          </li>
        )
      })}
    </ul>
  )
}
