import type { Balance } from '../data/balance'
import { distance, neighbors } from './map'
import { nextInt } from './rng'
import type { Content, GameEvent, GameState, LocationId, Zombie } from './types'

export function zombiesAt(state: GameState, location: LocationId): Zombie[] {
  return state.zombies.filter((z) => z.location === location)
}

/** Rolls the starting zombies of every building between its min and max. */
export function setupZombies(
  content: Content,
  balance: Balance,
  rng: number,
): [zombies: Zombie[], nextZombieUid: number, rng: number] {
  const zombies: Zombie[] = []
  let state = rng
  for (const loc of Object.values(content.locations)) {
    if (!loc.startZombies) continue
    const { min, max } = loc.startZombies
    const [extra, next] = nextInt(state, max - min + 1)
    state = next
    for (let i = 0; i < min + extra; i++) {
      zombies.push({
        uid: `z${zombies.length + 1}`,
        location: loc.id,
        hp: balance.zombie.hp,
        alerted: false,
        neutralized: false,
      })
    }
  }
  return [zombies, zombies.length + 1, state]
}

/** What the player knows about zombies somewhere: the exact number, or only the range. */
export type ZombieInfo =
  | { readonly known: true; readonly count: number }
  | { readonly known: false; readonly min: number; readonly max: number }

export function zombieInfo(state: GameState, content: Content, location: LocationId): ZombieInfo {
  const def = content.locations[location]
  const hidden =
    state.balance.hiddenDanger &&
    def?.kind === 'building' &&
    def.startZombies !== undefined &&
    !state.visited.includes(location) &&
    !state.sites[location]?.scouted
  if (hidden && def.startZombies) {
    return { known: false, min: def.startZombies.min, max: def.startZombies.max }
  }
  return { known: true, count: zombiesAt(state, location).length }
}

function updateZombies(state: GameState, change: (z: Zombie) => Zombie): GameState {
  return { ...state, zombies: state.zombies.map(change) }
}

/** Zombies where the player stands notice them, unless they were neutralized this turn. */
export function noticeHere(state: GameState): GameState {
  const here = state.player.location
  return updateZombies(state, (z) =>
    z.location === here && !z.neutralized && !z.alerted ? { ...z, alerted: true } : z,
  )
}

/** Sneak, Alarm Clock, Soft Soles: no attack this turn, and they lose track of you. */
export function neutralizeZombies(
  state: GameState,
  uids: readonly string[],
  events: GameEvent[],
): GameState {
  const targets = new Set(uids)
  for (const uid of uids) events.push({ type: 'zombieNeutralized', uid })
  return updateZombies(state, (z) =>
    targets.has(z.uid) ? { ...z, neutralized: true, alerted: false } : z,
  )
}

/** Deals damage to each zombie; zombies at 0 health are removed. Extra damage is lost. */
export function damageZombies(
  state: GameState,
  uids: readonly string[],
  amount: number,
  events: GameEvent[],
): GameState {
  const targets = new Set(uids)
  const zombies: Zombie[] = []
  for (const z of state.zombies) {
    if (!targets.has(z.uid)) {
      zombies.push(z)
      continue
    }
    const hp = Math.max(0, z.hp - amount)
    events.push({ type: 'zombieHit', uid: z.uid, damage: amount, hpLeft: hp })
    if (hp === 0) events.push({ type: 'zombieKilled', uid: z.uid })
    else zombies.push({ ...z, hp })
  }
  return { ...state, zombies }
}

/** Where a new zombie appears: at the player, but never inside the Shelter (then on a neighbouring street). */
function arrivalLocation(state: GameState, content: Content): LocationId {
  const here = state.player.location
  if (content.locations[here]?.kind !== 'shelter') return here
  const options = neighbors(content, here)
  return options.find((id) => content.locations[id]?.kind === 'street') ?? options[0] ?? here
}

function spawnZombie(
  state: GameState,
  content: Content,
  reason: 'noise' | 'dusk',
  events: GameEvent[],
): GameState {
  const location = arrivalLocation(state, content)
  const zombie: Zombie = {
    uid: `z${state.nextZombieUid}`,
    location,
    hp: state.balance.zombie.hp,
    alerted: location === state.player.location,
    neutralized: false,
  }
  events.push({ type: 'zombieArrived', uid: zombie.uid, location, reason })
  return { ...state, zombies: [...state.zombies, zombie], nextZombieUid: state.nextZombieUid + 1 }
}

