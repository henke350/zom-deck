import type { DayEventId } from '../../data/balance'
import { texts } from '../../data/texts.en'

/** The event of the day, in the line above the hand at the start (no pop-up). */
export function EventNotice({ event, onClose }: { event: DayEventId; onClose: () => void }) {
  const t = texts.dayEvents
  return (
    <p className="prompt danger-notice event-notice" role="status">
      <b>
        {t.label}: {t[event].name}
      </b>
      <span>{t[event].text}</span>
      <button type="button" className="btn btn-quiet btn-small" onClick={onClose}>
        {t.close}
      </button>
    </p>
  )
}
