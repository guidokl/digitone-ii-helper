// Note/frequency helpers for FM tools

export function midiToFreq(midi: number, a4 = 440): number {
  return a4 * Math.pow(2, (midi - 69) / 12)
}

export function freqToMidi(freq: number, a4 = 440): number {
  return 69 + 12 * Math.log2(freq / a4)
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const FLAT_TO_SHARP: Record<string, string> = {
  Db: 'C#', Eb: 'D#', Fb: 'E', Gb: 'F#', Ab: 'G#', Bb: 'A#', Cb: 'B',
}

export function noteNameToMidi(name: string): number {
  const clean = name.trim().replace(/\s+/g, '')
  const match = clean.match(/^([A-Ga-g][b#]?)(-?\d+)$/)
  if (!match) throw new Error(`Invalid note name: ${name}`)

  let notePart = match[1].charAt(0).toUpperCase() + match[1].slice(1)
  if (FLAT_TO_SHARP[notePart]) notePart = FLAT_TO_SHARP[notePart]

  const octave = parseInt(match[2], 10)
  const noteIndex = NOTE_NAMES.indexOf(notePart)
  if (noteIndex === -1) throw new Error(`Invalid note name: ${name}`)

  return (octave + 1) * 12 + noteIndex
}

export function midiToNoteName(midi: number, preferSharps = true): string {
  const names = preferSharps
    ? NOTE_NAMES
    : ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
  const noteIndex = ((midi % 12) + 12) % 12
  const octave = Math.floor(midi / 12) - 1
  return `${names[noteIndex]}${octave}`
}

export interface NearestNoteResult {
  note: string
  midi: number
  cents: number
}

export function freqToNearestNote(freq: number, a4 = 440): NearestNoteResult {
  if (freq <= 0) throw new Error('Frequency must be positive')
  const midi = freqToMidi(freq, a4)
  const nearestMidi = Math.round(midi)
  const nearestFreq = midiToFreq(nearestMidi, a4)
  const cents = 1200 * Math.log2(freq / nearestFreq)
  return {
    note: midiToNoteName(nearestMidi),
    midi: nearestMidi,
    cents,
  }
}

// Rational approximation helper
export function toSimplestRational(
  value: number,
  maxDenominator = 32,
): { numerator: number; denominator: number; error: number } {
  if (value <= 0) return { numerator: 0, denominator: 1, error: value }

  let bestNum = 1
  let bestDen = 1
  let bestErr = Math.abs(value - 1)

  for (let d = 1; d <= maxDenominator; d++) {
    const n = Math.round(value * d)
    if (n <= 0) continue
    const err = Math.abs(value - n / d)
    if (err < bestErr) {
      bestErr = err
      bestNum = n
      bestDen = d
    }
  }

  return { numerator: bestNum, denominator: bestDen, error: bestErr }
}
