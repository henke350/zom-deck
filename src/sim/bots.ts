import { randomBot, type Bot } from './bot'
import { plannerBot, type PlannerOptions } from './planner'

/** A careful player who goes for ★★ and leaves a turn spare for the walk home. */
const careful: Omit<PlannerOptions, 'id' | 'style'> = {
  targetPacks: 3,
  takeFinds: true,
  fight: true,
  careful: true,
  homeMargin: 1,
  dangerWeight: 2.5,
  retreatHp: 3,
}

export interface BotInfo {
  readonly bot: Bot
  /** Danish name and description for the report (the user reads it). */
  readonly name: string
  readonly description: string
}

export const bots: readonly BotInfo[] = [
  {
    bot: randomBot,
    name: 'Tilfældig',
    description: 'Vælger en tilfældig lovlig handling. Nedre grænse og fuzz-test.',
  },
  {
    bot: plannerBot({
      id: 'rush',
      targetPacks: 2,
      takeFinds: false,
      fight: false,
      careful: false,
      homeMargin: 0,
      dangerWeight: 0,
      retreatHp: 0,
      style: 'balanced',
    }),
    name: 'Skynd dig hjem',
    description:
      'Fast rute uden valg: nærmeste bygning med chance for en pakke, ingen fund, ingen kamp, hjem ved 2 pakker.',
  },
  {
    bot: plannerBot({
      id: 'greedy',
      targetPacks: 4,
      takeFinds: true,
      fight: true,
      careful: false,
      homeMargin: 0,
      dangerWeight: 1,
      retreatHp: 2,
      style: 'balanced',
    }),
    name: 'Grådig',
    description:
      'Går efter alle 4 pakker (★★★), tager fund og kæmper. Går først hjem i sidste øjeblik.',
  },
  {
    bot: plannerBot({ id: 'quiet', style: 'quiet', ...careful, fight: false }),
    name: 'Stille',
    description: 'Forsigtig, går efter ★★. Foretrækker stille kort og sniger sig uden om kamp.',
  },
  {
    bot: plannerBot({ id: 'fighter', style: 'fighter', ...careful }),
    name: 'Kæmper',
    description: 'Forsigtig, går efter ★★. Foretrækker våben og Kevlar Vest.',
  },
  {
    bot: plannerBot({ id: 'runner', style: 'runner', ...careful }),
    name: 'Løber',
    description: 'Forsigtig, går efter ★★. Foretrækker bevægelseskort.',
  },
  {
    bot: plannerBot({ id: 'light', style: 'light', ...careful }),
    name: 'Let bagage',
    description: 'Forsigtig, går efter ★★. Tynder dækket ud (Toolbox, Workshop, Travel Light).',
  },
]
