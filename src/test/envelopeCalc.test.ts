import { describe, it, expect } from 'vitest'
import { generateEnvelopeSketch, ENVELOPE_PRESETS } from '../tools/fm-envelope/envelopeCalc'

describe('generateEnvelopeSketch', () => {
  it('ADSR curves remain within 0..1', () => {
    const r = generateEnvelopeSketch({
      amp: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.3 },
      mod: { attack: 0.05, decay: 0.1, sustain: 0.3, release: 0.2 },
      baseModIndex: 3,
      totalDuration: 1,
    })
    for (const p of r.points) {
      expect(p.amp).toBeGreaterThanOrEqual(0)
      expect(p.amp).toBeLessThanOrEqual(1 + 1e-9)
      expect(p.mod).toBeGreaterThanOrEqual(0)
      expect(p.mod).toBeLessThanOrEqual(1 + 1e-9)
    }
  })

  it('brightness follows mod envelope scaling', () => {
    const r = generateEnvelopeSketch({
      amp: { attack: 0.1, decay: 0.1, sustain: 0.8, release: 0.1 },
      mod: { attack: 0.05, decay: 0.05, sustain: 0.5, release: 0.05 },
      baseModIndex: 4,
      totalDuration: 1,
    })
    for (const p of r.points) {
      expect(p.brightness).toBeCloseTo(4 * p.mod, 5)
    }
  })

  it('release tail approaches 0', () => {
    const r = generateEnvelopeSketch({
      amp: { attack: 0.01, decay: 0.01, sustain: 0.9, release: 0.3 },
      mod: { attack: 0.01, decay: 0.01, sustain: 0.5, release: 0.3 },
      baseModIndex: 2,
      totalDuration: 1,
      gateDuration: 0.5,
    })
    const lastPoint = r.points[r.points.length - 1]
    expect(lastPoint.amp).toBeCloseTo(0, 1)
  })

  it('returns 256 points', () => {
    const r = generateEnvelopeSketch({
      amp: ENVELOPE_PRESETS.pluck.amp,
      mod: ENVELOPE_PRESETS.pluck.mod,
      baseModIndex: ENVELOPE_PRESETS.pluck.baseModIndex,
      totalDuration: 1,
    })
    expect(r.points.length).toBe(256)
  })

  it('pluck preset generates valid result', () => {
    const preset = ENVELOPE_PRESETS.pluck
    const r = generateEnvelopeSketch({ ...preset, totalDuration: 0.5 })
    expect(r.points[0].amp).toBeCloseTo(0, 1)
    expect(r.maxBrightness).toBeGreaterThan(0)
  })
})
