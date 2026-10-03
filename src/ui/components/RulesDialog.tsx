import { useEffect, useRef } from 'react'
import type { Balance } from '../../data/balance'
import { texts } from '../../data/texts.en'
import { Dialog } from './Dialog'

/** The whole game on one page. Numbers come from the balance file. */
export function RulesDialog({ balance, onClose }: { balance: Balance; onClose: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus(), [])
  const rules = texts.rules

  return (
    <Dialog labelledBy="rules-title" wide onEscape={onClose}>
      <h2 id="rules-title" ref={heading} tabIndex={-1}>
        {rules.title}
      </h2>
      <p className="muted">{rules.intro}</p>
      <div className="rules">
        {rules.sections(balance).map((section) => (
          <section key={section.heading}>
            <h3>{section.heading}</h3>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="muted credits">{rules.credits}</p>
      <div className="dialog-actions">
        <button type="button" className="btn btn-primary" onClick={onClose}>
          {rules.close}
        </button>
      </div>
    </Dialog>
  )
}
