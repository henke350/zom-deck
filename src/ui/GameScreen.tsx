import { useMemo, useState } from 'react'
import { defaultContent } from '../data/content'
import { texts } from '../data/texts.en'
import { cardOptions, freeMoveTargets, validate } from '../game'
import type { Action, ExpeditionSetup, LocationId, ModeOption, Validation } from '../game'
import { CityMap } from './components/CityMap'
import { EventLog } from './components/EventLog'
import { FindDialog } from './components/FindDialog'
import { GameOverPanel } from './components/GameOverPanel'
import { Hand, type PendingPlay } from './components/Hand'
import { LocationPanel } from './components/LocationPanel'
import { TopBar } from './components/TopBar'
import { cardText } from './names'
import { useGame } from './useGame'

interface GameScreenProps {
  readonly seed: number
  readonly setup?: ExpeditionSetup
  readonly onNewExpedition: () => void
  readonly onRestart: () => void
  readonly onExit: () => void
}

const content = defaultContent

export function GameScreen({ seed, setup, onNewExpedition, onRestart, onExit }: GameScreenProps) {
  const { state, log, dispatch } = useGame(seed, setup)
  const [pending, setPending] = useState<PendingPlay | null>(null)
  const [keepUid, setKeepUid] = useState<string | null>(null)
  const [hovered, setHovered] = useState<LocationId | null>(null)
  const [selected, setSelected] = useState<LocationId | null>(null)

  const optionsByUid = useMemo(
    () => new Map(state.piles.hand.map((c) => [c.uid, cardOptions(state, c.uid, content)])),
    [state],
  )

  // What a click on the map does right now: a pending card move, or the free move.
  const mapActions = useMemo(() => {
    const result = new Map<LocationId, Action>()
    if (pending?.kind === 'location') {
      for (const action of pending.options.actions) {
        if (action.target?.location) result.set(action.target.location, action)
      }
    } else if (!pending) {
      for (const to of freeMoveTargets(state, content)) result.set(to, { type: 'freeMove', to })
    }
    return result
  }, [pending, state])

  const act = (action: Action) => {
    dispatch(action)
    setPending(null)
    setSelected(null)
  }

  const onActivateLocation = (id: LocationId) => {
    const action = mapActions.get(id)
    if (action) act(action)
    else setSelected(id)
  }

  const onPlay = (uid: string, option: ModeOption) => {
    const [only] = option.actions
    if (option.target === undefined && only) {
      if (keepUid === uid) setKeepUid(null)
      act(only)
      return
    }
    if (option.target) setPending({ uid, mode: option.mode, kind: option.target, options: option })
  }

  const onTrash = (targetUid: string) => {
    const action = pending?.options.actions.find((a) => a.target?.trash === targetUid)
    if (!action) return
    if (keepUid === targetUid || keepUid === pending?.uid) setKeepUid(null)
    act(action)
  }

  const keepInHand = keepUid && state.piles.hand.some((c) => c.uid === keepUid) ? keepUid : null
  const endTurn = () => {
    act({ type: 'endTurn', keep: keepInHand ? [keepInHand] : [] })
    setKeepUid(null)
  }

  const shown = hovered ?? selected ?? state.player.location
  const moveCheck = moveCheckFor(shown)

  function moveCheckFor(id: LocationId): Validation | null {
    if (pending?.kind === 'location') {
      const action: Action = {
        type: 'playCard',
        uid: pending.uid,
        mode: pending.mode,
        target: { location: id },
      }
      return validate(state, action, content)
    }
    if (pending) return null
    return validate(state, { type: 'freeMove', to: id }, content)
  }

  const pendingName = pending ? cardText(cardIdFor(pending.uid)).name : ''
  function cardIdFor(uid: string) {
    return state.piles.hand.find((c) => c.uid === uid)?.card ?? uid
  }

  return (
    <div className="game">
      <TopBar state={state} />

      <main className="board">
        <CityMap
          state={state}
          content={content}
          destinations={new Set(mapActions.keys())}
          selected={selected}
          onActivate={onActivateLocation}
          onFocusLocation={setHovered}
        />
        <aside className="side">
          <LocationPanel
            state={state}
            content={content}
            location={shown}
            moveCheck={moveCheck}
            quickSearch={validate(state, { type: 'quickSearch' }, content)}
            onQuickSearch={() => act({ type: 'quickSearch' })}
          />
          <EventLog entries={log} />
        </aside>
      </main>

      <section className="hand-area" aria-label={texts.ui.hand}>
        <div className="hand-bar">
          {pending ? (
            <p className="prompt" role="status">
              <b>{pendingName}:</b>{' '}
              {pending.kind === 'location'
                ? texts.ui.chooseDestination
                : texts.ui.chooseTrashTarget}{' '}
              <button type="button" className="btn btn-quiet" onClick={() => setPending(null)}>
                {texts.ui.cancel}
              </button>
            </p>
          ) : (
            <p className="prompt muted">{texts.ui.keepHint(state.balance.keepCards)}</p>
          )}
          <button
            type="button"
            className="btn btn-primary"
            disabled={pending !== null || !validate(state, { type: 'endTurn' }, content).ok}
            onClick={endTurn}
          >
            {keepInHand
              ? texts.ui.endTurnKeeping(cardText(cardIdFor(keepInHand)).name)
              : texts.ui.endTurn}
          </button>
        </div>
        <Hand
          state={state}
          content={content}
          optionsByUid={optionsByUid}
          pending={pending}
          keepUid={keepInHand}
          onPlay={onPlay}
          onTrash={onTrash}
          onToggleKeep={(uid) => setKeepUid((current) => (current === uid ? null : uid))}
        />
      </section>

      {state.phase === 'chooseFind' && state.pendingFind && (
        <FindDialog state={state} content={content} find={state.pendingFind} onChoose={act} />
      )}

      {state.outcome && (
        <GameOverPanel
          outcome={state.outcome}
          turn={state.turn}
          onNewExpedition={onNewExpedition}
          onRestart={onRestart}
          onExit={onExit}
        />
      )}
    </div>
  )
}
