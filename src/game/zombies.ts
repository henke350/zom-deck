import type { Balance, DangerLevel, ZombieKind, ZombieStats } from '../data/balance'
import { buildingKnown, cityContent } from './city'
import { gainCard } from './deck'
import { distance, neighbors } from './map'
import { nextFloat, nextInt } from './rng'
import type {
  Content,
  DangerReason,
  GameEvent,
  GameState,
  LocationDef,
  LocationId,
  NoiseReason,
  Zombie,
  ZombieMix,
} from './types'

export function zombiesAt(state: GameState, location: LocationId): Zombie[] {
  return state.zombies.filter((z) => z.location === location)
}

export function zombieStats(balance: Balance, kind: ZombieKind): ZombieStats {
  return balance.zombies[kind]
}

/** Picks a kind from a weighted mix (only Walkers when the mix is empty). */
export function rollKind(mix: ZombieMix | undefined, rng: number): [kind: ZombieKind, rng: number] {
  const options = (mix ?? []).filter((m) => m.weight > 0)
  if (options.length === 0) return ['walker', rng]
  const total = options.reduce((sum, m) => sum + m.weight, 0)
  const [r, next] = nextFloat(rng)
  let acc = 0
  const roll = r * total
  const picked = options.find((m) => (acc += m.weight) > roll) ?? options[options.length - 1]
  return [picked?.kind ?? 'walker', next]
}

