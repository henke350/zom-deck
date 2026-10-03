/**
 * Seeds for the UI. The engine never picks its own randomness; the UI chooses a
 * seed (or reads one from the address, e.g. ?seed=4711) and passes it in.
 */

const MAX_SEED = 2 ** 31 - 1

export function readSeedFromSearch(search: string): number | undefined {
  const value = new URLSearchParams(search).get('seed')
  if (value === null || !/^\d+$/.test(value)) return undefined
  const seed = Number(value)
  return seed <= MAX_SEED ? seed : undefined
}

export function randomSeed(): number {
  const buffer = new Uint32Array(1)
  crypto.getRandomValues(buffer)
  return (buffer[0] ?? 1) % MAX_SEED
}
