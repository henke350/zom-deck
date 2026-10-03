import { balance } from '../data/balance'
import { texts } from '../data/texts.en'

const facts = [
  { value: balance.turnLimit, label: texts.facts.turns },
  { value: balance.maxHp, label: texts.facts.health },
  { value: balance.handSize, label: texts.facts.hand },
  { value: balance.apPerTurn, label: texts.facts.ap },
]

export default function App() {
  return (
    <main className="title-screen">
      <p className="eyebrow">{texts.workingTitleNote}</p>
      <h1>{texts.title}</h1>
      <p className="tagline">{texts.tagline}</p>

      <section aria-labelledby="facts-heading" className="facts">
        <h2 id="facts-heading">{texts.factsHeading}</h2>
        <ul>
          {facts.map((fact) => (
            <li key={fact.label}>
              <strong>{fact.value}</strong> {fact.label}
            </li>
          ))}
        </ul>
      </section>

      <div className="actions">
        <button type="button" disabled aria-describedby="start-reason">
          {texts.startExpedition}
        </button>
        <p id="start-reason" className="reason">
          {texts.startExpeditionDisabled}
        </p>
      </div>

      <p className="status">{texts.statusLine}</p>
    </main>
  )
}
