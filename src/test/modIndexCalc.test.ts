import { describe, it, expect } from 'vitest'
import { calculateModIndex } from '../tools/fm-index/modIndexCalc'

describe('calculateModIndex', () => {
  it('index 0.2 => very-mild', () => {
    const r = calculateModIndex({ index: 0.2 })
    expect(r.band).toBe('very-mild')
  })

  it('index 1.5 => clear', () => {
    const r = calculateModIndex({ index: 1.5 })
    expect(r.band).toBe('clear')
  })

  it('index 3 => complex', () => {
    const r = calculateModIndex({ index: 3 })
    expect(r.band).toBe('complex')
  })

  it('index 8 => dense', () => {
    const r = calculateModIndex({ index: 8 })
    expect(r.band).toBe('dense')
  })

  it('deviation / modulator frequency conversion', () => {
    const r = calculateModIndex({ deviation: 1500, modulatorFrequency: 500 })
    expect(r.index).toBeCloseTo(3)
    expect(r.band).toBe('complex')
  })

  it('throws without required inputs', () => {
    expect(() => calculateModIndex({})).toThrow()
  })
})
