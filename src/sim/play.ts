import { defaultContent } from '../data/content'
import { applyAction, expeditionResult, newGame, ownedCount, validate } from '../game'
import type { Balance } from '../data/balance'
import type {
  CardId,
  Content,
  ExpeditionResult,
  ExpeditionSetup,
  GameEvent,
  GameState,
} from '../game'
import { checkInvariants } from '../game/invariants'
import type { Bot } from './bot'
import { makeRandom } from './random'

export interface PlayOptions {
  readonly balance?: Balance
  readonly content?: Content
  readonly setup?: ExpeditionSetup
  /** Check every invariant after every action (slower; the fuzz run does this). */
  readonly checkInvariants?: boolean
}

/** One finished game, with the numbers the report needs. */
export interface GameRecord {
  readonly seed: number
  readonly result: ExpeditionResult
  /** Cards owned at the end. */
  readonly deckSize: number
  readonly actions: number
  readonly quickSearches: number
  readonly servicesUsed: number
  /** Turns that ended without playing a card, moving or searching. */
  readonly idleTurns: number
  /** Times each card was played. */
  readonly plays: Readonly<Record<CardId, number>>
  /** Problems found: illegal bot moves, broken invariants, or a game that never ends. */
  readonly problems: readonly string[]
}

const maxActions = 2000

export function playGame(bot: Bot, seed: number, options: PlayOptions = {}): GameRecord {
  const content = options.content ?? defaultContent
  let state: GameState = newGame(seed, {
    balance: options.balance,
    content,
    setup: options.setup,
  })
  const random = makeRandom(seed * 7919 + 13)
  const problems: string[] = []
  const plays: Record<CardId, number> = {}
  let actions = 0
  let quickSearches = 0
  let servicesUsed = 0
  let idleTurns = 0
  let activeThisTurn = false

  const note = (events: readonly GameEvent[]) => {
    for (const e of events) {
      if (e.type === 'cardPlayed') {
        plays[e.card] = (plays[e.card] ?? 0) + 1
        activeThisTurn = true
      }
      if (e.type === 'moved' || e.type === 'searched' || e.type === 'serviceUsed') {
        activeThisTurn = true
      }
      if (e.type === 'searched' && e.quick) quickSearches++
      if (e.type === 'serviceUsed') servicesUsed++
      if (e.type === 'turnEnded') {
        if (!activeThisTurn) idleTurns++
        activeThisTurn = false
      }
    }
  }

  while (state.phase !== 'gameOver') {
    if (actions >= maxActions) {
      problems.push(`no end after ${maxActions} actions`)
      break
    }
    const action = bot.next(state, content, random)
    const check = validate(state, action, content)
    if (!check.ok) {
      problems.push(`illegal action ${JSON.stringify(action)}: ${check.reason}`)
      break
    }
    const step = applyAction(state, action, content)
    note(step.events)
    state = step.state
    actions++
    if (options.checkInvariants) {
      for (const p of checkInvariants(state, content)) {
        problems.push(`after action ${actions} (${action.type}): ${p}`)
      }
      if (problems.length > 0) break
    }
  }

  const result = expeditionResult(state) ?? {
    outcome: { result: 'lost', cause: 'darkness' },
    packs: state.player.packs,
    hpLeft: state.player.hp,
    turnsUsed: state.turn,
    cardsFound: state.stats.cardsTaken,
    stats: state.stats,
  }
  return {
    seed,
    result,
    deckSize: ownedCount(state.piles),
    actions,
    quickSearches,
    servicesUsed,
    idleTurns,
    plays,
    problems,
  }
}
