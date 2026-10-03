import { describe, expect, it } from 'vitest'
import { drawCards, ownedCount, totalCount } from './deck'
import { cardsIn, makeState, uidsIn } from './testkit'
import type { GameEvent } from './types'

describe('drawCards', () => {
  it('takes cards from the top of the draw pile into the hand', () => {
    const state = makeState({ draw: ['search', 'run', 'sneak'] })
    const events: GameEvent[] = []
    const next = drawCards(state, 2, events)
    expect(uidsIn(next.piles.hand)).toEqual(['d1', 'd2'])
    expect(uidsIn(next.piles.draw)).toEqual(['d3'])
    expect(events).toEqual([{ type: 'cardsDrawn', uids: ['d1', 'd2'] }])
  })

  it('never leaves a drawn card in the draw pile', () => {
    const state = makeState({ draw: ['search', 'run', 'sneak', 'crowbar'] })
    const next = drawCards(state, 4, [])
    const drawPile = new Set(uidsIn(next.piles.draw))
    for (const uid of uidsIn(next.piles.hand)) expect(drawPile.has(uid)).toBe(false)
  })

  it('shuffles the discard pile into a new draw pile when it runs out', () => {
    const state = makeState({ draw: ['search'], discard: ['run', 'sneak', 'crowbar'] })
    const events: GameEvent[] = []
    const next = drawCards(state, 3, events)
    expect(next.piles.hand).toHaveLength(3)
    expect(next.piles.discard).toHaveLength(0)
    expect(next.piles.draw).toHaveLength(1)
    expect(events.map((e) => e.type)).toEqual(['deckShuffled', 'cardsDrawn'])
    expect(next.rng).not.toBe(state.rng)
  })

  it('never reshuffles cards that are in play', () => {
    const state = makeState({ draw: [], discard: ['run'], inPlay: ['search'] })
    const next = drawCards(state, 2, [])
    expect(cardsIn(next.piles.hand)).toEqual(['run'])
    expect(uidsIn(next.piles.inPlay)).toEqual(['p1'])
  })

  it('stops quietly when both piles are empty', () => {
    const state = makeState({ draw: ['search'], discard: [] })
    const events: GameEvent[] = []
    const next = drawCards(state, 5, events)
    expect(next.piles.hand).toHaveLength(1)
    expect(events).toEqual([{ type: 'cardsDrawn', uids: ['d1'] }])
  })

  it('does not change the original state', () => {
    const state = makeState({ draw: ['search', 'run'], discard: ['sneak'] })
    const before = structuredClone(state)
    drawCards(state, 3, [])
    expect(state).toEqual(before)
  })
})

describe('card counts', () => {
  it('counts owned cards without removed ones', () => {
    const state = makeState({
      hand: ['search'],
      draw: ['run', 'run'],
      discard: ['sneak'],
      inPlay: ['crowbar'],
      removed: ['nerves'],
    })
    expect(ownedCount(state.piles)).toBe(5)
    expect(totalCount(state.piles)).toBe(6)
  })
})
