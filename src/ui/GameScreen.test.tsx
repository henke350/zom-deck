// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { balance } from '../data/balance'
import { texts } from '../data/texts.en'
import { newGame } from '../game'
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
    expect(card('search').getByText(texts.reasons.nothingToSearch)).toBeTruthy()
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

describe('GameScreen: searching', () => {
  /** "Take <card>" buttons, not the "Take nothing" button. */
  const takeFindButton = new RegExp(`^${texts.ui.take} (?!nothing)`)
  const deck = ['search', 'search', 'nerves', 'bandage', 'run']

  /** First seed where House A hides a supply pack (or does not). */
  function seedWhere(houseAHasPack: boolean) {
    for (let seed = 1; seed < 500; seed++) {
      if (newGame(seed, { setup: { startDeck: deck } }).sites.houseA?.hasPack === houseAHasPack) {
        return seed
      }
    }
    throw new Error('no matching seed')
  }

  function renderAt(houseAHasPack: boolean) {
    const handlers = { onNewExpedition: vi.fn(), onRestart: vi.fn(), onExit: vi.fn() }
    const view = render(
      <GameScreen seed={seedWhere(houseAHasPack)} setup={{ startDeck: deck }} {...handlers} />,
    )
    const log = () => within(screen.getByRole('region', { name: texts.ui.log }))
    const houseA = () => screen.getByRole('button', { name: /^House A/ })
    return { view, log, houseA, user: userEvent.setup() }
  }

  it('searches with a card and takes a find', async () => {
    const { view, log, houseA, user } = renderAt(false)
    await user.click(houseA())
    const searchCard = view.container.querySelector<HTMLElement>('[data-card="search"]')
    await user.click(within(searchCard!).getByRole('button', { name: texts.ui.play }))
    const dialog = screen.getByRole('dialog', { name: texts.ui.findTitle })
    const takes = within(dialog).getAllByRole('button', { name: takeFindButton })
    expect(takes).toHaveLength(3)
    await user.click(takes[0]!)
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(log().getByText(/^You take .+ It goes into your discard pile\.$/)).toBeTruthy()
    expect(houseA().textContent).toContain(texts.ui.mapSearches(1, 2))
  })

  it('quick-searches without a card and can take nothing', async () => {
    const { log, houseA, user } = renderAt(false)
    await user.click(houseA())
    await user.click(screen.getByRole('button', { name: texts.ui.quickSearch(2, 2) }))
    const dialog = screen.getByRole('dialog', { name: texts.ui.findTitle })
    expect(within(dialog).getAllByRole('button', { name: takeFindButton })).toHaveLength(2)
    await user.click(within(dialog).getByRole('button', { name: texts.ui.takeNothing }))
    expect(log().getByText(texts.log.findDeclined)).toBeTruthy()
  })

  it('can scrap a card from hand instead of taking a find', async () => {
    const { log, houseA, user } = renderAt(false)
    await user.click(houseA())
    await user.click(screen.getByRole('button', { name: texts.ui.quickSearch(2, 2) }))
    const dialog = screen.getByRole('dialog', { name: texts.ui.findTitle })
    await user.click(within(dialog).getByRole('button', { name: texts.ui.scrap('Nerves') }))
    expect(log().getByText(texts.log.cardScrapped('Nerves'))).toBeTruthy()
  })

  it('finds a supply pack and shows it', async () => {
    const { houseA, user } = renderAt(true)
    await user.click(houseA())
    await user.click(screen.getByRole('button', { name: texts.ui.quickSearch(2, 2) }))
    const dialog = screen.getByRole('dialog', { name: texts.ui.findTitle })
    expect(within(dialog).getByText(texts.ui.packBanner(1))).toBeTruthy()
    await user.click(within(dialog).getByRole('button', { name: texts.ui.takeNothing }))
    expect(screen.getByText(`1/${balance.packsToWin}`)).toBeTruthy()
  })
})
