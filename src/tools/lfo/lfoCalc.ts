import { nearestFriendlyNoteLabel, formatWholeAsMusicalValue } from '../../data/noteValues'

export interface LfoInput {
  bpm: number
  speed: number
  mult: number
  ppqn?: number
}

export interface LfoResult {
  product: number
  wholeNotesPerCycle: number
  barsPerCycle: number
  beatsPerCycle: number
  steps16PerCycle: number
  secondsPerCycle: number
  millisecondsPerCycle: number
  ticksPerCycle: number
  noteLengthLabel: string
  friendlyLabel: string | null
  decimalWholeNotes: string
}

export function calculateLfoSync(input: LfoInput): LfoResult {
  const { bpm, speed, mult, ppqn = 96 } = input
  if (bpm <= 0 || speed <= 0 || mult <= 0) {
    throw new Error('BPM, SPEED, and MULT must all be positive')
  }

  const product = speed * mult
  const wholeNotesPerCycle = 128 / product
  const barsPerCycle = wholeNotesPerCycle
  const beatsPerCycle = wholeNotesPerCycle * 4
  const steps16PerCycle = wholeNotesPerCycle * 16
  const secondsPerCycle = wholeNotesPerCycle * (240 / bpm)
  const millisecondsPerCycle = secondsPerCycle * 1000
  const ticksPerCycle = wholeNotesPerCycle * 4 * ppqn

  const friendlyLabel = nearestFriendlyNoteLabel(wholeNotesPerCycle)
  const noteLengthLabel = formatWholeAsMusicalValue(wholeNotesPerCycle)
  const decimalWholeNotes = parseFloat(wholeNotesPerCycle.toFixed(6)).toString()

  return {
    product,
    wholeNotesPerCycle,
    barsPerCycle,
    beatsPerCycle,
    steps16PerCycle,
    secondsPerCycle,
    millisecondsPerCycle,
    ticksPerCycle,
    noteLengthLabel,
    friendlyLabel,
    decimalWholeNotes,
  }
}
