import { FILTER_ANCHORS } from '../data/filterAnchors'
import type { FilterAnchor } from '../data/filterAnchors'

export type FilterMode = 'interpolate' | 'clamp'

export interface FilterFreqResult {
  hz: number
  isExact: boolean
  isExtrapolated: boolean
  lowerAnchor: FilterAnchor
  upperAnchor: FilterAnchor
}

export function getBoundingAnchors(param: number): { lower: FilterAnchor; upper: FilterAnchor } {
  const anchors = FILTER_ANCHORS
  const first = anchors[0]
  const last = anchors[anchors.length - 1]

  if (param <= first.param) {
    return { lower: anchors[0], upper: anchors[1] }
  }
  if (param >= last.param) {
    return { lower: anchors[anchors.length - 2], upper: anchors[anchors.length - 1] }
  }

  for (let i = 0; i < anchors.length - 1; i++) {
    if (param >= anchors[i].param && param <= anchors[i + 1].param) {
      return { lower: anchors[i], upper: anchors[i + 1] }
    }
  }
  return { lower: first, upper: anchors[1] }
}

export function interpolateLinearFrequency(
  param: number,
  lower: FilterAnchor,
  upper: FilterAnchor,
): number {
  const t = (param - lower.param) / (upper.param - lower.param)
  return lower.hz + t * (upper.hz - lower.hz)
}

export function findNearestAnchor(param: number): FilterAnchor {
  return FILTER_ANCHORS.reduce((best, a) =>
    Math.abs(a.param - param) < Math.abs(best.param - param) ? a : best,
  )
}

export function filterParamToHz(param: number, mode: FilterMode): FilterFreqResult {
  const anchors = FILTER_ANCHORS
  const first = anchors[0]
  const last = anchors[anchors.length - 1]

  // Check for exact anchor
  const exact = anchors.find((a) => a.param === param)
  if (exact) {
    const { lower, upper } = getBoundingAnchors(param)
    return {
      hz: exact.hz,
      isExact: true,
      isExtrapolated: false,
      lowerAnchor: lower,
      upperAnchor: upper,
    }
  }

  if (param < first.param) {
    if (mode === 'clamp') {
      return {
        hz: first.hz,
        isExact: false,
        isExtrapolated: false,
        lowerAnchor: first,
        upperAnchor: anchors[1],
      }
    }
    // Linear extrapolation from first segment
    const hz = interpolateLinearFrequency(param, first, anchors[1])
    return {
      hz: Math.max(hz, 0.01),
      isExact: false,
      isExtrapolated: true,
      lowerAnchor: first,
      upperAnchor: anchors[1],
    }
  }

  if (param > last.param) {
    if (mode === 'clamp') {
      return {
        hz: last.hz,
        isExact: false,
        isExtrapolated: false,
        lowerAnchor: anchors[anchors.length - 2],
        upperAnchor: last,
      }
    }
    // Linear extrapolation from last segment
    const hz = interpolateLinearFrequency(
      param,
      anchors[anchors.length - 2],
      last,
    )
    return {
      hz,
      isExact: false,
      isExtrapolated: true,
      lowerAnchor: anchors[anchors.length - 2],
      upperAnchor: last,
    }
  }

  const { lower, upper } = getBoundingAnchors(param)
  const hz = interpolateLinearFrequency(param, lower, upper)
  return {
    hz,
    isExact: false,
    isExtrapolated: false,
    lowerAnchor: lower,
    upperAnchor: upper,
  }
}

export interface FilterReverseResult {
  paramInt: number
  paramContinuous: number
  hz: number
}

export function hzToFilterParam(targetHz: number, mode: FilterMode): FilterReverseResult {
  // Dense scan 0..127
  let bestParam = 0
  let bestDiff = Infinity
  for (let p = 0; p <= 127; p += 0.5) {
    const result = filterParamToHz(p, mode)
    const diff = Math.abs(result.hz - targetHz)
    if (diff < bestDiff) {
      bestDiff = diff
      bestParam = p
    }
  }
  const continuous = bestParam
  const result = filterParamToHz(continuous, mode)
  return {
    paramInt: Math.round(continuous),
    paramContinuous: continuous,
    hz: result.hz,
  }
}
