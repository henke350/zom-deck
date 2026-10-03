import { useEffect, useRef } from 'react'
import { texts } from '../../data/texts.en'
import type { Action, Content, GameState, PendingFind } from '../../game'
import { validate } from '../../game'
import { cardText, locationText } from '../names'
import { CardFace } from './CardFace'

interface FindDialogProps {
  readonly state: GameState
  readonly content: Content
  readonly find: PendingFind
  readonly onChoose: (action: Action) => void
}

/** After a search: take one find, scrap a card from hand instead, or take nothing. */
export function FindDialog({ state, content, find, onChoose }: FindDialogProps) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus(), [])
  const ui = texts.ui
  const scrappable = state.piles.hand.filter(
    (card) => validate(state, { type: 'scrapCard', uid: card.uid }, content).ok,
  )

  return (
    <div className="overlay">
      <div
        className="dialog dialog-wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="find-title"
      >
        <h2 id="find-title" ref={heading} tabIndex={-1}>
          {ui.findTitle}
        </h2>
        <p className="muted">{ui.findIntro(locationText(find.location).name)}</p>
        {find.packFound && (
          <p className="pack-banner" role="status">
            {ui.packBanner(state.player.packs)}
          </p>
        )}

        {find.options.length === 0 ? (
          <p>{ui.noFinds}</p>
        ) : (
          <ul className="find-options">
            {find.options.map((card) => (
              <li key={card} className="card" data-find={card}>
                <CardFace card={card} state={state} content={content} />
                <div className="card-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    aria-label={`${ui.take} ${cardText(card).name}`}
                    onClick={() => onChoose({ type: 'takeFind', card })}
                  >
                    {ui.take}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {scrappable.length > 0 && (
          <section className="scrap" aria-label={ui.scrapHeading}>
            <h3 className="eyebrow">{ui.scrapHeading}</h3>
            <div className="scrap-buttons">
              {scrappable.map((card) => (
                <button
                  key={card.uid}
                  type="button"
                  className="btn btn-danger"
                  onClick={() => onChoose({ type: 'scrapCard', uid: card.uid })}
                >
                  {ui.scrap(cardText(card.card).name)}
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="dialog-actions">
          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => onChoose({ type: 'declineFind' })}
          >
            {ui.takeNothing}
          </button>
        </div>
      </div>
    </div>
  )
}
