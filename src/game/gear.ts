import type { CardInstance, Content, GameEvent, GameState, GearDef, GearLasts } from './types'
import { gearBonus } from './survivors'
import { neighbors } from './map'
import { addNoise, damageZombies, revealZombies } from './zombies'

/**
 * Gear: cards that stay in front of you after you play them (Kevlar Vest, Running Shoes,
 * Flashlight). Each piece keeps a counter in `state.gearLeft` and goes to the discard pile
 * when it wears out (`GearLasts`), so it can be drawn and put on again later.
 */

/** The counter a piece of gear starts with. */
export function freshGear(def: GearDef, bonus = 0): number {
  switch (def.lasts.kind) {
    case 'absorbs':
      return def.lasts.total + bonus
    case 'turns':
      return def.lasts.turns + bonus
    case 'untilHit':
      return 1
    case 'uses':
      return def.lasts.uses + bonus
    case 'health':
      return def.lasts.hp
  }
}

function gearIn(state: GameState, content: Content): { card: CardInstance; def: GearDef }[] {
  return state.piles.gear.flatMap((card) => {
    const def = content.cards[card.card]?.gear
    return def ? [{ card, def }] : []
  })
}

/** Puts a played gear card in front of you; a Scout looks around at once. */
export function equip(
  state: GameState,
  uid: string,
  content: Content,
  events: GameEvent[],
): GameState {
  return scoutAround(putOn(state, uid, content, events), content, events)
}

/** Puts a played gear card in front of you (it was moved to the cards in play first). */
function putOn(state: GameState, uid: string, content: Content, events: GameEvent[]): GameState {
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
    gearLeft: {
      ...state.gearLeft,
      // The Mechanic makes things last longer, not people.
      [uid]: freshGear(def, def.ally ? 0 : gearBonus(state.balance, state.survivor)),
    },
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
  // Bolts run out; an ally (the Soldier) keeps shooting.
  const counts = def.lasts.kind === 'uses'
  const left = (state.gearLeft[uid] ?? 1) - (counts ? 1 : 0)
  let next: GameState = {
    ...state,
    player: { ...state.player, ap: state.player.ap - def.effect.cost },
    gearLeft: { ...state.gearLeft, [uid]: left },
  }
  next = damageZombies(next, [zombie], def.effect.damage, events)
  if (counts && left <= 0) next = loseGear(next, card, 'uses', events)
  if (def.effect.noise) next = addNoise(next, def.effect.noise, content, 'noise', events)
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
    // The Kevlar Vest absorbs; allies throw themselves in the way (guard).
    const perPhase = (def.effect.kind === 'absorb' ? def.effect.perPhase : 0) + (def.guard ?? 0)
    if (perPhase <= 0) continue
    const counter = next.gearLeft[card.uid] ?? 0
    const take = Math.min(perPhase, counter, left)
    if (take <= 0) continue
    events.push({ type: 'gearAbsorbed', uid: card.uid, amount: take })
    left -= take
    next = { ...next, gearLeft: { ...next.gearLeft, [card.uid]: counter - take } }
    const { kind } = def.lasts
    if ((kind === 'absorbs' || kind === 'health') && counter - take <= 0) {
      next = loseGear(next, card, kind, events)
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

/** End of your turn: the Nurse heals you (and cures poison). */
export function alliesEndOfTurn(
  state: GameState,
  content: Content,
  events: GameEvent[],
): GameState {
  let next = state
  for (const { card, def } of gearIn(state, content)) {
    if (def.effect.kind !== 'healEachTurn') continue
    const { player } = next
    const hp = Math.min(next.balance.maxHp, player.hp + def.effect.amount)
    if (hp === player.hp && player.poison === 0) continue
    events.push({ type: 'allyHealed', uid: card.uid, card: card.card, amount: hp - player.hp })
    events.push({ type: 'healed', amount: hp - player.hp })
    next = { ...next, player: { ...player, hp, poison: 0 } }
  }
  return next
}

/** The Scout: the buildings next to you (and here) are scouted, so you see what is inside. */
export function scoutAround(state: GameState, content: Content, events: GameEvent[]): GameState {
  if (!gearIn(state, content).some(({ def }) => def.effect.kind === 'scoutAround')) return state
  const here = state.player.location
  const locations = [here, ...neighbors(content, here)].filter(
    (id) => state.sites[id] && !state.sites[id].scouted,
  )
  if (locations.length === 0) return state
  const sites = { ...state.sites }
  for (const id of locations) {
    const site = sites[id]
    if (site) sites[id] = { ...site, scouted: true }
  }
  events.push({ type: 'scouted', locations })
  return locations.reduce((s, id) => revealZombies(s, content, id), { ...state, sites })
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
