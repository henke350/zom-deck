import type { KeyboardEvent } from 'react'
import { texts } from '../../data/texts.en'
import type { Content, GameState, LocationId } from '../../game'
import { locationText } from '../names'

interface CityMapProps {
  readonly state: GameState
  readonly content: Content
  /** Locations a click moves you to right now. */
  readonly destinations: ReadonlySet<LocationId>
  readonly selected: LocationId | null
  readonly onActivate: (id: LocationId) => void
  readonly onFocusLocation: (id: LocationId | null) => void
}

const NODE_W = 128
const NODE_H = 50

export function CityMap({
  state,
  content,
  destinations,
  selected,
  onActivate,
  onFocusLocation,
}: CityMapProps) {
  const here = state.player.location
  const pos = (id: LocationId) => content.locations[id]?.mapPos ?? { x: 0, y: 0 }
  const herePos = pos(here)

  const onKey = (id: LocationId) => (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onActivate(id)
    }
  }

  return (
    <figure className="city-map">
      <svg viewBox="0 0 640 400" role="group" aria-label={texts.ui.map}>
        <g className="edges">
          {content.connections.map(([a, b]) => (
            <line key={`${a}-${b}`} x1={pos(a).x} y1={pos(a).y} x2={pos(b).x} y2={pos(b).y} />
          ))}
        </g>
        {Object.values(content.locations).map((loc) => {
          const { x, y } = loc.mapPos
          const name = locationText(loc.id).name
          const isHere = loc.id === here
          const isDest = destinations.has(loc.id)
          const classes = [
            'node',
            `node-${loc.kind}`,
            isHere && 'node-here',
            isDest && 'node-dest',
            selected === loc.id && 'node-selected',
          ]
            .filter(Boolean)
            .join(' ')
          const label = [
            name,
            isHere ? texts.ui.youAreHere : '',
            isDest ? texts.ui.chooseDestination : '',
          ]
            .filter(Boolean)
            .join('. ')
          return (
            <g
              key={loc.id}
              className={classes}
              role="button"
              tabIndex={0}
              aria-label={label}
              data-location={loc.id}
              onClick={() => onActivate(loc.id)}
              onKeyDown={onKey(loc.id)}
              onMouseEnter={() => onFocusLocation(loc.id)}
              onMouseLeave={() => onFocusLocation(null)}
              onFocus={() => onFocusLocation(loc.id)}
              onBlur={() => onFocusLocation(null)}
            >
              <rect x={x - NODE_W / 2} y={y - NODE_H / 2} width={NODE_W} height={NODE_H} rx={6} />
              <text className="node-name" x={x} y={y - 2} textAnchor="middle">
                {name}
              </text>
              <text className="node-kind" x={x} y={y + 15} textAnchor="middle">
                {texts.locationKinds[loc.kind]}
              </text>
            </g>
          )
        })}
        <g className="token" aria-hidden="true">
          <circle cx={herePos.x + NODE_W / 2 - 6} cy={herePos.y - NODE_H / 2 + 2} r={13} />
          <text x={herePos.x + NODE_W / 2 - 6} y={herePos.y - NODE_H / 2 + 6} textAnchor="middle">
            {texts.ui.youToken}
          </text>
        </g>
      </svg>
    </figure>
  )
}
