export type PlayerId = string

export type Specialization = 'ghost' | 'brute' | 'social' | 'architect'

export type BounceNodeTier = 1 | 2 | 3

export interface BounceNode {
  id: string
  label: string
  region: string
  tier: BounceNodeTier
  logStatus: 'clean' | 'dirty' | 'traced'
  addedAt: number // unix ms
}

export type FactionId = 'voidlink_international' | 'arunmor' | 'revelation' | 'underground' | string

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
  email: string
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
  bounceLibrary: BounceNode[]
  faction: FactionData | null
  bankAccounts?: Record<string, BankAccount>  // keyed by bank target id (e.g. 'globalbank')
}

export interface BankAccount {
  bankId: string
  balance: number        // current deposited credits
  apr: number            // annual percentage rate (0.025 = 2.5%)
  openedAt: number       // unix ms
  lastInterestTickAt: number  // unix ms — used to compute accrual
  totalInterestEarned: number
}

export interface PlayerStats {
  totalMissions: number
  successfulBreaches: number
  traceEscapes: number
  traceFailures: number
  creditsEarned: number
  creditsSpent: number
  hoursPlayed: number
  xp: number
  level: number
}

export interface FactionData {
  id: string
  name: string
  tag: string       // e.g. [NULL] — max 6 chars
  description: string
  createdAt: number
  founderHandle: string
  memberHandles: string[]
  inviteCode: string
}
