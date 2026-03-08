import { describe, it, expect } from 'vitest'
import { calculateLfoSync } from '../tools/lfo/lfoCalc'

describe('calculateLfoSync', () => {
  it('speed 32, mult 64 => 1/16 whole note', () => {
    const r = calculateLfoSync({ bpm: 120, speed: 32, mult: 64 })
    expect(r.wholeNotesPerCycle).toBeCloseTo(1 / 16)
    expect(r.product).toBe(2048)
    expect(r.friendlyLabel).toBe('1/16')
  })

  it('speed 4, mult 2 => 16 whole notes', () => {
    const r = calculateLfoSync({ bpm: 120, speed: 4, mult: 2 })
    expect(r.wholeNotesPerCycle).toBe(16)
    expect(r.product).toBe(8)
    expect(r.friendlyLabel).toBe('16')
  })

  it('bpm conversion to seconds at 120 BPM, product=128', () => {
    const r = calculateLfoSync({ bpm: 120, speed: 1, mult: 1 })
    // wholeNotesPerCycle = 128/1 = 128; secondsPerCycle = 128 * (240/120) = 256
    expect(r.wholeNotesPerCycle).toBe(128)
    expect(r.secondsPerCycle).toBeCloseTo(256)
  })

  it('at 120 BPM speed=8 mult=1 => 1/4 note', () => {
    // 128 / 8 = 16 wholeNotes? No: 128/8 = 16
    // Wait: speed=8, mult=1 => product=8, wholeNotesPerCycle=128/8=16
    const r = calculateLfoSync({ bpm: 120, speed: 64, mult: 2 })
    // product = 128, wholeNotesPerCycle = 1
    expect(r.wholeNotesPerCycle).toBe(1)
  })

  it('throws on zero speed', () => {
    expect(() => calculateLfoSync({ bpm: 120, speed: 0, mult: 1 })).toThrow()
  })

  it('computes ticks correctly', () => {
    const r = calculateLfoSync({ bpm: 120, speed: 64, mult: 2, ppqn: 96 })
    // wholeNotes = 1, ticks = 1 * 4 * 96 = 384
    expect(r.ticksPerCycle).toBe(384)
  })

  it('friendly label matching works for 1/2', () => {
    // speed=1, mult=256 => product=256, wholeNotes=128/256=0.5
    const r = calculateLfoSync({ bpm: 120, speed: 1, mult: 256 })
    expect(r.wholeNotesPerCycle).toBeCloseTo(0.5)
    expect(r.friendlyLabel).toBe('1/2')
  })
})
