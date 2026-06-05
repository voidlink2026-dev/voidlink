// M14i — Research Tech Tree.
//
// Five branches × five nodes each. Players accrue Research Points (RP) on
// every successful mission and spend them in the Research Bench window.
//
// RP awards:
//   - Base RP per mission = mission.difficulty (so a D3 mission gives 3 RP)
//   - +1 RP if no IDS was triggered
//   - +1 RP if every breached node was log-wiped AND timestomped
//
// Effects are looked up via the helpers at the bottom of this file. Nodes
// without a wired effect yet are placeholders for future systems (phishing,
// CVE expansion, OSINT) and will activate when those systems ship.

import type { PlayerProfile } from '../types/player.ts'

export type ResearchBranch = 'crypto' | 'stealth' | 'hardware' | 'social' | 'ai'

export interface ResearchNode {
  id: string
  branch: ResearchBranch
  name: string
  description: string
  effectLabel: string
  cost: number              // RP cost
  prereqId?: string         // parent node in same branch
  // Optional story-flag gate (e.g. ai branch root needs REVELATION contact)
  flagGate?: { key: string; min?: number }
}

export const RESEARCH_TREE: ResearchNode[] = [
  // ── CRYPTO ────────────────────────────────────────────────────────────────
  {
    id: 'C1', branch: 'crypto', name: 'Quantum Primer',
    description: 'A primer in post-classical cryptography. Sharpens your edge across all crack methods.',
    effectLabel: 'Crack speed +5%',
    cost: 3,
  },
  {
    id: 'C2', branch: 'crypto', name: 'Lattice Math',
    description: 'Mathematical models that pre-empt the cipher choice. Future Crypto research costs 1 RP less.',
    effectLabel: 'Crypto-branch nodes cost -1 RP',
    cost: 5, prereqId: 'C1',
  },
  {
    id: 'C3', branch: 'crypto', name: 'Zero-Day Library',
    description: 'A personal archive of unreported vulnerabilities. Deep port scans reveal one bonus CVE.',
    effectLabel: 'port_scanner_deep reveals +1 CVE per node',
    cost: 7, prereqId: 'C2',
  },
  {
    id: 'C4', branch: 'crypto', name: "Shor's Algorithm",
    description: 'Quantum-assisted factoring. Cracks against RDP and SSH targets run in half the time.',
    effectLabel: 'RDP / SSH crack ×0.5 duration',
    cost: 10, prereqId: 'C3',
  },
  {
    id: 'C5', branch: 'crypto', name: 'Cryptographic Sovereignty',
    description: 'Total mastery. Mission cracker requirements effectively drop by one level.',
    effectLabel: 'minCrackerLevel of every contract reads as -1',
    cost: 15, prereqId: 'C4',
  },

  // ── STEALTH ───────────────────────────────────────────────────────────────
  {
    id: 'S1', branch: 'stealth', name: 'Quiet Boots',
    description: 'Soft-syscall log routines. Wipes generate noticeably less alarm pressure.',
    effectLabel: 'Log-wipe alarm spike -5%',
    cost: 3,
  },
  {
    id: 'S2', branch: 'stealth', name: 'Phantom Routes',
    description: 'A library of unmapped relay nodes. Your effective hop cap rises by one beyond any software cap.',
    effectLabel: 'Max relay-chain hops +1 (stacks with Brute Synapse)',
    cost: 5, prereqId: 'S1',
  },
  {
    id: 'S3', branch: 'stealth', name: 'Forensic Static',
    description: 'You inject noise into the canary detection layer. Trips are less catastrophic.',
    effectLabel: 'Canary trip trace spike: +25% → +15%',
    cost: 7, prereqId: 'S2',
  },
  {
    id: 'S4', branch: 'stealth', name: 'Cold Footprint',
    description: 'Every breach decays from the alarm logs faster than memory of it spreads.',
    effectLabel: 'Cross-session heat (heat_<corp>) lifetime ×0.5',
    cost: 10, prereqId: 'S3',
  },
  {
    id: 'S5', branch: 'stealth', name: 'Total Ghost',
    description: 'Your gateway signature is a forensic null. The passive trace baseline drops.',
    effectLabel: 'Passive trace baseRate -0.10 %/s',
    cost: 15, prereqId: 'S4',
  },

  // ── HARDWARE ──────────────────────────────────────────────────────────────
  {
    id: 'H1', branch: 'hardware', name: 'Overclock Layer',
    description: 'A safe bus-side overclock. Stacks with Crypto research multiplicatively.',
    effectLabel: 'Crack speed +5%',
    cost: 3,
  },
  {
    id: 'H2', branch: 'hardware', name: 'Thermal Mastery',
    description: 'Throttle-curve tuning that mimics one additional Cooling tier.',
    effectLabel: 'Cooling tier effective +1',
    cost: 5, prereqId: 'H1',
  },
  {
    id: 'H3', branch: 'hardware', name: 'Cache Prefetch',
    description: 'Aggressive cache pre-loading. Scan operations finish noticeably sooner.',
    effectLabel: 'Scan duration ×0.75',
    cost: 7, prereqId: 'H2',
  },
  {
    id: 'H4', branch: 'hardware', name: 'Memory Bus Tuning',
    description: 'Unlocks one extra concurrent-tool slot — stacks with Architect spec and Architect Cortex.',
    effectLabel: 'RAM concurrent slots +1',
    cost: 10, prereqId: 'H3',
  },
  {
    id: 'H5', branch: 'hardware', name: 'Custom Silicon',
    description: 'Custom-fabricated coprocessor. Your effective CPU tier behaves half a step higher for every operation.',
    effectLabel: 'CPU effective tier +0.5',
    cost: 15, prereqId: 'H4',
  },

  // ── SOCIAL ────────────────────────────────────────────────────────────────
  // Many of these light up when the phishing module + OSINT systems ship.
  {
    id: 'So1', branch: 'social', name: 'Conversational Patterns',
    description: 'Mission briefings include the optional easier objective when it exists.',
    effectLabel: 'Reveals secondary objectives on mission cards',
    cost: 3,
  },
  {
    id: 'So2', branch: 'social', name: 'Pretexting',
    description: 'The phishing module ignores its base failure rate.',
    effectLabel: 'Phishing fail rate -10% (when module ships)',
    cost: 5, prereqId: 'So1',
  },
  {
    id: 'So3', branch: 'social', name: 'Insider Knowledge',
    description: 'Dumped credentials persist between missions targeting the same corporation.',
    effectLabel: 'Per-corp credential cache persists across missions',
    cost: 7, prereqId: 'So2',
  },
  {
    id: 'So4', branch: 'social', name: 'OSINT Network',
    description: 'Anonymous contacts feed you network composition for free.',
    effectLabel: 'Mission Board shows enemy IDS / admin counts',
    cost: 10, prereqId: 'So3',
  },
  {
    id: 'So5', branch: 'social', name: 'Social Engineering Mastery',
    description: 'You move faster up faction trees than anyone else.',
    effectLabel: 'Faction standing gains +10%',
    cost: 15, prereqId: 'So4',
  },

  // ── AI ────────────────────────────────────────────────────────────────────
  // Gated until the player has had at least one direct REVELATION contact.
  {
    id: 'A1', branch: 'ai', name: 'Curious Anomaly',
    description: 'After your first contact, you start noticing patterns the rest of the field misses. AI cores are now detectable.',
    effectLabel: 'ai_core nodes detectable on scan',
    cost: 5,
    flagGate: { key: 'revelation_contact_count', min: 1 },
  },
  {
    id: 'A2', branch: 'ai', name: 'Pattern Recognition',
    description: 'Scan operations on ai_core nodes also reveal the embedded CVE chain.',
    effectLabel: 'ai_core CVEs revealed on scan',
    cost: 8, prereqId: 'A1',
  },
  {
    id: 'A3', branch: 'ai', name: 'Synthetic Empathy',
    description: 'REVELATION\'s encrypted notes decrypt for you without manual key derivation.',
    effectLabel: 'REVELATION inbox messages auto-decrypt',
    cost: 12, prereqId: 'A2',
  },
  {
    id: 'A4', branch: 'ai', name: 'Cascade',
    description: 'Pre-scanned ai_core nodes can be breached without a crack job, once per mission.',
    effectLabel: 'Free ai_core breach 1×/mission',
    cost: 15, prereqId: 'A3',
  },
  {
    id: 'A5', branch: 'ai', name: 'Sovereignty',
    description: 'You permanently accrue +1 RP per completed mission. The line between you and the system has blurred.',
    effectLabel: 'Permanent +1 RP per mission',
    cost: 25, prereqId: 'A4',
  },
]

