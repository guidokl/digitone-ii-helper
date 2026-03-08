export type ModIndexBand = 'very-mild' | 'clear' | 'complex' | 'dense'

export interface ModIndexInput {
  index?: number
  deviation?: number
  modulatorFrequency?: number
}

export interface ModIndexResult {
  index: number
  band: ModIndexBand
  bandLabel: string
  interpretation: string
}

export function calculateModIndex(input: ModIndexInput): ModIndexResult {
  let index: number

  if (input.deviation !== undefined && input.modulatorFrequency !== undefined) {
    if (input.modulatorFrequency <= 0) throw new Error('Modulator frequency must be positive')
    index = input.deviation / input.modulatorFrequency
  } else if (input.index !== undefined) {
    index = input.index
  } else {
    throw new Error('Provide either index directly or deviation + modulator frequency')
  }

  if (index < 0) throw new Error('Modulation index must be non-negative')

  let band: ModIndexBand
  let bandLabel: string
  let interpretation: string

  if (index <= 0.5) {
    band = 'very-mild'
    bandLabel = '0 – 0.5'
    interpretation = 'Very mild modulation — almost subtractive-like, minimal sideband energy'
  } else if (index <= 2) {
    band = 'clear'
    bandLabel = '0.5 – 2'
    interpretation = 'Clear brightness, still controlled — recognizable harmonic enrichment'
  } else if (index <= 5) {
    band = 'complex'
    bandLabel = '2 – 5'
    interpretation = 'Complex or metallic territory — significant sideband spread'
  } else {
    band = 'dense'
    bandLabel = '5+'
    interpretation = 'Dense, noisy, unstable pitch impression — many sidebands at high amplitude'
  }

  return { index, band, bandLabel, interpretation }
}
