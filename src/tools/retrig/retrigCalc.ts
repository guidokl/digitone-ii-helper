export interface RetrigInput {
  bpm: number
  gateWhole: number    // gate duration in whole notes
  intervalWhole: number // retrig interval in whole notes
  ppqn?: number
}

export interface HitPosition {
  index: number
  wholeNote: number
  seconds: number
  ms: number
}

export interface RetrigResult {
  hitCount: number
  gateSeconds: number
  cycleSeconds: number
  cycleMs: number
  hitsPerBeat: number
  ticksBetweenHits: number
  lastHitWhole: number
  lastHitSeconds: number
  hits: HitPosition[]
}

export function calculateRetrig(input: RetrigInput): RetrigResult {
  const { bpm, gateWhole, intervalWhole, ppqn = 96 } = input
  if (bpm <= 0) throw new Error('BPM must be positive')
  if (gateWhole <= 0) throw new Error('Gate duration must be positive')
  if (intervalWhole <= 0) throw new Error('Retrig interval must be positive')

  const hitCount = Math.max(1, Math.ceil(gateWhole / intervalWhole - 1e-12))
  const lastHitWhole = (hitCount - 1) * intervalWhole
  const cycleSeconds = intervalWhole * (240 / bpm)
  const gateSeconds = gateWhole * (240 / bpm)
  const hitsPerBeat = 1 / (intervalWhole * 4)
  const ticksBetweenHits = intervalWhole * 4 * ppqn
  const cycleMs = cycleSeconds * 1000
  const lastHitSeconds = lastHitWhole * (240 / bpm)

  const hits: HitPosition[] = Array.from({ length: hitCount }, (_, i) => {
    const wholeNote = i * intervalWhole
    const seconds = wholeNote * (240 / bpm)
    return { index: i, wholeNote, seconds, ms: seconds * 1000 }
  })

  return {
    hitCount,
    gateSeconds,
    cycleSeconds,
    cycleMs,
    hitsPerBeat,
    ticksBetweenHits,
    lastHitWhole,
    lastHitSeconds,
    hits,
  }
}
