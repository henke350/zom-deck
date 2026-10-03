import { useEffect, useRef } from 'react'
import { texts } from '../../data/texts.en'
import { Dialog } from './Dialog'

interface ConfirmHomeDialogProps {
  readonly packs: number
  readonly stars: number
  /** Packs needed for one more star, if there is one. */
  readonly nextStarAt?: number
  readonly onConfirm: () => void
  readonly onCancel: () => void
}

/** Walking into the Shelter with enough packs ends the expedition, so ask first. */
export function ConfirmHomeDialog({
  packs,
  stars,
  nextStarAt,
  onConfirm,
  onCancel,
}: ConfirmHomeDialogProps) {
  const yes = useRef<HTMLButtonElement>(null)
  useEffect(() => yes.current?.focus(), [])
  const t = texts.confirmHome

  return (
    <Dialog labelledBy="confirm-home-title" onEscape={onCancel}>
      <h2 id="confirm-home-title">{t.title}</h2>
      <p>{t.body(packs, stars)}</p>
      {nextStarAt !== undefined && <p className="muted">{t.next(nextStarAt)}</p>}
      <div className="dialog-actions">
        <button ref={yes} type="button" className="btn btn-primary" onClick={onConfirm}>
          {t.yes}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          {t.no}
        </button>
      </div>
    </Dialog>
  )
}
