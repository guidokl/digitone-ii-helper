export function AboutSection() {
  return (
    <section className="space-y-4 text-sm text-zinc-300 leading-relaxed">

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <h2 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3">Contents</h2>
        <ul className="space-y-1 text-zinc-400 text-xs mono">
          <li><span className="text-blue-300">CLK</span> — Clock &amp; timing</li>
          <li className="ml-3">· LFO sync — speed/mult to note values, ms, PPQN ticks</li>
          <li className="ml-3">· Pattern / Loop — per-track length + LCM full repeat</li>
          <li className="ml-3">· Microtiming — step fraction or microtick to ms</li>
          <li className="ml-3">· Retrig — hit count, spacing, timeline view</li>
          <li className="ml-3">· Arpeggiator — phrase duration estimator</li>
          <li className="mt-2"><span className="text-pink-300">FM</span> — FM synthesis calculators</li>
          <li className="ml-3">· Ratio helper — fc/fm in Hz, ratio classification</li>
          <li className="ml-3">· Sideband preview — upper/lower sideband frequencies</li>
          <li className="ml-3">· Modulation index — brightness/complexity guide</li>
          <li className="ml-3">· Envelope sketch — amp + mod ADSR interaction</li>
          <li className="mt-2"><span className="text-violet-300">FM+</span> — FM synthesis reference</li>
          <li className="ml-3">· Foundations, techniques, recipes, common mistakes, rules</li>
          <li className="mt-2"><span className="text-yellow-300">VAR</span> — Various data tables</li>
          <li className="ml-3">· Filter frequency calibration anchors (param → Hz)</li>
          <li className="mt-2"><span className="text-[#498f9d]">HKY</span> — Hardware shortcuts reference</li>
          <li className="mt-2"><span className="text-orange-300">WFL</span> — Practical workflows &amp; techniques</li>
        </ul>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <h2 className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">Approximations</h2>
        <ul className="space-y-2 text-zinc-400 text-xs">
          <li>
            <span className="text-amber-300 font-medium">Arpeggiator:</span>{' '}
            Phrase duration is estimated from rate, note count, range, and direction. Not a bit-perfect emulator.
          </li>
          <li>
            <span className="text-amber-300 font-medium">FM Ratio / Mod Index:</span>{' '}
            Classifications are heuristics based on general FM theory, not exact Digitone II parameter mappings.
          </li>
          <li>
            <span className="text-amber-300 font-medium">Envelope Sketch:</span>{' '}
            Conceptual ADSR visualization. Not a waveform model.
          </li>
          <li>
            <span className="text-amber-300 font-medium">LFO, Pattern, Microtiming, Retrig:</span>{' '}
            Mathematically exact for the given formulas.
          </li>
        </ul>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-600">
        <p>No MIDI, no audio, no backend, no account.</p>
        <p className="mt-1">Stack: Vite · React · TypeScript · Tailwind CSS v4 · marked.js (CDN).</p>
        <p className="mt-3 pt-3 border-t border-zinc-800">
          <a
            href="https://github.com/guidokl/digitone-ii-helper/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            github.com/guidokl/digitone-ii-helper
          </a>
        </p>
        <p className="mt-2 text-zinc-700">
          Personal project by Guido Kleine. Provided as-is, without warranty of any kind.
          Not affiliated with Elektron Music Machines.
        </p>
      </div>

    </section>
  )
}
