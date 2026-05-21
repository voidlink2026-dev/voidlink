import { describe, it, expect } from 'vitest'
import { generateContract } from './generator.ts'

const SEED = 0xcafebabe

describe('generateContract', () => {
  it('returns a mission with the correct type and difficulty', () => {
    const mission = generateContract('file_theft', 3, 'corporate_intranet', SEED)
    expect(mission.type).toBe('file_theft')
    expect(mission.difficulty).toBe(3)
  })

  it('is deterministic for the same seed', () => {
    const a = generateContract('account_deletion', 2, 'personal_gateway', SEED)
    const b = generateContract('account_deletion', 2, 'personal_gateway', SEED)
    expect(a.id).toBe(b.id)
    expect(a.reward.credits).toBe(b.reward.credits)
    expect(a.briefing.clientHandle).toBe(b.briefing.clientHandle)
  })

  it('produces different results for different seeds', () => {
    const a = generateContract('file_theft', 3, 'corporate_intranet', SEED)
    const b = generateContract('file_theft', 3, 'corporate_intranet', SEED + 1)
    expect(a.id).not.toBe(b.id)
  })

  it('reward credits scale with difficulty', () => {
    const easy = generateContract('file_theft', 1, 'personal_gateway', SEED)
    const hard = generateContract('file_theft', 5, 'corporate_intranet', SEED)
    expect(hard.reward.credits).toBeGreaterThan(easy.reward.credits)
  })

  it('reward reputation scales with difficulty', () => {
    const easy = generateContract('file_theft', 1, 'personal_gateway', SEED)
    const hard = generateContract('file_theft', 5, 'corporate_intranet', SEED)
    expect(hard.reward.reputation).toBeGreaterThan(easy.reward.reputation)
  })

  it('has exactly one primary (non-optional) objective', () => {
    const mission = generateContract('network_sabotage', 4, 'corporate_intranet', SEED)
    const primary = mission.objectives.filter((o) => !o.isOptional)
    expect(primary).toHaveLength(1)
    expect(primary[0].isCompleted).toBe(false)
  })

  it('status is available on creation', () => {
    const mission = generateContract('bounty_hunt', 1, 'personal_gateway', SEED)
    expect(mission.status).toBe('available')
  })

  it('isStory is false for generated contracts', () => {
    const mission = generateContract('corporate_espionage', 5, 'corporate_intranet', SEED)
    expect(mission.isStory).toBe(false)
  })

  it('timeLimitSeconds is set for very hard missions (difficulty >= 7)', () => {
    const hard = generateContract('database_corruption', 8, 'government_classified', SEED)
    expect(hard.timeLimitSeconds).toBeDefined()
    expect(hard.timeLimitSeconds).toBeGreaterThan(0)
  })

  it('timeLimitSeconds is undefined for easier missions', () => {
    const easy = generateContract('file_theft', 3, 'personal_gateway', SEED)
    expect(easy.timeLimitSeconds).toBeUndefined()
  })

  it('has a non-empty briefing body', () => {
    const mission = generateContract('file_theft', 2, 'corporate_intranet', SEED)
    expect(mission.briefing.body.length).toBeGreaterThan(0)
    expect(mission.briefing.clientHandle.length).toBeGreaterThan(0)
  })

  it('all mission types generate valid missions', () => {
    const types = [
      'file_theft', 'account_deletion', 'database_corruption',
      'network_sabotage', 'bounty_hunt', 'corporate_espionage',
    ] as const
    for (const type of types) {
      const m = generateContract(type, 3, 'corporate_intranet', SEED)
      expect(m.type).toBe(type)
      expect(m.objectives.length).toBeGreaterThan(0)
    }
  })
})
