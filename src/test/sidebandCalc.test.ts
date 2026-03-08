import { describe, it, expect } from 'vitest'
import { calculateSidebands } from '../tools/fm-sidebands/sidebandCalc'

describe('calculateSidebands', () => {
  it('fc=440, fm=220, N=3 => expected sidebands', () => {
    const r = calculateSidebands({
      fundamental: 440,
      carrierRatio: 1,
      modulatorRatio: 0.5,
      sidebandCount: 3,
    })
    // fc=440, fm=220
    expect(r.fc).toBeCloseTo(440)
    expect(r.fm).toBeCloseTo(220)
    expect(r.rows[0].upper).toBeCloseTo(440 + 220)   // 660
    expect(r.rows[0].lower).toBeCloseTo(Math.abs(440 - 220)) // 220
    expect(r.rows[1].upper).toBeCloseTo(440 + 440)   // 880
    expect(r.rows[2].upper).toBeCloseTo(440 + 660)   // 1100
  })

  it('negative frequencies shown as abs when hideNegative=false', () => {
    const r = calculateSidebands({
      fundamental: 100,
      carrierRatio: 1,
      modulatorRatio: 2,
      sidebandCount: 2,
      hideNegative: false,
    })
    // fc=100, fm=200; lower_2 = |100 - 400| = 300 (positive, so no issue)
    expect(r.rows[1].lower).toBeGreaterThan(0)
  })

  it('hides negative frequencies when toggle enabled', () => {
    const r = calculateSidebands({
      fundamental: 100,
      carrierRatio: 1,
      modulatorRatio: 4,
      sidebandCount: 1,
      hideNegative: true,
    })
    // fc=100, fm=400; lower_1 = 100 - 400 = -300 => should be -1 (hidden)
    expect(r.rows[0].lower).toBe(-1)
  })

  it('returns N rows', () => {
    const r = calculateSidebands({
      fundamental: 440,
      carrierRatio: 1,
      modulatorRatio: 1,
      sidebandCount: 8,
    })
    expect(r.rows.length).toBe(8)
  })
})
