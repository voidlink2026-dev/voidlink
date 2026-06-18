// P7 — Ambient World Drip.
//
// Non-gameplay headlines + inbox messages that drip into the world even
// when the player is idle. Makes the world feel lived-in between contracts.
// Items are picked from a weighted pool by `pickAmbientDrip()` and fired
// from the game-loop tick at a slow cadence (~one every 4-8 in-game hours).
//
// Each entry is one-shot per save (gated by `ambient_<id>` activeFlag) so
// the same headline doesn't repeat on the same character. Once the pool is
// exhausted, the world simply stops dripping (the catalogue is large
// enough that this won't happen during a normal playthrough).
//
// Entries write to either the news feed or the inbox depending on `kind`.
// Pattern-aware filtering lets a few entries lean into the player's
// current bucket (corporate-drift player sees more corporate-good-news
// headlines; resistor sees more "unrest in the wreckage" pieces) without
// being heavy-handed about it.

import type { PlayerProfile } from '../types/player.ts'
import { getDecisionPattern } from '../engine/decisionPattern.ts'

type Bucket = 'strong_principled' | 'weak_principled' | 'neutral' | 'weak_mercenary' | 'strong_mercenary'
type DripKind = 'news' | 'inbox_system'
// Aligned with the NewsItem.category union used by the web store.
type NewsCategory = 'tech' | 'corporate' | 'crime'

export interface AmbientDripTemplate {
  id: string
  kind: DripKind
  category?: NewsCategory     // required for news
  subject?: string            // required for inbox_system
  headline?: string           // required for news
  body: string                // resolved at fire time
  // Optional bucket gating — entries weight toward certain pattern buckets.
  preferredBucket?: Bucket | 'any'
  weight?: number             // default 1; higher = picked more often
}

const ANY = 'any' as const

