import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { texts } from '../data/texts.en'
import { listActions } from './actions'
import { applyAction } from './engine'
import { cardsIn, makeState, type StateSpec } from './testkit'
import type { Action, GameState } from './types'
import { validate, validateServiceHere } from './validate'
import { previewEndTurn } from './zombies'
import { defaultContent } from '../data/content'

const draw = ['bandage', 'bandage', 'bandage', 'bandage', 'bandage', 'bandage']

function reasonFor(state: GameState, action: Action): string | undefined {
  const result = validate(state, action)
  return result.ok ? undefined : result.reason
}

describe('location services', () => {
  it('Dismantle at the Workshop trashes any card from your hand for AP', () => {
    const state = makeState({ location: 'workshop', hand: ['crowbar', 'nerves'] })
    const { state: next, events } = applyAction(state, { type: 'useService', uid: 'h1' })
    expect(cardsIn(next.piles.removed)).toEqual(['crowbar'])
    expect(cardsIn(next.piles.hand)).toEqual(['nerves'])
    expect(next.player.ap).toBe(balance.apPerTurn - balance.locationServiceCost)
    expect(events).toEqual([
      { type: 'serviceUsed', service: 'dismantle', location: 'workshop' },
      { type: 'cardTrashed', uid: 'h1', card: 'crowbar' },
    ])
    expect(next.stats.cardsRemoved).toBe(1)
  })

  it('Patch up at the Pharmacy only takes Nerves and Wound', () => {
    const state = makeState({ location: 'pharmacy', hand: ['crowbar', 'nerves', 'wound'] })
    expect(reasonFor(state, { type: 'useService', uid: 'h1' })).toBe(texts.reasons.trashJunkOnly)
    const next = applyAction(state, { type: 'useService', uid: 'h2' }).state
    expect(cardsIn(next.piles.removed)).toEqual(['nerves'])
    expect(reasonFor(next, { type: 'useService', uid: 'h3' })).toBeUndefined()
  })

  it('can be used again while AP lasts', () => {
    let state = makeState({ location: 'workshop', hand: ['nerves', 'nerves', 'sneak', 'run'] })
    for (const uid of ['h1', 'h2', 'h3']) {
      state = applyAction(state, { type: 'useService', uid }).state
    }
    expect(state.player.ap).toBe(0)
    expect(reasonFor(state, { type: 'useService', uid: 'h4' })).toBe(
      texts.reasons.notEnoughAp(balance.locationServiceCost, 0),
    )
  })

  it('never trashes Heavy Load', () => {
    const state = makeState({ location: 'workshop', hand: ['heavyLoad'] })
    expect(reasonFor(state, { type: 'useService', uid: 'h1' })).toBe(texts.reasons.notTrashable)
    expect(validateServiceHere(state)).toEqual({ ok: false, reason: texts.reasons.noTrashTarget })
  })

  it('only works where there is a service, and not while choosing a find', () => {
    const street = makeState({ location: 'street', hand: ['nerves'] })
    expect(reasonFor(street, { type: 'useService', uid: 'h1' })).toBe(texts.reasons.noServiceHere)
    const choosing: GameState = {
      ...makeState({ location: 'workshop', hand: ['nerves'] }),
      phase: 'chooseFind',
      pendingFind: { location: 'workshop', options: [], packFound: false, noise: 0 },
    }
    expect(reasonFor(choosing, { type: 'useService', uid: 'h1' })).toBe(
      texts.reasons.chooseFindFirst,
    )
  })

  it('appears in the list of legal actions for the cards it can take', () => {
    const state = makeState({ location: 'pharmacy', hand: ['nerves', 'search', 'heavyLoad'] })
    const services = listActions(state).filter((a) => a.type === 'useService')
    expect(services).toEqual([{ type: 'useService', uid: 'h1' }])
  })
})

describe('Wound variant', () => {
  const withWounds = { ...balance, wounds: { enabled: true, damageInOnePhase: 2 } }
  const attackedBy = (n: number, spec: StateSpec = {}) =>
    makeState({
      draw,
      location: 'houseA',
      zombies: Array.from({ length: n }, () => ({ at: 'houseA' })),
      ...spec,
    })

  it('is off by default', () => {
    const { state } = applyAction(attackedBy(2), { type: 'endTurn' })
    expect(state.stats.woundsGained).toBe(0)
    expect(cardsIn(state.piles.discard)).not.toContain('wound')
  })

  it('adds a Wound when one zombie phase takes enough health', () => {
    const start = attackedBy(2, { balance: withWounds })
    expect(previewEndTurn(start, defaultContent).wound).toBe(true)
    const { state, events } = applyAction(start, { type: 'endTurn' })
    expect(events).toContainEqual(expect.objectContaining({ type: 'cardGained', reason: 'wound' }))
    expect(state.stats.woundsGained).toBe(1)
    const owned = [...state.piles.draw, ...state.piles.hand, ...state.piles.discard]
    expect(cardsIn(owned)).toContain('wound')
  })

  it('does not wound for a small hit, after Block, or when the attack kills you', () => {
    const small = applyAction(attackedBy(1, { balance: withWounds }), { type: 'endTurn' })
    expect(small.state.stats.woundsGained).toBe(0)

    const vest = attackedBy(2, { balance: withWounds, hand: ['kevlarVest'] })
    const blocked = applyAction(applyAction(vest, { type: 'playCard', uid: 'h1' }).state, {
      type: 'endTurn',
    })
    expect(blocked.state.stats.woundsGained).toBe(0)

    const dead = applyAction(attackedBy(2, { balance: withWounds, hp: 2 }), { type: 'endTurn' })
    expect(dead.state.outcome?.cause).toBe('killed')
    expect(dead.state.stats.woundsGained).toBe(0)
  })
})
