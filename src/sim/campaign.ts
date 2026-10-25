import type { Balance, UpgradeId } from '../data/balance'
import { defaultContent } from '../data/content'
import {
  build,
  chooseLocker,
  dayBalance,
  daySeed,
  daySetup,
  finishDay,
  lockerChoices,
  newCampaign,
  validateBuild,
} from '../game'
import type { CampaignState } from '../game'
import type { BotInfo } from './bots'
import { playGame } from './play'

/** What the bots build first: health and a lighter deck now, food and water later. */
const buildOrder: readonly UpgradeId[] = [
  'infirmary',
  'workbench',
  'rainCollector',
  'lookout',
  'locker',
  'garden',
]

export interface CampaignRecord {
  readonly seed: number
  readonly over: 'survived' | 'lost'
  readonly daysHome: number
  readonly losses: number
  readonly hungryNights: number
  readonly thirstyNights: number
  readonly materials: number
  readonly upgrades: readonly UpgradeId[]
  readonly problems: readonly string[]
}

/**
 * One whole campaign played by a bot. The bot plays each day as an ordinary expedition aiming
 * for 2 packs (one meal), then builds the first upgrade it can afford in `buildOrder`.
 */
export function playCampaign(info: BotInfo, seed: number, balance: Balance): CampaignRecord {
  let campaign: CampaignState = newCampaign(seed, balance, defaultContent)
  let materials = 0
  const problems: string[] = []
  for (let guard = 0; !campaign.over && guard < balance.campaign.days + 1; guard++) {
    const today = dayBalance(campaign, balance)
    // The bots plan for packsToWin; aim for one evening meal instead of "home at once".
    const botBalance = { ...today, packsToWin: Math.max(today.packsToWin, 2) }
    const record = playGame(info.bot, daySeed(campaign), {
      balance: botBalance,
      setup: daySetup(campaign, balance),
      checkInvariants: true,
    })
    problems.push(...record.problems)
    if (record.result.outcome.result === 'won') materials += record.result.materials
    campaign = finishDay(campaign, record.finalState, balance)
    for (const id of buildOrder) {
      if (validateBuild(campaign, id, balance).ok) campaign = build(campaign, id, balance)
    }
    const [keep] = lockerChoices(campaign)
    if (keep) campaign = chooseLocker(campaign, keep)
  }
  return {
    seed,
    over: campaign.over ?? 'lost',
    daysHome: campaign.history.filter((d) => d.outcome.result === 'won').length,
    losses: campaign.losses,
    hungryNights: campaign.history.filter((d) => !d.ate).length,
    thirstyNights: campaign.history.filter((d) => !d.drank).length,
    materials,
    upgrades: campaign.upgrades,
    problems,
  }
}

export interface CampaignSummary {
  readonly name: string
  readonly games: number
  readonly survived: number
  readonly avgDaysHome: number
  readonly avgHungry: number
  readonly avgThirsty: number
  readonly avgMaterials: number
  readonly avgUpgrades: number
  readonly problems: number
}

export function runCampaigns(
  infos: readonly BotInfo[],
  games: number,
  balance: Balance,
): CampaignSummary[] {
  return infos.map((info) => {
    const records = Array.from({ length: games }, (_, i) => playCampaign(info, i + 1, balance))
    const avg = (f: (r: CampaignRecord) => number) =>
      records.reduce((sum, r) => sum + f(r), 0) / Math.max(1, records.length)
    return {
      name: info.name,
      games,
      survived: records.filter((r) => r.over === 'survived').length / games,
      avgDaysHome: avg((r) => r.daysHome),
      avgHungry: avg((r) => r.hungryNights),
      avgThirsty: avg((r) => r.thirstyNights),
      avgMaterials: avg((r) => r.materials),
      avgUpgrades: avg((r) => r.upgrades.length),
      problems: records.reduce((n, r) => n + r.problems.length, 0),
    }
  })
}

/** A short table for the console (Danish, like the expedition report). */
export function campaignConsole(summaries: readonly CampaignSummary[], days: number): string {
  const pct = (x: number) => `${Math.round(x * 100)} %`.padStart(5)
  const n = (x: number) => x.toFixed(1).replace('.', ',').padStart(4)
  return summaries
    .map(
      (s) =>
        `${s.name.padEnd(15)} overlever ${days} dage ${pct(s.survived)}  hjem ${n(s.avgDaysHome)} dage  sult ${n(s.avgHungry)}  tørst ${n(s.avgThirsty)}  materialer ${n(s.avgMaterials)}  bygget ${n(s.avgUpgrades)}${s.problems ? `  FEJL ${s.problems}` : ''}`,
    )
    .join('\n')
}
