import { defaultContent } from '../data/content'
import { texts } from '../data/texts.en'
import { ownedCount } from './deck'
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
} from './rules'
import { checkSearchHere } from './search'
import { zombiesAt } from './zombies'
import type {
  Action,
  Content,
  EndTurnAction,
  FreeMoveAction,
  GameState,
  PlayCardAction,
  Validation,
} from './types'

const ok: Validation = { ok: true }
const no = (reason: string): Validation => ({ ok: false, reason })

const findChoices: ReadonlySet<Action['type']> = new Set(['takeFind', 'scrapCard', 'declineFind'])

/** Is the action legal? If not, `reason` explains why (shown in the UI). */
export function validate(
  state: GameState,
  action: Action,
  content: Content = defaultContent,
): Validation {
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
    case 'endTurn':
      return validateEndTurn(state, action)
  }
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
  if ((needsZombieTarget(effects) || needsZombiesHere(effects)) && here.length === 0) {
    return no(texts.reasons.noZombiesHere)
  }
  if (needsZombieTarget(effects)) {
    const uid = action.target?.zombie
    if (!uid) return no(texts.reasons.chooseZombie)
    if (!here.some((z) => z.uid === uid)) return no(texts.reasons.zombieNotHere)
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
  if (!neighbors(content, state.player.location).includes(action.to)) {
    return no(texts.reasons.notAdjacent)
  }
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
