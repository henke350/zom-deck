import { buildingKnown, zombieInfo } from '../game'
import type { Content, GameState, LocationId } from '../game'

/**
 * What a player can see on screen, for the bots. Bots must decide from this, not from
 * hidden state such as where the random packs are or how many zombies an unvisited
 * building holds.
 */

/** Zombies a player would expect at a place: the exact number if known, else the middle of the range. */
export function expectedZombies(state: GameState, content: Content, id: LocationId): number {
  const info = zombieInfo(state, content, id)
  return info.known ? info.count : (info.min + info.max) / 2
}

/** Chance (0–1) that the next search at a building finds a supply pack, as the player can tell. */
export function packChance(state: GameState, content: Content, id: LocationId): number {
  const site = state.sites[id]
  const def = content.locations[id]
  if (!site || def?.kind !== 'building') return 0
  if (site.packTaken || site.burned || site.searchesLeft <= 0) return 0
  if (wasSearched(state, id)) return 0 // the first search always finds the pack
  if (site.scouted) return site.hasPack ? 1 : 0
  const known = buildingKnown(state, content, id)
  if (known && def.alwaysHasPack) return 1

  // Packs the player can't place yet are spread over every building that might hold one.
  let packsLeft = state.balance.packsOnMap
  let open = 0
  for (const [other, s] of Object.entries(state.sites)) {
    const otherDef = content.locations[other]
    const otherKnown = buildingKnown(state, content, other)
    if (s.packTaken || (s.scouted && s.hasPack)) packsLeft--
    else if (otherKnown && otherDef?.alwaysHasPack && !wasSearched(state, other)) packsLeft--
    else if (!s.scouted && !wasSearched(state, other)) open++
  }
  return open > 0 ? Math.min(1, Math.max(0, packsLeft / open)) : 0
}

function wasSearched(state: GameState, id: LocationId): boolean {
  const site = state.sites[id]
  return site !== undefined && site.searchesLeft < state.balance.searchesPerBuilding && !site.burned
}
