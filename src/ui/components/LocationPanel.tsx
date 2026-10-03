import { texts } from '../../data/texts.en'
import type { Content, GameState, LocationId, Validation } from '../../game'
import { distance, freeMoveCost } from '../../game'
import { locationText } from '../names'

interface LocationPanelProps {
  readonly state: GameState
  readonly content: Content
  readonly location: LocationId
  /** Can the current click mode (free move or a pending card) go here? */
  readonly moveCheck: Validation | null
}

export function LocationPanel({ state, content, location, moveCheck }: LocationPanelProps) {
  const def = content.locations[location]
  const { name, description } = locationText(location)
  const here = state.player.location
  const steps = distance(content, here, location)
  const cost = freeMoveCost(state, content)
  const ui = texts.ui

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
      <p className="where">{location === here ? ui.youAreHere : ui.stepsAway(steps)}</p>
      {location !== here && moveCheck && !moveCheck.ok && (
        <p className="reason">{moveCheck.reason}</p>
      )}
      <p className="free-move">{freeMoveStatus}</p>
    </section>
  )
}
