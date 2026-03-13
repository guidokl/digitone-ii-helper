// Type declaration for the marked.js global loaded from CDN
declare const marked: {
  parse(src: string): string
  setOptions(options: { gfm?: boolean; breaks?: boolean }): void
}
