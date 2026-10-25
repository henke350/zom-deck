import type { Balance } from '../data/balance'
import { defaultContent } from '../data/content'
import { applyAction, cityContent, newGame } from '../game'
import type { Bot } from './bot'
import { makeRandom } from './random'
import { bots, type BotInfo } from './bots'
import { applyOverrides } from './overrides'
import { playGame } from './play'
import { summarize, type BotSummary } from './report'

/** Plays `games` games (seeds 1…games) with every bot and sums them up. */
export function runBots(
  balance: Balance,
  games: number,
  which: readonly BotInfo[] = bots,
): BotSummary[] {
  return which.map((info) => {
    const records = []
    for (let seed = 1; seed <= games; seed++) {
      records.push(playGame(info.bot, seed, { balance, checkInvariants: true }))
    }
    return summarize(info, records, balance)
  })
}

/** A balance change worth comparing in the report's "what if" section (Danish label). */
export interface Variant {
  readonly name: string
  readonly overrides: readonly string[]
}

/** Tuning knobs from docs/plan.md (section 7), compared with the current balance. */
export const variants: readonly Variant[] = [
  {
    name: 'Som i M6: 10 liv, Run ×2 og Search ×3',
    overrides: ['maxHp=10', 'starterDeck.run=2', 'starterDeck.search=3'],
  },
  {
    name: 'Klassisk kort, alt synligt (før 21. okt.)',
    overrides: ['randomCity=false', 'hiddenBuildings=false'],
  },
  { name: 'Tilfældig by, alt synligt', overrides: ['hiddenBuildings=false'] },
  { name: 'Uden faremeter (før 23. okt.)', overrides: ['danger.enabled=false'] },
  {
    name: 'Faremeter som 23. okt. (horder, fare 4: 2 zombier, ingen belønning)',
    overrides: [
      'danger.hordeSize=1',
      'danger.levels.3.arrivals=2',
      'danger.levels.1.rareFindWeight=0.25',
      'danger.levels.2.rareFindWeight=0.25',
      'danger.levels.3.rareFindWeight=0.25',
      'danger.levels.2.extraFinds=0',
      'danger.levels.3.extraFinds=0',
    ],
  },
  {
    name: 'Faremeter uden ekstra fund',
    overrides: ['danger.levels.2.extraFinds=0', 'danger.levels.3.extraFinds=0'],
  },
  { name: 'Sjældne fund hæver ikke faren', overrides: ['danger.perRareFind=0'] },
  { name: '10 liv', overrides: ['maxHp=10'] },
  { name: '8 liv', overrides: ['maxHp=8'] },
  { name: 'Zombier giver 2 skade', overrides: ['zombies.walker.damage=2'] },
  { name: '+1 startzombie i hver bygning', overrides: ['extraStartZombies=1'] },
  { name: '8 ture (skumring fra tur 6)', overrides: ['turnLimit=8', 'duskFromTurn=6'] },
]

export interface VariantResult {
  readonly variant: Variant
  readonly summaries: readonly BotSummary[]
}

export function runVariants(
  balance: Balance,
  games: number,
  list: readonly Variant[] = variants,
): VariantResult[] {
  const thinking = bots.filter((b) => b.bot.id !== 'random')
  return list.map((variant) => ({
    variant,
    summaries: runBots(applyOverrides(balance, variant.overrides), games, thinking),
  }))
}

/** One game as text lines: where the bot stood, its hand, the action and the events. */
export function traceGame(bot: Bot, seed: number, balance: Balance): string[] {
  let state = newGame(seed, { balance })
  const city = cityContent(state, defaultContent)
  const random = makeRandom(seed * 7919 + 13)
  const lines = [
    `city: ${Object.keys(state.sites).join(', ')}`,
    `packs: ${Object.entries(state.sites)
      .filter(([, s]) => s.hasPack)
      .map(([id]) => id)
      .join(', ')}`,
    `zombies: ${state.zombies.map((z) => z.location).join(', ')}`,
  ]
  for (let i = 0; i < 400 && state.phase !== 'gameOver'; i++) {
    const action = bot.next(state, city, random)
    const hand = state.piles.hand.map((c) => c.card).join(',')
    const { state: next, events } = applyAction(state, action, city)
    const what = events
      .filter((e) => e.type !== 'cardsDrawn' && e.type !== 'deckShuffled')
      .map(
        (e) => e.type + ('location' in e ? `@${e.location}` : '') + ('to' in e ? `>${e.to}` : ''),
      )
    lines.push(
      `T${state.turn} hp${state.player.hp} ap${state.player.ap} @${state.player.location} [${hand}] ` +
        `${JSON.stringify(action)} -> ${what.join(' ')}`,
    )
    state = next
  }
  lines.push(JSON.stringify(state.outcome))
  return lines
}
