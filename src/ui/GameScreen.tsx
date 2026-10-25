import { useCallback, useEffect, useMemo, useState } from 'react'
import { defaultContent } from '../data/content'
import { texts } from '../data/texts.en'
import {
  cardOptions,
  cityContent,
  dogOptions,
  expeditionResult,
  freeMoveTargets,
  gearOptions,
  listActions,
  previewEndTurn,
  previewOutcome,
  resultWith,
  validate,
  validateServiceHere,
  zombiesAt,
} from '../game'
import type {
  Action,
  ExpeditionSetup,
  GameState,
  LocationId,
  ModeOption,
  Validation,
} from '../game'
import type { Balance } from '../data/balance'
import { CityMap } from './components/CityMap'
import { DangerNotice } from './components/DangerNotice'
import { HomePrompt } from './components/HomePrompt'
import { GearRow } from './components/GearRow'
import { EventLog } from './components/EventLog'
import { FindChoice } from './components/FindChoice'
import { GameOverPanel } from './components/GameOverPanel'
import { Hand, type PendingPlay } from './components/Hand'
import { LocationPanel } from './components/LocationPanel'
import { RulesPage } from './components/RulesPage'
import { TopBar } from './components/TopBar'
import { EndTurnPreview } from './components/EndTurnPreview'
import { cardText } from './names'
import { currentHint } from './hints'
import { markRulesSeen, setTipsHidden, tipsHidden } from './storage'
import { TipLine } from './components/TipLine'
import { useGame } from './useGame'

interface GameScreenProps {
  readonly seed: number
  readonly setup?: ExpeditionSetup
  /** Start from this exact state (used by tests). */
  readonly initialState?: GameState
  /** Other balance values (used by tests). */
  readonly balance?: Balance
  /** Open the rules as soon as the game starts (first expedition on this device). */
  readonly showRulesOnStart?: boolean
  readonly onNewExpedition: () => void
  readonly onRestart: () => void
  readonly onExit: () => void
  /** Campaign: called with every new state, so the day can be saved and resumed. */
  readonly onStateChange?: (state: GameState) => void
  /** Campaign: the day is over; go back to the base with the final state. */
  readonly onDayOver?: (state: GameState) => void
}

