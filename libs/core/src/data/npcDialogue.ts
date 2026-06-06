// M14p Pass 2a — NPC dialogue tone variants.
//
// CIPHER, NIGHTOWL_22, and VoidLink Dispatch each have a small catalogue of
// scripted dialogue moments. Each moment has multiple variants keyed to the
// player's pattern bucket — same message *position*, different *voice*.
//
// Triggers fire when conditions are met (mission counts, faction standing,
// activeFlags). Each entry fires at most once (gated via `dialogue_fired_<id>`).
//
// Variants per bucket:
//   strong_principled — Cipher uses your initials and trusts you implicitly
//   weak_principled   — Cipher is warm, professional
//   neutral           — Cipher is formal, observing
//   weak_mercenary    — Cipher is curt, pragmatic
//   strong_mercenary  — Cipher does not greet you. Some entries don't fire at all.

import type { PlayerProfile } from '../types/player.ts'
import type { DecisionPattern } from '../engine/decisionPattern.ts'

type Bucket = 'strong_principled' | 'weak_principled' | 'neutral' | 'weak_mercenary' | 'strong_mercenary'

function bucketOf(pattern: DecisionPattern): Bucket {
  const n = pattern.netScore
  if (n >= 10)  return 'strong_principled'
  if (n >= 1)   return 'weak_principled'
  if (n <= -10) return 'strong_mercenary'
  if (n <= -1)  return 'weak_mercenary'
  return 'neutral'
}

export interface NpcDialogueVariant {
  subject: string
  body: string
}

export type DialogueTrigger = (player: PlayerProfile) => boolean

export interface NpcDialogueEntry {
  id: string                          // unique; gated via dialogue_fired_<id> flag
  sender: 'CIPHER' | 'NIGHTOWL_22' | 'VoidLink Dispatch' | 'sys.ops'
  fingerprint?: string
  trigger: DialogueTrigger            // when to fire
  encrypted?: boolean
  // Variants per bucket. `null` means "this entry does not fire for that bucket"
  // — useful for moments where a high-mercenary player would simply not be
  // contacted.
  variants: Partial<Record<Bucket, NpcDialogueVariant | null>>
}

// Helpers for triggers
const successfulMissionsAtLeast = (n: number): DialogueTrigger =>
  (p) => p.stats.successfulBreaches >= n
const undergroundStandingAtLeast = (n: number): DialogueTrigger =>
  (p) => (p.factionStandings.find((f) => f.factionId === 'underground')?.score ?? 0) >= n
const arc1Chose = (choice: string): DialogueTrigger =>
  (p) => p.activeFlags.arc1_key_choice === choice

