import type { NetworkNode } from '../types/network.ts'
import type { PlayerHardware } from '../types/player.ts'

export type CrackMethod = 'brute_force' | 'dictionary' | 'exploit' | 'social_engineering'

export interface CrackJob {
  id: string
  nodeId: string
  method: CrackMethod
  toolId: string
  toolLevel: number
  startedAt: number
  durationMs: number
  progress: number // 0–1
  isComplete: boolean
  isFailed: boolean
  exploitProtocol?: string  // protocol used when method === 'exploit'
}

// Per-protocol exploit multipliers relative to base exploit duration (0.5× of tier^2 * 8s)
const PROTOCOL_EXPLOIT_MULT: Record<string, number> = {
  FTP:        0.35, // anonymous auth bypass — very fast but leaves trace
  Telnet:     0.40, // weak auth
  SSH:        0.60, // key-based, variable
  SMTP:       0.55,
  IMAP:       0.55,
  MySQL:      0.65, // SQL injection
  PostgreSQL: 0.65,
  RDP:        0.70, // session hijack — moderate
  SMB:        0.50, // pass-the-hash
  HTTP:       0.75, // path traversal
  HTTPS:      0.80,
  SNMP:       0.50,
  SYSLOG:     0.55,
  SOCKS5:     0.60,
  ICMP:       0.45,
  RIP:        0.45,
}

export function startCrackJob(
  nodeId: string,
  method: CrackMethod,
  toolId: string,
  toolLevel: number,
  node: NetworkNode,
  hardware: PlayerHardware,
  options?: { exploitProtocol?: string; hasCredentials?: boolean },
): CrackJob {
  const baseDuration = computeBaseDuration(method, node.securityTier)
  const levelBonus = 1 - (toolLevel - 1) * 0.12 // each level = 12% faster
  const cpuBonus = 1 - Math.min(0.4, (hardware.cpuSpeed - 1) * 0.05)

  let protocolMult = 1
  if (method === 'exploit' && options?.exploitProtocol) {
    protocolMult = PROTOCOL_EXPLOIT_MULT[options.exploitProtocol] ?? 1
    // SSH: extra speed if credentials are available
    if (options.exploitProtocol === 'SSH' && options.hasCredentials) {
      protocolMult *= 0.6
    }
  }

  const durationMs = Math.max(800, baseDuration * levelBonus * cpuBonus * protocolMult)

  return {
    id: `crack_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    nodeId,
    method,
    toolId,
    toolLevel,
    startedAt: Date.now(),
    durationMs,
    progress: 0,
    isComplete: false,
    isFailed: false,
    exploitProtocol: method === 'exploit' ? options?.exploitProtocol : undefined,
  }
}

export function tickCrackJob(job: CrackJob, nowMs: number): CrackJob {
  if (job.isComplete || job.isFailed) return job
  const elapsed = nowMs - job.startedAt
  const progress = Math.min(1, elapsed / job.durationMs)
  const isComplete = progress >= 1
  return { ...job, progress, isComplete }
}

export function computeBaseDuration(method: CrackMethod, tier: number): number {
  const tierMs = tier * tier * 8000 // tier 1 = 8s, tier 5 = 200s
  const methodMultiplier: Record<CrackMethod, number> = {
    brute_force: 1.5,
    dictionary: 1.0,
    exploit: 0.5,
    social_engineering: 0.8,
  }
  return tierMs * methodMultiplier[method]
}
