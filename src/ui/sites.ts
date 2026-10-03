import { texts } from '../data/texts.en'
import type { Content, GameState, LocationId } from '../game'

export interface SiteSummary {
  /** e.g. "Searches left: 1 of 2" */
  readonly searches: string
  /** Short form for the map, e.g. "1/2 searches" */
  readonly short: string
  readonly pack: string
}

/** What the player knows about a building: searches left and what they know of its pack. */
export function siteSummary(
  state: GameState,
  content: Content,
  id: LocationId,
): SiteSummary | undefined {
  const site = state.sites[id]
  const def = content.locations[id]
  if (!site || def?.kind !== 'building') return undefined
  const max = state.balance.searchesPerBuilding
  const searched = site.searchesLeft < max
  const status = texts.ui.packStatus
  const pack = site.packTaken
    ? status.found
    : searched
      ? status.none
      : def.alwaysHasPack
        ? status.always
        : status.unknown
  return {
    searches: texts.ui.searchesLeft(site.searchesLeft, max),
    short:
      site.searchesLeft > 0
        ? texts.ui.mapSearches(site.searchesLeft, max)
        : texts.ui.searchedOutShort,
    pack,
  }
}
