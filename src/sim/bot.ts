import { listActions } from '../game'
import type { Action, Content, GameState } from '../game'
import type { Random } from './random'

/** A simulated player. It only sees what a player sees on screen (see view.ts). */
export interface Bot {
  readonly id: string
  /** Picks the next action. It must be legal (`validate` says ok). */
  next(state: GameState, content: Content, random: Random): Action
}

/** Picks any legal action at random. A baseline, and the fuzz tester. */
export const randomBot: Bot = {
  id: 'random',
  next(state, content, random) {
    const actions = listActions(state, content)
    const action = actions[random.int(actions.length)]
    if (!action) throw new Error('No legal action')
    return action
  },
}
