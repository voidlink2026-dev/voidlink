import { describe, it, expect } from 'vitest'
import { CODEX, getCodexEntry, getUnlockedCodexEntries, evaluateCodexUnlocks } from './codex.ts'
import type { PlayerProfile } from '../types/player.ts'

function mockPlayer(over: Partial<PlayerProfile> = {}): PlayerProfile {
  return {
    id: 'p1', username: 'test', handle: 'TEST', email: 'a@b.c',
    avatarId: 'x', createdAt: Date.now(), lastSeenAt: 0, credits: 0,
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

describe('CODEX catalogue', () => {
  it('has at least 15 entries', () => {
    expect(CODEX.length).toBeGreaterThanOrEqual(15)
  })

  it('all entries have unique IDs', () => {
    const ids = CODEX.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all entries have non-empty title/tagline/body', () => {
    for (const e of CODEX) {
      expect(e.title.length).toBeGreaterThan(0)
      expect(e.tagline.length).toBeGreaterThan(0)
      expect(e.body.length).toBeGreaterThan(100)
    }
  })
})

describe('unlock triggers', () => {
  it('voidlink_compact unlocks at signup', () => {
    expect(getCodexEntry('voidlink_compact')!.unlockTrigger(mockPlayer())).toBe(true)
  })

  it('voidlink_international unlocks after first mission', () => {
    const entry = getCodexEntry('voidlink_international')!
    expect(entry.unlockTrigger(mockPlayer())).toBe(false)
    expect(entry.unlockTrigger(mockPlayer({
      stats: { ...mockPlayer().stats, totalMissions: 1 },
    }))).toBe(true)
  })

  it('arunmor_corp unlocks on first Arunmor mission', () => {
    const entry = getCodexEntry('arunmor_corp')!
    expect(entry.unlockTrigger(mockPlayer())).toBe(false)
    expect(entry.unlockTrigger(mockPlayer({
      completedMissions: ['story_arc1_02_arunmor'],
    }))).toBe(true)
  })

  it('jcb unlocks at rank 5', () => {
    const entry = getCodexEntry('jcb')!
    expect(entry.unlockTrigger(mockPlayer({ rank: 4 }))).toBe(false)
    expect(entry.unlockTrigger(mockPlayer({ rank: 5 }))).toBe(true)
  })

  it('cipher unlocks after first CIPHER dialogue', () => {
    const entry = getCodexEntry('cipher')!
    expect(entry.unlockTrigger(mockPlayer())).toBe(false)
    expect(entry.unlockTrigger(mockPlayer({
      activeFlags: { dialogue_fired_cipher_first_advice: Date.now() },
    }))).toBe(true)
  })

  it('nexus_financial unlocks on first bank account', () => {
    const entry = getCodexEntry('nexus_financial')!
    expect(entry.unlockTrigger(mockPlayer())).toBe(false)
    expect(entry.unlockTrigger(mockPlayer({
      bankAccounts: { globalbank: { bankId: 'globalbank', balance: 0, apr: 0, openedAt: 0, lastInterestTickAt: 0, totalInterestEarned: 0 } } as any,
    }))).toBe(true)
  })
})

describe('getUnlockedCodexEntries', () => {
  it('returns at least the signup entry for a fresh player', () => {
    const out = getUnlockedCodexEntries(mockPlayer())
    expect(out.map((e) => e.id)).toContain('voidlink_compact')
  })

  it('grows as the player progresses', () => {
    const fresh = getUnlockedCodexEntries(mockPlayer())
    const after = getUnlockedCodexEntries(mockPlayer({
      stats: { ...mockPlayer().stats, totalMissions: 1 },
      rank: 5,
    }))
    expect(after.length).toBeGreaterThan(fresh.length)
  })
})

describe('evaluateCodexUnlocks', () => {
  it('returns entries that are eligible AND not yet marked unlocked', () => {
    const player = mockPlayer({
      stats: { ...mockPlayer().stats, totalMissions: 1 },
    })
    const due = evaluateCodexUnlocks(player)
    expect(due.map((e) => e.id)).toContain('voidlink_international')
  })

  it('skips entries already marked unlocked', () => {
    const player = mockPlayer({
      stats: { ...mockPlayer().stats, totalMissions: 1 },
      activeFlags: { codex_unlocked_voidlink_international: Date.now() },
    })
    const due = evaluateCodexUnlocks(player)
    expect(due.map((e) => e.id)).not.toContain('voidlink_international')
  })
})
