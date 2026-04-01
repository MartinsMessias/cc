/**
 * Runtime fallback for source snapshots that don't provide Bun's compile-time
 * `bun:bundle` macro module.
 */
export function feature(name: string): boolean {
  const envKey = `FEATURE_${name}`
  const value = process.env[envKey]
  if (!value) return false
  return value === '1' || value.toLowerCase() === 'true'
}
