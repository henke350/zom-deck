import { describe, expect, it } from 'vitest'
import { defaultContent } from '../data/content'
import { makeState } from '../game/testkit'
import { currentHint } from './hints'

const hint = (spec: Parameters<typeof makeState>[0]) => currentHint(makeState(spec), defaultContent)

describe('tips for new players', () => {
  it('suggest walking out of the Shelter first', () => {
    expect(hint({ hand: ['nerves'] })).toBe('walk')
  })

  it('suggest searching where you can', () => {
    expect(hint({ location: 'pharmacy', hand: ['search'] })).toBe('search')
  })

  it('warn about zombies that will attack', () => {
    expect(hint({ location: 'pharmacy', hand: ['search'], zombies: [{ at: 'pharmacy' }] })).toBe(
      'zombies',
    )
  })

  it('say when it is time to go home', () => {
    expect(hint({ location: 'pharmacy', packs: 2, hand: ['search'] })).toBe('goHome')
  })

  it('suggest ending the turn when nothing else is left', () => {
    expect(hint({ location: 'pharmacy', ap: 0, freeMoveUsed: true, hand: ['nerves'] })).toBe(
      'endTurn',
    )
  })
})
