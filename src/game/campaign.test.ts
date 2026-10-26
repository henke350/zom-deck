import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { defaultContent } from '../data/content'
import { texts } from '../data/texts.en'
import {
  build,
  chooseLocker,
  dayBalance,
  daySeed,
  daySetup,
  finishDay,
  lockerChoices,
  newCampaign,
  validateBuild,
  type CampaignState,
} from './campaign'
import { cityContent } from './city'
import { applyAction } from './engine'
import { checkInvariants } from './invariants'
import { performSearch } from './search'
import { newGame } from './setup'
import type { CardInstance, GameState, Outcome } from './types'

const c = balance.campaign
const home: Outcome = { result: 'won', cause: 'home', stars: 1 }
const killed: Outcome = { result: 'lost', cause: 'killed' }

function startDay(campaign: CampaignState): GameState {
  return newGame(daySeed(campaign), {
    balance: dayBalance(campaign),
    setup: daySetup(campaign),
  })
}

/** Ends today's expedition with this outcome, as if the packs and Salvage had been found. */
function ended(
  state: GameState,
  outcome: Outcome,
  found: { food?: number; water?: number; salvage?: number } = {},
): GameState {
  const sites = { ...state.sites }
  let food = found.food ?? 0
  let water = found.water ?? 0
  for (const [id, site] of Object.entries(sites)) {
    const kind = food > 0 ? 'food' : water > 0 ? 'water' : undefined
    if (!kind) break
    if (kind === 'food') food--
    else water--
    sites[id] = { ...site, hasPack: false, packTaken: true, packKind: kind }
  }
  const salvage: CardInstance[] = Array.from({ length: found.salvage ?? 0 }, (_, i) => ({
    uid: `s${i}`,
    card: 'salvage',
  }))
  return {
    ...state,
    phase: 'gameOver',
    outcome,
    sites,
    piles: { ...state.piles, discard: [...state.piles.discard, ...salvage] },
  }
}

describe('a new campaign', () => {
  it('rolls one city for every day, the same for the same seed', () => {
    const a = newCampaign(42)
    expect(a.city).toBeDefined()
    expect(newCampaign(42).city).toEqual(a.city)
    expect(a).toMatchObject({ day: 1, food: c.startFood, water: c.startWater, materials: 0 })
    const day1 = startDay(a)
    const day2 = startDay({ ...a, day: 2 })
    expect(day1.city).toEqual(a.city)
    expect(day2.city).toEqual(a.city)
    expect(daySeed({ ...a, day: 2 })).not.toBe(daySeed(a))
  })

  it('gives every pack a kind, food or water, and lets you go home empty-handed', () => {
    const state = startDay(newCampaign(7))
    expect(state.campaignDay).toBe(1)
    const packs = Object.values(state.sites).filter((s) => s.hasPack)
    expect(packs).toHaveLength(balance.packsOnMap)
    for (const site of packs) expect(['food', 'water']).toContain(site.packKind)
    expect(state.balance.packsToWin).toBe(c.packsToGoHome)
    expect(checkInvariants(state, defaultContent)).toEqual([])
  })

  it('keeps packs without a kind and no Salvage in a single expedition', () => {
    const state = newGame(7)
    expect(state.campaignDay).toBeUndefined()
    expect(Object.values(state.sites).some((s) => s.packKind)).toBe(false)
  })
})

describe('Salvage', () => {
  it('only turns up among the finds in a campaign', () => {
    const content = { ...defaultContent }
    const workshop = (state: GameState) => {
      const here = cityContent(state, content)
      const id = Object.values(here.locations).find((l) => l.lootPool?.some((e) => e.campaignOnly))
      return { here, id: id?.id ?? '' }
    }
    const day = startDay(newCampaign(3))
    const { here, id } = workshop(day)
    const salvageSeen = (state: GameState) => {
      for (let seed = 1; seed < 60; seed++) {
        const at = { ...state, rng: seed, player: { ...state.player, location: id } }
        const searched = performSearch(at, here, { base: 3, extra: 3, quick: false, noise: 0 }, [])
        if (searched.pendingFind?.options.includes('salvage')) return true
      }
      return false
    }
    expect(salvageSeen(day)).toBe(true)
    const { campaignDay: _day, ...single } = day
    expect(salvageSeen(single)).toBe(false)
  })
})

