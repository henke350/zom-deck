import { texts } from '../data/texts.en'
import type { GameEvent, GameState } from '../game'
import { cardIdOf, cardText, locationText } from './names'

/** Turns an engine event into a log line, or null if it isn't worth showing. */
export function formatEvent(event: GameEvent, state: GameState): string | null {
  const log = texts.log
  switch (event.type) {
    case 'turnStarted':
      return log.turnStarted(event.turn)
    case 'deckShuffled':
      return log.deckShuffled
    case 'cardsDrawn':
      return log.cardsDrawn(event.uids.length)
    case 'cardPlayed':
      return log.cardPlayed(cardText(event.card).name, event.followUp, event.usedUp)
    case 'moved':
      return log.moved(
        locationText(event.to).name,
        event.by === 'free' ? '' : cardText(event.by).name,
        event.apCost,
      )
    case 'searched':
      return log.searched(locationText(event.location).name, event.options.length, event.quick)
    case 'packFound':
      return log.packFound(event.packs)
    case 'cardGained':
      return event.reason === 'pack'
        ? log.heavyLoadGained
        : log.findTaken(cardText(event.card).name)
    case 'cardScrapped':
      return log.cardScrapped(cardText(event.card).name)
    case 'findDeclined':
      return log.findDeclined
    case 'noiseAdded':
      return log.noiseAdded(event.amount)
    case 'zombieArrived':
      return log.zombieArrived(locationText(event.location).name, event.reason === 'dusk')
    case 'zombieFollowed':
      return log.zombieFollowed(locationText(event.to).name)
    case 'zombieLostTrack':
      return log.zombieLostTrack
    case 'zombieAttacked':
      return log.zombieAttacked(event.damage)
    case 'damageBlocked':
      return log.damageBlocked(event.amount)
    case 'zombieHit':
      return log.zombieHit(event.damage, event.hpLeft)
    case 'zombieKilled':
      return log.zombieKilled
    case 'zombieNeutralized':
      return log.zombieNeutralized
    case 'scouted':
      return log.scouted(event.locations.map((id) => locationText(id).name).join(', '))
    case 'buildingBurned':
      return log.buildingBurned(locationText(event.location).name)
    case 'apGained':
      return log.apGained(event.amount)
    case 'healed':
      return log.healed(event.amount)
    case 'hpLost':
      return log.hpLost(event.amount)
    case 'cardTrashed':
      return log.cardTrashed(cardText(event.card).name)
    case 'searchBonusAdded':
      return log.searchBonusAdded(event.amount)
    case 'blockAdded':
      return log.blockAdded(event.amount)
    case 'cardsKept': {
      const names = event.uids.map((uid) => cardText(cardIdOf(state, uid) ?? uid).name)
      return log.cardsKept(names.join(', '))
    }
    case 'turnEnded':
      return log.turnEnded(event.turn)
    case 'gameOver':
      return texts.ui.outcomeTitle[event.outcome.cause]
  }
}
