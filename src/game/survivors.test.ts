import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { daySetup, newCampaign } from './campaign'
import { applyAction } from './engine'
import { newGame, starterDeck } from './setup'
import { survivorDeck, survivorOf } from './survivors'
import { cardsIn, makeState } from './testkit'

const deckOf = (state: ReturnType<typeof newGame>) =>
  [...cardsIn(state.piles.hand), ...cardsIn(state.piles.draw)].sort()

describe('survivors', () => {
  it('the Scavenger is the classic start', () => {
    const plain = newGame(5, { setup: { dayEvent: 'none' } })
    const scavenger = newGame(5, { setup: { dayEvent: 'none', survivor: 'scavenger' } })
    expect(deckOf(scavenger)).toEqual(deckOf(plain))
    expect(scavenger.player.hp).toBe(plain.player.hp)
    expect(scavenger.survivor).toBe('scavenger')
  })

  it('swaps cards in the start deck', () => {
    const deck = survivorDeck(starterDeck(balance), survivorOf(balance, 'medic'))
    expect(deck.filter((c) => c === 'nerves')).toHaveLength(0)
    expect(deck).toContain('bandage')
    expect(deck).toContain('painkillers')
    const hunter = newGame(5, { setup: { dayEvent: 'none', survivor: 'hunter' } })
    expect(deckOf(hunter)).toContain('bow')
    expect(deckOf(hunter).filter((c) => c === 'crowbar')).toHaveLength(1)
  })

  it('the Firefighter has more health, also in a campaign', () => {
    const state = newGame(5, { setup: { dayEvent: 'none', survivor: 'firefighter' } })
    expect(state.balance.maxHp).toBe(balance.maxHp + 2)
    expect(state.player.hp).toBe(balance.maxHp + 2)
    const campaign = newCampaign(5, balance, undefined, 'firefighter')
    const setup = daySetup(campaign, balance)
    expect(setup.survivor).toBe('firefighter')
    expect(newGame(5, { setup: { ...setup, dayEvent: 'none' } }).player.hp).toBe(balance.maxHp + 2)
  })

  it('the Hunter sees one building from the start', () => {
    const state = newGame(5, { setup: { dayEvent: 'none', survivor: 'hunter' } })
    expect(Object.values(state.sites).filter((s) => s.scouted)).toHaveLength(1)
  })

  it('the Medic heals one more with every heal', () => {
    const base = makeState({ hand: ['bandage'], hp: 3 })
    const medic = { ...base, survivor: 'medic' as const }
    const healed = (s: typeof base) =>
      applyAction(s, { type: 'playCard', uid: 'h1' }).state.player.hp
    expect(healed(base)).toBe(4)
    expect(healed(medic)).toBe(5)
  })

  it('the Mechanic makes gear last longer', () => {
    const base = makeState({ hand: ['kevlarVest'] })
    const mechanic = { ...base, survivor: 'mechanic' as const }
    const left = (s: typeof base) => applyAction(s, { type: 'playCard', uid: 'h1' }).state.gearLeft
    expect(left(base)['h1']).toBe(3)
    expect(left(mechanic)['h1']).toBe(4)
  })
})
