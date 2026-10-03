import { nextInt } from '../game/rng'

/** A seeded source of chance for bots. Same seed, same choices. */
export interface Random {
  int(maxExclusive: number): number
}

export function makeRandom(seed: number): Random {
  let state = seed >>> 0
  return {
    int(maxExclusive) {
      const [value, next] = nextInt(state, maxExclusive)
      state = next
      return value
    },
  }
}
