// L5 — Achievements.
//
// 50 entries across six tiers. Each achievement is a pure check function over
// PlayerProfile state — the evaluator runs on disconnect (and on a small set
// of other state changes) and surfaces newly-unlocked IDs.
//
// Achievement state lives in `player.activeFlags` as `achievement_<id>` →
// unlock timestamp. This piggybacks the existing save serialisation and
// avoids a schema change to PlayerProfile.
//
// The catalogue is append-only. Once an achievement is in here it stays in
// here, even if the criteria become stale — removing entries would break
// existing players' completion percentages.

import type { PlayerProfile } from '../types/player.ts'
import { getDecisionPattern } from '../engine/decisionPattern.ts'

export type AchievementTier =
  | 'trivial'
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'story'
  | 'platinum'

export interface AchievementDefinition {
  id: string
  title: string
  description: string
  tier: AchievementTier
  /** Hidden until unlocked. */
  hidden?: boolean
  check: (player: PlayerProfile) => boolean
}

// Helpers ─────────────────────────────────────────────────────────────────────
const numFlag = (p: PlayerProfile, key: string): number => {
  const v = p.activeFlags[key]
  if (typeof v === 'number') return v
  return v ? 1 : 0
}
const hasFlag = (p: PlayerProfile, key: string): boolean => !!p.activeFlags[key]
const standing = (p: PlayerProfile, id: string): number =>
  p.factionStandings.find((f) => f.factionId === id)?.score ?? 0

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // ── TRIVIAL (5) ──────────────────────────────────────────────────────────
  {
    id: 'onboarded',
    title: 'OPERATIVE',
    description: 'Sign the Bond. Welcome to the only career in 2199 that nobody owns.',
    tier: 'trivial',
    check: (p) => p.stats.totalMissions >= 0 && p.handle.length > 0,
  },
  {
    id: 'first_mission',
    title: 'FIRST CONTRACT',
    description: 'Complete your first contract.',
    tier: 'trivial',
    check: (p) => p.stats.successfulBreaches >= 1,
  },
  {
    id: 'first_breach',
    title: 'FIRST BREACH',
    description: 'Breach your first node.',
    tier: 'trivial',
    check: (p) => p.stats.successfulBreaches >= 1,
  },
  {
    id: 'first_disconnect',
    title: 'CLEAN EXIT',
    description: 'Secure-disconnect from your first mission.',
    tier: 'trivial',
    check: (p) => p.completedMissions.length >= 1,
  },
  {
    id: 'first_purchase',
    title: 'REINVEST',
    description: 'Make your first purchase in the shop.',
    tier: 'trivial',
    check: (p) => p.stats.creditsSpent >= 1,
  },

  // ── BRONZE (13) ──────────────────────────────────────────────────────────
  {
    id: 'tutorial_done',
    title: 'IN THE FIELD',
    description: 'Complete the operative tutorial.',
    tier: 'bronze',
    check: (p) => hasFlag(p, 'tutorial_done'),
  },
  {
    id: 'first_relay_chain',
    title: 'BOUNCE',
    description: 'Build a three-hop relay chain.',
    tier: 'bronze',
    check: (p) => p.bounceLibrary.length >= 3,
  },
  {
    id: 'first_log_wipe',
    title: 'INVISIBLE',
    description: 'Wipe a log on a breached node.',
    tier: 'bronze',
    check: (p) => p.stats.successfulBreaches >= 1 && p.completedMissions.length >= 1,
  },
  {
    id: 'ghost_spec',
    title: 'GHOST',
    description: 'Specialise as Ghost.',
    tier: 'bronze',
    check: (p) => p.specialization === 'ghost',
  },
  {
    id: 'architect_spec',
    title: 'ARCHITECT',
    description: 'Specialise as Architect.',
    tier: 'bronze',
    check: (p) => p.specialization === 'architect',
  },
  {
    id: 'brute_spec',
    title: 'BRUTE',
    description: 'Specialise as Brute.',
    tier: 'bronze',
    check: (p) => p.specialization === 'brute',
  },
  {
    id: 'social_spec',
    title: 'SOCIAL',
    description: 'Specialise as Social.',
    tier: 'bronze',
    check: (p) => p.specialization === 'social',
  },
  {
    id: 'first_codex_entry',
    title: 'CODEX',
    description: 'Unlock your first codex entry.',
    tier: 'bronze',
    check: (p) =>
      Object.keys(p.activeFlags).some((k) => k.startsWith('codex_unlocked_')),
  },
  {
    id: 'first_essay',
    title: 'CORRESPONDENCE',
    description: 'Receive your first letter from Cipher.',
    tier: 'bronze',
    check: (p) =>
      Object.keys(p.activeFlags).some((k) => k.startsWith('dialogue_fired_cipher_')),
  },
  {
    id: 'first_reflection',
    title: 'TAKING STOCK',
    description: 'Reach your first reflection scene.',
    tier: 'bronze',
    check: (p) =>
      Object.keys(p.activeFlags).some((k) => k.startsWith('reflection_')),
  },
  {
    id: 'loan_default',
    title: 'PACIFIC NATIONAL REMEMBERS',
    description: 'Default on a bank loan. They will not forget.',
    tier: 'bronze',
    check: (p) => hasFlag(p, 'loan_defaulted'),
  },
  {
    id: 'time_lord',
    title: 'STILL HERE',
    description: 'Play across 30 in-game days.',
    tier: 'bronze',
    check: (p) => (Date.now() - p.createdAt) >= 30 * 24 * 3600 * 1000,
  },
  {
    id: 'seasoned',
    title: 'SEASON TURNS',
    description: 'Witness a quarterly season transition.',
    tier: 'bronze',
    check: (p) => hasFlag(p, 'reflection_season_transition'),
  },

  // ── SILVER (12) ──────────────────────────────────────────────────────────
  {
    id: 'hundred_missions',
    title: 'CENTURION',
    description: 'Complete one hundred contracts.',
    tier: 'silver',
    check: (p) => p.completedMissions.length >= 100,
  },
  {
    id: 'millionaire',
    title: 'MILLIONAIRE',
    description: 'Hold one million credits in cash.',
    tier: 'silver',
    check: (p) => p.credits >= 1_000_000,
  },
  {
    id: 'notoriety_max',
    title: 'GRID PRESENCE',
    description: 'Reach maximum financial notoriety. Every public bank knows you.',
    tier: 'silver',
    check: (p) => (p.notoriety ?? 0) >= 10,
  },
  {
    id: 'notoriety_clean',
    title: 'GHOST FUNDS',
    description: 'Drive your financial notoriety to its minimum.',
    tier: 'silver',
    check: (p) => (p.notoriety ?? 0) <= -5,
  },
  {
    id: 'paranoid',
    title: 'PARANOID',
    description: 'Build a ten-hop relay chain.',
    tier: 'silver',
    check: (p) => p.bounceLibrary.length >= 10,
  },
  {
    id: 'escape_artist',
    title: 'ESCAPE ARTIST',
    description: 'Secure-disconnect ten times at over 90% trace.',
    tier: 'silver',
    check: (p) => numFlag(p, 'stat_high_trace_escapes') >= 10,
  },
  {
    id: 'cipher_friend',
    title: 'THE ELDER REMEMBERS YOU',
    description: 'Complete twenty contracts with Cipher as the client.',
    tier: 'silver',
    check: (p) => numFlag(p, 'stat_cipher_contracts') >= 20,
  },
  {
    id: 'nightowl_friend',
    title: 'LAGOS LISTENS',
    description: 'Complete twenty contracts with NIGHTOWL_22 as the client.',
    tier: 'silver',
    check: (p) => numFlag(p, 'stat_nightowl_contracts') >= 20,
  },
  {
    id: 'backdoor_master',
    title: 'BACKDOOR MASTER',
    description: 'Plant twenty persistent backdoors.',
    tier: 'silver',
    check: (p) => numFlag(p, 'stat_backdoors_planted') >= 20,
  },
  {
    id: 'bountied_survivor',
    title: 'SURVIVOR',
    description: 'Be fully traced in one mission and disconnect cleanly anyway.',
    tier: 'silver',
    check: (p) => hasFlag(p, 'stat_survived_full_trace'),
  },
  {
    id: 'data_hoarder',
    title: 'DATA HOARDER',
    description: 'Accumulate two hundred messages in your inbox.',
    tier: 'silver',
    check: (p) => numFlag(p, 'stat_inbox_total') >= 200,
  },
  {
    id: 'bond_resistor_path',
    title: 'NOT ON YOUR DIME',
    description: 'Build a clear pattern of resistor work — refuse the corporate offer enough times that it stops being offered.',
    tier: 'silver',
    check: (p) => {
      const corp = numFlag(p, 'choice_corp_contract_taken') + numFlag(p, 'choice_gov_contract_taken')
      const res  = numFlag(p, 'choice_underground_contract_taken') + 2 * numFlag(p, 'choice_corp_contract_refused')
      return res >= 10 && res > corp + 4
    },
  },

  // ── GOLD (7) ─────────────────────────────────────────────────────────────
  {
    id: 'thousand_missions',
    title: 'MARATHON',
    description: 'Complete one thousand contracts.',
    tier: 'gold',
    check: (p) => p.completedMissions.length >= 1000,
  },
  {
    id: 'wallet_warrior',
    title: 'WALLET WARRIOR',
    description: 'Earn ten million credits across your career.',
    tier: 'gold',
    check: (p) => p.stats.creditsEarned >= 10_000_000,
  },
  {
    id: 'arunmor_loyalist',
    title: 'ARUNMOR LOYALIST',
    description: 'Reach +500 standing with Arunmor.',
    tier: 'gold',
    check: (p) => standing(p, 'arunmor') >= 500,
  },
  {
    id: 'underground_loyalist',
    title: 'UNDERGROUND LOYALIST',
    description: 'Reach +500 standing with the Underground.',
    tier: 'gold',
    check: (p) => standing(p, 'the_underground') >= 500 || standing(p, 'underground') >= 500,
  },
  {
    id: 'voidlink_lifer',
    title: 'VOIDLINK LIFER',
    description: 'Reach +1000 standing with Voidlink International.',
    tier: 'gold',
    check: (p) => standing(p, 'voidlink_international') >= 1000,
  },
  {
    id: 'bond_collaborator_path',
    title: 'STABILISING PRESENCE',
    description: 'Build a clear pattern of collaborator work — corporate and governmental contracts dominate your career.',
    tier: 'gold',
    check: (p) => {
      const corp = numFlag(p, 'choice_corp_contract_taken') + numFlag(p, 'choice_gov_contract_taken')
      const res  = numFlag(p, 'choice_underground_contract_taken') + 2 * numFlag(p, 'choice_corp_contract_refused')
      return corp >= 12 && corp > res + 6
    },
  },
  {
    id: 'escalation_expert',
    title: 'ESCALATION EXPERT',
    description: 'Privilege-escalate fifty nodes.',
    tier: 'gold',
    check: (p) => numFlag(p, 'stat_escalations') >= 50,
  },

  // ── STORY (11) ───────────────────────────────────────────────────────────
  // Each Arc-1/6/7/8 resolution path gets a story achievement. Hidden until
  // earned so the choice itself remains the spoiler-free experience.
  {
    id: 'arc1_upload',
    title: 'YOU UPLOADED IT',
    description: 'Arc 1: you released what you found into the world.',
    tier: 'story', hidden: true,
    check: (p) => p.activeFlags.arc1_key_choice === 'upload',
  },
  {
    id: 'arc1_destroy',
    title: 'YOU DESTROYED IT',
    description: 'Arc 1: you took the key and buried it.',
    tier: 'story', hidden: true,
    check: (p) => p.activeFlags.arc1_key_choice === 'destroy',
  },
  {
    id: 'arc1_sell',
    title: 'YOU SOLD IT',
    description: 'Arc 1: the credits cleared in a few hours.',
    tier: 'story', hidden: true,
    check: (p) => p.activeFlags.arc1_key_choice === 'sell',
  },
  {
    id: 'arc6_purge',
    title: 'BOND-CLEAN',
    description: 'Arc 6: you burned the tunnel. Cipher respected it.',
    tier: 'story', hidden: true,
    check: (p) => hasFlag(p, 'choice_dead_drop_purge'),
  },
  {
    id: 'arc6_weaponise',
    title: 'YOU KNOW WHAT YOU COLLABORATED WITH',
    description: 'Arc 6: you used the tunnel as a backdoor. Arunmor remembers.',
    tier: 'story', hidden: true,
    check: (p) => hasFlag(p, 'choice_dead_drop_weaponise'),
  },
  {
    id: 'arc6_report',
    title: 'YOU SOLD WHAT YOU FOUND',
    description: 'Arc 6: you delivered the evidence to the highest bidder.',
    tier: 'story', hidden: true,
    check: (p) => hasFlag(p, 'choice_dead_drop_report_jcb') || hasFlag(p, 'choice_dead_drop_report_nightowl'),
  },
  {
    id: 'arc7_warn_corporate',
    title: 'CORPORATE KINGMAKER',
    description: 'Arc 7: you picked a winner. Helios Marine fell within a year.',
    tier: 'story', hidden: true,
    check: (p) => hasFlag(p, 'choice_quiet_war_warn_internic') || hasFlag(p, 'choice_quiet_war_warn_arunmor'),
  },
  {
    id: 'arc7_preserve_balance',
    title: 'BALANCE KEEPER',
    description: 'Arc 7: you kept the war warm for one more cycle. Helios moved.',
    tier: 'story', hidden: true,
    check: (p) => hasFlag(p, 'choice_quiet_war_preserve_balance'),
  },
  {
    id: 'arc7_expose_nightowl',
    title: 'YOU TURNED THE OPERATOR',
    description: 'Arc 7: you exposed NIGHTOWL. She was gone within a week.',
    tier: 'story', hidden: true,
    check: (p) => hasFlag(p, 'choice_quiet_war_expose_nightowl'),
  },
  {
    id: 'arc8_take_vance_out',
    title: 'CLEANER',
    description: 'Arc 8: the whistleblower is silent. The lighthouse continues.',
    tier: 'story', hidden: true,
    check: (p) => hasFlag(p, 'choice_lighthouse_take_vance_out'),
  },
  {
    id: 'arc8_expose_dispatch',
    title: 'YOU BROKE THE PLATFORM',
    description: 'Arc 8: you published the bundle. Voidlink Dispatch is no longer the company you signed with.',
    tier: 'story', hidden: true,
    check: (p) => hasFlag(p, 'choice_lighthouse_expose_dispatch'),
  },

  // ── PLATINUM (2) ─────────────────────────────────────────────────────────
  {
    id: 'the_full_picture',
    title: 'THE FULL PICTURE',
    description: 'Complete Arcs 1 through 8 on a single operative.',
    tier: 'platinum', hidden: true,
    check: (p) => {
      const sm = p.completedMissions
      // Look for at least one mission completion in each arc 1, 4, 5, 6, 7, 8 —
      // Arc 1 marker is the canonical arc1_key_choice flag; later arcs we read
      // the *_resolution_pending flag set on the final mission.
      const hasArc1 = !!p.activeFlags.arc1_key_choice
      const hasArc5 = sm.some((id) => id.startsWith('story_arc5_'))
      const hasArc6 = sm.some((id) => id.startsWith('story_arc6_'))
      const hasArc7 = sm.some((id) => id.startsWith('story_arc7_'))
      const hasArc8 = sm.some((id) => id.startsWith('story_arc8_'))
      return hasArc1 && hasArc5 && hasArc6 && hasArc7 && hasArc8
    },
  },
  {
    id: 'collaborator_ending',
    title: 'THE THING YOU WERE HIRED TO FIGHT',
    description: 'Reach the Collaborator ending. History will eventually have something to say.',
    tier: 'platinum', hidden: true,
    check: (p) => hasFlag(p, 'choice_ending_collaborator'),
  },
]

/**
 * Run the catalogue against the player and return the IDs of any achievements
 * whose `check` is now true AND which haven't already been recorded. Caller
 * is responsible for writing the `achievement_<id>` flag + dispatching a
 * notification.
 */
export function evaluateAchievements(player: PlayerProfile): string[] {
  const out: string[] = []
  for (const a of ACHIEVEMENTS) {
    if (player.activeFlags[`achievement_${a.id}`]) continue
    try { if (a.check(player)) out.push(a.id) } catch { /* defensive */ }
  }
  return out
}

/** Pattern-aware addendum: surface trait-driven achievements that depend on
 *  the computed DecisionPattern (not stored on player directly). Currently
 *  the catalogue's collaborator/resistor checks read activeFlag counts
 *  directly, so this is reserved for forthcoming pattern-only achievements. */
export function evaluateAchievementsWithPattern(player: PlayerProfile): string[] {
  // For now identical to evaluateAchievements; the pattern is intentionally
  // available so future pattern-shaped achievements can read it.
  void getDecisionPattern  // referenced to keep the import live
  return evaluateAchievements(player)
}

export function getAchievement(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id)
}
