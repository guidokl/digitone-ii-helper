# Digitone 2 Helper

Digitone II helper site with CLK & FM tools, tips, shortcuts and workflows.

## Tabs

| Tab | Contents |
|-----|----------|
| **CLK** | LFO sync, Pattern/Loop timing, Microtiming, Retrig, Arpeggiator |
| **FM** | Ratio helper, Sideband preview, Modulation index, Envelope sketch |
| **FM+** | FM synthesis reference: foundations, techniques, recipes, rules |
| **VAR** | Various data tables — currently filter frequency calibration anchors |
| **HKY** | Hardware shortcut & key combination reference (rendered from markdown) |
| **WFL** | Practical workflows & techniques reference (rendered from markdown) |

## Stack

- **Vite 7** · **React 19** · **TypeScript** (strict) · **Tailwind CSS v4**
- **Vitest** — unit tests · **marked.js** (CDN) — markdown rendering

## Commands

```sh
npm install        # install dependencies
npm run dev        # start dev server
npm run build      # type-check + production build
npm run test       # run all tests
```

## Key Formulas

```
# LFO sync
wholeNotesPerCycle = 128 / (speed × mult)
secondsPerCycle    = wholeNotesPerCycle × (240 / BPM)

# Pattern timing
fullRepeatSteps = LCM(all track step lengths)

# Microtiming
offsetMs = fraction × (15 / BPM) × 1000

# Retrig
hitCount = max(1, ceil(gateWhole / intervalWhole))

# FM sidebands
upper_n = fc + n×fm    lower_n = |fc − n×fm|

# Filter interpolation (log-space, 11 anchor points)
freq = 2^(log2(f1) + t × (log2(f2) - log2(f1)))
```

## Approximations

- **Arpeggiator**: phrase duration is estimated, not emulated
- **FM Ratio / Mod Index**: heuristic classifications
- **Envelope Sketch**: conceptual visualization, not a waveform model
- **Filter anchors**: interpolated; out-of-range values extrapolated
- **LFO, Pattern, Microtiming, Retrig**: mathematically exact

## Source layout

```
markdown/          # HKY and WFL source files (do not edit)
src/
  app/layout/      # one component per tab
  tools/           # lfo, pattern, microtiming, retrig, arp,
                   # fm-ratio, fm-sidebands, fm-index, fm-envelope
  lib/             # math, format, music, storage, interpolation …
  data/            # filterAnchors, noteValues, ratioPresets
```