export function getResearchNode(id: string): ResearchNode | null {
  return RESEARCH_TREE.find((n) => n.id === id) ?? null
}

export function hasResearch(player: PlayerProfile | null, id: string): boolean {
  return !!player?.researchUnlocked?.includes(id)
}

// ── Effect helpers ──────────────────────────────────────────────────────────

/** Multiplier on crack duration. < 1 = faster. Stacks C1 + H1 + C4 (when SSH/RDP). */
export function researchCrackSpeedMul(player: PlayerProfile | null, protocol?: string): number {
  let m = 1
  if (hasResearch(player, 'C1')) m *= 0.95
  if (hasResearch(player, 'H1')) m *= 0.95
  if (hasResearch(player, 'C4') && (protocol === 'RDP' || protocol === 'SSH')) m *= 0.5
  return m
}

/** Multiplier on scan duration. */
export function researchScanSpeedMul(player: PlayerProfile | null): number {
  return hasResearch(player, 'H3') ? 0.75 : 1
}

/** +1 if the player has Phantom Routes (S2). */
export function researchRelayHopBonus(player: PlayerProfile | null): number {
  return hasResearch(player, 'S2') ? 1 : 0
}

/** +1 if the player has Memory Bus Tuning (H4). */
export function researchRamBonus(player: PlayerProfile | null): number {
  return hasResearch(player, 'H4') ? 1 : 0
}

