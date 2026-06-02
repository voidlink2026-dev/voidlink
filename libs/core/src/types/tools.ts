export type ToolCategory =
  | 'password' | 'firewall' | 'proxy' | 'port_scanner' | 'log' | 'exploit' | 'misc'
  | 'sniffer' | 'memory_scraper' | 'anti_forensic'  // M14h

export interface ConsumableDefinition {
  id: string
  name: string
  description: string
  price: number
  unlockReputation: number
  effect: ConsumableEffect
  /** maximum quantity the player may hold; default 5 */
  maxStack?: number
}

export type ConsumableEffect =
  | { kind: 'panic_disconnect' }     // emergency escape — resets trace + clean exit, but mission abandoned
  | { kind: 'zero_day_pack' }        // adds a vulnerability to the next scanned node automatically
  | { kind: 'decoy_log' }            // injects false intrusion log on a random world node — diverts heat
  | { kind: 'false_flag' }           // attributes your next mission to a different faction
  | { kind: 'rep_token'; amount: number }   // instant reputation
  | { kind: 'cred_pack' }            // pre-acquired credentials for next breach attempt

export interface ToolDefinition {
  id: string
  name: string
  description: string
  category: ToolCategory
  maxLevel: number
  upgradeSlots: number
  baseDurationMs: (level: number, cpuSpeed: number) => number
  ramCost: number // slots consumed while running
  unlockReputation: number
  unlockPrice: number
}

export interface HardwareDefinition {
  id: string
  name: string
  description: string
  slot: keyof import('./player.ts').PlayerHardware
  tier: number
  statBoost: Record<string, number>
  price: number
  unlockReputation: number
}
