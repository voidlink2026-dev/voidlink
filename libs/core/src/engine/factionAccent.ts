// V1 — Faction accent colours.
//
// Given a contract's clientHandle, return the accent colour used to tint UI
// surfaces tied to that contract. Lands the Collaborator Axis (M14s/t)
// visually — you can *see* whose work you're doing without having to read
// the briefing.
//
// Used by:
//   - MissionBoard cards (left border + faction chip)
//   - HackingInterface trace bar (subtle accent during active mission)
//   - Future: connection trail pulses (V5)
//
// Built on top of clientFaction.ts (which buckets handles into faction
// groups) — accents are bucket-derived, not per-handle.

import { classifyClient, type ClientFaction } from './clientFaction.ts'

/** Per-faction accent palette. Each entry has a primary tone (used for
 *  borders and accents) and a translucent glow variant for shadows. */
export const FACTION_ACCENTS: Record<ClientFaction, { primary: string; glow: string; label: string }> = {
  corporate:    { primary: '#ff9933', glow: 'rgba(255, 153, 51, 0.35)',  label: 'CORP' },
  government:   { primary: '#ff2d20', glow: 'rgba(255, 45, 32, 0.35)',   label: 'GOV'  },
  underground:  { primary: '#39ff14', glow: 'rgba(57, 255, 20, 0.35)',   label: 'UND'  },
  independent:  { primary: '#aa66ff', glow: 'rgba(170, 102, 255, 0.30)', label: 'IND'  },
  neutral:      { primary: '#00cfff', glow: 'rgba(0, 207, 255, 0.30)',   label: 'NET'  },
}

export function getFactionAccent(clientHandle: string): { primary: string; glow: string; label: string; faction: ClientFaction } {
  const faction = classifyClient(clientHandle)
  return { ...FACTION_ACCENTS[faction], faction }
}
