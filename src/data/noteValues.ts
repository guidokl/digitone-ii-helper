export interface NoteValue {
  id: string
  label: string
  whole: number
}

export const NOTE_VALUES: readonly NoteValue[] = [
  { id: '32', label: '32 whole notes', whole: 32 },
  { id: '16', label: '16 whole notes', whole: 16 },
  { id: '8', label: '8 whole notes', whole: 8 },
  { id: '4', label: '4 whole notes', whole: 4 },
  { id: '2', label: '2 whole notes', whole: 2 },
  { id: '1', label: '1 whole note', whole: 1 },
  { id: '1_2', label: '1/2 note', whole: 1 / 2 },
  { id: '1_3', label: '1/3 note', whole: 1 / 3 },
  { id: '1_4', label: '1/4 note', whole: 1 / 4 },
  { id: '1_6', label: '1/6 note (quarter triplet)', whole: 1 / 6 },
  { id: '1_8', label: '1/8 note', whole: 1 / 8 },
  { id: '1_12', label: '1/12 note (8th triplet)', whole: 1 / 12 },
  { id: '1_16', label: '1/16 note', whole: 1 / 16 },
  { id: '1_24', label: '1/24 note (16th triplet)', whole: 1 / 24 },
  { id: '1_32', label: '1/32 note', whole: 1 / 32 },
  { id: '1_48', label: '1/48 note (32nd triplet)', whole: 1 / 48 },
  { id: '1_64', label: '1/64 note', whole: 1 / 64 },
] as const

export function parseNoteWhole(id: string): number {
  const nv = NOTE_VALUES.find((n) => n.id === id)
  if (!nv) throw new Error(`Unknown note value id: ${id}`)
  return nv.whole
}

const FRIENDLY_LABELS: Array<{ whole: number; label: string }> = [
  { whole: 1 / 64, label: '1/64' },
  { whole: 1 / 48, label: '1/48' },
  { whole: 1 / 32, label: '1/32' },
  { whole: 1 / 24, label: '1/24' },
  { whole: 1 / 16, label: '1/16' },
  { whole: 1 / 12, label: '1/12' },
  { whole: 1 / 8, label: '1/8' },
  { whole: 1 / 6, label: '1/6' },
  { whole: 1 / 4, label: '1/4' },
  { whole: 1 / 3, label: '1/3' },
  { whole: 1 / 2, label: '1/2' },
  { whole: 1, label: '1' },
  { whole: 2, label: '2' },
  { whole: 4, label: '4' },
  { whole: 8, label: '8' },
  { whole: 16, label: '16' },
  { whole: 32, label: '32' },
]

export function nearestFriendlyNoteLabel(whole: number, tolerance = 0.015): string | null {
  if (whole <= 0) return null
  for (const { whole: ref, label } of FRIENDLY_LABELS) {
    const relErr = Math.abs(whole - ref) / ref
    if (relErr <= tolerance) return label
  }
  return null
}

export function formatWholeAsMusicalValue(whole: number): string {
  if (whole <= 0) return '—'
  const friendly = nearestFriendlyNoteLabel(whole)
  if (friendly) {
    const n = parseFloat(friendly)
    if (!isNaN(n) && n >= 1) return `${friendly} whole note${n === 1 ? '' : 's'}`
    return `1/${Math.round(1 / whole)} note`
  }
  if (whole >= 1) return `${whole.toFixed(4).replace(/\.?0+$/, '')} whole notes`
  return `1/${(1 / whole).toFixed(2).replace(/\.?0+$/, '')} note`
}

export function normalizeBarsToWhole(bars: number): number {
  return bars
}

export function normalizeStepsToWhole(steps: number): number {
  return steps / 16
}
