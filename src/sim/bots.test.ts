import { describe, expect, it } from 'vitest'
import { balance } from '../data/balance'
import { defaultContent } from '../data/content'
import { newGame } from '../game'
import { makeState } from '../game/testkit'
import type { GameState } from '../game'
import { bots } from './bots'
import { playGame } from './play'
import { makeRandom } from './random'

const bot = (id: string) => {
  const found = bots.find((b) => b.bot.id === id)
  if (!found) throw new Error(`no bot ${id}`)
  return found.bot
}
const next = (id: string, state: GameState) => bot(id).next(state, defaultContent, makeRandom(1))

describe('bots', () => {
  it.each(bots.map((b) => b.bot.id))('%s plays 40 whole games without breaking a rule', (id) => {
    for (let seed = 1; seed <= 40; seed++) {
      const record = playGame(bot(id), seed, { checkInvariants: true })
      expect(record.problems).toEqual([])
      expect(['home', 'killed', 'darkness']).toContain(record.result.outcome.cause)
    }
  })

  it('give the same game for the same seed', () => {
    const a = playGame(bot('greedy'), 7)
    const b = playGame(bot('greedy'), 7)
    expect(a).toEqual(b)
  })

  it('head for the Supermarket first, where a pack is sure', () => {
    expect(next('rush', newGame(3))).toEqual({ type: 'freeMove', to: 'street' })
  })

  it('walk home once they carry the packs they want', () => {
    const state = makeState({ location: 'street', packs: 2, hand: ['search', 'run'] })
    expect(next('rush', state)).toEqual({ type: 'freeMove', to: 'shelter' })
    // The greedy bot wants all four packs and keeps going.
    expect(next('greedy', state)).not.toEqual({ type: 'freeMove', to: 'shelter' })
  })

  it('search where a pack may be', () => {
    const state = makeState({ location: 'supermarket', hand: ['search', 'nerves'] })
    expect(next('rush', state)).toEqual({ type: 'playCard', uid: 'h1', mode: 0 })
  })

  it('take finds that suit their style, or scrap junk instead', () => {
    const choosing = (options: string[], hand: string[]): GameState => ({
      ...makeState({ location: 'workshop', hand }),
      phase: 'chooseFind',
      pendingFind: { location: 'workshop', options, packFound: false, noise: 1 },
    })
    const finds = ['axe', 'lockpick', 'toolbox']
    expect(next('fighter', choosing(finds, ['search']))).toEqual({ type: 'takeFind', card: 'axe' })
    expect(next('quiet', choosing(finds, ['search']))).toEqual({
      type: 'takeFind',
      card: 'lockpick',
    })
    expect(next('light', choosing(['molotov'], ['nerves']))).toEqual({
      type: 'scrapCard',
      uid: 'h1',
    })
    expect(next('rush', choosing(finds, ['nerves']))).toEqual({ type: 'declineFind' })
  })

  it('avoid a deadly end of turn when they can', () => {
    const state = makeState({
      location: 'houseA',
      hp: 1,
      ap: 1,
      freeMoveUsed: true,
      hand: ['sneak'],
      zombies: [{ at: 'houseA' }],
      balance,
    })
    expect(next('rush', state)).toEqual({
      type: 'playCard',
      uid: 'h1',
      mode: 0,
      target: { zombie: 'z1' },
    })
  })
})
