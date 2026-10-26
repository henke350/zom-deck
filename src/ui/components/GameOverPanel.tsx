import { useEffect, useRef, useState } from 'react'
import type { Balance } from '../../data/balance'
import { texts } from '../../data/texts.en'
import type { ExpeditionResult } from '../../game'
import { endSummary, resultCode } from '../summary'
import { Page } from './Page'

interface GameOverPanelProps {
  readonly result: ExpeditionResult
  readonly balance: Balance
  readonly seed: number
  readonly onNewExpedition: () => void
  readonly onRestart: () => void
  readonly onExit: () => void
  /** Campaign: the day is over; the only way on is back to the base (no restarting a day). */
  readonly onBackToBase?: () => void
}

/** The end screen: how it ended, why, one tip, and the numbers. */
export function GameOverPanel({
  result,
  balance,
  seed,
  onNewExpedition,
  onRestart,
  onExit,
  onBackToBase,
}: GameOverPanelProps) {
  const first = useRef<HTMLButtonElement>(null)
  useEffect(() => first.current?.focus(), [])
  const ui = texts.ui
  const end = texts.end
  const { outcome } = result
  const summary = endSummary(result, balance)
  const code = resultCode(result, seed, balance.maxHp)
  const codeRef = useRef<HTMLElement>(null)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopyState('copied')
    } catch {
      // Some hosts refuse the clipboard. Select the line so the player can copy it.
      const el = codeRef.current
      const selection = window.getSelection()
      if (el && selection) {
        const range = document.createRange()
        range.selectNodeContents(el)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      setCopyState('failed')
    }
  }

  return (
    <Page labelledBy="game-over-title">
      <h2 id="game-over-title">{ui.outcomeTitle[outcome.cause]}</h2>
      {outcome.stars && !onBackToBase ? (
        <p className="stars">{ui.outcomeStars(outcome.stars, balance.starThresholds.length)}</p>
      ) : null}

      <section className="end-story" aria-label={end.heading}>
        {summary.explanation.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </section>
      <p className="end-tip">
        <b>{end.tipHeading}:</b> {onBackToBase ? texts.campaign.dayOverTip : summary.tip}
      </p>
      {onBackToBase && outcome.result === 'won' && (
        <p className="pack-banner">
          {texts.campaign.bringingHome(result.food, result.water, result.materials)}
        </p>
      )}

      <div className="page-actions">
        {onBackToBase ? (
          <button ref={first} type="button" className="btn btn-primary" onClick={onBackToBase}>
            {texts.campaign.backToBase}
          </button>
        ) : (
          <>
            <button ref={first} type="button" className="btn btn-primary" onClick={onNewExpedition}>
              {ui.newExpedition}
            </button>
            <button type="button" className="btn" onClick={onRestart}>
              {ui.sameCity}
            </button>
            <button type="button" className="btn btn-quiet" onClick={onExit}>
              {ui.backToTitle}
            </button>
          </>
        )}
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
      <section className="result-code" aria-label={end.resultHeading}>
        <h3 className="eyebrow">{end.resultHeading}</h3>
        <p className="muted">{end.resultHint}</p>
        <div className="result-row">
          <code ref={codeRef}>{code}</code>
          <button type="button" className="btn btn-small" onClick={copy}>
            {copyState === 'copied' ? end.copied : end.copy}
          </button>
        </div>
        {copyState === 'failed' && <p className="reason">{end.copyFailed}</p>}
      </section>
    </Page>
  )
}
