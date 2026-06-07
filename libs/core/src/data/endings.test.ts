import { describe, it, expect } from 'vitest'
import { ENDINGS, getAvailableEndings } from './endings.ts'
import type { PlayerProfile } from '../types/player.ts'

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

describe('ENDINGS catalogue', () => {
  it('has all 11 ending variants', () => {
    expect(Object.keys(ENDINGS).length).toBe(11)
  })

  it('every ending has tagline + epilogue', () => {
    for (const e of Object.values(ENDINGS)) {
      expect(e.tagline.length).toBeGreaterThan(0)
      expect(e.epilogue.length).toBeGreaterThan(100)
    }
  })
})

describe('getAvailableEndings', () => {
  it('Arc 1 upload + principled pattern → liberation_principled', () => {
    const p = mockPlayer({
      activeFlags: {
        arc1_key_choice: 'upload',
        choice_civilian_spared: 5,
        choice_whistleblower_protected: 3,
      },
    })
    const e = getAvailableEndings(p)
    expect(e.map((x) => x.id)).toContain('liberation_principled')
  })

  it('Arc 1 upload + mercenary pattern → liberation_mercenary', () => {
    const p = mockPlayer({
      activeFlags: {
        arc1_key_choice: 'upload',
        choice_civilian_burned: 5,
        choice_op_bounty_accepted: 3,
      },
    })
    const e = getAvailableEndings(p)
    expect(e.map((x) => x.id)).toContain('liberation_mercenary')
  })

  it('Arc 1 destroy + low Arunmor → only erasure offered', () => {
    const p = mockPlayer({
      activeFlags: { arc1_key_choice: 'destroy' },
      factionStandings: [{ factionId: 'arunmor', score: 10, rank: 'OBSERVED' }],
    })
    const e = getAvailableEndings(p)
    expect(e.map((x) => x.family)).toContain('erasure')
    expect(e.map((x) => x.family)).not.toContain('containment')
  })

  it('Arc 1 destroy + high Arunmor → erasure + containment', () => {
    const p = mockPlayer({
      activeFlags: { arc1_key_choice: 'destroy' },
      factionStandings: [{ factionId: 'arunmor', score: 50, rank: 'TRUSTED' }],
    })
    const e = getAvailableEndings(p)
    expect(e.map((x) => x.family)).toEqual(expect.arrayContaining(['erasure', 'containment']))
  })

  it('Arc 1 sell → containment primary', () => {
    const p = mockPlayer({ activeFlags: { arc1_key_choice: 'sell' } })
    const e = getAvailableEndings(p)
    expect(e.map((x) => x.family)).toContain('containment')
  })

  it('Arc 1 upload + REVELATION contact ≥3 → sovereignty offered', () => {
    const p = mockPlayer({
      activeFlags: { arc1_key_choice: 'upload', revelation_contact_count: 5 },
    })
    const e = getAvailableEndings(p)
    expect(e.map((x) => x.family)).toEqual(expect.arrayContaining(['liberation', 'sovereignty']))
  })

  it('Ghost spec adds GHOST ending to the list', () => {
    const p = mockPlayer({
      specialization: 'ghost',
      activeFlags: { arc1_key_choice: 'destroy' },
    })
    const e = getAvailableEndings(p)
    expect(e.map((x) => x.family)).toContain('ghost')
  })

  it('caps offered endings at 3', () => {
    const p = mockPlayer({
      specialization: 'ghost',
      activeFlags: {
        arc1_key_choice: 'upload',
        revelation_contact_count: 5,
        choice_op_bounty_accepted: 1,
      },
      factionStandings: [
        { factionId: 'arunmor', score: 50, rank: 'TRUSTED' },
        { factionId: 'government', score: 50, rank: 'COOPERATIVE' },
      ],
    })
    const e = getAvailableEndings(p)
    expect(e.length).toBeLessThanOrEqual(3)
  })

  it('always returns at least one ending', () => {
    const p = mockPlayer()
    const e = getAvailableEndings(p)
    expect(e.length).toBeGreaterThanOrEqual(1)
  })

  it('Reformer\'s Path offered for substantial mid-career change', () => {
    // Heavily mercenary catalogue + recent direction principled + enough total
    const p = mockPlayer({
      activeFlags: {
        arc1_key_choice: 'sell',
        choice_op_bounty_accepted: 4,    // -8 mercenary
        choice_civilian_burned: 5,        // -5 mercenary
        recent_choice_direction: 6,       // +6 principled trend
      },
    })
    const e = getAvailableEndings(p)
    expect(e.map((x) => x.family)).toContain('reformer')
  })
})