describe('the start of a day', () => {
  it('starts from the starter deck and full health on day 1', () => {
    const setup = daySetup(newCampaign(1))
    expect(setup.startDeck).toHaveLength(10)
    expect(setup.startHp).toBe(balance.maxHp)
    expect(setup.scouted).toEqual([])
  })

  it('adds the penalties from the evening before', () => {
    const campaign = { ...newCampaign(1), hungry: true, thirsty: true, wounds: 2 }
    const setup = daySetup(campaign)
    const count = (card: string) => setup.startDeck?.filter((id) => id === card).length
    expect(count('nerves')).toBe(balance.starterDeck.nerves + c.hungerNerves)
    expect(count('wound')).toBe(2)
    expect(setup.startHp).toBe(balance.maxHp - c.thirstHp)
  })

  it('applies the upgrades: Workbench, Infirmary, Lookout and Locker', () => {
    const campaign: CampaignState = {
      ...newCampaign(1),
      upgrades: ['workbench', 'infirmary', 'lookout'],
      locker: 'axe',
    }
    const setup = daySetup(campaign)
    const nerves = setup.startDeck?.filter((id) => id === 'nerves').length
    expect(nerves).toBe(balance.starterDeck.nerves - c.workbenchNerves)
    expect(setup.startDeck).toContain('axe')
    expect(setup.startHp).toBe(balance.maxHp + c.infirmaryHp)
    expect(setup.scouted).toHaveLength(c.lookoutBuildings)
    const state = startDay(campaign)
    expect(state.balance.maxHp).toBe(balance.maxHp + c.infirmaryHp)
    for (const id of setup.scouted ?? []) expect(state.sites[id]?.scouted).toBe(true)
  })

  it('brings more zombies on later days', () => {
    const campaign = newCampaign(1)
    const last = { ...campaign, day: c.days }
    expect(dayBalance(last).extraStartZombies).toBe(c.extraZombiesByDay.at(-1))
    expect(dayBalance(campaign).extraStartZombies).toBe(c.extraZombiesByDay[0])
  })
})

describe('the evening', () => {
  it('brings home food, water and materials, then eats and drinks', () => {
    const campaign = newCampaign(5)
    const next = finishDay(
      campaign,
      ended(startDay(campaign), home, { food: 2, water: 1, salvage: 3 }),
    )
    expect(next).toMatchObject({
      day: 2,
      food: 2 - c.foodPerNight,
      water: 1 - c.waterPerNight,
      materials: 3,
      hungry: false,
      thirsty: false,
    })
    expect(next.history[0]).toMatchObject({ day: 1, food: 2, water: 1, materials: 3, ate: true })
  })

  it('goes hungry or thirsty without supplies, and the next day pays for it', () => {
    const campaign = newCampaign(5)
    const next = finishDay(campaign, ended(startDay(campaign), home, { food: 1 }))
    expect(next).toMatchObject({ hungry: false, thirsty: true, food: 0, water: 0 })
    expect(next.history[0]).toMatchObject({ ate: true, drank: false })
  })

  it('loses the day’s finds when you do not come home, and adds Wounds', () => {
    const campaign = { ...newCampaign(5), food: 1, water: 1 }
    const next = finishDay(campaign, ended(startDay(campaign), killed, { food: 2, salvage: 2 }))
    expect(next).toMatchObject({ losses: 1, materials: 0, wounds: c.woundsAfterLoss, food: 0 })
    expect(next.history[0]?.cardsFound).toEqual([])
    expect(daySetup(next).startDeck?.filter((id) => id === 'wound')).toHaveLength(c.woundsAfterLoss)
  })

  it('ends the campaign after one lost day too many', () => {
    const campaign = { ...newCampaign(5), losses: c.lossesAllowed }
    const next = finishDay(campaign, ended(startDay(campaign), killed))
    expect(next.over).toBe('lost')
    expect(next.day).toBe(1)
  })

  it('is survived after the last day', () => {
    const campaign = { ...newCampaign(5), day: c.days }
    const next = finishDay(campaign, ended(startDay(campaign), home))
    expect(next.over).toBe('survived')
    expect(() => finishDay(next, ended(startDay(next), home))).toThrow()
  })

  it('lets the Garden and Rain Collector produce every second night', () => {
    const campaign: CampaignState = { ...newCampaign(5), upgrades: ['garden', 'rainCollector'] }
    const night1 = finishDay(campaign, ended(startDay(campaign), home))
    expect(night1.history[0]).toMatchObject({ producedFood: 0, producedWater: 0 })
    const night2 = finishDay(night1, ended(startDay(night1), home))
    expect(night2.history[1]).toMatchObject({ producedFood: 1, producedWater: 1 })
    expect(night2).toMatchObject({ food: 1, water: 1 })
  })
})

