import {
  applyAction,
  distancesFrom,
  freeMoveCost,
  listActions,
  neighbors,
  ownedCount,
  previewEndTurn,
  zombiesAt,
} from '../game'
import type {
  Action,
  CardDef,
  Content,
  Effect,
  GameState,
  LocationId,
  PlayCardAction,
} from '../game'
import type { Bot } from './bot'
import { expectedZombies, packChance } from './view'

/** Which finds a bot likes. Matches the four play styles in docs/plan.md, plus a mix. */
export type Style = 'balanced' | 'quiet' | 'fighter' | 'runner' | 'light'

export interface PlannerOptions {
  readonly id: string
  /** Go home as soon as you carry this many packs. */
  readonly targetPacks: number
  /** Take finds into the deck. Without this the bot only searches for packs. */
  readonly takeFinds: boolean
  /** Attack zombies where you search. */
  readonly fight: boolean
  /** Avoid every attack you can, not only deadly ones. */
  readonly careful: boolean
  /** Turns kept in hand for the walk home. */
  readonly homeMargin: number
  /** How much an expected zombie puts the bot off a building (a sure pack is worth 10). */
  readonly dangerWeight: number
  /** With enough packs to win, go home at or below this health. */
  readonly retreatHp: number
  readonly style: Style
}

/** How much a bot of each style wants a find (0–10). Unknown cards are worth 3. */
const baseValue: Readonly<Record<string, number>> = {
  softSoles: 4,
  lockpick: 5,
  flashlight: 4,
  alarmClock: 5,
  baseballBat: 6,
  axe: 6,
  pistol: 5,
  molotov: 3,
  kevlarVest: 5,
  runningShoes: 7,
  adrenaline: 4,
  travelLight: 5,
  toolbox: 5,
  districtMap: 3,
  bandage: 5,
  painkillers: 4,
}

const styleBonus: Readonly<Record<Style, (id: string, def: CardDef) => number>> = {
  balanced: () => 0,
  quiet: (_id, def) => (def.tags.includes('quiet') ? 3 : 0),
  fighter: (id, def) => (def.tags.includes('weapon') || id === 'kevlarVest' ? 3 : 0),
  runner: (_id, def) => (def.tags.includes('move') ? 3 : 0),
  light: (id) => (['toolbox', 'travelLight', 'painkillers'].includes(id) ? 4 : 0),
}

/** A find must be worth at least this to be taken; below `scrapBelow` the bot scraps junk instead. */
const takeAtLeast = 3

interface Plan {
  /** Where the bot is heading. */
  readonly goal: LocationId
  /** Search where it stands now. */
  readonly searchHere: boolean
}

interface Ctx {
  readonly o: PlannerOptions
  readonly state: GameState
  readonly content: Content
  readonly actions: readonly Action[]
  readonly plan: Plan
  readonly home: LocationId
}

/**
 * A rule-based player: decides where to go from what is visible on screen, then plays its
 * hand in a fixed order of priorities. The options turn it into the greedy, rush-home and
 * style bots in bots.ts.
 */
export function plannerBot(o: PlannerOptions): Bot {
  return {
    id: o.id,
    next(state, content) {
      if (state.phase === 'chooseFind') return chooseFind(o, state, content)
      const home = shelterOf(content)
      const plan = makePlan(o, state, content, home)
      const ctx: Ctx = { o, state, content, actions: listActions(state, content), plan, home }
      return (
        tempo(ctx) ??
        fight(ctx) ??
        search(ctx) ??
        move(ctx) ??
        defend(ctx) ??
        thin(ctx) ??
        heal(ctx) ??
        scout(ctx) ??
        adrenaline(ctx) ??
        endTurn(ctx)
      )
    },
  }
}

// ---------------------------------------------------------------- planning

