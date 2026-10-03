import type { KeyboardEvent } from 'react'
import { texts } from '../../data/texts.en'
import type { Content, GameState, LocationId } from '../../game'
import { zombieInfo, zombiesAt } from '../../game'
import { locationText } from '../names'
import { siteSummary } from '../sites'

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
const NODE_H = 58
const MAX_DOTS = 5

/** Red dots for known zombies (ringed when they have seen you), or the range if unknown. */
function ZombieMarks({
  state,
  content,
  id,
}: {
  state: GameState
  content: Content
  id: LocationId
}) {
  const pos = content.locations[id]?.mapPos
  if (!pos) return null
  const info = zombieInfo(state, content, id)
  const y = pos.y + 20
  if (!info.known) {
    return (
      <text className="zrange" x={pos.x} y={y + 4} textAnchor="middle">
        {texts.ui.zombiesRange(info.min, info.max)}
      </text>
    )
  }
  const zombies = zombiesAt(state, id)
  const shown = zombies.slice(0, MAX_DOTS)
  const startX = pos.x - ((shown.length - 1) * 11) / 2
  return (
    <g>
      {shown.map((z, i) => (
        <circle
          key={z.uid}
          className={z.alerted ? 'zdot zdot-alert' : 'zdot'}
          cx={startX + i * 11}
          cy={y}
          r={4.5}
        />
      ))}
      {zombies.length > MAX_DOTS && (
        <text className="zmore" x={startX + MAX_DOTS * 11} y={y + 4}>
          +{zombies.length - MAX_DOTS}
        </text>
      )}
    </g>
  )
}

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
              <text className="node-name" x={x} y={y - 8} textAnchor="middle">
                {name}
              </text>
              <ZombieMarks state={state} content={content} id={loc.id} />
              <text className="node-kind" x={x} y={y + 8} textAnchor="middle">
                {siteSummary(state, content, loc.id)?.short ?? texts.locationKinds[loc.kind]}
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
