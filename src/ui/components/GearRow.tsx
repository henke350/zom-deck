import { texts } from '../../data/texts.en'
import type { Content, GameState } from '../../game'
import { dogOptions, gearOptions } from '../../game'
import { cardText } from '../names'

/**
 * Gear in front of you: what it does, how long it lasts, and a Shoot button for gear you use
 * (the Crossbow). Hidden when you have none.
 */
export function GearRow({
  state,
  content,
  onUse,
  onSic,
  busy,
}: {
  state: GameState
  content: Content
  onUse: (uid: string) => void
  /** Sic: the Stray Dog attacks. */
  onSic: () => void
  /** Another choice is open: the Shoot button waits. */
  busy: boolean
}) {
  if (state.piles.gear.length === 0 && !state.dog) return null
  const ui = texts.ui
  const dog = state.dog
  const sic = dogOptions(state, content)
  const canSic = !busy && sic !== undefined && sic.actions.length > 0
  return (
    <ul className="gear-row" aria-label={ui.gear}>
      <li className="gear-label">{ui.gear}</li>
      {dog && (
        <li className="gear-item gear-dog" data-gear="dog" title={cardText('dog').text}>
          <b>{ui.dogStatus(dog.hp, state.balance.dog.hp)}</b>
          <button
            type="button"
            className="btn btn-small btn-danger gear-use"
            disabled={!canSic}
            title={canSic ? undefined : sic?.reason}
            onClick={onSic}
          >
            {ui.sic}
          </button>
        </li>
      )}
      {state.piles.gear.map((card) => {
        const def = content.cards[card.card]?.gear
        const left = state.gearLeft[card.uid] ?? 0
        const use = def?.effect.kind === 'shoot' ? gearOptions(state, card.uid, content) : undefined
        const usable = !busy && use !== undefined && use.actions.length > 0
        return (
          <li
            key={card.uid}
            className="gear-item"
            data-gear={card.card}
            title={cardText(card.card).text}
          >
            <b>{cardText(card.card).name}</b>{' '}
            <span className="muted">{def ? ui.gearLeft(def.lasts.kind, left) : ''}</span>
            {def?.effect.kind === 'shoot' && (
              <button
                type="button"
                className="btn btn-small btn-danger gear-use"
                disabled={!usable}
                title={usable ? undefined : use?.reason}
                onClick={() => onUse(card.uid)}
              >
                {ui.shoot(def.effect.cost)}
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}
