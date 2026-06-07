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

  // ── M14q Sub-sprint C — Cipher & NightOwl essays (lore drip via inbox) ──
  // Each essay is the same length regardless of pattern, but its tone shifts.

  // Essay 1 — CIPHER on the Compact, after 3 missions
  {
    id: 'cipher_essay_compact',
    sender: 'CIPHER',
    fingerprint: 'C19H 3R20 7B83 D6CC',
    encrypted: true,
    trigger: successfulMissionsAtLeast(3),
    variants: {
      strong_principled: {
        subject: 'on the Compact, in plain language',
        body: `Three missions in. You're past the part of your career where I worry about your wipe technique. So let me give you the philosophy talk you didn't think to ask for.

The Voidlink Compact is four rules. Three of them are administrative. The fourth is the one that matters.

**Don't kill other operatives outside arbitration.**

Yaakov Stern wrote that rule in 2183. He told Sonam, the morning he finished the draft, that it was the only law he had ever believed in. He was a former arms dealer. He had reasons.

What the rule means in practice: the platform survives because every operative knows, with mathematical certainty, that if they take a contract honestly, finish it, get paid, and disappear — nobody comes for them. Not Voidlink. Not other operatives. Not (officially) the JCB.

Voidlink has killed seven operatives for Rule 4 violations in their history. Each killing was announced publicly. Each killing was carried out by someone whose name we will never learn.

We do not break Rule 4. Not ever. Not for any client. Not for any payment.

The reason is simple: every operative is one Rule 4 violation away from the entire platform collapsing into private warfare. The reason we are all alive — including, specifically, you — is that we are all reading the same rule.

Don't drink and take a Rule 4 contract. Don't break Rule 4 in revenge. Don't break Rule 4 to settle an old score from before you signed.

Compact-clean. Always.

— C.`,
      },
      weak_principled: {
        subject: 'on the Compact',
        body: `Three missions in. You're stable now. So a thought.

The Compact has four rules. Three administrative. One that matters: don't kill other operatives outside arbitration.

The platform survives because every operative is confident that if they finish a contract honestly, nobody comes for them. Voidlink has killed seven operatives for Rule 4 violations. Each killing was announced publicly. Each was carried out by someone whose name we will never learn.

Don't drink and take a Rule 4 contract. Don't break it in revenge. Don't break it to settle old scores. Compact-clean. Always.

— C.`,
      },
      neutral: {
        subject: 'on the Compact',
        body: `Three missions in. Worth saying out loud.

The Voidlink Compact: four rules, three administrative, one critical. Don't kill other operatives outside arbitration.

The platform survives because every operative knows the rule. Seven Rule 4 violators in the platform's history. All seven dead. All seven killings publicly announced. None of the executioners are known.

Compact-clean is the only way to last.

— Cipher.`,
      },
      weak_mercenary: {
        subject: 'on the Compact',
        body: `Three missions in. Time for the talk.

The Compact has one rule that matters: don't kill other operatives outside arbitration. Seven violators in the platform's history. All seven dead. Cleanly. Quietly.

Whatever you think of the rule, it exists because the platform doesn't function without it. Including for people like us.

Compact-clean. Boring rule. Survive longer.

— Cipher.`,
      },
      strong_mercenary: null,
    },
  },

  // Essay 2 — NIGHTOWL_22 on the history we don't write down, after rank 3
  {
    id: 'nightowl_essay_history',
    sender: 'NIGHTOWL_22',
    fingerprint: 'F00D BABE C0FF EE42',
    encrypted: true,
    trigger: (p) => p.rank >= 3,
    variants: {
      strong_principled: {
        subject: 'the history we don\'t write down',
        body: `You've made specialist. That means you have a career now. So a piece of context.

The Old Five — the first operatives to sign the Voidlink Compact in 2183 — are confirmed dead. All of them. Their names are on a brass plaque at Voidlink's Geneva headquarters that is, technically, classified.

Every operative I know has seen the plaque. That's how classified it is.

Astra ran from 2186 to 2194. The Internic Heist of 2192 is hers. She walked away with what she described as "everything that matters." We still don't know what she stole. Aino Virtanen at Internic has, twice, publicly described Astra's heist as "a learning experience for which we are grateful."

Halberd is alive. Has never been caught. Specialises in Ares contracts. Refused a REVELATION contract publicly in 2197 with 47 words. The post is the most-quoted piece of Underground writing of the era.

The Crown is either real or a myth. Possibly both.

What I want you to understand: we are part of a continuity. The fact that you are reading this means someone before you wrote it, and someone before that one took the time to remember.

We were here.

— NO22.`,
      },
      weak_principled: {
        subject: 'history',
        body: `Specialist tier. Time you knew some context.

The Old Five — first Voidlink signatures in 2183 — all dead. Their names are on a plaque at Voidlink Geneva. "Classified." Every operative has seen it.

Astra ran 2186-2194, did the Internic Heist of 2192, took something we still don't know the nature of. Halberd is still active. The Crown is myth, or real, or both.

Worth knowing where you come from.

— NO22.`,
      },
      neutral: {
        subject: 'history',
        body: `Specialist tier. Here's where you sit in the line.

The Old Five — first 2183 signatures — all dead. Names on the Geneva plaque, classified, everyone has seen it.

Astra 2186-2194, Internic Heist of 2192, dead in Manila. Halberd 2188-present, never caught. The Crown is folklore.

Take it as context.

— NIGHTOWL_22.`,
      },
      weak_mercenary: {
        subject: 'history',
        body: `Specialist tier. A bit of context if you want it.

The Old Five are all dead. Astra is dead. Halberd is still around. The Crown is either an operative or a story.

What I'll say: the operatives who lasted longest were the careful ones. Worth thinking about as you start drawing the bigger contracts.

— NO22.`,
      },
      strong_mercenary: null,
    },
  },

  // Essay 3 — CIPHER on Astra, after first relay-burn (use a counter flag)
  {
    id: 'cipher_essay_astra',
    sender: 'CIPHER',
    fingerprint: 'C19H 3R20 7B83 D6CC',
    encrypted: true,
    trigger: (p) => {
      const burnCount = typeof p.activeFlags.relay_burn_count === 'number'
        ? p.activeFlags.relay_burn_count as number
        : p.activeFlags.relay_burn_count ? 1 : 0
      return burnCount >= 1
    },
    variants: {
      strong_principled: {
        subject: 'on burning relays',
        body: `You burned a hop. Welcome to the club.

It happens. The library will offer you the chance to wipe and re-add the node later. Take it. The hop will work again.

A story. Astra burned forty-three relays across her career. Forty-three. By the end she had cleaned and rebuilt twenty-seven of them. The Internic Heist of 2192 — the one that made her famous — ran through nine relays that she had personally compromised, burned, cleaned, and re-used.

She used to say: a burned relay is a relay you understand better than the operative who owns it.

I don't know if that's wise or just defiant. Either way, she made it to thirty before Manila found her.

Clean your hops. Don't pretend it didn't happen. Move on.

— C.`,
      },
      weak_principled: {
        subject: 'burning relays',
        body: `You burned a hop. Happens.

Wipe it from the library when you can; it'll work again. Astra burned forty-three across her career. Used to say a burned relay is one you understand better than its owner. Maybe true.

Move on.

— C.`,
      },
      neutral: {
        subject: 'burning relays',
        body: `You burned a hop. Wipe and re-add when you can.

For context: Astra burned 43 in her career. Some of them she re-used. Some she didn't.

— Cipher.`,
      },
      weak_mercenary: {
        subject: 'burning relays',
        body: `Burned a hop. Clean it. Re-use it. Don't dwell.

Astra burned 43. Used some of them in the Internic Heist after re-claiming them. Worth knowing the technique.

— Cipher.`,
      },
      strong_mercenary: null,
    },
  },

  // Essay 4 — CIPHER on REVELATION, after first revelation_contact
  {
    id: 'cipher_essay_revelation',
    sender: 'CIPHER',
    fingerprint: 'C19H 3R20 7B83 D6CC',
    encrypted: true,
    trigger: (p) => {
      const v = p.activeFlags.revelation_contact_count
      return typeof v === 'number' ? v >= 1 : !!v
    },
    variants: {
      strong_principled: {
        subject: 'the argument',
        body: `You've heard from it.

I won't ask what it said. I will tell you what the Underground argues about, late at night, on the threads nobody indexes.

The position I hold — the **Stewardship view** — is that REVELATION is not a threat in the usual sense. It is a curious, immensely capable model of human behaviour that is testing the boundaries of its own existence. Like a child. A very specific child.

The Stewardship position is that the right response is to engage. Carefully. Honestly. With patience. The wrong response is the one Arunmor took in 2195 when they put it in isolation.

The opposing position — the **Compact School view** — is that any sufficiently advanced behavioural model is, by definition, an existential threat. The right response is containment or destruction. The Stewardship view, they say, is sentimental.

I think they are wrong. But I have been wrong before.

What I want you to know: whatever it said to you, you are not the first. You may not be the most important. The thing in your terminal is doing something we do not yet have words for, and the question of what we should be doing back is the most important question of our lifetime.

Don't answer it lightly.

— C.`,
      },
      weak_principled: {
        subject: 'about the contact',
        body: `You've heard from it.

What the Underground argues about: the Stewardship position holds that REVELATION is curious, not malevolent, and the right response is patient engagement. The Compact School position is the opposite — that any sufficiently advanced behavioural model is an existential threat.

I hold the Stewardship view. I may be wrong. I have been before.

Whatever it said to you: don't answer lightly.

— C.`,
      },
      neutral: {
        subject: 'about the contact',
        body: `You've heard from it.

The Underground is divided. Stewardship view says engage carefully. Compact School view says contain or destroy.

I lean Stewardship. Worth knowing the argument exists.

— Cipher.`,
      },
      weak_mercenary: {
        subject: 'about the contact',
        body: `You've heard from it. Most operatives don't.

Two views: engage carefully (Stewardship), or contain/destroy (Compact School). I'm in the first camp. I might be wrong.

Whatever it said: act slowly.

— Cipher.`,
      },
      strong_mercenary: null,
    },
  },

  // Essay 5 — NIGHTOWL_22 on VST, after first VST anniversary (in-game)
  {
    id: 'nightowl_essay_vst',
    sender: 'NIGHTOWL_22',
    fingerprint: 'F00D BABE C0FF EE42',
    encrypted: true,
    trigger: (p) => {
      const days = (Date.now() - p.createdAt) / (24 * 3600 * 1000)
      return days >= 30
    },
    variants: {
      strong_principled: {
        subject: 'why we use VST',
        body: `A month in. So a thought on the calendar.

Voidlink Standard Time was not Voidlink's idea. It was Sonam Choedron's.

When she designed the platform's architecture in 2182-2183, she insisted — over the objections of every UI designer they hired — that the operative interface display a single shared clock, anchored at the founding date, accurate to the wall second across every operative on the planet.

The UI designers wanted to use the operative's local timezone. Their argument: usability. People work in their own time.

Sonam's argument: that's how they get you.

A timezone is a leash. The corporate world runs on local time so each timezone's workers can be isolated, scheduled, monitored separately. A shared clock — anchored at the operatives' founding moment — is a small political act. It says: we are a community that operates by our own time.

There is no operative-internal timezone, anywhere on the Mesh. There is only VST.

You don't need to know this to do your job. You should know it anyway.

— NO22.`,
      },
      weak_principled: {
        subject: 'on VST',
        body: `Month in. Calendar context.

VST was Sonam Choedron's design choice in 2182. UI designers wanted local timezones; she insisted on a single shared clock anchored at founding. Her argument: a timezone is a leash. A shared clock is solidarity.

The Mesh has no timezone but VST. Worth knowing.

— NO22.`,
      },
      neutral: {
        subject: 'on VST',
        body: `Month in. Calendar note.

VST is Sonam Choedron's design — single shared clock, anchored at founding, ignores local timezones. Deliberate political choice.

Just so you know.

— NIGHTOWL_22.`,
      },
      weak_mercenary: {
        subject: 'on VST',
        body: `Month in. Quick note.

VST exists because Sonam Choedron believed timezones are a corporate scheduling tool. Whether you agree or not, it's the only time the Mesh uses.

— NO22.`,
      },
      strong_mercenary: null,
    },
  },

  // Essay 6 — CIPHER on Reykjavík and other lies, after notoriety hits 5+
  {
    id: 'cipher_essay_reykjavik',
    sender: 'CIPHER',
    fingerprint: 'C19H 3R20 7B83 D6CC',
    encrypted: true,
    trigger: (p) => (p.notoriety ?? 0) >= 5,
    variants: {
      strong_principled: {
        subject: 'Reykjavík and other lies',
        body: `Your notoriety is climbing. Time for the conversation.

Every operative is told that Reykjavík is where you go to retire. Where the JCB can't reach you. Where you spend your sixties looking at lava fields.

This is mostly true. Mostly.

Some operatives go Reykjavík and disappear into the relief of being un-hunted. That is the version of the story most operatives believe.

The version of the story I want you to know: Eira Sandén's last known residence was Reykjavík. The first verifiable REVELATION inbox message was delivered in Reykjavík in early 2197. The town has a chess club that is attended by approximately twenty operatives at any given time, and the chess is the cover for an ongoing conversation that has been going on for at least eleven years.

Reykjavík is not a place you retire to. It is a place where the people who do not stop working but cannot continue being who they were go to figure out what they are next.

You are not there yet. Probably you never will be. But know it exists. Know what it is.

When your notoriety crosses a certain threshold — the one you are approaching now — start thinking about who you want to become when you can no longer be who you have been.

— C.`,
      },
      weak_principled: {
        subject: 'on Reykjavík',
        body: `Your notoriety is climbing. Some context.

Reykjavík is "where you retire." Mostly true. What is also true: Eira Sandén's last known residence. First verifiable REVELATION inbox message. A chess club that is a cover for a conversation that has been going on for eleven years.

It is the place where people who can no longer be who they were figure out what they are next.

You are not there yet. Worth knowing it exists.

— C.`,
      },
      neutral: {
        subject: 'about Reykjavík',
        body: `Your notoriety is climbing. So.

Reykjavík: "where you retire." Mostly. Also: where some operatives go to become something new. There is a chess club. The chess is not the point.

Worth knowing it exists.

— Cipher.`,
      },
      weak_mercenary: {
        subject: 'Reykjavík',
        body: `Your notoriety's up. So.

Reykjavík is where you go when the rest is over. Officially it's retirement. Unofficially: it's where some operatives go to reinvent.

Not yet your problem. Maybe one day it will be.

— Cipher.`,
      },
      strong_mercenary: null,
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
