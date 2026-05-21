import type { Network, NetworkArchetype, NetworkNode, NodeType, SecurityTier } from '../types/network.ts'

type Rng = () => number

function mulberry32(seed: number): Rng {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface ArchetypeTemplate {
  nodeCount: [number, number] // [min, max]
  securityRange: [SecurityTier, SecurityTier]
  traceSpeed: [number, number]
  mandatoryNodes: NodeType[]
  optionalNodes: Array<{ type: NodeType; weight: number }>
}

const ARCHETYPES: Record<NetworkArchetype, ArchetypeTemplate> = {
  corporate_intranet: {
    nodeCount: [6, 12],
    securityRange: [2, 4],
    traceSpeed: [15, 35],
    mandatoryNodes: ['entry_point', 'firewall', 'file_server', 'mail_server'],
    optionalNodes: [
      { type: 'database', weight: 0.8 },
      { type: 'intrusion_detector', weight: 0.6 },
      { type: 'admin_console', weight: 0.5 },
      { type: 'proxy', weight: 0.3 },
    ],
  },
  government_classified: {
    nodeCount: [8, 16],
    securityRange: [4, 5],
    traceSpeed: [40, 70],
    mandatoryNodes: ['entry_point', 'firewall', 'intrusion_detector', 'database', 'admin_console'],
    optionalNodes: [
      { type: 'ai_core', weight: 0.4 },
      { type: 'file_server', weight: 0.9 },
      { type: 'proxy', weight: 0.2 },
    ],
  },
  dark_web_node: {
    nodeCount: [3, 7],
    securityRange: [1, 3],
    traceSpeed: [5, 20],
    mandatoryNodes: ['entry_point', 'file_server'],
    optionalNodes: [
      { type: 'database', weight: 0.5 },
      { type: 'proxy', weight: 0.9 },
      { type: 'router', weight: 0.6 },
    ],
  },
  iot_mesh: {
    nodeCount: [10, 25],
    securityRange: [1, 2],
    traceSpeed: [5, 15],
    mandatoryNodes: ['entry_point', 'router'],
    optionalNodes: [
      { type: 'endpoint', weight: 0.95 },
      { type: 'firewall', weight: 0.3 },
    ],
  },
  cloud_infrastructure: {
    nodeCount: [8, 20],
    securityRange: [3, 5],
    traceSpeed: [25, 50],
    mandatoryNodes: ['entry_point', 'firewall', 'database', 'file_server'],
    optionalNodes: [
      { type: 'intrusion_detector', weight: 0.8 },
      { type: 'admin_console', weight: 0.7 },
      { type: 'ai_core', weight: 0.3 },
    ],
  },
  legacy_mainframe: {
    nodeCount: [5, 10],
    securityRange: [2, 4],
    traceSpeed: [20, 40],
    mandatoryNodes: ['entry_point', 'file_server', 'database'],
    optionalNodes: [
      { type: 'admin_console', weight: 0.6 },
      { type: 'router', weight: 0.4 },
    ],
  },
  personal_gateway: {
    nodeCount: [2, 4],
    securityRange: [1, 3],
    traceSpeed: [10, 30],
    mandatoryNodes: ['entry_point', 'file_server'],
    optionalNodes: [
      { type: 'firewall', weight: 0.5 },
      { type: 'endpoint', weight: 0.7 },
    ],
  },
}

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t)
}

function pickFromRange(rng: Rng, [min, max]: [number, number]): number {
  return Math.floor(rng() * (max - min + 1)) + min
}

function layoutNodes(nodes: NetworkNode[], rng: Rng): NetworkNode[] {
  const radius = 300
  const cx = 400
  const cy = 300
  return nodes.map((node, i) => {
    const angle = (i / nodes.length) * 2 * Math.PI + rng() * 0.3
    const r = radius * (0.5 + rng() * 0.5)
    return {
      ...node,
      position: {
        x: Math.round(cx + r * Math.cos(angle)),
        y: Math.round(cy + r * Math.sin(angle)),
      },
    }
  })
}

function connectNodes(nodes: NetworkNode[], rng: Rng): NetworkNode[] {
  const result = nodes.map((n) => ({ ...n, connectedTo: [] as string[] }))
  // Ensure a spanning tree so every node is reachable from entry
  for (let i = 1; i < result.length; i++) {
    const parent = result[Math.floor(rng() * i)]
    result[i].connectedTo.push(parent.id)
    parent.connectedTo.push(result[i].id)
  }
  // Add a few random extra edges for mesh-like feel
  const extraEdges = Math.floor(rng() * nodes.length * 0.3)
  for (let e = 0; e < extraEdges; e++) {
    const a = Math.floor(rng() * result.length)
    const b = Math.floor(rng() * result.length)
    if (a !== b && !result[a].connectedTo.includes(result[b].id)) {
      result[a].connectedTo.push(result[b].id)
      result[b].connectedTo.push(result[a].id)
    }
  }
  return result
}

export function generateNetwork(
  archetype: NetworkArchetype,
  ownerId: string,
  seed: number,
  label?: string,
): Network {
  const rng = mulberry32(seed)
  const template = ARCHETYPES[archetype]

  const nodeCount = pickFromRange(rng, template.nodeCount)
  const traceSpeed = pickFromRange(rng, template.traceSpeed)
  const tier = lerp(
    template.securityRange[0],
    template.securityRange[1],
    rng(),
  ) as SecurityTier

  const nodeTypes: NodeType[] = [...template.mandatoryNodes]
  while (nodeTypes.length < nodeCount) {
    const weighted = template.optionalNodes.filter(
      (o) => rng() < o.weight && !nodeTypes.includes(o.type),
    )
    if (weighted.length === 0) break
    const pick = weighted[Math.floor(rng() * weighted.length)]
    nodeTypes.push(pick.type)
  }

  const rawNodes: NetworkNode[] = nodeTypes.map((type, i) => ({
    id: `node_${seed}_${i}`,
    type,
    label: type.replace(/_/g, ' '),
    securityTier: Math.max(1, Math.min(5, tier + Math.round(rng() * 2 - 1))) as SecurityTier,
    isBreached: false,
    isActive: true,
    services: [],
    files: [],
    connectedTo: [],
    position: { x: 0, y: 0 },
  }))

  const connected = connectNodes(rawNodes, rng)
  const laid = layoutNodes(connected, rng)

  return {
    id: `net_${seed}`,
    archetype,
    ownerId,
    label: label ?? `${archetype.replace(/_/g, ' ')} [${seed.toString(16)}]`,
    nodes: laid,
    entryNodeId: laid[0].id,
    seed,
    createdAt: Date.now(),
    traceSpeed,
    activeAdmins: 0,
  }
}
