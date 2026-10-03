import { texts } from '../../data/texts.en'
import type { Content, GameState, LocationId, Validation } from '../../game'
import { distance, freeMoveCost } from '../../game'
import { locationText } from '../names'
import { siteSummary } from '../sites'

interface LocationPanelProps {
  readonly state: GameState
  readonly content: Content
  readonly location: LocationId
  /** Can the current click mode (free move or a pending card) go here? */
  readonly moveCheck: Validation | null
  /** Can you quick-search where you stand? */
  readonly quickSearch: Validation
  readonly onQuickSearch: () => void
}

export function LocationPanel({
  state,
  content,
  location,
  moveCheck,
  quickSearch,
  onQuickSearch,
}: LocationPanelProps) {
  const def = content.locations[location]
  const { name, description } = locationText(location)
  const here = state.player.location
  const isHere = location === here
  const steps = distance(content, here, location)
  const cost = freeMoveCost(state, content)
  const site = siteSummary(state, content, location)
  const ui = texts.ui
  const { cost: quickCost, options: quickOptions } = state.balance.quickSearch

  const freeMoveStatus = state.player.freeMoveUsed
    ? ui.freeMoveUsed
    : cost > 0
      ? ui.freeMoveCosts(cost)
      : ui.freeMoveAvailable

  return (
    <section className="panel location-panel" aria-label={ui.location} aria-live="polite">
      <p className="eyebrow">{def ? texts.locationKinds[def.kind] : ''}</p>
      <h2>{name}</h2>
      <p className="muted">{description}</p>
      <p className="where">{isHere ? ui.youAreHere : ui.stepsAway(steps)}</p>
      {site && (
        <ul className="site-facts">
          <li>{site.searches}</li>
          <li>{site.pack}</li>
        </ul>
      )}
      {!isHere && moveCheck && !moveCheck.ok && <p className="reason">{moveCheck.reason}</p>}
      {isHere && site && (
        <div className="quick-search">
          <button type="button" className="btn" disabled={!quickSearch.ok} onClick={onQuickSearch}>
            {ui.quickSearch(quickCost, quickOptions)}
          </button>
          {!quickSearch.ok && <p className="reason">{quickSearch.reason}</p>}
        </div>
      )}
      <p className="free-move">{freeMoveStatus}</p>
    </section>
  )
}
