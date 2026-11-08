import { describe, expect, it } from 'vitest'
import { balance, type Balance } from '../data/balance'
import { toggleAlly, validateToggleAlly, type BaseAlly } from './baseAllies'
import { dayBalance, daySeed, daySetup, finishDay, lockerChoices, newCampaign } from './campaign'
import type { CampaignState } from './campaign'
import { newGame } from './setup'
import type { GameState, Outcome } from './types'

const c = balance.campaign
const withRaid = (chance: number): Balance => ({
  ...balance,
  campaign: { ...c, allies: { ...c.allies, raid: { ...c.allies.raid, chance } } },
})
const calm = withRaid(0)
const home: Outcome = { result: 'won', cause: 'home', stars: 1 }
const killed: Outcome = { result: 'lost', cause: 'killed' }

const ally = (uid: string, card: string, extra: Partial<BaseAlly> = {}): BaseAlly => ({
  uid,
  card,
  going: false,
  wounded: false,
  ...extra,
})

function day(
  campaign: CampaignState,
  outcome: Outcome,
  stats: { found?: string[]; knockedOut?: string[] } = {},
): GameState {
  const state = newGame(daySeed(campaign), {
    balance: dayBalance(campaign, calm),
    setup: daySetup(campaign, calm),
  })
  return {
    ...state,
    phase: 'gameOver',
    outcome,
    stats: {
      ...state.stats,
      cardsTaken: stats.found ?? [],
      alliesKnockedOut: stats.knockedOut ?? [],
    },
  }
}

const start = (allies: BaseAlly[], extra: Partial<CampaignState> = {}): CampaignState => ({
  ...newCampaign(5, calm),
  food: 5,
  water: 5,
  allies,
  ...extra,
})

describe('allies at the base', () => {
  it('an ally you bring home moves in, and is not a locker card', () => {
    const campaign = { ...newCampaign(5, calm), upgrades: ['locker' as const] }
    const next = finishDay(campaign, day(campaign, home, { found: ['nurse', 'axe'] }), calm)
    expect(next.allies).toEqual([ally('a1', 'nurse')])
    expect(next.history[0]?.allies?.joined).toEqual(['nurse'])
    expect(lockerChoices(next)).toEqual(['axe'])
  })

  it('you choose who goes out, two at most, and not the wounded', () => {
    let campaign = start([ally('a1', 'nurse'), ally('a2', 'soldier'), ally('a3', 'scout')])
    campaign = toggleAlly(campaign, 'a1', calm)
    campaign = toggleAlly(campaign, 'a2', calm)
    expect(validateToggleAlly(campaign, 'a3', calm).ok).toBe(false)
    expect(daySetup(campaign, calm).startDeck).toEqual(expect.arrayContaining(['nurse', 'soldier']))
    const resting = start([ally('a1', 'nurse', { wounded: true })])
    expect(validateToggleAlly(resting, 'a1', calm).ok).toBe(false)
  })

  it('the Nurse at home heals you and takes a Wound away; the Scout at home scouts ahead', () => {
    const plain = start([], { thirsty: true, wounds: 1 })
    const nursed = start([ally('a1', 'nurse')], { thirsty: true, wounds: 1 })
    expect(daySetup(nursed, calm).startHp).toBe((daySetup(plain, calm).startHp ?? 0) + 1)
    expect(daySetup(nursed, calm).startDeck?.filter((card) => card === 'wound')).toHaveLength(0)
    expect(daySetup(start([ally('a1', 'scout')]), calm).scouted).toHaveLength(2)
  })

  it('an ally knocked out comes home wounded, rests a day, then is well again', () => {
    const campaign = start([ally('a1', 'soldier', { going: true })])
    const night1 = finishDay(campaign, day(campaign, home, { knockedOut: ['soldier'] }), calm)
    expect(night1.allies).toEqual([ally('a1', 'soldier', { wounded: true })])
    expect(night1.history[0]?.allies?.wounded).toEqual(['soldier'])
    expect(daySetup(night1, calm).startDeck).not.toContain('soldier')
    const night2 = finishDay(night1, day(night1, home), calm)
    expect(night2.allies).toEqual([ally('a1', 'soldier')])
  })

  it('lose the day and the allies with you are gone; those at home stay', () => {
    const campaign = start([ally('a1', 'soldier', { going: true }), ally('a2', 'bouncer')])
    const next = finishDay(campaign, day(campaign, killed), calm)
    expect(next.allies?.map((a) => a.card)).toEqual(['bouncer'])
    expect(next.history[0]?.allies?.died).toEqual(['soldier'])
  })

  it('allies eat every second night; without food they leave', () => {
    const night1 = start([ally('a1', 'nurse'), ally('a2', 'scout')], { food: 1, water: 1 })
    expect(finishDay(night1, day(night1, home), calm).allies).toHaveLength(2)
    const night2 = { ...night1, day: 2, food: 2 }
    const next = finishDay(night2, day(night2, home), calm)
    expect(next.allies?.map((a) => a.card)).toEqual(['nurse'])
    expect(next.history[0]?.allies?.left).toEqual(['scout'])
    expect(next.food).toBe(0)
  })

  it('the Bouncer builds every night and the Street Kid scrounges food every second night', () => {
    const campaign = start([ally('a1', 'bouncer'), ally('a2', 'streetKid')], { day: 2 })
    const next = finishDay(campaign, day(campaign, home), calm)
    expect(next.materials).toBe(1)
    expect(next.history[0]).toMatchObject({ allyFood: 1, allyMaterials: 1 })
  })

  it('a night raid takes food and water, unless the Soldier stands guard at home', () => {
    const raids = withRaid(1)
    const campaign = start([])
    const raided = finishDay(campaign, day(campaign, home), raids)
    expect(raided.history[0]?.raid).toBe('raided')
    expect(raided.food).toBe(5 - c.foodPerNight - c.allies.raid.food)
    const guarded = start([ally('a1', 'soldier')])
    const safe = finishDay(guarded, day(guarded, home), raids)
    expect(safe.history[0]?.raid).toBe('stopped')
    expect(safe.food).toBe(5 - c.foodPerNight)
  })
})
