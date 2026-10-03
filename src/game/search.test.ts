import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { defaultContent } from '../data/content'
import { texts } from '../data/texts.en'
import { ownedCount } from './deck'
import { applyAction } from './engine'
import { drawFinds, placePacks } from './search'
import { newGame } from './setup'
import { cardsIn, makeState } from './testkit'
import type { Action, GameState } from './types'
import { validate } from './validate'

function play(state: GameState, action: Action): GameState {
  return applyAction(state, action).state
}

function reasonFor(state: GameState, action: Action): string | undefined {
  const result = validate(state, action)
  return result.ok ? undefined : result.reason
}

describe('pack placement', () => {
  const buildings = Object.values(defaultContent.locations)
    .filter((l) => l.kind === 'building')
    .map((l) => l.id)

  it('always places 4 packs, one in the Supermarket, never in Shelter or Street (1,000 seeds)', () => {
    const counts: Record<string, number> = {}
    for (let seed = 1; seed <= 1000; seed++) {
      const { sites } = newGame(seed)
      const withPack = Object.entries(sites)
        .filter(([, s]) => s.hasPack)
        .map(([id]) => id)
      expect(withPack).toHaveLength(balance.packsOnMap)
      expect(withPack).toContain('supermarket')
      expect(Object.keys(sites).sort()).toEqual([...buildings].sort())
      for (const id of withPack) counts[id] = (counts[id] ?? 0) + 1
    }
    // The other five buildings share three packs: each should get one about 60% of the time.
    for (const id of buildings.filter((b) => b !== 'supermarket')) {
      expect(counts[id]).toBeGreaterThan(500)
      expect(counts[id]).toBeLessThan(700)
    }
  })

  it('refuses impossible pack counts', () => {
    expect(() => placePacks(defaultContent, { ...balance, packsOnMap: 9 }, 1)).toThrow()
    expect(() => placePacks(defaultContent, { ...balance, packsOnMap: 0 }, 1)).toThrow()
  })
})

describe('drawFinds', () => {
  const pool = [
    { card: 'axe', weight: 5 },
    { card: 'toolbox', weight: 1 },
    { card: 'lockpick', weight: 1 },
    { card: 'pistol', weight: 0 },
  ]

  it('returns different cards and never more than the pool holds', () => {
    const [finds] = drawFinds(pool, 10, 42)
    expect(new Set(finds).size).toBe(finds.length)
    expect(finds.sort()).toEqual(['axe', 'lockpick', 'toolbox'])
  })

  it('never returns a card with weight 0', () => {
    for (let seed = 0; seed < 200; seed++)
      expect(drawFinds(pool, 3, seed)[0]).not.toContain('pistol')
  })

  it('follows the weights', () => {
    let axeFirst = 0
    for (let seed = 0; seed < 1000; seed++) if (drawFinds(pool, 1, seed)[0][0] === 'axe') axeFirst++
    expect(axeFirst).toBeGreaterThan(620) // expected 5/7 ≈ 714
    expect(axeFirst).toBeLessThan(800)
  })

  it('is the same for the same generator state', () => {
    expect(drawFinds(pool, 2, 7)).toEqual(drawFinds(pool, 2, 7))
  })
})

