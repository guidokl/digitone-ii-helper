import { freqToNearestNote } from '../../lib/music'
import type { NearestNoteResult } from '../../lib/music'

export interface SidebandInput {
  fundamental: number
  carrierRatio: number
  modulatorRatio: number
  sidebandCount: number
  hideNegative?: boolean
  showNoteNames?: boolean
  a4?: number
}

export interface SidebandRow {
  order: number
  upper: number
  lower: number
  upperNote?: NearestNoteResult
  lowerNote?: NearestNoteResult
}

export type SortMode = 'paired' | 'flat'

export interface SidebandResult {
  fc: number
  fm: number
  rows: SidebandRow[]
  warnings: string[]
}

export function calculateSidebands(input: SidebandInput): SidebandResult {
  const {
    fundamental,
    carrierRatio,
    modulatorRatio,
    sidebandCount,
    hideNegative = true,
    showNoteNames = false,
    a4 = 440,
  } = input

  if (fundamental <= 0) throw new Error('Fundamental must be positive')
  if (carrierRatio <= 0) throw new Error('Carrier ratio must be positive')
  if (modulatorRatio <= 0) throw new Error('Modulator ratio must be positive')
  if (sidebandCount < 1) throw new Error('Sideband count must be at least 1')

  const fc = fundamental * carrierRatio
  const fm = fundamental * modulatorRatio

  const rows: SidebandRow[] = []
  const warnings: string[] = []

  let lowFreqCount = 0
  let highFreqCount = 0

  for (let n = 1; n <= sidebandCount; n++) {
    const upper = fc + n * fm
    const lowerRaw = fc - n * fm
    const lower = Math.abs(lowerRaw)

    const showLower = !hideNegative || lowerRaw >= 0

    const row: SidebandRow = {
      order: n,
      upper,
      lower: showLower ? lower : -1,
    }

    if (showNoteNames) {
      try {
        row.upperNote = freqToNearestNote(upper, a4)
      } catch { /* ignore */ }
      if (showLower && lower > 0) {
        try {
          row.lowerNote = freqToNearestNote(lower, a4)
        } catch { /* ignore */ }
      }
    }

    rows.push(row)

    if (upper < 20) lowFreqCount++
    if (lower < 20 && lower >= 0) lowFreqCount++
    if (upper > 20000) highFreqCount++
  }

  if (lowFreqCount > 2) {
    warnings.push('Several sidebands fall below audible range (< 20 Hz)')
  }
  if (highFreqCount > 2) {
    warnings.push('Sidebands spread widely into ultrasonic range')
  }
  if (fm > fc * 3) {
    warnings.push('Wide modulator/carrier spread — pitch tracking may be imprecise')
  }

  return { fc, fm, rows, warnings }
}
