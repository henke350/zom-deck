import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { texts } from '../data/texts.en'
import { cardOptions, freeMoveTargets, listActions } from './actions'
import { applyAction } from './engine'
import { cardsIn, makeState } from './testkit'
import type { Action, GameState } from './types'
import { validate } from './validate'

const fullDraw = ['sneak', 'sneak', 'sneak', 'sneak', 'sneak', 'sneak']

function play(state: GameState, action: Action): GameState {
  return applyAction(state, action).state
}

function reasonFor(state: GameState, action: Action): string | undefined {
  const result = validate(state, action)
  return result.ok ? undefined : result.reason
}

describe('free move', () => {
  it('moves one step to a neighbour without spending AP', () => {
    const result = applyAction(makeState(), { type: 'freeMove', to: 'street' })
    expect(result.state.player).toMatchObject({
      location: 'street',
      ap: balance.apPerTurn,
      freeMoveUsed: true,
    })
    expect(result.events).toEqual([
      { type: 'moved', from: 'shelter', to: 'street', by: 'free', apCost: 0 },
    ])
  })

  it('only goes to neighbours', () => {
    const state = makeState()
    expect(reasonFor(state, { type: 'freeMove', to: 'police' })).toBe(texts.reasons.notAdjacent)
    expect(reasonFor(state, { type: 'freeMove', to: 'shelter' })).toBe(texts.reasons.alreadyHere)
    expect(reasonFor(state, { type: 'freeMove', to: 'mars' })).toBe(texts.reasons.unknownLocation)
    expect(freeMoveTargets(state).sort()).toEqual(['houseA', 'street'])
  })

  it('can be used once per turn and comes back next turn', () => {
    const moved = play(makeState({ draw: fullDraw }), { type: 'freeMove', to: 'street' })
    expect(reasonFor(moved, { type: 'freeMove', to: 'pharmacy' })).toBe(texts.reasons.freeMoveUsed)
    const nextTurn = play(moved, { type: 'endTurn' })
    expect(nextTurn.player.freeMoveUsed).toBe(false)
    expect(reasonFor(nextTurn, { type: 'freeMove', to: 'pharmacy' })).toBeUndefined()
  })

  it('costs 1 AP while Heavy Load is in hand, and does not stack', () => {
    const state = makeState({ hand: ['heavyLoad', 'heavyLoad'] })
    const result = applyAction(state, { type: 'freeMove', to: 'street' })
    expect(result.state.player.ap).toBe(balance.apPerTurn - 1)
    expect(result.events[0]).toMatchObject({ type: 'moved', apCost: 1 })
  })

  it('is refused with Heavy Load in hand and no AP left', () => {
    const state = makeState({ hand: ['heavyLoad'], ap: 0 })
    expect(reasonFor(state, { type: 'freeMove', to: 'street' })).toBe(
      texts.reasons.freeMoveNeedsAp(1, 0),
    )
  })
})

describe('move cards', () => {
  it('Run moves one step and needs a destination', () => {
    const state = makeState({ hand: ['run'] })
    expect(reasonFor(state, { type: 'playCard', uid: 'h1' })).toBe(texts.reasons.chooseDestination)
    expect(
      reasonFor(state, { type: 'playCard', uid: 'h1', target: { location: 'supermarket' } }),
    ).toBe(texts.reasons.tooFar(1))
    const next = play(state, { type: 'playCard', uid: 'h1', target: { location: 'street' } })
    expect(next.player).toMatchObject({ location: 'street', ap: balance.apPerTurn - 1 })
    expect(next.player.freeMoveUsed).toBe(false)
  })

  it('Run works after the free move, for two steps in one turn', () => {
    let state = makeState({ hand: ['run'] })
    state = play(state, { type: 'freeMove', to: 'street' })
    state = play(state, { type: 'playCard', uid: 'h1', target: { location: 'supermarket' } })
    expect(state.player.location).toBe('supermarket')
  })

  it('Running Shoes move up to 2 steps', () => {
    const state = makeState({ hand: ['runningShoes'] })
    expect(reasonFor(state, { type: 'playCard', uid: 'h1', target: { location: 'police' } })).toBe(
      texts.reasons.tooFar(2),
    )
    const next = play(state, { type: 'playCard', uid: 'h1', target: { location: 'pharmacy' } })
    expect(next.player.location).toBe('pharmacy')
  })

  it('Running Shoes draw a card as a Follow-up to another Move card', () => {
    const state = makeState({ hand: ['run', 'runningShoes'], draw: ['bandage'] })
    let next = play(state, { type: 'playCard', uid: 'h1', target: { location: 'street' } })
    next = play(next, { type: 'playCard', uid: 'h2', target: { location: 'police' } })
    expect(next.player.location).toBe('police')
    expect(cardsIn(next.piles.hand)).toEqual(['bandage'])
  })

  it('Soft Soles move one step', () => {
    const next = play(makeState({ hand: ['softSoles'] }), {
      type: 'playCard',
      uid: 'h1',
      target: { location: 'houseA' },
    })
    expect(next.player.location).toBe('houseA')
  })

  it('offers only reachable destinations to the UI', () => {
    const [option] = cardOptions(makeState({ hand: ['runningShoes'] }), 'h1')
    const targets = option?.actions.map((a) => a.target?.location).sort()
    expect(option?.target).toBe('location')
    expect(targets).toEqual(['houseA', 'houseB', 'pharmacy', 'street', 'supermarket', 'workshop'])
  })

  it('explains to the UI why a card has no legal use', () => {
    const [toolbox] = cardOptions(makeState({ hand: ['toolbox', 'heavyLoad'] }), 'h1')
    expect(toolbox?.actions).toHaveLength(0)
    expect(toolbox?.reason).toBe(texts.reasons.noTrashTarget)
    const [search] = cardOptions(makeState({ hand: ['search'] }), 'h1')
    expect(search?.reason).toBe(texts.reasons.nothingToSearch)
  })
})

describe('going home', () => {
  it('wins at once when you enter the shelter with enough packs', () => {
    const state = makeState({ location: 'street', packs: balance.packsToWin, hand: ['bandage'] })
    const result = applyAction(state, { type: 'freeMove', to: 'shelter' })
    expect(result.state.phase).toBe('gameOver')
    expect(result.state.outcome).toEqual({ result: 'won', cause: 'home', stars: 1 })
    expect(listActions(result.state)).toEqual([])
  })

  it('gives stars for extra packs', () => {
    const state = makeState({ location: 'houseA', packs: 4 })
    const result = applyAction(state, { type: 'freeMove', to: 'shelter' })
    expect(result.state.outcome?.stars).toBe(3)
  })

  it('stops a card mid-way when you win (no draw after arriving)', () => {
    const state = makeState({
      location: 'street',
      packs: 2,
      hand: ['run', 'runningShoes'],
      draw: ['bandage'],
    })
    let next = play(state, { type: 'playCard', uid: 'h1', target: { location: 'pharmacy' } })
    next = play(next, { type: 'playCard', uid: 'h2', target: { location: 'shelter' } })
    expect(next.phase).toBe('gameOver')
    expect(next.piles.hand).toHaveLength(0)
  })

  it('is just a safe place when you have too few packs', () => {
    const state = makeState({ location: 'street', packs: balance.packsToWin - 1 })
    const next = play(state, { type: 'freeMove', to: 'shelter' })
    expect(next.phase).toBe('action')
    expect(next.player.location).toBe('shelter')
  })
})
