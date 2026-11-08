import type { Content, GameEvent, GameState, LocationId } from './types'
import { alliesEndOfTurn } from './gear'

/**
 * Special places: some buildings do something by themselves (inspired by the map tiles of
 * Maximum Apocalypse). The kind of place is data (`feature` on a location), the numbers are in
 * `balance.places`.
 */

/** The first time you go into a place this expedition. */
export function firstVisit(
  state: GameState,
  content: Content,
  location: LocationId,
  events: GameEvent[],
): GameState {
  const feature = content.locations[location]?.feature
  const p = state.balance.places
  const { player } = state
  switch (feature) {
    case 'armory': {
      const ammo = Math.min(state.balance.ammo.max, player.ammo + p.armoryAmmo)
      events.push({ type: 'placeEffect', location, feature, amount: ammo - player.ammo })
      return { ...state, player: { ...player, ammo } }
    }
    case 'fuel':
      events.push({ type: 'placeEffect', location, feature, amount: p.fuelSearchBonus })
      return {
        ...state,
        player: { ...player, searchBonus: player.searchBonus + p.fuelSearchBonus },
      }
    case 'trap':
      events.push({ type: 'placeEffect', location, feature, amount: p.trapDamage })
      events.push({ type: 'hpLost', amount: p.trapDamage, source: 'place' })
      return { ...state, player: { ...player, hp: player.hp - p.trapDamage } }
    default:
      return state
  }
}

/** You end your turn here (after the zombies, if you are still standing). */
export function endTurnAt(state: GameState, content: Content, events: GameEvent[]): GameState {
  return alliesEndOfTurn(placeEndOfTurn(state, content, events), content, events)
}

function placeEndOfTurn(state: GameState, content: Content, events: GameEvent[]): GameState {
  const location = state.player.location
  const feature = content.locations[location]?.feature
  const p = state.balance.places
  const { player } = state
  switch (feature) {
    case 'infirmary': {
      const hp = Math.min(state.balance.maxHp, player.hp + p.infirmaryHeal)
      if (hp === player.hp && player.poison === 0) return state
      events.push({ type: 'placeEffect', location, feature, amount: hp - player.hp })
      events.push({ type: 'healed', amount: hp - player.hp })
      return { ...state, player: { ...player, hp, poison: 0 } }
    }
    case 'sanctuary': {
      const noise = Math.max(0, state.noise - p.sanctuaryQuiet)
      if (noise === state.noise) return state
      events.push({ type: 'placeEffect', location, feature, amount: state.noise - noise })
      return { ...state, noise }
    }
    default:
      return state
  }
}