export function GameScreen({
  seed,
  setup,
  initialState,
  balance,
  showRulesOnStart = false,
  onNewExpedition,
  onRestart,
  onExit,
  onStateChange,
  onDayOver,
}: GameScreenProps) {
  const { state, log, dispatch } = useGame(seed, setup, initialState, balance)
  useEffect(() => onStateChange?.(state), [state, onStateChange])
  // The buildings of this city, where they stand and how the roads connect them.
  const content = useMemo(() => cityContent(state, defaultContent), [state])
  const [rulesOpen, setRulesOpen] = useState(showRulesOnStart)
  // A notice above the hand when the danger meter rises, so the ramp-up is felt.
  const [dangerShown, setDangerShown] = useState(state.danger)
  const [dangerNotice, setDangerNotice] = useState<number | null>(null)
  if (state.danger !== dangerShown) {
    setDangerShown(state.danger)
    setDangerNotice(state.danger > dangerShown ? state.danger : null)
  }
  const closeDangerNotice = useCallback(() => setDangerNotice(null), [])
  const [tipsOn, setTipsOn] = useState(() => !tipsHidden())
  const showTips = (on: boolean) => {
    setTipsHidden(!on)
    setTipsOn(on)
  }
  // A move that would end the expedition by walking home, waiting for the player to confirm.
  const [homeMove, setHomeMove] = useState<Action | null>(null)
  const [pending, setPending] = useState<PendingPlay | null>(null)
  // The service where you stand (Dismantle, Patch up) is waiting for a card to trash.
  const [serviceOpen, setServiceOpen] = useState(false)
  const [keepUid, setKeepUid] = useState<string | null>(null)
  const [hovered, setHovered] = useState<LocationId | null>(null)
  const [selected, setSelected] = useState<LocationId | null>(null)

  const optionsByUid = useMemo(
    () => new Map(state.piles.hand.map((c) => [c.uid, cardOptions(state, c.uid, content)])),
    [state, content],
  )

  // What a click on the map does right now: a pending card move, or the free move.
  const mapActions = useMemo(() => {
    const result = new Map<LocationId, Action>()
    if (pending?.kind === 'location') {
      for (const action of pending.options.actions) {
        if (action.target?.location) result.set(action.target.location, action)
      }
    } else if (!pending && !serviceOpen) {
      for (const to of freeMoveTargets(state, content)) result.set(to, { type: 'freeMove', to })
    }
    return result
  }, [pending, serviceOpen, state, content])

  // Cards you can pick right now to trash or discard, with the action each pick makes.
  const pickTargets = useMemo((): ReadonlyMap<string, Action> | null => {
    if (pending?.kind === 'trash' || pending?.kind === 'discard') {
      const key = pending.kind
      return new Map(pending.options.actions.map((a) => [a.target?.[key] ?? '', a as Action]))
    }
    if (serviceOpen) {
      return new Map(
        listActions(state, content).flatMap((a) =>
          a.type === 'useService' ? [[a.uid, a as Action] as const] : [],
        ),
      )
    }
    return null
  }, [pending, serviceOpen, state, content])

  const act = (action: Action, confirmed = false) => {
    setPending(null)
    setServiceOpen(false)
    setHomeMove(null)
    // The danger notice stays while you pick the find of the search that raised danger.
    if (state.phase !== 'chooseFind') setDangerNotice(null)
    if (!confirmed && previewOutcome(state, action, content)?.result === 'won') {
      setHomeMove(action)
      return
    }
    dispatch(action)
    setSelected(null)
  }

  const serviceCheck = validateServiceHere(state, content)
  const stashActions = useMemo(
    () =>
      listActions(state, content)
        .filter((a) => a.type === 'openStash')
        // Quiet ways first: with a Tool card, then by force.
        .sort((a, b) => Number(a.uid === undefined) - Number(b.uid === undefined)),
    [state, content],
  )
  const forceCheck = validate(state, { type: 'openStash' }, content)
  const openService = () => {
    setPending(null)
    setServiceOpen(true)
  }

  const closeRules = () => {
    markRulesSeen()
    setRulesOpen(false)
  }

  // A mouse click on a highlighted place goes there at once. A finger tap first shows the
  // place; a second tap (or Go here in the panel) goes there, so a stray touch costs nothing.
  const onActivateLocation = (id: LocationId, touch: boolean) => {
    const action = mapActions.get(id)
    if (action && (!touch || selected === id)) act(action)
    else setSelected(id)
  }

  const onPlay = (uid: string, option: ModeOption) => {
    const [only] = option.actions
    // No choice needed, or only one zombie to hit: play it straight away.
    const single = option.target === 'zombie' && option.actions.length === 1
    if ((option.target === undefined || single) && only) {
      if (keepUid === uid) setKeepUid(null)
      act(only)
      return
    }
    if (option.target) {
      if (option.target === 'zombie') setSelected(null)
      setPending({ uid, mode: option.mode, kind: option.target, options: option })
    }
  }

  const onPick = (targetUid: string) => {
    const action = pickTargets?.get(targetUid)
    if (!action) return
    if (keepUid === targetUid || keepUid === pending?.uid) setKeepUid(null)
    act(action)
  }

  const keepInHand = keepUid && state.piles.hand.some((c) => c.uid === keepUid) ? keepUid : null
  const endTurn = () => {
    act({ type: 'endTurn', keep: keepInHand ? [keepInHand] : [] })
    setKeepUid(null)
  }

  // The side panel shows where you are (or a place you clicked). A hovered place is shown on top.
  // While a ranged weapon waits for a target, a tap on the map shows the zombies there.
  const shown = selected ?? state.player.location
  const ranged =
    pending?.kind === 'zombie' &&
    pending.options.actions.some(
      (a) => !zombiesAt(state, state.player.location).some((z) => z.uid === a.target?.zombie),
    )
  const peek = pending?.kind !== 'zombie' && hovered !== shown ? hovered : null
  const zombieTargets =
    pending?.kind === 'zombie'
      ? new Map(pending.options.actions.map((a) => [a.target?.zombie ?? '', a as Action]))
      : null
  const preview = state.phase === 'action' ? previewEndTurn(state, content) : null
  const result = expeditionResult(state)
  const homeOutcome = homeMove ? previewOutcome(state, homeMove, content) : undefined

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
    if (pending || serviceOpen) return null
    return validate(state, { type: 'freeMove', to: id }, content)
  }

  const serviceHere = content.locations[state.player.location]?.service
  const pendingName = pending
    ? pending.uid === 'dog'
      ? cardText('dog').name
      : cardText(cardIdFor(pending.uid)).name
    : serviceOpen && serviceHere
      ? texts.services[serviceHere.id].name
      : ''
  const cancelChoice = () => {
    setPending(null)
    setServiceOpen(false)
  }
  function cardIdFor(uid: string) {
    return [...state.piles.hand, ...state.piles.gear].find((c) => c.uid === uid)?.card ?? uid
  }

  // Use a piece of gear (the Crossbow): one target goes at once, more open a choice.
  // Sic: one zombie here is bitten at once; with more, pick one on the panel.
  const onSic = () => {
    const option = dogOptions(state, content)
    const [only] = option?.actions ?? []
    if (!option || !only) return
    if (option.actions.length === 1) {
      act(only)
      return
    }
    setSelected(null)
    setPending({ uid: 'dog', mode: 0, kind: 'zombie', options: option })
  }

  const onUseGear = (uid: string) => {
    const option = gearOptions(state, uid, content)
    const [only] = option?.actions ?? []
    if (!option || !only) return
    if (option.actions.length === 1) {
      act(only)
      return
    }
    setSelected(null)
    setPending({ uid, mode: 0, kind: 'zombie', options: option })
  }

  // Rules and the end of the expedition are pages of their own, not pop-ups over the game.
  if (rulesOpen) {
    return (
      <RulesPage
        balance={state.balance}
        onClose={closeRules}
        onShowTips={tipsOn ? undefined : () => showTips(true)}
      />
    )
  }
  if (result) {
    return (
      <GameOverPanel
        result={result}
        balance={state.balance}
        seed={state.seed}
        onNewExpedition={onNewExpedition}
        onRestart={onRestart}
        onExit={onExit}
        {...(onDayOver ? { onBackToBase: () => onDayOver(state) } : {})}
      />
    )
  }

  const choosingFind = state.phase === 'chooseFind' ? state.pendingFind : undefined

  return (
    <div className="game">
      <TopBar state={state} onShowRules={() => setRulesOpen(true)} />

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
          <div className="location-stack">
            <LocationPanel
              state={state}
              content={content}
              location={shown}
              moveCheck={moveCheckFor(shown)}
              onMove={mapActions.has(shown) ? () => onActivateLocation(shown, false) : undefined}
              quickSearch={validate(state, { type: 'quickSearch' }, content)}
              onQuickSearch={() => act({ type: 'quickSearch' })}
              zombieTargets={zombieTargets}
              onTarget={act}
              serviceCheck={serviceCheck}
              onService={openService}
              stashActions={stashActions}
              forceCheck={forceCheck}
            />
            {peek && (
              <div className="location-peek">
                <LocationPanel
                  state={state}
                  content={content}
                  location={peek}
                  moveCheck={moveCheckFor(peek)}
                  quickSearch={validate(state, { type: 'quickSearch' }, content)}
                  onQuickSearch={() => act({ type: 'quickSearch' })}
                  zombieTargets={null}
                  onTarget={act}
                  serviceCheck={serviceCheck}
                  onService={openService}
                  stashActions={stashActions}
                  forceCheck={forceCheck}
                />
              </div>
            )}
          </div>
          <EventLog entries={log} />
        </aside>
      </main>

      <section className="hand-area" aria-label={texts.ui.hand}>
        <GearRow
          state={state}
          content={content}
          onUse={onUseGear}
          onSic={onSic}
          busy={pending !== null}
        />
        {choosingFind ? (
          <FindChoice
            state={state}
            content={content}
            find={choosingFind}
            onChoose={act}
            notice={
              dangerNotice !== null && (
                <DangerNotice
                  level={dangerNotice}
                  balance={state.balance}
                  content={content}
                  onClose={closeDangerNotice}
                />
              )
            }
          />
        ) : (
          <>
            <div className="hand-bar">
              {pending || serviceOpen ? (
                <p className="prompt" role="status">
                  <b>{pendingName}:</b>{' '}
                  {
                    {
                      location: texts.ui.chooseOnMap,
                      trash: texts.ui.chooseTrashTarget,
                      discard: texts.ui.chooseDiscardTarget,
                      zombie: ranged ? texts.ui.chooseZombieInRange : texts.ui.chooseZombieTarget,
                    }[pending?.kind ?? 'trash']
                  }{' '}
                  <button type="button" className="btn btn-quiet" onClick={cancelChoice}>
                    {texts.ui.cancel}
                  </button>
                </p>
              ) : homeMove && homeOutcome ? (
                <HomePrompt
                  packs={state.player.packs}
                  stars={homeOutcome.stars ?? 0}
                  nextStarAt={state.balance.starThresholds.find((n) => n > state.player.packs)}
                  onConfirm={() => act(homeMove, true)}
                  onCancel={() => setHomeMove(null)}
                  {...(state.campaignDay !== undefined
                    ? {
                        campaign: {
                          day: state.campaignDay,
                          ...resultWith(state, homeOutcome, defaultContent),
                        },
                      }
                    : {})}
                />
              ) : dangerNotice !== null ? (
                <DangerNotice
                  level={dangerNotice}
                  balance={state.balance}
                  content={content}
                  onClose={closeDangerNotice}
                />
              ) : (
                <TipLine
                  hint={tipsOn ? currentHint(state, content) : null}
                  keep={state.balance.keepCards}
                  onHide={() => showTips(false)}
                />
              )}
              {preview && <EndTurnPreview preview={preview} />}
              <button
                type="button"
                className="btn btn-primary"
                aria-describedby="end-turn-preview"
                disabled={
                  pending !== null ||
                  serviceOpen ||
                  homeMove !== null ||
                  !validate(state, { type: 'endTurn' }, content).ok
                }
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
              pickTargets={pickTargets}
              keepUid={keepInHand}
              onPlay={onPlay}
              onPick={onPick}
              onToggleKeep={(uid) => setKeepUid((current) => (current === uid ? null : uid))}
            />
          </>
        )}
      </section>
    </div>
  )
}