/** Adds noise. Each time the meter reaches the threshold, a zombie arrives and the meter drops by the threshold. */
export function addNoise(
  state: GameState,
  amount: number,
  content: Content,
  reason: 'noise' | 'dusk',
  events: GameEvent[],
): GameState {
  if (amount <= 0) return state
  const threshold = state.balance.noiseThreshold
  let noise = state.noise + amount
  events.push({ type: 'noiseAdded', amount, total: noise })
  let next: GameState = state
  while (noise >= threshold) {
    noise -= threshold
    next = spawnZombie(next, content, reason, events)
  }
  return { ...next, noise }
}

export interface NoisePreview {
  readonly before: number
  readonly after: number
  readonly arrivals: number
}

/** What adding `amount` noise would do, without changing anything. */
export function noisePreview(state: GameState, amount: number): NoisePreview {
  const threshold = state.balance.noiseThreshold
  const total = state.noise + Math.max(0, amount)
  return {
    before: state.noise,
    after: total % threshold,
    arrivals: Math.floor(total / threshold),
  }
}

/**
 * The zombie phase at the end of a turn: zombies that have seen you follow one
 * step (or lose track), then every zombie at your location attacks. Block
 * prevents damage. The caller checks for death afterwards.
 */
export function zombiePhase(state: GameState, content: Content, events: GameEvent[]): GameState {
  const here = state.player.location
  const mode = state.balance.zombieFollow
  const atShelter = content.locations[here]?.kind === 'shelter'
  const followed = new Set<string>()

  let next = state
  if (mode !== 'off') {
    next = updateZombies(next, (z) => {
      if (!z.alerted || z.location === here) return z
      if (!atShelter && distance(content, z.location, here) === 1) {
        events.push({ type: 'zombieFollowed', uid: z.uid, from: z.location, to: here })
        followed.add(z.uid)
        return { ...z, location: here }
      }
      events.push({ type: 'zombieLostTrack', uid: z.uid })
      return { ...z, alerted: false }
    })
  }

  if (atShelter) return next
  const attackers = next.zombies.filter(
    (z) => z.location === here && !z.neutralized && !(mode === 'gentle' && followed.has(z.uid)),
  )
  if (attackers.length === 0) return next

  const damage = state.balance.zombie.damage
  for (const z of attackers) events.push({ type: 'zombieAttacked', uid: z.uid, damage })
  const total = attackers.length * damage
  const blocked = Math.min(next.player.block, total)
  if (blocked > 0) events.push({ type: 'damageBlocked', amount: blocked })
  const lost = total - blocked
  if (lost > 0) events.push({ type: 'hpLost', amount: lost })
  return { ...next, player: { ...next.player, hp: next.player.hp - lost } }
}

export interface EndTurnPreview {
  readonly followers: number
  readonly attackers: number
  /** Health you will lose after Block. */
  readonly damage: number
  readonly blocked: number
  readonly lethal: boolean
  /** Noise added at dusk after the attacks, and how many zombies it brings. */
  readonly duskNoise: number
  readonly duskArrivals: number
}

/** What ending the turn now would do. Uses the same rules as the real zombie phase. */
export function previewEndTurn(state: GameState, content: Content): EndTurnPreview {
  const events: GameEvent[] = []
  const after = zombiePhase(state, content, events)
  const count = (type: GameEvent['type']) => events.filter((e) => e.type === type).length
  const blocked = events.reduce((sum, e) => (e.type === 'damageBlocked' ? sum + e.amount : sum), 0)
  const damage = state.player.hp - after.player.hp
  const duskNoise = state.turn >= state.balance.duskFromTurn ? state.balance.duskNoise : 0
  return {
    followers: count('zombieFollowed'),
    attackers: count('zombieAttacked'),
    damage,
    blocked,
    lethal: after.player.hp <= 0,
    duskNoise,
    duskArrivals: noisePreview(after, duskNoise).arrivals,
  }
}
