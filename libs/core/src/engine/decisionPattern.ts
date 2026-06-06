// M14p — Choice Architecture & Reflection Mechanic.
//
// Voidlink does not have a morality meter. The player never sees a number.
//
// What the engine DOES have is a catalogue of meaningful choices, each of
// which writes a flag to `player.activeFlags`. The pattern reader below sums
// those flags into an internal-only `DecisionPattern` that downstream systems
// (news framing, NPC dialogue tone, contract availability, faction induction,
// reflection scenes, ending fan-out) consult to adapt their behaviour.
//
// **The pattern is never rendered to the player as a number.** That is the
// design philosophy. Purpose comes from choice, not from score.
//
// Flag convention: any flag whose key starts with `choice_` is consumed by
// the pattern reader. Boolean flags count once; numeric flags count by their
// value (i.e. `choice_civilian_spared = 5` means five civilians spared).
// All other `activeFlags` keys (heat_, backdoor_, patch_, consumable_*_armed,
// arc1_key_choice, loan_default_, etc.) are ignored by the reader.

import type { PlayerProfile } from '../types/player.ts'

export type Conviction = 'principled' | 'mercenary'

/**
 * A single meaningful choice the player can make. The catalogue below is
 * append-only — adding a new choice never invalidates existing saves. Each
 * entry says: "if this flag is set, count it toward this conviction with
 * this weight, and optionally tag the trait."
 */
export interface ChoiceDefinition {
  flag: string                  // activeFlags key
  conviction: Conviction
  weight: number                // 1-3 typically; 3 = arc-defining
  trait?: string                // surfaces in pattern.dominantTraits
}

export const CHOICE_CATALOGUE: ChoiceDefinition[] = [
  // ── Arc 1 key choice (the canonical example) ──────────────────────────────
  // Note: the existing `arc1_key_choice` flag is mapped here for back-compat.
  // We ALSO accept new `choice_arc1_key_*` boolean flags for the same effect.
  { flag: 'choice_arc1_key_upload',  conviction: 'principled', weight: 3, trait: 'liberator' },
  { flag: 'choice_arc1_key_destroy', conviction: 'principled', weight: 2, trait: 'guardian' },
  { flag: 'choice_arc1_key_sell',    conviction: 'mercenary',  weight: 3, trait: 'pragmatist' },

  // ── BLACK HALO fork (M14o) ────────────────────────────────────────────────
  { flag: 'choice_black_halo_turn',  conviction: 'principled', weight: 2, trait: 'underground_ally' },
  { flag: 'choice_black_halo_burn',  conviction: 'mercenary',  weight: 2, trait: 'no_loose_ends' },

  // ── Civilian protection ──────────────────────────────────────────────────
  { flag: 'choice_civilian_spared',  conviction: 'principled', weight: 1, trait: 'civilian_protector' },
  { flag: 'choice_civilian_burned',  conviction: 'mercenary',  weight: 1 },

  // ── Whistleblower handling ───────────────────────────────────────────────
  { flag: 'choice_whistleblower_protected', conviction: 'principled', weight: 2, trait: 'whistleblower_ally' },
  { flag: 'choice_whistleblower_exposed',   conviction: 'mercenary',  weight: 2 },

  // ── Operative-vs-operative ───────────────────────────────────────────────
  // Taking a bounty on a fellow operative — Compact-grey behaviour.
  { flag: 'choice_op_bounty_accepted', conviction: 'mercenary',  weight: 2, trait: 'compact_grey' },
  { flag: 'choice_op_warned_instead',  conviction: 'principled', weight: 1 },

  // ── Data disposition (sell vs leak) ──────────────────────────────────────
  { flag: 'choice_data_leaked', conviction: 'principled', weight: 1, trait: 'truth_seeker' },
  { flag: 'choice_data_sold',   conviction: 'mercenary',  weight: 1 },

  // ── Target warning ───────────────────────────────────────────────────────
  { flag: 'choice_target_warned',  conviction: 'principled', weight: 1 },

  // ── Identity theft cleanup ───────────────────────────────────────────────
  { flag: 'choice_identity_cleaned', conviction: 'principled', weight: 1 },

  // ── Evidence planting ────────────────────────────────────────────────────
  { flag: 'choice_false_evidence_planted', conviction: 'mercenary', weight: 2 },

  // ── Loan exploitation ────────────────────────────────────────────────────
  { flag: 'choice_loan_exploit_npc', conviction: 'mercenary', weight: 1 },

  // ── Contract refusals ────────────────────────────────────────────────────
  { flag: 'choice_contract_refused_civilians', conviction: 'principled', weight: 1 },
  { flag: 'choice_contract_refused_underground', conviction: 'mercenary', weight: 1 },

  // ── Voidlink Compact violations ──────────────────────────────────────────
  // Hard violations — these are rare, weighted heavily mercenary.
  { flag: 'choice_compact_rule4_violated', conviction: 'mercenary', weight: 3, trait: 'compact_violator' },
]

