import { useEffect, useRef } from 'react'
import { texts } from '../../data/texts.en'
import type { Outcome } from '../../game'

interface GameOverPanelProps {
  readonly outcome: Outcome
  readonly turn: number
  readonly onNewExpedition: () => void
  readonly onRestart: () => void
  readonly onExit: () => void
}

export function GameOverPanel({
  outcome,
  turn,
  onNewExpedition,
  onRestart,
  onExit,
}: GameOverPanelProps) {
  const first = useRef<HTMLButtonElement>(null)
  useEffect(() => first.current?.focus(), [])
  const ui = texts.ui

  return (
    <div className="overlay">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
        <h2 id="game-over-title">{ui.outcomeTitle[outcome.cause]}</h2>
        {outcome.stars ? <p className="stars">{ui.outcomeStars(outcome.stars)}</p> : null}
        <p className="muted">
          {ui.turn} {turn}
        </p>
        <div className="dialog-actions">
          <button ref={first} type="button" className="btn btn-primary" onClick={onNewExpedition}>
            {ui.newExpedition}
          </button>
          <button type="button" className="btn" onClick={onRestart}>
            {ui.sameCity}
          </button>
          <button type="button" className="btn btn-quiet" onClick={onExit}>
            {ui.backToTitle}
          </button>
        </div>
      </div>
    </div>
  )
}
