import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { applyAction } from './engine'
import { cardsIn, makeState } from './testkit'
import type { Action, GameState } from './types'
import { validate } from './validate'
import { previewEndTurn } from './zombies'
import { defaultContent } from '../data/content'

const draw = ['bandage', 'bandage', 'bandage', 'bandage', 'bandage', 'bandage', 'bandage']

function play(state: GameState, action: Action): GameState {
  return applyAction(state, action).state
}

describe('gear', () => {
  it('stays in front of you when the turn ends, and still counts as your card', () => {
    const state = makeState({ hand: ['kevlarVest'], draw })
    const worn = play(state, { type: 'playCard', uid: 'h1' })
    expect(cardsIn(worn.piles.gear)).toEqual(['kevlarVest'])
    expect(worn.gearLeft.h1).toBe(3)
    const next = play(worn, { type: 'endTurn' })
    expect(cardsIn(next.piles.gear)).toEqual(['kevlarVest'])
    expect(cardsIn(next.piles.discard)).not.toContain('kevlarVest')
  })

  it('Kevlar Vest takes 1 damage per zombie phase and wears out after 3', () => {
    let state = makeState({
      location: 'houseA',
      gear: ['kevlarVest'],
      gearLeft: { g1: 1 },
      zombies: [{ at: 'houseA' }, { at: 'houseA' }],
      draw,
    })
    const preview = previewEndTurn(state, defaultContent)
    expect(preview).toMatchObject({ blocked: 1, damage: 1 })
    state = play(state, { type: 'endTurn' })
    expect(state.player.hp).toBe(balance.maxHp - 1)
    expect(state.piles.gear).toHaveLength(0)
    expect(cardsIn(state.piles.discard)).toContain('kevlarVest')
    expect(state.stats.damageBlocked).toBe(1)
  })

  it('Running Shoes let the free move go 2 steps', () => {
    const plain = makeState({ draw })
    expect(validate(plain, { type: 'freeMove', to: 'pharmacy' }).ok).toBe(false)
    const shod = makeState({ hand: ['runningShoes'], draw })
    const worn = play(shod, { type: 'playCard', uid: 'h1' })
    const moved = play(worn, { type: 'freeMove', to: 'pharmacy' })
    expect(moved.player.location).toBe('pharmacy')
  })

  it('Running Shoes come off when a zombie hurts you, but not when the vest takes it all', () => {
    const hurt = play(
      makeState({ location: 'houseA', gear: ['runningShoes'], zombies: [{ at: 'houseA' }], draw }),
      { type: 'endTurn' },
    )
    expect(hurt.piles.gear).toHaveLength(0)
    expect(cardsIn(hurt.piles.discard)).toContain('runningShoes')
    const safe = play(
      makeState({
        location: 'houseA',
        gear: ['kevlarVest', 'runningShoes'],
        zombies: [{ at: 'houseA' }],
        draw,
      }),
      { type: 'endTurn' },
    )
    expect(cardsIn(safe.piles.gear)).toEqual(['kevlarVest', 'runningShoes'])
  })

  it('Flashlight adds a find to every search this turn and the next, then runs out', () => {
    const finds = (state: GameState) =>
      play(state, { type: 'quickSearch' }).pendingFind?.options.length ?? 0
    const base = makeState({ location: 'pharmacy', ap: 5, draw })
    const lit = play(
      { ...base, piles: { ...base.piles, hand: [{ uid: 'h1', card: 'flashlight' }] } },
      {
        type: 'playCard',
        uid: 'h1',
      },
    )
    expect(finds(lit)).toBe(finds(base) + 1)
    const nextTurn = play(lit, { type: 'endTurn' })
    expect(cardsIn(nextTurn.piles.gear)).toEqual(['flashlight'])
    const after = play(nextTurn, { type: 'endTurn' })
    expect(after.piles.gear).toHaveLength(0)
    expect(cardsIn([...after.piles.discard, ...after.piles.hand, ...after.piles.draw])).toContain(
      'flashlight',
    )
  })
})
