import { defaultContent } from '../data/content'
import { cityContent } from './city'
import { texts } from '../data/texts.en'
import { ownedCount } from './deck'
import { freeMoveSteps } from './gear'
import { distance, neighbors } from './map'
import {
  activeEffects,
  conditionMet,
  freeMoveCost,
  implementedEffects,
  moveStepsOf,
  needsZombiesHere,
  needsZombieTarget,
  scoutRangeOf,
  trashFilterOf,
  targetRangeOf,
  needsUnawareTarget,
} from './rules'
import { checkSearchHere } from './search'
import { zombiesAt, zombiesInRange } from './zombies'
import type {
  Action,
  CardInstance,
  Content,
  EndTurnAction,
  FreeMoveAction,
  GameState,
  OpenStashAction,
  PlayCardAction,
  UseGearAction,
  UseServiceAction,
  Validation,
} from './types'

const ok: Validation = { ok: true }
const no = (reason: string): Validation => ({ ok: false, reason })

const findChoices: ReadonlySet<Action['type']> = new Set(['takeFind', 'scrapCard', 'declineFind'])

/** Is the action legal? If not, `reason` explains why (shown in the UI). */
export function validate(
  state: GameState,
  action: Action,
  baseContent: Content = defaultContent,
): Validation {
  const content = cityContent(state, baseContent)
  if (state.phase === 'gameOver') return no(texts.reasons.gameOver)
  const isFindChoice = findChoices.has(action.type)
  if (state.phase === 'chooseFind' && !isFindChoice) return no(texts.reasons.chooseFindFirst)
  if (state.phase !== 'chooseFind' && isFindChoice) return no(texts.reasons.noFindToChoose)

  switch (action.type) {
    case 'playCard':
      return validatePlayCard(state, action, content)
    case 'freeMove':
      return validateFreeMove(state, action, content)
    case 'quickSearch': {
      const here = checkSearchHere(state, content)
      if (!here.ok) return here
      const cost = state.balance.quickSearch.cost
      if (state.player.ap < cost) return no(texts.reasons.notEnoughAp(cost, state.player.ap))
      return ok
    }
    case 'takeFind':
      return state.pendingFind?.options.includes(action.card) ? ok : no(texts.reasons.notAFind)
    case 'scrapCard': {
      const target = state.piles.hand.find((c) => c.uid === action.uid)
      if (!target) return no(texts.reasons.trashNotInHand)
      if (!content.cards[target.card]?.trashable) return no(texts.reasons.notTrashable)
      return ok
    }
    case 'declineFind':
      return ok
    case 'useService':
      return validateUseService(state, action, content)
    case 'openStash':
      return validateOpenStash(state, action, content)
    case 'useGear':
      return validateUseGear(state, action, content)
    case 'endTurn':
      return validateEndTurn(state, action)
  }
}

/** A zombie target for a ranged weapon: here or up to `range` steps away, where you can see it. */
function checkZombieTarget(
  state: GameState,
  content: Content,
  range: number,
  uid: string | undefined,
): Validation {
  const targets = zombiesInRange(state, content, range)
  if (targets.length === 0) return no(texts.reasons.noZombiesInRange(range))
  if (!uid) return no(texts.reasons.chooseZombie)
  if (!targets.some((z) => z.uid === uid)) return no(texts.reasons.zombieOutOfRange(range))
  return ok
}

function validateUseGear(state: GameState, action: UseGearAction, content: Content): Validation {
  const card = state.piles.gear.find((c) => c.uid === action.uid)
  const def = card && content.cards[card.card]?.gear
  if (!card || !def) return no(texts.reasons.noSuchGear)
  if (def.effect.kind !== 'shoot') return no(texts.reasons.gearNotUsable)
  if (state.player.ap < def.effect.cost) {
    return no(texts.reasons.notEnoughAp(def.effect.cost, state.player.ap))
  }
  return checkZombieTarget(state, content, def.effect.range, action.target?.zombie)
}

/** Can the service where you stand be used at all right now? For the UI's button. */
export function validateServiceHere(
  state: GameState,
  baseContent: Content = defaultContent,
): Validation {
  const content = cityContent(state, baseContent)
  if (state.phase === 'gameOver') return no(texts.reasons.gameOver)
  if (state.phase === 'chooseFind') return no(texts.reasons.chooseFindFirst)
  const service = content.locations[state.player.location]?.service
  if (!service) return no(texts.reasons.noServiceHere)
  const cost = state.balance.locationServiceCost
  if (state.player.ap < cost) return no(texts.reasons.notEnoughAp(cost, state.player.ap))
  const anyTarget = state.piles.hand.some((c) => serviceTargetCheck(c, service.filter, content).ok)
  return anyTarget ? ok : no(texts.reasons.noTrashTarget)
}

function validateOpenStash(
  state: GameState,
  action: OpenStashAction,
  content: Content,
): Validation {
  const site = state.sites[state.player.location]
  if (!site || site.stash !== 'found') return no(texts.reasons.noStashHere)
  const { stashToolCost, stashForce } = state.balance
  if (action.uid === undefined) {
    if (state.player.ap < stashForce.cost) {
      return no(texts.reasons.notEnoughAp(stashForce.cost, state.player.ap))
    }
    return ok
  }
  const tool = state.piles.hand.find((c) => c.uid === action.uid)
  if (!tool) return no(texts.reasons.notInHand)
  if (!content.cards[tool.card]?.tags.includes('tool')) return no(texts.reasons.notATool)
  if (state.player.ap < stashToolCost) {
    return no(texts.reasons.notEnoughAp(stashToolCost, state.player.ap))
  }
  return ok
}