describe('the city remembers', () => {
  it('keeps the buildings you got to know and the searches you used', () => {
    const campaign = newCampaign(11)
    let state = startDay(campaign)
    const content = cityContent(state, defaultContent)
    const target = Object.keys(state.sites).find((id) =>
      content.connections.some(
        ([a, b]) => (a === 'street' && b === id) || (b === 'street' && a === id),
      ),
    )
    expect(target).toBeDefined()
    if (!target) return
    state = applyAction(state, { type: 'freeMove', to: 'street' }, content).state
    const plundered = {
      ...state,
      sites: { ...state.sites, [target]: { ...state.sites[target]!, searchesLeft: 0 } },
    }
    // Without regrowth the building stays empty.
    const still = { ...balance, campaign: { ...c, searchesRegrowPerNight: 0 } }
    const next = finishDay(campaign, ended(plundered, home), still)
    expect(next.known).toContain(target)
    expect(next.searchesUsed[target]).toBe(balance.searchesPerBuilding)
    const day2 = newGame(daySeed(next), {
      balance: dayBalance(next, still),
      setup: daySetup(next, still),
    })
    expect(day2.known).toContain(target)
    expect(day2.sites[target]).toMatchObject({ searchesLeft: 0, hasPack: false, stash: 'none' })
    expect(checkInvariants(day2, defaultContent)).toEqual([])

    // With regrowth it gets some searches back overnight.
    const regrown = finishDay(campaign, ended(plundered, home))
    expect(regrown.searchesUsed[target]).toBe(
      balance.searchesPerBuilding - c.searchesRegrowPerNight,
    )
    expect(startDay(regrown).sites[target]?.searchesLeft).toBe(c.searchesRegrowPerNight)
  })

  it('places fewer packs when too few buildings are left', () => {
    const campaign = newCampaign(11)
    const all = Object.keys(startDay(campaign).sites)
    const used = Object.fromEntries(all.slice(2).map((id) => [id, balance.searchesPerBuilding]))
    const state = startDay({ ...campaign, searchesUsed: used })
    expect(Object.values(state.sites).filter((s) => s.hasPack)).toHaveLength(2)
    expect(state.packsPlaced).toBe(2)
    expect(checkInvariants(state, defaultContent)).toEqual([])
  })
})

describe('the base', () => {
  it('builds an upgrade for materials, once', () => {
    const campaign = { ...newCampaign(1), materials: 5 }
    expect(validateBuild(campaign, 'garden')).toEqual({
      ok: false,
      reason: texts.campaign.reasons.materials(c.upgradeCost.garden, 5),
    })
    const built = build(campaign, 'lookout')
    expect(built).toMatchObject({ materials: 5 - c.upgradeCost.lookout, upgrades: ['lookout'] })
    expect(validateBuild(built, 'lookout')).toEqual({
      ok: false,
      reason: texts.campaign.reasons.built,
    })
    expect(() => build(built, 'lookout')).toThrow()
  })

  it('lets the Locker keep one of yesterday’s finds', () => {
    const campaign: CampaignState = { ...newCampaign(1), upgrades: ['locker'] }
    const state = ended(startDay(campaign), home)
    const withFinds = { ...state, stats: { ...state.stats, cardsTaken: ['axe', 'bandage'] } }
    const next = finishDay(campaign, withFinds)
    expect(lockerChoices(next)).toEqual(['axe', 'bandage'])
    const kept = chooseLocker(next, 'axe')
    expect(daySetup(kept).startDeck).toContain('axe')
    expect(() => chooseLocker(next, 'shotgun')).toThrow()
    expect(chooseLocker(kept, undefined).locker).toBeUndefined()
    expect(lockerChoices(newCampaign(1))).toEqual([])
  })
})

describe('the Stray Dog in a campaign', () => {
  const d = balance.dog
  const withDog = (state: GameState, hp: number): GameState => ({
    ...state,
    dog: { hp, bitten: false },
  })

  it('comes home with you, heals overnight and comes along the next day', () => {
    const campaign = newCampaign(9)
    const next = finishDay(
      campaign,
      withDog(ended(startDay(campaign), home, { food: 1, water: 1 }), 1),
    )
    expect(next.history[0]?.dog).toBe('joined')
    expect(next.dog).toEqual({ hp: 1 + d.healPerNight })
    expect(daySetup(next).dog).toEqual({ hp: 1 + d.healPerNight })
    expect(startDay(next).dog).toEqual({ hp: 1 + d.healPerNight, bitten: false })
  })

  it('eats every few nights, or runs away when there is no food', () => {
    const campaign: CampaignState = { ...newCampaign(9), day: d.foodEvery, dog: { hp: d.hp } }
    const fed = finishDay(
      campaign,
      withDog(ended(startDay(campaign), home, { food: 2, water: 1 }), d.hp),
    )
    expect(fed.history[0]?.dog).toBe('ate')
    expect(fed.food).toBe(2 - c.foodPerNight - 1)
    expect(fed.dog).toBeDefined()

    const hungry = finishDay(
      campaign,
      withDog(ended(startDay(campaign), home, { food: 1, water: 1 }), d.hp),
    )
    expect(hungry.history[0]?.dog).toBe('ranAway')
    expect(hungry.dog).toBeUndefined()
  })

  it('is gone for good when it died during the day', () => {
    const campaign: CampaignState = { ...newCampaign(9), dog: { hp: 1 } }
    const { dog: _died, ...withoutDog } = ended(startDay(campaign), home)
    const next = finishDay(campaign, withoutDog)
    expect(next.history[0]?.dog).toBe('died')
    expect(next.dog).toBeUndefined()
  })
})
