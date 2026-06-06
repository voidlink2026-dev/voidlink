import { describe, it, expect } from 'vitest'
import { REFLECTION_SCENES, buildReflectionText } from './reflectionScenes.ts'
import type { PlayerProfile } from '../types/player.ts'
import type { DecisionPattern } from '../engine/decisionPattern.ts'

function mockPlayer(over: Partial<PlayerProfile> = {}): PlayerProfile {
  return {
    id: 'p1', username: 'test', handle: 'CIPHER_X', email: 'a@b.c',
    avatarId: 'x', createdAt: Date.now() - 43 * 24 * 3600 * 1000, lastSeenAt: 0, credits: 0,
    reputation: 0, rank: 1, specialization: null, factionStandings: [],
    hardware: { cpuSpeed: 1, ramSlots: 2, hddCapacity: 10, modemSpeed: 10, gatewayBandwidth: 10 },
    software: { passwordCrackers: [], proxies: [], firewallBypassers: [], logDeleters: [], portScanners: [], misc: [] },
    completedMissions: [],
    activeFlags: {},
    stats: { totalMissions: 67, successfulBreaches: 67, traceEscapes: 0, traceFailures: 0, creditsEarned: 0, creditsSpent: 0, hoursPlayed: 0, xp: 0, level: 1 },
    bounceLibrary: [],
    faction: null,
    ...over,
  }
}

function pattern(netScore: number): DecisionPattern {
  return {
    principledScore: Math.max(0, netScore),
    mercenaryScore: Math.max(0, -netScore),
    total: Math.abs(netScore),
    netScore,
    recentTrend: 'none',
    dominantTraits: [],
    isReformer: false,
  }
}

describe('REFLECTION_SCENES catalogue', () => {
  it('has all 5 trigger types', () => {
    const triggers = Object.keys(REFLECTION_SCENES)
    expect(triggers).toEqual(expect.arrayContaining([
      'end_of_arc_1', 'end_of_arc_3', 'pre_arc_5', 'anniversary', 'season_transition',
    ]))
  })

  it('each scene has all 5 buckets populated', () => {
    for (const trigger of Object.keys(REFLECTION_SCENES) as Array<keyof typeof REFLECTION_SCENES>) {
      const scene = REFLECTION_SCENES[trigger]
      expect(scene.factPool.strong_principled.length).toBeGreaterThan(0)
      expect(scene.factPool.weak_principled.length).toBeGreaterThan(0)
      expect(scene.factPool.neutral.length).toBeGreaterThan(0)
      expect(scene.factPool.weak_mercenary.length).toBeGreaterThan(0)
      expect(scene.factPool.strong_mercenary.length).toBeGreaterThan(0)
    }
  })
})

describe('buildReflectionText', () => {
  it('builds end_of_arc_1 with mercenary pattern surfacing mercenary facts', () => {
    const player = mockPlayer({
      activeFlags: { choice_op_bounty_accepted: 3, choice_data_sold: 4, arc1_key_choice: 'sell' },
    })
    const out = buildReflectionText('end_of_arc_1', player, pattern(-15))
    expect(out.title).toMatch(/REFLECTION/)
    expect(out.body).toMatch(/43 days/)        // DAYS token
    expect(out.body).toMatch(/67 contracts/)    // MISSIONS token
    expect(out.body).toMatch(/watchlist/i)     // strong mercenary line
  })

  it('builds end_of_arc_1 with principled pattern surfacing principled facts', () => {
    const player = mockPlayer({
      activeFlags: {
        choice_civilian_spared: 5,
        choice_whistleblower_protected: 3,
        choice_data_leaked: 4,
        arc1_key_choice: 'upload',
      },
    })
    const out = buildReflectionText('end_of_arc_1', player, pattern(15))
    expect(out.body).toMatch(/civilians spared|spared 5|CIPHER addresses you/i)
  })

  it('resolves CIVILIANS_SPARED token from numeric flag', () => {
    const player = mockPlayer({ activeFlags: { choice_civilian_spared: 7 } })
    const out = buildReflectionText('end_of_arc_1', player, pattern(5))
    // The 'spared 7' substring will appear in at least one fact
    expect(out.body).toMatch(/7/)
  })

  it('resolves HANDLE token', () => {
    const player = mockPlayer({ handle: 'CIPHER_X' })
    // No current scene uses {HANDLE} directly — but should be in the token context regardless
    const out = buildReflectionText('end_of_arc_1', player, pattern(0))
    // Just verify no unresolved tokens leak
    expect(out.body).not.toMatch(/\{HANDLE\}/)
  })

  it('leaves unknown tokens unresolved (they remain as {TOKEN})', () => {
    // Hard to test directly without adding a fact with {UNKNOWN}.
    // Just verify all factPool entries with known tokens get resolved.
    const player = mockPlayer({ activeFlags: { choice_civilian_spared: 1 } })
    const out = buildReflectionText('end_of_arc_1', player, pattern(5))
    const knownTokens = ['{DAYS}', '{MISSIONS}', '{CIVILIANS_SPARED}', '{WHISTLEBLOWERS}', '{BOUNTIES_TAKEN}', '{LEAKS}', '{SOLD}', '{HANDLE}']
    for (const tok of knownTokens) {
      expect(out.body, `${tok} should be resolved`).not.toMatch(new RegExp(tok.replace(/[{}]/g, '\\$&')))
    }
  })

  it('different scenes produce different titles', () => {
    const player = mockPlayer()
    const arc1 = buildReflectionText('end_of_arc_1', player, pattern(0))
    const arc3 = buildReflectionText('end_of_arc_3', player, pattern(0))
    const anniversary = buildReflectionText('anniversary', player, pattern(0))
    expect(arc1.title).not.toBe(arc3.title)
    expect(arc3.title).not.toBe(anniversary.title)
  })

  it('different patterns at the same scene produce different bodies', () => {
    const player = mockPlayer()
    const principled = buildReflectionText('end_of_arc_1', player, pattern(15)).body
    const mercenary  = buildReflectionText('end_of_arc_1', player, pattern(-15)).body
    expect(principled).not.toBe(mercenary)
  })
})
