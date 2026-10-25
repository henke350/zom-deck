import { useEffect, useRef } from 'react'
import type { Balance } from '../../data/balance'
import { texts } from '../../data/texts.en'
import { Page } from './Page'

/** The whole game on one page. Numbers come from the balance file. */
export function RulesPage({
  balance,
  onClose,
  onShowTips,
}: {
  balance: Balance
  onClose: () => void
  /** Shown when the tips for new players are turned off: turns them back on. */
  onShowTips?: () => void
}) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus(), [])
  const rules = texts.rules

  return (
    <Page labelledBy="rules-title" onEscape={onClose}>
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
      <div className="page-actions">
        {onShowTips && (
          <button type="button" className="btn" onClick={onShowTips}>
            {texts.ui.showTips}
          </button>
        )}
        <button type="button" className="btn btn-primary" onClick={onClose}>
          {rules.close}
        </button>
      </div>
    </Page>
  )
}
