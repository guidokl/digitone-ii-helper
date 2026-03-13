```markdown
# Practical Workflows & Techniques

---

## 1. Arranging on the Digitone II

### Pattern Architecture Overview

The Digitone II organizes music into a hierarchy designed for both
composition and live flexibility:

| Level | Capacity |
|---|---|
| Project | 128 patterns across 8 banks (A–H); entire set / album / session |
| Bank | 16 patterns; song section grouping (e.g., Bank A = Track 1) |
| Pattern | Up to 128 steps (8 pages × 16 steps), 16 tracks; one musical "section" |
| Kit | 16 presets + FX + mixer settings; the sound palette for a pattern |

### Organizing Banks and Patterns for a Full Arrangement

A practical layout for a single track or live set:

| Bank | Use |
|---|---|
| A | Intro variations (A01 = sparse, A02 = building, A03 = full intro) |
| B | Verse / main groove (B01–B04 = groove variations with different mutes) |
| C | Breakdown / bridge (C01 = stripped, C02 = atmospheric) |
| D | Drop / climax (D01 = full energy, D02 = variation) |
| E | Outro / ambient (E01–E02) |
| F–H | Sketches, alternates, B-sides; free workspace |

This approach keeps related sections adjacent. Press [PTN] + [LEFT]/[RIGHT]
to change banks fluidly during performance.

### Pattern Chaining

Chains let you queue a sequence of patterns for automatic playback — useful
for rehearsing an arrangement or performing a set piece.

**Workflow:**
1. Press [PTN], then [FUNC] + [YES] to open the Chain Creator.
2. Select patterns by pressing [TRIG 1–16]. Use [LEFT]/[RIGHT] to change
   banks mid-chain.
3. Press [FUNC] + [LEFT] to delete the last entry if you make a mistake.
4. Press [YES] to confirm. Press [PLAY] to start.
5. The chain loops after the final pattern. Select any pattern normally to
   exit chain mode.

Chains can hold up to 64 patterns and can be created while the sequencer is
running. They are volatile — not saved with the project. For persistent
arrangements, use Song Mode instead.

### Song Mode

Song Mode is the Digitone II's built-in arranger for full compositions.

**Key capabilities per row:**
- Pattern selection (any bank)
- Row play count (number of repeats)
- Row length (step-granular, overrides pattern length)
- Row tempo and swing (per-row BPM override or global song tempo)
- Row mutes (per-track muting saved with the row)
- End behavior: LOOP or STOP

**Building a song:**
1. [SONG] + [TRIG 1–16] to select a song slot and enter Song Mode.
2. [FUNC] + [SONG] to open the Song Edit screen.
3. [FUNC] + [DOWN] to add rows. Each new row copies the selected row.
4. Navigate with arrow keys; edit with LEVEL/DATA or any DATA ENTRY knob.
5. Set row mutes: highlight the mute column, press [YES], use [TRIG] keys.

**Performance within Song Mode:**
- [SONG] + [LEFT] loops the current row (press again to resume).
- [SONG] + [UP]/[DOWN] jumps the playhead to another row.
- [STOP] + [STOP] returns the playhead to the song's beginning.
- Exit Song Mode with [PTN] + [TRIG 1–16].

**Important caveat from the community:** Mute/unmute actions during Song Mode
playback get written into song rows. If you want to mute/unmute freely during
a song performance without altering the arrangement, use Pattern Mute mode
([FUNC] + double-press [TRK]) rather than editing row mutes.

### Transitions Between Patterns

| Technique | How |
|---|---|
| Queued pattern change | Select new pattern while current plays; changes at end of current cycle (seamless) |
| Instant breakdown | [PTN] + [TRIG] + [REC] to copy, then [PTN] + [TRIG] + [PLAY] to clear, perform over silence, then [FUNC] + [NO] to reload; instant drop-to-silence and rebuild |
| Fill into transition | Hold [PAGE] for Fill mode, then change pattern; fill plays on final cycle, new pattern starts clean |
| Mute-based transition | Gradually mute tracks before pattern change; smooth energy reduction into new section |
| Tempo transition | Nudge tempo with [LEFT]/[RIGHT] while approaching pattern change; builds tension / energy shift |

---

## 2. Performing Live

### Mute/Unmute Workflows

The Digitone II offers three muting systems with different persistence:

| Mode | Description |
|---|---|
| Quick Mute | [FUNC] + [TRIG 1–16]; immediate toggle, not saved (transient) |
| Global Mute | [FUNC] + [TRK]; applies to all patterns, saved with project |
| Pattern Mute | [FUNC] + double-press [TRK]; current pattern only, saved with pattern |

**Simultaneous mute preparation:** In any Mute mode, hold [FUNC], press
multiple [TRIG] keys to "arm" mutes, then release [FUNC] — all armed
mutes execute simultaneously. The screen shows an overview: square = unmuted,
line = muted, plus = about to unmute, X = about to mute.

**Live performance mute strategy:**
1. Use Pattern Mute for mutes that should reset when changing patterns
   (e.g., muting a hi-hat fill track that only belongs to one groove).
2. Use Global Mute for tracks that should stay muted across pattern changes
   (e.g., a vocal chop track you only bring in during drops).
3. Use Quick Mute for improvisational moment-to-moment muting.

### Fill Patterns for Live Variation

Fill mode activates trigs with the FILL condition set to ON and deactivates
trigs with FILL set to OFF. This lets you program a "normal" sequence and
a "fill" variant on the same track.

| Action | Shortcut |
|---|---|
| One-cycle Fill (active for one full pattern loop) | [YES] + [PAGE] |
| Momentary Fill (active while held, outside Grid Rec) | Hold [PAGE] |
| Latched Fill (stays until [PAGE] pressed again) | Hold [PAGE] + [YES], release [PAGE] first |

**Design tip:** Program your main groove with FILL=OFF on all trigs, then add
variation trigs with FILL=ON. A fill trig can have completely different notes,
velocity, or sound locks — it is a second sequence overlaid on the first.

### Parameter Locks for Live Variation

Parameter locks (p-locks) are the Elektron superpower for live variation.
During performance, you can:

- **Pre-program variation:** Place p-locks on specific trigs that change
  filter cutoff, FM depth, pitch, or effects sends step-by-step.
- **Conditional p-locks:** Combine p-locks with trig conditions (50%
  probability, 1:3 patterns, etc.) for variation that emerges over time
  without manual intervention.
- **Live recording p-locks:** Enter Live Recording mode ([REC] + [PLAY]),
  then turn any knob. Changes are recorded as p-locks in real time. Press
  [PLAY] to stop recording and keep playing.
- **Control All for sweeps:** Hold [TRK] and turn a knob to affect that
  parameter across all audio tracks simultaneously. Release [TRK] to
  commit; press [NO] before releasing to revert.
- **Undo live changes:** [FUNC] + [NO] reloads the pattern from the last
  temporary save. Use [FUNC] + [YES] to make temporary saves at moments
  you want to return to.

### Arpeggiator and Chord Mode in Performance

**Arpeggiator tips:**
- Toggle arp on/off per track: [FUNC] + [ARPEGGIATOR].
- Change arp speed, range, and note length live via the Arpeggiator menu.
- P-lock arp offset (OFS) per step for melodic variation within the arp.
- Rotate the arp pattern: [FUNC] + [LEFT]/[RIGHT] in the Arp menu.

**Chord modes for live playing:**
- CHORD ROOT: press one [TRIG] key, get a full chord based on scale/root.
- CHORD CENTER: chords invert to stay close to a center position. Use
  [+]/[-] to move through inversions smoothly.
- CHORD MEMORY: pre-store up to 16 chords per pattern. Each [TRIG] key
  recalls a different chord. Extremely powerful for live harmonic movement.

**Combining arp + chord modes:** Set a track to a chord mode, then enable the
arpeggiator. Single key presses now trigger arpeggiated chords — instant
complex melodic patterns from minimal input.

### Tempo and Swing Manipulation

| Action | Shortcut |
|---|---|
| Open Tempo menu | [TEMPO] |
| Tap tempo | [FUNC] + [TEMPO] |
| Nudge tempo (while playing) | [LEFT]/[RIGHT] |
| Toggle metronome | [TEMPO] + [YES] |
| Per-pattern tempo | Set in Tempo menu (stored per pattern) |
| Per-row tempo (Song Mode) | Edit BPM column in Song Edit |

**Swing** is set in the Tempo menu and applies to even-numbered steps (pushes
them later). Subtle swing (52–55%) adds groove to straight patterns. Higher
values (58–65%) create obvious shuffle.

---

## 3. Ambient Pads and Drones

### FM Parameter Choices for Slow-Evolving Textures

The Digitone II excels at ambient sound design. The key principle: **use low
modulation indices, slow envelopes, and non-resetting phases.**

| Parameter | Setting |
|---|---|
| Algorithm | 3 or 8; multiple carriers for layered harmonics |
| RATIO C | 1; stable fundamental |
| RATIO A | 1 or 2; gentle harmonic modulation |
| LEV A | 15–40; low index = subtle, warm overtones |
| ATK A | Long (60–100); slow brightness bloom |
| END A | Near LEV value; sustained modulation |
| ATRG | OFF (gated); sustain while note held |
| ARST | OFF; smooth retriggering, no clicks |
| PHRT | OFF; free-running phases = natural variation per note |
| DTUN | 10–30; subtle beating/chorusing |
| FDBK | 5–20; slight warmth without harshness |
| HARM | -2 to +5; gentle waveform enrichment |

### LFO Strategies for Movement

The Digitone II has 2 LFOs per voice (3 per track on DN2) with extensive
destination routing. For ambient textures:

**Strategy 1: Asynchronous slow LFOs (the "Eno technique")**
- LFO1: Triangle wave, very slow speed (SPD 1–5), unsynced. Target: LEV A
  (FM brightness). Depth: low (5–15).
- LFO2: Sine wave, different slow speed (SPD 2–7). Target: filter cutoff
  or DTUN. Depth: low.
- The two LFOs at different unrelated speeds create compound modulation
  cycles that take very long to repeat — producing organic, evolving motion.

**Strategy 2: Sample-and-hold randomization**
- LFO waveform: RANDOM. Speed: slow. Target: NOTE (pitch) or HARM.
- S&H picks a new random value each LFO cycle, then holds it. At slow
  speeds, this creates subtle step-wise timbral shifts.
- This is excellent for generative ambient sequences: combine with trig
  conditions (probability locks) on a sparse pattern.

**Strategy 3: LFO on FX parameters**
- Route LFO to delay time, delay feedback, or reverb pre-delay.
- Very low depth creates subtle spatial movement — the sound appears to
  shift position and character without obvious modulation.
- Note: On the Digitone II, LFO cannot directly target send FX parameters
  (confirmed by community testing). However, you can target per-track FX
  parameters like bit reduction, overdrive, and SRR for timbral movement.

### Reverb and Delay Usage

**Reverb for drones:**
- Set reverb decay to maximum for near-infinite tails.
- Use reverb pre-delay (20–60ms) to separate the dry attack from the wash.
- Adjust reverb high-frequency damping to keep tails dark and warm.
- High reverb send levels (80+) on pad tracks create self-sustaining washes.

**Delay for depth:**
- Sync delay to tempo at long intervals (1/4 or 1/2 note).
- High feedback (75–90%) creates cascading repeats that fill space.
- Ping-pong or stereo delay adds width.
- P-lock the delay send per trig: high send on sparse trigs, low on dense
  ones — creates rhythmic delay patterns within a pad texture.

**Chorus for width:**
- Subtle chorus (low depth, moderate rate) thickens pads without obvious
  modulation artifacts.
- Effective on sounds with DTUN already applied — compounds the detuning.

### Layering Tracks for Density

With 16 tracks available, dedicate multiple tracks to a single pad:

| Track | Role |
|---|---|
| 1 | Low pad fundamental; Algo 8, low ratios, filter LP low, slow attack |
| 2 | Mid shimmer; Algo 3, higher ratios, moderate LEV A, filter BP |
| 3 | High texture; Wavetone or Swarmer, noise element, heavy reverb |
| 4 | Sub drone; single sine (LEV A=0), very low octave, minimal FX |

**Track layering feature:** In the Track Setup, you can layer tracks so that
triggering one track simultaneously triggers another. This lets a single
trig fire multiple presets — instant layered pads from one sequencer track.

### Sustaining Notes and Held Trigs

- Set note length (LEN) to INF on the TRIG page for indefinitely sustained
  notes.
- In Keyboard mode, hold [TRIG] keys to sustain notes manually.
- Use the arpeggiator with long note lengths and slow speed for
  auto-sustained evolving patterns.
- Set per-track length to different values (PER TRACK mode in Page Setup)
  for phasing ambient loops — inspired by Steve Reich's "Music for 18
  Musicians" technique. Different track lengths (e.g., 7, 11, 13 steps)
  create patterns that phase against each other and take a very long time
  to realign.

---

## 4. Techno Track Approach

### Sequencing Kick and Percussion

**FM Drum machine for kick:**
- Use the FM DRUM machine on a dedicated track.
- TUNE: low (C1–C2), STIM (sweep time): short, SDEP (sweep depth):
  medium-high for punch.
- Body DEC: medium for a tight kick, longer for boomy/reverb-laden kicks.
- FOLD: low values add subtle saturation.
- TRAN + TLEV: add a transient sample for click/attack.
- Set track to MONO play mode, phase reset ON (PH.C < 90), voice REUSE=ON
  for consistent, punchy kicks.

**Hi-hats and percussion:**
- FM TONE with high ratios (C:1, A:7 or higher) and high FDBK creates
  metallic, noise-like textures suitable for hats.
- Short amp envelope (ATK=0, DEC=short, REL=0) for closed hats.
- Longer DEC for open hats. P-lock the DEC parameter for hat variation.
- Use preset locks to alternate between closed and open hat presets on
  the same track.
- The Wavetone machine with noise component is excellent for snare/clap
  synthesis.

**Drum sequencing on a single track using preset locks:**
1. Add different drum presets to the Preset Pool.
2. In Grid Recording, hold each trig and turn LEVEL/DATA to assign
   different presets (kick, hat, snare) to different steps.
3. This puts an entire drum kit on one track — but consumes voices.
   For voice conservation, use separate tracks for each drum element.

### Groove and Swing Settings

| Technique | Implementation |
|---|---|
| Global swing | Set in Tempo menu (51–70%); pushes even steps late, 54–56% = subtle techno shuffle |
| Micro-timing per trig | Hold [TRIG] + [LEFT]/[RIGHT]; manual groove for humanized feel |
| Different track speeds | Per Track mode in Page Setup; e.g., hats at 2X speed (32nd notes), kick at 1X |
| Euclidean polyrhythms | [FUNC] + [AMP], set pulse counts; mathematically distributed trigs for complex rhythms |
| Velocity variation | P-lock VEL per trig; dynamic emphasis, accent beats 1 and 3 for drive |

### Filter Automation

- P-lock filter cutoff across trigs for step-sequenced filter sweeps.
- Use LFO targeting filter cutoff with sync to BPM for rhythmic filtering.
- The Base-Width filter (FLTR page 2) acts as a combined HP+LP band:
  automate BASE for sweeping the bottom edge, WDTH for sweeping bandwidth.
- Control All ([TRK] hold + turn) on filter cutoff for dramatic live
  sweeps across all tracks simultaneously.

### Building Tension with Parameter Locks

| Technique | How |
|---|---|
| Rising filter | P-lock filter cutoff ascending over 16–64 steps |
| FM intensity build | P-lock LEV A increasing across steps |
| Pitch rise | P-lock NOTE slightly higher each step (or use transpose) |
| Delay feedback build | P-lock delay send increasing toward the end of a pattern |
| Conditional fills | Place fill trigs (FILL=ON) with high-energy p-locks, latch fill at climax |
| Probability escalation | Start with low PROB (30%), p-lock increasing probability across the pattern — notes become more dense/certain toward the end |
| Retrig intensification | P-lock retrig rate from slow (1/4) to fast (1/32) across steps |

---

## 5. General Tips and Tricks

### Elektron Workflow Habits

**Save early, save often:**
- [FUNC] + [YES] for temporary pattern saves during sessions (non-permanent,
  fast, no interruption).
- [FUNC] + [SETTINGS] for permanent project saves.
- Save patterns to project via SETTINGS > PATTERN > SAVE TO PROJ when you
  have a version you want to keep.

**Copy before you experiment:**
- [FUNC] + [REC] to copy the current pattern before making destructive
  changes. If things go wrong, [FUNC] + [STOP] to paste it back.
- For single-track experiments: enter Grid Rec, [FUNC] + [REC] to copy
  the track, experiment, [FUNC] + [STOP] to restore.

**Use Perform Kit mode for live tweaking:**
- [FUNC] + [PRESET/KIT] enables Perform Kit mode. Now kit changes from
  pattern switches are suppressed — you keep your tweaked sounds across
  patterns. Reload the original kit with [PRESET/KIT] + [NO].

**Reload hierarchy for undo layers:**
- [PARAM] + [NO] = reload one parameter page.
- [TRK] + [TRIG] + [NO] = reload entire preset.
- [FUNC] + [NO] = reload entire pattern from temp save.
- [PRESET/KIT] + [NO] = reload kit (Perform Kit mode).

### Avoiding Common Beginner Mistakes

| Mistake | Solution |
|---|---|
| Sound is just a sine wave | Check LEV A and LEV B on SYN page 2 — default is 0 (no FM) |
| Clicking at note start | Increase amp envelope attack slightly (ATK ~4–8), or enable phase reset (PHRT = ALL) |
| Pattern sounds different after reload | You may have unsaved changes. Use [FUNC] + [YES] to temp save before experimenting |
| Voices cutting off unexpectedly | Check Voice Setup — lock voices to critical tracks (kick, bass). Set VOICE STEAL to TRACK for predictable priority |
| Cannot hear preset changes | You may be in Perform Kit mode (flashing "P"). Kits do not load on pattern change in this mode by design |
| Mutes not behaving as expected | Check if you are in Global vs. Pattern Mute mode. The DN2 remembers the last-used mute type |
| Encoder seems to skip values | Press + turn the encoder for coarse mode. Normal turning is fine resolution |
| Can't find a parameter to p-lock | Some parameters (send FX, compressor) are kit-level, not per-trig. They cannot be p-locked |
| Pattern length wrong after extending | If PAGE AUTOCOPY is ON in Personalize, extending a pattern copies existing pages. Disable if you want blank pages |

### Sound Design Efficiency

- **Start from factory presets, not init patches.** Reverse-engineer presets
  you like — hold each [PARAM] key to see all values. This teaches how the
  machine works faster than building from scratch.
- **Use [PARAM] + [YES] to randomize a page** when you hit a creative wall.
  Randomize, listen, undo with [PARAM] + [NO] if bad, or keep and refine
  if interesting.
- **Tag and organize presets.** Use the tagging system when saving presets.
  Future-you will thank present-you.
- **Control All for quick comparisons:** Hold [TRK] and sweep a parameter
  to hear how it affects all tracks. [NO] before release to revert.

### Using the Digitone II in a Broader Setup

**As MIDI sequencer:**
- 16 tracks can be any combination of audio and MIDI.
- MIDI tracks send note, velocity, length, CC, pitch bend, aftertouch.
- Use Digitone II as the brain of a hardware setup: sequence external synths,
  drum machines, and effects processors.

**With Overbridge:**
- Stream individual tracks as separate audio channels into your DAW.
- Total recall: DAW saves and restores the Digitone II's state.
- Use the Overbridge plugin for on-screen parameter editing.

**As effects processor:**
- Route external audio into the stereo inputs.
- Process through the Digitone II's filters, overdrive, delay, reverb,
  and chorus.
- The inputs are summed to mono before effects — keep this in mind for
  stereo sources.

**Clock and sync:**
- MIDI clock master or slave via DIN MIDI or USB.
- DIN Sync output available on MIDI THRU/SYNC B for vintage gear.
- Program change send/receive for pattern synchronization across devices.

---

## 6. Hidden Tips, Tricks and Techniques

### Instant Breakdowns and Rebuilds

While the sequencer is playing:
1. [PTN] + [TRIG] + [REC] to copy any pattern (including the current one).
2. [PTN] + [TRIG] + [PLAY] to clear a target pattern — instant silence.
3. Perform over the silence (keyboard mode, live knob tweaks).
4. [FUNC] + [NO] to reload the original pattern — instant rebuild.

This creates dramatic live breakdowns without risk of losing your work.

### Euclidean Randomization (Community Discovery)

From the Elektronauts tips thread (LyingDalai):
1. [FUNC] + [AMP] to open Euclidean mode, toggle EUC on.
2. Hold [AMP], release [FUNC].
3. While still holding [AMP], press [YES].
4. Result: randomized Euclidean sequence — instant rhythmic variation.

### Pre-Placed Trigs Before Euclidean

Place trigs manually in Grid Rec with note values, velocity, p-locks, and
even preset locks. Then activate Euclidean mode. The Euclidean generator
distributes trigs, but any previously placed trig data (notes, plocks)
persists on those positions. This gives Euclidean rhythms musical content
rather than uniform hits.

### Converting Euclidean to Regular Trigs

Hold [FUNC] while toggling EUC off. This converts the generated Euclidean
pattern into regular sequencer trigs that you can then manually edit.
Without holding [FUNC], the original pre-Euclidean trigs reappear instead.

### Multi-Trig Parameter Lock Across a Page

In Grid Recording: hold [TRIG] + [PAGE] (or [TRK]), then turn a DATA ENTRY
knob. This adds the same p-lock to every existing trig on the current page
simultaneously. Extremely fast for applying a uniform filter sweep or
velocity change across an entire sequence page.

### Track Layering for Polyrhythmic Variation

Layer track 10 onto track 9 (in Track Setup). Track 9 receives its note
triggers from track 10. Now:
- Set track 9 and track 10 to different lengths (e.g., 7 and 12).
- Place lock trigs on track 9 to modify the preset parameters independently.
- The result: track 10's melodic content plays through track 9's preset
  with polyrhythmic parameter variation.

### The Comb Filter as Per-Track Delay

Set a Comb filter (COMB- or COMB+) to very low frequency. The comb resonance
acts like a very short delay with feedback. At the lowest frequencies, you
get roughly 10+ seconds of decay. This gives each track its own independent
"delay" effect without consuming the shared send delay.

### Transient Drum Kit via Key Tracking (Community Discovery)

From sezare56 on Elektronauts:
- On the FM Drum machine, use Key Tracking to map the TRAN (transient)
  parameter to incoming notes.
- Depth 16 maps all 62 transient samples across the keyboard.
- Depth 64 spreads kicks, snares, and hats across 16 trig keys without
  needing transpose.
- Use the Transient parameter to shift between kit variations.

### Predictable LFOs for Polyphonic Patches

By default, each voice has its own LFO phase. For polyphonic patches
(chords), this means each note's LFO is at a different point in its cycle,
creating unpredictable wobble. To fix this:
- Go to Track Setup ([FUNC] + [FLTR]).
- Set Play Mode to POLY:M.LFO.
- All voices now sync their LFOs to the first note played — the LFO
  behaves as if it were monophonic. Essential for consistent tremolo,
  vibrato, or filter sweeps on chord pads.

### Using Note Edit for Page Navigation

The Note Edit menu ([NOTE EDIT]) lets you jump between trigs using
[FUNC] + [LEFT]/[RIGHT], which crosses page boundaries. This is faster
than pressing [PAGE] multiple times when you need to reach a specific trig
on a distant page — especially useful on 64- or 128-step patterns.

### Undo Any Clear or Paste

After performing a clear ([FUNC] + [PLAY]) or paste ([FUNC] + [STOP]),
immediately repeat the exact same key combination to undo the action. This
works for patterns, tracks, trigs, pages, and parameter pages — but only
if you repeat it before doing anything else.

### Saving Trig Sounds as Presets

In Grid Recording, hold a [TRIG] and press [PRESET/KIT]. The sound of that
specific trig — including all its parameter locks — is saved as a new
preset. This is extremely useful for capturing happy accidents: if you have
p-locked a trig into something special, save it as a preset before you
forget how you got there.

### The Machine Select Shortcut

[FUNC] + [SYN] opens the machine list, but it opens to the list
corresponding to the parameter page you were last viewing. Use [LEFT]/[RIGHT]
in the menu to switch between SYN machine lists and FLTR machine lists
without backing out.

### Control All Exclusion

You can exclude specific tracks from Control All sweeps:
1. [FUNC] + [FLTR] to open Setup.
2. Navigate to CONTROL ALL CONFIG.
3. Use [TRIG] keys to select/deselect which tracks respond.

This prevents your kick or bass track from being affected when you do a
dramatic filter sweep across everything else.

### Pattern Transpose Config

Similarly, pattern transpose ([PTN] + [+]/[-]) can be configured to only
affect selected tracks:
1. [FUNC] + [FLTR] > PTN TRANSPOSE CONFIG.
2. Select tracks with [TRIG] keys.

This lets you transpose melody and chord tracks while leaving drums and
bass unaffected.

### The Live Recording Erase Technique

In Live Recording mode, hold [NO] + one or more [TRIG] keys corresponding
to tracks. As the playhead passes, it erases trigs on those tracks in real
time. This lets you "punch out" sections of a sequence rhythmically,
synchronized to the beat — far more musical than manually deleting trigs
in Grid Rec.

For erasing specific parameter locks only: hold [NO] + the DATA ENTRY knob
of the parameter you want to remove. Only that parameter's locks are erased
as the playhead passes.

### Adjust Parameters Slowly

From the Dave Mech cheat sheet and widespread community advice: FM
parameters interact nonlinearly. The difference between a usable sound and
noise can be a few encoder clicks. Move slowly, listen carefully. The sweet
spots exist between the extremes, and large jumps will skip over them.

### Keyboard Fold for Maximum Trig Coverage

In Keyboard Setup, set MODE to FOLDED. All 16 [TRIG] keys now play notes
(not just the keys that correspond to white/black keys). This gives you
maximum chromatic coverage from the limited keys — essential for live
melodic playing and step recording.

### Init Patch Attack Time

Default init patches have an amp envelope attack time of approximately 8
(not zero). This prevents clicks but dulls the transient. For percussive
sounds, explicitly set ATK to 0. For pads where you hear clicks, raise it
to 4–12.
```
