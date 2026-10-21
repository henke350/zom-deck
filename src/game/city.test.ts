import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { defaultContent } from '../data/content'
import { buildingKnown, buildingPool, cityContent } from './city'
import { applyAction } from './engine'
import { checkInvariants } from './invariants'
import { distance } from './map'
import { newGame } from './setup'
import type { GameState } from './types'
import { zombieInfo } from './zombies'

const slots = Object.values(defaultContent.locations).filter((l) => l.kind === 'building')

describe('random cities', () => {
  it('use as many buildings as there are slots, always with the Supermarket (500 seeds)', () => {
    const used = new Set<string>()
    const cities = new Set<string>()
    for (let seed = 1; seed <= 500; seed++) {
      const state = newGame(seed)
      const city = cityContent(state, defaultContent)
      const buildings = Object.values(city.locations).filter((l) => l.kind === 'building')
      expect(buildings).toHaveLength(slots.length)
      expect(buildings.map((b) => b.id)).toContain('supermarket')
      expect(Object.keys(state.sites).sort()).toEqual(buildings.map((b) => b.id).sort())
      for (const b of buildings) used.add(b.id)
      cities.add(JSON.stringify(state.city))
      expect(checkInvariants(state)).toEqual([])
    }
    expect(used.size).toBe(Object.keys(buildingPool(defaultContent)).length)
    expect(cities.size).toBeGreaterThan(400)
  })

  it('keep the classic roads, so the Shelter is always two steps from every slot or less', () => {
    const state = newGame(9)
    const city = cityContent(state, defaultContent)
    expect(city.connections).toHaveLength(defaultContent.connections.length)
    for (const id of Object.keys(city.locations)) {
      expect(distance(city, 'shelter', id)).toBeLessThanOrEqual(3)
    }
  })

  it('give the same city for the same seed', () => {
    expect(newGame(77).city).toEqual(newGame(77).city)
  })

  it('can be switched off to play the classic map', () => {
    const state = newGame(5, { balance: { ...balance, randomCity: false } })
    expect(state.city).toBeUndefined()
    expect(cityContent(state, defaultContent)).toBe(defaultContent)
  })
})

describe('hidden buildings', () => {
  const start = newGame(12)
  const city = cityContent(start, defaultContent)
  const slot = (classic: string) => start.city?.[classic] ?? classic

  it('show only the buildings next to where you have been', () => {
    // From the Shelter you can see the slot next door (west), not the far ones.
    expect(buildingKnown(start, city, slot('houseA'))).toBe(true)
    expect(buildingKnown(start, city, slot('police'))).toBe(false)
    expect(buildingKnown(start, city, 'street')).toBe(true)
  })

  it('give only a general zombie range for a building you cannot see', () => {
    const info = zombieInfo(start, city, slot('police'))
    expect(info.known).toBe(false)
  })

  it('come into view when you walk next to them', () => {
    let state: GameState = start
    state = applyAction(state, { type: 'freeMove', to: 'street' }).state
    expect(buildingKnown(state, city, slot('supermarket'))).toBe(true)
    expect(buildingKnown(state, city, slot('pharmacy'))).toBe(true)
    expect(buildingKnown(state, city, slot('police'))).toBe(false)
  })
})
