import { buildingKnown } from './city'
import { neighbors } from './map'
import { addNoise, damageZombies } from './zombies'
import type { Content, GameEvent, GameState, LocationId } from './types'

/**
 * The Stray Dog: a companion you can find in a search. It walks with you (it is not a card),
 * attacks once per turn when you say so (Sic), takes some of the damage meant for you, and
 * smells supplies in the buildings next to you. At 0 health it dies and is gone.
 */

/** A dog joins you (taken as a find, or brought along on a campaign day). */
export function adoptDog(state: GameState, hp: number, events: GameEvent[]): GameState {
  events.push({ type: 'dogFound', hp })
  return { ...state, dog: { hp, bitten: false } }
}

/** Sic: the dog attacks a zombie where you stand, and barks. */
export function dogBite(
  state: GameState,
  zombie: string,
  content: Content,
  events: GameEvent[],
): GameState {
  const { dog } = state
  if (!dog) throw new Error('dogBite: there is no dog')
  const { biteDamage, biteNoise } = state.balance.dog
  events.push({ type: 'dogBit', zombie, damage: biteDamage })
  const bitten: GameState = { ...state, dog: { ...dog, bitten: true } }
  const hurt = damageZombies(bitten, [zombie], biteDamage, events)
  return addNoise(hurt, biteNoise, content, 'noise', events)
}

/**
 * In the zombie phase, after Block and gear: the dog throws itself in the way and takes some of
 * the damage. Returns the damage left over for you.
 */
export function dogGuard(
  state: GameState,
  damage: number,
  events: GameEvent[],
): [state: GameState, damage: number] {
  const { dog } = state
  if (!dog || damage <= 0) return [state, damage]
  const take = Math.min(state.balance.dog.guardPerPhase, dog.hp, damage)
  if (take <= 0) return [state, damage]
  const hpLeft = dog.hp - take
  events.push({ type: 'dogGuarded', amount: take, hpLeft })
  if (hpLeft > 0) return [{ ...state, dog: { ...dog, hp: hpLeft } }, damage - take]
  events.push({ type: 'dogDied' })
  const { dog: _gone, ...without } = state
  return [without, damage - take]
}

/** A new turn: the dog may attack again. */
export function restDog(state: GameState): GameState {
  return state.dog?.bitten ? { ...state, dog: { ...state.dog, bitten: false } } : state
}

/**
 * The buildings next to you where the dog smells a hidden supply pack. You see this on the
 * map, so the bots may use it too.
 */
export function dogSmells(state: GameState, content: Content): LocationId[] {
  if (!state.dog) return []
  const here = state.player.location
  return [here, ...neighbors(content, here)].filter(
    (id) =>
      content.locations[id]?.kind === 'building' &&
      state.sites[id]?.hasPack === true &&
      buildingKnown(state, content, id),
  )
}
