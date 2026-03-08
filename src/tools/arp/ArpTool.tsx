import { useState, useEffect } from 'react'
import { ToolCard } from '../../components/ToolCard'
import { NumberField } from '../../components/NumberField'
import { SelectField } from '../../components/SelectField'
import { ResultCard, ResultRow } from '../../components/ResultCard'
import { FormulaBlock } from '../../components/FormulaBlock'
import { Badge } from '../../components/Badge'
import { SegmentedControl } from '../../components/SegmentedControl'
import { calculateArpTiming } from './arpCalc'
import type { ArpDirection, ArpResult } from './arpCalc'
import { validateBpm, validatePositive } from '../../lib/validation'
import { formatMs, formatSeconds, formatBars } from '../../lib/format'
import { NOTE_VALUES } from '../../data/noteValues'
import { storageGet, storageSet } from '../../lib/storage'

interface State {
  bpm: string
  rateId: string
  heldNotes: string
  rangeOctaves: string
  direction: ArpDirection
  noteLengthPercent: string
  manualOverride: string
  useManual: boolean
}

const DEFAULT: State = {
  bpm: '120', rateId: '1_16', heldNotes: '3', rangeOctaves: '1',
  direction: 'up', noteLengthPercent: '50', manualOverride: '', useManual: false,
}

const ARP_DIRECTIONS: ArpDirection[] = ['up', 'down', 'up/down', 'assign', 'random']
const NOTE_OPTIONS = NOTE_VALUES.map((n) => ({ value: n.id, label: n.label }))

export function ArpTool() {
  const [state, setState] = useState<State>(() => storageGet('arp', DEFAULT))
  const [result, setResult] = useState<ArpResult | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof State, string>>>({})

  useEffect(() => {
    storageSet('arp', state)
    calculate()
  }, [state])

  function set(field: keyof State, val: string | boolean) {
    setState((s) => ({ ...s, [field]: val }))
  }

  function calculate() {
    const bpmV = validateBpm(state.bpm)
    const notesV = validatePositive(state.heldNotes, 'Notes')
    const octV = validatePositive(state.rangeOctaves, 'Octaves')
    const nlV = validatePositive(state.noteLengthPercent, 'Note length')
    const errs: typeof errors = {}
    if (!bpmV.valid) errs.bpm = bpmV.error
    if (!notesV.valid) errs.heldNotes = notesV.error
    if (!octV.valid) errs.rangeOctaves = octV.error

    setErrors(errs)

    const rateNV = NOTE_VALUES.find((n) => n.id === state.rateId)
    if (!rateNV) return

    let manualEventsPerCycle: number | undefined
    if (state.useManual && state.manualOverride !== '') {
      const mv = parseFloat(state.manualOverride)
      if (!isNaN(mv) && mv > 0) manualEventsPerCycle = mv
    }

    if (bpmV.valid && notesV.valid && octV.valid) {
      try {
        setResult(calculateArpTiming({
          bpm: bpmV.value,
          rateWhole: rateNV.whole,
          heldNotes: Math.round(notesV.value),
          rangeOctaves: Math.round(octV.value),
          direction: state.direction,
          noteLengthPercent: nlV.valid ? nlV.value : 50,
          manualEventsPerCycle,
        }))
      } catch {
        setResult(null)
      }
    } else {
      setResult(null)
    }
  }

  return (
    <ToolCard id="arp" title="Arpeggiator Timing" accent="blue">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="estimated" />
          <span className="text-xs text-zinc-500">Practical estimate, not a bit-perfect arp emulator</span>
        </div>

        <NumberField id="arp-bpm" label="BPM" value={state.bpm}
          onChange={(v) => set('bpm', v)} min={1} max={999} error={errors.bpm} />
        <SelectField id="arp-rate" label="Arp rate" value={state.rateId}
          onChange={(v) => set('rateId', v)} options={NOTE_OPTIONS} />

        <div className="grid grid-cols-2 gap-3">
          <NumberField id="arp-notes" label="Held notes" value={state.heldNotes}
            onChange={(v) => set('heldNotes', v)} min={1} max={16} step={1} error={errors.heldNotes} />
          <NumberField id="arp-octaves" label="Range octaves" value={state.rangeOctaves}
            onChange={(v) => set('rangeOctaves', v)} min={1} max={8} step={1} error={errors.rangeOctaves} />
        </div>

        <SegmentedControl
          id="arp-dir"
          label="Direction"
          options={ARP_DIRECTIONS.map((d) => ({ value: d, label: d }))}
          value={state.direction}
          onChange={(v) => set('direction', v as ArpDirection)}
          accent="blue"
        />
        {state.direction === 'random' && (
          <p className="text-xs text-amber-400">
            Random mode has no fixed cycle without manual override.
          </p>
        )}

        <NumberField id="arp-nl" label="Note length %" value={state.noteLengthPercent}
          onChange={(v) => set('noteLengthPercent', v)} min={0} max={100} step={5} />

        <div className="flex items-center gap-2">
          <input
            id="arp-manual-toggle"
            type="checkbox"
            checked={state.useManual}
            onChange={(e) => set('useManual', e.target.checked)}
            className="accent-blue-500"
          />
          <label htmlFor="arp-manual-toggle" className="text-xs text-zinc-400">
            Manual events/cycle override
          </label>
        </div>
        {state.useManual && (
          <NumberField id="arp-manual" label="Events per cycle" value={state.manualOverride}
            onChange={(v) => set('manualOverride', v)} min={1} step={1} />
        )}

        {result && (
          <div className="space-y-2">
            <Badge variant="estimated" />
            {result.isRandom && (
              <p role="alert" className="text-amber-400 text-xs">
                Random mode: no fixed cycle. Use manual override to estimate.
              </p>
            )}
            <ResultCard accent="blue">
              <ResultRow label="Base events" value={String(result.baseEvents)} />
              <ResultRow label="Events/cycle" value={result.eventsPerCycle !== null ? String(result.eventsPerCycle) : '—'} />
              {result.cycleBars !== null && (
                <ResultRow label="Cycle (bars)" value={formatBars(result.cycleBars)} />
              )}
              {result.cycleSeconds !== null && (
                <ResultRow label="Cycle (sec)" value={`${formatSeconds(result.cycleSeconds)} s`} />
              )}
              <ResultRow label="Note spacing" value={`${formatMs(result.singleStepDurationMs)} ms`} />
              <ResultRow label="Effective note" value={`${formatMs(result.effectiveNoteDurationMs)} ms`} />
            </ResultCard>
          </div>
        )}

        <FormulaBlock>
{`baseEvents = heldNotes × max(rangeOctaves, 1)

eventsPerCycle:
  up / down / assign: baseEvents
  up/down: (baseEvents × 2) - 2 (min 1)
  random: undefined without override

cycleSeconds = eventsPerCycle × rateWhole × (240 / BPM)
noteSpacing = rateWhole × (240000 / BPM) ms`}
        </FormulaBlock>
      </div>
    </ToolCard>
  )
}
