import { defaultContent } from '../data/content'
import { drawCards, withoutCard } from './deck'
import { activeEffects, freeMoveCost, isFollowUpActive, modeNoise, starsFor } from './rules'
import { chooseFind, performSearch } from './search'
import { updateStats } from './stats'
import { validate } from './validate'
import {
  addNoise,
  damageZombies,
  neutralizeZombies,
  noticeHere,
  zombiePhase,
  zombiesAt,
} from './zombies'
import type {
  Action,
  Content,
  Effect,
  EndTurnAction,
  FreeMoveAction,
  GameEvent,
  GameState,
  LocationId,
  Outcome,
  PlayCardAction,
  StepResult,
} from './types'

/**
 * Applies one action and returns the new state plus what happened.
 * Never mutates `state`. Throws if the action is illegal; call `validate` first.
 */
export function applyAction(
  state: GameState,
  action: Action,
  content: Content = defaultContent,
): StepResult {
  const validation = validate(state, action, content)
  if (!validation.ok) throw new Error(`Illegal action ${action.type}: ${validation.reason}`)

  const events: GameEvent[] = []
  const next = step(state, action, content, events)
  return { state: { ...next, stats: updateStats(next.stats, events) }, events }
}

/**
 * How the expedition would end if this action were taken now, or undefined if it goes on
 * (or the action is illegal). Used to confirm a winning move before it ends the game.
 */
export function previewOutcome(
  state: GameState,
  action: Action,
  content: Content = defaultContent,
): Outcome | undefined {
  if (!validate(state, action, content).ok) return undefined
  return applyAction(state, action, content).state.outcome
}

function step(state: GameState, action: Action, content: Content, events: GameEvent[]): GameState {
  switch (action.type) {
    case 'playCard':
      return playCard(state, action, content, events)
    case 'freeMove':
      return freeMove(state, action, content, events)
    case 'quickSearch': {
      const { cost, options } = state.balance.quickSearch
      const paid = { ...state, player: { ...state.player, ap: state.player.ap - cost } }
      const spec = { base: options, extra: 0, quick: true, noise: state.balance.searchNoise }
      return performSearch(paid, content, spec, events)
    }
    case 'takeFind':
      return chooseFind(state, { take: action.card }, content, events)
    case 'scrapCard':
      return chooseFind(state, { scrap: action.uid }, content, events)
    case 'declineFind':
      return chooseFind(state, 'decline', content, events)
    case 'endTurn':
      return endTurn(state, action, content, events)
  }
}

/** Draws up to a full hand and resets action points. Used at game start and after each turn. */
export function startTurn(state: GameState, events: GameEvent[]): GameState {
  const turn = state.turn + 1
  events.push({ type: 'turnStarted', turn })
  const started: GameState = {
    ...state,
    turn,
    phase: 'action',
    player: { ...state.player, ap: state.balance.apPerTurn, freeMoveUsed: false },
    tagsPlayedThisTurn: [],
  }
  const drawn = drawCards(started, state.balance.handSize - started.piles.hand.length, events)
  return noticeHere(drawn)
}

function playCard(
  state: GameState,
  action: PlayCardAction,
  content: Content,
  events: GameEvent[],
): GameState {
  const instance = state.piles.hand.find((c) => c.uid === action.uid)
  const def = instance && content.cards[instance.card]
  const modeIndex = action.mode ?? 0
  const mode = def?.modes[modeIndex]
  if (!instance || !def || !mode) throw new Error('playCard: validated card is missing')

  const followUp = isFollowUpActive(state, mode)
  const effects = activeEffects(state, mode)
  const noise = modeNoise(state, mode)
  const usedUp = mode.useUp === true

  // Pay, then move the card out of the hand before its effects run, so a
  // reshuffle caused by drawing can never include it.
  let next: GameState = {
    ...state,
    player: { ...state.player, ap: state.player.ap - def.cost },
    piles: {
      ...state.piles,
      hand: withoutCard(state.piles.hand, instance.uid),
      inPlay: usedUp ? state.piles.inPlay : [...state.piles.inPlay, instance],
      removed: usedUp ? [...state.piles.removed, instance] : state.piles.removed,
    },
  }
  events.push({
    type: 'cardPlayed',
    uid: instance.uid,
    card: instance.card,
    mode: modeIndex,
    followUp,
    usedUp,
  })

  for (const effect of effects) {
    next = resolveEffect(next, effect, action, instance.card, content, events)
    if (next.player.hp <= 0) return gameOver(next, { result: 'lost', cause: 'killed' }, events)
    if (next.phase === 'gameOver') return next
  }

  const tags = new Set([...next.tagsPlayedThisTurn, ...def.tags])
  next = { ...next, tagsPlayedThisTurn: [...tags] }

  // Noise comes last. A search makes its noise after the player has chosen a find.
  if (next.phase === 'chooseFind' && next.pendingFind) {
    return { ...next, pendingFind: { ...next.pendingFind, noise } }
  }
  return addNoise(next, noise, content, 'noise', events)
}

