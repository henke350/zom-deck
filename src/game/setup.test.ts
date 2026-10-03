import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { totalCount } from './deck'
import { newGame, starterDeck } from './setup'
import { cardsIn } from './testkit'

function countBy(ids: readonly string[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const id of ids) counts[id] = (counts[id] ?? 0) + 1
  return counts
}

describe('newGame', () => {
  const state = newGame(4711)

  it('builds the starter deck from the balance file', () => {
    const all = [...cardsIn(state.piles.hand), ...cardsIn(state.piles.draw)]
    expect(countBy(all)).toEqual(balance.starterDeck)
    expect(countBy(starterDeck(balance))).toEqual(balance.starterDeck)
  })

  it('starts turn 1 with a full hand, full AP and full health', () => {
    expect(state.turn).toBe(1)
    expect(state.phase).toBe('action')
    expect(state.piles.hand).toHaveLength(balance.handSize)
    expect(state.piles.draw).toHaveLength(10 - balance.handSize)
    expect(state.player).toEqual({
      location: 'shelter',
      hp: balance.maxHp,
      ap: balance.apPerTurn,
      freeMoveUsed: false,
      packs: 0,
      searchBonus: 0,
      block: 0,
    })
  })

  it('gives every card a unique id', () => {
    const uids = [...state.piles.hand, ...state.piles.draw].map((c) => c.uid)
    expect(new Set(uids).size).toBe(uids.length)
  })

  it('is identical for the same seed', () => {
    expect(newGame(4711)).toEqual(state)
  })

  it('shuffles differently for different seeds', () => {
    const order = (seed: number) => newGame(seed).piles.hand.map((c) => c.uid)
    expect(order(1)).not.toEqual(order(2))
  })

  it('uses the start deck and health from an expedition setup', () => {
    const custom = newGame(1, { setup: { startDeck: ['search', 'run', 'bandage'], startHp: 8 } })
    expect(totalCount(custom.piles)).toBe(3)
    expect(custom.piles.hand).toHaveLength(3)
    expect(custom.player.hp).toBe(8)
  })

  it('rejects unknown cards in the start deck', () => {
    expect(() => newGame(1, { setup: { startDeck: ['chainsaw'] } })).toThrow(/chainsaw/)
  })
})
