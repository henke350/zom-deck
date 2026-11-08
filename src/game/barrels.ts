import type { Balance } from '../data/balance'
import { texts } from '../data/texts.en'
import { buildingKnown } from './city'
import { distance } from './map'
import { normalizeSeed, shuffle } from './rng'
import type { Content, GameEvent, GameState, LocationId, Validation } from './types'
import { addNoise, damageZombies, zombiesAt } from './zombies'

/**
 * Fuel barrels (inspired by Dead Island 2): a few stand around the city. Set one alight where you
 * stand or next door (`igniteBarrel`) and every zombie in its place takes heavy damage, Bats
 * too. It is loud, and lit where you stand it singes you as well. Numbers in `balance.barrels`.
 */

/** Where the barrels stand: places that are not the Shelter, from their own random numbers. */
export function placeBarrels(content: Content, balance: Balance, seed: number): LocationId[] {
  if (balance.barrels.count <= 0) return []
  const places = Object.values(content.locations)
    .filter((l) => l.kind !== 'shelter')
    .map((l) => l.id)
  return shuffle(places, normalizeSeed(seed ^ 0x3c6ef372))[0].slice(0, balance.barrels.count)
}

/** The barrels you can see on the map: on streets, and in buildings you know. */
export function visibleBarrels(state: GameState, content: Content): LocationId[] {
  return (state.barrels ?? []).filter(
    (id) => content.locations[id]?.kind !== 'building' || buildingKnown(state, content, id),
  )
}

export function validateIgnite(
  state: GameState,
  location: LocationId,
  content: Content,
): Validation {
  const r = texts.reasons
  const b = state.balance.barrels
  if (!(state.barrels ?? []).includes(location)) return { ok: false, reason: r.noBarrel }
  if (distance(content, state.player.location, location) > b.range) {
    return { ok: false, reason: r.barrelTooFar(b.range) }
  }
  if (state.player.ap < b.cost) return { ok: false, reason: r.notEnoughAp(b.cost, state.player.ap) }
  return { ok: true }
}

/** KA-BOOM: every zombie at the barrel's place takes its damage, then the noise. */
export function igniteBarrel(
  state: GameState,
  location: LocationId,
  content: Content,
  events: GameEvent[],
): GameState {
  const b = state.balance.barrels
  const self = location === state.player.location ? b.selfDamage : 0
  events.push({ type: 'barrelExploded', location, selfDamage: self })
  let next: GameState = {
    ...state,
    barrels: (state.barrels ?? []).filter((id) => id !== location),
    player: { ...state.player, ap: state.player.ap - b.cost },
  }
  next = damageZombies(
    next,
    zombiesAt(next, location).map((z) => z.uid),
    b.damage,
    events,
  )
  if (self > 0) {
    events.push({ type: 'hpLost', amount: self, source: 'card' })
    next = { ...next, player: { ...next.player, hp: next.player.hp - self } }
  }
  return addNoise(next, b.noise, content, 'noise', events)
}
