import { describe, expect, it } from 'vitest'
import { defaultContent } from '../data/content'
import { cardImages } from './cardImages'

/** New cards whose art is ordered (docs/art-prompts-m8.md). Empty the list when it arrives. */
const awaitingArt = ['salvage', 'dog']

describe('card images', () => {
  it('has an illustration for every card', () => {
    const missing = Object.keys(defaultContent.cards).filter(
      (id) => !cardImages[id] && !awaitingArt.includes(id),
    )
    expect(missing).toEqual([])
  })
})
