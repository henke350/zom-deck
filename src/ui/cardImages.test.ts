import { describe, expect, it } from 'vitest'
import { defaultContent } from '../data/content'
import { cardImages } from './cardImages'

/** Cards added after the illustrations were made. They show without a picture until art arrives. */
const awaitingArt = ['shotgun', 'chainsaw', 'bicycle', 'firstAidKit', 'knife', 'bow', 'crossbow']

describe('card images', () => {
  it('has an illustration for every card, except the ones still waiting for art', () => {
    const missing = Object.keys(defaultContent.cards).filter((id) => !cardImages[id])
    expect(missing.sort()).toEqual([...awaitingArt].sort())
  })
})
