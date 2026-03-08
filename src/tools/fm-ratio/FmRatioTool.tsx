import { useState, useEffect } from 'react'
import { ToolCard } from '../../components/ToolCard'
import { NumberField } from '../../components/NumberField'
import { ResultCard, ResultRow } from '../../components/ResultCard'
import { FormulaBlock } from '../../components/FormulaBlock'
import { Badge } from '../../components/Badge'
import { SegmentedControl } from '../../components/SegmentedControl'
import { ChipGroup } from '../../components/ChipGroup'
import { calculateFmRatio } from './fmRatioCalc'
import type { FmRatioResult } from './fmRatioCalc'
import { validatePositive } from '../../lib/validation'
import { formatHz } from '../../lib/format'
import { noteNameToMidi, midiToFreq } from '../../lib/music'
import { RATIO_PRESETS } from '../../data/ratioPresets'
import { storageGet, storageSet } from '../../lib/storage'

type InputMode = 'freq' | 'note'

interface State {
  mode: InputMode
  fundamental: string
  noteName: string
  a4: string
  carrierRatio: string
  modulatorRatio: string
}

const DEFAULT: State = {
  mode: 'freq', fundamental: '440', noteName: 'A4', a4: '440',
  carrierRatio: '1', modulatorRatio: '2',
}

const RATIO_CHIPS = RATIO_PRESETS.map(String)

export function FmRatioTool() {
  const [state, setState] = useState<State>(() => storageGet('fm-ratio', DEFAULT))
  const [result, setResult] = useState<FmRatioResult | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof State, string>>>({})

  useEffect(() => {
    storageSet('fm-ratio', state)
    calculate()
  }, [state])

  function set(field: keyof State, val: string) {
    setState((s) => ({ ...s, [field]: val }))
  }

  function calculate() {
    const a4V = validatePositive(state.a4, 'A4')
    const crV = validatePositive(state.carrierRatio, 'Carrier ratio')
    const mrV = validatePositive(state.modulatorRatio, 'Mod ratio')
    const errs: typeof errors = {}

    let fundamental = 440
    if (state.mode === 'freq') {
      const fV = validatePositive(state.fundamental, 'Frequency')
      if (!fV.valid) errs.fundamental = fV.error
      else fundamental = fV.value
    } else {
      try {
        const a4 = a4V.valid ? a4V.value : 440
        const midi = noteNameToMidi(state.noteName)
        fundamental = midiToFreq(midi, a4)
      } catch {
        errs.noteName = 'Invalid note name (e.g. A4, C#3)'
      }
    }

    if (!crV.valid) errs.carrierRatio = crV.error
    if (!mrV.valid) errs.modulatorRatio = mrV.error
    setErrors(errs)

    if (Object.keys(errs).length === 0 && crV.valid && mrV.valid) {
      try {
        setResult(calculateFmRatio({ fundamental, carrierRatio: crV.value, modulatorRatio: mrV.value }))
      } catch {
        setResult(null)
      }
    } else {
      setResult(null)
    }
  }

  return (
    <ToolCard id="fm-ratio" title="FM Ratio Helper" accent="magenta">
      <div className="space-y-4">
        <SegmentedControl
          id="fmr-mode"
          label="Fundamental input"
          options={[
            { value: 'freq', label: 'Hz' },
            { value: 'note', label: 'Note name' },
          ]}
          value={state.mode}
          onChange={(v) => set('mode', v as InputMode)}
          accent="magenta"
        />

        {state.mode === 'freq' ? (
          <NumberField id="fmr-freq" label="Fundamental (Hz)" value={state.fundamental}
            onChange={(v) => set('fundamental', v)} min={1} step={1} error={errors.fundamental} />
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <label htmlFor="fmr-note" className="text-xs text-zinc-400 font-medium uppercase tracking-wide block mb-1">
                  Note name
                </label>
                <input
                  id="fmr-note"
                  value={state.noteName}
                  onChange={(e) => set('noteName', e.target.value)}
                  placeholder="A4"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm mono text-zinc-100 focus:outline-none focus:border-zinc-500 min-h-[44px]"
                />
                {errors.noteName && <p className="text-red-400 text-xs mt-1">{errors.noteName}</p>}
              </div>
              <NumberField id="fmr-a4" label="A4 (Hz)" value={state.a4}
                onChange={(v) => set('a4', v)} min={400} max={480} step={1} className="w-28" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <NumberField id="fmr-cr" label="Carrier ratio" value={state.carrierRatio}
              onChange={(v) => set('carrierRatio', v)} min={0.001} step={0.25} error={errors.carrierRatio} />
            <div className="mt-2">
              <ChipGroup values={RATIO_CHIPS} active={state.carrierRatio}
                onSelect={(v) => set('carrierRatio', v)} accent="magenta" />
            </div>
          </div>
          <div>
            <NumberField id="fmr-mr" label="Modulator ratio" value={state.modulatorRatio}
              onChange={(v) => set('modulatorRatio', v)} min={0.001} step={0.25} error={errors.modulatorRatio} />
            <div className="mt-2">
              <ChipGroup values={RATIO_CHIPS} active={state.modulatorRatio}
                onSelect={(v) => set('modulatorRatio', v)} accent="magenta" />
            </div>
          </div>
        </div>

        {result && (
          <div className="space-y-2">
            <Badge variant="heuristic" />
            <ResultCard accent="magenta">
              <ResultRow label="Carrier (fc)" value={`${formatHz(result.fc)} Hz`} />
              <ResultRow label="Modulator (fm)" value={`${formatHz(result.fm)} Hz`} />
              <ResultRow label="Ratio (C:M)" value={result.simplifiedRatio} />
              <ResultRow label="Octave diff" value={result.octaveDiff.toFixed(2)} />
            </ResultCard>
            <div className="bg-pink-900/20 border border-pink-800/40 rounded-lg p-3 space-y-1">
              <div className="text-xs text-pink-300 font-medium">{result.classificationLabel}</div>
              <div className="text-xs text-zinc-400">{result.heuristicNote}</div>
              <p className="text-xs text-zinc-600">These are heuristics, not exact rules.</p>
            </div>
          </div>
        )}

        <FormulaBlock>
{`fc = fundamental × carrierRatio
fm = fundamental × modulatorRatio
ratioRelation = modulatorRatio / carrierRatio
octaveDiff = log2(modulatorRatio / carrierRatio)

Classification heuristics:
  Both integers → harmonic alignment
  Quarter/half-based → subharmonic relation
  Otherwise → inharmonic relation`}
        </FormulaBlock>
      </div>
    </ToolCard>
  )
}