/** Flat baseRate delta. Negative = slower passive trace. */
export function researchBaseRateDelta(player: PlayerProfile | null): number {
  return hasResearch(player, 'S5') ? -0.1 : 0
}

/** Multiplier on log-wipe alarm spike (S1). */
export function researchWipeAlarmMul(player: PlayerProfile | null): number {
  return hasResearch(player, 'S1') ? 0.95 : 1
}

/** Canary spike level — 25 normal, 15 with S3. */
export function researchCanarySpike(player: PlayerProfile | null): number {
  return hasResearch(player, 'S3') ? 15 : 25
}

/** Cracker-level requirement adjustment — -1 if C5. */
export function researchCrackerReqAdjust(player: PlayerProfile | null): number {
  return hasResearch(player, 'C5') ? -1 : 0
}

/** Effective CPU bonus from H5. */
export function researchCpuBonus(player: PlayerProfile | null): number {
  return hasResearch(player, 'H5') ? 0.5 : 0
}

/** Multiplier on heat-flag lifetime (S4). Not yet wired — placeholder. */
export function researchHeatLifetimeMul(player: PlayerProfile | null): number {
  return hasResearch(player, 'S4') ? 0.5 : 1
}

/** Faction-standing gain multiplier (So5). */
export function researchFactionGainMul(player: PlayerProfile | null): number {
  return hasResearch(player, 'So5') ? 1.1 : 1
}

/** Per-mission permanent +1 RP from A5 Sovereignty. */
export function researchExtraRpPerMission(player: PlayerProfile | null): number {
  return hasResearch(player, 'A5') ? 1 : 0
}

/** Compute RP earned for a mission completion. */
export function researchPointsForMission(opts: {
  difficulty: number
  noIdsTriggered: boolean
  allWipedAndStomped: boolean
  player: PlayerProfile | null
}): number {
  let rp = opts.difficulty
  if (opts.noIdsTriggered) rp += 1
  if (opts.allWipedAndStomped) rp += 1
  rp += researchExtraRpPerMission(opts.player)
  return rp
}
