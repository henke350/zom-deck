import { describe, expect, it } from 'vitest'
import { listActions } from './actions'
import { defaultContent } from '../data/content'
import { totalCount } from './deck'
import { applyAction } from './engine'
import { nextInt } from './rng'
import { newGame } from './setup'
import { expeditionResult } from './stats'
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

function invariants(start: number) {
  return (state: GameState) => {
    const { piles, player, balance } = state
    // Cards only appear as finds or Heavy Loads, and each new card takes the next uid.
    expect(totalCount(piles)).toBe(start + (state.nextUid - start - 1))
    const hidden = Object.values(state.sites).filter((s) => s.hasPack).length
    expect(player.packs + hidden).toBe(balance.packsOnMap)
    for (const site of Object.values(state.sites)) {
      expect(site.searchesLeft).toBeGreaterThanOrEqual(0)
      expect(site.searchesLeft).toBeLessThanOrEqual(balance.searchesPerBuilding)
    }
    expect(state.phase === 'chooseFind').toBe(state.pendingFind !== undefined)
    expect(state.noise).toBeGreaterThanOrEqual(0)
    expect(state.noise).toBeLessThan(balance.noiseThreshold)
    const zombieUids = state.zombies.map((z) => z.uid)
    expect(new Set(zombieUids).size).toBe(zombieUids.length)
    for (const z of state.zombies) {
      expect(z.hp).toBeGreaterThan(0)
      expect(defaultContent.locations[z.location]?.kind).not.toBe('shelter')
    }
    const uids = [piles.draw, piles.hand, piles.inPlay, piles.discard, piles.removed]
      .flat()
      .map((c) => c.uid)
    expect(new Set(uids).size).toBe(uids.length)
    expect(player.ap).toBeGreaterThanOrEqual(0)
    expect(defaultContent.locations[player.location]).toBeDefined()
    expect(player.hp).toBeLessThanOrEqual(balance.maxHp)
    expect(state.turn).toBeGreaterThanOrEqual(1)
    expect(state.turn).toBeLessThanOrEqual(balance.turnLimit)
    expect(state.phase === 'gameOver').toBe(state.outcome !== undefined)
    if (state.phase === 'gameOver') expect(listActions(state)).toEqual([])
    // The stats explain the health bar and the deck exactly.
    const { stats } = state
    expect(player.hp).toBe(
      stats.startHp + stats.healed - stats.damageFromZombies - stats.damageFromCards,
    )
    expect(stats.packsFound).toBe(player.packs)
    expect(stats.cardsTaken.length + stats.packsFound * balance.heavyLoadPerPack).toBe(
      state.nextUid - start - 1,
    )
    expect(stats.cardsRemoved).toBe(piles.removed.length)
    expect(stats.attacksByFollowers + stats.attacksByZombiesThere).toBeGreaterThanOrEqual(
      Math.ceil(stats.damageFromZombies / balance.zombie.damage),
    )
    expect(expeditionResult(state) === undefined).toBe(state.outcome === undefined)
  }
}

describe('random playthroughs', () => {
  it('keep every invariant and always end by the turn limit', () => {
    for (let seed = 1; seed <= 150; seed++) {
      const { final } = playRandomly(seed, invariants(fuzzDeck.length))
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
