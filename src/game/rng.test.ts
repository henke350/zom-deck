import { describe, expect, it } from 'vitest'
import { nextFloat, nextInt, normalizeSeed, shuffle } from './rng'

function sequence(seed: number, length: number): number[] {
  const values: number[] = []
  let rng = seed
  for (let i = 0; i < length; i++) {
    const [value, next] = nextFloat(rng)
    values.push(value)
    rng = next
  }
  return values
}

describe('rng', () => {
  it('gives the same sequence for the same seed', () => {
    expect(sequence(4711, 20)).toEqual(sequence(4711, 20))
  })

  it('gives different sequences for different seeds', () => {
    expect(sequence(1, 20)).not.toEqual(sequence(2, 20))
  })

  it('returns floats in [0, 1)', () => {
    for (const value of sequence(99, 1000)) {
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })

  it('returns integers in range and reaches every value', () => {
    const seen = new Set<number>()
    let rng = 7
    for (let i = 0; i < 600; i++) {
      const [value, next] = nextInt(rng, 6)
      rng = next
      expect(Number.isInteger(value)).toBe(true)
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(6)
      seen.add(value)
    }
    expect(seen.size).toBe(6)
  })

  it('rejects an invalid range', () => {
    expect(() => nextInt(1, 0)).toThrow()
    expect(() => nextInt(1, 2.5)).toThrow()
  })

  it('normalizes seeds to unsigned 32-bit integers', () => {
    expect(normalizeSeed(4711)).toBe(4711)
    expect(normalizeSeed(-1)).toBe(4294967295)
    expect(normalizeSeed(12.9)).toBe(12)
    expect(() => normalizeSeed(Number.NaN)).toThrow()
  })
})

describe('shuffle', () => {
  const items = Array.from({ length: 10 }, (_, i) => i)

  it('returns a permutation without changing the input', () => {
    const [shuffled] = shuffle(items, 123)
    expect([...shuffled].sort((a, b) => a - b)).toEqual(items)
    expect(items).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('is deterministic for the same generator state', () => {
    expect(shuffle(items, 123)).toEqual(shuffle(items, 123))
  })

  it('differs between generator states', () => {
    expect(shuffle(items, 123)[0]).not.toEqual(shuffle(items, 124)[0])
  })

  it('advances the generator', () => {
    const [, next] = shuffle(items, 123)
    expect(next).not.toBe(123)
  })
})
