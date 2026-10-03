import type { ExpeditionResult, GameEvent, GameState, Stats } from './types'

export function emptyStats(startHp: number): Stats {
  return {
    startHp,
    steps: 0,
    searches: 0,
    packsFound: 0,
    cardsTaken: [],
    cardsRemoved: 0,
    healed: 0,
    damageFromZombies: 0,
    damageFromCards: 0,
    damageBlocked: 0,
    attacksByFollowers: 0,
    attacksByZombiesThere: 0,
    noiseMade: 0,
    zombiesFromNoise: 0,
    zombiesFromDusk: 0,
    zombiesKilled: 0,
  }
}

/** Adds what the events of one action did to the running totals. */
export function updateStats(stats: Stats, events: readonly GameEvent[]): Stats {
  const s = { ...stats, cardsTaken: [...stats.cardsTaken] }
  for (const e of events) {
    switch (e.type) {
      case 'moved':
        s.steps += 1
        break
      case 'searched':
        s.searches += 1
        break
      case 'packFound':
        s.packsFound += 1
        break
      case 'cardGained':
        if (e.reason === 'find') s.cardsTaken.push(e.card)
        break
      case 'cardPlayed':
        if (e.usedUp) s.cardsRemoved += 1
        break
      case 'cardTrashed':
      case 'cardScrapped':
        s.cardsRemoved += 1
        break
      case 'healed':
        s.healed += e.amount
        break
      case 'hpLost':
        if (e.source === 'zombies') s.damageFromZombies += e.amount
        else s.damageFromCards += e.amount
        break
      case 'damageBlocked':
        s.damageBlocked += e.amount
        break
      case 'zombieAttacked':
        if (e.followed) s.attacksByFollowers += 1
        else s.attacksByZombiesThere += 1
        break
      case 'noiseAdded':
        if (e.reason === 'noise') s.noiseMade += e.amount
        break
      case 'zombieArrived':
        if (e.reason === 'dusk') s.zombiesFromDusk += 1
        else s.zombiesFromNoise += 1
        break
      case 'zombieKilled':
        s.zombiesKilled += 1
        break
    }
  }
  return s
}

/** The result of a finished expedition, or undefined while it is still going. */
export function expeditionResult(state: GameState): ExpeditionResult | undefined {
  if (!state.outcome) return undefined
  return {
    outcome: state.outcome,
    packs: state.player.packs,
    hpLeft: Math.max(0, state.player.hp),
    turnsUsed: state.turn,
    cardsFound: state.stats.cardsTaken,
    stats: state.stats,
  }
}