/** A building's start-zombie range, including the balance file's extra zombies. */
export function startZombieRange(
  def: LocationDef,
  balance: Balance,
): { min: number; max: number } | undefined {
  if (!def.startZombies) return undefined
  const extra = balance.extraStartZombies
  return { min: def.startZombies.min + extra, max: def.startZombies.max + extra }
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
    const range = startZombieRange(loc, balance)
    if (!range) continue
    const { min, max } = range
    const [extra, next] = nextInt(state, max - min + 1)
    state = next
    for (let i = 0; i < min + extra; i++) {
      const [kind, afterKind] = rollKind(loc.startZombies?.kinds, state)
      state = afterKind
      zombies.push({
        uid: `z${zombies.length + 1}`,
        kind,
        location: loc.id,
        hp: zombieStats(balance, kind).hp,
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

export function zombieInfo(
  state: GameState,
  baseContent: Content,
  location: LocationId,
): ZombieInfo {
  const content = cityContent(state, baseContent)
  const def = content.locations[location]
  // A building the player cannot see yet: only the range any building might hold.
  if (!buildingKnown(state, content, location)) {
    const ranges = Object.values(content.locations).flatMap((l) => {
      const r = startZombieRange(l, state.balance)
      return r ? [r] : []
    })
    return {
      known: false,
      min: Math.min(...ranges.map((r) => r.min)),
      max: Math.max(...ranges.map((r) => r.max)),
    }
  }
  const hidden =
    state.balance.hiddenDanger &&
    def?.kind === 'building' &&
    def.startZombies !== undefined &&
    !state.visited.includes(location) &&
    !state.sites[location]?.scouted
  const range = def && startZombieRange(def, state.balance)
  if (hidden && range) return { known: false, min: range.min, max: range.max }
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

/** The current step of the danger meter. Without the meter, the balance's plain noise threshold. */
export function dangerLevel(state: GameState): DangerLevel {
  const { danger } = state.balance
  const fallback: DangerLevel = {
    noiseThreshold: state.balance.noiseThreshold,
    arrivals: 1,
    extraFinds: 0,
    rareFindWeight: state.balance.rareFindWeight,
  }
  if (!danger.enabled) return fallback
  return danger.levels[Math.min(state.danger, danger.levels.length) - 1] ?? fallback
}

/** The noise that brings zombies right now. */
export function noiseThreshold(state: GameState): number {
  return dangerLevel(state).noiseThreshold
}

function arrivalMix(
  state: GameState,
  content: Content,
  reason: NoiseReason,
): ZombieMix | undefined {
  if (reason === 'dusk') return content.arrivals?.dusk
  const byDanger = content.arrivals?.byDanger
  if (state.balance.danger.enabled && byDanger && byDanger.length > 0) {
    return byDanger[Math.min(state.danger, byDanger.length) - 1]
  }
  return content.arrivals?.noise
}

function spawnZombie(
  state: GameState,
  content: Content,
  reason: NoiseReason,
  events: GameEvent[],
  at?: LocationId,
): GameState {
  const location = at ?? arrivalLocation(state, content)
  const [kind, rng] = rollKind(arrivalMix(state, content, reason), state.rng)
  const zombie: Zombie = {
    uid: `z${state.nextZombieUid}`,
    kind,
    location,
    hp: zombieStats(state.balance, kind).hp,
    alerted: location === state.player.location,
    neutralized: false,
  }
  events.push({ type: 'zombieArrived', uid: zombie.uid, kind, location, reason })
  return {
    ...state,
    rng,
    zombies: [...state.zombies, zombie],
    nextZombieUid: state.nextZombieUid + 1,
  }
}

/** Adds noise. Each time the meter reaches the threshold, a zombie arrives and the meter drops by the threshold. */
export function addNoise(
  state: GameState,
  amount: number,
  content: Content,
  reason: NoiseReason,
  events: GameEvent[],
): GameState {
  if (amount <= 0) return state
  events.push({ type: 'noiseAdded', amount, total: state.noise + amount, reason })
  return settleNoise({ ...state, noise: state.noise + amount }, content, reason, events)
}

/** While the meter is at or over the threshold, zombies arrive and the meter drops by the threshold. */
function settleNoise(
  state: GameState,
  content: Content,
  reason: NoiseReason,
  events: GameEvent[],
): GameState {
  const { noiseThreshold: threshold, arrivals } = dangerLevel(state)
  let noise = state.noise
  let next: GameState = state
  while (noise >= threshold) {
    noise -= threshold
    for (let i = 0; i < arrivals; i++) next = spawnZombie(next, content, reason, events)
  }
  return { ...next, noise }
}

/** The street where hordes gather: the first street on the map. */
function hordeLocation(state: GameState, content: Content): LocationId {
  const street = Object.values(content.locations).find((l) => l.kind === 'street')
  return street?.id ?? arrivalLocation(state, content)
}

/**
 * Raises the danger meter after a pack or a rare find. Each level brings a horde to the
 * street, and a lower noise threshold at the new level can bring zombies at once.
 */
export function raiseDanger(
  state: GameState,
  content: Content,
  reason: DangerReason,
  events: GameEvent[],
): GameState {
  const { danger } = state.balance
  const steps = reason === 'pack' ? danger.perPack : danger.perRareFind
  if (!danger.enabled || steps <= 0) return state
  const level = Math.min(state.danger + steps, danger.levels.length)
  if (level <= state.danger) return state
  events.push({ type: 'dangerRose', level, reason })
  let next: GameState = { ...state, danger: level }
  const at = hordeLocation(next, content)
  for (let i = 0; i < danger.hordeSize * (level - state.danger); i++) {
    next = spawnZombie(next, content, 'horde', events, at)
  }
  return settleNoise(next, content, 'noise', events)
}

export interface NoisePreview {
  readonly before: number
  readonly after: number
  readonly arrivals: number
}

/** What adding `amount` noise would do, without changing anything. */
export function noisePreview(state: GameState, amount: number): NoisePreview {
  const { noiseThreshold: threshold, arrivals } = dangerLevel(state)
  const total = state.noise + Math.max(0, amount)
  return {
    before: state.noise,
    after: total % threshold,
    arrivals: Math.floor(total / threshold) * arrivals,
  }
}

/**
 * The zombie phase at the end of a turn: zombies that have seen you follow (as far as their
 * kind goes) or lose track, then every zombie at your location attacks for its kind's damage.
 * Block prevents damage. Last, every Screamer that has seen you shrieks and makes noise. The
 * caller checks for death afterwards.
 */
export function zombiePhase(state: GameState, content: Content, events: GameEvent[]): GameState {
  return screams(attacks(state, content, events), content, events)
}

function screams(state: GameState, content: Content, events: GameEvent[]): GameState {
  let next = state
  for (const z of state.zombies) {
    const noise = zombieStats(state.balance, z.kind).screamNoise
    if (noise <= 0 || !z.alerted || z.neutralized) continue
    events.push({ type: 'zombieScreamed', uid: z.uid, noise })
    next = addNoise(next, noise, content, 'scream', events)
  }
  return next
}

function attacks(state: GameState, content: Content, events: GameEvent[]): GameState {
  const here = state.player.location
  const mode = state.balance.zombieFollow
  const atShelter = content.locations[here]?.kind === 'shelter'
  const followed = new Set<string>()

  let next = state
  if (mode !== 'off') {
    next = updateZombies(next, (z) => {
      if (!z.alerted || z.location === here) return z
      const reach = zombieStats(state.balance, z.kind).followSteps
      if (!atShelter && distance(content, z.location, here) <= reach) {
        events.push({ type: 'zombieFollowed', uid: z.uid, from: z.location, to: here })
        followed.add(z.uid)
        return { ...z, location: here }
      }
      events.push({ type: 'zombieLostTrack', uid: z.uid })
      return { ...z, alerted: false }
    })
  }

  if (atShelter) return next
  const damageOf = (z: Zombie) => zombieStats(state.balance, z.kind).damage
  const attackers = next.zombies.filter(
    (z) =>
      z.location === here &&
      !z.neutralized &&
      damageOf(z) > 0 &&
      !(mode === 'gentle' && followed.has(z.uid)),
  )
  if (attackers.length === 0) return next

  for (const z of attackers) {
    events.push({
      type: 'zombieAttacked',
      uid: z.uid,
      damage: damageOf(z),
      followed: followed.has(z.uid),
    })
  }
  const total = attackers.reduce((sum, z) => sum + damageOf(z), 0)
  const blocked = Math.min(next.player.block, total)
  if (blocked > 0) events.push({ type: 'damageBlocked', amount: blocked })
  const lost = total - blocked
  if (lost > 0) events.push({ type: 'hpLost', amount: lost, source: 'zombies' })
  const hurt: GameState = { ...next, player: { ...next.player, hp: next.player.hp - lost } }
  const { wounds } = state.balance
  if (wounds.enabled && lost >= wounds.damageInOnePhase && hurt.player.hp > 0) {
    return gainCard(hurt, content.woundCard, 'wound', events)
  }
  return hurt
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
  /** Wound variant: the attack would add a Wound to your deck. */
  readonly wound: boolean
  /** Noise from Screamers that have seen you, and how many zombies it brings. */
  readonly screamNoise: number
  readonly screamArrivals: number
}

/** What ending the turn now would do. Uses the same rules as the real zombie phase. */
export function previewEndTurn(state: GameState, baseContent: Content): EndTurnPreview {
  const content = cityContent(state, baseContent)
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
    wound: events.some((e) => e.type === 'cardGained' && e.reason === 'wound'),
    screamNoise: events.reduce((sum, e) => (e.type === 'zombieScreamed' ? sum + e.noise : sum), 0),
    screamArrivals: events.filter((e) => e.type === 'zombieArrived' && e.reason === 'scream')
      .length,
  }
}
