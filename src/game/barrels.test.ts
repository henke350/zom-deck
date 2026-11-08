import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { defaultContent } from '../data/content'
import { applyAction } from './engine'
import { distance, neighbors } from './map'
import { newGame } from './setup'
import { classicBalance, makeState } from './testkit'
import type { Action, GameState } from './types'
import { validate } from './validate'

const draw = ['bandage', 'bandage', 'bandage', 'bandage', 'bandage', 'bandage', 'bandage']
const play = (state: GameState, action: Action) => applyAction(state, action).state
const nextDoor = (from: string) =>
  neighbors(defaultContent, from).find((id) => defaultContent.locations[id]?.kind === 'building')!
const b = classicBalance.barrels

describe('fuel barrels', () => {
  it('stand in a few places that are not the Shelter, and do not change the rest of the game', () => {
    const state = newGame(9, { setup: { dayEvent: 'none' } })
    expect(state.barrels).toHaveLength(balance.barrels.count)
    for (const id of state.barrels ?? []) expect(id).not.toBe('shelter')
    const none = newGame(9, {
      setup: { dayEvent: 'none' },
      balance: { ...balance, barrels: { ...balance.barrels, count: 0 } },
    })
    expect(none.piles.hand).toEqual(state.piles.hand)
    expect(none.zombies).toEqual(state.zombies)
  })

  it('a barrel next door blows up every zombie there, Bats too, for AP and noise', () => {
    const target = nextDoor('houseA')
    const base = makeState({
      location: 'houseA',
      zombies: [{ at: target, hp: 3 }, { at: target, kind: 'bat' }, { at: 'houseA' }],
      draw,
    })
    const state = { ...base, barrels: [target] }
    const next = play(state, { type: 'igniteBarrel', location: target })
    expect(next.zombies.filter((z) => z.uid === 'z1' || z.uid === 'z2')).toHaveLength(0)
    expect(next.zombies.find((z) => z.uid === 'z3')).toBeTruthy()
    expect(next.player.ap).toBe(state.player.ap - b.cost)
    expect(next.player.hp).toBe(classicBalance.maxHp)
    expect(next.barrels).toEqual([])
  })

  it('lit where you stand it singes you; too far away, or where there is none, it cannot be lit', () => {
    const base = makeState({ location: 'houseA', zombies: [{ at: 'houseA' }], draw })
    const far = Object.keys(defaultContent.locations).find(
      (id) => distance(defaultContent, 'houseA', id) === 2,
    )!
    const state = { ...base, barrels: ['houseA', far] }
    expect(play(state, { type: 'igniteBarrel', location: 'houseA' }).player.hp).toBe(
      classicBalance.maxHp - b.selfDamage,
    )
    expect(validate(state, { type: 'igniteBarrel', location: far }).ok).toBe(false)
    expect(validate(state, { type: 'igniteBarrel', location: 'street' }).ok).toBe(false)
  })
})

describe('Meat Bait', () => {
  it('pulls the awake zombies that can walk to the meat, and they lose track of you', () => {
    const target = nextDoor('houseA')
    const state = makeState({
      location: 'houseA',
      hand: ['meatBait'],
      zombies: [
        { at: 'houseA', alerted: true },
        { at: 'houseA', kind: 'brute', alerted: true },
        { at: 'houseA', kind: 'sleeper', asleep: true },
      ],
      draw,
    })
    const { state: next, events } = applyAction(state, {
      type: 'playCard',
      uid: 'h1',
      target: { location: target },
    })
    expect(next.zombies.find((z) => z.uid === 'z1')).toMatchObject({
      location: target,
      alerted: false,
    })
    expect(next.zombies.find((z) => z.uid === 'z2')?.location).toBe('houseA')
    expect(next.zombies.find((z) => z.uid === 'z3')?.location).toBe('houseA')
    expect(events).toContainEqual({ type: 'zombiesLured', to: target, count: 1 })
  })

  it('cannot be thrown where you stand or into the Shelter', () => {
    const state = makeState({ location: 'street', hand: ['meatBait'], draw })
    const can = (location: string) =>
      validate(state, { type: 'playCard', uid: 'h1', target: { location } }).ok
    expect(can('street')).toBe(false)
    expect(can('shelter')).toBe(false)
    expect(can(nextDoor('street'))).toBe(true)
  })
})
