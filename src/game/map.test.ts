import { describe, expect, it } from 'vitest'
import { defaultContent } from '../data/content'
import { texts } from '../data/texts.en'
import { distance, distancesFrom, neighbors } from './map'

const ids = Object.keys(defaultContent.locations)

describe('city map data', () => {
  it('has the 8 places from the plan', () => {
    expect(ids.sort()).toEqual(
      [
        'houseA',
        'houseB',
        'pharmacy',
        'police',
        'shelter',
        'street',
        'supermarket',
        'workshop',
      ].sort(),
    )
  })

  it('only connects known places, never a place to itself, and never twice', () => {
    const seen = new Set<string>()
    for (const [a, b] of defaultContent.connections) {
      expect(ids).toContain(a)
      expect(ids).toContain(b)
      expect(a).not.toBe(b)
      const key = [a, b].sort().join('|')
      expect(seen.has(key)).toBe(false)
      seen.add(key)
    }
  })

  it('has neighbours that go both ways', () => {
    for (const id of ids) {
      for (const n of neighbors(defaultContent, id)) {
        expect(neighbors(defaultContent, n)).toContain(id)
      }
    }
  })

  it('can reach every place from the shelter', () => {
    expect(Object.keys(distancesFrom(defaultContent, 'shelter')).sort()).toEqual([...ids].sort())
  })

  it('matches the distances in the plan', () => {
    const steps = distancesFrom(defaultContent, defaultContent.startLocation)
    expect(steps).toEqual({
      shelter: 0,
      street: 1,
      houseA: 1,
      supermarket: 2,
      pharmacy: 2,
      houseB: 2,
      workshop: 2,
      police: 3,
    })
  })

  it('has exactly one shelter, used as the start', () => {
    const shelters = ids.filter((id) => defaultContent.locations[id]?.kind === 'shelter')
    expect(shelters).toEqual([defaultContent.startLocation])
  })

  it('has a name and description for every place', () => {
    expect(Object.keys(texts.locations).sort()).toEqual([...ids].sort())
  })

  it('reports no path as Infinity', () => {
    const island = { ...defaultContent, connections: [] }
    expect(distance(island, 'shelter', 'police')).toBe(Number.POSITIVE_INFINITY)
  })
})

describe('loot pools', () => {
  const locs = Object.values(defaultContent.locations)

  it('exist for every building and nowhere else', () => {
    for (const loc of locs) {
      if (loc.kind === 'building') expect(loc.lootPool?.length ?? 0).toBeGreaterThan(0)
      else expect(loc.lootPool).toBeUndefined()
    }
  })

  it('hold at least 5 different playable cards, so bonus searches can show 5', () => {
    for (const loc of locs.filter((l) => l.kind === 'building')) {
      const cards = new Set(loc.lootPool?.map((entry) => entry.card))
      expect(cards.size).toBeGreaterThanOrEqual(5)
      for (const entry of loc.lootPool ?? []) {
        expect(defaultContent.cards[entry.card]?.kind).toBe('action')
        expect(entry.weight).toBeGreaterThan(0)
      }
    }
  })

  it('put the guaranteed pack in the Supermarket only', () => {
    expect(locs.filter((l) => l.alwaysHasPack).map((l) => l.id)).toEqual(['supermarket'])
  })
})
