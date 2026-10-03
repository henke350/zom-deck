import { useState } from 'react'
import { balance } from '../../data/balance'
import { texts } from '../../data/texts.en'
import { markRulesSeen } from '../storage'
import { RulesDialog } from './RulesDialog'

const facts = [
  { value: balance.turnLimit, label: texts.facts.turns },
  { value: balance.maxHp, label: texts.facts.health },
  { value: balance.handSize, label: texts.facts.hand },
  { value: balance.apPerTurn, label: texts.facts.ap },
]

export function TitleScreen({ onStart }: { onStart: () => void }) {
  const [rulesOpen, setRulesOpen] = useState(false)
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
        <div className="action-row">
          <button type="button" className="btn btn-primary" onClick={onStart}>
            {texts.startExpedition}
          </button>
          <button type="button" className="btn" onClick={() => setRulesOpen(true)}>
            {texts.rules.open}
          </button>
        </div>
        <p className="reason">{texts.prototypeNote}</p>
      </div>

      <p className="status">{texts.statusLine}</p>

      {rulesOpen && (
        <RulesDialog
          balance={balance}
          onClose={() => {
            markRulesSeen()
            setRulesOpen(false)
          }}
        />
      )}
    </main>
  )
}
