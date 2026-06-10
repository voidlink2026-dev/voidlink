import { describe, it, expect } from 'vitest'
import { getOperativeSignature, getOperativeSignatureId, OPERATIVE_SIGNATURE_CATALOGUE } from './operativeSignature.ts'
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

describe('OPERATIVE_SIGNATURE_CATALOGUE', () => {
  it('every entry has unique id, non-empty signature, valid predicate', () => {
    const ids = new Set<string>()
    for (const e of OPERATIVE_SIGNATURE_CATALOGUE) {
      expect(e.id).toBeTruthy()
      expect(ids.has(e.id)).toBe(false)
      ids.add(e.id)
      expect(e.signature).toMatch(/^You are: /)
      expect(typeof e.matches).toBe('function')
    }
  })

  it('the final entry is the default fallback that always matches', () => {
    const last = OPERATIVE_SIGNATURE_CATALOGUE[OPERATIVE_SIGNATURE_CATALOGUE.length - 1]
    expect(last.id).toBe('default')
    expect(last.matches(mockPlayer(), { principledScore: 0, mercenaryScore: 0, total: 0, netScore: 0, recentTrend: 'none', dominantTraits: [], isReformer: false })).toBe(true)
  })
})

describe('getOperativeSignature — fallback behaviour', () => {
  it('returns the default fallback for a fresh player', () => {
    expect(getOperativeSignature(mockPlayer())).toBe('You are: an operative.')
    expect(getOperativeSignatureId(mockPlayer())).toBe('default')
  })

  it('returns mid-career neutral once the player has 10+ completed missions and no axis tilt', () => {
    const p = mockPlayer({ completedMissions: Array.from({ length: 12 }, (_, i) => `m${i}`) })
    expect(getOperativeSignatureId(p)).toBe('mid_career_neutral')
  })
})

describe('getOperativeSignature — Arc 1 dominant signatures', () => {
  it('liberator for upload', () => {
    const p = mockPlayer({ activeFlags: { arc1_key_choice: 'upload' } })
    expect(getOperativeSignatureId(p)).toBe('liberator')
  })
  it('guardian for destroy', () => {
    const p = mockPlayer({ activeFlags: { arc1_key_choice: 'destroy' } })
    expect(getOperativeSignatureId(p)).toBe('guardian')
  })
  it('pragmatist for sell', () => {
    const p = mockPlayer({ activeFlags: { arc1_key_choice: 'sell' } })
    expect(getOperativeSignatureId(p)).toBe('pragmatist')
  })
})

describe('getOperativeSignature — Arc 6/7/8 end-state signatures', () => {
  it('bond_clean for Arc 6 purge', () => {
    const p = mockPlayer({ activeFlags: { choice_dead_drop_purge: true } })
    expect(getOperativeSignatureId(p)).toBe('bond_clean')
  })
  it('underground_betrayer for Arc 7 expose nightowl', () => {
    const p = mockPlayer({ activeFlags: { choice_quiet_war_expose_nightowl: true } })
    expect(getOperativeSignatureId(p)).toBe('underground_betrayer')
  })
  it('voidlink_breaker for Arc 8 expose dispatch', () => {
    const p = mockPlayer({ activeFlags: { choice_lighthouse_expose_dispatch: true } })
    expect(getOperativeSignatureId(p)).toBe('voidlink_breaker')
  })
  it('whistleblower_killer for Arc 8 take vance out', () => {
    const p = mockPlayer({ activeFlags: { choice_lighthouse_take_vance_out: true } })
    expect(getOperativeSignatureId(p)).toBe('whistleblower_killer')
  })
})

describe('getOperativeSignature — heaviest combinations beat single choices', () => {
  it('Cipher loyalist + bond clean returns the dual-trait signature, not the single one', () => {
    const p = mockPlayer({ activeFlags: { choice_lighthouse_warn_cipher: true, choice_dead_drop_purge: true } })
    expect(getOperativeSignatureId(p)).toBe('cipher_loyalist_and_bond_clean')
  })
  it('Voidlink breaker + balance keeper returns the dual signature', () => {
    const p = mockPlayer({ activeFlags: { choice_lighthouse_expose_dispatch: true, choice_quiet_war_preserve_balance: true } })
    expect(getOperativeSignatureId(p)).toBe('voidlink_breaker_and_balance_keeper')
  })
})

describe('getOperativeSignature — pattern bucket fallbacks', () => {
  it('strong_principled bucket for high principled score with no dominant trait', () => {
    const p = mockPlayer({ activeFlags: { choice_civilian_spared: 4 } })
    // 4 spared = 4 × principled weight 1 = 4 net; below strong_principled threshold of 10
    expect(getOperativeSignatureId(p)).toBe('weak_principled')
  })
  it('strong_mercenary bucket for heavy mercenary pattern', () => {
    const p = mockPlayer({ activeFlags: { choice_data_sold: 12 } })
    // 12 sold × mercenary weight 1 = -12 net
    expect(getOperativeSignatureId(p)).toBe('strong_mercenary')
  })
})

describe('getOperativeSignature — bond_grey trait', () => {
  it('returns bond_grey signature after taking 2+ operative bounties', () => {
    const p = mockPlayer({ activeFlags: { choice_op_bounty_accepted: 3 } })
    expect(getOperativeSignatureId(p)).toBe('bond_grey')
  })
})
