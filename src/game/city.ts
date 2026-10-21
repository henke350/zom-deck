import type { Balance } from '../data/balance'
import { neighbors } from './map'
import { shuffle } from './rng'
import type { City, Content, GameState, LocationDef, LocationId } from './types'

/**
 * Random cities. The classic map in `content` gives the shape of the city: its positions,
 * roads and building slots (named after the classic building in each slot). A random city
 * puts a building from the pool into every slot, so some buildings are left out each time.
 */

/** Every building a city can use: the classic ones and the extra ones. */
export function buildingPool(
  content: Content,
): Readonly<Record<LocationId, Omit<LocationDef, 'mapPos'>>> {
  const classic = Object.values(content.locations).filter((l) => l.kind === 'building')
  return { ...Object.fromEntries(classic.map((l) => [l.id, l])), ...content.extraBuildings }
}

/** Picks the buildings of a new city and their slots. Buildings with a sure pack are always in. */
export function rollCity(content: Content, rng: number): [city: City, rng: number] {
  const slots = Object.values(content.locations)
    .filter((l) => l.kind === 'building')
    .map((l) => l.id)
  const pool = Object.values(buildingPool(content))
  const required = pool.filter((b) => b.alwaysHasPack).map((b) => b.id)
  const optional = pool.filter((b) => !b.alwaysHasPack).map((b) => b.id)
  const [shuffledOptional, afterPick] = shuffle(optional, rng)
  const chosen = [...required, ...shuffledOptional.slice(0, slots.length - required.length)]
  const [placed, next] = shuffle(chosen, afterPick)
  const city: Record<LocationId, LocationId> = {}
  slots.forEach((slot, i) => {
    const building = placed[i]
    if (building) city[slot] = building
  })
  return [city, next]
}

const cache = new WeakMap<City, WeakMap<Content, Content>>()
const derived = new WeakSet<Content>()

/**
 * The content of the city this game is played in: the buildings placed in their slots, with
 * the roads renamed to match. Without a random city (or for content already derived), the
 * content is returned unchanged. Every engine entry point calls this first.
 */
export function cityContent(state: GameState, content: Content): Content {
  return state.city ? contentForCity(state.city, content) : content
}

/** The content of one city (see `cityContent`). */
export function contentForCity(city: City, content: Content): Content {
  if (derived.has(content)) return content
  const known = cache.get(city)?.get(content)
  if (known) return known

  const pool = buildingPool(content)
  const rename = (id: LocationId) => city[id] ?? id
  const locations: Record<LocationId, LocationDef> = {}
  for (const loc of Object.values(content.locations)) {
    const building = city[loc.id] ? pool[city[loc.id] as LocationId] : undefined
    const def: LocationDef = building ? { ...building, mapPos: loc.mapPos } : loc
    locations[def.id] = def
  }
  const result: Content = {
    ...content,
    locations,
    connections: content.connections.map(([a, b]) => [rename(a), rename(b)] as const),
  }
  derived.add(result)
  const forCity = cache.get(city) ?? new WeakMap<Content, Content>()
  forCity.set(content, result)
  cache.set(city, forCity)
  return result
}

/** Rolls a city when the balance asks for one. */
export function maybeRollCity(
  content: Content,
  balance: Balance,
  rng: number,
): [city: City | undefined, rng: number] {
  return balance.randomCity ? rollCity(content, rng) : [undefined, rng]
}

/**
 * Does the player know what this building is? Places that are not buildings always are. With
 * hidden buildings, a building is known once the player has stood on it or next to it, or
 * scouted it.
 */
export function buildingKnown(state: GameState, content: Content, id: LocationId): boolean {
  const def = content.locations[id]
  if (!state.balance.hiddenBuildings || def?.kind !== 'building') return true
  if (state.visited.includes(id) || state.sites[id]?.scouted) return true
  return neighbors(content, id).some((n) => state.visited.includes(n))
}
