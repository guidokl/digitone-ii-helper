import { describe, it, expect } from 'vitest'
import { calculateRetrig } from '../tools/retrig/retrigCalc'

describe('calculateRetrig', () => {
  it('gate 1/4 note, interval 1/16 => 4 hits', () => {
    const r = calculateRetrig({ bpm: 120, gateWhole: 1 / 4, intervalWhole: 1 / 16 })
    expect(r.hitCount).toBe(4)
  })

  it('gate 1 bar (1 whole note), interval 1/8 => 8 hits', () => {
    const r = calculateRetrig({ bpm: 120, gateWhole: 1, intervalWhole: 1 / 8 })
    expect(r.hitCount).toBe(8)
  })

  it('timeline positions correct for 4 hits', () => {
    const r = calculateRetrig({ bpm: 120, gateWhole: 1 / 4, intervalWhole: 1 / 16 })
    expect(r.hits.length).toBe(4)
    expect(r.hits[0].wholeNote).toBeCloseTo(0)
    expect(r.hits[1].wholeNote).toBeCloseTo(1 / 16)
    expect(r.hits[3].wholeNote).toBeCloseTo(3 / 16)
  })

  it('at least 1 hit always', () => {
    const r = calculateRetrig({ bpm: 120, gateWhole: 0.001, intervalWhole: 1 })
    expect(r.hitCount).toBeGreaterThanOrEqual(1)
  })

  it('throws on non-positive gate', () => {
    expect(() => calculateRetrig({ bpm: 120, gateWhole: 0, intervalWhole: 1 / 16 })).toThrow()
  })
})
