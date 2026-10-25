import { useEffect, useRef, type ReactNode } from 'react'
import { texts } from '../../data/texts.en'
import type { Action, Content, GameState, PendingFind } from '../../game'
import { noisePreview, validate } from '../../game'
import { cardText, locationText } from '../names'
import { CardFace } from './CardFace'

interface FindChoiceProps {
  readonly state: GameState
  readonly content: Content
  readonly find: PendingFind
  readonly onChoose: (action: Action) => void
  /** Shown above the finds, e.g. the danger notice when this search raised danger. */
  readonly notice?: ReactNode
}

/**
 * After a search: take one find or take nothing. Shown where the hand is (no pop-up), and the
 * hand comes back once you have chosen.
 */
export function FindChoice({ state, content, find, onChoose, notice }: FindChoiceProps) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus(), [])
  const ui = texts.ui
  // Off since tuning 5 (`scrapInFinds`); shown again if the balance turns it back on.
  const scrappable = state.piles.hand.filter(
    (card) => validate(state, { type: 'scrapCard', uid: card.uid }, content).ok,
  )

  return (
    <div className="find-choice" role="region" aria-labelledby="find-title">
      {notice}
      <div className="hand-bar">
        <div className="find-head">
          <h2 id="find-title" ref={heading} tabIndex={-1}>
            {find.fromStash ? ui.stashTitle : find.fromBody ? ui.bodyTitle : ui.findTitle}
          </h2>
          <span className="muted">
            {find.fromStash
              ? ui.stashIntro
              : find.fromBody
                ? ui.bodyIntro
                : ui.findIntro(locationText(find.location).name)}
          </span>
          {find.packFound && (
            <span className="pack-banner" role="status">
              {ui.packBanner(state.player.packs)}
            </span>
          )}
          {find.stashFound && (
            <span className="pack-banner stash-banner" role="status">
              {ui.stashBanner}
            </span>
          )}
          <span className="find-noise">
            {ui.findNoise(find.noise, noisePreview(state, find.noise).arrivals)}
          </span>
        </div>
        <button
          type="button"
          className="btn btn-quiet"
          onClick={() => onChoose({ type: 'declineFind' })}
        >
          {ui.takeNothing}
        </button>
      </div>

      {find.options.length === 0 ? (
        <p>{ui.noFinds}</p>
      ) : (
        <ul className="hand find-options">
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
    </div>
  )
}
