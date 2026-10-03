import type { Balance } from '../data/balance'
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

/** The tuning knobs from docs/plan.md (section 7) that the M6 runs showed matter most. */
export const variants: readonly Variant[] = [
  { name: '8 liv', overrides: ['maxHp=8'] },
  { name: 'Zombier giver 2 skade', overrides: ['zombie.damage=2'] },
  { name: '+1 startzombie i hver bygning', overrides: ['extraStartZombies=1'] },
  {
    name: 'Run ×1 og Search ×4 i startdækket',
    overrides: ['starterDeck.run=1', 'starterDeck.search=4'],
  },
  {
    name: '9 liv, Run ×1 og Search ×4',
    overrides: ['maxHp=9', 'starterDeck.run=1', 'starterDeck.search=4'],
  },
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
