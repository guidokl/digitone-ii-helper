export function FmPlusSection() {
  return (
    <div className="space-y-4">
      <IntroCard />
      <CoreApproachCard />
      <RatioMapCard />
      <IndexBehaviourCard />
      <EnvelopeMovesCard />
      <DigitoneTipsCard />
      <CommonMistakesCard />
      <QuickRecipesCard />
      <BasicRulesCard />
    </div>
  )
}

/* ─── Shared card shell ────────────────────────────────────────────── */

interface CardProps {
  title: string
  children: React.ReactNode
}

function Card({ title, children }: CardProps) {
  return (
    <div className="bg-zinc-900 border border-violet-900/40 rounded-xl p-4 space-y-3">
      <h2 className="text-sm font-bold text-violet-300 tracking-wide uppercase">{title}</h2>
      {children}
    </div>
  )
}

interface TableProps {
  headers: string[]
  rows: string[][]
}

function InfoTable({ headers, rows }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-zinc-800">
            {headers.map((h) => (
              <th key={h} className="text-left py-1.5 pr-3 text-zinc-500 font-semibold uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-zinc-800/60">
              {row.map((cell, j) => (
                <td key={j} className={`py-1.5 pr-3 align-top ${j === 0 ? 'text-violet-300 font-medium mono whitespace-nowrap' : 'text-zinc-400'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface TipProps {
  label: string
  children: React.ReactNode
}

function Tip({ label, children }: TipProps) {
  return (
    <div className="flex gap-2 text-xs">
      <span className="text-violet-400 font-bold mono shrink-0">{label}</span>
      <span className="text-zinc-400">{children}</span>
    </div>
  )
}

/* ─── Intro ─────────────────────────────────────────────────────────── */

function IntroCard() {
  return (
    <Card title="FM synthesis on Digitone II">
      <p className="text-xs text-zinc-400">
        FM synthesis generates timbre by having one oscillator (the modulator) vary the frequency of another (the carrier). The result is a cluster of sidebands whose positions and amplitudes depend on the ratio between the two frequencies and the depth of the modulation. Small parameter changes produce large timbral shifts, which makes FM extremely powerful and occasionally unpredictable until you understand the underlying relationships.
      </p>
    </Card>
  )
}

/* ─── Core Approach ─────────────────────────────────────────────────── */

function CoreApproachCard() {
  const points = [
    'Set the carrier ratio first — it determines the fundamental pitch relationship.',
    'Choose the modulator ratio for the harmonic family you want (integer = harmonic, fractional = inharmonic).',
    'Start the modulation index at zero and raise it gradually until you hear the character you need.',
    'Add an envelope to the modulator index to create brightness that changes over time.',
    'Use the amp envelope for loudness shape and the mod envelope for spectral shape independently.',
    'Fine-tune with LFOs on the index for movement, or on pitch for vibrato and subtle instability.',
  ]
  return (
    <Card title="Core approach">
      <ul className="space-y-1">
        {points.map((p, i) => (
          <li key={i} className="text-xs text-zinc-400 flex gap-2">
            <span className="text-violet-500 shrink-0">·</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

/* ─── Ratio Map ──────────────────────────────────────────────────────── */

function RatioMapCard() {
  return (
    <Card title="Ratio map">
      <InfoTable
        headers={['C:M ratio', 'Index range', 'Character', 'Good for']}
        rows={[
          ['1:1', '0 – 2', 'Warm, adds even harmonics to a sine', 'Bass, pads, stable tones'],
          ['1:2', '1 – 4', 'Bright upper partials, classic bell/EP', 'Electric piano, bells, leads'],
          ['1:3', '0.5 – 3', 'Woody, clarinet-like mid body', 'Reed sounds, mid-range pads'],
          ['1:4', '0.5 – 2', 'Thin, glassy upper harmonics', 'High melodic layers'],
          ['2:1', '0.5 – 2', 'Subharmonic reinforcement, adds weight', 'Sub bass, low pads'],
          ['1:7', '0.1 – 1', 'Metallic inharmonic sheen', 'Hi-hat layers, metal accents'],
          ['3:2', '1 – 5', 'Clavinet / funky pluck', 'Clav, funk bass, attack layers'],
          ['1:1.41', '3 – 7', 'Inharmonic (√2), snare-like noise', 'Snare body, cymbal noise'],
          ['1:1.5', '2 – 6', 'Moving partials, animated texture', 'Animated pads, LFO targets'],
          ['1:3.5', '2 – 4', 'Metallic bell with inharmonic tail', 'Metallic bells, tuned perc'],
        ]}
      />
    </Card>
  )
}

/* ─── Index Behaviour ───────────────────────────────────────────────── */

function IndexBehaviourCard() {
  return (
    <Card title="Index behaviour">
      <p className="text-xs text-zinc-500 mb-1">
        The modulation index (I) controls how many sidebands appear and how loud they are.
      </p>
      <div className="space-y-1.5">
        <Tip label="I = 0">Pure carrier sine. No modulator influence.</Tip>
        <Tip label="I &lt; 0.5">Near-sine. Adds warmth — barely audible harmonics.</Tip>
        <Tip label="I 0.5–2">Controlled brightness. Most musical tones live here.</Tip>
        <Tip label="I 2–5">Complex or metallic territory. Good for percussion and leads.</Tip>
        <Tip label="I 5+">Noisy and dense. Unstable pitch — useful for transient layers.</Tip>
      </div>
    </Card>
  )
}

/* ─── Envelope Moves ────────────────────────────────────────────────── */

function EnvelopeMovesCard() {
  return (
    <Card title="Envelope moves that matter">
      <div className="space-y-1.5">
        <Tip label="Decay on MOD">Bright attack that clears to a sine body — the classic DX bell sweep.</Tip>
        <Tip label="Attack on MOD">Swell-in brightness. Bowed string or slow pad character.</Tip>
        <Tip label="MOD shorter than AMP">Bright transient with calmer sustain. Most natural-sounding.</Tip>
        <Tip label="MOD = AMP">Constant spectral colour throughout the note. Works for organ-like sounds.</Tip>
        <Tip label="LFO → index">Animate harmonics in sync with clock for evolving pads and textural movement.</Tip>
        <Tip label="Velocity → index">Softer hits stay near-sine; harder hits become bright. Natural dynamic feel.</Tip>
      </div>
    </Card>
  )
}

/* ─── Digitone II Tips ──────────────────────────────────────────────── */

function DigitoneTipsCard() {
  return (
    <Card title="Digitone II practical tips">
      <div className="space-y-1.5">
        <Tip label="Operator routing">Algorithm choice determines which operators are carriers vs modulators. Check the algorithm page before dialling in ratios.</Tip>
        <Tip label="Ratio display">Digitone II shows C:M ratios. The carrier ratio sets the audible pitch; keep carrier at 1 unless you intentionally want an octave shift.</Tip>
        <Tip label="Index knob">The MOD knob controls depth. At noon it is not necessarily 1.0 — dial by ear, not by number.</Tip>
        <Tip label="Detune for width">Slight detune between operators in a parallel algorithm creates chorus-width without external effects.</Tip>
        <Tip label="Feedback">Operator feedback adds noise and buzz. At low levels it thickens the tone; at high levels it creates white noise useful for snare layers.</Tip>
        <Tip label="P-locks">Parameter-lock the index on individual steps for instant timbre changes without automation tracks.</Tip>
      </div>
    </Card>
  )
}

/* ─── Common FM Mistakes ───────────────────────────────────────────── */

function CommonMistakesCard() {
  return (
    <Card title="Common FM mistakes">
      <div className="space-y-3">
        <MistakeRow
          mistake="Pushing index straight to max"
          fix="Start at 0 and raise slowly until you hear the character you want. Most useful timbres are below I = 4."
        />
        <MistakeRow
          mistake="Using only integer ratios"
          fix="Half-integer ratios like 1:1.5 or 3:2 give subharmonic and inharmonic colours outside the pure harmonic series."
        />
        <MistakeRow
          mistake="Forgetting the carrier sets the pitch"
          fix="If your fundamental sounds off, check the carrier ratio. A carrier of 2 with a root of 220 Hz gives 440 Hz — one octave up."
        />
        <MistakeRow
          mistake="Static FM without any envelope on index"
          fix="Static FM often sounds thin or clangorous. An index envelope (MOD env with decay) transforms the same ratio into an expressive, evolving tone."
        />
        <MistakeRow
          mistake="Expecting FM to sound like a sample"
          fix="FM produces its own timbral family. Embrace the character it makes rather than fighting it towards a sample reference."
        />
        <MistakeRow
          mistake="Ratio hunting without a reference pitch"
          fix="Lock your fundamental first. Random ratio sweeping wastes time; knowing fc and fm in Hz tells you exactly where sidebands will land."
        />
        <MistakeRow
          mistake="Ignoring feedback as a texture source"
          fix="Operator feedback introduces noise and self-modulation. Low feedback thickens the tone; high feedback produces noise useful for percussion."
        />
      </div>
    </Card>
  )
}

interface MistakeRowProps {
  mistake: string
  fix: string
}

function MistakeRow({ mistake, fix }: MistakeRowProps) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-red-400 font-medium">✗ {mistake}</p>
      <p className="text-xs text-zinc-400 pl-3">{fix}</p>
    </div>
  )
}

/* ─── Quick Recipes ─────────────────────────────────────────────────── */

function QuickRecipesCard() {
  return (
    <Card title="Quick recipes">
      <div className="space-y-4">

        {/* ── Percussion ── */}
        <RecipeGroup label="Percussion" />
        <Recipe
          name="Kick drum"
          steps={[
            'Sine carrier, fast downward pitch envelope, short amp decay so the body reads as a drum hit.',
            'FM a noisy or brighter source for the first few milliseconds to add click, then let it disappear.',
            'If the kick lacks weight, lengthen the body; if it lacks punch, shorten the pitch drop.',
          ]}
        />
        <Recipe
          name="Bass drum"
          steps={[
            'Boomier relative of the kick: keep the sine body, tune it low, slightly longer decay.',
            'Less click and less aggressive FM on the attack for a rounder, deeper result.',
            'If it gets floppy, shorten the decay before touching the ratio.',
          ]}
        />
        <Recipe
          name="Snare body"
          steps={[
            'C:M = 1:1.41 (√2 — inharmonic)',
            'Index 4–7',
            'Very short AMP decay (40–80 ms)',
            'MOD env: instant attack, slightly longer decay than AMP',
          ]}
        />
        <Recipe
          name="Metallic percussion"
          steps={[
            'Non-simple or higher modulator ratio, very short envelope so the sound stays percussive.',
            'If it sounds noisy instead of metallic, simplify the ratio slightly.',
            'If it sounds too tonal, move farther from small integer relationships.',
          ]}
        />
        <Recipe
          name="Texture / noisy hit"
          steps={[
            'Strong FM or noisier transient content with a short envelope so the result reads as texture.',
            'Useful for attack layers, percussion accents, and rough digital fills.',
          ]}
        />

        {/* ── Bass ── */}
        <RecipeGroup label="Bass" />
        <Recipe
          name="808 / FM sub bass"
          steps={[
            'Sine carrier, C:M = 2:1, short mod decay so the note starts bright and settles into sub.',
            'Keep the core pitch stable; do not overdo the index or the sub loses focus.',
            'For more bite, add a brief high-index transient rather than brightening the whole note.',
          ]}
        />
        <Recipe
          name="Bass"
          steps={[
            'Carrier at played pitch, modulator around 1:1 or 2:1, modulation amount decays after attack.',
            '2:1 for brighter, more modern bass tones; 1:1 stays more stable and centred.',
            'If the bass gets too metallic, lower the index first before simplifying the ratio.',
          ]}
        />
        <Recipe
          name="Bass pluck"
          steps={[
            'C:M = 1:1 or 2:1',
            'Low fundamental (40–80 Hz)',
            'Index 0.8–1.5',
            'Punchy AMP decay (80–200 ms)',
            'Short MOD decay to add click attack',
          ]}
        />
        <Recipe
          name="Reese / moving bass"
          steps={[
            'Two operators slightly detuned from each other create the classic Reese movement.',
            'C:M near 1:1, slow LFO on one operator pitch or the mod index for harmonic drift.',
            'Keep the index moderate (1–2) so the movement is musical rather than noisy.',
          ]}
        />

        {/* ── Keys & Melodic ── */}
        <RecipeGroup label="Keys & melodic" />
        <Recipe
          name="DX-style EP"
          steps={[
            'C:M = 1:1, index ≈ 1.5',
            'Short AMP decay, short release',
            'MOD env: fast attack, medium decay to ≈ 0.2',
            'Velocity → index for natural dynamic feel',
          ]}
        />
        <Recipe
          name="Electric piano / mallet"
          steps={[
            'Mostly harmonic ratios with a defined transient — clear note centre with attack brightness.',
            'Short brighter component at the start, gentler sustaining body.',
            'If it becomes too glassy, shorten the bright envelope or move closer to 1:1.',
          ]}
        />
        <Recipe
          name="Bell"
          steps={[
            'Brighter or uneven ratio, short mod decay while the amp lasts longer.',
            'That shape gives you the bright strike first and the calmer tail after it.',
            'If the bell becomes too noisy, keep the ratio but back the index down slightly.',
          ]}
        />
        <Recipe
          name="Metallic bell"
          steps={[
            'C:M = 1:3.5 (inharmonic)',
            'Index 2–4',
            'Long AMP decay (5–8 s), no sustain',
            'MOD env mirrors AMP — decays in parallel',
          ]}
        />
        <Recipe
          name="Pluck"
          steps={[
            '1:1 or 2:1, fast amp decay and fast mod decay.',
            'Modulation must not stay high for long or the pluck becomes a sustained bright tone.',
            'If too dull, raise attack brightness with more index before changing the ratio.',
          ]}
        />
        <Recipe
          name="Clav / clavinet"
          steps={[
            'C:M = 3:2 or 1:0.5',
            'Index 2–3',
            'Short AMP decay, zero sustain',
            'High-pass filter to remove excessive low end',
          ]}
        />
        <Recipe
          name="Organ"
          steps={[
            'C:M = 1:1 with low index (0.1–0.5) for the fundamental drawbar character.',
            'Add parallel operators at 1:2 and 1:3 to simulate additional drawbars.',
            'No amp attack or release — instant on/off like a real organ key.',
          ]}
        />

        {/* ── Pads & Ambience ── */}
        <RecipeGroup label="Pads & ambience" />
        <Recipe
          name="Pad"
          steps={[
            'Simple ratios, low index, slow attack / long release so brightness arrives gently.',
            'Mod envelope softer than on plucks or bells — spectral change should be gradual.',
            'If too static, add slow LFO movement on index rather than jumping to a more extreme ratio.',
          ]}
        />
        <Recipe
          name="Evolving pad"
          steps={[
            'C:M = 1:2 or 1:1.5',
            'Index 0.5–1.5',
            'Slow AMP attack (500 ms+)',
            'LFO (slow, triangle) → index for harmonic movement',
            'Reverb + long release',
          ]}
        />
        <Recipe
          name="Drone"
          steps={[
            'Long sustain, long release, slow timbral movement so interest comes from evolution.',
            'Slow FM movement or slowly changing modulation amount introduces harmonic drift over time.',
            'Be careful stacking pitches if you still want harmonic clarity — dense blends turn indistinct.',
          ]}
        />
        <Recipe
          name="Bowed / swell"
          steps={[
            'Slow attack on both AMP and MOD envelopes so brightness builds with loudness.',
            'C:M = 1:1 or 1:2, index 0.5–2, no sharp transient.',
            'Add light vibrato via LFO on pitch after the initial swell to simulate bow pressure change.',
          ]}
        />
      </div>
    </Card>
  )
}

interface RecipeGroupProps {
  label: string
}

function RecipeGroup({ label }: RecipeGroupProps) {
  return (
    <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wide pt-1 border-t border-zinc-800">
      {label}
    </p>
  )
}

interface RecipeProps {
  name: string
  steps: string[]
}

function Recipe({ name, steps }: RecipeProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-bold text-violet-200">{name}</p>
      <ul className="space-y-0.5">
        {steps.map((s, i) => (
          <li key={i} className="text-xs text-zinc-400 flex gap-2">
            <span className="text-violet-600 shrink-0">·</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ─── Basic Rule Set ────────────────────────────────────────────────── */

function BasicRulesCard() {
  const rules = [
    { label: 'Simple ratios', body: 'Use simple ratios when you want pitch clarity and a more harmonic result.' },
    { label: 'Uneven ratios', body: 'Use uneven or non-integer ratios when you want metallic or inharmonic character.' },
    { label: 'Higher index', body: 'Use a higher modulation index when you want more sidebands and more complexity.' },
    { label: 'Shorter mod env', body: 'Use a shorter mod envelope than amp envelope when you want a bright attack with a calmer tail.' },
    { label: 'Fix order', body: 'If a sound is close but wrong: change the index first, then the envelope, and only then the ratio.' },
    { label: 'Feedback', body: 'Low feedback thickens a tone; high feedback adds noise useful for percussion layers.' },
    { label: 'Detune', body: 'Slight detuning between parallel operators adds chorus-width without external effects.' },
  ]

  return (
    <Card title="Basic rule set">
      <div className="space-y-2">
        {rules.map((r) => (
          <div key={r.label} className="flex gap-2 text-xs">
            <span className="text-violet-400 font-bold mono shrink-0 w-28">{r.label}</span>
            <span className="text-zinc-400">{r.body}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