function resolveEffect(
  state: GameState,
  effect: Effect,
  action: PlayCardAction,
  card: string,
  content: Content,
  events: GameEvent[],
): GameState {
  const { player, piles } = state
  const here = player.location
  switch (effect.kind) {
    case 'gainAp':
      events.push({ type: 'apGained', amount: effect.amount })
      return { ...state, player: { ...player, ap: player.ap + effect.amount } }
    case 'draw':
      return drawCards(state, effect.amount, events)
    case 'heal': {
      const hp = Math.min(state.balance.maxHp, player.hp + effect.amount)
      events.push({ type: 'healed', amount: hp - player.hp })
      return { ...state, player: { ...player, hp } }
    }
    case 'loseHp':
      events.push({ type: 'hpLost', amount: effect.amount, source: 'card' })
      return { ...state, player: { ...player, hp: player.hp - effect.amount } }
    case 'searchBonus':
      events.push({ type: 'searchBonusAdded', amount: effect.amount })
      return { ...state, player: { ...player, searchBonus: player.searchBonus + effect.amount } }
    case 'block':
      events.push({ type: 'blockAdded', amount: effect.amount })
      return { ...state, player: { ...player, block: player.block + effect.amount } }
    case 'trashFromHand': {
      const target = piles.hand.find((c) => c.uid === action.target?.trash)
      if (!target) throw new Error('trashFromHand: validated target is missing')
      events.push({ type: 'cardTrashed', uid: target.uid, card: target.card })
      return {
        ...state,
        piles: {
          ...piles,
          hand: withoutCard(piles.hand, target.uid),
          removed: [...piles.removed, target],
        },
      }
    }
    case 'search':
      return performSearch(
        state,
        content,
        { base: state.balance.searchOptions, extra: effect.bonus ?? 0, quick: false, noise: 0 },
        events,
      )
    case 'move': {
      const to = action.target?.location
      if (!to) throw new Error('move: validated destination is missing')
      return arrive(state, to, card, 0, content, events, effect.unnoticed === true)
    }
    case 'damage': {
      const targets =
        effect.target === 'one'
          ? [action.target?.zombie ?? '']
          : zombiesAt(state, here).map((z) => z.uid)
      return damageZombies(state, targets, effect.amount, events)
    }
    case 'neutralize': {
      const targets =
        effect.target === 'one'
          ? [action.target?.zombie ?? '']
          : zombiesAt(state, here).map((z) => z.uid)
      return neutralizeZombies(state, targets, events)
    }
    case 'scout': {
      const locations =
        effect.scope === 'one' ? [action.target?.location ?? ''] : Object.keys(state.sites)
      const sites = { ...state.sites }
      for (const id of locations) {
        const site = sites[id]
        if (site) sites[id] = { ...site, scouted: true }
      }
      events.push({ type: 'scouted', locations })
      return { ...state, sites }
    }
    case 'burnBuilding': {
      const site = state.sites[here]
      if (!site) return state
      events.push({ type: 'buildingBurned', location: here })
      return {
        ...state,
        sites: { ...state.sites, [here]: { ...site, searchesLeft: 0, burned: true } },
      }
    }
  }
}

function freeMove(
  state: GameState,
  action: FreeMoveAction,
  content: Content,
  events: GameEvent[],
): GameState {
  const cost = freeMoveCost(state, content)
  const paid: GameState = {
    ...state,
    player: { ...state.player, ap: state.player.ap - cost, freeMoveUsed: true },
  }
  return arrive(paid, action.to, 'free', cost, content, events)
}

/**
 * Moves the player. Entering the shelter with enough packs wins at once.
 * Otherwise zombies there notice you, unless you arrive unnoticed (Soft Soles).
 */
function arrive(
  state: GameState,
  to: LocationId,
  by: string,
  apCost: number,
  content: Content,
  events: GameEvent[],
  unnoticed = false,
): GameState {
  events.push({ type: 'moved', from: state.player.location, to, by, apCost })
  let moved: GameState = {
    ...state,
    player: { ...state.player, location: to },
    visited: state.visited.includes(to) ? state.visited : [...state.visited, to],
  }
  const atShelter = content.locations[to]?.kind === 'shelter'
  if (atShelter && moved.player.packs >= state.balance.packsToWin) {
    const stars = starsFor(moved, moved.player.packs)
    return gameOver(moved, { result: 'won', cause: 'home', stars }, events)
  }
  if (unnoticed) {
    const there = zombiesAt(moved, to).map((z) => z.uid)
    moved = neutralizeZombies(moved, there, events)
  }
  return noticeHere(moved)
}

function endTurn(
  state: GameState,
  action: EndTurnAction,
  content: Content,
  events: GameEvent[],
): GameState {
  // Zombies first: they follow, then attack. Then dusk noise may bring more.
  let next = zombiePhase(state, content, events)
  if (next.player.hp <= 0) return gameOver(next, { result: 'lost', cause: 'killed' }, events)
  if (state.turn >= state.balance.duskFromTurn) {
    next = addNoise(next, state.balance.duskNoise, content, 'dusk', events)
  }

  const keep = new Set(action.keep ?? [])
  const kept = next.piles.hand.filter((c) => keep.has(c.uid))
  const discarded = next.piles.hand.filter((c) => !keep.has(c.uid))
  if (kept.length > 0) events.push({ type: 'cardsKept', uids: kept.map((c) => c.uid) })

  const cleaned: GameState = {
    ...next,
    player: { ...next.player, searchBonus: 0, block: 0 },
    piles: {
      ...next.piles,
      hand: kept,
      inPlay: [],
      discard: [...next.piles.discard, ...discarded, ...next.piles.inPlay],
    },
    tagsPlayedThisTurn: [],
    zombies: next.zombies.map((z) => (z.neutralized ? { ...z, neutralized: false } : z)),
  }
  events.push({ type: 'turnEnded', turn: state.turn })

  if (state.turn >= state.balance.turnLimit) {
    return gameOver(cleaned, { result: 'lost', cause: 'darkness' }, events)
  }
  return startTurn(cleaned, events)
}

function gameOver(state: GameState, outcome: Outcome, events: GameEvent[]): GameState {
  events.push({ type: 'gameOver', outcome })
  return { ...state, phase: 'gameOver', outcome }
}
