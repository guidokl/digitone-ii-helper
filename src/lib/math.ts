// Core musical timing math helpers
export function wholeNoteSeconds(bpm: number): number {
  return 240 / bpm
}

export function quarterNoteSeconds(bpm: number): number {
  return 60 / bpm
}

export function sixteenthSeconds(bpm: number): number {
  return 15 / bpm
}

export function stepsToBars(steps: number): number {
  return steps / 16
}

export function stepsToSeconds(steps: number, bpm: number): number {
  return steps * (15 / bpm)
}

export function barsToSeconds(bars: number, bpm: number): number {
  return bars * (240 / bpm)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function approxEqual(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) < eps
}
