import { zombieInfo } from '../game'
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
  if (def.alwaysHasPack) return 1

  // The other packs are spread at random over the buildings without a fixed pack.
  const randomBuildings = Object.values(content.locations).filter(
    (l) => l.kind === 'building' && !l.alwaysHasPack,
  )
  const fixed = Object.values(content.locations).filter((l) => l.alwaysHasPack).length
  let packsLeft = state.balance.packsOnMap - fixed
  let unknown = 0
  for (const l of randomBuildings) {
    const s = state.sites[l.id]
    if (!s) continue
    if (s.packTaken || (s.scouted && s.hasPack)) packsLeft--
    else if (!s.scouted && !wasSearched(state, l.id)) unknown++
  }
  return unknown > 0 ? Math.min(1, Math.max(0, packsLeft / unknown)) : 0
}

function wasSearched(state: GameState, id: LocationId): boolean {
  const site = state.sites[id]
  return site !== undefined && site.searchesLeft < state.balance.searchesPerBuilding && !site.burned
}
