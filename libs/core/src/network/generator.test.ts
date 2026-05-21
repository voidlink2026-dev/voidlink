import { describe, it, expect } from 'vitest'
import { generateNetwork } from './generator.ts'

const SEED = 0xdeadbeef

describe('generateNetwork', () => {
  it('produces a deterministic result for the same seed', () => {
    const a = generateNetwork('corporate_intranet', 'owner', SEED)
    const b = generateNetwork('corporate_intranet', 'owner', SEED)
    expect(a.nodes.length).toBe(b.nodes.length)
    expect(a.nodes.map((n) => n.type)).toEqual(b.nodes.map((n) => n.type))
    expect(a.traceSpeed).toBe(b.traceSpeed)
  })

  it('produces different results for different seeds', () => {
    const a = generateNetwork('corporate_intranet', 'owner', SEED)
    const b = generateNetwork('corporate_intranet', 'owner', SEED + 1)
    // Very unlikely to be identical with different seeds
    const aTypes = a.nodes.map((n) => n.type).join(',')
    const bTypes = b.nodes.map((n) => n.type).join(',')
    expect(aTypes).not.toBe(bTypes)
  })

  it('always includes mandatory nodes for each archetype', () => {
    const corporate = generateNetwork('corporate_intranet', 'owner', SEED)
    const types = corporate.nodes.map((n) => n.type)
    expect(types).toContain('entry_point')
    expect(types).toContain('firewall')
    expect(types).toContain('file_server')
    expect(types).toContain('mail_server')
  })

  it('government_classified always has entry_point, firewall, intrusion_detector, database', () => {
    const gov = generateNetwork('government_classified', 'owner', SEED)
    const types = gov.nodes.map((n) => n.type)
    expect(types).toContain('entry_point')
    expect(types).toContain('firewall')
    expect(types).toContain('intrusion_detector')
    expect(types).toContain('database')
  })

  it('personal_gateway stays within its node count range [2, 4]', () => {
    for (let s = 0; s < 20; s++) {
      const net = generateNetwork('personal_gateway', 'owner', s * 1337)
      expect(net.nodes.length).toBeGreaterThanOrEqual(2)
      expect(net.nodes.length).toBeLessThanOrEqual(4)
    }
  })

  it('all nodes have valid positions (within SVG viewBox 800×600)', () => {
    const net = generateNetwork('corporate_intranet', 'owner', SEED)
    for (const node of net.nodes) {
      expect(node.position.x).toBeGreaterThanOrEqual(0)
      expect(node.position.x).toBeLessThanOrEqual(800)
      expect(node.position.y).toBeGreaterThanOrEqual(0)
      expect(node.position.y).toBeLessThanOrEqual(600)
    }
  })

  it('every node is reachable from entry_point (spanning tree guarantee)', () => {
    const net = generateNetwork('corporate_intranet', 'owner', SEED)
    const visited = new Set<string>()
    const queue = [net.entryNodeId]
    while (queue.length) {
      const id = queue.shift()!
      if (visited.has(id)) continue
      visited.add(id)
      const node = net.nodes.find((n) => n.id === id)!
      for (const neighbourId of node.connectedTo) {
        if (!visited.has(neighbourId)) queue.push(neighbourId)
      }
    }
    expect(visited.size).toBe(net.nodes.length)
  })

  it('security tiers are within the archetype range for government_classified [4, 5]', () => {
    const net = generateNetwork('government_classified', 'owner', SEED)
    for (const node of net.nodes) {
      expect(node.securityTier).toBeGreaterThanOrEqual(3) // allow ±1 variance
      expect(node.securityTier).toBeLessThanOrEqual(5)
    }
  })

  it('uses the provided label when given', () => {
    const net = generateNetwork('dark_web_node', 'owner', SEED, 'Test Label')
    expect(net.label).toBe('Test Label')
  })

  it('generates a default label when no label provided', () => {
    const net = generateNetwork('dark_web_node', 'owner', SEED)
    expect(net.label).toContain('dark web node')
  })

  it('sets entryNodeId to the first node', () => {
    const net = generateNetwork('personal_gateway', 'owner', SEED)
    expect(net.entryNodeId).toBe(net.nodes[0].id)
  })

  it('trace speed is within the archetype range for iot_mesh [5, 15]', () => {
    for (let s = 0; s < 20; s++) {
      const net = generateNetwork('iot_mesh', 'owner', s * 999)
      expect(net.traceSpeed).toBeGreaterThanOrEqual(5)
      expect(net.traceSpeed).toBeLessThanOrEqual(15)
    }
  })
})
