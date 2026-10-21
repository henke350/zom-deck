import { useCallback, useReducer } from 'react'
import { applyAction, newGame, validate } from '../game'
import type { Action, ExpeditionSetup, GameState } from '../game'
import type { Balance } from '../data/balance'
import { formatEvent } from './format'

export interface LogEntry {
  readonly id: number
  readonly turn: number
  readonly text: string
}

interface GameModel {
  readonly state: GameState
  readonly log: readonly LogEntry[]
  readonly nextLogId: number
}

interface GameStart {
  readonly seed: number
  readonly balance?: Balance
  readonly setup?: ExpeditionSetup
  /** Start from this exact state instead (used by tests). */
  readonly initialState?: GameState
}

function init({ seed, balance, setup, initialState }: GameStart): GameModel {
  const state = initialState ?? newGame(seed, { setup, balance })
  const opening = [
    formatEvent({ type: 'turnStarted', turn: state.turn }, state),
    formatEvent({ type: 'cardsDrawn', uids: state.piles.hand.map((c) => c.uid) }, state),
  ]
  const log = opening.flatMap((text, i) => (text ? [{ id: i, turn: state.turn, text }] : []))
  return { state, log, nextLogId: log.length }
}

function reducer(model: GameModel, action: Action): GameModel {
  // The UI only offers legal actions, but never let a stray click crash the game.
  if (!validate(model.state, action).ok) return model
  const { state, events } = applyAction(model.state, action)
  let nextLogId = model.nextLogId
  let turn = model.state.turn
  const added: LogEntry[] = []
  for (const event of events) {
    if (event.type === 'turnStarted') turn = event.turn
    const text = formatEvent(event, state)
    if (text) added.push({ id: nextLogId++, turn, text })
  }
  return { state, log: [...model.log, ...added], nextLogId }
}

/** Holds one expedition: the engine state, a readable log, and a dispatch function. */
export function useGame(
  seed: number,
  setup?: ExpeditionSetup,
  initialState?: GameState,
  balance?: Balance,
) {
  const [model, send] = useReducer(reducer, { seed, balance, setup, initialState }, init)
  const dispatch = useCallback((action: Action) => send(action), [])
  return { state: model.state, log: model.log, dispatch }
}
