import { describe, it, expect } from 'vitest'
import { calculatePatternLoop } from '../tools/pattern/patternCalc'

describe('calculatePatternLoop', () => {
  it('64 steps at 120 BPM => 4 bars, 8 sec', () => {
    const r = calculatePatternLoop({
      bpm: 120,
      tracks: [{ id: '1', label: 'T1', steps: 64 }],
    })
    expect(r.tracks[0].bars).toBe(4)
    expect(r.tracks[0].seconds).toBeCloseTo(8)
  })

  it('LCM(48, 64) = 192', () => {
    const r = calculatePatternLoop({
      bpm: 120,
      tracks: [
        { id: '1', label: 'A', steps: 48 },
        { id: '2', label: 'B', steps: 64 },
      ],
    })
    expect(r.fullRepeatSteps).toBe(192)
    expect(r.fullRepeatBars).toBe(12)
  })

  it('single track full repeat = track length', () => {
    const r = calculatePatternLoop({
      bpm: 120,
      tracks: [{ id: '1', label: 'T', steps: 32 }],
    })
    expect(r.fullRepeatSteps).toBe(32)
  })

  it('three tracks LCM correct', () => {
    const r = calculatePatternLoop({
      bpm: 120,
      tracks: [
        { id: '1', label: 'A', steps: 16 },
        { id: '2', label: 'B', steps: 32 },
        { id: '3', label: 'C', steps: 48 },
      ],
    })
    expect(r.fullRepeatSteps).toBe(96)
  })
})
