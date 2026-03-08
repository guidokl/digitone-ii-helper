

export function AboutSection() {
  return (
    <section className="space-y-4 text-sm text-zinc-300 leading-relaxed">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <h2 className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
          What this is
        </h2>
        <p>
          Digitone II Tools is a mobile-first calculator and reference site for Elektron Digitone II users.
          It reduces recurring mental math while programming sequences, patches, and FM sounds.
        </p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <h2 className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Tools included
        </h2>
        <ul className="space-y-1 text-zinc-400 text-xs mono">
          <li><span className="text-blue-300">Timing</span></li>
          <li className="ml-3">· LFO Calculator — synced speed/mult to time/note values</li>
          <li className="ml-3">· Pattern / Loop Calculator — per-track duration + LCM full repeat</li>
          <li className="ml-3">· Microtiming Converter — step fraction or microtick to ms</li>
          <li className="ml-3">· Retrig Calculator — hit count, spacing, timeline view</li>
          <li className="ml-3">· Arpeggiator Timing — phrase duration estimator</li>
          <li className="mt-2"><span className="text-pink-300">FM</span></li>
          <li className="ml-3">· Ratio Helper — fc/fm, ratio classification heuristics</li>
          <li className="ml-3">· Sideband Preview — first N upper/lower sideband frequencies</li>
          <li className="ml-3">· Modulation Index — brightness/complexity guide</li>
          <li className="ml-3">· Envelope Interaction Sketch — amp + mod envelope visualization</li>
          <li className="mt-2"><span className="text-cyan-300">Filter</span></li>
          <li className="ml-3">· Filter Frequency Calculator — parameter to Hz with reverse lookup</li>
        </ul>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <h2 className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
          Approximation notes
        </h2>
        <ul className="space-y-2 text-zinc-400 text-xs">
          <li>
            <span className="text-amber-300 font-medium">Filter:</span>{' '}
            Frequencies are interpolated from known anchor points using log-space interpolation.
            Results outside the calibrated range (param 20–120) are extrapolated and marked approximate.
          </li>
          <li>
            <span className="text-amber-300 font-medium">Arpeggiator:</span>{' '}
            Phrase duration is estimated from rate, note count, range, and direction mode.
            This is not a full internal Digitone II emulator. Use the manual override for precise control.
          </li>
          <li>
            <span className="text-amber-300 font-medium">FM Ratio / Mod Index:</span>{' '}
            Classifications and brightness descriptions are heuristics based on general FM synthesis
            theory. They are not exact mappings to Digitone II internal parameters.
          </li>
          <li>
            <span className="text-amber-300 font-medium">Envelope Sketch:</span>{' '}
            A conceptual visualization of ADSR curve interaction. Not a waveform model.
          </li>
          <li>
            <span className="text-amber-300 font-medium">LFO, Pattern, Microtiming, Retrig:</span>{' '}
            Results are mathematically exact for the given formulas.
          </li>
        </ul>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <h2 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3">
          What this deliberately does not do
        </h2>
        <ul className="text-zinc-500 text-xs space-y-1">
          <li>· No MIDI generation or export</li>
          <li>· No external hardware connection</li>
          <li>· No audio synthesis or WebAudio</li>
          <li>· No account or cloud sync</li>
          <li>· No server-side code</li>
          <li>· No Euclidean visualizer (planned future tool)</li>
          <li>· No Scale/Chord visualizer (planned future tool)</li>
        </ul>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-600">
        <p>
          Formulas are designed to reduce mental math during Digitone II use, not to replace the manual.
          Anchor calibration data for the filter calculator comes from a reference screenshot of the Digitone II parameter mapping.
        </p>
        <p className="mt-2">
          Stack: Vite · React · TypeScript · Tailwind CSS. No backend.
        </p>
      </div>
    </section>
  )
}
