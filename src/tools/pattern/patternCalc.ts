import { lcmMany } from '../../lib/lcm'
import { stepsToBars, stepsToSeconds } from '../../lib/math'
import { formatDuration } from '../../lib/format'

export interface TrackInput {
  id: string
  label: string
  steps: number
}

export interface TrackResult {
  id: string
  label: string
  steps: number
  bars: number
  seconds: number
  duration: string
}

export interface PatternLoopInput {
  bpm: number
  tracks: TrackInput[]
}

export interface PatternLoopResult {
  tracks: TrackResult[]
  fullRepeatSteps: number
  fullRepeatBars: number
  fullRepeatSeconds: number
  fullRepeatDuration: string
}

export function calculatePatternLoop(input: PatternLoopInput): PatternLoopResult {
  const { bpm, tracks } = input
  if (bpm <= 0) throw new Error('BPM must be positive')
  if (tracks.length === 0) throw new Error('At least one track required')

  const trackResults: TrackResult[] = tracks.map((t) => {
    const bars = stepsToBars(t.steps)
    const seconds = stepsToSeconds(t.steps, bpm)
    return {
      id: t.id,
      label: t.label,
      steps: t.steps,
      bars,
      seconds,
      duration: formatDuration(seconds),
    }
  })

  const allSteps = tracks.map((t) => t.steps)
  const fullRepeatSteps = allSteps.length === 1 ? allSteps[0] : lcmMany(allSteps)
  const fullRepeatBars = stepsToBars(fullRepeatSteps)
  const fullRepeatSeconds = stepsToSeconds(fullRepeatSteps, bpm)

  return {
    tracks: trackResults,
    fullRepeatSteps,
    fullRepeatBars,
    fullRepeatSeconds,
    fullRepeatDuration: formatDuration(fullRepeatSeconds),
  }
}
