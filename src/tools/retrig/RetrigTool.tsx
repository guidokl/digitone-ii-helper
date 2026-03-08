import { useState, useEffect } from 'react'
import { ToolCard } from '../../components/ToolCard'
import { NumberField } from '../../components/NumberField'
import { SelectField } from '../../components/SelectField'
import { ResultCard, ResultRow } from '../../components/ResultCard'
import { FormulaBlock } from '../../components/FormulaBlock'
import { Badge } from '../../components/Badge'
import { SegmentedControl } from '../../components/SegmentedControl'
import { calculateRetrig } from './retrigCalc'
import type { RetrigResult } from './retrigCalc'
import { validateBpm, validatePositive } from '../../lib/validation'
import { formatMs, formatSeconds } from '../../lib/format'
import { NOTE_VALUES } from '../../data/noteValues'
import { storageGet, storageSet } from '../../lib/storage'

type GateMode = 'whole' | 'bars' | 'steps'

interface State {
  bpm: string
  gateMode: GateMode
  gateValue: string
  intervalId: string
}

const DEFAULT: State = { bpm: '120', gateMode: 'whole', gateValue: '0.25', intervalId: '1_16' }

function gateToWhole(value: number, mode: GateMode): number {
  if (mode === 'whole') return value
  if (mode === 'bars') return value  // 1 bar = 1 whole note in 4/4
  return value / 16  // steps
}

const NOTE_OPTIONS = NOTE_VALUES.map((n) => ({ value: n.id, label: n.label }))

export function RetrigTool() {
  const [state, setState] = useState<State>(() => storageGet('retrig', DEFAULT))
  const [result, setResult] = useState<RetrigResult | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof State, string>>>({})

  useEffect(() => {
    storageSet('retrig', state)
    calculate()
  }, [state])

  function set(field: keyof State, val: string) {
    setState((s) => ({ ...s, [field]: val }))
  }

  function calculate() {
    const bpmV = validateBpm(state.bpm)
    const gateV = validatePositive(state.gateValue, 'Gate')
    const errs: typeof errors = {}
    if (!bpmV.valid) errs.bpm = bpmV.error
    if (!gateV.valid) errs.gateValue = gateV.error

    setErrors(errs)

    const intervalNV = NOTE_VALUES.find((n) => n.id === state.intervalId)
    if (!intervalNV) return

    if (bpmV.valid && gateV.valid) {
      try {
        const gateWhole = gateToWhole(gateV.value, state.gateMode)
        setResult(calculateRetrig({ bpm: bpmV.value, gateWhole, intervalWhole: intervalNV.whole }))
      } catch {
        setResult(null)
      }
    } else {
      setResult(null)
    }
  }

  return (
    <ToolCard id="retrig" title="Retrig Calculator" accent="blue">
      <div className="space-y-4">
        <NumberField id="ret-bpm" label="BPM" value={state.bpm}
          onChange={(v) => set('bpm', v)} min={1} max={999} error={errors.bpm} />

        <SegmentedControl
          id="ret-gatemode"
          label="Gate length mode"
          options={[
            { value: 'whole', label: 'Whole notes' },
            { value: 'bars', label: 'Bars' },
            { value: 'steps', label: 'Steps' },
          ]}
          value={state.gateMode}
          onChange={(v) => set('gateMode', v as GateMode)}
          accent="blue"
        />
        <NumberField id="ret-gate" label={`Gate (${state.gateMode})`} value={state.gateValue}
          onChange={(v) => set('gateValue', v)} min={0.001} step={state.gateMode === 'steps' ? 1 : 0.125}
          error={errors.gateValue} />

        <SelectField id="ret-interval" label="Retrig interval" value={state.intervalId}
          onChange={(v) => set('intervalId', v)} options={NOTE_OPTIONS} />

        {result && (
          <div className="space-y-2">
            <Badge variant="exact" />
            <ResultCard accent="blue">
              <ResultRow label="Hit count" value={String(result.hitCount)} />
              <ResultRow label="Spacing" value={`${formatMs(result.cycleMs)} ms`} />
              <ResultRow label="Spacing (sec)" value={`${formatSeconds(result.cycleSeconds)} s`} />
              <ResultRow label="Hits per beat" value={result.hitsPerBeat.toFixed(3)} />
              <ResultRow label="Gate duration" value={`${formatSeconds(result.gateSeconds)} s`} />
              <ResultRow label="Last hit at" value={`${result.lastHitWhole.toFixed(4)} whole notes`} />
            </ResultCard>
            <RetrigTimeline hits={result.hits} gateSeconds={result.gateSeconds} />
          </div>
        )}

        <FormulaBlock>
{`hitCount = max(1, ceil(gateWhole / intervalWhole))
spacing = intervalWhole × (240 / BPM) × 1000 ms
hitsPerBeat = 1 / (intervalWhole × 4)`}
        </FormulaBlock>
      </div>
    </ToolCard>
  )
}

function RetrigTimeline({ hits, gateSeconds }: { hits: RetrigResult['hits']; gateSeconds: number }) {
  if (hits.length === 0) return null
  const MAX_DOTS = 32
  const shown = hits.slice(0, MAX_DOTS)

  return (
    <div>
      <p className="text-xs text-zinc-500 mb-1">Timeline (gate duration)</p>
      <svg
        width="100%"
        height="32"
        viewBox={`0 0 300 32`}
        aria-label={`Retrig timeline with ${hits.length} hits`}
        role="img"
        className="w-full"
      >
        {/* Gate bar */}
        <rect x={4} y={12} width={292} height={8} rx={2} fill="#27272a" />
        {/* Hit dots */}
        {shown.map((h) => {
          const x = 4 + (h.seconds / Math.max(gateSeconds, 0.001)) * 292
          return (
            <circle
              key={h.index}
              cx={Math.min(x, 296)}
              cy={16}
              r={4}
              fill="#3b82f6"
            />
          )
        })}
        {hits.length > MAX_DOTS && (
          <text x={290} y={12} fontSize={8} fill="#6b7280" textAnchor="end">…</text>
        )}
      </svg>
      <p className="text-xs text-zinc-600 mt-1" aria-hidden="true">
        {hits.length} hit{hits.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
