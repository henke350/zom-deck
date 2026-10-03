import { describe, expect, it } from 'vitest'
import { balance, starterDeckSize } from './balance'

describe('balance', () => {
  it('has a starter deck of 10 cards with 2 Nerves', () => {
    expect(starterDeckSize(balance)).toBe(10)
    expect(balance.starterDeck.nerves).toBe(2)
  })

  it('can always draw a full first hand', () => {
    expect(balance.handSize).toBeLessThanOrEqual(starterDeckSize(balance))
  })

  it('keeps fewer cards than a hand', () => {
    expect(balance.keepCards).toBeLessThan(balance.handSize)
  })

  it('has star thresholds that start at the win condition and rise', () => {
    const [one, two, three] = balance.starThresholds
    expect(one).toBe(balance.packsToWin)
    expect(two).toBeGreaterThan(one)
    expect(three).toBeGreaterThan(two)
    expect(balance.packsOnMap).toBeGreaterThanOrEqual(three)
  })

  it('starts dusk before the last turn', () => {
    expect(balance.duskFromTurn).toBeGreaterThan(1)
    expect(balance.duskFromTurn).toBeLessThanOrEqual(balance.turnLimit)
  })

  it('makes quick search affordable but worse than a Search card', () => {
    expect(balance.quickSearch.cost).toBeLessThanOrEqual(balance.apPerTurn)
    expect(balance.quickSearch.cost).toBeGreaterThan(1)
    expect(balance.quickSearch.options).toBeLessThan(balance.searchOptions)
  })
})
