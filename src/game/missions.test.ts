import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { dayBalance, dayMission, daySeed, daySetup, finishDay, newCampaign } from './campaign'
import { applyAction } from './engine'
import { checkMission, missionKindFor } from './missions'
import { newGame } from './setup'
import { makeState } from './testkit'
import type { GameEvent, GameState } from './types'

const c = balance.campaign

describe('campaign missions', () => {
  it('has one mission a day in a building away from the shelter, the same every time', () => {
    const campaign = newCampaign(42, balance)
    const mission = dayMission(campaign, balance)
    expect(mission?.kind).toBe(missionKindFor(c.missions, 1))
    expect(mission).toEqual(dayMission(campaign, balance))
    expect(daySetup(campaign, balance).mission).toEqual(mission)
    const bossDay = c.missions.indexOf('boss') + 1
    expect(dayMission({ ...campaign, day: bossDay }, balance)?.kind).toBe('boss')
    expect(missionKindFor(c.missions, 99)).toBe(c.missions.at(-1))
  })

  it('puts the boss in its building', () => {
    const campaign = { ...newCampaign(42, balance), day: c.missions.indexOf('boss') + 1 }
    const setup = daySetup(campaign, balance)
    const state = newGame(daySeed(campaign), { balance: dayBalance(campaign, balance), setup })
    const boss = state.zombies.filter((z) => z.kind === 'boss')
    expect(boss).toHaveLength(1)
    expect(boss[0]!.location).toBe(setup.mission?.target)
    expect(boss[0]!.hp).toBe(balance.zombies.boss.hp)
    expect(state.mission).toEqual({ ...setup.mission, done: false })
  })

  it('a rescue is done when you reach the building', () => {
    const start: GameState = {
      ...makeState({ location: 'supermarket' }),
      mission: { kind: 'rescue', target: 'police', done: false },
    }
    const { state, events } = applyAction(start, { type: 'freeMove', to: 'police' })
    expect(state.mission?.done).toBe(true)
    expect(events).toContainEqual({ type: 'missionDone', kind: 'rescue', target: 'police' })
  })

  it('clearing needs the building empty while you stand in it', () => {
    const at = (zombies: { at: string }[]): GameState => ({
      ...makeState({ location: 'police', zombies }),
      mission: { kind: 'clear', target: 'police', done: false },
    })
    const events: GameEvent[] = []
    expect(checkMission(at([{ at: 'police' }]), events).mission?.done).toBe(false)
    expect(checkMission(at([{ at: 'street' }]), events).mission?.done).toBe(true)
  })

  it('the boss mission is done when the boss is dead', () => {
    const base = makeState({ location: 'police', zombies: [{ at: 'police', kind: 'boss' }] })
    const state = { ...base, mission: { kind: 'boss' as const, target: 'police', done: false } }
    expect(checkMission(state, []).mission?.done).toBe(false)
    expect(checkMission({ ...state, zombies: [] }, []).mission?.done).toBe(true)
  })

  it('pays the reward only if you get home', () => {
    const campaign = newCampaign(42, balance)
    const day = newGame(daySeed(campaign), {
      balance: dayBalance(campaign, balance),
      setup: daySetup(campaign, balance),
    })
    const done = { ...day, mission: { ...day.mission!, done: true }, phase: 'gameOver' as const }
    const reward = c.missionReward[day.mission!.kind]
    const home = finishDay(campaign, {
      ...done,
      outcome: { result: 'won', cause: 'home', stars: 1 },
    })
    expect(home.materials).toBe(reward.materials)
    expect(home.history[0]?.mission).toBe(day.mission!.kind)
    const lost = finishDay(campaign, { ...done, outcome: { result: 'lost', cause: 'killed' } })
    expect(lost.materials).toBe(0)
    expect(lost.history[0]?.mission).toBeUndefined()
  })
})
