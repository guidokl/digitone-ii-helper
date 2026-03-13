# Digitone 2 Helper

Digitone II helper site with CLK & FM tools, tips, shortcuts and workflows.

**Live:** https://guidokl.github.io/digitone-ii-helper/

---

## Tabs

| Tab | Contents |
|-----|----------|
| **CLK** | LFO sync, pattern/loop timing, microtiming, retrig, arpeggiator |
| **FM** | Ratio helper, sideband preview, modulation index, envelope sketch |
| **FM+** | FM synthesis reference — foundations, techniques, recipes, rules |
| **VAR** | Miscellaneous data tables (currently: filter frequency anchors) |
| **HKY** | Hardware shortcut & key combination reference |
| **WFL** | Practical workflows & techniques reference |

## Stack

Vite 7 · React 19 · TypeScript (strict) · Tailwind CSS v4 · Vitest · marked.js (CDN)

## Local development

```sh
npm install
npm run dev      # dev server → http://localhost:5173
npm run build    # type-check + build → dist/
npm run test     # unit tests
```

## Deploy

GitHub Actions deploys `dist/` to GitHub Pages on push to `main`.
First-time setup: repo Settings → Pages → Source → "GitHub Actions".