export const AMBIENT_DRIP_CATALOGUE: AmbientDripTemplate[] = [
  // ── News: tech / infrastructure ────────────────────────────────────────
  {
    id: 'reykjavik_weather',
    kind: 'news', category: 'tech',
    headline: 'Reykjavík Weather Warning — Coastal Flooding Possible',
    body: 'Iceland\'s national meteorological office has issued coastal warnings for the Westfjords. Minor flooding expected through the end of the week. Visitors in the Reykjavík area should consult local advisories.',
    preferredBucket: ANY,
  },
  {
    id: 'mesh_uptime_99',
    kind: 'news', category: 'tech',
    headline: 'Voidlink Mesh Reports 99.97% Uptime for Q3',
    body: 'Voidlink International\'s Geneva operations have published their quarterly infrastructure report. The Mesh recorded 99.97% routing uptime across the period, marking the eleventh consecutive quarter above the 99.9% threshold. Voidlink declined to comment on specific outage causes.',
    preferredBucket: ANY,
  },
  {
    id: 'submarine_cable_repair',
    kind: 'news', category: 'tech',
    headline: 'Trans-Atlantic Cable Repair Completed Ahead of Schedule',
    body: 'Internic Holdings has confirmed the repair of TAT-23, the trans-Atlantic submarine cable that suffered fishing-trawler damage in late October. Latency to North American routes has fully recovered.',
    preferredBucket: ANY,
  },
  {
    id: 'satellite_replacement',
    kind: 'news', category: 'tech',
    headline: 'Ares Division Launches Replacement Surveillance Satellite',
    body: 'A successful launch from the Tanegashima facility has placed the replacement for the decommissioned AR-7 satellite into low Earth orbit. The new platform is operational within 72 hours.',
    preferredBucket: 'strong_mercenary',
  },

  // ── News: corporate ────────────────────────────────────────────────────
  {
    id: 'arunmor_earnings_beat',
    kind: 'news', category: 'corporate',
    headline: 'Arunmor Beats Q3 Earnings Expectations',
    body: 'Arunmor Corporation reported quarterly earnings 12% above analyst consensus, driven by neural-interface licensing revenue and a recovery in the European pharmaceutical segment. Shares opened 4.1% higher in pre-market trading. The board reaffirmed full-year guidance.',
    preferredBucket: 'strong_mercenary',
  },
  {
    id: 'nexus_layoffs',
    kind: 'news', category: 'corporate',
    headline: 'Nexus Banking Cuts 800 Roles in EU Restructuring',
    body: 'Nexus has confirmed the elimination of 800 roles across its EU operations, primarily in back-office processing and internal compliance. The cuts will be completed before the end of the calendar year. Affected employees have been offered standard severance packages and outplacement support.',
    preferredBucket: ANY,
  },
  {
    id: 'mei_lin_public_interview',
    kind: 'news', category: 'corporate',
    headline: 'Mei Lin Defends Arunmor\'s Research Ethics in Rare Interview',
    body: 'Mei Lin, lead research scientist at Arunmor Corporation, has given a rare public interview to *The Reykjavík Independent*. The interview, conducted in Reykjavík, runs to 40 minutes and covers the public concerns about Arunmor\'s research programmes. Lin declined to discuss specific projects by name.',
    preferredBucket: ANY,
  },
  {
    id: 'helios_marine_quarterly',
    kind: 'news', category: 'corporate',
    headline: 'Helios Marine Cooperative Posts Eleventh Profitable Quarter',
    body: 'Helios Marine, the South China Sea labour cooperative, has reported its eleventh consecutive profitable quarter under the multi-jurisdiction registration that replaced its previous corporate structure. Worker dividends will be paid in full on schedule.',
    preferredBucket: 'strong_principled',
  },
  {
    id: 'internic_carbon_pledge',
    kind: 'news', category: 'corporate',
    headline: 'Internic Pledges Net-Zero Routing by 2210',
    body: 'Internic Holdings has committed to net-zero routing infrastructure emissions by 2210, a year earlier than the previous public timeline. Independent climate analysts have described the new commitment as "credible if difficult." Internic has not, in the announcement, specified how it intends to reach the target.',
    preferredBucket: ANY,
  },

  // ── News: crime ────────────────────────────────────────────────────────
  {
    id: 'jcb_operation_dawn',
    kind: 'news', category: 'crime',
    headline: 'JCB Operation "Dawn" Closes Eight-Month Sweep',
    body: 'The Joint Cybersecurity Bureau has concluded Operation Dawn, an eight-month coordinated sweep against unaffiliated contractors operating across European routing infrastructure. The Bureau has confirmed 23 arrests and 41 voluntary surrenders. No public list of charged operatives has been released.',
    preferredBucket: 'strong_mercenary',
  },
  {
    id: 'lagos_district_unrest',
    kind: 'news', category: 'crime',
    headline: 'Lagos Sixth District Reports Twelfth Night of Unrest',
    body: 'Lagos Metropolitan Authority has reported a twelfth consecutive night of unrest in the Sixth District. The trigger remains a contested police incident from late September. Mesh observers note that the affected district overlaps with several long-standing operative residences.',
    preferredBucket: 'strong_principled',
  },
  {
    id: 'identity_market_disruption',
    kind: 'news', category: 'crime',
    headline: 'Underground Identity Market Disrupted — Three Brokers Offline',
    body: 'Three established brokers in the underground identity-laundering market have ceased operations within the same 72-hour window. The Mesh attributes the silence to an unrelated infrastructure problem; observers familiar with the trade describe the timing as "extremely improbable."',
    preferredBucket: ANY,
  },
  {
    id: 'whistleblower_protection_act',
    kind: 'news', category: 'crime',
    headline: 'EU Parliament Tightens Corporate Whistleblower Protections',
    body: 'The European Parliament has voted to extend statutory protections for corporate whistleblowers, including new provisions for anonymity, financial restitution, and the criminalisation of retaliation. The vote passed 487–164 with 32 abstentions. The new framework takes effect from January.',
    preferredBucket: 'strong_principled',
  },

  // ── News: politics ─────────────────────────────────────────────────────
  {
    id: 'geneva_summit',
    kind: 'news', category: 'crime',
    headline: 'Geneva Summit on AI Containment Concludes Without Communiqué',
    body: 'The Geneva summit on autonomous-system containment, attended by representatives of seventeen states and four corporate entities including Arunmor, has concluded without a final communiqué. Sources close to the negotiations describe the impasse as "the expected one." Public discussion of REVELATION by name was not on the agenda.',
    preferredBucket: ANY,
  },
  {
    id: 'reconciliation_anniversary',
    kind: 'news', category: 'crime',
    headline: 'Reconciliation Article XII Marks Twenty-Fifth Anniversary',
    body: 'Twenty-five years have passed since the signing of Reconciliation Article XII, the treaty that established Geneva neutral territory in the aftermath of the October Event. Anniversary commemorations will be held tomorrow at the Palais des Nations. Voidlink International has confirmed it will attend.',
    preferredBucket: ANY,
  },
  {
    id: 'jcb_oversight_review',
    kind: 'news', category: 'crime',
    headline: 'Independent Review of JCB Powers Announced',
    body: 'A multi-jurisdictional independent review of the Joint Cybersecurity Bureau\'s powers has been formally announced. The review will examine warrant procedures, the use of intercept evidence, and the Bureau\'s relationship with private intelligence subcontractors. The findings are due in 18 months.',
    preferredBucket: ANY,
  },
  {
    id: 'underground_amnesty_proposal',
    kind: 'news', category: 'crime',
    headline: 'EU Proposes Limited Amnesty for First-Time Operatives',
    body: 'A draft EU proposal would offer limited statutory amnesty to first-time contractor offenders who voluntarily register with national cybercrime units. The proposal is opposed by the JCB and by several member states. Operative response on the Mesh has been "uniformly contemptuous."',
    preferredBucket: ANY,
  },

  // ── Inbox: system messages from sys.ops / Dispatch ─────────────────────
  {
    id: 'sys_maintenance_routine',
    kind: 'inbox_system',
    subject: 'Scheduled maintenance — relay infrastructure',
    body:
      'sys.ops — Scheduled maintenance window 02:00 to 02:45 Voidlink Standard Time.\n\n' +
      'Relay infrastructure will be briefly degraded during the window. Active contracts will not be interrupted; routing latency may increase. Apologies for any inconvenience.\n\n' +
      '— sys.ops',
    preferredBucket: ANY,
  },
  {
    id: 'sys_quarterly_brief',
    kind: 'inbox_system',
    subject: 'Quarterly platform brief',
    body:
      'Operative,\n\n' +
      'Routine quarterly notice from Voidlink Dispatch. Platform statistics for the period:\n\n' +
      '  Active operatives on the network: ~90,000 (stable)\n' +
      '  Contracts routed: 1.4 million (up 3.8% YoY)\n' +
      '  Disputes resolved through arbitration: 0.014% of contracts\n' +
      '  Bond Rule 4 enforcement actions: 0\n\n' +
      'No action required. This brief is provided for transparency.\n\n' +
      '— VoidLink Dispatch',
    preferredBucket: ANY,
  },
  {
    id: 'sys_intercept_advisory',
    kind: 'inbox_system',
    subject: 'Routing advisory — JCB intercept patterns',
    body:
      'sys.ops — Advisory notice.\n\n' +
      'Mesh observers have noted increased JCB intercept activity along the trans-Pacific routing layer. Operatives running contracts west of the dateline are advised to consider additional relay hops where available.\n\n' +
      'This advisory does not affect active contracts. No action required.\n\n' +
      '— sys.ops',
    preferredBucket: ANY,
  },
  {
    id: 'sys_bank_change',
    kind: 'inbox_system',
    subject: 'Banking notice — Pacific National APR adjustment',
    body:
      'sys.ops — Banking notice.\n\n' +
      'Pacific National has adjusted its operative-tier APR from 12.0% to 11.4%, effective the start of next quarter. Existing deposits accrue at the new rate from the effective date. No action required.\n\n' +
      '— sys.ops',
    preferredBucket: ANY,
  },
  {
    id: 'sys_archive_lookback',
    kind: 'inbox_system',
    subject: 'Anniversary archive — Voidlink milestones',
    body:
      'sys.ops — Anniversary archive notice.\n\n' +
      'Voidlink International has been operational, in some form, for sixty-four years as of this month. Public archive access for milestone documents has been refreshed and is available through the standard Mesh archive endpoint.\n\n' +
      'No action required. This notice will not be repeated.\n\n' +
      '— sys.ops',
    preferredBucket: ANY,
  },
  {
    id: 'sys_security_advisory',
    kind: 'inbox_system',
    subject: 'Security advisory — credential hygiene',
    body:
      'sys.ops — Security advisory.\n\n' +
      'Voidlink Dispatch reminds operatives of standard credential hygiene practice. Cached credentials should be cleared from local stores after use. Voidlink does not, formally, retain operative credentials at any point in the routing chain.\n\n' +
      'Formally.\n\n' +
      '— sys.ops',
    preferredBucket: ANY,
  },
]

