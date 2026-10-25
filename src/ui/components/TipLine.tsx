import { texts } from '../../data/texts.en'
import type { HintId } from '../hints'

/** The line above the hand: a tip for new players, or the plain reminder about keeping a card. */
export function TipLine({
  hint,
  keep,
  onHide,
}: {
  hint: HintId | null
  keep: number
  onHide: () => void
}) {
  const ui = texts.ui
  if (!hint) return <p className="prompt muted">{ui.keepHint(keep)}</p>
  const text = hint === 'endTurn' ? ui.hints.endTurn(keep) : ui.hints[hint]
  return (
    <p className="prompt tip" role="status">
      <span>
        <b>{ui.tipLabel}:</b> {text}
      </span>
      <button type="button" className="btn btn-quiet btn-small" onClick={onHide}>
        {ui.hideTips}
      </button>
    </p>
  )
}
