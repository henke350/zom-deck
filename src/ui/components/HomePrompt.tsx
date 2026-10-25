import { useEffect, useRef } from 'react'
import { texts } from '../../data/texts.en'

interface HomePromptProps {
  readonly packs: number
  readonly stars: number
  /** Packs needed for one more star, if there is one. */
  readonly nextStarAt?: number
  readonly onConfirm: () => void
  readonly onCancel: () => void
}

/**
 * Walking into the Shelter with enough packs ends the expedition, so ask first: in the line
 * above the hand, not in a pop-up.
 */
export function HomePrompt({ packs, stars, nextStarAt, onConfirm, onCancel }: HomePromptProps) {
  const yes = useRef<HTMLButtonElement>(null)
  useEffect(() => yes.current?.focus(), [])
  const t = texts.confirmHome

  return (
    <div className="prompt home-prompt" role="group" aria-labelledby="confirm-home-title">
      <b id="confirm-home-title">{t.title}</b>
      <span>{t.body(packs, stars)}</span>
      {nextStarAt !== undefined && <span className="muted">{t.next(nextStarAt)}</span>}
      <button ref={yes} type="button" className="btn btn-primary btn-small" onClick={onConfirm}>
        {t.yes}
      </button>
      <button type="button" className="btn btn-small" onClick={onCancel}>
        {t.no}
      </button>
    </div>
  )
}
