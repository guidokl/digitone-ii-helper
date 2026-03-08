export interface AdsrParams {
  attack: number   // seconds
  decay: number    // seconds
  sustain: number  // 0..1
  release: number  // seconds
}

export interface EnvelopeInput {
  amp: AdsrParams
  mod: AdsrParams
  baseModIndex: number
  totalDuration: number   // seconds
  gateDuration?: number   // seconds, defaults to totalDuration * 0.7
}

export interface EnvelopePoint {
  t: number
  amp: number
  mod: number
  brightness: number
  perceived: number
}

export interface EnvelopeAnnotation {
  t: number
  label: string
}

export interface EnvelopeSketchResult {
  points: EnvelopePoint[]
  annotations: EnvelopeAnnotation[]
  maxBrightness: number
}

function adsrAt(t: number, gate: number, params: AdsrParams): number {
  const { attack, decay, sustain, release } = params

  if (t < 0) return 0

  // Determine level at gate-off
  let levelAtGate: number
  if (gate <= attack) {
    levelAtGate = gate / attack
  } else if (gate <= attack + decay) {
    const decayProgress = (gate - attack) / decay
    levelAtGate = 1 - decayProgress * (1 - sustain)
  } else {
    levelAtGate = sustain
  }

  if (t <= gate) {
    // In attack
    if (t <= attack) {
      return attack > 0 ? t / attack : 1
    }
    // In decay
    if (t <= attack + decay) {
      const decayProgress = (t - attack) / (decay > 0 ? decay : 1e-9)
      return 1 - decayProgress * (1 - sustain)
    }
    // In sustain
    return sustain
  } else {
    // In release
    const releaseProgress = (t - gate) / (release > 0 ? release : 1e-9)
    return Math.max(0, levelAtGate * (1 - releaseProgress))
  }
}

export function generateEnvelopeSketch(input: EnvelopeInput): EnvelopeSketchResult {
  const { amp, mod, baseModIndex, totalDuration } = input
  const gateDuration = input.gateDuration ?? totalDuration * 0.7

  if (totalDuration <= 0) throw new Error('Total duration must be positive')

  const NUM_POINTS = 256
  const points: EnvelopePoint[] = []
  let maxBrightness = 0

  for (let i = 0; i < NUM_POINTS; i++) {
    const t = (i / (NUM_POINTS - 1)) * totalDuration
    const ampVal = adsrAt(t, gateDuration, amp)
    const modVal = adsrAt(t, gateDuration, mod)
    const brightness = baseModIndex * modVal
    const normalizedBrightness = baseModIndex > 0 ? modVal : 0
    const perceived = ampVal * (0.35 + 0.65 * normalizedBrightness)

    if (brightness > maxBrightness) maxBrightness = brightness

    points.push({ t, amp: ampVal, mod: modVal, brightness, perceived })
  }

  // Annotations based on simple thresholds
  const annotations: EnvelopeAnnotation[] = []

  // Bright transient: early peak in brightness
  const peakIdx = points.reduce(
    (best, p, i) => (p.brightness > points[best].brightness ? i : best),
    0,
  )
  if (points[peakIdx].brightness > 0) {
    annotations.push({ t: points[peakIdx].t, label: 'Bright transient' })
  }

  // Steady tone: mid-section where both are stable
  const midIdx = Math.floor(NUM_POINTS * 0.5)
  if (points[midIdx].amp > 0.3 && points[midIdx].mod < 0.5) {
    annotations.push({ t: points[midIdx].t, label: 'Steady tone' })
  }

  // Long tail: amp still above 0.1 near end
  const tailIdx = Math.floor(NUM_POINTS * 0.85)
  if (points[tailIdx].amp > 0.05) {
    annotations.push({ t: points[tailIdx].t, label: 'Long tail' })
  }

  return { points, annotations, maxBrightness }
}

export const ENVELOPE_PRESETS: Record<string, {
  amp: AdsrParams
  mod: AdsrParams
  baseModIndex: number
  totalDuration: number
  gateDuration: number
}> = {
  pluck: {
    amp: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 },
    mod: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.03 },
    baseModIndex: 3,
    totalDuration: 1,
    gateDuration: 0.7,
  },
  bell: {
    amp: { attack: 0.005, decay: 1.2, sustain: 0, release: 0.3 },
    mod: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.2 },
    baseModIndex: 4,
    totalDuration: 3,
    gateDuration: 0.5,
  },
  pad: {
    amp: { attack: 0.4, decay: 0.3, sustain: 0.7, release: 0.8 },
    mod: { attack: 0.2, decay: 0.4, sustain: 0.4, release: 0.6 },
    baseModIndex: 1.5,
    totalDuration: 4,
    gateDuration: 2,
  },
  sharp: {
    amp: { attack: 0.001, decay: 0.05, sustain: 0.8, release: 0.3 },
    mod: { attack: 0.001, decay: 0.03, sustain: 0.2, release: 0.15 },
    baseModIndex: 5,
    totalDuration: 0.5,
    gateDuration: 0.3,
  },
}
