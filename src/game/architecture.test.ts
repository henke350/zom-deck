import { describe, expect, it } from 'vitest'

/**
 * Guards the architecture rules in CLAUDE.md: rules (src/game) and data
 * (src/data) are pure TypeScript. They never touch React, the DOM, the clock
 * or Math.random, so every game can be replayed from its seed. The simulator
 * (src/sim) runs in Node and follows the same rules, so its reports repeat exactly.
 */
const sources = import.meta.glob(
  ['../game/**/*.ts', '../data/**/*.ts', '../sim/**/*.ts', '!../**/*.test.ts', '!../**/*.test.tsx'],
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>

const forbidden: Array<[RegExp, string]> = [
  [/from\s+['"]react(-dom)?(\/[^'"]*)?['"]/, 'imports React'],
  [/from\s+['"][./]*\/ui\//, 'imports UI code'],
  [/Math\.random\s*\(/, 'uses Math.random (use the seeded RNG)'],
  [/Date\.now\s*\(|new Date\s*\(/, 'reads the clock'],
  [/\b(document|window|localStorage)\./, 'touches the browser'],
]

describe('architecture', () => {
  it('finds the source files it guards', () => {
    expect(Object.keys(sources).length).toBeGreaterThan(0)
    expect(Object.keys(sources).some((f) => f.includes('/sim/'))).toBe(true)
  })

  it.each(Object.entries(sources).filter(([f]) => !f.includes('/sim/')))(
    '%s does not depend on the simulator',
    (_file, code) => {
      expect(/from\s+['"][./]*\/sim\//.test(code)).toBe(false)
    },
  )

  it.each(Object.entries(sources))('%s stays pure', (_file, code) => {
    for (const [pattern, reason] of forbidden) {
      expect(pattern.test(code), reason).toBe(false)
    }
  })
})
