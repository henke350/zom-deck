import type { Balance } from '../data/balance'

/**
 * Changes one balance value from the command line: "maxHp=12", "zombieFollow=gentle",
 * "wounds.enabled=true", "starThresholds=3,4,5". Unknown names are an error, so a typo
 * can't silently test the standard balance.
 */
export function applyOverride(balance: Balance, assignment: string): Balance {
  const [path = '', raw = ''] = assignment.split('=')
  const keys = path.split('.')
  const parse = (old: unknown): unknown => {
    if (typeof old === 'number') {
      const value = Number(raw)
      if (raw === '' || !Number.isFinite(value)) throw new Error(`"${path}" needs a number`)
      return value
    }
    if (typeof old === 'boolean') return raw === 'true'
    if (Array.isArray(old)) return raw.split(',').map(Number)
    return raw
  }
  const set = (obj: Record<string, unknown>, i: number): Record<string, unknown> => {
    const key = keys[i] ?? ''
    if (!(key in obj)) throw new Error(`Unknown balance value "${path}"`)
    const value =
      i === keys.length - 1 ? parse(obj[key]) : set(obj[key] as Record<string, unknown>, i + 1)
    return { ...obj, [key]: value }
  }
  return set(balance as unknown as Record<string, unknown>, 0) as unknown as Balance
}

export function applyOverrides(balance: Balance, assignments: readonly string[]): Balance {
  return assignments.reduce(applyOverride, balance)
}
