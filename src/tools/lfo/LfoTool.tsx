import { useState, useEffect } from 'react'
import { ToolCard } from '../../components/ToolCard'
import { NumberField } from '../../components/NumberField'
import { ResultCard, ResultRow } from '../../components/ResultCard'
import { FormulaBlock } from '../../components/FormulaBlock'
import { Badge } from '../../components/Badge'
import { ChipGroup } from '../../components/ChipGroup'
import { calculateLfoSync } from './lfoCalc'
import type { LfoResult } from './lfoCalc'
import { validateBpm, validatePositive } from '../../lib/validation'
import { formatBars, formatMs, formatSeconds } from '../../lib/format'
import { storageGet, storageSet } from '../../lib/storage'

const SPEED_MULT_CHIPS = [2, 4, 8, 12, 16, 24, 32, 48, 64]
const BPM_CHIPS = [70, 80, 90, 100, 110, 120, 140]

interface State {
  bpm: string
  speed: string
  mult: string
  ppqn: string
}

const DEFAULT: State = { bpm: '120', speed: '8', mult: '1', ppqn: '96' }

export function LfoTool() {
  const [state, setState] = useState<State>(() => storageGet('lfo', DEFAULT))
  const [result, setResult] = useState<LfoResult | null>(null)
  const [errors, setErrors] = useState<Partial<State>>({})

  useEffect(() => {
    storageSet('lfo', state)
    calculate()
  }, [state])

  function set(field: keyof State, val: string) {
    setState((s) => ({ ...s, [field]: val }))
  }

  function calculate() {
    const bpmV = validateBpm(state.bpm)
    const speedV = validatePositive(state.speed, 'SPEED')
    const multV = validatePositive(state.mult, 'MULT')
    const ppqnV = validatePositive(state.ppqn, 'PPQN')

    const errs: Partial<State> = {}
    if (!bpmV.valid) errs.bpm = bpmV.error
    if (!speedV.valid) errs.speed = speedV.error
    if (!multV.valid) errs.mult = multV.error
    if (!ppqnV.valid) errs.ppqn = ppqnV.error

    setErrors(errs)

    if (bpmV.valid && speedV.valid && multV.valid && ppqnV.valid) {
      try {
        setResult(calculateLfoSync({
          bpm: bpmV.value,
          speed: speedV.value,
          mult: multV.value,
          ppqn: ppqnV.value,
        }))
      } catch {
        setResult(null)
      }
    } else {
      setResult(null)
    }
  }

  return (
    <ToolCard id="lfo" title="LFO Calculator" accent="blue">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <NumberField id="lfo-bpm" label="BPM" value={state.bpm} onChange={(v) => set('bpm', v)}
            min={1} max={999} error={errors.bpm} />
          <NumberField id="lfo-ppqn" label="PPQN" value={state.ppqn} onChange={(v) => set('ppqn', v)}
            min={1} step={24} error={errors.ppqn} />
        </div>
        <div className="mt-2">
          <ChipGroup label="BPM presets" values={BPM_CHIPS} active={state.bpm}
            onSelect={(v) => set('bpm', v)} accent="blue" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <NumberField id="lfo-speed" label="SPEED" value={state.speed} onChange={(v) => set('speed', v)}
              min={0.001} step={1} error={errors.speed} />
            <div className="mt-2">
              <ChipGroup values={SPEED_MULT_CHIPS} active={state.speed}
                onSelect={(v) => set('speed', v)} accent="blue" />
            </div>
          </div>
          <div>
            <NumberField id="lfo-mult" label="MULT" value={state.mult} onChange={(v) => set('mult', v)}
              min={0.001} step={1} error={errors.mult} />
            <div className="mt-2">
              <ChipGroup values={SPEED_MULT_CHIPS} active={state.mult}
                onSelect={(v) => set('mult', v)} accent="blue" />
            </div>
          </div>
        </div>

        {result && (
          <div className="space-y-2">
            <Badge variant="exact" />
            <ResultCard title="Musical" accent="blue">
              <ResultRow label="Note length" value={result.noteLengthLabel} />
              <ResultRow label="Decimal" value={`${result.decimalWholeNotes} whole notes`} />
              <ResultRow label="Bars" value={formatBars(result.barsPerCycle)} />
              <ResultRow label="Beats" value={formatBars(result.beatsPerCycle)} />
              <ResultRow label="16th steps" value={formatBars(result.steps16PerCycle)} />
            </ResultCard>
            <ResultCard title="Time" accent="blue">
              <ResultRow label="Seconds" value={`${formatSeconds(result.secondsPerCycle)} s`} />
              <ResultRow label="Milliseconds" value={`${formatMs(result.millisecondsPerCycle)} ms`} />
            </ResultCard>
            <ResultCard title="Grid" accent="blue">
              <ResultRow label="PPQN ticks" value={formatBars(result.ticksPerCycle)} />
              <ResultRow label="Product (speed × mult)" value={String(result.product)} />
            </ResultCard>
          </div>
        )}

        <FormulaBlock>
{`product = speed × mult
wholeNotesPerCycle = 128 / product

barsPerCycle = wholeNotesPerCycle
beatsPerCycle = wholeNotesPerCycle × 4
steps16 = wholeNotesPerCycle × 16
seconds = wholeNotesPerCycle × (240 / BPM)
ticks = wholeNotesPerCycle × 4 × PPQN`}
        </FormulaBlock>
      </div>
    </ToolCard>
  )
}