function makePlan(o: PlannerOptions, state: GameState, content: Content, home: LocationId): Plan {
  const here = state.player.location
  const b = state.balance
  const dist = distancesFrom(content, here)
  const homeDist = dist[home] ?? Number.POSITIVE_INFINITY
  const packs = state.player.packs
  const enough = packs >= b.packsToWin
  const turnsAfter = b.turnLimit - state.turn
  const reach = turnsAfter + stepsAvailable(state, content)
  const mustLeave = homeDist + o.homeMargin >= reach

  if (enough && (packs >= o.targetPacks || mustLeave || state.player.hp <= o.retreatHp)) {
    return { goal: home, searchHere: false }
  }
  if (canSearchAt(state, here) && worthSearching(o, state, content, here)) {
    return { goal: here, searchHere: true }
  }

  let best: LocationId | undefined
  let bestScore = Number.NEGATIVE_INFINITY
  for (const id of Object.keys(state.sites)) {
    if (id === here || !canSearchAt(state, id)) continue
    const value = buildingValue(o, state, content, id)
    if (value <= 0) continue
    const there = dist[id] ?? Number.POSITIVE_INFINITY
    const back = distancesFrom(content, id)[home] ?? Number.POSITIVE_INFINITY
    // With a win in hand, only go if there is time to get there, search and walk back.
    if (enough && there + back + o.homeMargin > reach - 1) continue
    const score =
      value - expectedZombies(state, content, id) * o.dangerWeight - there * 1.5 - back * 0.5
    if (score > bestScore) {
      bestScore = score
      best = id
    }
  }
  return { goal: best ?? home, searchHere: false }
}

function canSearchAt(state: GameState, id: LocationId): boolean {
  const site = state.sites[id]
  return site !== undefined && site.searchesLeft > 0 && !site.burned
}

function worthSearching(o: PlannerOptions, state: GameState, content: Content, id: LocationId) {
  if (packChance(state, content, id) > 0) return true
  if (!o.takeFinds || state.turn > state.balance.turnLimit - 3) return false
  return lootValue(o, state, content, id) >= 5.5
}

function buildingValue(o: PlannerOptions, state: GameState, content: Content, id: LocationId) {
  const finds = o.takeFinds ? lootValue(o, state, content, id) * 0.3 : 0
  return packChance(state, content, id) * 10 + finds
}

/** Average value of a building's finds for this bot. */
function lootValue(o: PlannerOptions, state: GameState, content: Content, id: LocationId) {
  const pool = content.locations[id]?.lootPool ?? []
  const total = pool.reduce((sum, entry) => sum + entry.weight, 0)
  if (total === 0) return 0
  return pool.reduce((sum, e) => sum + e.weight * findValue(o, state, content, e.card), 0) / total
}

function findValue(o: PlannerOptions, state: GameState, content: Content, card: string): number {
  const def = content.cards[card]
  if (!def) return 0
  // Travel Light needs a small deck, and taking it makes the deck one card bigger.
  if (def.requires?.kind === 'ownedAtMost' && ownedCount(state.piles) + 1 > def.requires.count) {
    return 0
  }
  return (baseValue[card] ?? 3) + styleBonus[o.style](card, def)
}

/** Steps the bot can still take this turn: the free move plus move cards it can pay for. */
function stepsAvailable(state: GameState, content: Content): number {
  let ap = state.player.ap
  let steps = 0
  const cost = freeMoveCost(state, content)
  if (!state.player.freeMoveUsed && ap >= cost) {
    steps += 1
    ap -= cost
  }
  const moves = state.piles.hand
    .map((c) => content.cards[c.card])
    .filter((def): def is CardDef => def !== undefined && moveStepsOfDef(def) > 0)
    .sort((a, b) => moveStepsOfDef(b) - moveStepsOfDef(a))
  for (const def of moves) {
    if (ap < def.cost) continue
    ap -= def.cost
    steps += moveStepsOfDef(def)
  }
  return steps
}

// ---------------------------------------------------------------- the find choice

function chooseFind(o: PlannerOptions, state: GameState, content: Content): Action {
  const options = state.pendingFind?.options ?? []
  const junk = state.piles.hand.find((c) => isJunk(content.cards[c.card]))
  const late = state.turn >= state.balance.turnLimit - 1
  if (!o.takeFinds || late) return { type: 'declineFind' }

  let best: string | undefined
  let bestValue = Number.NEGATIVE_INFINITY
  for (const card of options) {
    const value = findValue(o, state, content, card)
    if (value > bestValue) {
      bestValue = value
      best = card
    }
  }
  const scrapBelow = o.style === 'light' ? 7 : takeAtLeast
  if (junk && bestValue < scrapBelow) return { type: 'scrapCard', uid: junk.uid }
  if (best && bestValue >= takeAtLeast) return { type: 'takeFind', card: best }
  if (junk) return { type: 'scrapCard', uid: junk.uid }
  return { type: 'declineFind' }
}

// ---------------------------------------------------------------- playing the hand

