import { describe, it, expect } from 'vitest'
import { calculateMicrotiming } from '../tools/microtiming/microtimingCalc'

describe('calculateMicrotiming', () => {
  it('+0.5 step at 120 BPM => +62.5 ms', () => {
    const r = calculateMicrotiming({ bpm: 120, mode: 'fraction', offsetStepFraction: 0.5 })
    expect(r.offsetMs).toBeCloseTo(62.5)
    expect(r.direction).toBe('late')
  })

  it('negative offset labels as early', () => {
    const r = calculateMicrotiming({ bpm: 120, mode: 'fraction', offsetStepFraction: -0.5 })
    expect(r.direction).toBe('early')
    expect(r.offsetMs).toBeCloseTo(-62.5)
    expect(r.label).toContain('Early')
  })

  it('custom ticks mode: 12 ticks / 24 = 0.5 step', () => {
    const r = calculateMicrotiming({
      bpm: 120,
      mode: 'ticks',
      offsetTicks: 12,
      ticksPerStep: 24,
    })
    expect(r.offsetStepFraction).toBeCloseTo(0.5)
    expect(r.offsetMs).toBeCloseTo(62.5)
  })

  it('zero offset = on-time', () => {
    const r = calculateMicrotiming({ bpm: 120, mode: 'fraction', offsetStepFraction: 0 })
    expect(r.direction).toBe('on-time')
  })
})
