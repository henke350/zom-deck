import { describe, expect, it } from 'vitest'
import { defaultContent } from '../data/content'
import { texts } from '../data/texts.en'
import { applyAction } from './engine'
import { checkInvariants } from './invariants'
import { classicBalance, makeState } from './testkit'
import type { Action, GameState } from './types'
import { validate } from './validate'
import { addNoise, previewEndTurn } from './zombies'

const z = classicBalance.zombies

function reasonFor(state: GameState, action: Action): string | undefined {
  const result = validate(state, action)
  return result.ok ? undefined : result.reason
}

const noProblems = (state: GameState) =>
  expect(
    checkInvariants(state, defaultContent).filter((p) => /poison|asleep|sleeping/.test(p)),
  ).toEqual([])

describe('Spitter', () => {
  it('spits from the next building without moving, and poisons you', () => {
    const state = makeState({
      location: 'street',
      zombies: [{ at: 'houseA', kind: 'spitter', alerted: true }],
    })
    expect(previewEndTurn(state, defaultContent).attackers).toBe(1)
    const { state: next, events } = applyAction(state, { type: 'endTurn' })
    expect(next.zombies[0]?.location).toBe('houseA')
    expect(next.zombies[0]?.alerted).toBe(true)
    expect(events).toContainEqual({ type: 'poisoned', amount: 1, total: 1 })
    // 1 from the spit, then 1 from the poison, which fades to 0.
    expect(next.player.hp).toBe(state.player.hp - z.spitter.damage - 1)
    expect(next.player.poison).toBe(0)
    noProblems(next)
  })

  it('poison is cured by any healing', () => {
    const state = makeState({ hand: ['bandage'], poison: 2, hp: 5 })
    const next = applyAction(state, { type: 'playCard', uid: 'h1' }).state
    expect(next.player.poison).toBe(0)
  })
})

describe('Bloater', () => {
  it('bursts over you when it dies where you stand', () => {
    const state = makeState({
      location: 'houseA',
      hand: ['axe'],
      zombies: [{ at: 'houseA', kind: 'bloater', hp: 2 }],
    })
    const { state: next, events } = applyAction(state, {
      type: 'playCard',
      uid: 'h1',
      target: { zombie: 'z1' },
    })
    expect(events).toContainEqual({ type: 'zombieBurst', uid: 'z1', damage: z.bloater.burst })
    expect(next.player.hp).toBe(state.player.hp - (z.bloater.burst ?? 0))
    expect(next.stats.damageFromZombies).toBe(z.bloater.burst)
  })

  it('does not hurt you when it dies a step away (Bow)', () => {
    const state = makeState({
      location: 'street',
      hand: ['bow'],
      visited: ['shelter', 'street', 'houseA'],
      zombies: [{ at: 'houseA', kind: 'bloater', hp: 2, alerted: false }],
    })
    const next = applyAction(state, { type: 'playCard', uid: 'h1', target: { zombie: 'z1' } })
    expect(next.events.some((e) => e.type === 'zombieBurst')).toBe(false)
    expect(next.state.player.hp).toBe(state.player.hp)
  })
})

describe('Sleeper', () => {
  const sleeping = makeState({
    location: 'houseA',
    hand: ['crowbar'],
    zombies: [{ at: 'houseA', kind: 'sleeper', asleep: true, alerted: false }],
  })

  it('does not notice you or attack while asleep', () => {
    const next = applyAction(sleeping, { type: 'endTurn' }).state
    expect(next.player.hp).toBe(sleeping.player.hp)
    expect(next.zombies[0]).toMatchObject({ asleep: true, alerted: false })
  })

  it('wakes when hit, and then sees you', () => {
    const { state: next, events } = applyAction(sleeping, {
      type: 'playCard',
      uid: 'h1',
      target: { zombie: 'z1' },
    })
    expect(events).toContainEqual({ type: 'zombieWoke', uid: 'z1' })
    expect(next.zombies[0]?.asleep).toBeUndefined()
    expect(next.zombies[0]?.alerted).toBe(true)
    noProblems(next)
  })

  it('wakes when a full noise meter brings zombies where you stand', () => {
    const events: Parameters<typeof addNoise>[4] = []
    const next = addNoise(sleeping, classicBalance.noiseThreshold, defaultContent, 'noise', events)
    expect(events.some((e) => e.type === 'zombieWoke')).toBe(true)
    expect(next.zombies.find((x) => x.kind === 'sleeper')?.asleep).toBeUndefined()
  })
})

describe('Bat', () => {
  const state = makeState({
    location: 'houseA',
    hand: ['crowbar', 'pistol', 'molotov'],
    dog: 2,
    zombies: [{ at: 'houseA', kind: 'bat' }],
  })

  it('cannot be hit by blows or the dog', () => {
    expect(reasonFor(state, { type: 'playCard', uid: 'h1', target: { zombie: 'z1' } })).toBe(
      texts.reasons.onlyShotsHitFlying,
    )
    expect(reasonFor(state, { type: 'dogBite', target: { zombie: 'z1' } })).toBe(
      texts.reasons.onlyShotsHitFlying,
    )
  })

  it('can be shot or burned', () => {
    expect(reasonFor(state, { type: 'playCard', uid: 'h2', target: { zombie: 'z1' } })).toBe(
      undefined,
    )
    const burned = applyAction(state, { type: 'playCard', uid: 'h3' }).state
    expect(burned.zombies).toHaveLength(0)
  })

  it('is missed by blows that hit everything here', () => {
    const swing = makeState({
      location: 'houseA',
      hand: ['chainsaw'],
      ap: 3,
      zombies: [{ at: 'houseA', kind: 'bat' }, { at: 'houseA' }],
    })
    const def = defaultContent.cards.chainsaw
    const hitsAll = def?.modes.some((m) =>
      m.effects.some((e) => e.kind === 'damage' && e.target === 'allHere'),
    )
    if (!hitsAll) return
    const next = applyAction(swing, { type: 'playCard', uid: 'h1' }).state
    expect(next.zombies.map((x) => x.kind)).toContain('bat')
  })
})

describe('Hound', () => {
  it('follows you up to three steps', () => {
    expect(z.hound.followSteps).toBe(3)
    const state = makeState({
      location: 'shelter',
      zombies: [{ at: 'police', kind: 'hound', alerted: true }],
    })
    const moved = applyAction(state, { type: 'freeMove', to: 'street' }).state
    const next = applyAction(moved, { type: 'endTurn' }).state
    expect(next.zombies[0]?.location).toBe('street')
  })
})
