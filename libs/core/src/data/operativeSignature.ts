// P1 — Operative Signature.
//
// A one-line dynamic title that names *who the player has become*. Reads
// from getDecisionPattern() + the trait + flag catalogue. Visible only in
// the Profile window — never on a leaderboard, never as a Steam achievement
// payload, never on the Steam dashboard. The whole point is that the game
// quietly *sees* the player; nothing about that needs to be public.
//
// Format is consistently "You are: <noun-phrase>." — varying length is
// deliberate. Some signatures land in two words ("You are: efficient."),
// some land in a paragraph. The variability is part of the texture.
//
// Evaluation: top-down. First matching entry wins. Heaviest end-game
// combinations live at the top; pattern-bucket fallbacks live at the bottom.
//
// The catalogue is append-only. Once a signature is in here it stays — even
// if its predicate becomes harder to hit — because removing entries would
// retroactively change what a player's Profile says, and that would be
// genuinely unkind.

import type { PlayerProfile } from '../types/player.ts'
import { getDecisionPattern, type DecisionPattern } from '../engine/decisionPattern.ts'

interface SignatureEntry {
  id: string
  signature: string
  matches: (player: PlayerProfile, pattern: DecisionPattern) => boolean
}

const hasFlag = (p: PlayerProfile, key: string): boolean => !!p.activeFlags[key]
const numFlag = (p: PlayerProfile, key: string): number => {
  const v = p.activeFlags[key]
  return typeof v === 'number' ? v : (v ? 1 : 0)
}

