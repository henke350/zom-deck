import { describe, expect, it } from 'vitest'
import { defaultContent } from '../data/content'
import { texts } from '../data/texts.en'
import { listActions } from './actions'
import { dogSmells } from './dog'
import { applyAction } from './engine'
import { checkInvariants } from './invariants'
import { performSearch } from './search'
import { classicBalance, makeState } from './testkit'
import type { Action, GameState } from './types'
import { validate } from './validate'
import { previewEndTurn } from './zombies'

const dog = classicBalance.dog

function reasonFor(state: GameState, action: Action): string | undefined {
  const result = validate(state, action)
  return result.ok ? undefined : result.reason
}

describe('finding the dog', () => {
  it('joins you instead of going into your deck', () => {
    const state: GameState = {
      ...makeState({ location: 'houseA' }),
      phase: 'chooseFind',
      pendingFind: { location: 'houseA', options: ['dog', 'bandage'], packFound: false, noise: 0 },
    }
    const { state: next, events } = applyAction(state, { type: 'takeFind', card: 'dog' })
    expect(next.dog).toEqual({ hp: dog.hp, bitten: false })
    expect(events).toContainEqual({ type: 'dogFound', hp: dog.hp })
    expect(next.piles.hand.some((c) => c.card === 'dog')).toBe(false)
    expect(next.stats.cardsTaken).toEqual([])
    expect(checkInvariants(next, defaultContent).filter((p) => p.includes('dog'))).toEqual([])
  })

  it('is never offered while you already have one', () => {
    const offered = (state: GameState) => {
      for (let seed = 1; seed < 80; seed++) {
        const at = { ...state, rng: seed }
        const s = performSearch(
          at,
          defaultContent,
          { base: 6, extra: 0, quick: false, noise: 0 },
          [],
        )
        if (s.pendingFind?.options.includes('dog')) return true
      }
      return false
    }
    expect(offered(makeState({ location: 'houseA' }))).toBe(true)
    expect(offered(makeState({ location: 'houseA', dog: 2 }))).toBe(false)
  })
})

describe('Sic', () => {
  const state = makeState({ location: 'houseA', dog: dog.hp, zombies: [{ at: 'houseA', hp: 3 }] })

  it('bites a zombie here once per turn for 0 AP, and barks', () => {
    const { state: next, events } = applyAction(state, {
      type: 'dogBite',
      target: { zombie: 'z1' },
    })
    expect(next.zombies[0]?.hp).toBe(3 - dog.biteDamage)
    expect(next.player.ap).toBe(state.player.ap)
    expect(next.noise).toBe(dog.biteNoise)
    expect(events).toContainEqual({ type: 'dogBit', zombie: 'z1', damage: dog.biteDamage })
    expect(reasonFor(next, { type: 'dogBite', target: { zombie: 'z1' } })).toBe(
      texts.reasons.dogBitten,
    )
    const nextTurn = applyAction(next, { type: 'endTurn' }).state
    expect(nextTurn.dog?.bitten).toBe(false)
  })

  it('needs a dog and a zombie here', () => {
    expect(
      reasonFor(makeState({ zombies: [{ at: 'shelter' }] }), {
        type: 'dogBite',
        target: { zombie: 'z1' },
      }),
    ).toBe(texts.reasons.noDog)
    expect(reasonFor(makeState({ dog: 2 }), { type: 'dogBite', target: { zombie: 'z1' } })).toBe(
      texts.reasons.noZombiesHere,
    )
    expect(listActions(state)).toContainEqual({ type: 'dogBite', target: { zombie: 'z1' } })
  })

  it('can kill, and then you search the body', () => {
    const weak = makeState({
      location: 'houseA',
      dog: dog.hp,
      zombies: [{ at: 'houseA', kind: 'runner' }],
    })
    const { state: next, events } = applyAction(weak, { type: 'dogBite', target: { zombie: 'z1' } })
    expect(events.some((e) => e.type === 'zombieKilled')).toBe(true)
    expect(next.zombies).toHaveLength(0)
  })
})

describe('the dog guards you', () => {
  it('takes damage for you in the zombie phase, and the preview counts it', () => {
    const state = makeState({ location: 'houseA', dog: dog.hp, zombies: [{ at: 'houseA' }] })
    expect(previewEndTurn(state, defaultContent)).toMatchObject({
      damage: 0,
      blocked: dog.guardPerPhase,
    })
    const { state: next, events } = applyAction(state, { type: 'endTurn' })
    expect(next.player.hp).toBe(state.player.hp)
    expect(next.dog?.hp).toBe(dog.hp - dog.guardPerPhase)
    expect(events).toContainEqual({
      type: 'dogGuarded',
      amount: dog.guardPerPhase,
      hpLeft: dog.hp - dog.guardPerPhase,
    })
  })

  it('dies at 0 health and is gone', () => {
    const state = makeState({
      location: 'houseA',
      dog: 1,
      zombies: [{ at: 'houseA' }, { at: 'houseA' }],
    })
    const { state: next, events } = applyAction(state, { type: 'endTurn' })
    expect(next.dog).toBeUndefined()
    expect(events).toContainEqual({ type: 'dogDied' })
    expect(next.player.hp).toBe(state.player.hp - 1)
    expect(checkInvariants(next, defaultContent).filter((p) => p.includes('dog'))).toEqual([])
  })
})

describe('the dog smells supplies', () => {
  it('shows packs here and next door, and nothing without a dog', () => {
    const state = makeState({ location: 'street', dog: 2, packsAt: ['houseA', 'police'] })
    expect(dogSmells(state, defaultContent)).toContain('houseA')
    expect(dogSmells(state, defaultContent)).not.toContain('police')
    expect(dogSmells({ ...state, dog: undefined }, defaultContent)).toEqual([])
  })
})