describe('searching', () => {
  const atWorkshop = (extra: Parameters<typeof makeState>[0] = {}) =>
    makeState({ location: 'workshop', hand: ['search', 'nerves', 'heavyLoad'], ...extra })

  it('reveals 3 finds, uses a search and waits for a choice', () => {
    const result = applyAction(atWorkshop(), { type: 'playCard', uid: 'h1' })
    const { state } = result
    expect(state.phase).toBe('chooseFind')
    // No zombies here, so the search is "in peace": +1 find.
    expect(state.pendingFind?.options).toHaveLength(
      balance.searchOptions + balance.peacefulSearchBonus,
    )
    expect(state.sites.workshop?.searchesLeft).toBe(balance.searchesPerBuilding - 1)
    expect(state.player.ap).toBe(balance.apPerTurn - 1)
    expect(result.events).toContainEqual(
      expect.objectContaining({ type: 'searched', quick: false }),
    )
  })

  it('only works in buildings with searches left', () => {
    expect(reasonFor(makeState({ hand: ['search'] }), { type: 'playCard', uid: 'h1' })).toBe(
      texts.reasons.nothingToSearch,
    )
    expect(
      reasonFor(makeState({ location: 'street', hand: ['search'] }), {
        type: 'playCard',
        uid: 'h1',
      }),
    ).toBe(texts.reasons.nothingToSearch)
    const empty = atWorkshop({ searchesLeft: { workshop: 0 } })
    expect(reasonFor(empty, { type: 'playCard', uid: 'h1' })).toBe(texts.reasons.searchedOut)
  })

  it('allows 2 searches per building, even when you take nothing', () => {
    let state = makeState({ location: 'workshop', hand: ['search', 'search', 'search'] })
    state = play(play(state, { type: 'playCard', uid: 'h1' }), { type: 'declineFind' })
    state = play(play(state, { type: 'playCard', uid: 'h2' }), { type: 'declineFind' })
    expect(state.sites.workshop?.searchesLeft).toBe(0)
    expect(reasonFor(state, { type: 'playCard', uid: 'h3' })).toBe(texts.reasons.searchedOut)
  })

  it('adds and then spends the search bonus (Crowbar, Flashlight)', () => {
    let state = makeState({ location: 'workshop', hand: ['crowbar', 'flashlight', 'search'] })
    state = play(state, { type: 'playCard', uid: 'h1', mode: 1 })
    state = play(state, { type: 'playCard', uid: 'h2' })
    state = play(state, { type: 'playCard', uid: 'h3' })
    expect(state.pendingFind?.options).toHaveLength(5)
    expect(state.player.searchBonus).toBe(0)
  })

  it('Lockpick reveals one more as a Follow-up to a Quiet card', () => {
    let state = makeState({ location: 'workshop', hand: ['sneak', 'lockpick'], tags: ['quiet'] })
    state = play(state, { type: 'playCard', uid: 'h2' })
    expect(state.pendingFind?.options).toHaveLength(
      balance.searchOptions + 1 + balance.peacefulSearchBonus,
    )
  })

  it('shows fewer finds when the pool runs out', () => {
    const tiny = {
      ...defaultContent,
      locations: {
        ...defaultContent.locations,
        workshop: { ...defaultContent.locations.workshop!, lootPool: [{ card: 'axe', weight: 1 }] },
      },
    }
    const state = applyAction(atWorkshop(), { type: 'playCard', uid: 'h1' }, tiny).state
    expect(state.pendingFind?.options).toEqual(['axe'])
  })
})

describe('quick search', () => {
  it('costs 2 AP, needs no card and shows 2 finds', () => {
    const state = play(makeState({ location: 'pharmacy' }), { type: 'quickSearch' })
    expect(state.player.ap).toBe(balance.apPerTurn - balance.quickSearch.cost)
    expect(state.pendingFind?.options).toHaveLength(
      balance.quickSearch.options + balance.peacefulSearchBonus,
    )
    expect(state.sites.pharmacy?.searchesLeft).toBe(balance.searchesPerBuilding - 1)
  })

  it('is refused without enough AP or outside buildings', () => {
    expect(reasonFor(makeState({ location: 'pharmacy', ap: 1 }), { type: 'quickSearch' })).toBe(
      texts.reasons.notEnoughAp(2, 1),
    )
    expect(reasonFor(makeState(), { type: 'quickSearch' })).toBe(texts.reasons.nothingToSearch)
  })
})

