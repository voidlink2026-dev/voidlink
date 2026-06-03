// Bank target definitions — referenced by WorldMap and bank operations.
// The `id` matches WORLD_TARGETS entries so the player can click them on the globe.

export interface BankDef {
  id: string
  name: string
  shortLabel: string
  apr: number               // annual percentage rate (savings) — M14h.5 inflated to game-time scale
  openCost: number          // credits to open an account
  region: string
  flavour: string           // 1-line description shown in panel
  loanRate: number          // APR charged on borrowed funds
  maxLoanMultiplier: number // max loan = player.credits * this (offered before rep gating)
  offshore?: boolean        // if true: laundering account, heat reduction, harder to access
  // M14h.5 — financial "grid presence" delta per hour per 10 000 Cr of balance.
  // Positive values raise the player's notoriety (more passive trace pressure
  // at mission start); negative values launder it down. Range typically
  // [-0.6, +0.8].
  notorietyPerHour: number
  features: BankFeature[]
}

export type BankFeature = 'savings' | 'loans' | 'trade' | 'stocks'

export const BANKS: BankDef[] = [
  {
    id: 'globalbank',
    name: 'Global Trust Bank',
    shortLabel: 'GLOBAL TRUST',
    apr: 0.12,
    openCost: 500,
    loanRate: 0.18,
    maxLoanMultiplier: 2,
    region: 'US-EAST',
    flavour: 'New York. Conservative retail bank — moderate yield, full services, reports to every audit body.',
    notorietyPerHour: 0.4,
    features: ['savings', 'loans', 'trade', 'stocks'],
  },
  {
    id: 'pacificbank',
    name: 'Pacific National',
    shortLabel: 'PACIFIC NATIONAL',
    apr: 0.22,
    openCost: 750,
    loanRate: 0.24,
    maxLoanMultiplier: 3,
    region: 'US-WEST',
    flavour: 'San Francisco. High-yield aggressive growth fund — best returns, heaviest paper trail.',
    notorietyPerHour: 0.8,
    features: ['savings', 'loans', 'trade', 'stocks'],
  },
  {
    id: 'caymantrust',
    name: 'Cayman Trust Offshore',
    shortLabel: 'CAYMAN OFFSHORE',
    apr: 0.06,
    openCost: 5000,
    loanRate: 0.20,
    maxLoanMultiplier: 0,
    offshore: true,
    region: 'CAYMAN',
    flavour: 'Cayman Islands. Numbered offshore haven. Modest yield, but every Cr held washes notoriety.',
    notorietyPerHour: -0.6,
    features: ['savings'],
  },
  {
    id: 'zurichvault',
    name: 'Zurich Vault',
    shortLabel: 'ZURICH VAULT',
    apr: 0.15,
    openCost: 8000,
    loanRate: 0.14,
    maxLoanMultiplier: 1,
    offshore: true,
    region: 'EU-SOUTH',
    flavour: 'Zurich. Discreet numbered accounts — strong yield, light notoriety reduction, private lending.',
    notorietyPerHour: -0.3,
    features: ['savings', 'loans'],
  },
]

export function getBank(id: string): BankDef | null {
  return BANKS.find((b) => b.id === id) ?? null
}

// ── Equities ──────────────────────────────────────────────────────────────────
export interface StockDef {
  id: string
  ticker: string
  name: string
  basePrice: number         // anchor price (Cr)
  volatility: number        // 0–1 — daily noise scale
}

export const STOCKS: StockDef[] = [
  { id: 'ARMR',  ticker: 'ARMR',  name: 'Arunmor Corp',         basePrice: 245, volatility: 0.025 },
  { id: 'ARES',  ticker: 'ARES',  name: 'Ares Defence Group',    basePrice: 612, volatility: 0.012 },
  { id: 'INTC',  ticker: 'INTC',  name: 'Internic Holdings',     basePrice: 88,  volatility: 0.04 },
  { id: 'GTBK',  ticker: 'GTBK',  name: 'Global Trust Bank',     basePrice: 178, volatility: 0.018 },
]

export function getStock(id: string): StockDef | null {
  return STOCKS.find((s) => s.id === id) ?? null
}
