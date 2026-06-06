import { describe, it, expect } from 'vitest'
import { getDecisionPattern, CHOICE_CATALOGUE } from './decisionPattern.ts'
import type { PlayerProfile } from '../types/player.ts'

function mockPlayer(flags: Record<string, boolean | string | number>): PlayerProfile {
  return {
    id: 'p1', username: 'test', handle: 'TEST', email: 'a@b.c',
    avatarId: 'x', createdAt: 0, lastSeenAt: 0, credits: 0,
    reputation: 0, rank: 1, specialization: null, factionStandings: [],
    hardware: { cpuSpeed: 1, ramSlots: 2, hddCapacity: 10, modemSpeed: 10, gatewayBandwidth: 10 },
    software: { passwordCrackers: [], proxies: [], firewallBypassers: [], logDeleters: [], portScanners: [], misc: [] },
    completedMissions: [],
    activeFlags: flags,
    stats: { totalMissions: 0, successfulBreaches: 0, traceEscapes: 0, traceFailures: 0, creditsEarned: 0, creditsSpent: 0, hoursPlayed: 0, xp: 0, level: 1 },
    bounceLibrary: [],
    faction: null,
  }
}

describe('getDecisionPattern', () => {
  it('returns null pattern for null player', () => {
    const p = getDecisionPattern(null)
    expect(p.total).toBe(0)
    expect(p.netScore).toBe(0)
    expect(p.recentTrend).toBe('none')
  })

  it('returns null pattern for empty flags', () => {
    const p = getDecisionPattern(mockPlayer({}))
    expect(p.total).toBe(0)
    expect(p.netScore).toBe(0)
  })

  it('maps legacy arc1_key_choice = upload as principled +3', () => {
    const p = getDecisionPattern(mockPlayer({ arc1_key_choice: 'upload' }))
    expect(p.principledScore).toBe(3)
    expect(p.mercenaryScore).toBe(0)
    expect(p.netScore).toBe(3)
    expect(p.dominantTraits).toContain('liberator')
  })

  it('maps legacy arc1_key_choice = sell as mercenary +3', () => {
    const p = getDecisionPattern(mockPlayer({ arc1_key_choice: 'sell' }))
    expect(p.mercenaryScore).toBe(3)
    expect(p.netScore).toBe(-3)
    expect(p.dominantTraits).toContain('pragmatist')
  })

  it('counts boolean choice flags once', () => {
    const p = getDecisionPattern(mockPlayer({
      choice_civilian_spared: true,
      choice_whistleblower_protected: true,
    }))
    expect(p.principledScore).toBe(1 + 2)  // civilian=1, whistleblower=2
    expect(p.total).toBe(2)
    expect(p.dominantTraits).toEqual(expect.arrayContaining(['civilian_protector', 'whistleblower_ally']))
  })

  it('counts numeric counter flags by their value', () => {
    const p = getDecisionPattern(mockPlayer({
      choice_civilian_spared: 5,  // 5 events × weight 1
      choice_op_bounty_accepted: 3,  // 3 events × weight 2 = 6 mercenary
    }))
    expect(p.principledScore).toBe(5)
    expect(p.mercenaryScore).toBe(6)
    expect(p.netScore).toBe(-1)
    expect(p.total).toBe(8)
  })

  it('stacks legacy + new flags additively', () => {
    const p = getDecisionPattern(mockPlayer({
      arc1_key_choice: 'sell',
      choice_data_leaked: true,
    }))
    expect(p.mercenaryScore).toBe(3)
    expect(p.principledScore).toBe(1)
    expect(p.netScore).toBe(-2)
  })

  it('marks recentTrend principled when net > 2', () => {
    const p = getDecisionPattern(mockPlayer({
      choice_whistleblower_protected: 2,  // +4
    }))
    expect(p.recentTrend).toBe('principled')
  })

  it('marks recentTrend mercenary when net < -2', () => {
    const p = getDecisionPattern(mockPlayer({
      arc1_key_choice: 'sell',
    }))
    expect(p.recentTrend).toBe('mercenary')
  })

  it('marks recentTrend mixed when |net| <= 2', () => {
    const p = getDecisionPattern(mockPlayer({
      choice_civilian_spared: true,
      choice_data_sold: true,
    }))
    expect(p.recentTrend).toBe('mixed')
  })

  it('respects explicit recent_choice_direction marker', () => {
    const p = getDecisionPattern(mockPlayer({
      arc1_key_choice: 'sell',  // would be mercenary trend
      recent_choice_direction: 5,  // but player has been turning principled
    }))
    expect(p.recentTrend).toBe('principled')
  })

  it('marks isReformer when overall pattern + recent trend disagree (after enough choices)', () => {
    // Player has 10+ mercenary historical choices but recent direction is +ve
    const p = getDecisionPattern(mockPlayer({
      choice_civilian_burned: 5,   // -5
      choice_op_bounty_accepted: 3, // -6
      recent_choice_direction: 5,   // recent: principled
    }))
    expect(p.isReformer).toBe(true)
  })

  it('does NOT mark isReformer with too few choices', () => {
    const p = getDecisionPattern(mockPlayer({
      choice_civilian_burned: 1,
      recent_choice_direction: 5,
    }))
    expect(p.isReformer).toBe(false)
  })

  it('caps dominantTraits to 4 entries', () => {
    // Set 6 different trait-tagged flags
    const p = getDecisionPattern(mockPlayer({
      choice_arc1_key_upload: true,        // liberator
      choice_civilian_spared: 5,           // civilian_protector
      choice_whistleblower_protected: 3,   // whistleblower_ally
      choice_data_leaked: 2,               // truth_seeker
      choice_black_halo_turn: true,        // underground_ally
      choice_compact_rule4_violated: true, // compact_violator
    }))
    expect(p.dominantTraits.length).toBeLessThanOrEqual(4)
  })

  it('catalogue is non-empty and has unique flags', () => {
    expect(CHOICE_CATALOGUE.length).toBeGreaterThan(10)
    const flags = CHOICE_CATALOGUE.map((c) => c.flag)
    expect(new Set(flags).size).toBe(flags.length)
  })
})
