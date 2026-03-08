import { useState, useEffect } from 'react'
import { ToolCard } from '../../components/ToolCard'
import { NumberField } from '../../components/NumberField'
import { FormulaBlock } from '../../components/FormulaBlock'
import { Badge } from '../../components/Badge'
import { ChipGroup } from '../../components/ChipGroup'
import { calculateSidebands } from './sidebandCalc'
import type { SidebandResult } from './sidebandCalc'
import { validatePositive } from '../../lib/validation'
import { formatHz, formatCents } from '../../lib/format'
import { RATIO_PRESETS } from '../../data/ratioPresets'
import { storageGet, storageSet } from '../../lib/storage'

const SIDEBAND_COUNT_CHIPS = [4, 8, 12, 16]
const RATIO_CHIPS = RATIO_PRESETS.map(String)

interface State {
  fundamental: string
  carrierRatio: string
  modulatorRatio: string
  sidebandCount: string
  hideNegative: boolean
  showNotes: boolean
  sortFlat: boolean
}

const DEFAULT: State = {
  fundamental: '440', carrierRatio: '1', modulatorRatio: '2',
  sidebandCount: '8', hideNegative: true, showNotes: false, sortFlat: false,
}

export function SidebandTool() {
  const [state, setState] = useState<State>(() => storageGet('fm-sidebands', DEFAULT))
  const [result, setResult] = useState<SidebandResult | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof State, string>>>({})

  useEffect(() => {
    storageSet('fm-sidebands', state)
    calculate()
  }, [state])

  function set<K extends keyof State>(field: K, val: State[K]) {
    setState((s) => ({ ...s, [field]: val }))
  }

  function calculate() {
    const fV = validatePositive(state.fundamental, 'Fundamental')
    const crV = validatePositive(state.carrierRatio, 'Carrier')
    const mrV = validatePositive(state.modulatorRatio, 'Modulator')
    const scV = validatePositive(state.sidebandCount, 'Count')
    const errs: typeof errors = {}
    if (!fV.valid) errs.fundamental = fV.error
    if (!crV.valid) errs.carrierRatio = crV.error
    if (!mrV.valid) errs.modulatorRatio = mrV.error
    setErrors(errs)

    if (fV.valid && crV.valid && mrV.valid && scV.valid) {
      try {
        setResult(calculateSidebands({
          fundamental: fV.value,
          carrierRatio: crV.value,
          modulatorRatio: mrV.value,
          sidebandCount: Math.round(scV.value),
          hideNegative: state.hideNegative,
          showNoteNames: state.showNotes,
        }))
      } catch {
        setResult(null)
      }
    } else {
      setResult(null)
    }
  }

  const rows = result?.rows ?? []
  const displayRows = state.sortFlat
    ? [...rows].flatMap((r) => [
        { hz: r.upper, side: 'upper', order: r.order, note: r.upperNote },
        ...(r.lower >= 0 ? [{ hz: r.lower, side: 'lower', order: r.order, note: r.lowerNote }] : []),
      ]).sort((a, b) => a.hz - b.hz)
    : null

  return (
    <ToolCard id="fm-sidebands" title="FM Sideband Preview" accent="magenta">
      <div className="space-y-4">
        <Badge variant="exact" label="Exact (spectral preview only)" />

        <div className="grid grid-cols-2 gap-3">
          <NumberField id="sb-fund" label="Fundamental (Hz)" value={state.fundamental}
            onChange={(v) => set('fundamental', v)} min={1} step={1} error={errors.fundamental} />
          <div className="mt-2">
            <ChipGroup label="Sideband count" values={SIDEBAND_COUNT_CHIPS} active={state.sidebandCount}
              onSelect={(v) => set('sidebandCount', v)} accent="magenta" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <NumberField id="sb-cr" label="Carrier ratio" value={state.carrierRatio}
              onChange={(v) => set('carrierRatio', v)} min={0.001} step={0.25} error={errors.carrierRatio} />
            <div className="mt-2">
              <ChipGroup values={RATIO_CHIPS} active={state.carrierRatio}
                onSelect={(v) => set('carrierRatio', v)} accent="magenta" />
            </div>
          </div>
          <div>
            <NumberField id="sb-mr" label="Modulator ratio" value={state.modulatorRatio}
              onChange={(v) => set('modulatorRatio', v)} min={0.001} step={0.25} error={errors.modulatorRatio} />
            <div className="mt-2">
              <ChipGroup values={RATIO_CHIPS} active={state.modulatorRatio}
                onSelect={(v) => set('modulatorRatio', v)} accent="magenta" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-xs">
          <label className="flex items-center gap-1.5 text-zinc-400">
            <input type="checkbox" checked={state.hideNegative}
              onChange={(e) => set('hideNegative', e.target.checked)}
              className="accent-pink-500" />
            Hide negative freq
          </label>
          <label className="flex items-center gap-1.5 text-zinc-400">
            <input type="checkbox" checked={state.showNotes}
              onChange={(e) => set('showNotes', e.target.checked)}
              className="accent-pink-500" />
            Show nearest note
          </label>
          <label className="flex items-center gap-1.5 text-zinc-400">
            <input type="checkbox" checked={state.sortFlat}
              onChange={(e) => set('sortFlat', e.target.checked)}
              className="accent-pink-500" />
            Sort by frequency
          </label>
        </div>

        {result && (
          <div className="space-y-2">
            {result.warnings.map((w, i) => (
              <p key={i} className="text-amber-400 text-xs">{w}</p>
            ))}
            <div className="overflow-x-auto">
              <table className="w-full text-xs mono" aria-label="Sideband frequencies">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800">
                    {state.sortFlat ? (
                      <>
                        <th className="text-left py-1">Hz</th>
                        <th className="text-left py-1">Side</th>
                        <th className="text-left py-1">n</th>
                        {state.showNotes && <th className="text-left py-1">Note</th>}
                      </>
                    ) : (
                      <>
                        <th className="text-left py-1">n</th>
                        <th className="text-left py-1">Lower Hz</th>
                        <th className="text-left py-1">Upper Hz</th>
                        {state.showNotes && <>
                          <th className="text-left py-1">L-note</th>
                          <th className="text-left py-1">U-note</th>
                        </>}
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {state.sortFlat && displayRows
                    ? displayRows.map((r, i) => (
                        <tr key={i} className="border-b border-zinc-900 text-zinc-300">
                          <td className="py-1 text-pink-300">{formatHz(r.hz)}</td>
                          <td className="py-1 text-zinc-500">{r.side}</td>
                          <td className="py-1 text-zinc-500">{r.order}</td>
                          {state.showNotes && (
                            <td className="py-1">
                              {r.note ? `${r.note.note} ${formatCents(r.note.cents)}¢` : '—'}
                            </td>
                          )}
                        </tr>
                      ))
                    : rows.map((r) => (
                        <tr key={r.order} className="border-b border-zinc-900 text-zinc-300">
                          <td className="py-1 text-zinc-500">{r.order}</td>
                          <td className="py-1">{r.lower >= 0 ? formatHz(r.lower) : '—'}</td>
                          <td className="py-1 text-pink-300">{formatHz(r.upper)}</td>
                          {state.showNotes && (
                            <>
                              <td className="py-1 text-zinc-500">
                                {r.lowerNote ? `${r.lowerNote.note} ${formatCents(r.lowerNote.cents)}¢` : '—'}
                              </td>
                              <td className="py-1 text-zinc-500">
                                {r.upperNote ? `${r.upperNote.note} ${formatCents(r.upperNote.cents)}¢` : '—'}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-zinc-600">Spectral preview only. No amplitude modeling in v1.</p>
          </div>
        )}

        <FormulaBlock>
{`fc = fundamental × carrierRatio
fm = fundamental × modulatorRatio

For n = 1..N:
  upper_n = fc + n × fm
  lower_n = |fc − n × fm|

Only positive frequencies shown when hide-negative is on.`}
        </FormulaBlock>
      </div>
    </ToolCard>
  )
}
