import { defaultContent } from '../data/content'
import { listActions } from './actions'
import { totalCount } from './deck'
import { starsFor } from './rules'
import type { Content, GameState } from './types'

/**
 * Things that must always hold in a game started with `newGame`. Returns what is wrong
 * (empty when all is well). Used by the fuzz tests and the simulator.
 */
export function checkInvariants(state: GameState, content: Content = defaultContent): string[] {
  const problems: string[] = []
  const fail = (what: string) => problems.push(what)
  const { piles, player, balance, stats } = state

  // Cards: every card has a unique uid c1, c2, …, and none is ever lost.
  const cards = [piles.draw, piles.hand, piles.inPlay, piles.discard, piles.removed].flat()
  const uids = cards.map((c) => c.uid)
  if (new Set(uids).size !== uids.length) fail('a card is in two places')
  if (totalCount(piles) !== state.nextUid - 1) fail('cards were lost or invented')
  const gained = stats.cardsTaken.length + stats.packsFound * balance.heavyLoadPerPack
  if (gained + stats.woundsGained !== state.nextUid - 1 - stats.startCards) {
    fail('gained cards do not match finds, Heavy Loads and Wounds')
  }
  if (stats.cardsRemoved !== piles.removed.length) fail('removed cards do not match the stats')
  if (!balance.wounds.enabled && stats.woundsGained > 0) fail('a Wound with the variant off')
  for (const card of cards) {
    if (!content.cards[card.card]) fail(`unknown card ${card.card}`)
  }

  // Packs: found plus still hidden (or burned with the building) is always the number placed.
  const hidden = Object.values(state.sites).filter((s) => s.hasPack).length
  if (player.packs + hidden !== balance.packsOnMap) fail('supply packs do not add up')
  if (stats.packsFound !== player.packs) fail('packs found do not match the stats')
  for (const [id, site] of Object.entries(state.sites)) {
    if (site.searchesLeft < 0 || site.searchesLeft > balance.searchesPerBuilding) {
      fail(`searches left out of range at ${id}`)
    }
    if (site.packTaken && site.hasPack) fail(`pack both taken and hidden at ${id}`)
  }

  // Zombies and noise.
  if (state.noise < 0 || state.noise >= balance.noiseThreshold) fail('noise meter out of range')
  const zombieUids = state.zombies.map((z) => z.uid)
  if (new Set(zombieUids).size !== zombieUids.length) fail('two zombies share a uid')
  for (const z of state.zombies) {
    if (z.hp <= 0 || z.hp > balance.zombie.hp) fail(`zombie ${z.uid} has impossible health`)
    if (!content.locations[z.location]) fail(`zombie ${z.uid} is nowhere`)
    if (content.locations[z.location]?.kind === 'shelter') fail(`zombie ${z.uid} is in the Shelter`)
  }

  // Player and turn.
  if (!content.locations[player.location]) fail('the player is nowhere')
  if (player.ap < 0) fail('negative AP')
  if (player.hp > balance.maxHp) fail('health above the maximum')
  if (
    player.hp !==
    stats.startHp + stats.healed - stats.damageFromZombies - stats.damageFromCards
  ) {
    fail('health does not match healing and damage')
  }
  if (state.turn < 1 || state.turn > balance.turnLimit) fail('turn out of range')
  if ((state.phase === 'chooseFind') !== (state.pendingFind !== undefined)) {
    fail('find phase without finds, or finds outside the find phase')
  }

  // The end.
  const outcome = state.outcome
  if ((state.phase === 'gameOver') !== (outcome !== undefined)) fail('game over without outcome')
  if (outcome?.cause === 'home') {
    if (content.locations[player.location]?.kind !== 'shelter') fail('won away from the Shelter')
    if (player.packs < balance.packsToWin) fail('won without enough packs')
    if (outcome.stars !== starsFor(state, player.packs)) fail('wrong number of stars')
  }
  if (outcome?.cause === 'killed' && player.hp > 0) fail('killed with health left')
  if (outcome?.cause !== 'killed' && player.hp <= 0) fail('no health but not killed')
  if (outcome?.cause === 'darkness' && state.turn !== balance.turnLimit) fail('dark too early')

  const actions = listActions(state, content)
  if (state.phase === 'gameOver' && actions.length > 0) fail('actions after the game ended')
  if (state.phase !== 'gameOver' && actions.length === 0) fail('stuck: no legal action')
  return problems
}
