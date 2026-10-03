import type { Balance } from '../data/balance'
import { texts } from '../data/texts.en'
import type { ExpeditionResult } from '../game'
import { cardText } from './names'

export interface EndSummary {
  /** What happened, a few short sentences. */
  readonly explanation: readonly string[]
  /** One thing to try next time. */
  readonly tip: string
  readonly stats: readonly StatRow[]
}

export interface StatRow {
  readonly label: string
  readonly value: string
  /** A long value that needs a whole line. */
  readonly wide?: boolean
}

/** Explains a finished expedition from its result. */
export function endSummary(result: ExpeditionResult, balance: Balance): EndSummary {
  const { outcome, stats, packs } = result
  const end = texts.end
  const explanation: string[] = []

  if (outcome.cause === 'home') explanation.push(end.home(result.turnsUsed, packs))
  if (outcome.cause === 'killed') explanation.push(end.killed(result.turnsUsed))
  if (outcome.cause === 'darkness') {
    explanation.push(end.darkness(result.turnsUsed, packs, balance.packsToWin))
  }
  if (stats.damageFromZombies > 0) {
    explanation.push(
      end.zombieDamage(
        stats.damageFromZombies,
        stats.attacksByFollowers,
        stats.attacksByZombiesThere,
      ),
    )
  }
  if (stats.damageFromCards > 0) explanation.push(end.cardDamage(stats.damageFromCards))
  if (stats.damageBlocked > 0) explanation.push(end.blocked(stats.damageBlocked))
  if (stats.zombiesFromNoise + stats.zombiesFromDusk > 0) {
    explanation.push(end.arrivals(stats.zombiesFromNoise, stats.zombiesFromDusk))
  }

  return { explanation, tip: tipFor(result, balance), stats: statRows(result) }
}

function tipFor({ outcome, stats, packs }: ExpeditionResult, balance: Balance): string {
  const tips = texts.end.tips
  switch (outcome.cause) {
    case 'killed': {
      const attacks = stats.attacksByFollowers + stats.attacksByZombiesThere
      if (stats.attacksByFollowers > 0 && stats.attacksByFollowers * 2 >= attacks) {
        return tips.followers
      }
      if (stats.zombiesFromNoise >= 2) return tips.noise(balance.noiseThreshold)
      return tips.attacked
    }
    case 'darkness':
      return packs >= balance.packsToWin ? tips.notHome : tips.packsShort(balance.packsToWin)
    case 'home': {
      const next = balance.starThresholds.find((needed) => needed > packs)
      return next === undefined ? tips.perfect : tips.moreStars(next)
    }
  }
}

function statRows({ stats, packs, hpLeft, turnsUsed, cardsFound }: ExpeditionResult): StatRow[] {
  const s = texts.end.stats
  const taken = cardsFound.map((card) => cardText(card).name).join(', ')
  return [
    { label: s.turns, value: String(turnsUsed) },
    { label: s.health, value: String(hpLeft) },
    { label: s.packs, value: String(packs) },
    { label: s.steps, value: String(stats.steps) },
    { label: s.searches, value: String(stats.searches) },
    { label: s.cardsRemoved, value: String(stats.cardsRemoved) },
    { label: s.killed, value: String(stats.zombiesKilled) },
    { label: s.healed, value: String(stats.healed) },
    { label: s.noise, value: String(stats.noiseMade) },
    { label: s.cardsTaken, value: taken || s.none, wide: true },
    {
      label: s.damage,
      value: s.damageValue(stats.damageFromZombies, stats.damageFromCards, stats.damageBlocked),
      wide: true,
    },
    {
      label: s.arrivals,
      value: s.arrivalsValue(stats.zombiesFromNoise, stats.zombiesFromDusk),
      wide: true,
    },
  ]
}
