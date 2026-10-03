import { useEffect, useRef } from 'react'
import type { Balance } from '../../data/balance'
import { texts } from '../../data/texts.en'
import type { ExpeditionResult } from '../../game'
import { endSummary } from '../summary'
import { Dialog } from './Dialog'

interface GameOverPanelProps {
  readonly result: ExpeditionResult
  readonly balance: Balance
  readonly seed: number
  readonly onNewExpedition: () => void
  readonly onRestart: () => void
  readonly onExit: () => void
}

/** The end screen: how it ended, why, one tip, and the numbers. */
export function GameOverPanel({
  result,
  balance,
  seed,
  onNewExpedition,
  onRestart,
  onExit,
}: GameOverPanelProps) {
  const first = useRef<HTMLButtonElement>(null)
  useEffect(() => first.current?.focus(), [])
  const ui = texts.ui
  const end = texts.end
  const { outcome } = result
  const summary = endSummary(result, balance)

  return (
    <Dialog labelledBy="game-over-title" wide>
      <h2 id="game-over-title">{ui.outcomeTitle[outcome.cause]}</h2>
      {outcome.stars ? (
        <p className="stars">{ui.outcomeStars(outcome.stars, balance.starThresholds.length)}</p>
      ) : null}

      <section className="end-story" aria-label={end.heading}>
        {summary.explanation.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </section>
      <p className="end-tip">
        <b>{end.tipHeading}:</b> {summary.tip}
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

      <section aria-labelledby="end-stats-title">
        <h3 id="end-stats-title" className="eyebrow">
          {end.statsHeading}
        </h3>
        <dl className="end-stats">
          {summary.stats.map((row) => (
            <div key={row.label} className={row.wide ? 'end-stat-wide' : undefined}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <p className="muted end-seed">{end.seed(seed)}</p>
    </Dialog>
  )
}
