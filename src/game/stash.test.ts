import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { defaultContent } from '../data/content'
import { texts } from '../data/texts.en'
import { applyAction } from './engine'
import { newGame } from './setup'
import { cardsIn, makeState } from './testkit'
import type { Action, GameState } from './types'
import { validate } from './validate'

const rare = new Set(
  Object.values(defaultContent.cards)
    .filter((c) => c.rare)
    .map((c) => c.id),
)

function play(state: GameState, action: Action): GameState {
  return applyAction(state, action).state
}

function reasonFor(state: GameState, action: Action): string | undefined {
  const result = validate(state, action)
  return result.ok ? undefined : result.reason
}

describe('locked stashes', () => {
  it('are hidden in exactly the set number of buildings (300 seeds)', () => {
    const seen = new Set<string>()
    for (let seed = 1; seed <= 300; seed++) {
      const sites = Object.entries(newGame(seed).sites)
      const stashes = sites.filter(([, s]) => s.stash !== 'none')
      expect(stashes).toHaveLength(balance.stashesOnMap)
      for (const [id, s] of stashes) {
        expect(s.stash).toBe('hidden')
        seen.add(id)
      }
    }
    expect(seen.size).toBe(Object.keys(newGame(1).sites).length)
  })

  it('are found by the first search there', () => {
    const state = makeState({ location: 'houseA', hand: ['search'], stashAt: { houseA: 'hidden' } })
    const { state: next, events } = applyAction(state, { type: 'playCard', uid: 'h1' })
    expect(events).toContainEqual({ type: 'stashFound', location: 'houseA' })
    expect(next.sites.houseA?.stash).toBe('found')
    expect(next.pendingFind?.stashFound).toBe(true)
  })

  it('open quietly with a Tool card and offer rare finds', () => {
    const state = makeState({ location: 'houseA', hand: ['crowbar'], stashAt: { houseA: 'found' } })
    const opened = play(state, { type: 'openStash', uid: 'h1' })
    expect(opened.player.ap).toBe(balance.apPerTurn - balance.stashToolCost)
    expect(cardsIn(opened.piles.inPlay)).toEqual(['crowbar'])
    expect(opened.phase).toBe('chooseFind')
    expect(opened.pendingFind?.fromStash).toBe(true)
    expect(opened.pendingFind?.options).toHaveLength(balance.stashOptions)
    for (const card of opened.pendingFind?.options ?? []) expect(rare.has(card)).toBe(true)
    const card = opened.pendingFind?.options[0] ?? ''
    const taken = play(opened, { type: 'takeFind', card })
    expect(cardsIn(taken.piles.discard)).toContain(card)
    expect(taken.noise).toBe(0)
    expect(taken.sites.houseA?.stash).toBe('opened')
    expect(taken.stats.stashesOpened).toBe(1)
  })

  it('can be forced open for more AP and noise', () => {
    const state = makeState({ location: 'houseA', stashAt: { houseA: 'found' } })
    const opened = play(state, { type: 'openStash' })
    expect(opened.player.ap).toBe(balance.apPerTurn - balance.stashForce.cost)
    const done = play(opened, { type: 'declineFind' })
    expect(done.noise).toBe(balance.stashForce.noise)
  })

  it('explain why they cannot be opened', () => {
    const closed = makeState({ location: 'houseA', hand: ['run'], stashAt: { houseA: 'found' } })
    expect(reasonFor(closed, { type: 'openStash', uid: 'h1' })).toBe(texts.reasons.notATool)
    const poor = makeState({ location: 'houseA', ap: 1, stashAt: { houseA: 'found' } })
    expect(reasonFor(poor, { type: 'openStash' })).toBe(
      texts.reasons.notEnoughAp(balance.stashForce.cost, 1),
    )
    const hidden = makeState({ location: 'houseA', stashAt: { houseA: 'hidden' } })
    expect(reasonFor(hidden, { type: 'openStash' })).toBe(texts.reasons.noStashHere)
    const opened = makeState({ location: 'houseA', stashAt: { houseA: 'opened' } })
    expect(reasonFor(opened, { type: 'openStash' })).toBe(texts.reasons.noStashHere)
  })

  it('burn with the building if a Molotov hits before they are opened', () => {
    const state = makeState({
      location: 'houseA',
      hand: ['molotov'],
      zombies: [{ at: 'houseA' }],
      stashAt: { houseA: 'found' },
    })
    expect(play(state, { type: 'playCard', uid: 'h1' }).sites.houseA?.stash).toBe('lost')
  })
})

describe('rare finds', () => {
  it('turn up in searches, but seldom (1000 searches)', () => {
    let withRare = 0
    for (let seed = 1; seed <= 1000; seed++) {
      const state = makeState({ seed, location: 'police', hand: ['search'] })
      const options = play(state, { type: 'playCard', uid: 'h1' }).pendingFind?.options ?? []
      if (options.some((c) => rare.has(c))) withRare++
    }
    expect(withRare).toBeGreaterThan(30)
    expect(withRare).toBeLessThan(200)
  })
})
