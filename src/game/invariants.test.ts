import { describe, expect, it } from 'vitest'
import { checkInvariants } from './invariants'
import { newGame } from './setup'
import type { GameState } from './types'

describe('invariant checker', () => {
  const fresh = newGame(42)

  it('finds nothing wrong with a new game', () => {
    expect(checkInvariants(fresh)).toEqual([])
  })

  it('notices a lost card', () => {
    const broken: GameState = {
      ...fresh,
      piles: { ...fresh.piles, hand: fresh.piles.hand.slice(1) },
    }
    expect(checkInvariants(broken)).toContain('cards were lost or invented')
  })

  it('notices a zombie in the Shelter and health that does not add up', () => {
    const broken: GameState = {
      ...fresh,
      player: { ...fresh.player, hp: fresh.player.hp - 1 },
      zombies: [{ uid: 'z99', location: 'shelter', hp: 2, alerted: false, neutralized: false }],
    }
    expect(checkInvariants(broken)).toEqual(
      expect.arrayContaining([
        'zombie z99 is in the Shelter',
        'health does not match healing and damage',
      ]),
    )
  })

  it('notices a win without enough packs', () => {
    const broken: GameState = {
      ...fresh,
      phase: 'gameOver',
      outcome: { result: 'won', cause: 'home', stars: 1 },
    }
    expect(checkInvariants(broken)).toContain('won without enough packs')
  })
})
