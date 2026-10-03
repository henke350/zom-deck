import { texts } from '../../data/texts.en'
import type { LogEntry } from '../useGame'

const VISIBLE = 40

export function EventLog({ entries }: { entries: readonly LogEntry[] }) {
  const recent = entries.slice(-VISIBLE).reverse()
  return (
    <section className="panel event-log" aria-label={texts.ui.log}>
      <h2 className="eyebrow">{texts.ui.log}</h2>
      <ol>
        {recent.map((entry) => (
          <li key={entry.id}>
            <span className="log-turn">T{entry.turn}</span> {entry.text}
          </li>
        ))}
      </ol>
    </section>
  )
}
