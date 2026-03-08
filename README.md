# Digitone II Tools

Mobile-first utility calculators for Elektron Digitone II users. Reduces recurring mental math for timing, FM synthesis, and filter frequency work — directly on your phone while patching.

## Purpose

Translates numbers: synced LFO speed/mult to note values, filter parameter values to Hz, loop lengths to full-repeat duration, retrig intervals to hit counts. No fluff, no audio, no MIDI.

## Stack

- **Vite** — build and dev server
- **React 19** — UI
- **TypeScript** — strict, fully typed
- **Tailwind CSS v4** — utility styling
- **Vitest** — unit tests
- **React Testing Library** — component smoke tests

## Commands

```sh
npm install        # install dependencies
npm run dev        # start dev server
npm run build      # type-check + production build
npm run test       # run all tests
npm run preview    # preview production build
```

## Implemented Tools

### Timing

| Tool | What it does |
|------|-------------|
| **LFO Calculator** | Translates synced SPEED × MULT into note length, bars, steps, ms, and PPQN ticks |
| **Pattern / Loop Calculator** | Per-track duration + LCM full-system repeat for up to 8 tracks |
| **Microtiming Converter** | Step fraction or microtick offset → ms, beats, bars with early/late label |
| **Retrig Calculator** | Hit count, spacing, and timeline visualization for gate + retrig interval |
| **Arpeggiator Timing** | Phrase duration estimator from rate, note count, range, and direction |

### FM

| Tool | What it does |
|------|-------------|
| **FM Ratio Helper** | fc/fm in Hz, simplified ratio, harmonic classification heuristics |
| **FM Sideband Preview** | First N upper/lower sideband frequencies, optional nearest-note analysis |
| **Modulation Index Helper** | Brightness/complexity guide with color band scale |
| **Envelope Interaction Sketch** | ADSR amp + mod interaction SVG visualization |

### Filter

| Tool | What it does |
|------|-------------|
| **Filter Frequency Calculator** | Parameter 0–127 → Hz using log-space anchor interpolation; reverse lookup Hz → parameter |

## Approximation Disclaimer

Several results are approximations, clearly labeled:

- **Filter**: Interpolated from 11 known anchor points using log-frequency interpolation. Out-of-range values are extrapolated and marked. Formula: `freq = 2^(log2(f1) + t × (log2(f2) - log2(f1)))`.
- **Arpeggiator**: Estimated phrase duration. Not a bit-perfect emulator of Digitone II arp internals.
- **FM Ratio / Mod Index**: Heuristic classifications based on general FM synthesis theory.
- **Envelope Sketch**: Conceptual visualization, not a waveform model.
- **LFO, Pattern, Microtiming, Retrig**: Mathematically exact for the stated formulas.

## Key Formulas

```
# LFO sync
wholeNotesPerCycle = 128 / (speed × mult)
secondsPerCycle    = wholeNotesPerCycle × (240 / BPM)

# Pattern timing
bars    = steps / 16
seconds = steps × (15 / BPM)
fullRepeatSteps = LCM(all track step lengths)

# Microtiming
stepSeconds    = 15 / BPM
offsetSeconds  = fraction × stepSeconds
offsetMs       = offsetSeconds × 1000

# Retrig
hitCount = max(1, ceil(gateWhole / intervalWhole))
spacing  = intervalWhole × (240 / BPM) × 1000 ms

# FM sidebands
fc       = fundamental × carrierRatio
fm       = fundamental × modulatorRatio
upper_n  = fc + n × fm
lower_n  = |fc − n × fm|

# Filter interpolation
t    = (p - p1) / (p2 - p1)
logF = log2(f1) + t × (log2(f2) - log2(f1))
freq = 2^logF
```

## Project Structure

```
src/
  app/
    App.tsx              # root component, section routing
    layout/              # section panel components
  components/            # shared UI components
    Badge, ChipGroup, CopyButton, ErrorText,
    FormulaBlock, NumberField, ResultCard,
    SectionTabs, SegmentedControl, SelectField,
    ToolCard
  tools/
    lfo/                 # LFO Calculator
    pattern/             # Pattern / Loop Calculator
    microtiming/         # Microtiming Converter
    retrig/              # Retrig Calculator
    arp/                 # Arpeggiator Timing
    filter/              # Filter Frequency Calculator
    fm-ratio/            # FM Ratio Helper
    fm-sidebands/        # FM Sideband Preview
    fm-index/            # Modulation Index Helper
    fm-envelope/         # Envelope Interaction Sketch
  lib/
    math.ts              # timing math helpers
    format.ts            # numeric formatting
    music.ts             # note/frequency helpers, rational approximation
    storage.ts           # localStorage with versioned keys
    validation.ts        # input validation helpers
    lcm.ts               # LCM / GCD
    interpolation.ts     # filter log-space interpolation
  data/
    filterAnchors.ts     # 11 calibration anchor points
    noteValues.ts        # note value registry (whole-note fractions)
    ratioPresets.ts      # FM ratio preset values
  test/                  # unit tests (Vitest)
```

## Future Ideas

- **Euclidean Visualizer** — step pattern generation and visualization
- **Scale / Chord Visualizer** — note set display on a grid or keyboard
- **Additional filter calibration sets** — if better reference data for specific filter types (Comb+, Comb−, LP4) becomes available
- **Shareable URL presets** — encode tool state in URL query params
- **Offline patch note scratchpad** — local session notes, no backend required
