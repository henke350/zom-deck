// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { texts } from '../data/texts.en'
import App from './App'

afterEach(cleanup)

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
})
