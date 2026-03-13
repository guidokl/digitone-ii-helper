import { ToolCard } from '../../components/ToolCard'
import { FILTER_ANCHORS } from '../../data/filterAnchors'

function fmtHz(hz: number): string {
  return hz >= 1000 ? `${(hz / 1000).toFixed(1)} kHz` : `${hz} Hz`
}

export function FilterSection() {
  return (
    <div className="space-y-4">
      <ToolCard id="filter-anchors" title="Filter Frequency Anchors" accent="amber">
        <p className="text-xs text-zinc-500 mb-3">
          Calibration points mapping the FREQ parameter to approximate cutoff frequency.
        </p>
        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full text-xs mono">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left px-3 py-2 text-zinc-500 font-semibold uppercase tracking-wider">Param</th>
                <th className="text-right px-3 py-2 text-zinc-500 font-semibold uppercase tracking-wider">Frequency</th>
              </tr>
            </thead>
            <tbody>
              {FILTER_ANCHORS.map((a, i) => (
                <tr key={a.param} className={i % 2 === 0 ? 'bg-zinc-900/40' : ''}>
                  <td className="px-3 py-2 text-zinc-300">{a.param}</td>
                  <td className="px-3 py-2 text-amber-300 text-right">{fmtHz(a.hz)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ToolCard>
    </div>
  )
}