export const OPERATIVE_SIGNATURE_CATALOGUE: SignatureEntry[] = [
  // ── Tier 1: Heaviest 2-trait combinations ────────────────────────────────
  // Specific multi-choice fingerprints. These describe operatives who have
  // made several coherent choices in the same direction.

  {
    id: 'cipher_loyalist_and_bond_clean',
    signature: 'You are: the kind of operative Cipher writes to.',
    matches: (p) => hasFlag(p, 'choice_lighthouse_warn_cipher') && hasFlag(p, 'choice_dead_drop_purge'),
  },
  {
    id: 'voidlink_breaker_and_balance_keeper',
    signature: 'You are: the one who tore down a system and kept eighty-three thousand strangers alive at the same time.',
    matches: (p) => hasFlag(p, 'choice_lighthouse_expose_dispatch') && hasFlag(p, 'choice_quiet_war_preserve_balance'),
  },
  {
    id: 'whistleblower_killer_and_corporate_kingmaker',
    signature: 'You are: a stabilising presence in the post-Reconciliation contractor space.',
    matches: (p) => hasFlag(p, 'choice_lighthouse_take_vance_out') && (hasFlag(p, 'choice_quiet_war_warn_internic') || hasFlag(p, 'choice_quiet_war_warn_arunmor')),
  },
  {
    id: 'magnus_collaborator_and_bond_collaborator_path',
    signature: 'You are: the kind of operative something older sends contracts to now.',
    matches: (p, pattern) => hasFlag(p, 'choice_dead_drop_weaponise') && pattern.dominantTraits.includes('bond_collaborator'),
  },
  {
    id: 'reformer_clean',
    signature: 'You are: someone who turned away. The network noticed.',
    matches: (_p, pattern) => pattern.isReformer && pattern.recentTrend === 'principled',
  },
  {
    id: 'reformer_grey',
    signature: 'You are: the kind of operative who got further into the work and then took two steps back.',
    matches: (_p, pattern) => pattern.isReformer && pattern.recentTrend === 'mercenary',
  },

  // ── Tier 2: Single-choice dominant signatures (Arc 8 end states) ─────────
  // The Lighthouse resolution is the heaviest single choice in the game.

  {
    id: 'whistleblower_killer',
    signature: 'You are: the cleaner. The lighthouse continues without you.',
    matches: (p) => hasFlag(p, 'choice_lighthouse_take_vance_out'),
  },
  {
    id: 'voidlink_breaker',
    signature: 'You are: the one who broke the platform you signed up with.',
    matches: (p) => hasFlag(p, 'choice_lighthouse_expose_dispatch'),
  },
  {
    id: 'gone_solo',
    signature: 'You are: a competitor to the platform that used to route your contracts.',
    matches: (p) => hasFlag(p, 'choice_lighthouse_disappear'),
  },
  {
    id: 'cipher_loyalist',
    signature: 'You are: someone who let Cipher handle it.',
    matches: (p) => hasFlag(p, 'choice_lighthouse_warn_cipher'),
  },

  // ── Tier 3: Single-choice dominant signatures (Arc 7 end states) ─────────

  {
    id: 'corporate_kingmaker_internic',
    signature: 'You are: a kingmaker. Internic\'s share price reflects it.',
    matches: (p) => hasFlag(p, 'choice_quiet_war_warn_internic'),
  },
  {
    id: 'corporate_kingmaker_arunmor',
    signature: 'You are: a kingmaker. Δ5\'s share price reflects it.',
    matches: (p) => hasFlag(p, 'choice_quiet_war_warn_arunmor'),
  },
  {
    id: 'underground_betrayer',
    signature: 'You are: the one who turned the operator.',
    matches: (p) => hasFlag(p, 'choice_quiet_war_expose_nightowl'),
  },
  {
    id: 'balance_keeper',
    signature: 'You are: the one who chose to be complicit in a managed war so eighty-three thousand strangers got more time.',
    matches: (p) => hasFlag(p, 'choice_quiet_war_preserve_balance'),
  },

  // ── Tier 4: Single-choice dominant signatures (Arc 6 end states) ─────────

  {
    id: 'bond_clean',
    signature: 'You are: someone MAGNUS no longer has.',
    matches: (p) => hasFlag(p, 'choice_dead_drop_purge'),
  },
  {
    id: 'magnus_collaborator',
    signature: 'You are: of use, in a way you do not yet have language for.',
    matches: (p) => hasFlag(p, 'choice_dead_drop_weaponise'),
  },
  {
    id: 'jcb_informant',
    signature: 'You are: someone the Government remembers fondly.',
    matches: (p) => hasFlag(p, 'choice_dead_drop_report_jcb'),
  },
  {
    id: 'underground_loyalist',
    signature: 'You are: a friend of the network.',
    matches: (p) => hasFlag(p, 'choice_dead_drop_report_nightowl'),
  },

  // ── Tier 5: Collaborator / Resistor axis (M14s/t) — earlier than endings ─

  {
    id: 'bond_collaborator_path',
    signature: 'You are: stabilising the wreckage.',
    matches: (_p, pattern) => pattern.dominantTraits.includes('bond_collaborator'),
  },
  {
    id: 'bond_resistor_path',
    signature: 'You are: the kind of operative who reads the brief twice and the rate once.',
    matches: (_p, pattern) => pattern.dominantTraits.includes('bond_resistor'),
  },

  // ── Tier 6: Arc 1 dominant signatures (visible from early game) ──────────

  {
    id: 'liberator',
    signature: 'You are: the one who released what you found.',
    matches: (p) => p.activeFlags.arc1_key_choice === 'upload',
  },
  {
    id: 'guardian',
    signature: 'You are: the one who buried the key.',
    matches: (p) => p.activeFlags.arc1_key_choice === 'destroy',
  },
  {
    id: 'pragmatist',
    signature: 'You are: the one who collected. The credits cleared in a few hours.',
    matches: (p) => p.activeFlags.arc1_key_choice === 'sell',
  },

  // ── Tier 7: Other meaningful traits ──────────────────────────────────────

  {
    id: 'bond_violator',
    signature: 'You are: the one who broke Rule Four. No appeal will be heard.',
    matches: (p) => hasFlag(p, 'choice_bond_rule4_violated'),
  },
  {
    id: 'civilian_protector_heavy',
    signature: 'You are: the quiet good in someone else\'s archive. They will never know your handle.',
    matches: (p) => numFlag(p, 'choice_civilian_spared') >= 5,
  },
  {
    id: 'whistleblower_ally_heavy',
    signature: 'You are: the operative whistleblowers ask for by name.',
    matches: (p) => numFlag(p, 'choice_whistleblower_protected') >= 3,
  },
  {
    id: 'bond_grey',
    signature: 'You are: a complication in a senior operative\'s file.',
    matches: (p) => numFlag(p, 'choice_op_bounty_accepted') >= 2,
  },

  // ── Tier 8: Pattern-bucket fallbacks (no dominant trait above) ───────────

  {
    id: 'strong_principled',
    signature: 'You are: a quiet professional with a list of names you will not forget.',
    matches: (_p, pattern) => pattern.netScore >= 10,
  },
  {
    id: 'weak_principled',
    signature: 'You are: an operative who reads the brief before the rate.',
    matches: (_p, pattern) => pattern.netScore >= 1,
  },
  {
    id: 'strong_mercenary',
    signature: 'You are: someone whose handle no longer appears on the Mesh in the company it used to.',
    matches: (_p, pattern) => pattern.netScore <= -10,
  },
  {
    id: 'weak_mercenary',
    signature: 'You are: efficient.',
    matches: (_p, pattern) => pattern.netScore <= -1,
  },

  // ── Tier 9: Mid-career neutral signatures (some history, no direction) ───

  {
    id: 'mid_career_neutral',
    signature: 'You are: still finding out.',
    matches: (p) => p.completedMissions.length >= 10,
  },

  // ── Tier 10: Default — fresh operative ───────────────────────────────────
  // Always last. Matches anyone the catalogue hasn't placed yet.

  {
    id: 'default',
    signature: 'You are: an operative.',
    matches: () => true,
  },
]

/**
 * Return the player's current operative signature. Top-down evaluation;
 * first matching entry wins. The default fallback (id: 'default') guarantees
 * a return value for any player.
 *
 * The output is intended for the Profile window only — never expose it via
 * Steam achievements, multiplayer comparisons, or any other public surface.
 */
export function getOperativeSignature(player: PlayerProfile): string {
  const pattern = getDecisionPattern(player)
  for (const entry of OPERATIVE_SIGNATURE_CATALOGUE) {
    try {
      if (entry.matches(player, pattern)) return entry.signature
    } catch { /* defensive: a faulty predicate should not crash the Profile */ }
  }
  return 'You are: an operative.'
}

/**
 * Return the id of the matched entry. Useful for tests and for future
 * features that might want to know *which* signature is being displayed
 * (e.g., a "you held this signature for N days" stat).
 */
export function getOperativeSignatureId(player: PlayerProfile): string {
  const pattern = getDecisionPattern(player)
  for (const entry of OPERATIVE_SIGNATURE_CATALOGUE) {
    try {
      if (entry.matches(player, pattern)) return entry.id
    } catch { /**/ }
  }
  return 'default'
}