/** Free helpers that are always worth it: Travel Light, Painkillers, Flashlight before a search. */
function tempo(ctx: Ctx): Action | undefined {
  const { state, content, plan, o } = ctx
  for (const a of cardPlays(ctx)) {
    const def = defOf(state, content, a.uid)
    if (!def || def.cost > 0) continue
    const effects = modeEffects(def, a.mode)
    const kinds = new Set(effects.map((e) => e.kind))
    if ([...kinds].every((k) => k === 'gainAp' || k === 'draw')) return a
    if (kinds.has('trashFromHand') && isJunk(defOf(state, content, a.target?.trash))) return a
    if (
      kinds.has('searchBonus') &&
      !kinds.has('loseHp') &&
      o.takeFinds &&
      plan.searchHere &&
      state.player.searchBonus === 0 &&
      canSearchSoon(ctx)
    ) {
      return a
    }
  }
  return undefined
}

/** Attack where you are going to search, if it kills a zombie or you can finish the job. */
function fight(ctx: Ctx): Action | undefined {
  const { o, state, content, plan } = ctx
  const here = state.player.location
  const zombies = zombiesAt(state, here)
  if (!o.fight || zombies.length === 0 || plan.goal !== here) return undefined

  const damageInHand = state.piles.hand.reduce((sum, c) => {
    const def = content.cards[c.card]
    return sum + (def ? maxDamage(def) : 0)
  }, 0)
  const weakest = Math.min(...zombies.map((z) => z.hp))

  let best: Action | undefined
  let bestScore = 0
  for (const a of cardPlays(ctx)) {
    const def = defOf(state, content, a.uid)
    if (!def || maxDamage(def) === 0) continue
    const after = applyAction(state, a, content).state
    const killed =
      zombies.length - zombiesAt(after, here).filter((z) => zombieWasHere(z.uid, zombies)).length
    const arrivals = after.zombies.length - (state.zombies.length - killed)
    const burns = modeEffects(def, a.mode).some((e) => e.kind === 'burnBuilding')
    const progress = killed > 0 || damageInHand >= weakest
    if (!progress) continue
    let score = killed * 10 + 2 - arrivals * 12 - def.cost
    if (burns && canSearchAt(state, here)) score -= packChance(state, content, here) > 0 ? 30 : 8
    if (score > bestScore) {
      bestScore = score
      best = a
    }
  }
  return best
}

function search(ctx: Ctx): Action | undefined {
  const { o, state, content, plan, actions } = ctx
  if (!plan.searchHere) return undefined
  const searches = cardPlays(ctx).filter((a) =>
    modeEffects(defOf(state, content, a.uid), a.mode).some((e) => e.kind === 'search'),
  )
  // Pry it open first (Crowbar), if there is still AP to search afterwards.
  if (o.takeFinds && state.player.searchBonus === 0 && searches.length > 0) {
    const pry = cardPlays(ctx).find((a) => {
      const def = defOf(state, content, a.uid)
      const effects = modeEffects(def, a.mode)
      return (
        def !== undefined &&
        def.cost > 0 &&
        effects.length === 1 &&
        effects[0]?.kind === 'searchBonus' &&
        state.player.ap >= def.cost + 1 &&
        zombiesAt(state, state.player.location).length === 0
      )
    })
    if (pry) return pry
  }
  const silent = searches.find((a) =>
    modeEffects(defOf(state, content, a.uid), a.mode).some((e) => e.kind === 'search' && e.silent),
  )
  return silent ?? searches[0] ?? actions.find((a) => a.type === 'quickSearch')
}

function move(ctx: Ctx): Action | undefined {
  const { state, content, plan, home } = ctx
  const here = state.player.location
  if (plan.goal === here) return undefined
  const toGoal = distancesFrom(content, plan.goal)
  const d = toGoal[here] ?? Number.POSITIVE_INFINITY
  const winsAtHome = state.player.packs >= state.balance.packsToWin
  const avoid = (id: LocationId) => id === home && plan.goal !== home && winsAtHome

  const steps = neighbors(content, here)
    .filter((n) => (toGoal[n] ?? Number.POSITIVE_INFINITY) === d - 1 && !avoid(n))
    .sort((a, b) => expectedZombies(state, content, a) - expectedZombies(state, content, b))
  const next = steps[0]
  if (!next) return undefined

  const moves = cardPlays(ctx).filter((a) => moveStepsOfDef(defOf(state, content, a.uid)) > 0)
  const two = moves.find(
    (a) =>
      d >= 2 &&
      a.target?.location !== undefined &&
      (toGoal[a.target.location] ?? Number.POSITIVE_INFINITY) === d - 2 &&
      !avoid(a.target.location),
  )
  if (two) return two
  const free = ctx.actions.find((a) => a.type === 'freeMove' && a.to === next)
  if (free) return free
  const risky = expectedZombies(state, content, next) > 0
  const oneStep = moves
    .filter((a) => a.target?.location === next)
    .sort((a, b) => Number(isUnnoticed(ctx, b)) - Number(isUnnoticed(ctx, a)))
  return risky ? oneStep[0] : (oneStep.find((a) => !isUnnoticed(ctx, a)) ?? oneStep[0])
}

