// M14k — Implants / Wetware.
//
// Permanent player buffs purchased from black-market clinics. One-time,
// irreversible (canonically "your body now"). Faction permission gates some
// of them — players need to earn standing before the clinic will install.
//
// Implants are checked from `player.implants?: string[]`. Helpers in this
// file return numeric modifiers consumers can apply directly (no engine
// changes needed beyond reading `hasImplant(player, id)` or the matching
// helper).

import type { PlayerProfile } from '../types/player.ts'

export interface ImplantDefinition {
  id: string
  name: string
  blurb: string
  description: string
  cost: number
  // Faction standing requirement, if any.
  factionId?: string
  factionStandingMin?: number
  // Display-only effect summary (one line shown on the card).
  effectLabel: string
}

export const IMPLANTS: ImplantDefinition[] = [
  {
    id: 'ghost_reflexes',
    name: 'Ghost Reflexes',
    blurb: 'Neural acceleration for forensic-grade muscle memory.',
    description:
      'Subdermal neural implant that pre-empts wipe sequences. Operators describe it as "the keyboard moving before you do".',
    cost: 80_000,
    factionId: 'underground',
    factionStandingMin: 50,
    effectLabel: 'Log-wipe operations 20% faster',
  },
  {
    id: 'brute_synapse',
    name: 'Brute Synapse',
    blurb: 'Off-the-shelf relay augment. Loud, messy, effective.',
    description:
      'Cortex shunt that doubles outgoing packet handling. Your relay software now supports one extra hop on top of its software cap.',
    cost: 120_000,
    effectLabel: 'Max relay-chain hops +1',
  },
  {
    id: 'architect_cortex',
    name: 'Architect Cortex',
    blurb: 'Voidlink-International-issue concurrency module.',
    description:
      'Cleanroom-grade neural co-processor. Lets you run one additional concurrent tool — crack while you scan, wipe while you exfil.',
    cost: 200_000,
    factionId: 'voidlink_international',
    factionStandingMin: 100,
    effectLabel: 'RAM concurrent-tool slots +1',
  },
  {
    id: 'quantum_inhibitor',
    name: 'Quantum Inhibitor',
    blurb: 'Experimental Arunmor wetware. They want it back.',
    description:
      'Phase-shifts your gateway signature. Reduces passive trace pressure on every mission for the rest of your career.',
    cost: 250_000,
    factionId: 'arunmor',
    factionStandingMin: 50,
    effectLabel: 'Passive trace baseline −0.15 %/s',
  },
]

export function getImplant(id: string): ImplantDefinition | null {
  return IMPLANTS.find((i) => i.id === id) ?? null
}

export function hasImplant(player: PlayerProfile | null, id: string): boolean {
  return !!player?.implants?.includes(id)
}

/** +1 if the player has the Brute Synapse implant. */
export function relayHopBonus(player: PlayerProfile | null): number {
  return hasImplant(player, 'brute_synapse') ? 1 : 0
}

/** +1 if the player has the Architect Cortex implant. */
export function ramBonus(player: PlayerProfile | null): number {
  return hasImplant(player, 'architect_cortex') ? 1 : 0
}

/**
 * Multiplier for wipe duration. < 1 = faster.
 * Encapsulates BOTH the Ghost specialization (0.6 — pre-existing) and the
 * Ghost Reflexes implant (× 0.8) so all wipe callsites can share one helper.
 */
export function wipeSpeedMultiplier(player: PlayerProfile | null): number {
  let m = 1
  if (player?.specialization === 'ghost') m *= 0.6
  if (hasImplant(player, 'ghost_reflexes')) m *= 0.8
  return m
}

/** Flat baseRate delta in %/s. Negative = slower trace. */
export function traceBaseRateDelta(player: PlayerProfile | null): number {
  return hasImplant(player, 'quantum_inhibitor') ? -0.15 : 0
}
