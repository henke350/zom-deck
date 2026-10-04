import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { defaultContent } from '../data/content'
import { bots } from './bots'
import { fuzz } from './fuzz'
import { applyOverride, applyOverrides } from './overrides'
import { renderReport } from './report'
import { runBots, runVariants } from './simulate'

describe('balance overrides', () => {
  it('change numbers, nested values, switches and lists', () => {
    const before = structuredClone(balance)
    const b = applyOverrides(balance, [
      'maxHp=12',
      'zombie.damage=2',
      'wounds.enabled=true',
      'zombieFollow=gentle',
      'starThresholds=3,4,5',
    ])
    expect(b.maxHp).toBe(12)
    expect(b.zombie).toEqual({ hp: balance.zombie.hp, damage: 2 })
    expect(b.wounds.enabled).toBe(true)
    expect(b.zombieFollow).toBe('gentle')
    expect(b.starThresholds).toEqual([3, 4, 5])
    expect(balance).toEqual(before)
  })

  it('refuse names that do not exist and numbers that are not numbers', () => {
    expect(() => applyOverride(balance, 'maxHP=12')).toThrow('Unknown balance value "maxHP"')
    expect(() => applyOverride(balance, 'maxHp=lots')).toThrow('needs a number')
  })
})

describe('simulation and report', () => {
  it('runs every bot and writes a Danish report with all sections', () => {
    const summaries = runBots(balance, 5)
    expect(summaries.map((s) => s.id)).toEqual(bots.map((b) => b.bot.id))
    for (const s of summaries) {
      expect(s.games).toBe(5)
      expect(s.wins + s.killed + s.darkness).toBe(5)
      expect(s.problems).toEqual([])
    }
    const variants = runVariants(balance, 2, [{ name: '8 liv', overrides: ['maxHp=8'] }])
    const report = renderReport({
      summaries,
      balance,
      content: defaultContent,
      overrides: [],
      command: 'npm run sim',
      variants,
    })
    for (const heading of [
      '# Balancerapport',
      '## Kort fortalt',
      '## Resultat pr. bot',
      '## Hvor kommer faren fra?',
      '## Fundkort',
      '## Spørgsmålene fra planen (afsnit 7)',
      '## Hvad hvis?',
      '## Fejl',
    ]) {
      expect(report).toContain(heading)
    }
    expect(report).toContain('| 8 liv (`maxHp=8`) |')
  })
})

describe('fuzz run', () => {
  it('finds no broken rules in 60 random games of every kind', () => {
    const result = fuzz(60)
    expect(result.problems).toEqual([])
    expect(result.actions).toBeGreaterThan(60)
  })
})