/** Before ending the turn: block, distract, kill or flee to the Shelter to avoid attacks. */
function defend(ctx: Ctx): Action | undefined {
  const { o, state, content, home } = ctx
  const now = previewEndTurn(state, content)
  if (!now.lethal && !(o.careful && now.damage > 0)) return undefined

  let best: Action | undefined
  let bestCost = threat(now.lethal, now.damage)
  for (const a of ctx.actions) {
    const def = a.type === 'playCard' ? defOf(state, content, a.uid) : undefined
    const effects = def && a.type === 'playCard' ? modeEffects(def, a.mode) : []
    const defensive = effects.some(
      (e) => e.kind === 'block' || e.kind === 'neutralize' || e.kind === 'damage',
    )
    const flees =
      (a.type === 'freeMove' && a.to === home) ||
      (a.type === 'playCard' && a.target?.location === home && moveStepsOfDef(def) > 0)
    if (!defensive && !flees) continue
    const after = applyAction(state, a, content).state
    if (after.outcome) return a // walking home wins
    const preview = previewEndTurn(after, content)
    const arrivals = after.zombies.length - state.zombies.length
    const cost = threat(preview.lethal, preview.damage) + Math.max(0, arrivals) * 2 + 0.1
    if (cost < bestCost) {
      bestCost = cost
      best = a
    }
  }
  return best
}

/** Leftover AP: trash junk with Toolbox or the service where you stand. */
function thin(ctx: Ctx): Action | undefined {
  const { o, state, content } = ctx
  const weak = (id: string | undefined) =>
    o.style === 'light' && ownedCount(state.piles) > 8 && (id === 'crowbar' || id === 'sneak')
  for (const a of ctx.actions) {
    if (a.type === 'useService') {
      const card = cardIdOf(state, a.uid)
      if (isJunk(content.cards[card ?? '']) || weak(card)) return a
    }
    if (a.type === 'playCard' && a.target?.trash) {
      const card = cardIdOf(state, a.target.trash)
      if (isJunk(content.cards[card ?? '']) || weak(card)) return a
    }
  }
  return undefined
}

function heal(ctx: Ctx): Action | undefined {
  const { state, content } = ctx
  const { hp } = state.player
  const max = state.balance.maxHp
  const heals = cardPlays(ctx).filter((a) =>
    modeEffects(defOf(state, content, a.uid), a.mode).some((e) => e.kind === 'heal'),
  )
  if (hp <= 4) {
    const big = heals.find((a) => modeOf(defOf(state, content, a.uid), a.mode)?.useUp)
    if (big) return big
  }
  if (hp <= max - 2) return heals.find((a) => !modeOf(defOf(state, content, a.uid), a.mode)?.useUp)
  return undefined
}

/** District Map: look at the most uncertain building nearby. */
function scout(ctx: Ctx): Action | undefined {
  const { state, content } = ctx
  if (state.player.packs >= ctx.o.targetPacks) return undefined
  let best: Action | undefined
  let bestScore = 0
  for (const a of cardPlays(ctx)) {
    const def = defOf(state, content, a.uid)
    const effects = modeEffects(def, a.mode)
    if (!def || def.cost > 0 || !effects.some((e) => e.kind === 'scout')) continue
    if (modeOf(def, a.mode)?.useUp) continue
    const target = a.target?.location
    if (!target) continue
    const p = packChance(state, content, target)
    const score = p > 0 && p < 1 ? 1 : 0
    if (score > bestScore) {
      bestScore = score
      best = a
    }
  }
  return best
}

/** Adrenaline: trade health for AP when there is something worth doing with it. */
function adrenaline(ctx: Ctx): Action | undefined {
  const { state, content, plan } = ctx
  if (state.player.ap > 0 || state.player.hp < 5) return undefined
  const wantsAp =
    (plan.searchHere && handHas(ctx, (e) => e.kind === 'search')) ||
    (plan.goal !== state.player.location && handHas(ctx, (e) => e.kind === 'move'))
  if (!wantsAp) return undefined
  return cardPlays(ctx).find((a) => {
    const kinds = modeEffects(defOf(state, content, a.uid), a.mode).map((e) => e.kind)
    return kinds.includes('gainAp') && kinds.includes('loseHp')
  })
}

