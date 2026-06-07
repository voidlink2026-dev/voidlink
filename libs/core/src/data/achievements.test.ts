import { describe, it, expect } from 'vitest'
import { ACHIEVEMENTS, evaluateAchievements, getAchievement } from './achievements.ts'
import type { PlayerProfile } from '../types/player.ts'

function mockPlayer(overrides: Partial<PlayerProfile> = {}): PlayerProfile {
  return {
    id: 'p1', username: 'test', handle: 'TEST', email: 't@t.t',
    avatarId: 'a', createdAt: Date.now(), lastSeenAt: Date.now(),
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

describe('ACHIEVEMENTS catalogue', () => {
  it('contains exactly 50 entries', () => {
    expect(ACHIEVEMENTS.length).toBe(50)
  })

  it('every achievement has unique id, title, description, tier, check', () => {
    const ids = new Set<string>()
    for (const a of ACHIEVEMENTS) {
      expect(a.id).toBeTruthy()
      expect(ids.has(a.id)).toBe(false)
      ids.add(a.id)
      expect(a.title).toBeTruthy()
      expect(a.description).toBeTruthy()
      expect(['trivial', 'bronze', 'silver', 'gold', 'story', 'platinum']).toContain(a.tier)
      expect(typeof a.check).toBe('function')
    }
  })

  it('tier counts match design (5 trivial, 13 bronze, 12 silver, 7 gold, 11 story, 2 platinum)', () => {
    const counts = ACHIEVEMENTS.reduce<Record<string, number>>((acc, a) => {
      acc[a.tier] = (acc[a.tier] ?? 0) + 1
      return acc
    }, {})
    expect(counts.trivial).toBe(5)
    expect(counts.bronze).toBe(13)
    expect(counts.silver).toBe(12)
    expect(counts.gold).toBe(7)
    expect(counts.story).toBe(11)
    expect(counts.platinum).toBe(2)
  })

  it('all story and platinum entries are hidden', () => {
    for (const a of ACHIEVEMENTS) {
      if (a.tier === 'story' || a.tier === 'platinum') expect(a.hidden).toBe(true)
    }
  })
})

describe('evaluateAchievements', () => {
  it('returns no unlocks for a fresh player (except onboarded which is trivial)', () => {
    const p = mockPlayer()
    const unlocks = evaluateAchievements(p)
    // 'onboarded' is satisfied for any player with a handle; bronze loan_default and
    // others depend on flags so should not fire.
    expect(unlocks).toContain('onboarded')
    expect(unlocks).not.toContain('hundred_missions')
    expect(unlocks).not.toContain('arc1_upload')
  })

  it('skips already-unlocked achievements', () => {
    const p = mockPlayer({ activeFlags: { achievement_onboarded: Date.now() } })
    const unlocks = evaluateAchievements(p)
    expect(unlocks).not.toContain('onboarded')
  })

  it('arc1_upload fires when arc1_key_choice = upload', () => {
    const p = mockPlayer({ activeFlags: { arc1_key_choice: 'upload' } })
    expect(evaluateAchievements(p)).toContain('arc1_upload')
  })

  it('collaborator_ending fires when choice_ending_collaborator flag is set', () => {
    const p = mockPlayer({ activeFlags: { choice_ending_collaborator: true } })
    expect(evaluateAchievements(p)).toContain('collaborator_ending')
  })

  it('millionaire fires at 1M Cr cash', () => {
    expect(evaluateAchievements(mockPlayer({ credits: 999_999 }))).not.toContain('millionaire')
    expect(evaluateAchievements(mockPlayer({ credits: 1_000_000 }))).toContain('millionaire')
  })

  it('the_full_picture requires completion across arcs 1, 5, 6, 7, 8', () => {
    const partial = mockPlayer({
      activeFlags: { arc1_key_choice: 'upload' },
      completedMissions: ['story_arc5_03c', 'story_arc6_03'],
    })
    expect(evaluateAchievements(partial)).not.toContain('the_full_picture')
    const full = mockPlayer({
      activeFlags: { arc1_key_choice: 'destroy' },
      completedMissions: [
        'story_arc5_01', 'story_arc6_01', 'story_arc7_01', 'story_arc8_03',
      ],
    })
    expect(evaluateAchievements(full)).toContain('the_full_picture')
  })
})

describe('getAchievement', () => {
  it('returns the entry by id', () => {
    expect(getAchievement('onboarded')?.tier).toBe('trivial')
    expect(getAchievement('arc8_expose_dispatch')?.tier).toBe('story')
  })
  it('returns undefined for unknown id', () => {
    expect(getAchievement('nope')).toBeUndefined()
  })
})
