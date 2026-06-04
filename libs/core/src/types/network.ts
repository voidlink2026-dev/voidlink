export type NodeId = string
export type NetworkId = string

export type NodeType =
  | 'entry_point'
  | 'firewall'
  | 'router'
  | 'file_server'
  | 'database'
  | 'mail_server'
  | 'intrusion_detector'
  | 'proxy'
  | 'endpoint'
  | 'admin_console'
  | 'ai_core'

export type SecurityTier = 1 | 2 | 3 | 4 | 5

export type NetworkArchetype =
  | 'corporate_intranet'
  | 'government_classified'
  | 'dark_web_node'
  | 'iot_mesh'
  | 'cloud_infrastructure'
  | 'legacy_mainframe'
  | 'personal_gateway'

export interface NetworkNode {
  id: NodeId
  type: NodeType
  label: string
  securityTier: SecurityTier
  isBreached: boolean
  isScanned: boolean  // true after player runs port scan
  isActive: boolean  // powered on / online
  isLogWiped: boolean // true after player wipes logs on this node
  // M14f.1 — timestomping state. Even after a clean wipe, the timestamps on
  // remaining files give away the access pattern unless stomped. Without a
  // timestomper tool the wipe leaves "ghost evidence" → cross-session heat.
  isTimestomped?: boolean
  services: NetworkService[]
  files: FileEntry[]
  connectedTo: NodeId[]
  position: { x: number; y: number } // for network map rendering
  // M13 additions
  zone?: 'A' | 'B'            // subnet zone (gov/cloud networks only); zone B requires pivot
  isPivotNode?: boolean        // bridges zone A → zone B
  isLockedOut?: boolean        // brute-force lockout active
  lockoutUntil?: number        // unix ms — lockout expires
  failedCrackAttempts?: number // used by brute lockout
  exploitedVia?: string        // protocol used to breach (e.g. 'FTP', 'RDP')
  adminSuppressedUntil?: number // RDP exploit: admin rate suppressed until this time
  // ── M15 ────────────────────────────────────────────────────────────────
  hasRoot?: boolean             // player has escalated privileges on this node
  hasBackdoor?: boolean         // persistent backdoor planted; future missions start with this node pre-breached
}

export interface NetworkService {
  protocol: string  // 'SSH' | 'HTTP' | 'FTP' | 'SMB' | 'RDP' etc.
  port: number
  version: string
  hasKnownVulnerability: boolean
  vulnerabilityId?: string
}

export interface FileEntry {
  id: string
  name: string
  sizeKb: number
  isEncrypted: boolean
  isLog: boolean
  content?: string // only loaded when accessed
  missionObjective?: string // mission ID this file satisfies
  // M14f.1 — canary files. Touched → big trace spike + persistent heat flag.
  // Hidden in the HI file list unless the player has port_scanner_stealth
  // or sniffer_v2; otherwise looks identical to any other file.
  isCanary?: boolean
}

export interface Network {
  id: NetworkId
  archetype: NetworkArchetype
  ownerId: string // corporation/NPC/player ID
  label: string
  nodes: NetworkNode[]
  entryNodeId: NodeId
  seed: number // for deterministic generation
  createdAt: number
  traceSpeed: number // 0–100, how fast trace accumulates on this network
  activeAdmins: number // 0 = no one watching; higher = more dangerous
}
