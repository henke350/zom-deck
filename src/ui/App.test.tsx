import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { texts } from '../data/texts.en'
import App from './App'

describe('App', () => {
  const html = renderToString(<App />)

  it('shows the title and tagline', () => {
    expect(html).toContain(texts.title)
    expect(html).toContain(texts.tagline)
  })

  it('reads starting values from the balance file', () => {
    expect(html).toContain(`<strong>${balance.turnLimit}</strong>`)
    expect(html).toContain(`<strong>${balance.apPerTurn}</strong>`)
  })

  it('explains why the start button is disabled', () => {
    expect(html).toMatch(/<button[^>]*disabled/)
    expect(html).toContain(texts.startExpeditionDisabled)
  })
})
