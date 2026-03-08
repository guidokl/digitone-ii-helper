import { toSimplestRational } from '../../lib/music'

export type FmClassification = 'harmonic' | 'subharmonic' | 'inharmonic'

export interface FmRatioInput {
  fundamental: number
  carrierRatio: number
  modulatorRatio: number
}

export interface FmRatioResult {
  fc: number
  fm: number
  ratioRelation: number
  classification: FmClassification
  classificationLabel: string
  simplifiedRatio: string
  octaveDiff: number
  heuristicNote: string
}

function isInteger(n: number, tol = 1e-9): boolean {
  return Math.abs(n - Math.round(n)) < tol
}

function isQuarterHalfBased(n: number): boolean {
  const quarters = n * 4
  return Math.abs(quarters - Math.round(quarters)) < 1e-9
}

export function calculateFmRatio(input: FmRatioInput): FmRatioResult {
  const { fundamental, carrierRatio, modulatorRatio } = input
  if (fundamental <= 0) throw new Error('Fundamental must be positive')
  if (carrierRatio <= 0) throw new Error('Carrier ratio must be positive')
  if (modulatorRatio <= 0) throw new Error('Modulator ratio must be positive')

  const fc = fundamental * carrierRatio
  const fm = fundamental * modulatorRatio
  const ratioRelation = modulatorRatio / carrierRatio

  let classification: FmClassification
  let classificationLabel: string

  if (isInteger(carrierRatio) && isInteger(modulatorRatio)) {
    classification = 'harmonic'
    classificationLabel = 'Strong harmonic alignment to played note'
  } else if (isQuarterHalfBased(carrierRatio) && isQuarterHalfBased(modulatorRatio)) {
    classification = 'subharmonic'
    classificationLabel = 'Subharmonic or detuned harmonic relation'
  } else {
    classification = 'inharmonic'
    classificationLabel = 'More inharmonic relation'
  }

  const { numerator, denominator, error } = toSimplestRational(ratioRelation)
  const simplifiedRatio =
    error < 0.01 ? `${numerator}:${denominator}` : ratioRelation.toFixed(3)

  const octaveDiff = Math.log2(modulatorRatio / carrierRatio)

  const noteForRatio = (r: number) => {
    if (Math.abs(r - 1) < 0.01) return 'Often stable or basic tonal character'
    if (Math.abs(r - 2) < 0.01) return 'Brighter harmonic spacing'
    if (r < 3 && isInteger(r)) return 'Small integer ratio — tends to sound more tonal'
    if (r >= 5) return 'More complex or metallic tendency'
    return 'Intermediate harmonic relation'
  }

  return {
    fc,
    fm,
    ratioRelation,
    classification,
    classificationLabel,
    simplifiedRatio,
    octaveDiff,
    heuristicNote: noteForRatio(ratioRelation),
  }
}