/**
 * Pick the next ambient drip entry for the player. Returns null when the
 * pool is exhausted (every entry already has its `ambient_<id>` flag set
 * on the player). Picks weighted by `weight` (default 1) and biased toward
 * `preferredBucket` matching the player's current pattern bucket.
 */
export function pickAmbientDrip(player: PlayerProfile, rng: () => number = Math.random): AmbientDripTemplate | null {
  const pattern = getDecisionPattern(player)
  const bucket: Bucket =
    pattern.netScore >= 10 ? 'strong_principled' :
    pattern.netScore >= 1  ? 'weak_principled' :
    pattern.netScore <= -10 ? 'strong_mercenary' :
    pattern.netScore <= -1  ? 'weak_mercenary' :
    'neutral'

  const eligible = AMBIENT_DRIP_CATALOGUE.filter((t) => !player.activeFlags[`ambient_${t.id}`])
  if (eligible.length === 0) return null

  // Weight: base weight × 2 for matching preferredBucket, × 1.4 for ANY.
  const weighted = eligible.map((t) => {
    const base = t.weight ?? 1
    const match =
      t.preferredBucket === bucket ? 2.0 :
      t.preferredBucket === 'any'  ? 1.4 :
      1.0
    return { template: t, w: base * match }
  })
  const totalW = weighted.reduce((s, x) => s + x.w, 0)
  const pick = rng() * totalW
  let acc = 0
  for (const x of weighted) {
    acc += x.w
    if (pick < acc) return x.template
  }
  return weighted[weighted.length - 1].template
}
