// L5.1 — Save integrity (anti-JSON-edit deterrent).
//
// Threat model: a player opens devtools, finds their save in localStorage,
// rewrites their credit balance / faction standing / `achievement_<id>` flag,
// and reloads. We want to detect that. We do NOT want to stop a determined
// reverse-engineer who reads the binary — that's a different threat class and
// would require DRM theatre we explicitly refuse to ship (see L5.1 spec in
// Next_Stage.md).
//
// Approach: a sync keyed hash. The save object gets serialised, fed through
// a keyed FNV-1a + multi-pass diffusion routine using a build-time secret as
// the key, and the resulting hex digest is appended to the save as
// `_integrity`. On load, we strip the field, recompute the digest, and
// compare. Mismatch flips `save_tampered_at` on the player; honest play
// continues, but Steam-side achievement unlocks (forthcoming with L4) are
// gated behind a second-check that recomputes the achievement predicate
// against the live player state.
//
// Notes:
//   - This is NOT HMAC-SHA256. It is intentionally simpler so it can run
//     synchronously inside the existing save flow without refactoring the
//     persistence layer to async.
//   - The build secret is injected by Vite via `import.meta.env`. Default
//     fallback is fine for dev — only release builds need the real one set
//     in CI.
//   - Rotating the secret across releases does NOT invalidate old saves —
//     verify is best-effort; failed verify warns, doesn't block load.

const BUILD_SECRET: string =
  (typeof import.meta !== 'undefined' &&
    (import.meta as unknown as { env?: { VITE_SAVE_SECRET?: string } }).env?.VITE_SAVE_SECRET) ||
  'voidlink-development-secret-2026'

// 32-bit FNV-1a primitives.
const FNV_OFFSET = 0x811c9dc5
const FNV_PRIME  = 0x01000193

function fnv1a(input: string, seed = FNV_OFFSET): number {
  let h = seed >>> 0
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    // Math.imul gives proper 32-bit multiply
    h = Math.imul(h, FNV_PRIME)
  }
  return h >>> 0
}

/** Three-pass keyed diffusion. Each pass mixes the body through FNV with a
 *  rotated secret seed so an attacker who knows FNV-1a but not the secret
 *  can't forge a digest for a mutated body. Output is 32 hex chars (4×8). */
function keyedDigest(body: string, secret: string): string {
  const k1 = fnv1a(secret)
  const k2 = fnv1a(secret + ':2', k1)
  const k3 = fnv1a(':3:' + secret, k2)
  const k4 = fnv1a(secret + ':4:' + secret, k3)
  const h1 = fnv1a(body, k1)
  const h2 = fnv1a(body.split('').reverse().join(''), k2)
  const h3 = fnv1a(body + body.length.toString(), k3)
  const h4 = fnv1a(secret + body + secret, k4)
  const toHex = (n: number) => n.toString(16).padStart(8, '0')
  return toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4)
}

export const SAVE_INTEGRITY_FIELD = '_integrity'

/** Sign a save body (any JSON-serialisable object). Returns the digest string
 *  that should be written as `body[SAVE_INTEGRITY_FIELD]`. */
export function signSave(body: unknown): string {
  // Stable serialisation: caller is responsible for not including the
  // integrity field itself in `body`. We sort keys to make the digest
  // insensitive to JSON.stringify key order across engines.
  return keyedDigest(stableStringify(body), BUILD_SECRET)
}

/** Verify a save object that includes `_integrity`. Returns true if the
 *  digest matches, false otherwise. Accepts the full save (with the field)
 *  for convenience. */
export function verifySave(saved: Record<string, unknown>): boolean {
  const claimed = saved[SAVE_INTEGRITY_FIELD]
  if (typeof claimed !== 'string') return false
  const { [SAVE_INTEGRITY_FIELD]: _, ...rest } = saved
  void _
  const expected = signSave(rest)
  // Constant-time-ish compare. Not actually CT because JS strings, but the
  // attack surface here is local JSON editing, not timing oracles.
  if (claimed.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < claimed.length; i++) {
    diff |= claimed.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return diff === 0
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) {
    return '[' + value.map(stableStringify).join(',') + ']'
  }
  const obj = value as Record<string, unknown>
  const keys = Object.keys(obj).sort()
  return '{' + keys.map((k) => JSON.stringify(k) + ':' + stableStringify(obj[k])).join(',') + '}'
}
