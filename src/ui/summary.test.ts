import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { texts } from '../data/texts.en'
import type { ExpeditionResult, Outcome, Stats } from '../game'
import { emptyStats } from '../game/stats'
import { endSummary } from './summary'

function result(outcome: Outcome, packs: number, stats: Partial<Stats> = {}): ExpeditionResult {
  return {
    outcome,
    packs,
    hpLeft: 0,
    turnsUsed: 6,
    cardsFound: stats.cardsTaken ?? [],
    stats: { ...emptyStats(balance.maxHp), ...stats },
  }
}

const killed: Outcome = { result: 'lost', cause: 'killed' }
const darkness: Outcome = { result: 'lost', cause: 'darkness' }
const home = (stars: number): Outcome => ({ result: 'won', cause: 'home', stars })

describe('end summary', () => {
  it('blames followers when they did most of the damage', () => {
    const summary = endSummary(
      result(killed, 0, { damageFromZombies: 10, attacksByFollowers: 6, attacksByZombiesThere: 4 }),
      balance,
    )
    expect(summary.explanation).toEqual([texts.end.killed(6), texts.end.zombieDamage(10, 6, 4)])
    expect(summary.tip).toBe(texts.end.tips.followers)
  })

  it('points at noise when it brought several zombies', () => {
    const summary = endSummary(
      result(killed, 1, {
        damageFromZombies: 10,
        attacksByZombiesThere: 10,
        zombiesFromNoise: 3,
        zombiesFromDusk: 1,
      }),
      balance,
    )
    expect(summary.explanation).toContain(texts.end.arrivals(3, 1))
    expect(summary.tip).toBe(texts.end.tips.noise(balance.noiseThreshold))
  })

  it('mentions health lost to your own cards and damage blocked', () => {
    const { explanation } = endSummary(
      result(killed, 0, { damageFromCards: 2, damageBlocked: 3 }),
      balance,
    )
    expect(explanation).toContain(texts.end.cardDamage(2))
    expect(explanation).toContain(texts.end.blocked(3))
  })

  it('tells a late player apart from one who found too little', () => {
    const short = endSummary(result(darkness, 1), balance)
    expect(short.tip).toBe(texts.end.tips.packsShort(balance.packsToWin))
    const late = endSummary(result(darkness, balance.packsToWin), balance)
    expect(late.tip).toBe(texts.end.tips.notHome)
  })

  it('names the packs for the next star, or says the run was perfect', () => {
    expect(endSummary(result(home(1), 2), balance).tip).toBe(texts.end.tips.moreStars(3))
    expect(endSummary(result(home(3), 4), balance).tip).toBe(texts.end.tips.perfect)
  })

  it('lists the cards you took by name', () => {
    const { stats } = endSummary(result(home(1), 2, { cardsTaken: ['axe', 'bandage'] }), balance)
    const taken = stats.find((row) => row.label === texts.end.stats.cardsTaken)
    expect(taken?.value).toBe('Axe, Bandage')
  })
})