export const NPC_DIALOGUE_CATALOGUE: NpcDialogueEntry[] = [
  // ── CIPHER — first independent advice after first non-tutorial mission ────
  {
    id: 'cipher_first_advice',
    sender: 'CIPHER',
    fingerprint: 'C19H 3R20 7B83 D6CC',
    encrypted: true,
    trigger: successfulMissionsAtLeast(2),
    variants: {
      strong_principled: {
        subject: 're: nice work',
        body: `That was clean. The wipe pattern told me everything I needed to know.\n\nSome operatives never learn the difference between fast and quiet. You did, in two missions. You'll be fine.\n\n— C.`,
      },
      weak_principled: {
        subject: 'a note',
        body: `Saw the wipe pattern. Professional.\n\nKeep that habit. The hard part isn't getting in — it's leaving without writing your name on the wall.\n\n— C.`,
      },
      neutral: {
        subject: 'observation',
        body: `Two missions. Decent work. You'll find your style.\n\nRemember: wipe everything. Even when nobody's looking. *Especially* when nobody's looking.\n\n— Cipher.`,
      },
      weak_mercenary: {
        subject: 'a thought',
        body: `Saw the work. Loud, but effective.\n\nA suggestion, not advice — wipe the logs every time. Not because of who might see them. Because of who you become if you stop.\n\n— Cipher.`,
      },
      strong_mercenary: {
        subject: '(no subject)',
        body: `Saw the work.\n\nCipher.`,
      },
    },
  },

  // ── CIPHER — the three-rules letter after the player has settled in ──────
  {
    id: 'cipher_three_rules',
    sender: 'CIPHER',
    fingerprint: 'C19H 3R20 7B83 D6CC',
    encrypted: true,
    trigger: successfulMissionsAtLeast(8),
    variants: {
      strong_principled: {
        subject: 'three rules — by request',
        body: `Three things will keep you alive longer than upgrades:\n\n  1. Build your RELAY CHAIN before every job. No exceptions.\n  2. Wipe your logs. Time-stomp them too.\n  3. Don't bank where you breach.\n\nYou already know these. I'm writing them down because I want you to have them in your inbox the next time you doubt yourself.\n\n— C.`,
      },
      weak_principled: {
        subject: 'three things',
        body: `Three things will keep you alive longer than upgrades:\n\n  1. RELAY CHAIN before every job.\n  2. Wipe your logs. Stomp them.\n  3. Don't bank at Pacific National. Bank where your trail isn't a beacon.\n\n— Cipher.`,
      },
      neutral: {
        subject: 'three rules',
        body: `Three things will keep you alive:\n\n  1. RELAY CHAIN before every job.\n  2. Wipe your logs.\n  3. Don't bank where you breach.\n\nWatch yourself out there.\n\n— Cipher.`,
      },
      weak_mercenary: {
        subject: 'unsolicited advice',
        body: `Three things, since you've been making it work the loud way:\n\n  1. RELAY CHAIN. Always.\n  2. Wipe and stomp every log. The temporal fingerprint catches more operatives than the alarm does.\n  3. Pacific National is fine for the money. It's not fine for the trail.\n\nYour choice what you do with that.\n\n— Cipher.`,
      },
      strong_mercenary: null,  // does not fire — Cipher has stopped writing
    },
  },

  // ── NIGHTOWL_22 — first independent contract pitch ───────────────────────
  {
    id: 'nightowl_first_contract',
    sender: 'NIGHTOWL_22',
    fingerprint: 'F00D BABE C0FF EE42',
    trigger: successfulMissionsAtLeast(5),
    variants: {
      strong_principled: {
        subject: 'I have something',
        body: `Heard about the Universal Microsystems job. Clean work.\n\nI've got a contract that needs the same care. Pays less than Voidlink's listings, but you'll know what you're doing it for. No civilians. No collateral.\n\nLet me know.\n\n— NIGHTOWL_22.`,
      },
      weak_principled: {
        subject: 'a job',
        body: `Word travels. I've got something on the side — pays decent, target's a mid-tier corp that's been doing some genuinely ugly things.\n\nLet me know if you're interested. No pressure.\n\n— NO22.`,
      },
      neutral: {
        subject: 'work available',
        body: `Got a contract on the side. Mid-tier corporate target. Decent payout, straightforward.\n\nLet me know if you want it.\n\n— NIGHTOWL_22.`,
      },
      weak_mercenary: {
        subject: 'work',
        body: `Contract available. Pays well. No questions on either side.\n\nLet me know.\n\n— NO22.`,
      },
      strong_mercenary: {
        subject: 'cash work',
        body: `If you want it: corporate target, no oversight, pays whatever the contract clears.\n\nNot my usual clientele. But I don't lecture.\n\n— NO22.`,
      },
    },
  },

  // ── VoidLink Dispatch — automated rank-up acknowledgement ────────────────
  {
    id: 'dispatch_rank3',
    sender: 'VoidLink Dispatch',
    fingerprint: '0001 0001 V01D L1NK',
    trigger: (p) => p.rank >= 3,
    variants: {
      strong_principled: {
        subject: '[AUTOMATED] Rank promotion — SPECIALIST',
        body: `Operative,\n\nYour Voidlink International standing has reached SPECIALIST tier.\n\nReputation patterns indicate **principled professional conduct**. You are now eligible for the SPECIALIST-tier Voidlink Stewardship contracts — a small subset of the platform's contract pool, offered selectively. Check your Mission Board.\n\n— VoidLink Dispatch.`,
      },
      weak_principled: {
        subject: '[AUTOMATED] Rank promotion — SPECIALIST',
        body: `Operative,\n\nYour Voidlink International standing has reached SPECIALIST tier. Higher-difficulty contracts are now available on your Mission Board.\n\n— VoidLink Dispatch.`,
      },
      neutral: {
        subject: '[AUTOMATED] Rank promotion — SPECIALIST',
        body: `Operative,\n\nYour Voidlink International standing has reached SPECIALIST tier. Higher-difficulty contracts are now available.\n\n— VoidLink Dispatch.`,
      },
      weak_mercenary: {
        subject: '[AUTOMATED] Rank promotion — SPECIALIST',
        body: `Operative,\n\nSPECIALIST tier reached. The high-payout contract pool is now visible to you.\n\n— VoidLink Dispatch.`,
      },
      strong_mercenary: {
        subject: '[AUTOMATED] Rank promotion — SPECIALIST',
        body: `Operative,\n\nSPECIALIST tier reached. You also qualify for **Tier-2 Mercenary Listings** — premium, no-oversight contracts. Discretion expected.\n\n— VoidLink Dispatch.`,
      },
    },
  },

  // ── CIPHER — Underground induction (story-relevant) ──────────────────────
  {
    id: 'cipher_underground_induction',
    sender: 'CIPHER',
    fingerprint: 'C19H 3R20 7B83 D6CC',
    encrypted: true,
    trigger: (p) =>
      undergroundStandingAtLeast(50)(p)
      && (p.activeFlags.choice_whistleblower_protected as number ?? 0) >= 1,
    variants: {
      strong_principled: {
        subject: 'welcome',
        body: `[K.]\n\nI'm using your initials now. You earned them.\n\nWhat you've been building isn't a career. It's a community. The Underground doesn't have membership cards — but you're in. The people who matter already know your handle.\n\nThere are things I can tell you now that I couldn't tell you before. Watch for the next message.\n\n— C.`,
      },
      weak_principled: {
        subject: 'a note',
        body: `Your work has been noticed.\n\nThe people you've helped are talking about you on the Mesh. That's how this works — no ceremony, no induction, just other operatives starting to recognise your handle and treating it like it means something.\n\nIt does now.\n\n— Cipher.`,
      },
      // For neutral / mercenary patterns the induction simply doesn't happen,
      // and Cipher doesn't acknowledge whistleblower protection if it was
      // genuinely incidental. The Underground reads the pattern, not just the
      // standing.
      neutral: null,
      weak_mercenary: null,
      strong_mercenary: null,
    },
  },

  // ── Arc-1 specific echo: Cipher reacts to the player's key choice ────────
  {
    id: 'cipher_arc1_aftermath_upload',
    sender: 'CIPHER',
    fingerprint: 'C19H 3R20 7B83 D6CC',
    encrypted: true,
    trigger: arc1Chose('upload'),
    variants: {
      strong_principled: {
        subject: 'you uploaded it',
        body: `You uploaded the key.\n\nI knew you would. I won't tell you why I knew — that's for later — but the Underground forums have been talking about nothing else for two days. The general view is that you've done the bravest thing any operative has done in the last decade.\n\nThe Government will hunt you. Be ready.\n\n— C.`,
      },
      weak_principled: {
        subject: 'about the key',
        body: `You uploaded it.\n\nThere are several views in the Underground about what you did. The dominant one is: it was the right choice and the dangerous one, and you'll need to be careful for a long time.\n\nWatch your trace. Watch your gateway. They will come.\n\n— Cipher.`,
      },
      neutral: {
        subject: 'about the key',
        body: `You uploaded the key.\n\nI don't have an opinion to share — that's for later. What I will say: the JCB has your handle on their priority list. Their hunt rate against operatives at your tier was 0.4% per year before this. It will be higher for you specifically.\n\nWatch yourself.\n\n— Cipher.`,
      },
      weak_mercenary: {
        subject: 'about the key',
        body: `You uploaded it. I expected you'd sell it.\n\nThe outcome is the outcome. The next year will be harder than the last. The JCB will come, and they will come specifically for you.\n\nGood luck.\n\n— Cipher.`,
      },
      strong_mercenary: null,
    },
  },
  {
    id: 'cipher_arc1_aftermath_destroy',
    sender: 'CIPHER',
    fingerprint: 'C19H 3R20 7B83 D6CC',
    encrypted: true,
    trigger: arc1Chose('destroy'),
    variants: {
      strong_principled: {
        subject: 'you destroyed it',
        body: `You destroyed it.\n\nThat was the conservative choice. Some would say the cowardly one. I will not, because I understand the appeal of certainty in a world that offers very little of it.\n\nREVELATION survived in fragments. We will hear from it again. Probably sooner than is comfortable.\n\nBe ready.\n\n— C.`,
      },
      weak_principled: {
        subject: 'about the key',
        body: `You destroyed the key.\n\nThe Underground is divided. Some think you did the right thing. Some think you didn't. The argument will continue.\n\nWhat we know: REVELATION did not entirely die. Be ready for what comes next.\n\n— Cipher.`,
      },
      neutral: {
        subject: 'about the key',
        body: `You destroyed it. A defensible choice.\n\nFragments remain. We will see what they become.\n\n— Cipher.`,
      },
      weak_mercenary: {
        subject: 'about the key',
        body: `Destroyed. Interesting. I'd have bet on the sell.\n\nFragments survived. We'll see.\n\n— Cipher.`,
      },
      strong_mercenary: null,
    },
  },
  {
    id: 'cipher_arc1_aftermath_sell',
    sender: 'CIPHER',
    fingerprint: 'C19H 3R20 7B83 D6CC',
    encrypted: true,
    trigger: arc1Chose('sell'),
    variants: {
      // Even high-principled players who sold get this — but Cipher's tone
      // is measured. He's not going to pretend it wasn't what it was.
      strong_principled: {
        subject: 'you sold it',
        body: `You sold the key.\n\nI did not predict this. I was wrong about you.\n\nWhat happens next is not necessarily bad. People do things for reasons that look strange from the outside. I will continue to take an interest in your career.\n\nBut understand: there are doors that have now closed.\n\n— C.`,
      },
      weak_principled: {
        subject: 'you sold it',
        body: `You sold it.\n\nThe credits will help. The reputation, less so. There are operatives on the Mesh who will read this and assume the worst.\n\nI am reserving judgment. We will see.\n\n— Cipher.`,
      },
      neutral: {
        subject: 'about the key',
        body: `You sold it. The buyer is — as of this writing — unknown.\n\nWhatever they do with it next, I hope you were paid well.\n\n— Cipher.`,
      },
      weak_mercenary: {
        subject: 'about the key',
        body: `Sold. Predictable. You'll be liquid for a while.\n\nThe consequences will arrive on their own schedule.\n\n— Cipher.`,
      },
      strong_mercenary: {
        subject: '(no subject)',
        body: `Sold. The credits clear in a few hours.\n\nCipher.`,
      },
    },
  },
]

