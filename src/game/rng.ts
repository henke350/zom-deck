/**
 * Seeded random numbers (mulberry32). The generator state is a single number
 * stored in GameState, so the same seed always gives the same game.
 * Every function returns the value together with the next generator state.
 */

export function normalizeSeed(seed: number): number {
  if (!Number.isFinite(seed)) throw new Error(`Seed must be a finite number, got ${seed}`)
  return Math.trunc(seed) >>> 0
}

/** A number in [0, 1) and the next generator state. */
export function nextFloat(rng: number): [value: number, rng: number] {
  const next = (rng + 0x6d2b79f5) >>> 0
  let t = Math.imul(next ^ (next >>> 15), next | 1)
  t = (t + Math.imul(t ^ (t >>> 7), t | 61)) ^ t
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, next]
}

/** An integer in [0, maxExclusive) and the next generator state. */
export function nextInt(rng: number, maxExclusive: number): [value: number, rng: number] {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new Error(`maxExclusive must be a positive integer, got ${maxExclusive}`)
  }
  const [value, next] = nextFloat(rng)
  return [Math.floor(value * maxExclusive), next]
}

/** A shuffled copy (Fisher–Yates) and the next generator state. */
export function shuffle<T>(items: readonly T[], rng: number): [shuffled: T[], rng: number] {
  const result = [...items]
  let state = rng
  for (let i = result.length - 1; i > 0; i--) {
    const [j, next] = nextInt(state, i + 1)
    state = next
    const a = result[i] as T
    result[i] = result[j] as T
    result[j] = a
  }
  return [result, state]
}
