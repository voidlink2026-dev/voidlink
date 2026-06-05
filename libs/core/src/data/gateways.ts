// M14l — Physical-location gateways.
//
// The "where you're actually sitting" layer. Switching gateway changes the
// starting trace pressure on every mission and (in one case) halves the rate
// at which your bank holdings accrue notoriety.
//
// Some gateways cost rent — charged once per in-game week. If the player
// can't pay rent, they're evicted back to HOME automatically.

import type { PlayerProfile } from '../types/player.ts'

export interface GatewayDefinition {
  id: string
  name: string
  region: string
  description: string
  // Multipliers (1.0 = neutral). Applied AFTER the implant + notoriety adders.
  traceBaseRateMul: number
  notorietyAccrualMul: number  // 1.0 = normal, 0.5 = Corporate VPN
  // Rent in Cr per in-game week. 0 = no rent. Charged at first weekly tick
  // after `gatewayPaidUntil[id]` expires.
  rentPerWeek: number
  unlockCost: number  // one-off acquisition fee
  // For UI affordance
  effectLabel: string
}

export const GATEWAYS: GatewayDefinition[] = [
  {
    id: 'home',
    name: 'Home Gateway',
    region: 'YOUR APARTMENT',
    description: 'Your stock residential ISP connection. No edge, no risk, no rent.',
    traceBaseRateMul: 1.0,
    notorietyAccrualMul: 1.0,
    rentPerWeek: 0,
    unlockCost: 0,
    effectLabel: 'Neutral baseline',
  },
  {
    id: 'safehouse',
    name: 'Safehouse',
    region: 'UNDISCLOSED — EU-WEST',
    description: 'An off-grid apartment paid for in cash. Hardened uplink, swept weekly. Lowers passive trace pressure 10%, but the rent never stops.',
    traceBaseRateMul: 0.9,
    notorietyAccrualMul: 1.0,
    rentPerWeek: 5_000,
    unlockCost: 15_000,
    effectLabel: 'Trace baseline ×0.90 · Rent 5 000 Cr/wk',
  },
  {
    id: 'corp_vpn',
    name: 'Corporate VPN',
    region: 'BORROWED ROUTE',
    description: 'You\'re piggybacking on the daily traffic of a mid-tier corporation. Heavier surveillance baseline (+15% trace), but your bank holdings draw HALF the financial-grid attention they normally would.',
    traceBaseRateMul: 1.15,
    notorietyAccrualMul: 0.5,
    rentPerWeek: 0,
    unlockCost: 25_000,
    effectLabel: 'Trace baseline ×1.15 · Notoriety accrual ×0.50',
  },
  {
    id: 'tor_relay',
    name: 'Tor-style Community Relay',
    region: 'ROTATING — GLOBAL',
    description: 'Free volunteer-run mesh of relays. Exit node rotates every 3 in-game days through a different country. Big trace reduction, but ZERO uptime guarantee and the route can collapse mid-mission (cosmetic flavour — no mechanical penalty yet).',
    traceBaseRateMul: 0.8,
    notorietyAccrualMul: 1.0,
    rentPerWeek: 0,
    unlockCost: 40_000,
    effectLabel: 'Trace baseline ×0.80',
  },
]

export function getGateway(id: string): GatewayDefinition | null {
  return GATEWAYS.find((g) => g.id === id) ?? null
}

export function getActiveGateway(player: PlayerProfile | null): GatewayDefinition {
  const id = player?.activeGatewayId ?? 'home'
  return getGateway(id) ?? GATEWAYS[0]
}

export function gatewayBaseRateMul(player: PlayerProfile | null): number {
  return getActiveGateway(player).traceBaseRateMul
}

export function gatewayNotorietyMul(player: PlayerProfile | null): number {
  return getActiveGateway(player).notorietyAccrualMul
}
