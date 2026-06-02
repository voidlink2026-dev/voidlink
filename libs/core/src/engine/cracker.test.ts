import { describe, it, expect, vi } from 'vitest'
import { computeBaseDuration, startCrackJob, tickCrackJob } from './cracker.ts'
import type { NetworkNode } from '../types/network.ts'
import type { PlayerHardware } from '../types/player.ts'

const mockNode = (tier: number): NetworkNode => ({
  id: 'node_test',
  type: 'file_server',
  label: 'file server',
  securityTier: tier as NetworkNode['securityTier'],
  isBreached: false,
  isScanned: false,
  isActive: true,
  isLogWiped: false,
  services: [],
  files: [],
  connectedTo: [],
  position: { x: 0, y: 0 },
})

const baseHardware: PlayerHardware = {
  cpuSpeed: 1,
  ramSlots: 2,
  hddCapacity: 10,
  modemSpeed: 10,
  gatewayBandwidth: 10,
}

describe('computeBaseDuration', () => {
  it('scales with tier squared', () => {
    const tier1 = computeBaseDuration('dictionary', 1)
    const tier2 = computeBaseDuration('dictionary', 2)
    // tier 1 = 1*1*8000 = 8000, tier 2 = 4*8000 = 32000
    expect(tier1).toBe(8000)
    expect(tier2).toBe(32000)
  })

  it('exploit is fastest, brute_force is slowest', () => {
    const exploit = computeBaseDuration('exploit', 2)
    const dict = computeBaseDuration('dictionary', 2)
    const brute = computeBaseDuration('brute_force', 2)
    expect(exploit).toBeLessThan(dict)
    expect(dict).toBeLessThan(brute)
  })
})

describe('startCrackJob', () => {
  it('creates a job with progress 0 and isComplete false', () => {
    vi.useFakeTimers()
    vi.setSystemTime(1000)
    const job = startCrackJob('node_test', 'dictionary', 'cracker_basic', 1, mockNode(1), baseHardware)
    expect(job.progress).toBe(0)
    expect(job.isComplete).toBe(false)
    expect(job.isFailed).toBe(false)
    expect(job.nodeId).toBe('node_test')
    vi.useRealTimers()
  })

  it('higher tool level produces shorter duration', () => {
    vi.useFakeTimers()
    vi.setSystemTime(1000)
    const job1 = startCrackJob('n', 'dictionary', 'cracker_basic', 1, mockNode(2), baseHardware)
    const job5 = startCrackJob('n', 'dictionary', 'cracker_adv', 5, mockNode(2), baseHardware)
    expect(job5.durationMs).toBeLessThan(job1.durationMs)
    vi.useRealTimers()
  })

  it('higher cpu speed produces shorter duration', () => {
    vi.useFakeTimers()
    vi.setSystemTime(1000)
    const fastHardware: PlayerHardware = { ...baseHardware, cpuSpeed: 5 }
    const slow = startCrackJob('n', 'dictionary', 'cracker_basic', 1, mockNode(2), baseHardware)
    const fast = startCrackJob('n', 'dictionary', 'cracker_basic', 1, mockNode(2), fastHardware)
    expect(fast.durationMs).toBeLessThan(slow.durationMs)
    vi.useRealTimers()
  })

  it('duration has a floor of 800ms regardless of bonuses (M13 lowered the floor for fast-protocol exploits)', () => {
    vi.useFakeTimers()
    vi.setSystemTime(1000)
    const overpoweredHardware: PlayerHardware = { ...baseHardware, cpuSpeed: 100 }
    const job = startCrackJob('n', 'exploit', 'cracker_elite', 10, mockNode(1), overpoweredHardware)
    expect(job.durationMs).toBeGreaterThanOrEqual(800)
    vi.useRealTimers()
  })
})

describe('tickCrackJob', () => {
  it('returns progress 0 at start time', () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const job = startCrackJob('n', 'dictionary', 'cracker_basic', 1, mockNode(1), baseHardware)
    const ticked = tickCrackJob(job, 0)
    expect(ticked.progress).toBe(0)
    expect(ticked.isComplete).toBe(false)
    vi.useRealTimers()
  })

  it('marks complete when elapsed >= durationMs', () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const job = startCrackJob('n', 'dictionary', 'cracker_basic', 1, mockNode(1), baseHardware)
    const ticked = tickCrackJob(job, job.startedAt + job.durationMs)
    expect(ticked.isComplete).toBe(true)
    expect(ticked.progress).toBe(1)
    vi.useRealTimers()
  })

  it('does not progress a completed job', () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const job = startCrackJob('n', 'dictionary', 'cracker_basic', 1, mockNode(1), baseHardware)
    const done = tickCrackJob(job, job.startedAt + job.durationMs)
    const again = tickCrackJob(done, job.startedAt + job.durationMs * 2)
    expect(again.progress).toBe(1)
    expect(again.isComplete).toBe(true)
    vi.useRealTimers()
  })

  it('is immutable — does not mutate original job', () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const job = startCrackJob('n', 'dictionary', 'cracker_basic', 1, mockNode(1), baseHardware)
    tickCrackJob(job, job.startedAt + 5000)
    expect(job.progress).toBe(0)
    vi.useRealTimers()
  })
})
