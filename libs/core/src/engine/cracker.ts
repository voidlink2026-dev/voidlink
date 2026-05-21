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
}

export function startCrackJob(
  nodeId: string,
  method: CrackMethod,
  toolId: string,
  toolLevel: number,
  node: NetworkNode,
  hardware: PlayerHardware,
): CrackJob {
  const baseDuration = computeBaseDuration(method, node.securityTier)
  const levelBonus = 1 - (toolLevel - 1) * 0.12 // each level = 12% faster
  const cpuBonus = 1 - Math.min(0.4, (hardware.cpuSpeed - 1) * 0.05)
  const durationMs = Math.max(1000, baseDuration * levelBonus * cpuBonus)

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
