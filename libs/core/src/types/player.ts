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
  gpuTier?: number      // GPU acceleration for brute-force + required for ai_core breaches
  coolingTier?: number  // 0 = passive (default), 1 = active, 2 = cryo (no thermal throttle)
}

export interface PlayerSoftware {
  passwordCrackers: ToolInstance[]
  proxies: ToolInstance[]
  firewallBypassers: ToolInstance[]
  logDeleters: ToolInstance[]
  portScanners: ToolInstance[]
  sniffers?: ToolInstance[]            // M14h — passive packet capture
  memoryScrapers?: ToolInstance[]      // M14h — standalone memory scrape
  antiForensics?: ToolInstance[]       // M14h — reduces evidence per breach
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
  darkcoin?: number                            // alt currency (volatile vs Cr)
  stockHoldings?: Record<string, StockHolding> // keyed by stock id
  consumables?: Record<string, number>         // M14h — consumable id → quantity

  // M14h.5 — banking notoriety / "grid presence".
  // Tracks how visible the player is on financial monitoring networks.
  // Public banks (Global Trust, Pacific National) tick this UP — bigger
  // balances = more attention. Offshore banks (Cayman, Zurich) tick it DOWN.
  // At mission start, `notoriety * 0.10 %/s` is added to baseRate, so a
  // high-notoriety player begins under heavier passive trace pressure.
  // Range clamped [-5, +10]. 0 = neutral.
  notoriety?: number

  // M14j — saved loadout presets.
  // Each loadout captures the player's pre-mission setup: which relay nodes
  // to chain (in order), which exfiltration channel to default to, and which
  // consumable to auto-arm. Applying a loadout is a one-click swap; the
  // current state can be overwritten back into the loadout at any time.
  // The first 3 loadouts (`stealth`, `brute`, `bankrun`) are seeded as
  // presets and cannot be deleted, though they can be overwritten.
  loadouts?: Loadout[]
  activeLoadoutId?: string | null

  // M14k — installed implants (permanent, irreversible). Array of implant
  // IDs from data/implants.ts. Buffs computed via helpers in that module.
  implants?: string[]

  // M14l — physical-location gateway. Default 'home' if unset. Some gateways
  // charge weekly rent — `gatewayPaidUntil` tracks the expiry timestamp per
  // gateway ID. When `Date.now() > gatewayPaidUntil[id]`, the next weekly
  // tick will attempt to charge rent; if the player can't pay they're
  // evicted back to 'home'.
  activeGatewayId?: string
  ownedGateways?: string[]  // unlocked via unlockCost — 'home' is always free
  gatewayPaidUntil?: Record<string, number>

  // M14i — Research Tech Tree.
  researchPoints?: number          // unspent RP
  researchUnlocked?: string[]      // node IDs unlocked
}

export type ExfilChannelId = 'direct' | 'tunnel' | 'dns' | 'icmp'

export interface Loadout {
  id: string
  name: string
  icon: string              // single char / emoji for the chip
  isPreset: boolean         // first 3 cannot be deleted
  preferredRoute: string[]  // bounce node IDs in order
  exfilChannel: ExfilChannelId
  armedConsumableId: string | null
  createdAt: number
  updatedAt: number
}

export interface BankAccount {
  bankId: string
  balance: number             // current deposited credits
  apr: number                 // annual percentage rate (0.025 = 2.5%)
  openedAt: number            // unix ms
  lastInterestTickAt: number  // unix ms — used to compute accrual
  totalInterestEarned: number
  loanPrincipal?: number      // current outstanding loan principal at this bank
  loanRate?: number           // APR on the loan (set when loan taken)
  loanTakenAt?: number        // unix ms
  loanLastInterestTickAt?: number
  loanTotalInterestAccrued?: number
}

export interface StockHolding {
  stockId: string
  shares: number
  costBasis: number   // total spent (Cr) to acquire current shares — for P&L
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
