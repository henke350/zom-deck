import { useEffect, useRef } from 'react'
import type { Balance, SurvivorId } from '../../data/balance'
import { texts } from '../../data/texts.en'
import { survivorLines } from '../survivors'
import { Page } from './Page'

interface SurvivorScreenProps {
  readonly balance: Balance
  readonly onChoose: (id: SurvivorId) => void
  readonly onBack: () => void
}

/** Choosing who goes out, before an expedition or a campaign. A page, never a pop-up. */
export function SurvivorScreen({ balance, onChoose, onBack }: SurvivorScreenProps) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus(), [])
  const t = texts.survivors
  return (
    <Page labelledBy="survivor-title" onEscape={onBack}>
      <h2 id="survivor-title" ref={heading} tabIndex={-1}>
        {t.heading}
      </h2>
      <p className="muted">{t.intro}</p>
      <ul className="base-upgrades survivors">
        {balance.survivors.map((s) => (
          <li key={s.id} className="upgrade">
            <div>
              <strong>{t[s.id].name}</strong>
              <span>{t[s.id].text}</span>
              <ul className="survivor-lines">
                {survivorLines(s).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              aria-label={`${t.choose} ${t[s.id].name}`}
              onClick={() => onChoose(s.id)}
            >
              {t.choose}
            </button>
          </li>
        ))}
      </ul>
      <div className="page-actions">
        <button type="button" className="btn btn-quiet" onClick={onBack}>
          {t.back}
        </button>
      </div>
    </Page>
  )
}
