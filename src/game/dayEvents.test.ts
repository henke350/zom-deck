import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { pickDayEvent, withDayEvent } from './dayEvents'
import { newGame } from './setup'

const ev = (id: string) => balance.events.options.find((e) => e.id === id)

describe('events of the day', () => {
  it('picks one per expedition from the seed, and every event turns up', () => {
    const seen = new Set<string>()
    for (let seed = 1; seed <= 400; seed++) seen.add(pickDayEvent(balance, seed)?.id ?? '')
    expect([...seen].sort()).toEqual(balance.events.options.map((e) => e.id).sort())
    expect(pickDayEvent(balance, 7)).toEqual(pickDayEvent(balance, 7))
    expect(pickDayEvent(balance, 7, 'none')).toBeUndefined()
    expect(pickDayEvent({ ...balance, events: { ...balance.events, enabled: false } }, 7)).toBe(
      undefined,
    )
  })

  it('does not shift the rest of the game: same deck order with or without an event', () => {
    const a = newGame(11, { setup: { dayEvent: 'none' } })
    const b = newGame(11, { setup: { dayEvent: 'rain' } })
    expect(b.piles.hand).toEqual(a.piles.hand)
    expect(b.dayEvent).toBe('rain')
    expect(a.dayEvent).toBeUndefined()
  })

  it('changes the balance of the expedition', () => {
    const rain = withDayEvent(balance, ev('rain'))
    expect(rain.danger.levels[0]!.noiseThreshold).toBe(balance.danger.levels[0]!.noiseThreshold + 1)
    expect(withDayEvent(balance, ev('fullMoon')).duskFromTurn).toBe(balance.duskFromTurn - 1)
    expect(withDayEvent(balance, ev('supplyDrop')).packsOnMap).toBe(balance.packsOnMap + 1)
    expect(withDayEvent(balance, ev('restless')).extraStartZombies).toBe(1)
    expect(withDayEvent(balance, ev('fog')).zombies.runner.followSteps).toBe(
      balance.zombies.runner.followSteps - 1,
    )
    const state = newGame(3, { setup: { dayEvent: 'supplyDrop' } })
    expect(Object.values(state.sites).filter((s) => s.hasPack)).toHaveLength(balance.packsOnMap + 1)
  })

  it('a found map scouts buildings, and a weapons cache adds a Pistol', () => {
    const map = newGame(5, { setup: { dayEvent: 'foundMap' } })
    expect(Object.values(map.sites).filter((s) => s.scouted)).toHaveLength(2)
    const cache = newGame(5, { setup: { dayEvent: 'cache' } })
    const cards = [...cache.piles.hand, ...cache.piles.draw].map((c) => c.card)
    expect(cards).toContain('pistol')
    expect(cards).toHaveLength(11)
  })
})
