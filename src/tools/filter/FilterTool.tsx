import { useState, useEffect, useRef } from 'react'
import { ToolCard } from '../../components/ToolCard'
import { NumberField } from '../../components/NumberField'
import { ResultCard, ResultRow } from '../../components/ResultCard'
import { FormulaBlock } from '../../components/FormulaBlock'
import { filterParamToHz, hzToFilterParam } from './filterCalc'
import { formatHz } from '../../lib/format'
import { FILTER_ANCHORS } from '../../data/filterAnchors'
import { storageGet, storageSet } from '../../lib/storage'

interface State {
  hz: string
}

const DEFAULT: State = { hz: '528' }

export function FilterTool() {
  const [state, setState] = useState<State>(() => storageGet('filter', DEFAULT))

  useEffect(() => { storageSet('filter', state) }, [state])

  function set(field: keyof State, val: string) {
    setState((s) => ({ ...s, [field]: val }))
  }

  const hzNum = parseFloat(state.hz)
  const validHz = !isNaN(hzNum) && hzNum > 0
  const revResult = validHz ? hzToFilterParam(hzNum, 'interpolate') : null

  return (
    <ToolCard id="filter" title="Filter Frequency Calculator" accent="cyan">
      <div className="space-y-4">
        <NumberField
          id="flt-hz"
          label="Frequency (Hz)"
          value={state.hz}
          onChange={(v) => set('hz', v)}
          min={1}
          max={25000}
          step={10}
        />

        {revResult && (
          <ResultCard accent="cyan">
            <ResultRow label="Digitone parameter" value={String(revResult.paramInt)} />
            <ResultRow label="Result Hz" value={`${formatHz(revResult.hz)} Hz`} />
          </ResultCard>
        )}

        <FilterGraph
          paramContinuous={revResult?.paramContinuous ?? 70}
          onParamChange={(param) => {
            const r = filterParamToHz(param, 'interpolate')
            set('hz', String(Math.round(r.hz)))
          }}
        />

        <FormulaBlock>
{`Linear interpolation between calibration anchors:
  t = (p - p1) / (p2 - p1)
  freq = f1 + t × (f2 - f1)

Known anchors: 20→16Hz, 30→33Hz, 40→66Hz,
  50→132Hz, 60→264Hz, 70→528Hz, 80→1056Hz,
  90→2112Hz, 100→4224Hz, 110→8448Hz, 120→16896Hz`}
        </FormulaBlock>
      </div>
    </ToolCard>
  )
}

interface FilterGraphProps {
  paramContinuous: number
  onParamChange: (param: number) => void
}

function FilterGraph({ paramContinuous, onParamChange }: FilterGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const W = 300
  const H = 80
  const PAD = { left: 4, right: 4, top: 8, bottom: 4 }

  const logMin = Math.log2(1)
  const logMax = Math.log2(25000)

  function hzToY(hz: number): number {
    const logHz = Math.log2(Math.max(hz, 1))
    return H - PAD.bottom - ((logHz - logMin) / (logMax - logMin)) * (H - PAD.top - PAD.bottom)
  }

  function xToParam(clientX: number): number {
    const svg = svgRef.current
    if (!svg) return 0
    const rect = svg.getBoundingClientRect()
    const relX = ((clientX - rect.left) / rect.width) * W
    const clamped = Math.max(PAD.left, Math.min(W - PAD.right, relX))
    return ((clamped - PAD.left) / (W - PAD.left - PAD.right)) * 127
  }

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    onParamChange(xToParam(e.clientX))
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (e.buttons === 0) return
    onParamChange(xToParam(e.clientX))
  }

  const points: Array<[number, number]> = []
  for (let p = 0; p <= 127; p += 1) {
    const r = filterParamToHz(p, 'interpolate')
    const x = PAD.left + (p / 127) * (W - PAD.left - PAD.right)
    points.push([x, hzToY(r.hz)])
  }

  const pathD = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ')

  const clampedParam = Math.max(0, Math.min(127, paramContinuous))
  const vLineX = PAD.left + (clampedParam / 127) * (W - PAD.left - PAD.right)

  return (
    <div>
      <p className="text-xs text-zinc-500 mb-1">Drag to set frequency</p>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full cursor-ew-resize touch-none select-none"
        aria-label={`Filter frequency curve. Current parameter: ${Math.round(paramContinuous)}`}
        role="img"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth="1.5" />
        {FILTER_ANCHORS.map((a) => {
          const ax = PAD.left + (a.param / 127) * (W - PAD.left - PAD.right)
          const ay = hzToY(a.hz)
          return <circle key={a.param} cx={ax} cy={ay} r={2} fill="#22d3ee" />
        })}
        <line
          x1={vLineX}
          y1={PAD.top}
          x2={vLineX}
          y2={H - PAD.bottom}
          stroke="#f59e0b"
          strokeWidth="1.5"
        />
        <rect
          x={vLineX - 4}
          y={PAD.top - 2}
          width={8}
          height={6}
          fill="#f59e0b"
          rx={1}
        />
      </svg>
      <p className="text-xs text-zinc-600 mt-1">Dots = anchors · Amber line = current position</p>
    </div>
  )
}
