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

export interface MissionRequirements {
  minCrackerLevel: number  // minimum cracker tool level in player inventory
  minCpuSpeed: number      // minimum hardware.cpuSpeed
  minReputation: number    // minimum player.reputation
}

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
  requirements: MissionRequirements
  reward: MissionReward
  events: MissionEvent[]
  firedEventIds?: string[]
  assignedTo?: PlayerId
  startedAt?: number
  completedAt?: number
  timeLimitSeconds?: number
  narrativeFlags?: Record<string, boolean | string | number>

  // ── M14m: Multi-phase missions ────────────────────────────────────────
  /** Ordered phases. When set, the mission iterates through them; otherwise it's a single-phase legacy mission. */
  phases?: MissionPhase[]
  /** Zero-based index of the currently active phase (0 by default). Advances when current phase's objectives complete. */
  currentPhaseIndex?: number
  /** When the player completes a phase, a news headline can be queued to fire after disconnect. */
  newsEchoes?: Record<number, MissionNewsEcho>

  // ── M14o: Choice missions ─────────────────────────────────────────────
  /** When set, a phase has just completed AND that phase had choices — the UI presents the player with these options. */
  pendingChoiceFromPhaseIndex?: number
  /** Tracks which choice IDs the player has taken across phases (key = phase index). */
  takenChoices?: Record<number, string>
}

export interface MissionPhase {
  id: string
  /** Short label shown in the HI step guide (e.g. "OSINT", "Breach", "Manipulation", "Cover") */
  label: string
  /** Long description shown when the phase begins */
  description: string
  /** Network archetype for this phase. If omitted, reuses the previous phase's network. */
  targetNetworkId?: NetworkId
  /** Objectives unique to this phase. Phase advances when all non-optional are complete. */
  objectives: MissionObjective[]
  /** Optional per-phase reward (paid on phase complete, not just final mission complete). */
  phaseReward?: MissionReward
  /** Choice this phase offers, if any — branching paths (M14o hook) */
  choices?: MissionChoice[]
}

export interface MissionChoice {
  id: string
  label: string
  description: string
  /** Which phase index to advance to when this choice is taken. Default = next sequential. */
  nextPhaseIndex?: number
  /** Side effects of taking this choice */
  effects?: {
    factionDeltas?: Record<string, number>
    repDelta?: number
    setFlag?: { flag: string; value: boolean | string | number }
  }
}

export interface MissionNewsEcho {
  headline: string
  body: string
  category: 'corporate' | 'crime' | 'tech' | 'player'
  delaySeconds?: number  // seconds after disconnect before the article appears
}
