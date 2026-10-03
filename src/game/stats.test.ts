import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { applyAction, previewOutcome } from './engine'
import { newGame } from './setup'
import { expeditionResult } from './stats'
import { makeState, type StateSpec } from './testkit'
import type { Action, GameState } from './types'

const draw = ['bandage', 'bandage', 'bandage', 'bandage', 'bandage', 'bandage']

function play(state: GameState, ...actions: Action[]): GameState {
  return actions.reduce((s, a) => applyAction(s, a).state, state)
}

function start(spec: StateSpec): GameState {
  return makeState({ draw, ...spec })
}

describe('expedition stats', () => {
  it('start at zero with the starting health', () => {
    const state = newGame(1, { setup: { startHp: 7 } })
    expect(state.stats).toMatchObject({ startHp: 7, steps: 0, searches: 0, damageFromZombies: 0 })
  })

  it('tell followers apart from zombies that were already there', () => {
    const state = play(
      start({
        location: 'street',
        zombies: [{ at: 'street' }, { at: 'houseA', alerted: true }],
      }),
      { type: 'endTurn' },
    )
    expect(state.stats).toMatchObject({
      attacksByFollowers: 1,
      attacksByZombiesThere: 1,
      damageFromZombies: 2 * balance.zombie.damage,
    })
  })

  it('count blocked damage and only the health actually lost', () => {
    const state = play(
      start({ location: 'houseA', hand: ['kevlarVest'], zombies: [{ at: 'houseA' }] }),
      { type: 'playCard', uid: 'h1' },
      { type: 'endTurn' },
    )
    expect(state.stats.damageBlocked).toBe(balance.zombie.damage)
    expect(state.stats.damageFromZombies).toBe(0)
  })

  it('count health lost to your own cards separately', () => {
    const state = play(start({ hand: ['adrenaline'] }), { type: 'playCard', uid: 'h1' })
    expect(state.stats.damageFromCards).toBe(1)
    expect(state.stats.damageFromZombies).toBe(0)
  })

  it('count healing, but not past full health', () => {
    const state = play(start({ hp: balance.maxHp - 1, hand: ['bandage'] }), {
      type: 'playCard',
      uid: 'h1',
      mode: 1,
    })
    expect(state.stats.healed).toBe(1)
    expect(state.stats.cardsRemoved).toBe(1)
  })

  it('count your noise apart from dusk, and where arrivals came from', () => {
    const noisy = play(
      start({ location: 'houseA', hand: ['pistol'], noise: 3, zombies: [{ at: 'houseA' }] }),
      { type: 'playCard', uid: 'h1', target: { zombie: 'z1' } },
    )
    expect(noisy.stats).toMatchObject({ noiseMade: 2, zombiesFromNoise: 1, zombiesKilled: 1 })

    const dusk = play(start({ location: 'street', turn: balance.duskFromTurn, noise: 3 }), {
      type: 'endTurn',
    })
    expect(dusk.stats).toMatchObject({ noiseMade: 0, zombiesFromDusk: 1 })
  })

  it('count searches, packs, finds and steps', () => {
    let state = start({ location: 'street', hand: ['run', 'search'], packsAt: ['houseA'] })
    state = play(state, { type: 'playCard', uid: 'h1', target: { location: 'houseA' } })
    state = play(state, { type: 'playCard', uid: 'h2' })
    const find = state.pendingFind?.options[0]
    if (!find) throw new Error('expected finds')
    state = play(state, { type: 'takeFind', card: find })
    expect(state.stats).toMatchObject({ steps: 1, searches: 1, packsFound: 1, cardsTaken: [find] })
  })
})

describe('expedition result', () => {
  it('is only there when the expedition is over', () => {
    const going = start({ location: 'street', packs: 2 })
    expect(expeditionResult(going)).toBeUndefined()
    const home = play(going, { type: 'freeMove', to: 'shelter' })
    expect(expeditionResult(home)).toEqual({
      outcome: { result: 'won', cause: 'home', stars: 1 },
      packs: 2,
      hpLeft: balance.maxHp,
      turnsUsed: 1,
      cardsFound: [],
      stats: home.stats,
    })
  })

  it('never reports negative health', () => {
    const dead = play(start({ hp: 1, location: 'houseA', zombies: [{ at: 'houseA' }] }), {
      type: 'endTurn',
    })
    expect(expeditionResult(dead)?.hpLeft).toBe(0)
    expect(expeditionResult(dead)?.outcome.cause).toBe('killed')
  })
})

describe('outcome preview', () => {
  it('shows that walking home with enough packs wins, without changing the game', () => {
    const state = start({ location: 'street', packs: 3 })
    expect(previewOutcome(state, { type: 'freeMove', to: 'shelter' })).toEqual({
      result: 'won',
      cause: 'home',
      stars: 2,
    })
    expect(state.phase).toBe('action')
  })

  it('is empty when the game goes on or the action is illegal', () => {
    const state = start({ location: 'street', packs: 1 })
    expect(previewOutcome(state, { type: 'freeMove', to: 'shelter' })).toBeUndefined()
    expect(previewOutcome(state, { type: 'freeMove', to: 'police' })).toBeUndefined()
  })
})
