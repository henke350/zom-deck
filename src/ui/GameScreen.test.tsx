// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { balance } from '../data/balance'
import { texts } from '../data/texts.en'
import { GameScreen } from './GameScreen'

afterEach(cleanup)

/** Exactly five cards, so the whole deck is in the first hand. */
const startDeck = ['run', 'search', 'toolbox', 'nerves', 'bandage']

function renderGame() {
  const handlers = { onNewExpedition: vi.fn(), onRestart: vi.fn(), onExit: vi.fn() }
  const view = render(<GameScreen seed={7} setup={{ startDeck }} {...handlers} />)
  const card = (id: string) => {
    const el = view.container.querySelector<HTMLElement>(`[data-card="${id}"]`)
    if (!el) throw new Error(`Card ${id} is not in hand`)
    return within(el)
  }
  const node = (name: string) => screen.getByRole('button', { name: new RegExp(`^${name}`) })
  const log = () => within(screen.getByRole('region', { name: texts.ui.log }))
  return { ...handlers, card, node, log, user: userEvent.setup() }
}

describe('GameScreen', () => {
  it('shows turn, health and the hand', () => {
    const { card } = renderGame()
    expect(screen.getByText(`1/${balance.turnLimit}`)).toBeTruthy()
    expect(screen.getByText(`${balance.maxHp}/${balance.maxHp}`)).toBeTruthy()
    expect(card('run').getByText(texts.cards.run.name)).toBeTruthy()
  })

  it('walks to a neighbour with the free move', async () => {
    const { node, log, user } = renderGame()
    await user.click(node('Street'))
    expect(log().getByText(texts.log.moved('Street', '', 0))).toBeTruthy()
    expect(node('Street').getAttribute('aria-label')).toContain(texts.ui.youAreHere)
  })

  it('explains why a card cannot be played yet', () => {
    const { card } = renderGame()
    const play = card('search').getByRole('button', { name: texts.ui.play }) as HTMLButtonElement
    expect(play.disabled).toBe(true)
    expect(card('search').getByText(texts.reasons.notBuiltYet)).toBeTruthy()
    expect(card('nerves').getByText(texts.reasons.unplayable)).toBeTruthy()
  })

  it('plays Run by picking a destination on the map', async () => {
    const { card, node, log, user } = renderGame()
    await user.click(card('run').getByRole('button', { name: texts.ui.play }))
    expect(screen.getByRole('status').textContent).toContain(texts.ui.chooseDestination)
    await user.click(node('House A'))
    expect(log().getByText(texts.log.moved('House A', 'Run', 0))).toBeTruthy()
    expect(screen.getByText(`${balance.apPerTurn - 1}/${balance.apPerTurn}`)).toBeTruthy()
  })

  it('plays Toolbox by picking a card to trash', async () => {
    const { card, log, user } = renderGame()
    await user.click(card('toolbox').getByRole('button', { name: texts.ui.play }))
    await user.click(card('nerves').getByRole('button', { name: texts.ui.trash }))
    expect(log().getByText(texts.log.cardTrashed('Nerves'))).toBeTruthy()
  })

  it('lets you cancel a card that needs a choice', async () => {
    const { card, user } = renderGame()
    await user.click(card('run').getByRole('button', { name: texts.ui.play }))
    await user.click(screen.getByRole('button', { name: texts.ui.cancel }))
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('keeps a card and ends the turn', async () => {
    const { card, log, user } = renderGame()
    await user.click(card('bandage').getByRole('button', { name: texts.ui.keep }))
    await user.click(screen.getByRole('button', { name: texts.ui.endTurnKeeping('Bandage') }))
    expect(screen.getByText(`2/${balance.turnLimit}`)).toBeTruthy()
    expect(log().getByText(texts.log.cardsKept('Bandage'))).toBeTruthy()
    expect(card('bandage').getByText(texts.cards.bandage.name)).toBeTruthy()
  })

  it('ends in darkness after the last turn and offers a restart', async () => {
    const { onRestart, user } = renderGame()
    for (let i = 0; i < balance.turnLimit; i++) {
      await user.click(screen.getByRole('button', { name: texts.ui.endTurn }))
    }
    const dialog = screen.getByRole('dialog', { name: texts.ui.outcomeTitle.darkness })
    await user.click(within(dialog).getByRole('button', { name: texts.ui.sameCity }))
    expect(onRestart).toHaveBeenCalledOnce()
  })
})