describe('choosing a find', () => {
  const searched = () =>
    play(makeState({ location: 'workshop', hand: ['search', 'nerves', 'heavyLoad'] }), {
      type: 'playCard',
      uid: 'h1',
    })

  it('puts a taken find in the discard pile with a new id', () => {
    const state = searched()
    const card = state.pendingFind?.options[0] ?? ''
    const next = play(state, { type: 'takeFind', card })
    expect(next.phase).toBe('action')
    expect(next.pendingFind).toBeUndefined()
    expect(next.piles.discard.at(-1)).toEqual({ uid: `c${state.nextUid}`, card })
    expect(ownedCount(next.piles)).toBe(ownedCount(state.piles) + 1)
  })

  it('only takes one of the revealed finds', () => {
    const state = searched()
    const notOffered = ['axe', 'toolbox', 'lockpick', 'flashlight', 'molotov', 'pistol'].find(
      (c) => !state.pendingFind?.options.includes(c),
    )
    expect(reasonFor(state, { type: 'takeFind', card: notOffered ?? 'pistol' })).toBe(
      texts.reasons.notAFind,
    )
  })

  it('can scrap a card from hand instead, but never Heavy Load', () => {
    const state = searched()
    expect(reasonFor(state, { type: 'scrapCard', uid: 'h3' })).toBe(texts.reasons.notTrashable)
    const next = play(state, { type: 'scrapCard', uid: 'h2' })
    expect(cardsIn(next.piles.removed)).toEqual(['nerves'])
    expect(ownedCount(next.piles)).toBe(ownedCount(state.piles) - 1)
  })

  it('can take nothing', () => {
    const state = searched()
    const next = applyAction(state, { type: 'declineFind' })
    expect(next.events).toEqual([
      { type: 'findDeclined' },
      {
        type: 'noiseAdded',
        amount: balance.searchNoise,
        total: balance.searchNoise,
        reason: 'noise',
      },
    ])
    expect(ownedCount(next.state.piles)).toBe(ownedCount(state.piles))
  })

  it('blocks every other action until you choose', () => {
    const state = searched()
    for (const action of [
      { type: 'endTurn' },
      { type: 'freeMove', to: 'houseA' },
      { type: 'quickSearch' },
    ] as const) {
      expect(reasonFor(state, action)).toBe(texts.reasons.chooseFindFirst)
    }
  })

  it('has nothing to choose outside a search', () => {
    expect(reasonFor(makeState(), { type: 'declineFind' })).toBe(texts.reasons.noFindToChoose)
  })
})

describe('supply packs', () => {
  it('are found on the first search and add a Heavy Load', () => {
    const state = makeState({ location: 'pharmacy', packsAt: ['pharmacy'] })
    const result = applyAction(state, { type: 'quickSearch' })
    expect(result.state.player.packs).toBe(1)
    expect(result.state.pendingFind?.packFound).toBe(true)
    expect(result.state.sites.pharmacy).toMatchObject({ hasPack: false, packTaken: true })
    expect(cardsIn(result.state.piles.discard)).toEqual(['heavyLoad'])
    expect(result.events).toContainEqual({ type: 'packFound', location: 'pharmacy', packs: 1 })
  })

  it('are not found again on the second search', () => {
    let state = makeState({ location: 'pharmacy', ap: 5, packsAt: ['pharmacy'] })
    state = play(play(state, { type: 'quickSearch' }), { type: 'declineFind' })
    state = play(state, { type: 'quickSearch' })
    expect(state.player.packs).toBe(1)
    expect(state.pendingFind?.packFound).toBe(false)
  })

  it('are not in buildings without one', () => {
    const state = play(makeState({ location: 'pharmacy' }), { type: 'quickSearch' })
    expect(state.player.packs).toBe(0)
    expect(state.piles.discard).toHaveLength(0)
  })

  it('wait in the Supermarket in every real game', () => {
    const start = newGame(4711)
    const there = { ...start, player: { ...start.player, location: 'supermarket' } }
    expect(play(there, { type: 'quickSearch' }).player.packs).toBe(1)
  })

  it('bring victory when you carry 2 home', () => {
    let state = makeState({ location: 'houseA', ap: 5, packsAt: ['houseA', 'workshop'] })
    state = play(play(state, { type: 'quickSearch' }), { type: 'declineFind' })
    state = { ...state, player: { ...state.player, location: 'workshop' } }
    state = play(play(state, { type: 'quickSearch' }), { type: 'declineFind' })
    state = { ...state, player: { ...state.player, location: 'houseA' } }
    const home = applyAction(state, { type: 'freeMove', to: 'shelter' }).state
    expect(home.outcome).toEqual({ result: 'won', cause: 'home', stars: 1 })
  })
})
