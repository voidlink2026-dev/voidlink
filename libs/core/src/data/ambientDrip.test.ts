import { describe, it, expect } from 'vitest'
import { AMBIENT_DRIP_CATALOGUE, pickAmbientDrip } from './ambientDrip.ts'
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

describe('AMBIENT_DRIP_CATALOGUE', () => {
  it('contains at least 20 entries (audit threshold)', () => {
    expect(AMBIENT_DRIP_CATALOGUE.length).toBeGreaterThanOrEqual(20)
  })

  it('every entry has unique id', () => {
    const ids = new Set<string>()
    for (const t of AMBIENT_DRIP_CATALOGUE) {
      expect(ids.has(t.id)).toBe(false)
      ids.add(t.id)
    }
  })

  it('news entries have headline + category; inbox entries have subject', () => {
    for (const t of AMBIENT_DRIP_CATALOGUE) {
      if (t.kind === 'news') {
        expect(t.headline).toBeTruthy()
        expect(t.category).toBeTruthy()
      } else {
        expect(t.subject).toBeTruthy()
      }
      expect(t.body.length).toBeGreaterThan(40)
    }
  })
})

describe('pickAmbientDrip', () => {
  it('returns a template for a fresh player', () => {
    const pick = pickAmbientDrip(mockPlayer())
    expect(pick).not.toBeNull()
  })

  it('returns null once every entry has been fired', () => {
    const flags: Record<string, number> = {}
    for (const t of AMBIENT_DRIP_CATALOGUE) flags[`ambient_${t.id}`] = 1
    const pick = pickAmbientDrip(mockPlayer({ activeFlags: flags }))
    expect(pick).toBeNull()
  })

  it('does not pick an entry whose ambient_<id> flag is already set', () => {
    const exhaustAllButOne = AMBIENT_DRIP_CATALOGUE.slice(0, -1)
    const flags: Record<string, number> = {}
    for (const t of exhaustAllButOne) flags[`ambient_${t.id}`] = 1
    const pick = pickAmbientDrip(mockPlayer({ activeFlags: flags }))
    expect(pick).not.toBeNull()
    expect(pick!.id).toBe(AMBIENT_DRIP_CATALOGUE[AMBIENT_DRIP_CATALOGUE.length - 1].id)
  })
})
