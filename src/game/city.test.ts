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
const classicCity = { ...balance, cityMap: 'classic' as const }
const classicGame = (seed: number) => newGame(seed, { balance: classicCity })

describe('random cities on the classic map', () => {
  it('use as many buildings as there are slots, always with the Supermarket (500 seeds)', () => {
    const used = new Set<string>()
    const cities = new Set<string>()
    for (let seed = 1; seed <= 500; seed++) {
      const state = classicGame(seed)
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
    const state = classicGame(9)
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

describe('random cities on the large map', () => {
  const large = defaultContent.largeMap!
  const largeSlots = Object.values(large.locations).filter((l) => l.slot)
  const downtownSlots = largeSlots.filter((l) => l.downtown).map((l) => l.id)

  it('fill every slot, always with the Supermarket, and use every building (500 seeds)', () => {
    const used = new Set<string>()
    for (let seed = 1; seed <= 500; seed++) {
      const state = newGame(seed)
      const city = cityContent(state, defaultContent)
      const buildings = Object.values(city.locations).filter((l) => l.kind === 'building')
      expect(buildings).toHaveLength(largeSlots.length)
      expect(buildings.some((b) => b.slot)).toBe(false)
      expect(buildings.map((b) => b.id)).toContain('supermarket')
      for (const b of buildings) used.add(b.id)
      expect(checkInvariants(state)).toEqual([])
    }
    expect(used.size).toBe(Object.keys(buildingPool(defaultContent)).length)
  })

  it('put downtown buildings downtown, far from the Shelter', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const state = newGame(seed)
      const city = state.city ?? {}
      const downtownBuildings = Object.entries(city).filter(
        ([, b]) => buildingPool(defaultContent)[b]?.downtown,
      )
      const inDowntown = downtownBuildings.filter(([slot]) => downtownSlots.includes(slot))
      expect(inDowntown.length).toBe(Math.min(downtownBuildings.length, downtownSlots.length))
    }
    const map = { ...defaultContent, ...large }
    for (const slot of downtownSlots) {
      expect(distance(map, 'shelter', slot)).toBeGreaterThanOrEqual(4)
    }
  })

  it('make the far corner five steps from home', () => {
    const map = { ...defaultContent, ...large }
    const far = Math.max(...Object.keys(large.locations).map((id) => distance(map, 'shelter', id)))
    expect(far).toBe(5)
  })
})

describe('hidden buildings', () => {
  const start = classicGame(12)
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
