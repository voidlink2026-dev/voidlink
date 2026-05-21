import type { NetworkId } from './network.ts'
import type { PlayerId } from './player.ts'

export type MissionId = string

export type MissionType =
  | 'file_theft'
  | 'account_deletion'
  | 'database_corruption'
  | 'network_sabotage'
  | 'evidence_planting'
  | 'counter_hacking'
  | 'bounty_hunt'
  | 'corporate_espionage'
  | 'story'

export type MissionStatus = 'available' | 'active' | 'completed' | 'failed' | 'expired'

export type MissionDifficulty = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export interface MissionReward {
  credits: number
  reputation: number
  factionStandingDeltas?: Record<string, number>
  unlocks?: string[] // tool IDs, mission IDs, narrative flags
}

export interface MissionObjective {
  id: string
  description: string
  isOptional: boolean
  isCompleted: boolean
  targetNetworkId?: NetworkId
  targetFileId?: string
  targetAccountId?: string
}

export interface MissionBriefing {
  clientHandle: string
  clientAvatarId?: string
  subject: string
  body: string // may contain HTML for formatting
  attachments?: MissionAttachment[]
}

export interface MissionAttachment {
  name: string
  content: string
}

export interface MissionEvent {
  id: string
  triggerCondition: MissionEventTrigger
  message: string
  effect?: MissionEventEffect
}

export type MissionEventTrigger =
  | { type: 'objective_complete'; objectiveId: string }
  | { type: 'trace_threshold'; percent: number }
  | { type: 'time_elapsed'; seconds: number }
  | { type: 'node_breached'; nodeType: string }

export type MissionEventEffect =
  | { type: 'spawn_rival_hacker' }
  | { type: 'raise_trace_speed'; delta: number }
  | { type: 'lock_node'; nodeId: string }
  | { type: 'set_flag'; flag: string; value: boolean | string | number }

export interface Mission {
  id: MissionId
  type: MissionType
  status: MissionStatus
  difficulty: MissionDifficulty
  isStory: boolean
  briefing: MissionBriefing
  objectives: MissionObjective[]
  targetNetworkId: NetworkId
  reward: MissionReward
  events: MissionEvent[]
  assignedTo?: PlayerId
  startedAt?: number
  completedAt?: number
  timeLimitSeconds?: number
  narrativeFlags?: Record<string, boolean | string | number>
}
