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

interface ServiceTemplate { protocol: string; port: number; versions: string[]; vulnChance: number; vulnId: string }

const SERVICE_TEMPLATES: Partial<Record<NodeType, ServiceTemplate[]>> = {
  entry_point:   [{ protocol: 'SSH',   port: 22,  versions: ['7.4', '8.2', '8.9'],          vulnChance: 0.3, vulnId: 'CVE-2023-38408' },
                  { protocol: 'HTTP',  port: 80,  versions: ['Apache/2.4.51', 'nginx/1.22'], vulnChance: 0.2, vulnId: 'CVE-2021-41773' }],
  firewall:      [{ protocol: 'ICMP',  port: 0,   versions: ['1.0', '2.1'],                  vulnChance: 0.15, vulnId: 'CVE-2020-14871' },
                  { protocol: 'SNMP',  port: 161, versions: ['v2c', 'v3'],                   vulnChance: 0.25, vulnId: 'CVE-2022-20919' }],
  file_server:   [{ protocol: 'FTP',   port: 21,  versions: ['vsftpd 3.0', 'ProFTPD 1.3'],  vulnChance: 0.4, vulnId: 'CVE-2020-9470' },
                  { protocol: 'SMB',   port: 445, versions: ['3.0.11', '3.1.1'],             vulnChance: 0.35, vulnId: 'CVE-2020-0796' }],
  database:      [{ protocol: 'MySQL', port: 3306, versions: ['8.0.26', '5.7.35'],           vulnChance: 0.3, vulnId: 'CVE-2021-2307' },
                  { protocol: 'PostgreSQL', port: 5432, versions: ['13.4', '14.1'],          vulnChance: 0.2, vulnId: 'CVE-2021-3393' }],
  mail_server:   [{ protocol: 'SMTP',  port: 25,  versions: ['Postfix 3.5', 'Exim 4.94'],   vulnChance: 0.35, vulnId: 'CVE-2020-28017' },
                  { protocol: 'IMAP',  port: 143, versions: ['Dovecot 2.3.13'],              vulnChance: 0.2, vulnId: 'CVE-2021-29157' }],
  router:        [{ protocol: 'Telnet', port: 23, versions: ['1.0', '2.0'],                  vulnChance: 0.5, vulnId: 'CVE-2018-9866' },
                  { protocol: 'RIP',   port: 520, versions: ['v1', 'v2'],                    vulnChance: 0.3, vulnId: 'CVE-2019-12299' }],
  admin_console: [{ protocol: 'RDP',   port: 3389, versions: ['6.1', '7.0'],                vulnChance: 0.45, vulnId: 'CVE-2019-0708' },
                  { protocol: 'HTTPS', port: 443, versions: ['Apache/2.4.49', 'nginx/1.20'], vulnChance: 0.25, vulnId: 'CVE-2021-41773' }],
  intrusion_detector: [{ protocol: 'SYSLOG', port: 514, versions: ['rsyslog 8.2', 'syslog-ng 3.31'], vulnChance: 0.1, vulnId: 'CVE-2022-24903' }],
  endpoint:      [{ protocol: 'RDP',   port: 3389, versions: ['6.1', '7.0'],                vulnChance: 0.4, vulnId: 'CVE-2019-0708' }],
  ai_core:       [{ protocol: 'HTTPS', port: 8443, versions: ['TensorFlow Serving 2.5'],    vulnChance: 0.2, vulnId: 'CVE-2022-29216' }],
  proxy:         [{ protocol: 'SOCKS5', port: 1080, versions: ['3proxy 0.9', 'Squid 5.2'],  vulnChance: 0.15, vulnId: 'CVE-2020-25097' }],
}

function generateServices(type: NodeType, tier: SecurityTier, rng: Rng): import('../types/network.ts').NetworkService[] {
  const templates = SERVICE_TEMPLATES[type] ?? []
  return templates
    .filter(() => rng() > 0.25) // ~75% chance each service is present
    .map((t) => {
      const version = t.versions[Math.floor(rng() * t.versions.length)]
      // Higher tiers have lower vuln chance (better patching)
      const vulnRoll = rng() < t.vulnChance * (1 - (tier - 1) * 0.15)
      return {
        protocol: t.protocol,
        port: t.port,
        version,
        hasKnownVulnerability: vulnRoll,
        vulnerabilityId: vulnRoll ? t.vulnId : undefined,
      }
    })
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

  const rawNodes: NetworkNode[] = nodeTypes.map((type, i) => {
    const nodeTier = Math.max(1, Math.min(5, tier + Math.round(rng() * 2 - 1))) as SecurityTier
    return {
      id: `node_${seed}_${i}`,
      type,
      label: type.replace(/_/g, ' '),
      securityTier: nodeTier,
      isBreached: false,
      isScanned: false,
      isActive: true,
      isLogWiped: false,
      services: generateServices(type, nodeTier, rng),
      files: [],
      connectedTo: [],
      position: { x: 0, y: 0 },
    }
  })

  const connected = connectNodes(rawNodes, rng)
  const laid = layoutNodes(connected, rng)
  const zoned = assignZones(laid, archetype)

  // M14f.1 — seed canary files on data-bearing nodes if the network has IDS
  // coverage. Chance scales with node tier (T1=10%, T5=50%) so high-value
  // government and corporate networks are riskier to rummage through.
  const hasIDS = zoned.some((n) => n.type === 'intrusion_detector')
  if (hasIDS) {
    const DATA_TYPES = new Set<NodeType>(['file_server', 'database', 'mail_server'])
    for (const node of zoned) {
      if (!DATA_TYPES.has(node.type)) continue
      const chance = node.securityTier * 0.10
      if (rng() < chance) {
        node.files.push({
          id: `canary_${node.id}_${seed}`,
          // Innocuous-looking names — these are the trap.
          name: rng() < 0.5 ? 'payroll_q3.enc' : 'access_audit.log',
          sizeKb: 2 + Math.floor(rng() * 14),
          isEncrypted: rng() < 0.5,
          isLog: false,
          isCanary: true,
        })
      }
    }
  }

  return {
    id: `net_${seed}`,
    archetype,
    ownerId,
    label: label ?? `${archetype.replace(/_/g, ' ')} [${seed.toString(16)}]`,
    nodes: zoned,
    entryNodeId: zoned[0].id,
    seed,
    createdAt: Date.now(),
    traceSpeed,
    activeAdmins: 0,
  }
}

function assignZones(nodes: NetworkNode[], archetype: NetworkArchetype): NetworkNode[] {
  if (archetype !== 'government_classified' && archetype !== 'cloud_infrastructure') {
    return nodes
  }

  // Zone A: perimeter-facing node types; Zone B: internal/sensitive types
  const ZONE_A_TYPES = new Set<NodeType>(['entry_point', 'firewall', 'intrusion_detector', 'proxy', 'router'])
  const ZONE_B_TYPES = new Set<NodeType>(['database', 'ai_core', 'file_server'])
  // admin_console: act as the pivot — zone A but connects to zone B

  const result = nodes.map((n) => {
    if (ZONE_A_TYPES.has(n.type) || n.type === 'admin_console') {
      return { ...n, zone: 'A' as const }
    }
    if (ZONE_B_TYPES.has(n.type)) {
      return { ...n, zone: 'B' as const }
    }
    return { ...n, zone: 'A' as const }
  })

  // Mark admin_console(s) as pivot nodes — they bridge zone A to zone B
  const pivotIdx = result.findIndex((n) => n.type === 'admin_console')
  if (pivotIdx >= 0) {
    result[pivotIdx] = { ...result[pivotIdx], isPivotNode: true }
  }

  return result
}
