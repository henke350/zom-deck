import type { Balance, Survivor, SurvivorId } from '../data/balance'
import type { CardId } from './types'

/**
 * Survivors (inspired by Maximum Apocalypse's characters): you pick who goes out. Each one
 * swaps a card or two in the start deck and has one ability. All numbers live in
 * `balance.survivors`; the Scavenger is the classic start with no changes.
 */

/** The survivor with this id, if the balance knows it. */
export function survivorOf(balance: Balance, id: SurvivorId | undefined): Survivor | undefined {
  return id === undefined ? undefined : balance.survivors.find((s) => s.id === id)
}

/** The balance of an expedition with this survivor (extra maximum health). */
export function withSurvivor(balance: Balance, survivor: Survivor | undefined): Balance {
  return survivor?.maxHp ? { ...balance, maxHp: balance.maxHp + survivor.maxHp } : balance
}

/** The start deck with the survivor's swaps. A swap whose card is missing is skipped. */
export function survivorDeck(deck: readonly CardId[], survivor: Survivor | undefined): CardId[] {
  const next = [...deck]
  for (const { from, to } of survivor?.swaps ?? []) {
    const at = next.indexOf(from)
    if (at >= 0) next[at] = to
  }
  return next
}

/** How much more a heal from a card heals. */
export function healBonus(balance: Balance, id: SurvivorId | undefined): number {
  return survivorOf(balance, id)?.healBonus ?? 0
}

/** How much longer gear lasts. */
export function gearBonus(balance: Balance, id: SurvivorId | undefined): number {
  return survivorOf(balance, id)?.gearBonus ?? 0
}
