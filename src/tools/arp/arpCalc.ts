export type ArpDirection = 'up' | 'down' | 'up/down' | 'assign' | 'random'

export interface ArpInput {
  bpm: number
  rateWhole: number        // rate in whole notes
  heldNotes: number
  rangeOctaves: number
  direction: ArpDirection
  noteLengthPercent: number // 0-100 display only
  manualEventsPerCycle?: number
}

export interface ArpResult {
  baseEvents: number
  eventsPerCycle: number | null
  isRandom: boolean
  isEstimated: boolean
  rateMs: number
  cycleWhole: number | null
  cycleBars: number | null
  cycleSeconds: number | null
  notesPerSecond: number | null
  singleStepDurationMs: number
  effectiveNoteDurationMs: number
}

export function calculateArpTiming(input: ArpInput): ArpResult {
  const { bpm, rateWhole, heldNotes, rangeOctaves, direction, noteLengthPercent, manualEventsPerCycle } = input
  if (bpm <= 0) throw new Error('BPM must be positive')
  if (rateWhole <= 0) throw new Error('Rate must be positive')
  if (heldNotes < 1) throw new Error('Must hold at least 1 note')

  const baseEvents = heldNotes * Math.max(rangeOctaves, 1)
  const singleStepDurationMs = rateWhole * (240000 / bpm)
  const effectiveNoteDurationMs = singleStepDurationMs * (noteLengthPercent / 100)
  const rateMs = singleStepDurationMs

  const isRandom = direction === 'random' && manualEventsPerCycle === undefined

  let eventsPerCycle: number | null = null

  if (manualEventsPerCycle !== undefined) {
    eventsPerCycle = manualEventsPerCycle
  } else if (direction !== 'random') {
    if (direction === 'up/down') {
      eventsPerCycle = baseEvents <= 1 ? 1 : baseEvents * 2 - 2
    } else {
      eventsPerCycle = baseEvents
    }
  }

  const isEstimated = eventsPerCycle !== null && manualEventsPerCycle === undefined

  let cycleWhole: number | null = null
  let cycleBars: number | null = null
  let cycleSeconds: number | null = null
  let notesPerSecond: number | null = null

  if (eventsPerCycle !== null && eventsPerCycle > 0) {
    cycleWhole = eventsPerCycle * rateWhole
    cycleBars = cycleWhole
    cycleSeconds = cycleWhole * (240 / bpm)
    notesPerSecond = eventsPerCycle / cycleSeconds
  }

  return {
    baseEvents,
    eventsPerCycle,
    isRandom,
    isEstimated,
    rateMs,
    cycleWhole,
    cycleBars,
    cycleSeconds,
    notesPerSecond,
    singleStepDurationMs,
    effectiveNoteDurationMs,
  }
}
