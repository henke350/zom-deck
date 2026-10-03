import { describe, expect, it } from 'vitest'
import { listActions } from './actions'
import { totalCount } from './deck'
import { applyAction } from './engine'
import { nextInt } from './rng'
import { newGame } from './setup'
import type { Action, GameState } from './types'

/** A mixed deck with junk and every card the engine can already play. */
const fuzzDeck = [
  'search',
  'search',
  'crowbar',
  'run',
  'sneak',
  'nerves',
  'nerves',
  'heavyLoad',
  'adrenaline',
  'toolbox',
  'toolbox',
  'flashlight',
  'bandage',
  'painkillers',
  'travelLight',
  'kevlarVest',
]

interface Playthrough {
  final: GameState
  actions: Action[]
}

/** Plays random legal actions until the game ends. Randomness comes from the seeded RNG. */
function playRandomly(seed: number, check: (state: GameState) => void): Playthrough {
  let state = newGame(seed, { setup: { startDeck: fuzzDeck } })
  let chooser = seed * 7919 + 13
  const actions: Action[] = []
  check(state)
  for (let step = 0; step < 1000 && state.phase !== 'gameOver'; step++) {
    const options = listActions(state)
    expect(options.length).toBeGreaterThan(0)
    const [index, next] = nextInt(chooser, options.length)
    chooser = next
    const action = options[index] as Action
    actions.push(action)
    state = applyAction(state, action).state
    check(state)
  }
  return { final: state, actions }
}

function invariants(start: number) {
  return (state: GameState) => {
    const { piles, player, balance } = state
    expect(totalCount(piles)).toBe(start)
    const uids = [piles.draw, piles.hand, piles.inPlay, piles.discard, piles.removed]
      .flat()
      .map((c) => c.uid)
    expect(new Set(uids).size).toBe(uids.length)
    expect(player.ap).toBeGreaterThanOrEqual(0)
    expect(player.hp).toBeLessThanOrEqual(balance.maxHp)
    expect(state.turn).toBeGreaterThanOrEqual(1)
    expect(state.turn).toBeLessThanOrEqual(balance.turnLimit)
    expect(state.phase === 'gameOver').toBe(state.outcome !== undefined)
    if (state.phase === 'gameOver') expect(listActions(state)).toEqual([])
  }
}

describe('random playthroughs', () => {
  it('keep every invariant and always end by the turn limit', () => {
    for (let seed = 1; seed <= 150; seed++) {
      const { final } = playRandomly(seed, invariants(fuzzDeck.length))
      expect(final.phase).toBe('gameOver')
      expect(['darkness', 'killed']).toContain(final.outcome?.cause)
    }
  })

  it('replay exactly from seed and actions', () => {
    for (const seed of [3, 42, 4711]) {
      const { final, actions } = playRandomly(seed, () => {})
      let replay = newGame(seed, { setup: { startDeck: fuzzDeck } })
      for (const action of actions) replay = applyAction(replay, action).state
      expect(replay).toEqual(final)
    }
  })
})