/** End the turn, keeping the card most useful next turn. */
function endTurn(ctx: Ctx): Action {
  const { state, content, plan } = ctx
  let keep: string | undefined
  let keepValue = 2
  for (const card of state.piles.hand) {
    const def = content.cards[card.card]
    if (!def || def.kind === 'junk') continue
    const effects = def.modes.flatMap((m) => m.effects)
    let value = 0
    if (effects.some((e) => e.kind === 'search'))
      value = plan.goal === state.player.location ? 2 : 6
    if (effects.some((e) => e.kind === 'move')) value = Math.max(value, 3 + moveStepsOfDef(def))
    if (
      effects.some((e) => e.kind === 'damage') &&
      expectedZombies(state, content, plan.goal) > 0
    ) {
      value = Math.max(value, 4)
    }
    if (value > keepValue) {
      keepValue = value
      keep = card.uid
    }
  }
  const action: Action = keep ? { type: 'endTurn', keep: [keep] } : { type: 'endTurn' }
  return ctx.actions.some((a) => sameAction(a, action)) ? action : { type: 'endTurn' }
}

// ---------------------------------------------------------------- helpers

function shelterOf(content: Content): LocationId {
  const shelter = Object.values(content.locations).find((l) => l.kind === 'shelter')
  return shelter?.id ?? content.startLocation
}

function cardPlays(ctx: Ctx): PlayCardAction[] {
  return ctx.actions.filter((a): a is PlayCardAction => a.type === 'playCard')
}

function cardIdOf(state: GameState, uid: string | undefined): string | undefined {
  return state.piles.hand.find((c) => c.uid === uid)?.card
}

function defOf(state: GameState, content: Content, uid: string | undefined): CardDef | undefined {
  const card = cardIdOf(state, uid)
  return card ? content.cards[card] : undefined
}

function modeOf(def: CardDef | undefined, mode = 0) {
  return def?.modes[mode]
}

/** The effects a mode has; for Follow-up both versions count (the engine picks one). */
function modeEffects(def: CardDef | undefined, mode = 0): readonly Effect[] {
  const m = modeOf(def, mode)
  return m ? [...m.effects, ...(m.followUp?.effects ?? [])] : []
}

function moveStepsOfDef(def: CardDef | undefined): number {
  let steps = 0
  for (const m of def?.modes ?? []) {
    for (const e of [...m.effects, ...(m.followUp?.effects ?? [])]) {
      if (e.kind === 'move') steps = Math.max(steps, e.maxSteps)
    }
  }
  return steps
}

function maxDamage(def: CardDef): number {
  let best = 0
  for (const m of def.modes) {
    for (const e of [...m.effects, ...(m.followUp?.effects ?? [])]) {
      if (e.kind === 'damage') best = Math.max(best, e.amount)
    }
  }
  return best
}

function isJunk(def: CardDef | undefined): boolean {
  return def !== undefined && def.kind === 'junk' && def.trashable
}

function isUnnoticed(ctx: Ctx, a: PlayCardAction): boolean {
  return modeEffects(defOf(ctx.state, ctx.content, a.uid), a.mode).some(
    (e) => e.kind === 'move' && e.unnoticed === true,
  )
}

function handHas(ctx: Ctx, test: (e: Effect) => boolean): boolean {
  return ctx.state.piles.hand.some((c) =>
    (ctx.content.cards[c.card]?.modes ?? []).some((m) => m.effects.some(test)),
  )
}

/** Can the bot still search this turn (a Search card, or AP for a quick search)? */
function canSearchSoon(ctx: Ctx): boolean {
  const { state } = ctx
  return (
    ctx.actions.some((a) => a.type === 'quickSearch') ||
    cardPlays(ctx).some((a) =>
      modeEffects(defOf(state, ctx.content, a.uid), a.mode).some((e) => e.kind === 'search'),
    )
  )
}

function zombieWasHere(uid: string, before: readonly { uid: string }[]): boolean {
  return before.some((z) => z.uid === uid)
}

function threat(lethal: boolean, damage: number): number {
  return (lethal ? 100 : 0) + damage
}

function sameAction(a: Action, b: Action): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}
