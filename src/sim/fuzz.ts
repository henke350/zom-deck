import { balance as standard, type Balance } from '../data/balance'
import { defaultContent } from '../data/content'
import {
  applyAction,
  dayBalance,
  daySetup,
  listActions,
  newCampaign,
  newGame,
  previewEndTurn,
  validate,
} from '../game'
import type { Action, CampaignState, CardId, Content, ExpeditionSetup, GameState } from '../game'
import { checkInvariants } from '../game/invariants'
import { randomBot } from './bot'
import { makeRandom, type Random } from './random'

/** One kind of game the fuzz run plays: a balance variant and a start deck. */
export interface FuzzSetup {
  readonly name: string
  readonly balance: Balance
  readonly setup?: ExpeditionSetup
}

/** Every playable card plus junk, so random play tries everything. */
export function everyCardDeck(content: Content = defaultContent): CardId[] {
  const actions = Object.values(content.cards)
    .filter((c) => c.kind === 'action' && !c.companion)
    .map((c) => c.id)
  return [...actions, 'search', 'nerves', 'nerves', content.packCard, content.woundCard]
}

export function fuzzSetups(content: Content = defaultContent): FuzzSetup[] {
  const deck = everyCardDeck(content)
  return [
    { name: 'standard', balance: standard },
    { name: 'alle kort', balance: standard, setup: { startDeck: deck } },
    {
      name: 'Wound til',
      balance: { ...standard, wounds: { enabled: true, damageInOnePhase: 2 } },
      setup: { startDeck: deck },
    },
    { name: 'blid forfølgelse', balance: { ...standard, zombieFollow: 'gentle' } },
    {
      name: 'ingen forfølgelse, åben fare',
      balance: { ...standard, zombieFollow: 'off', hiddenDanger: false },
      setup: { startDeck: deck },
    },
    { name: 'lavt liv', balance: standard, setup: { startDeck: deck, startHp: 3 } },
    ...campaignSetups(content, deck),
  ]
}

/** Campaign days: day 1, and a later day in a half-plundered city with upgrades and Salvage. */
function campaignSetups(content: Content, deck: readonly CardId[]): FuzzSetup[] {
  const first = newCampaign(1, standard, content)
  const buildings = Object.keys(
    newGame(1, { balance: dayBalance(first, standard), setup: daySetup(first, standard, content) })
      .sites,
  )
  const half = buildings.slice(0, Math.floor(buildings.length / 2))
  const later: CampaignState = {
    ...first,
    day: 5,
    upgrades: ['lookout', 'infirmary', 'workbench'],
    hungry: true,
    thirsty: true,
    wounds: 1,
    known: buildings.slice(0, 4),
    searchesUsed: Object.fromEntries(half.map((id) => [id, standard.searchesPerBuilding])),
    burned: buildings.slice(-1),
  }
  const laterSetup = daySetup(later, standard, content)
  return [
    {
      name: 'kampagne dag 1',
      balance: dayBalance(first, standard),
      setup: daySetup(first, standard, content),
    },
    {
      name: 'kampagne, plyndret by',
      balance: dayBalance(later, standard),
      setup: { ...laterSetup, startDeck: [...deck, 'salvage', 'salvage'], dog: { hp: 2 } },
    },
  ]
}

export interface FuzzResult {
  readonly games: number
  readonly actions: number
  /** How the games ended: home, killed, darkness. */
  readonly endings: Readonly<Record<string, number>>
  readonly problems: readonly string[]
}

/**
 * Plays random legal actions until each game ends, and after every action checks that
 * nothing impossible happened. Every other game is played by an eager random player that
 * seldom ends its turn, so the run also reaches long, crowded games. Also checks that the end-turn preview matches what really
 * happens, and that every tenth game replays exactly from its seed and actions.
 */
export function fuzz(games: number, content: Content = defaultContent): FuzzResult {
  const setups = fuzzSetups(content)
  const problems: string[] = []
  const endings: Record<string, number> = {}
  let actions = 0
  for (let i = 0; i < games; i++) {
    const kind = setups[i % setups.length]
    if (!kind) continue
    const seed = i + 1
    const report = (what: string) => problems.push(`${kind.name}, seed ${seed}: ${what}`)
    const start = newGame(seed, { balance: kind.balance, content, setup: kind.setup })
    let state: GameState = start
    const random = makeRandom(seed)
    const taken: Action[] = []
    while (state.phase !== 'gameOver' && problems.length < 50) {
      if (taken.length > 2000) {
        report('the game never ends')
        break
      }
      const action =
        i % 2 === 1 ? eagerChoice(state, content, random) : randomBot.next(state, content, random)
      const check = validate(state, action, content)
      if (!check.ok) {
        report(`illegal action offered: ${JSON.stringify(action)} (${check.reason})`)
        break
      }
      const preview = action.type === 'endTurn' ? previewEndTurn(state, content) : undefined
      const before = state.player.hp
      state = applyAction(state, action, content).state
      taken.push(action)
      if (preview) {
        const died = state.outcome?.cause === 'killed'
        if (died !== preview.lethal) report('end-turn preview was wrong about death')
        if (!died && state.player.hp !== before - preview.damage) {
          report('end-turn preview was wrong about damage')
        }
      }
      for (const p of checkInvariants(state, content)) report(`after action ${taken.length}: ${p}`)
    }
    actions += taken.length
    const cause = state.outcome?.cause ?? 'unfinished'
    endings[cause] = (endings[cause] ?? 0) + 1
    if (i % 10 === 0) {
      let replay = start
      for (const action of taken) replay = applyAction(replay, action, content).state
      if (JSON.stringify(replay) !== JSON.stringify(state)) report('replay gave a different game')
    }
    if (problems.length >= 50) break
  }
  return { games, actions, endings, problems }
}

/** A random action, but it only ends the turn when nothing else is possible or 1 time in 8. */
function eagerChoice(state: GameState, content: Content, random: Random): Action {
  const all = listActions(state, content)
  const busy = all.filter((a) => a.type !== 'endTurn')
  const pool = busy.length > 0 && random.int(8) !== 0 ? busy : all
  const action = pool[random.int(pool.length)]
  if (!action) throw new Error('No legal action')
  return action
}