export interface DecisionPattern {
  principledScore: number
  mercenaryScore: number
  total: number
  netScore: number              // principled - mercenary (positive = principled-leaning)
  /** What direction recent choices have been trending. */
  recentTrend: 'principled' | 'mercenary' | 'mixed' | 'none'
  /** Up to 4 trait tags that summarise the player's identity. */
  dominantTraits: string[]
  /** True if the player has substantially changed direction late in their career. */
  isReformer: boolean
}

/**
 * Read the player's accumulated choices and return their pattern. This
 * function is **internal-only** — its output should never be rendered to
 * the player as a number. Use it to drive variant text selection, contract
 * availability, faction induction, and ending fan-out.
 */
export function getDecisionPattern(player: PlayerProfile | null): DecisionPattern {
  if (!player) {
    return {
      principledScore: 0, mercenaryScore: 0, total: 0, netScore: 0,
      recentTrend: 'none', dominantTraits: [], isReformer: false,
    }
  }

  let principled = 0
  let mercenary = 0
  let total = 0
  const traitTally: Record<string, number> = {}

  // Back-compat: map the legacy `arc1_key_choice` flag.
  const legacyArc1 = player.activeFlags.arc1_key_choice
  if (typeof legacyArc1 === 'string') {
    if (legacyArc1 === 'upload')  { principled += 3; total += 1; bump(traitTally, 'liberator') }
    if (legacyArc1 === 'destroy') { principled += 2; total += 1; bump(traitTally, 'guardian') }
    if (legacyArc1 === 'sell')    { mercenary  += 3; total += 1; bump(traitTally, 'pragmatist') }
  }

  // Catalogue sum.
  for (const choice of CHOICE_CATALOGUE) {
    const v = player.activeFlags[choice.flag]
    let count = 0
    if (typeof v === 'number') count = v
    else if (v) count = 1
    if (count === 0) continue
    const score = count * choice.weight
    if (choice.conviction === 'principled') principled += score
    else mercenary += score
    total += count
    if (choice.trait) bump(traitTally, choice.trait, count)
  }

  const netScore = principled - mercenary

  // Dominant traits — top 4 by count.
  const dominantTraits = Object.entries(traitTally)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([trait]) => trait)

  // Recent trend & reformer detection.
  // Heuristic: a `recent_*` flag in activeFlags can be used by callers to
  // mark a deliberate recent-window snapshot. Without one we approximate:
  // if the player has > 8 total choices and the last-3 weighted direction
  // (tracked via `recent_choice_direction` numeric flag) disagrees with the
  // overall net, mark as reformer.
  const recentDir = player.activeFlags.recent_choice_direction
  let recentTrend: DecisionPattern['recentTrend'] = 'none'
  if (typeof recentDir === 'number') {
    if (recentDir > 2)  recentTrend = 'principled'
    else if (recentDir < -2) recentTrend = 'mercenary'
    else recentTrend = 'mixed'
  } else if (total > 0) {
    if (Math.abs(netScore) <= 2) recentTrend = 'mixed'
    else recentTrend = netScore > 0 ? 'principled' : 'mercenary'
  }

  const isReformer = total >= 8 && (
    (recentTrend === 'principled' && netScore < -5) ||
    (recentTrend === 'mercenary'  && netScore >  5)
  )

  return { principledScore: principled, mercenaryScore: mercenary, total, netScore, recentTrend, dominantTraits, isReformer }
}

function bump(t: Record<string, number>, key: string, by = 1) { t[key] = (t[key] ?? 0) + by }

/**
 * Mark a choice as having happened. Convenience for callers — they can
 * either set the flag directly via `player.activeFlags[choice.flag] = true`
 * or call this to also bump the trailing direction marker.
 *
 * NOTE: This function is documentation-only — the actual write happens in
 * the store action that's calling it (Immer drafts can't be mutated from
 * pure modules). Use the implementation pattern in the comment.
 */
export function exampleChoiceWriteImpl(): string {
  return `
    set((s) => {
      if (!s.player) return
      // 1. Write the choice flag (boolean OR counter)
      s.player.activeFlags['choice_civilian_spared'] =
        ((s.player.activeFlags['choice_civilian_spared'] as number) ?? 0) + 1
      // 2. Update the trailing recent direction marker
      const dir = (s.player.activeFlags['recent_choice_direction'] as number) ?? 0
      s.player.activeFlags['recent_choice_direction'] = Math.max(-10, Math.min(10, dir + 1))
    })
  `.trim()
}
