import { useRef, type KeyboardEvent } from 'react'
import { texts } from '../../data/texts.en'
import type { Content, GameState, LocationId } from '../../game'
import { buildingKnown, zombieInfo, zombiesAt } from '../../game'
import { locationImages } from '../locationImages'
import { locationText } from '../names'
import { siteSummary } from '../sites'

interface CityMapProps {
  readonly state: GameState
  readonly content: Content
  /** Locations a click moves you to right now. */
  readonly destinations: ReadonlySet<LocationId>
  readonly selected: LocationId | null
  /** `touch`: the place was tapped with a finger, not clicked with a mouse or the keyboard. */
  readonly onActivate: (id: LocationId, touch: boolean) => void
  readonly onFocusLocation: (id: LocationId | null) => void
}

const NODE_W = 156
const NODE_H = 96
/** Height of the caption band at the bottom of a place, below its illustration. */
const BAND_H = 38
const MAX_DOTS = 5

/** A lettered dot per known zombie (W, R, B, S; ringed when it has seen you), or the range if unknown. */
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
  const y = pos.y - NODE_H / 2 + 15
  if (!info.known) {
    return (
      <g>
        <rect className="zpill" x={pos.x - 26} y={y - 9} width={52} height={18} rx={9} />
        <text className="zrange" x={pos.x} y={y + 4} textAnchor="middle">
          {texts.ui.zombiesRange(info.min, info.max)}
        </text>
      </g>
    )
  }
  const zombies = zombiesAt(state, id)
  if (zombies.length === 0) return null
  const shown = zombies.slice(0, MAX_DOTS)
  const step = 15
  const startX = pos.x - ((shown.length - 1) * step) / 2
  const pillW = (shown.length - 1) * step + 20 + (zombies.length > MAX_DOTS ? 18 : 0)
  return (
    <g>
      <rect className="zpill" x={startX - 10} y={y - 9} width={pillW} height={18} rx={9} />
      {shown.map((z, i) => (
        <g key={z.uid} className={`zdot-${z.kind}`}>
          <title>
            {z.hp > state.balance.zombies[z.kind].hp
              ? `${texts.zombieKinds[z.kind].name} (${texts.ui.tougherZombie})`
              : texts.zombieKinds[z.kind].name}
          </title>
          <circle
            className={z.alerted ? 'zdot zdot-alert' : 'zdot'}
            cx={startX + i * step}
            cy={y}
            r={6.5}
          />
          <text className="zletter" x={startX + i * step} y={y + 3.2} textAnchor="middle">
            {texts.zombieKinds[z.kind].short}
          </text>
          {z.hp > state.balance.zombies[z.kind].hp && (
            <text className="ztough" x={startX + i * step + 6} y={y - 3} textAnchor="middle">
              +
            </text>
          )}
        </g>
      ))}
      {zombies.length > MAX_DOTS && (
        <text className="zmore" x={startX + MAX_DOTS * step} y={y + 4}>
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
  const lastPointer = useRef('mouse')
  const here = state.player.location
  const pos = (id: LocationId) => content.locations[id]?.mapPos ?? { x: 0, y: 0 }
  // The drawing fits the map: the same margin on the far side as on the near side.
  const all = Object.values(content.locations).map((l) => l.mapPos)
  const size = {
    width: Math.max(...all.map((p) => p.x)) + Math.min(...all.map((p) => p.x)),
    height: Math.max(...all.map((p) => p.y)) + Math.min(...all.map((p) => p.y)),
  }
  const herePos = pos(here)

  const onKey = (id: LocationId) => (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onActivate(id, false)
    }
  }

  return (
    <figure className="city-map">
      <svg viewBox={`0 0 ${size.width} ${size.height}`} role="group" aria-label={texts.ui.map}>
        <g className="edges">
          {content.connections.map(([a, b]) => (
            <line key={`${a}-${b}`} x1={pos(a).x} y1={pos(a).y} x2={pos(b).x} y2={pos(b).y} />
          ))}
        </g>
        {Object.values(content.locations).map((loc) => {
          const { x, y } = loc.mapPos
          const known = buildingKnown(state, content, loc.id)
          const image = known ? locationImages[loc.id] : undefined
          const top = y - NODE_H / 2
          const bandTop = y + NODE_H / 2 - BAND_H
          const name = known ? locationText(loc.id).name : texts.ui.unknownMapName
          const isHere = loc.id === here
          const isDest = destinations.has(loc.id)
          const classes = [
            'node',
            `node-${loc.kind}`,
            !known && 'node-unknown',
            image && 'node-illustrated',
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
              onPointerDown={(e) => {
                lastPointer.current = e.pointerType
              }}
              onClick={() => onActivate(loc.id, lastPointer.current === 'touch')}
              onKeyDown={onKey(loc.id)}
              onMouseEnter={() => onFocusLocation(loc.id)}
              onMouseLeave={() => onFocusLocation(null)}
              onFocus={() => onFocusLocation(loc.id)}
              onBlur={() => onFocusLocation(null)}
            >
              <rect
                className="node-fill"
                x={x - NODE_W / 2}
                y={top}
                width={NODE_W}
                height={NODE_H}
                rx={6}
              />
              {image && (
                <>
                  <clipPath id={`map-clip-${loc.id}`}>
                    <rect x={x - NODE_W / 2} y={top} width={NODE_W} height={NODE_H} rx={6} />
                  </clipPath>
                  <image
                    href={image}
                    x={x - NODE_W / 2}
                    y={top}
                    width={NODE_W}
                    height={NODE_H - BAND_H + 6}
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#map-clip-${loc.id})`}
                  />
                  <rect
                    className="node-band"
                    x={x - NODE_W / 2}
                    y={bandTop}
                    width={NODE_W}
                    height={BAND_H}
                    clipPath={`url(#map-clip-${loc.id})`}
                  />
                </>
              )}
              <text className="node-name" x={x} y={bandTop + 16} textAnchor="middle">
                {name}
              </text>
              <text className="node-kind" x={x} y={bandTop + 31} textAnchor="middle">
                {known
                  ? (siteSummary(state, content, loc.id)?.short ?? texts.locationKinds[loc.kind])
                  : texts.ui.unknownShort}
              </text>
              <ZombieMarks state={state} content={content} id={loc.id} />
              <rect
                className="node-box"
                x={x - NODE_W / 2}
                y={top}
                width={NODE_W}
                height={NODE_H}
                rx={6}
              />
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
