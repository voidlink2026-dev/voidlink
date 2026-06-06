import { describe, it, expect } from 'vitest'
import { NPC_DIALOGUE_CATALOGUE, evaluateDialogueTriggers, pickDialogueVariant } from './npcDialogue.ts'
import type { PlayerProfile } from '../types/player.ts'
import type { DecisionPattern } from '../engine/decisionPattern.ts'

function mockPlayer(over: Partial<PlayerProfile> = {}): PlayerProfile {
  return {
    id: 'p1', username: 'test', handle: 'TEST', email: 'a@b.c',
    avatarId: 'x', createdAt: 0, lastSeenAt: 0, credits: 0,
    reputation: 0, rank: 1, specialization: null, factionStandings: [],
    hardware: { cpuSpeed: 1, ramSlots: 2, hddCapacity: 10, modemSpeed: 10, gatewayBandwidth: 10 },
    software: { passwordCrackers: [], proxies: [], firewallBypassers: [], logDeleters: [], portScanners: [], misc: [] },
    completedMissions: [],
    activeFlags: {},
    stats: { totalMissions: 0, successfulBreaches: 0, traceEscapes: 0, traceFailures: 0, creditsEarned: 0, creditsSpent: 0, hoursPlayed: 0, xp: 0, level: 1 },
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

describe('evaluateDialogueTriggers', () => {
  it('returns empty list for fresh player', () => {
    expect(evaluateDialogueTriggers(mockPlayer())).toEqual([])
  })

  it('fires cipher_first_advice after 2 successful breaches', () => {
    const p = mockPlayer({ stats: { ...mockPlayer().stats, successfulBreaches: 2 } })
    const out = evaluateDialogueTriggers(p)
    expect(out.map((e) => e.id)).toContain('cipher_first_advice')
  })

  it('does not refire if dialogue_fired_<id> flag is set', () => {
    const p = mockPlayer({
      stats: { ...mockPlayer().stats, successfulBreaches: 2 },
      activeFlags: { dialogue_fired_cipher_first_advice: Date.now() },
    })
    const out = evaluateDialogueTriggers(p)
    expect(out.map((e) => e.id)).not.toContain('cipher_first_advice')
  })

  it('fires dispatch_rank3 at rank 3', () => {
    const p = mockPlayer({ rank: 3 })
    const out = evaluateDialogueTriggers(p)
    expect(out.map((e) => e.id)).toContain('dispatch_rank3')
  })

  it('fires arc1 aftermath specific to choice', () => {
    const p = mockPlayer({ activeFlags: { arc1_key_choice: 'upload' } })
    const out = evaluateDialogueTriggers(p)
    expect(out.map((e) => e.id)).toContain('cipher_arc1_aftermath_upload')
    expect(out.map((e) => e.id)).not.toContain('cipher_arc1_aftermath_sell')
  })

  it('underground induction requires standing AND principled act', () => {
    // standing alone
    let p = mockPlayer({
      factionStandings: [{ factionId: 'underground', score: 60, rank: 'ACCEPTED' }],
    })
    expect(evaluateDialogueTriggers(p).map((e) => e.id))
      .not.toContain('cipher_underground_induction')

    // standing + whistleblower choice
    p = mockPlayer({
      factionStandings: [{ factionId: 'underground', score: 60, rank: 'ACCEPTED' }],
      activeFlags: { choice_whistleblower_protected: 1 },
    })
    expect(evaluateDialogueTriggers(p).map((e) => e.id))
      .toContain('cipher_underground_induction')
  })
})

describe('pickDialogueVariant', () => {
  const cipherFirst = NPC_DIALOGUE_CATALOGUE.find((e) => e.id === 'cipher_first_advice')!

  it('returns strong_principled variant for net >= 10', () => {
    const v = pickDialogueVariant(cipherFirst, pattern(15))
    expect(v?.subject).toBe('re: nice work')
  })

  it('returns strong_mercenary variant for net <= -10', () => {
    const v = pickDialogueVariant(cipherFirst, pattern(-15))
    expect(v?.subject).toBe('(no subject)')
  })

  it('returns neutral for neutral pattern', () => {
    const v = pickDialogueVariant(cipherFirst, pattern(0))
    expect(v?.subject).toBe('observation')
  })

  it('returns null when entry deliberately does not fire (Cipher silent for high-mercenary three_rules)', () => {
    const threeRules = NPC_DIALOGUE_CATALOGUE.find((e) => e.id === 'cipher_three_rules')!
    expect(pickDialogueVariant(threeRules, pattern(-15))).toBeNull()
  })

  it('Cipher three_rules DOES fire for strong-principled', () => {
    const threeRules = NPC_DIALOGUE_CATALOGUE.find((e) => e.id === 'cipher_three_rules')!
    const v = pickDialogueVariant(threeRules, pattern(15))
    expect(v?.subject).toBe('three rules — by request')
  })

  it('Underground induction returns null for neutral pattern', () => {
    const induction = NPC_DIALOGUE_CATALOGUE.find((e) => e.id === 'cipher_underground_induction')!
    expect(pickDialogueVariant(induction, pattern(0))).toBeNull()
  })

  it('Dispatch rank3 fires for ALL patterns — but with different tone', () => {
    const rank3 = NPC_DIALOGUE_CATALOGUE.find((e) => e.id === 'dispatch_rank3')!
    const principled = pickDialogueVariant(rank3, pattern(15))
    const mercenary  = pickDialogueVariant(rank3, pattern(-15))
    expect(principled).not.toBeNull()
    expect(mercenary).not.toBeNull()
    expect(principled?.body).toContain('Stewardship')
    expect(mercenary?.body).toContain('Mercenary Listings')
  })
})

describe('catalogue integrity', () => {
  it('all entries have unique IDs', () => {
    const ids = NPC_DIALOGUE_CATALOGUE.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all entries have at least the neutral or weak_principled variant defined', () => {
    for (const entry of NPC_DIALOGUE_CATALOGUE) {
      const hasAny = entry.variants.neutral !== undefined
        || entry.variants.weak_principled !== undefined
        || entry.variants.weak_mercenary !== undefined
      expect(hasAny, `entry ${entry.id} has no fallback variant`).toBe(true)
    }
  })
})
