import { useState } from 'react'
import { balance } from '../../data/balance'
import { texts } from '../../data/texts.en'
import { markRulesSeen } from '../storage'
import { RulesPage } from './RulesPage'

const facts = [
  { value: balance.turnLimit, label: texts.facts.turns },
  { value: balance.maxHp, label: texts.facts.health },
  { value: balance.handSize, label: texts.facts.hand },
  { value: balance.apPerTurn, label: texts.facts.ap },
]

interface TitleScreenProps {
  readonly onStart: () => void
  /** Start a new campaign (replaces a saved one). */
  readonly onNewCampaign: () => void
  /** A saved campaign to continue, with its day. */
  readonly savedCampaign?: { readonly day: number; readonly onContinue: () => void }
}

export function TitleScreen({ onStart, onNewCampaign, savedCampaign }: TitleScreenProps) {
  const [rulesOpen, setRulesOpen] = useState(false)
  if (rulesOpen) {
    return (
      <RulesPage
        balance={balance}
        onClose={() => {
          markRulesSeen()
          setRulesOpen(false)
        }}
      />
    )
  }
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
        <div className="action-row">
          {savedCampaign && (
            <button type="button" className="btn btn-primary" onClick={savedCampaign.onContinue}>
              {texts.campaign.continue(savedCampaign.day)}
            </button>
          )}
          <button type="button" className="btn" onClick={onNewCampaign}>
            {savedCampaign ? texts.campaign.restart : texts.campaign.start}
          </button>
        </div>
        <p className="reason">{texts.campaign.startNote}</p>
      </div>

      <p className="status">{texts.statusLine}</p>
    </main>
  )
}
