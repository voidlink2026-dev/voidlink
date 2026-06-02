// Bank target definitions — referenced by WorldMap and bank operations.
// The `id` matches WORLD_TARGETS entries so the player can click them on the globe.

export interface BankDef {
  id: string
  name: string
  shortLabel: string
  apr: number               // annual percentage rate
  openCost: number          // credits to open an account
  region: string
  flavour: string           // 1-line description shown in panel
}

export const BANKS: BankDef[] = [
  {
    id: 'globalbank',
    name: 'Global Trust Bank',
    shortLabel: 'GLOBAL TRUST',
    apr: 0.025,             // 2.5%
    openCost: 500,
    region: 'US-EAST',
    flavour: 'New York. Conservative, well-secured. Good for long-term savings.',
  },
  {
    id: 'pacificbank',
    name: 'Pacific National',
    shortLabel: 'PACIFIC NATIONAL',
    apr: 0.034,             // 3.4%
    openCost: 750,
    region: 'US-WEST',
    flavour: 'San Francisco. Slightly higher yield. Frequent target for breach attempts.',
  },
]

export function getBank(id: string): BankDef | null {
  return BANKS.find((b) => b.id === id) ?? null
}