/**
 * Find any dialogue entries whose triggers have just become true and which
 * haven't already fired. Returns the entries; the caller is responsible for
 * dispatching them to the inbox and marking `dialogue_fired_<id>` flags.
 */
export function evaluateDialogueTriggers(player: PlayerProfile): NpcDialogueEntry[] {
  const out: NpcDialogueEntry[] = []
  for (const entry of NPC_DIALOGUE_CATALOGUE) {
    if (player.activeFlags[`dialogue_fired_${entry.id}`]) continue
    if (!entry.trigger(player)) continue
    out.push(entry)
  }
  return out
}

/**
 * Pick the variant for an entry based on the pattern. Returns null if the
 * entry deliberately does not fire for that pattern bucket.
 */
export function pickDialogueVariant(
  entry: NpcDialogueEntry,
  pattern: DecisionPattern,
): NpcDialogueVariant | null {
  const bucket = bucketOf(pattern)
  const v = entry.variants[bucket]
  if (v === undefined) {
    // Fall back through nearby buckets — strong_mercenary missing? try weak.
    const fallback: Bucket[] = bucket === 'strong_principled'
      ? ['weak_principled', 'neutral']
      : bucket === 'strong_mercenary'
        ? ['weak_mercenary', 'neutral']
        : ['neutral']
    for (const b of fallback) {
      const fv = entry.variants[b]
      if (fv !== undefined) return fv
    }
    return null
  }
  return v
}
