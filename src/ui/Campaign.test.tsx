// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { balance } from '../data/balance'
import { texts } from '../data/texts.en'
import { dayBalance, daySeed, daySetup, newCampaign, newGame } from '../game'
import App from './App'
import { GameScreen } from './GameScreen'
import { BaseScreen } from './components/BaseScreen'
import { clearCampaign, forgetRulesSeen, loadCampaign, markRulesSeen } from './storage'

afterEach(() => {
  cleanup()
  forgetRulesSeen()
  clearCampaign()
})

const t = texts.campaign

describe('campaign', () => {
  it('plays a day from the base and back, and can be continued after a reload', async () => {
    markRulesSeen()
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: t.start }))
    expect(
      screen.getByRole('heading', { name: t.dayHeading(1, balance.campaign.days) }),
    ).toBeTruthy()

    await user.click(screen.getByRole('button', { name: t.setOut(1) }))
    expect(screen.getByText(`1/${balance.campaign.days}`)).toBeTruthy()
    expect(loadCampaign()?.expedition?.campaignDay).toBe(1)

    // Step out to the Street, end the turn, and walk home: going home empty-handed is allowed.
    await user.click(screen.getByRole('button', { name: /^Street/ }))
    await user.click(screen.getByRole('button', { name: texts.ui.endTurn }))
    await user.click(screen.getByRole('button', { name: /^Shelter/ }))
    const ask = screen.getByRole('group', { name: texts.confirmHome.title })
    expect(within(ask).getByText(texts.confirmHome.dayBody(1, 0, 0, 0))).toBeTruthy()
    await user.click(within(ask).getByRole('button', { name: texts.confirmHome.yes }))
    // The end of a campaign day: no replay hint, and a result line with the day instead of stars.
    expect(screen.queryByText(/Same city again/)).toBeNull()
    expect(screen.getByText(/^OMB campaign day 1 seed/)).toBeTruthy()
    await user.click(screen.getByRole('button', { name: t.backToBase }))

    expect(
      screen.getByRole('heading', { name: t.dayHeading(2, balance.campaign.days) }),
    ).toBeTruthy()
    expect(screen.getByText(t.penaltyHungry(balance.campaign.hungerNerves))).toBeTruthy()
    expect(loadCampaign()?.campaign.day).toBe(2)
    expect(loadCampaign()?.expedition).toBeUndefined()

    cleanup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: t.continue(2) }))
    expect(
      screen.getByRole('heading', { name: t.dayHeading(2, balance.campaign.days) }),
    ).toBeTruthy()
  })

  it('resumes the expedition of the day where it was left', async () => {
    markRulesSeen()
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: t.start }))
    await user.click(screen.getByRole('button', { name: t.setOut(1) }))
    await user.click(screen.getByRole('button', { name: /^Street/ }))
    cleanup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: t.continue(1) }))
    expect(screen.getByRole('button', { name: /^Street. You are here/ })).toBeTruthy()
  })
})

describe('the base screen', () => {
  const handlers = () => ({
    onBuild: vi.fn(),
    onLocker: vi.fn(),
    onSetOut: vi.fn(),
    onNewCampaign: vi.fn(),
    onExit: vi.fn(),
  })

  it('builds what you can afford and explains what you cannot', async () => {
    const on = handlers()
    const campaign = { ...newCampaign(1), materials: 3 }
    render(<BaseScreen campaign={campaign} balance={balance} {...on} />)
    const name = (id: 'lookout' | 'garden') =>
      `${t.upgrades[id].name}: ${t.build(balance.campaign.upgradeCost[id])}`
    const garden = screen.getByRole('button', { name: name('garden') })
    expect(garden).toHaveProperty('disabled', true)
    expect(
      screen.getByText(t.reasons.materials(balance.campaign.upgradeCost.garden, 3)),
    ).toBeTruthy()
    await userEvent.click(screen.getByRole('button', { name: name('lookout') }))
    expect(on.onBuild).toHaveBeenCalledWith('lookout')
  })

  it('offers the Locker choice and shows the end of a campaign', async () => {
    const on = handlers()
    const outcome = { result: 'won', cause: 'home' } as const
    const day = {
      day: 1,
      outcome,
      food: 1,
      water: 1,
      materials: 0,
      cardsFound: ['axe'],
      ate: true,
      drank: true,
      producedFood: 0,
      producedWater: 0,
    }
    const campaign = { ...newCampaign(1), day: 2, upgrades: ['locker' as const], history: [day] }
    const view = render(<BaseScreen campaign={campaign} balance={balance} {...on} />)
    await userEvent.click(screen.getByRole('button', { name: 'Axe' }))
    expect(on.onLocker).toHaveBeenCalledWith('axe')
    expect(screen.getByText(t.cameHome(1, 1, 1, 0), { exact: false })).toBeTruthy()

    view.rerender(
      <BaseScreen campaign={{ ...campaign, over: 'survived' }} balance={balance} {...on} />,
    )
    expect(screen.getByRole('heading', { name: t.survived(balance.campaign.days) })).toBeTruthy()
    await userEvent.click(screen.getByRole('button', { name: t.restart }))
    expect(on.onNewCampaign).toHaveBeenCalled()
  })
})

describe('a campaign day on screen', () => {
  it('says plainly whether a pack is food or water, and what you carry', async () => {
    const campaign = newCampaign(5)
    const day = newGame(daySeed(campaign), {
      balance: dayBalance(campaign),
      setup: daySetup(campaign),
    })
    const at = Object.keys(day.sites).find((id) => day.sites[id]?.hasPack) ?? ''
    const kind = day.sites[at]?.packKind ?? 'food'
    const state = {
      ...day,
      player: { ...day.player, location: at, ap: 3 },
      visited: [...day.visited, at],
      zombies: [],
    }
    const handlers = { onNewExpedition: vi.fn(), onRestart: vi.fn(), onExit: vi.fn() }
    render(<GameScreen seed={1} initialState={state} {...handlers} />)
    expect(screen.getByText(t.carrying(0, 0, 0))).toBeTruthy()
    await userEvent.click(screen.getByRole('button', { name: /^Quick search/ }))
    expect(screen.getByText(texts.ui.packBanner(1, t.packKind[kind]))).toBeTruthy()
    const food = kind === 'food' ? 1 : 0
    expect(screen.getByText(t.carrying(food, 1 - food, 0))).toBeTruthy()
  })
})
