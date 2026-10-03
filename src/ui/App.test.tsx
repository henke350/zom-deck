// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { texts } from '../data/texts.en'
import App from './App'
import { forgetRulesSeen } from './storage'

afterEach(() => {
  cleanup()
  forgetRulesSeen()
})

describe('App', () => {
  it('shows the title, tagline and starting values', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(texts.title)
    expect(screen.getByText(texts.tagline)).toBeTruthy()
    const turns = screen.getByText(texts.facts.turns, { exact: false })
    expect(turns.textContent).toContain(String(balance.turnLimit))
  })

  it('starts an expedition and puts the seed in the address', async () => {
    window.history.replaceState(null, '', '/?seed=4711')
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: texts.startExpedition }))
    expect(screen.getByRole('list', { name: texts.ui.hand })).toBeTruthy()
    expect(screen.getByText(`${texts.ui.seed} 4711`)).toBeTruthy()
    expect(window.location.search).toBe('?seed=4711')
  })

  it('shows the rules on the first expedition only', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: texts.startExpedition }))
    const rules = screen.getByRole('dialog', { name: texts.rules.title })
    await user.click(within(rules).getByRole('button', { name: texts.rules.close }))
    expect(screen.queryByRole('dialog')).toBeNull()

    await user.click(screen.getByRole('button', { name: texts.rules.short }))
    await user.click(screen.getByRole('button', { name: texts.rules.close }))
    cleanup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: texts.startExpedition }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('opens the rules from the title screen', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: texts.rules.open }))
    expect(screen.getByRole('dialog', { name: texts.rules.title })).toBeTruthy()
  })
})
