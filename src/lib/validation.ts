export type ValidationResult = { valid: true; value: number } | { valid: false; error: string }

export function validatePositive(raw: string, label = 'Value'): ValidationResult {
  const n = parseFloat(raw)
  if (raw.trim() === '' || isNaN(n)) return { valid: false, error: `Enter a positive number` }
  if (n <= 0) return { valid: false, error: `${label} must be greater than 0` }
  return { valid: true, value: n }
}

export function validatePositiveInt(raw: string, label = 'Value'): ValidationResult {
  const n = parseFloat(raw)
  if (raw.trim() === '' || isNaN(n)) return { valid: false, error: `Enter a whole number` }
  if (n <= 0) return { valid: false, error: `${label} must be greater than 0` }
  if (!Number.isInteger(n)) return { valid: false, error: `Steps must be a whole number` }
  return { valid: true, value: n }
}

export function validateRange(
  raw: string,
  min: number,
  max: number,
  label = 'Value',
): ValidationResult {
  const n = parseFloat(raw)
  if (raw.trim() === '' || isNaN(n)) return { valid: false, error: `Enter a number` }
  if (n < min || n > max)
    return { valid: false, error: `${label} must be between ${min} and ${max}` }
  return { valid: true, value: n }
}

export function validateBpm(raw: string): ValidationResult {
  return validateRange(raw, 1, 999, 'BPM')
}
