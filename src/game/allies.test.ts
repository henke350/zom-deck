import { describe, expect, it } from 'vitest'
import { defaultContent } from '../data/content'
import { applyAction } from './engine'
import { neighbors } from './map'
import { cardsIn, classicBalance, makeState } from './testkit'
import type { Action, GameState } from './types'
import { previewEndTurn } from './zombies'

const draw = ['bandage', 'bandage', 'bandage', 'bandage', 'bandage', 'bandage', 'bandage']
const play = (state: GameState, action: Action) => applyAction(state, action).state

describe('allies', () => {
  it('stay in front of you with their health, also for the Mechanic', () => {
    const state = makeState({ hand: ['soldier'], draw })
    const joined = play(state, { type: 'playCard', uid: 'h1' })
    expect(cardsIn(joined.piles.gear)).toEqual(['soldier'])
    expect(joined.gearLeft.h1).toBe(3)
    const mechanic = play({ ...state, survivor: 'mechanic' }, { type: 'playCard', uid: 'h1' })
    expect(mechanic.gearLeft.h1).toBe(3)
  })

  it('take damage for you and are knocked out to the discard pile at 0 health', () => {
    let state = makeState({
      location: 'houseA',
      gear: ['streetKid'],
      zombies: [{ at: 'houseA' }, { at: 'houseA' }],
      draw,
    })
    expect(previewEndTurn(state, defaultContent)).toMatchObject({ blocked: 1, damage: 1 })
    const { state: after, events } = applyAction(state, { type: 'endTurn' })
    state = after
    expect(state.player.hp).toBe(classicBalance.maxHp - 1)
    expect(state.piles.gear).toHaveLength(0)
    expect(cardsIn(state.piles.discard)).toContain('streetKid')
    expect(events).toContainEqual({
      type: 'gearLost',
      uid: 'g1',
      card: 'streetKid',
      reason: 'health',
    })
  })

  it('the Bouncer takes up to 2 damage each zombie phase', () => {
    const state = makeState({
      location: 'houseA',
      gear: ['bouncer'],
      zombies: [{ at: 'houseA' }, { at: 'houseA' }, { at: 'houseA' }],
      draw,
    })
    const next = play(state, { type: 'endTurn' })
    expect(next.player.hp).toBe(classicBalance.maxHp - 1)
    expect(next.gearLeft.g1).toBe(2)
  })

  it('the Nurse heals you at the end of the turn and cures poison, and the preview knows', () => {
    const base = makeState({ gear: ['nurse'], hp: 5, draw })
    expect(previewEndTurn(base, defaultContent).damage).toBe(-1)
    expect(play(base, { type: 'endTurn' }).player.hp).toBe(6)
    const poisoned = { ...base, player: { ...base.player, poison: 1 } }
    const next = play(poisoned, { type: 'endTurn' })
    expect(next.player.poison).toBe(0)
    expect(previewEndTurn(poisoned, defaultContent).damage).toBe(base.player.hp - next.player.hp)
  })

  it('the Soldier shoots for 1 AP, makes noise, needs no bullets and stays', () => {
    const state = makeState({
      location: 'houseA',
      gear: ['soldier'],
      zombies: [{ at: 'houseA', hp: 3 }],
      draw,
    })
    const ammo = state.player.ammo
    const next = play(state, { type: 'useGear', uid: 'g1', target: { zombie: 'z1' } })
    expect(next.zombies[0]?.hp).toBe(1)
    expect(next.player.ap).toBe(state.player.ap - 1)
    expect(next.player.ammo).toBe(ammo)
    expect(next.noise).toBe(state.noise + 1)
    expect(next.gearLeft.g1).toBe(3)
    expect(cardsIn(next.piles.gear)).toEqual(['soldier'])
  })

  it('the Scout shows the buildings next to you when they join and when you move', () => {
    const state = makeState({ hand: ['scout'], draw })
    const joined = play(state, { type: 'playCard', uid: 'h1' })
    const around = neighbors(defaultContent, 'shelter').filter((id) => joined.sites[id])
    for (const id of around) expect(joined.sites[id]?.scouted).toBe(true)
    const moved = play(joined, { type: 'freeMove', to: 'street' })
    const next = neighbors(defaultContent, 'street').filter((id) => moved.sites[id])
    expect(next.length).toBeGreaterThan(0)
    for (const id of next) expect(moved.sites[id]?.scouted).toBe(true)
  })

  it('the Street Kid finds you one more thing in every search', () => {
    const finds = (gear: string[]) =>
      play(makeState({ location: 'houseA', hand: ['search'], gear, draw }), {
        type: 'playCard',
        uid: 'h1',
      }).pendingFind?.options.length ?? 0
    expect(finds(['streetKid'])).toBe(finds([]) + 1)
  })
})
