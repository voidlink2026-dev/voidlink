import { describe, it, expect } from 'vitest'
import { DIARY_TEMPLATES, evaluateDiaryEntries, getDiaryTemplate } from './diaryEntries.ts'
import type { PlayerProfile } from '../types/player.ts'

function mockPlayer(overrides: Partial<PlayerProfile> = {}): PlayerProfile {
  return {
    id: 'p1', username: 'test', handle: 'TEST', email: 't@t.t',
    avatarId: 'a', createdAt: Date.now() - 24 * 3600 * 1000, lastSeenAt: Date.now(),
    credits: 0, reputation: 0, rank: 1, specialization: null,
    factionStandings: [],
    hardware: { cpuSpeed: 1, ramSlots: 2, hddCapacity: 100, modemSpeed: 1, gatewayBandwidth: 10 } as PlayerProfile['hardware'],
    software: { passwordCrackers: [], proxies: [], logDeleters: [], portScanners: [], firewallBypassers: [], misc: [] } as PlayerProfile['software'],
    completedMissions: [], activeFlags: {},
    stats: { totalMissions: 0, successfulBreaches: 0, traceEscapes: 0, traceFailures: 0, creditsEarned: 0, creditsSpent: 0, hoursPlayed: 0, xp: 0, level: 1 } as PlayerProfile['stats'],
    bounceLibrary: [], faction: null,
    ...overrides,
  }
}

describe('DIARY_TEMPLATES', () => {
  it('every template has unique id, non-empty body, valid predicate', () => {
    const ids = new Set<string>()
    for (const t of DIARY_TEMPLATES) {
      expect(t.id).toBeTruthy()
      expect(ids.has(t.id)).toBe(false)
      ids.add(t.id)
      expect(t.body.length).toBeGreaterThan(40)
      expect(typeof t.matches).toBe('function')
    }
  })

  it('catalogue has at least 30 entries (audit threshold)', () => {
    expect(DIARY_TEMPLATES.length).toBeGreaterThanOrEqual(30)
  })
})

describe('evaluateDiaryEntries', () => {
  it('returns nothing for a fresh player', () => {
    expect(evaluateDiaryEntries(mockPlayer())).toEqual([])
  })

  it('fires first_mission entry on first successful breach', () => {
    const p = mockPlayer({
      stats: { ...mockPlayer().stats, successfulBreaches: 1 },
      completedMissions: ['m1'],
    })
    const entries = evaluateDiaryEntries(p)
    const ids = entries.map((e) => e.id)
    expect(ids).toContain('first_mission')
    expect(ids).toContain('first_log_wipe')
  })

  it('does not re-fire an entry whose diary_<id> flag is set', () => {
    const p = mockPlayer({
      stats: { ...mockPlayer().stats, successfulBreaches: 1 },
      completedMissions: ['m1'],
      activeFlags: { diary_first_mission: Date.now(), diary_first_log_wipe: Date.now() },
    })
    expect(evaluateDiaryEntries(p).map((e) => e.id)).not.toContain('first_mission')
  })

  it('fires arc1_upload entry on upload', () => {
    const p = mockPlayer({ activeFlags: { arc1_key_choice: 'upload' } })
    expect(evaluateDiaryEntries(p).map((e) => e.id)).toContain('arc1_upload')
  })

  it('fires arc8 entries based on the choice flag set', () => {
    const p = mockPlayer({ activeFlags: { choice_lighthouse_warn_cipher: true } })
    expect(evaluateDiaryEntries(p).map((e) => e.id)).toContain('arc8_warn_cipher')
  })

  it('fires millionaire entry at 1M Cr cash', () => {
    expect(evaluateDiaryEntries(mockPlayer({ credits: 999_999 })).map((e) => e.id)).not.toContain('millionaire')
    expect(evaluateDiaryEntries(mockPlayer({ credits: 1_000_000 })).map((e) => e.id)).toContain('millionaire')
  })

  it('fires the_underground loyalist entry at standing ≥ 500', () => {
    const p = mockPlayer({ factionStandings: [{ factionId: 'the_underground', score: 500, rank: 'VETERAN' }] })
    expect(evaluateDiaryEntries(p).map((e) => e.id)).toContain('underground_loyalist')
  })

  it('resolves the {HANDLE} token if present', () => {
    // Add a synthetic template through the export — instead verify the
    // first_mission body does NOT have unresolved tokens after eval.
    const p = mockPlayer({
      stats: { ...mockPlayer().stats, successfulBreaches: 1 },
      completedMissions: ['m1'],
    })
    const entries = evaluateDiaryEntries(p)
    for (const e of entries) {
      expect(e.body).not.toMatch(/\{[A-Z_]+\}/)
    }
  })
})

describe('getDiaryTemplate', () => {
  it('returns by id', () => {
    expect(getDiaryTemplate('first_mission')?.id).toBe('first_mission')
    expect(getDiaryTemplate('arc1_upload')?.id).toBe('arc1_upload')
  })
  it('returns undefined for unknown', () => {
    expect(getDiaryTemplate('nope')).toBeUndefined()
  })
})
