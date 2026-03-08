import { describe, it, expect } from 'vitest'
import { calculateArpTiming } from '../tools/arp/arpCalc'

describe('calculateArpTiming', () => {
  it('up mode with 3 notes, 2 octaves => 6 events', () => {
    const r = calculateArpTiming({
      bpm: 120,
      rateWhole: 1 / 16,
      heldNotes: 3,
      rangeOctaves: 2,
      direction: 'up',
      noteLengthPercent: 50,
    })
    expect(r.baseEvents).toBe(6)
    expect(r.eventsPerCycle).toBe(6)
  })

  it('up/down with 3 notes, 2 octaves => 10 events', () => {
    const r = calculateArpTiming({
      bpm: 120,
      rateWhole: 1 / 16,
      heldNotes: 3,
      rangeOctaves: 2,
      direction: 'up/down',
      noteLengthPercent: 50,
    })
    expect(r.baseEvents).toBe(6)
    expect(r.eventsPerCycle).toBe(10) // 6*2 - 2 = 10
  })

  it('random mode flagged as non-fixed without override', () => {
    const r = calculateArpTiming({
      bpm: 120,
      rateWhole: 1 / 16,
      heldNotes: 3,
      rangeOctaves: 1,
      direction: 'random',
      noteLengthPercent: 50,
    })
    expect(r.isRandom).toBe(true)
    expect(r.eventsPerCycle).toBeNull()
    expect(r.cycleSeconds).toBeNull()
  })

  it('up/down with 1 event => 1', () => {
    const r = calculateArpTiming({
      bpm: 120,
      rateWhole: 1 / 16,
      heldNotes: 1,
      rangeOctaves: 1,
      direction: 'up/down',
      noteLengthPercent: 50,
    })
    expect(r.eventsPerCycle).toBe(1)
  })

  it('manual override overrides direction calculation', () => {
    const r = calculateArpTiming({
      bpm: 120,
      rateWhole: 1 / 16,
      heldNotes: 3,
      rangeOctaves: 2,
      direction: 'random',
      noteLengthPercent: 50,
      manualEventsPerCycle: 7,
    })
    expect(r.eventsPerCycle).toBe(7)
    expect(r.isRandom).toBe(false)
  })
})
