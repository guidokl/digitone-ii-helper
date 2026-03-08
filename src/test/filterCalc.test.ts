import { describe, it, expect } from 'vitest'
import { filterParamToHz, hzToFilterParam } from '../tools/filter/filterCalc'
import { FILTER_ANCHORS } from '../data/filterAnchors'

describe('filterParamToHz', () => {
  it('exact anchor parameters return exact anchor frequencies', () => {
    for (const anchor of FILTER_ANCHORS) {
      const r = filterParamToHz(anchor.param, 'interpolate')
      expect(r.hz).toBeCloseTo(anchor.hz, 5)
      expect(r.isExact).toBe(true)
    }
  })

  it('interpolation is monotonic increasing', () => {
    const freqs: number[] = []
    for (let p = 20; p <= 120; p += 1) {
      freqs.push(filterParamToHz(p, 'interpolate').hz)
    }
    for (let i = 1; i < freqs.length; i++) {
      expect(freqs[i]).toBeGreaterThan(freqs[i - 1])
    }
  })

  it('reverse lookup around 1050 Hz returns approx param 80', () => {
    const r = hzToFilterParam(1050, 'interpolate')
    expect(r.paramInt).toBe(80)
  })

  it('clamp mode clamps below range to first anchor', () => {
    const r = filterParamToHz(0, 'clamp')
    expect(r.hz).toBe(16)
    expect(r.isExtrapolated).toBe(false)
  })

  it('clamp mode clamps above range to last anchor', () => {
    const r = filterParamToHz(127, 'clamp')
    expect(r.hz).toBe(16896)
  })

  it('extrapolation marks approximate', () => {
    const r = filterParamToHz(10, 'interpolate')
    expect(r.isExtrapolated).toBe(true)
  })
})
