import { describe, expect, it } from 'vitest'
import { defaultContent } from '../data/content'
import { locationImages } from './locationImages'

describe('location images', () => {
  it('has an illustration for every place', () => {
    const all = [
      ...Object.keys(defaultContent.locations),
      ...Object.keys(defaultContent.extraBuildings ?? {}),
      'square',
    ]
    const missing = all.filter((id) => !locationImages[id])
    expect(missing).toEqual([])
  })
})
