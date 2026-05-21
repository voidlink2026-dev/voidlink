export type ToolCategory = 'password' | 'firewall' | 'proxy' | 'port_scanner' | 'log' | 'exploit' | 'misc'

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
