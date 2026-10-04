import { texts } from '../../data/texts.en'
import type { Action, Content, GameState, LocationId, Validation } from '../../game'
import { distance, freeMoveCost, zombieInfo, zombiesAt } from '../../game'
import { locationImages } from '../locationImages'
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
  /** While a card waits for a zombie target: the action for each zombie you can pick. */
  readonly zombieTargets: ReadonlyMap<string, Action> | null
  readonly onTarget: (action: Action) => void
}

export function LocationPanel({
  state,
  content,
  location,
  moveCheck,
  quickSearch,
  onQuickSearch,
  zombieTargets,
  onTarget,
}: LocationPanelProps) {
  const def = content.locations[location]
  const { name, description } = locationText(location)
  const here = state.player.location
  const isHere = location === here
  const steps = distance(content, here, location)
  const cost = freeMoveCost(state, content)
  const site = siteSummary(state, content, location)
  const info = zombieInfo(state, content, location)
  const zombies = zombiesAt(state, location)
  const ui = texts.ui
  const { cost: quickCost, options: quickOptions } = state.balance.quickSearch
  const maxHp = state.balance.zombie.hp

  const freeMoveStatus = state.player.freeMoveUsed
    ? ui.freeMoveUsed
    : cost > 0
      ? ui.freeMoveCosts(cost)
      : ui.freeMoveAvailable

  return (
    <section className="panel location-panel" aria-label={ui.location} aria-live="polite">
      {locationImages[location] && (
        <img className="location-art" src={locationImages[location]} alt="" />
      )}
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

      {!info.known ? (
        <p className="zombie-info">{ui.zombiesUnknown(info.min, info.max)}</p>
      ) : zombies.length === 0 ? (
        def?.kind !== 'shelter' && <p className="zombie-info muted">{ui.zombiesNone}</p>
      ) : (
        <section className="zombies" aria-label={ui.zombiesHeading}>
          <h3 className="eyebrow">{ui.zombiesHeading}</h3>
          <ul>
            {zombies.map((z, i) => {
              const target = zombieTargets?.get(z.uid)
              const status = [
                ui.zombieHealth(z.hp, maxHp),
                z.alerted ? ui.zombieSeenYou : '',
                z.neutralized ? ui.zombieDistracted : '',
              ]
                .filter(Boolean)
                .join(' · ')
              return (
                <li key={z.uid} data-zombie={z.uid}>
                  <span>
                    <b>{ui.zombieLabel(i + 1)}</b> {status}
                  </span>
                  {target && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      aria-label={`${ui.target} ${ui.zombieLabel(i + 1)}`}
                      onClick={() => onTarget(target)}
                    >
                      {ui.target}
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
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