function validateUseService(
  state: GameState,
  action: UseServiceAction,
  content: Content,
): Validation {
  const here = validateServiceHere(state, content)
  if (!here.ok && here.reason !== texts.reasons.noTrashTarget) return here
  const target = state.piles.hand.find((c) => c.uid === action.uid)
  if (!target) return no(texts.reasons.trashNotInHand)
  const filter = content.locations[state.player.location]?.service?.filter ?? 'any'
  return serviceTargetCheck(target, filter, content)
}

function serviceTargetCheck(
  card: CardInstance,
  filter: 'any' | 'junk',
  content: Content,
): Validation {
  const def = content.cards[card.card]
  if (!def?.trashable) return no(texts.reasons.notTrashable)
  if (filter === 'junk' && def.kind !== 'junk') return no(texts.reasons.trashJunkOnly)
  return ok
}

function validatePlayCard(state: GameState, action: PlayCardAction, content: Content): Validation {
  const instance = state.piles.hand.find((c) => c.uid === action.uid)
  if (!instance) return no(texts.reasons.notInHand)
  const def = content.cards[instance.card]
  if (!def) return no(texts.reasons.unknownCard)
  if (def.kind === 'junk' || def.modes.length === 0) return no(texts.reasons.unplayable)

  const mode = def.modes[action.mode ?? 0]
  if (!mode) return no(texts.reasons.noSuchMode)

  if (def.requires && !conditionMet(state, def)) {
    return no(texts.reasons.ownedTooMany(def.requires.count, ownedCount(state.piles)))
  }
  if (state.player.ap < def.cost) return no(texts.reasons.notEnoughAp(def.cost, state.player.ap))

  const effects = activeEffects(state, mode)
  if (effects.some((e) => !implementedEffects.has(e.kind))) return no(texts.reasons.notBuiltYet)

  if (effects.some((e) => e.kind === 'search')) {
    const here = checkSearchHere(state, content)
    if (!here.ok) return here
  }

  const filter = trashFilterOf(effects)
  if (filter) {
    const trashUid = action.target?.trash
    if (!trashUid) return no(texts.reasons.chooseTrash)
    if (trashUid === action.uid) return no(texts.reasons.trashSelf)
    const target = state.piles.hand.find((c) => c.uid === trashUid)
    if (!target) return no(texts.reasons.trashNotInHand)
    const targetDef = content.cards[target.card]
    if (!targetDef?.trashable) return no(texts.reasons.notTrashable)
    if (filter === 'junk' && targetDef.kind !== 'junk') return no(texts.reasons.trashJunkOnly)
  }

  const here = zombiesAt(state, state.player.location)
  const range = targetRangeOf(effects)
  if (needsZombieTarget(effects) && range > 0) {
    const check = checkZombieTarget(state, content, range, action.target?.zombie)
    if (!check.ok) return check
  } else {
    if ((needsZombieTarget(effects) || needsZombiesHere(effects)) && here.length === 0) {
      return no(texts.reasons.noZombiesHere)
    }
    if (needsZombieTarget(effects)) {
      const uid = action.target?.zombie
      if (!uid) return no(texts.reasons.chooseZombie)
      const target = here.find((z) => z.uid === uid)
      if (!target) return no(texts.reasons.zombieNotHere)
      // Silent Takedown: only a zombie that has not seen you (or is distracted right now).
      if (needsUnawareTarget(effects) && target.alerted && !target.neutralized) {
        return no(texts.reasons.zombieSeesYou)
      }
    }
  }

  const scoutRange = scoutRangeOf(effects)
  if (scoutRange !== undefined) {
    const to = action.target?.location
    if (!to) return no(texts.reasons.chooseBuildingToScout)
    if (content.locations[to]?.kind !== 'building') return no(texts.reasons.notABuildingToScout)
    if (distance(content, state.player.location, to) > scoutRange) {
      return no(texts.reasons.tooFarToScout(scoutRange))
    }
  }

  const maxSteps = moveStepsOf(effects)
  if (maxSteps !== undefined) {
    const to = action.target?.location
    if (!to) return no(texts.reasons.chooseDestination)
    const check = validateDestination(state, to, content)
    if (!check.ok) return check
    if (distance(content, state.player.location, to) > maxSteps) {
      return no(texts.reasons.tooFar(maxSteps))
    }
  }
  return ok
}

function validateFreeMove(state: GameState, action: FreeMoveAction, content: Content): Validation {
  const check = validateDestination(state, action.to, content)
  if (!check.ok) return check
  const steps = freeMoveSteps(state, content)
  const reachable =
    steps > 1
      ? distance(content, state.player.location, action.to) <= steps
      : neighbors(content, state.player.location).includes(action.to)
  if (!reachable) return no(texts.reasons.notAdjacent)
  if (state.player.freeMoveUsed) return no(texts.reasons.freeMoveUsed)
  const cost = freeMoveCost(state, content)
  if (state.player.ap < cost) return no(texts.reasons.freeMoveNeedsAp(cost, state.player.ap))
  return ok
}

function validateDestination(state: GameState, to: string, content: Content): Validation {
  if (!content.locations[to]) return no(texts.reasons.unknownLocation)
  if (to === state.player.location) return no(texts.reasons.alreadyHere)
  return ok
}

function validateEndTurn(state: GameState, action: EndTurnAction): Validation {
  const keep = action.keep ?? []
  if (keep.length > state.balance.keepCards) {
    return no(texts.reasons.keepTooMany(state.balance.keepCards))
  }
  const inHand = new Set(state.piles.hand.map((c) => c.uid))
  if (new Set(keep).size !== keep.length || keep.some((uid) => !inHand.has(uid))) {
    return no(texts.reasons.keepNotInHand)
  }
  return ok
}
