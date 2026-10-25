import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { texts } from '../data/texts.en'
import { gearOptions, listActions } from './actions'
import { applyAction } from './engine'
import { cardsIn, makeState } from './testkit'
import type { Action, GameState } from './types'
import { validate } from './validate'

const draw = ['bandage', 'bandage', 'bandage', 'bandage', 'bandage', 'bandage']

function play(state: GameState, action: Action): GameState {
  return applyAction(state, action).state
}

function reasonFor(state: GameState, action: Action): string | undefined {
  const result = validate(state, action)
  return result.ok ? undefined : result.reason
}

describe('Knife', () => {
  it('deals 1 damage without a sound, 2 after a Quiet card', () => {
    const state = makeState({ location: 'houseA', hand: ['knife'], zombies: [{ at: 'houseA' }] })
    const cut = play(state, { type: 'playCard', uid: 'h1', target: { zombie: 'z1' } })
    expect(cut.zombies[0]?.hp).toBe(balance.zombies.walker.hp - 1)
    expect(cut.noise).toBe(0)
    const quiet = makeState({
      location: 'houseA',
      hand: ['knife'],
      tags: ['quiet'],
      zombies: [{ at: 'houseA' }],
    })
    const stab = play(quiet, { type: 'playCard', uid: 'h1', target: { zombie: 'z1' } })
    expect(stab.zombies).toHaveLength(0)
  })
})

describe('Bow', () => {
  it('hits a zombie one step away that you can see, without noise or being seen', () => {
    const state = makeState({ hand: ['bow'], zombies: [{ at: 'street', kind: 'runner' }], draw })
    const { state: next, events } = applyAction(state, {
      type: 'playCard',
      uid: 'h1',
      target: { zombie: 'z1' },
    })
    expect(next.zombies).toHaveLength(0)
    expect(next.noise).toBe(0)
    expect(next.player.location).toBe('shelter')
    expect(events.some((e) => e.type === 'bodySearched')).toBe(true)
  })

  it('cannot hit zombies you cannot see, or two steps away', () => {
    const hidden = makeState({ hand: ['bow'], zombies: [{ at: 'houseA' }] })
    expect(reasonFor(hidden, { type: 'playCard', uid: 'h1', target: { zombie: 'z1' } })).toBe(
      texts.reasons.noZombiesInRange(1),
    )
    const far = makeState({ hand: ['bow'], zombies: [{ at: 'pharmacy' }], visited: ['pharmacy'] })
    expect(reasonFor(far, { type: 'playCard', uid: 'h1', target: { zombie: 'z1' } })).toBe(
      texts.reasons.noZombiesInRange(1),
    )
  })

  it('offers every zombie in range as a target', () => {
    const state = makeState({
      location: 'street',
      hand: ['bow'],
      zombies: [{ at: 'street' }, { at: 'pharmacy' }, { at: 'police' }],
      visited: ['pharmacy', 'police'],
    })
    const targets = listActions(state)
      .flatMap((a) => (a.type === 'playCard' && a.uid === 'h1' ? [a.target?.zombie] : []))
      .sort()
    expect(targets).toEqual(['z1', 'z2'])
  })
})

describe('Crossbow', () => {
  it('is gear with 3 bolts: each shot costs 1 AP and deals 3 damage, silently', () => {
    let state = makeState({
      hand: ['crossbow'],
      ap: 5,
      zombies: [{ at: 'street', kind: 'brute' }, { at: 'street' }, { at: 'street' }],
      draw,
    })
    state = play(state, { type: 'playCard', uid: 'h1' })
    expect(cardsIn(state.piles.gear)).toEqual(['crossbow'])
    expect(state.gearLeft.h1).toBe(3)
    expect(gearOptions(state, 'h1')?.actions).toHaveLength(3)

    state = play(state, { type: 'useGear', uid: 'h1', target: { zombie: 'z1' } })
    expect(state.zombies.find((z) => z.uid === 'z1')?.hp).toBe(balance.zombies.brute.hp - 3)
    expect(state.player.ap).toBe(3)
    expect(state.noise).toBe(0)
    expect(state.gearLeft.h1).toBe(2)

    state = play(state, { type: 'useGear', uid: 'h1', target: { zombie: 'z2' } })
    if (state.phase === 'chooseFind') state = play(state, { type: 'declineFind' })
    state = play(state, { type: 'useGear', uid: 'h1', target: { zombie: 'z3' } })
    if (state.phase === 'chooseFind') state = play(state, { type: 'declineFind' })
    expect(state.piles.gear).toHaveLength(0)
    expect(cardsIn(state.piles.discard)).toContain('crossbow')
  })

  it('needs AP and a zombie in range', () => {
    const state = makeState({ gear: ['crossbow'], ap: 0, zombies: [{ at: 'street' }] })
    expect(reasonFor(state, { type: 'useGear', uid: 'g1', target: { zombie: 'z1' } })).toBe(
      texts.reasons.notEnoughAp(1, 0),
    )
    const empty = makeState({ gear: ['crossbow'] })
    expect(gearOptions(empty, 'g1')?.reason).toBe(texts.reasons.noZombiesInRange(1))
  })
})

describe('Head Shot', () => {
  it('deals 1 damage alone, and kills any zombie after a Weapon card', () => {
    const alone = makeState({
      location: 'police',
      hand: ['headShot'],
      zombies: [{ at: 'police', kind: 'brute' }],
    })
    const hit = play(alone, { type: 'playCard', uid: 'h1', target: { zombie: 'z1' } })
    expect(hit.zombies[0]?.hp).toBe(balance.zombies.brute.hp - 1)
    const combo = makeState({
      location: 'police',
      hand: ['headShot'],
      tags: ['weapon'],
      zombies: [{ at: 'police', kind: 'brute' }],
    })
    const dead = play(combo, { type: 'playCard', uid: 'h1', target: { zombie: 'z1' } })
    expect(dead.zombies).toHaveLength(0)
  })
})

describe('Silent Takedown', () => {
  it('kills a zombie that has not seen you, without a sound', () => {
    const state = makeState({
      location: 'police',
      hand: ['silentTakedown'],
      zombies: [{ at: 'police', kind: 'brute', alerted: false }],
    })
    const next = play(state, { type: 'playCard', uid: 'h1', target: { zombie: 'z1' } })
    expect(next.zombies).toHaveLength(0)
    expect(next.noise).toBe(0)
  })

  it('cannot take down a zombie that has seen you, unless it is distracted', () => {
    const seen = makeState({
      location: 'police',
      hand: ['silentTakedown'],
      zombies: [{ at: 'police', alerted: true }],
    })
    expect(reasonFor(seen, { type: 'playCard', uid: 'h1', target: { zombie: 'z1' } })).toBe(
      texts.reasons.zombieSeesYou,
    )
    const sneaky = makeState({
      location: 'police',
      hand: ['sneak', 'silentTakedown'],
      zombies: [{ at: 'police', alerted: true }],
    })
    const distracted = play(sneaky, { type: 'playCard', uid: 'h1', target: { zombie: 'z1' } })
    const done = play(distracted, { type: 'playCard', uid: 'h2', target: { zombie: 'z1' } })
    expect(done.zombies).toHaveLength(0)
  })
})
