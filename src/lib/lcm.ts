export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  while (b !== 0) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  return Math.abs(Math.round(a) * Math.round(b)) / gcd(a, b)
}

export function lcmMany(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((acc, v) => lcm(acc, v), values[0])
}
