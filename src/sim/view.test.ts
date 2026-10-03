import { describe, expect, it } from 'vitest'
import { defaultContent } from '../data/content'
import { makeState } from '../game/testkit'
import type { GameState } from '../game'
import { expectedZombies, packChance } from './view'

const content = defaultContent

describe('what bots can see', () => {
  it('knows the Supermarket always has a pack and the others share the rest', () => {
    const state = makeState()
    expect(packChance(state, content, 'supermarket')).toBe(1)
    // 3 random packs over 5 buildings.
    expect(packChance(state, content, 'houseA')).toBeCloseTo(3 / 5)
    expect(packChance(state, content, 'street')).toBe(0)
  })

  it('updates the chance as buildings are searched', () => {
    const base = makeState()
    const searched = (state: GameState, id: string, packTaken: boolean): GameState => ({
      ...state,
      sites: {
        ...state.sites,
        [id]: { ...state.sites[id]!, searchesLeft: 1, packTaken, hasPack: false },
      },
    })
    const oneEmpty = searched(base, 'houseA', false)
    expect(packChance(oneEmpty, content, 'houseA')).toBe(0)
    expect(packChance(oneEmpty, content, 'houseB')).toBeCloseTo(3 / 4)
    const oneFound = searched(base, 'houseA', true)
    expect(packChance(oneFound, content, 'houseB')).toBeCloseTo(2 / 4)
  })

  it('trusts a scouted building and ignores what it cannot see', () => {
    const state = makeState({ packsAt: ['police'] })
    // The pack is really at the police station, but unscouted it is just a chance.
    expect(packChance(state, content, 'police')).toBeCloseTo(3 / 5)
    const scouted: GameState = {
      ...state,
      sites: { ...state.sites, police: { ...state.sites.police!, scouted: true } },
    }
    expect(packChance(scouted, content, 'police')).toBe(1)
  })

  it('expects the middle of the range in unvisited buildings', () => {
    const state = makeState({ zombies: [{ at: 'police' }, { at: 'police' }, { at: 'street' }] })
    expect(expectedZombies(state, content, 'police')).toBe(2.5)
    expect(expectedZombies(state, content, 'street')).toBe(1)
  })
})
