export type MicrotimingMode = 'fraction' | 'ticks'

export interface MicrotimingInput {
  bpm: number
  mode: MicrotimingMode
  offsetStepFraction?: number // -0.5 to +0.5, used in fraction mode
  offsetTicks?: number        // used in ticks mode
  ticksPerStep?: number       // default 24, used in ticks mode
}

export interface MicrotimingResult {
  offsetStepFraction: number
  offsetSeconds: number
  offsetMs: number
  offsetBeats: number
  offsetBars: number
  direction: 'early' | 'late' | 'on-time'
  label: string
}

export function calculateMicrotiming(input: MicrotimingInput): MicrotimingResult {
  const { bpm, mode } = input
  if (bpm <= 0) throw new Error('BPM must be positive')

  const stepSeconds = 15 / bpm

  let offsetStepFraction: number
  if (mode === 'fraction') {
    offsetStepFraction = input.offsetStepFraction ?? 0
  } else {
    const offsetTicks = input.offsetTicks ?? 0
    const ticksPerStep = input.ticksPerStep ?? 24
    if (ticksPerStep <= 0) throw new Error('Ticks per step must be positive')
    offsetStepFraction = offsetTicks / ticksPerStep
  }

  const offsetSeconds = offsetStepFraction * stepSeconds
  const offsetMs = offsetSeconds * 1000
  const offsetBeats = offsetSeconds / (60 / bpm)
  const offsetBars = offsetSeconds / (240 / bpm)

  const direction: MicrotimingResult['direction'] =
    offsetMs > 0.01 ? 'late' : offsetMs < -0.01 ? 'early' : 'on-time'

  let label: string
  if (direction === 'on-time') {
    label = 'On time'
  } else if (direction === 'late') {
    label = `Late by ${Math.abs(Math.round(offsetMs))} ms`
  } else {
    label = `Early by ${Math.abs(Math.round(offsetMs))} ms`
  }

  return {
    offsetStepFraction,
    offsetSeconds,
    offsetMs,
    offsetBeats,
    offsetBars,
    direction,
    label,
  }
}
