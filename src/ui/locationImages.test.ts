import { describe, expect, it } from 'vitest'
import { defaultContent } from '../data/content'
import { locationImages } from './locationImages'

describe('location images', () => {
  it('has an illustration for every location', () => {
    const missing = Object.keys(defaultContent.locations).filter((id) => !locationImages[id])
    expect(missing).toEqual([])
  })
})
