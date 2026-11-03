import type { Balance, DayEvent, DayEventId } from '../data/balance'
import { nextFloat, normalizeSeed } from './rng'

/**
 * Events of the day (inspired by Maximum Apocalypse's Day/Night cards): every expedition starts
 * with one, and it changes the rules a little for that whole expedition. Most events are
 * balance changes; finding a map and the weapons cache also change the start (see newGame).
 */

/**
 * The event of an expedition. It comes from its own random numbers, derived from the seed, so
 * it never shifts the rest of the game's randomness.
 */
export function pickDayEvent(
  balance: Balance,
  seed: number,
  forced?: DayEventId | 'none',
): DayEvent | undefined {
  const options = balance.events.options
  if (forced === 'none') return undefined
  if (forced) return options.find((e) => e.id === forced)
  if (!balance.events.enabled) return undefined
  const total = options.reduce((sum, e) => sum + Math.max(0, e.weight), 0)
  if (total <= 0) return undefined
  const [roll] = nextFloat(normalizeSeed(seed ^ 0x9e3779b9))
  let acc = 0
  return options.find((e) => (acc += Math.max(0, e.weight)) > roll * total) ?? options.at(-1)
}

/** The balance of an expedition with this event. */
export function withDayEvent(balance: Balance, event: DayEvent | undefined): Balance {
  let b = balance
  for (const effect of event?.effects ?? []) {
    switch (effect.kind) {
      case 'noiseThreshold':
        b = {
          ...b,
          noiseThreshold: b.noiseThreshold + effect.amount,
          danger: {
            ...b.danger,
            levels: b.danger.levels.map((l) => ({
              ...l,
              noiseThreshold: l.noiseThreshold + effect.amount,
            })),
          },
        }
        break
      case 'duskEarlier':
        b = { ...b, duskFromTurn: Math.max(2, b.duskFromTurn - effect.turns) }
        break
      case 'extraStartZombies':
        b = { ...b, extraStartZombies: b.extraStartZombies + effect.amount }
        break
      case 'extraPacks':
        b = { ...b, packsOnMap: b.packsOnMap + effect.amount }
        break
      case 'followSteps':
        b = {
          ...b,
          zombies: Object.fromEntries(
            Object.entries(b.zombies).map(([k, z]) => [
              k,
              { ...z, followSteps: Math.max(0, z.followSteps + effect.amount) },
            ]),
          ) as Balance['zombies'],
        }
        break
      case 'scout':
      case 'startCards':
        break
    }
  }
  return b
}

/** Cards the event puts in your start deck. */
export function eventStartCards(event: DayEvent | undefined): string[] {
  return (event?.effects ?? []).flatMap((e) => (e.kind === 'startCards' ? [...e.cards] : []))
}

/** Buildings the event lets you see from the start. */
export function eventScoutCount(event: DayEvent | undefined): number {
  return (event?.effects ?? []).reduce((n, e) => n + (e.kind === 'scout' ? e.count : 0), 0)
}
