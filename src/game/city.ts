import type { Balance } from '../data/balance'
import { neighbors } from './map'
import { shuffle } from './rng'
import type { City, Content, GameState, LocationDef, LocationId } from './types'

/**
 * Random cities. A map gives the shape of the city: its positions, roads and building slots.
 * The classic map in `content` names each slot after its classic building; the large map
 * (`content.largeMap`) has empty slots. A random city puts a building from the pool into every
 * slot, so some buildings are left out each time, and downtown buildings go downtown first.
 */

const mapCache = new WeakMap<Content, Content>()

/**
 * The content with the city map the balance asks for. For the large map, the locations and
 * roads come from `content.largeMap`, and every building (classic and extra) is in the pool.
 */
export function mapContent(content: Content, map: Balance['cityMap']): Content {
  if (map !== 'large' || !content.largeMap) return content
  const known = mapCache.get(content)
  if (known) return known
  const result: Content = {
    ...content,
    locations: content.largeMap.locations,
    connections: content.largeMap.connections,
    extraBuildings: buildingPool(content),
  }
  mapCache.set(content, result)
  return result
}

/** Every building a city can use: the classic ones (not empty slots) and the extra ones. */
export function buildingPool(
  content: Content,
): Readonly<Record<LocationId, Omit<LocationDef, 'mapPos'>>> {
  const classic = Object.values(content.locations).filter((l) => l.kind === 'building' && !l.slot)
  return { ...Object.fromEntries(classic.map((l) => [l.id, l])), ...content.extraBuildings }
}

/** Picks the buildings of a new city and their slots. Buildings with a sure pack are always in. */
export function rollCity(content: Content, rng: number): [city: City, rng: number] {
  const slotDefs = Object.values(content.locations).filter((l) => l.kind === 'building')
  const pool = Object.values(buildingPool(content))
  if (pool.length < slotDefs.length) {
    throw new Error(`A city needs ${slotDefs.length} buildings, the pool has ${pool.length}`)
  }
  const required = pool.filter((b) => b.alwaysHasPack).map((b) => b.id)
  const optional = pool.filter((b) => !b.alwaysHasPack).map((b) => b.id)
  const [shuffledOptional, afterPick] = shuffle(optional, rng)
  const chosen = [...required, ...shuffledOptional.slice(0, slotDefs.length - required.length)]
  const [placed, next] = shuffle(chosen, afterPick)

  // Downtown slots take downtown buildings first; every other building keeps its shuffled order.
  const isDowntown = (id: LocationId) => pool.find((b) => b.id === id)?.downtown === true
  const downtownSlots = slotDefs.filter((s) => s.downtown)
  const queue = [...placed.filter(isDowntown), ...placed.filter((id) => !isDowntown(id))]
  const city: Record<LocationId, LocationId> = {}
  for (const s of downtownSlots) {
    const building = queue.shift()
    if (building) city[s.id] = building
  }
  const rest = placed.filter((id) => !Object.values(city).includes(id))
  slotDefs
    .filter((s) => !s.downtown)
    .forEach((s, i) => {
      const building = rest[i]
      if (building) city[s.id] = building
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
  return state.city
    ? contentForCity(state.city, mapContent(content, state.balance.cityMap))
    : content
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
  return balance.randomCity ? rollCity(mapContent(content, balance.cityMap), rng) : [undefined, rng]
}

/**
 * Does the player know what this building is? Places that are not buildings always are. With
 * hidden buildings, a building is known once the player has stood on it or next to it, or
 * scouted it (in a campaign: on any day so far).
 */
export function buildingKnown(state: GameState, content: Content, id: LocationId): boolean {
  const def = content.locations[id]
  if (!state.balance.hiddenBuildings || def?.kind !== 'building') return true
  if (state.visited.includes(id) || state.sites[id]?.scouted) return true
  // Campaign: what you learned about the city on earlier days stays known.
  if (state.known?.includes(id)) return true
  return neighbors(content, id).some((n) => state.visited.includes(n))
}
