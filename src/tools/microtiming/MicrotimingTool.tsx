import { useState, useEffect } from 'react'
import { ToolCard } from '../../components/ToolCard'
import { NumberField } from '../../components/NumberField'
import { ResultCard, ResultRow } from '../../components/ResultCard'
import { FormulaBlock } from '../../components/FormulaBlock'
import { Badge } from '../../components/Badge'
import { SegmentedControl } from '../../components/SegmentedControl'
import { calculateMicrotiming } from './microtimingCalc'
import type { MicrotimingMode, MicrotimingResult } from './microtimingCalc'
import { validateBpm, validatePositive, validateRange } from '../../lib/validation'
import { formatMs } from '../../lib/format'
import { storageGet, storageSet } from '../../lib/storage'

interface State {
  bpm: string
  mode: MicrotimingMode
  fraction: string
  ticks: string
  ticksPerStep: string
}

const DEFAULT: State = { bpm: '120', mode: 'fraction', fraction: '0', ticks: '0', ticksPerStep: '24' }

export function MicrotimingTool() {
  const [state, setState] = useState<State>(() => storageGet('microtiming', DEFAULT))
  const [result, setResult] = useState<MicrotimingResult | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof State, string>>>({})

  useEffect(() => {
    storageSet('microtiming', state)
    calculate()
  }, [state])

  function set(field: keyof State, val: string) {
    setState((s) => ({ ...s, [field]: val }))
  }

  function calculate() {
    const bpmV = validateBpm(state.bpm)
    const errs: typeof errors = {}
    if (!bpmV.valid) errs.bpm = bpmV.error

    if (state.mode === 'fraction') {
      const fv = validateRange(state.fraction, -1, 1, 'Offset')
      if (!fv.valid) errs.fraction = fv.error
      if (bpmV.valid && fv.valid) {
        setResult(calculateMicrotiming({ bpm: bpmV.value, mode: 'fraction', offsetStepFraction: fv.value }))
      } else {
        setResult(null)
      }
    } else {
      const tv = validateRange(state.ticks, -9999, 9999, 'Ticks')
      const tpsV = validatePositive(state.ticksPerStep, 'Ticks/step')
      if (!tv.valid) errs.ticks = tv.error
      if (!tpsV.valid) errs.ticksPerStep = tpsV.error
      if (bpmV.valid && tv.valid && tpsV.valid) {
        setResult(calculateMicrotiming({ bpm: bpmV.value, mode: 'ticks', offsetTicks: tv.value, ticksPerStep: tpsV.value }))
      } else {
        setResult(null)
      }
    }

    setErrors(errs)
  }

  const fractionVal = parseFloat(state.fraction) || 0

  return (
    <ToolCard id="microtiming" title="Microtiming Converter" accent="blue">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <NumberField id="mt-bpm" label="BPM" value={state.bpm}
            onChange={(v) => set('bpm', v)} min={1} max={999} error={errors.bpm} />
        </div>
        <SegmentedControl
          id="mt-mode"
          label="Mode"
          options={[
            { value: 'fraction', label: 'Step fraction' },
            { value: 'ticks', label: 'Microticks' },
          ]}
          value={state.mode}
          onChange={(v) => set('mode', v as MicrotimingMode)}
          accent="blue"
        />

        {state.mode === 'fraction' ? (
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-medium uppercase tracking-wide block">
              Offset (−1 to +1 step)
            </label>
            <input
              type="range"
              min={-1}
              max={1}
              step={0.01}
              value={fractionVal}
              onChange={(e) => set('fraction', e.target.value)}
              className="w-full accent-blue-500"
              aria-label="Step fraction offset"
            />
            <div className="flex justify-between text-xs text-zinc-600">
              <span>Early −1</span>
              <span>0</span>
              <span>Late +1</span>
            </div>
            <NumberField id="mt-fraction" label="Fraction value" value={state.fraction}
              onChange={(v) => set('fraction', v)} min={-1} max={1} step={0.01}
              error={errors.fraction} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <NumberField id="mt-ticks" label="Offset ticks" value={state.ticks}
              onChange={(v) => set('ticks', v)} step={1} error={errors.ticks} />
            <NumberField id="mt-tps" label="Ticks / step" value={state.ticksPerStep}
              onChange={(v) => set('ticksPerStep', v)} min={1} step={1} error={errors.ticksPerStep} />
          </div>
        )}

        {result && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="exact" />
              <span
                aria-live="polite"
                className={`text-sm font-semibold mono ${
                  result.direction === 'late' ? 'text-amber-400' :
                  result.direction === 'early' ? 'text-cyan-400' : 'text-zinc-300'
                }`}
              >
                {result.label}
              </span>
            </div>
            <ResultCard accent="blue">
              <ResultRow label="Milliseconds" value={`${result.offsetMs >= 0 ? '+' : ''}${formatMs(result.offsetMs)} ms`} />
              <ResultRow label="Seconds" value={`${result.offsetSeconds >= 0 ? '+' : ''}${result.offsetSeconds.toFixed(4)} s`} />
              <ResultRow label="Beats" value={`${result.offsetBeats >= 0 ? '+' : ''}${result.offsetBeats.toFixed(4)}`} />
              <ResultRow label="Bars" value={`${result.offsetBars >= 0 ? '+' : ''}${result.offsetBars.toFixed(5)}`} />
              <ResultRow label="Step fraction" value={`${result.offsetStepFraction >= 0 ? '+' : ''}${result.offsetStepFraction.toFixed(4)}`} />
            </ResultCard>
          </div>
        )}

        <FormulaBlock>
{`stepSeconds = 15 / BPM

Fraction mode:
  offsetSeconds = fraction × stepSeconds

Ticks mode:
  fraction = offsetTicks / ticksPerStep
  offsetSeconds = fraction × stepSeconds

offsetMs = offsetSeconds × 1000
offsetBeats = offsetSeconds / (60 / BPM)
offsetBars = offsetSeconds / (240 / BPM)`}
        </FormulaBlock>
      </div>
    </ToolCard>
  )
}
