import type { Content, LocationId } from './types'

export function neighbors(content: Content, id: LocationId): LocationId[] {
  const result: LocationId[] = []
  for (const [a, b] of content.connections) {
    if (a === id) result.push(b)
    else if (b === id) result.push(a)
  }
  return result
}

/** Fewest steps between two locations, or Infinity if there is no path. */
export function distance(content: Content, from: LocationId, to: LocationId): number {
  return distancesFrom(content, from)[to] ?? Number.POSITIVE_INFINITY
}

/** Steps from `from` to every reachable location (breadth-first search). */
export function distancesFrom(content: Content, from: LocationId): Record<LocationId, number> {
  const result: Record<LocationId, number> = { [from]: 0 }
  const queue: LocationId[] = [from]
  for (let i = 0; i < queue.length; i++) {
    const current = queue[i] as LocationId
    const steps = result[current] ?? 0
    for (const next of neighbors(content, current)) {
      if (result[next] === undefined) {
        result[next] = steps + 1
        queue.push(next)
      }
    }
  }
  return result
}
