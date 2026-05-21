export type PlayerId = string

export type Specialization = 'ghost' | 'brute' | 'social' | 'architect'

export type FactionId = 'uplink_international' | 'arunmor' | 'revelation' | 'underground' | string

export interface FactionStanding {
  factionId: FactionId
  score: number // -1000 to 1000
  rank: string
}

export interface PlayerHardware {
  cpuSpeed: number      // GHz, affects tool execution time
  ramSlots: number      // Max concurrent tools
  hddCapacity: number   // GB, affects file storage
  modemSpeed: number    // Mbps, affects transfer speed
  gatewayBandwidth: number
}

export interface PlayerSoftware {
  passwordCrackers: ToolInstance[]
  proxies: ToolInstance[]
  firewallBypassers: ToolInstance[]
  logDeleters: ToolInstance[]
  portScanners: ToolInstance[]
  misc: ToolInstance[]
}

export interface ToolInstance {
  toolId: string
  level: number
  version: string
}

export interface PlayerProfile {
  id: PlayerId
  username: string
  handle: string
  avatarId: string
  createdAt: number // unix ms
  lastSeenAt: number
  credits: number
  reputation: number
  rank: number
  specialization: Specialization | null
  factionStandings: FactionStanding[]
  hardware: PlayerHardware
  software: PlayerSoftware
  completedMissions: string[]
  activeFlags: Record<string, boolean | string | number> // narrative state flags
  stats: PlayerStats
}

export interface PlayerStats {
  totalMissions: number
  successfulBreaches: number
  traceEscapes: number
  traceFailures: number
  creditsEarned: number
  creditsSpent: number
  hoursPlayed: number
}
