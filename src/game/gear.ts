import type { CardInstance, Content, GameEvent, GameState, GearDef, GearLasts } from './types'
import { damageZombies } from './zombies'

/**
 * Gear: cards that stay in front of you after you play them (Kevlar Vest, Running Shoes,
 * Flashlight). Each piece keeps a counter in `state.gearLeft` and goes to the discard pile
 * when it wears out (`GearLasts`), so it can be drawn and put on again later.
 */

/** The counter a piece of gear starts with. */
export function freshGear(def: GearDef): number {
  switch (def.lasts.kind) {
    case 'absorbs':
      return def.lasts.total
    case 'turns':
      return def.lasts.turns
    case 'untilHit':
      return 1
    case 'uses':
      return def.lasts.uses
  }
}

function gearIn(state: GameState, content: Content): { card: CardInstance; def: GearDef }[] {
  return state.piles.gear.flatMap((card) => {
    const def = content.cards[card.card]?.gear
    return def ? [{ card, def }] : []
  })
}

/** Puts a played gear card in front of you (it was moved to the cards in play first). */
export function equip(
  state: GameState,
  uid: string,
  content: Content,
  events: GameEvent[],
): GameState {
  const card = state.piles.inPlay.find((c) => c.uid === uid)
  const def = card && content.cards[card.card]?.gear
  if (!card || !def) throw new Error('equip: played gear card is missing')
  events.push({ type: 'gearEquipped', uid, card: card.card })
  return {
    ...state,
    piles: {
      ...state.piles,
      inPlay: state.piles.inPlay.filter((c) => c.uid !== uid),
      gear: [...state.piles.gear, card],
    },
    gearLeft: { ...state.gearLeft, [uid]: freshGear(def) },
  }
}

function loseGear(
  state: GameState,
  card: CardInstance,
  reason: GearLasts['kind'],
  events: GameEvent[],
): GameState {
  events.push({ type: 'gearLost', uid: card.uid, card: card.card, reason })
  const gearLeft = { ...state.gearLeft }
  delete gearLeft[card.uid]
  return {
    ...state,
    piles: {
      ...state.piles,
      gear: state.piles.gear.filter((c) => c.uid !== card.uid),
      discard: [...state.piles.discard, card],
    },
    gearLeft,
  }
}

/**
 * Uses a piece of gear (the Crossbow): pays its AP, deals its damage to the chosen zombie and
 * counts down its uses. It goes to the discard pile when the last use is spent.
 */
export function fireGear(
  state: GameState,
  uid: string,
  zombie: string,
  content: Content,
  events: GameEvent[],
): GameState {
  const card = state.piles.gear.find((c) => c.uid === uid)
  const def = card && content.cards[card.card]?.gear
  if (!card || !def || def.effect.kind !== 'shoot')
    throw new Error('fireGear: validated gear is missing')
  events.push({ type: 'gearUsed', uid, card: card.card })
  const left = (state.gearLeft[uid] ?? 1) - 1
  let next: GameState = {
    ...state,
    player: { ...state.player, ap: state.player.ap - def.effect.cost },
    gearLeft: { ...state.gearLeft, [uid]: left },
  }
  next = damageZombies(next, [zombie], def.effect.damage, events)
  if (def.lasts.kind === 'uses' && left <= 0) next = loseGear(next, card, 'uses', events)
  return next
}

/** Extra finds in every search from the gear in front of you. */
export function gearSearchBonus(state: GameState, content: Content): number {
  return gearIn(state, content).reduce(
    (sum, { def }) => sum + (def.effect.kind === 'searchBonus' ? def.effect.amount : 0),
    0,
  )
}

/** How many steps your free move may go. */
export function freeMoveSteps(state: GameState, content: Content): number {
  return gearIn(state, content).reduce(
    (most, { def }) =>
      def.effect.kind === 'freeMoveSteps' ? Math.max(most, def.effect.steps) : most,
    1,
  )
}

/**
 * Gear that takes damage in the zombie phase (after Block). Returns the damage left over
 * for the player. Worn-out pieces go to the discard pile.
 */
export function absorbDamage(
  state: GameState,
  damage: number,
  content: Content,
  events: GameEvent[],
): [state: GameState, damage: number] {
  let next = state
  let left = damage
  for (const { card, def } of gearIn(state, content)) {
    if (left <= 0) break
    if (def.effect.kind !== 'absorb') continue
    const counter = next.gearLeft[card.uid] ?? 0
    const take = Math.min(def.effect.perPhase, counter, left)
    if (take <= 0) continue
    events.push({ type: 'gearAbsorbed', uid: card.uid, amount: take })
    left -= take
    next = { ...next, gearLeft: { ...next.gearLeft, [card.uid]: counter - take } }
    if (def.lasts.kind === 'absorbs' && counter - take <= 0) {
      next = loseGear(next, card, 'absorbs', events)
    }
  }
  return [next, left]
}

/** A zombie hurt you: gear that only lasts until you are hit goes to the discard pile. */
export function gearAfterHit(state: GameState, content: Content, events: GameEvent[]): GameState {
  let next = state
  for (const { card, def } of gearIn(state, content)) {
    if (def.lasts.kind === 'untilHit') next = loseGear(next, card, 'untilHit', events)
  }
  return next
}

/** End of your turn: gear that lasts some turns counts down, and wears out at 0. */
export function tickGear(state: GameState, content: Content, events: GameEvent[]): GameState {
  let next = state
  for (const { card, def } of gearIn(state, content)) {
    if (def.lasts.kind !== 'turns') continue
    const counter = (next.gearLeft[card.uid] ?? 1) - 1
    next = { ...next, gearLeft: { ...next.gearLeft, [card.uid]: counter } }
    if (counter <= 0) next = loseGear(next, card, 'turns', events)
  }
  return next
}
