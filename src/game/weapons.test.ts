import { describe, expect, it } from 'vitest'
import { defaultContent } from '../data/content'
import { applyAction } from './engine'
import { distance, neighbors } from './map'
import { cardsIn, classicBalance, makeState } from './testkit'
import type { Action, GameState } from './types'
import { validate } from './validate'

const draw = ['bandage', 'bandage', 'bandage', 'bandage', 'bandage', 'bandage', 'bandage']
const play = (state: GameState, action: Action) => applyAction(state, action).state
const nextDoor = (from: string) =>
  neighbors(defaultContent, from).find((id) => defaultContent.locations[id]?.kind === 'building')!

describe('the loud and silly weapons', () => {
  it('the Machine Gun hits every zombie here, Bats too, for a bullet and a lot of noise', () => {
    const state = makeState({
      location: 'houseA',
      hand: ['machineGun'],
      zombies: [{ at: 'houseA', hp: 2 }, { at: 'houseA', kind: 'bat' }, { at: 'street' }],
      draw,
    })
    const next = play(state, { type: 'playCard', uid: 'h1', mode: 0 })
    expect(next.zombies.filter((z) => z.location === 'houseA').map((z) => z.hp)).toEqual([1])
    expect(next.zombies.find((z) => z.location === 'street')).toBeTruthy()
    expect(next.player.ammo).toBe(state.player.ammo - 1)
  })

  it('full auto needs 3 bullets and deals 2 damage to everything here', () => {
    const base = makeState({
      location: 'houseA',
      hand: ['machineGun'],
      zombies: [
        { at: 'houseA', hp: 2 },
        { at: 'houseA', hp: 2 },
      ],
      draw,
    })
    const broke = { ...base, player: { ...base.player, ammo: 2 } }
    expect(validate(broke, { type: 'playCard', uid: 'h1', mode: 1 }).ok).toBe(false)
    const rich = { ...base, player: { ...base.player, ammo: 3 } }
    const next = play(rich, { type: 'playCard', uid: 'h1', mode: 1 })
    // The noise may bring new zombies; the two that were here are gone.
    expect(next.zombies.filter((z) => z.uid === 'z1' || z.uid === 'z2')).toHaveLength(0)
    expect(next.player.ammo).toBe(0)
  })

  it('the Bazooka blows up a whole place next door, and is used up', () => {
    const target = nextDoor('houseA')
    const state = makeState({
      location: 'houseA',
      hand: ['bazooka'],
      zombies: [{ at: target, hp: 3 }, { at: target, kind: 'bat' }, { at: 'houseA' }],
      draw,
    })
    const next = play(state, { type: 'playCard', uid: 'h1', target: { location: target } })
    // The noise may bring new zombies; the two that were next door are gone, the one here is not.
    expect(next.zombies.filter((z) => z.uid === 'z1' || z.uid === 'z2')).toHaveLength(0)
    expect(next.zombies.find((z) => z.uid === 'z3')).toBeTruthy()
    expect(next.player.hp).toBe(classicBalance.maxHp)
    expect(cardsIn(next.piles.removed)).toContain('bazooka')
  })

  it('fired where you stand, the Bazooka hurts you too; too far away it cannot be fired', () => {
    const state = makeState({
      location: 'houseA',
      hand: ['bazooka'],
      zombies: [{ at: 'houseA' }],
      draw,
    })
    const next = play(state, { type: 'playCard', uid: 'h1', target: { location: 'houseA' } })
    expect(next.player.hp).toBe(classicBalance.maxHp - 1)
    const far = Object.keys(defaultContent.locations).find(
      (id) => distance(defaultContent, 'houseA', id) === 2,
    )!
    expect(validate(state, { type: 'playCard', uid: 'h1', target: { location: far } }).ok).toBe(
      false,
    )
  })

  it('the Leaf Blower blows every zombie here next door, and they lose track of you', () => {
    const target = nextDoor('houseA')
    const state = makeState({
      location: 'houseA',
      hand: ['leafBlower'],
      zombies: [
        { at: 'houseA', alerted: true },
        { at: 'houseA', kind: 'brute', alerted: true },
      ],
      draw,
    })
    const { state: next, events } = applyAction(state, {
      type: 'playCard',
      uid: 'h1',
      target: { location: target },
    })
    expect(next.zombies.every((z) => z.location === target && !z.alerted)).toBe(true)
    expect(events).toContainEqual({ type: 'zombiesBlown', from: 'houseA', to: target, count: 2 })
  })

  it('the Leaf Blower needs zombies here and a place next door that is not the Shelter', () => {
    const empty = makeState({ location: 'street', hand: ['leafBlower'], draw })
    const target = nextDoor('street')
    expect(validate(empty, { type: 'playCard', uid: 'h1', target: { location: target } }).ok).toBe(
      false,
    )
    const crowded = makeState({
      location: 'street',
      hand: ['leafBlower'],
      zombies: [{ at: 'street' }],
      draw,
    })
    const play = (location: string) =>
      validate(crowded, { type: 'playCard', uid: 'h1', target: { location } }).ok
    expect(play('shelter')).toBe(false)
    expect(play(target)).toBe(true)
  })
})
