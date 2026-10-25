import { describe, expect, it } from 'vitest'
import { defaultContent } from '../data/content'
import { cardImages } from './cardImages'

describe('card images', () => {
  it('has an illustration for every card', () => {
    const missing = Object.keys(defaultContent.cards).filter((id) => !cardImages[id])
    expect(missing).toEqual([])
  })
})
