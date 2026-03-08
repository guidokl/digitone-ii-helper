export interface FilterAnchor {
  param: number
  hz: number
}

export const FILTER_ANCHORS: readonly FilterAnchor[] = [
  { param: 20, hz: 16 },
  { param: 30, hz: 33 },
  { param: 40, hz: 66 },
  { param: 50, hz: 132 },
  { param: 60, hz: 264 },
  { param: 70, hz: 528 },
  { param: 80, hz: 1056 },
  { param: 90, hz: 2112 },
  { param: 100, hz: 4224 },
  { param: 110, hz: 8448 },
  { param: 120, hz: 16896 },
] as const
