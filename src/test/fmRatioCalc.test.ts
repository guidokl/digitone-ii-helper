import { describe, it, expect } from 'vitest'
import { calculateFmRatio } from '../tools/fm-ratio/fmRatioCalc'

describe('calculateFmRatio', () => {
  it('440 fundamental, carrier 1, mod 2 => fc 440, fm 880', () => {
    const r = calculateFmRatio({ fundamental: 440, carrierRatio: 1, modulatorRatio: 2 })
    expect(r.fc).toBeCloseTo(440)
    expect(r.fm).toBeCloseTo(880)
  })

  it('1:1 ratio simplifies correctly', () => {
    const r = calculateFmRatio({ fundamental: 440, carrierRatio: 1, modulatorRatio: 1 })
    expect(r.simplifiedRatio).toBe('1:1')
    expect(r.classification).toBe('harmonic')
  })

  it('3:2 ratio simplifies correctly', () => {
    const r = calculateFmRatio({ fundamental: 440, carrierRatio: 2, modulatorRatio: 3 })
    expect(r.simplifiedRatio).toBe('3:2')
  })

  it('integer ratios classified as harmonic', () => {
    const r = calculateFmRatio({ fundamental: 440, carrierRatio: 2, modulatorRatio: 4 })
    expect(r.classification).toBe('harmonic')
  })

  it('throws on zero fundamental', () => {
    expect(() => calculateFmRatio({ fundamental: 0, carrierRatio: 1, modulatorRatio: 2 })).toThrow()
  })
})
