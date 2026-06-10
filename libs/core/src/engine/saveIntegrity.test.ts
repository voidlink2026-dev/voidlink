import { describe, it, expect } from 'vitest'
import { signSave, verifySave, SAVE_INTEGRITY_FIELD } from './saveIntegrity.ts'

describe('saveIntegrity', () => {
  it('signs deterministically for the same input', () => {
    const body = { credits: 100, handle: 'A' }
    expect(signSave(body)).toBe(signSave(body))
  })

  it('produces different digests for different bodies', () => {
    expect(signSave({ credits: 100 })).not.toBe(signSave({ credits: 101 }))
  })

  it('is insensitive to key order in the input object', () => {
    expect(signSave({ a: 1, b: 2, c: 3 })).toBe(signSave({ c: 3, a: 1, b: 2 }))
  })

  it('verifies a properly-signed save', () => {
    const body = { credits: 100, factions: { underground: 50 } }
    const sig = signSave(body)
    const wire = { ...body, [SAVE_INTEGRITY_FIELD]: sig }
    expect(verifySave(wire)).toBe(true)
  })

  it('rejects a save whose body has been mutated after signing', () => {
    const body = { credits: 100 }
    const sig = signSave(body)
    const tampered = { credits: 999999, [SAVE_INTEGRITY_FIELD]: sig }
    expect(verifySave(tampered)).toBe(false)
  })

  it('rejects a save with a stripped integrity field', () => {
    const body = { credits: 100 }
    expect(verifySave(body)).toBe(false)
  })

  it('rejects a save with a forged integrity field', () => {
    const body = { credits: 100, [SAVE_INTEGRITY_FIELD]: 'a'.repeat(32) }
    expect(verifySave(body)).toBe(false)
  })

  it('handles nested objects and arrays', () => {
    const body = {
      player: { handle: 'OP', activeFlags: { achievement_x: 123456 } },
      missions: [{ id: 'm1' }, { id: 'm2' }],
    }
    const sig = signSave(body)
    expect(verifySave({ ...body, [SAVE_INTEGRITY_FIELD]: sig })).toBe(true)
  })

  it('produces a 32-char hex digest', () => {
    const sig = signSave({ x: 1 })
    expect(sig).toMatch(/^[0-9a-f]{32}$/)
  })
})
