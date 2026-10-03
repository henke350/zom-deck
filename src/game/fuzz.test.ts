import { describe, expect, it } from 'vitest'
import { listActions } from './actions'
import { defaultContent } from '../data/content'
import { applyAction } from './engine'
import { checkInvariants } from './invariants'
import { nextInt } from './rng'
import { newGame } from './setup'
import type { Action, GameState } from './types'
import { previewEndTurn } from './zombies'

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
  'runningShoes',
  'softSoles',
  'axe',
  'pistol',
  'molotov',
  'alarmClock',
  'baseballBat',
  'districtMap',
  'lockpick',
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
    const preview = action.type === 'endTurn' ? previewEndTurn(state, defaultContent) : undefined
    const hpBefore = state.player.hp
    state = applyAction(state, action).state
    if (preview) {
      // The end-turn preview must match what really happened.
      expect(state.outcome?.cause === 'killed').toBe(preview.lethal)
      if (!preview.lethal) expect(state.player.hp).toBe(hpBefore - preview.damage)
    }
    check(state)
  }
  return { final: state, actions }
}

function invariants(state: GameState) {
  expect(checkInvariants(state)).toEqual([])
}

describe('random playthroughs', () => {
  it('keep every invariant and always end by the turn limit', () => {
    for (let seed = 1; seed <= 150; seed++) {
      const { final } = playRandomly(seed, invariants)
      expect(final.phase).toBe('gameOver')
      expect(['darkness', 'killed', 'home']).toContain(final.outcome?.cause)
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
