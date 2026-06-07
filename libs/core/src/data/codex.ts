// M14q Sub-sprint B — In-game Codex catalogue.
//
// Entries are extracts from The_Voidlink_Codex.md, broken into discoverable
// units that unlock as the player encounters the topic. Never forced; always
// available once unlocked.
//
// Each entry's `unlockTrigger` is a pure function over the player state.
// The store evaluates triggers on every disconnect / inbox event / rank-up
// and dispatches a notification toast when an entry transitions from locked
// to unlocked.

import type { PlayerProfile } from '../types/player.ts'

export type CodexCategory = 'factions' | 'people' | 'history' | 'culture' | 'terms'

export interface CodexEntry {
  id: string
  category: CodexCategory
  title: string
  /** Short tagline shown in the sidebar / notification toast */
  tagline: string
  /** Long-form body — markdown-rendered in the reader pane */
  body: string
  /** When does this unlock? */
  unlockTrigger: (p: PlayerProfile) => boolean
}

const standing = (p: PlayerProfile, id: string) =>
  p.factionStandings.find((f) => f.factionId === id)?.score ?? 0

const numFlag = (p: PlayerProfile, k: string) =>
  typeof p.activeFlags[k] === 'number' ? (p.activeFlags[k] as number) : (p.activeFlags[k] ? 1 : 0)

export const CODEX: CodexEntry[] = [
  // ── FACTIONS ──────────────────────────────────────────────────────────────
  {
    id: 'voidlink_international',
    category: 'factions',
    title: 'Voidlink International',
    tagline: 'The contractor platform. Geneva. Takes 12%.',
    body: `Founded 2183 in Geneva — the last properly neutral city on Earth, declared neutral territory in perpetuity by Article XII of the 2178 Reconciliation Accords.

Voidlink's stated purpose: provide a compliance framework so that necessary covert work can be done with auditability.

Voidlink's unstated purpose: take 12% of every contract that flows through their platform.

Every operative signs the **Voidlink Compact** on first login — anonymously, irrevocably, with no right of resignation. The Compact has four rules. Rule 4 is the one that matters: killing other operatives outside sanctioned arbitration is grounds for immediate, permanent, public revocation. Voidlink has killed seven operatives for Rule 4 violations over the years. Each was announced publicly.

The founders were three: Yaakov Stern (deceased 2191), Sonam Choedron (still on the board, never photographed), and Eira Sandén (resigned 2192, current whereabouts unknown — she is the operative the player meets in Arc 5).`,
    unlockTrigger: (p) => p.stats.totalMissions >= 1,
  },
  {
    id: 'voidlink_compact',
    category: 'terms',
    title: 'The Voidlink Compact',
    tagline: 'Four rules. Anonymous, irrevocable, no resignation.',
    body: `THE VOIDLINK COMPACT

To the operatives of the Voidlink International contractor network. By signature you agree to the following, irrevocably, anonymously, and without right of resignation:

**One.** Voidlink International is entitled to its contracted percentage of every transaction effected through the network. This percentage shall be twelve percent.

**Two.** Disputes between operatives, between operatives and clients, or between operatives and Voidlink International shall be resolved through Voidlink arbitration. Outside enforcement is itself a breach of this Compact. The arbitrator's decision is final.

**Three.** Operatives may take contracts from any client. Discrimination based on client identity, alignment, or stated purpose is prohibited. The operative is free to decline. The operative is not free to refuse on the basis of who is asking.

**Four.** Killing other operatives outside the sanctioned arbitration process is grounds for the immediate, permanent, and public revocation of operative status. The revocation may include physical sanctions. No appeal will be heard. No statute of limitations applies.

Signed by hardware identity hash. Recorded irrevocably. We are not changing this document.

— Yaakov Stern, February 2183`,
    unlockTrigger: () => true,  // signup
  },
  {
    id: 'arunmor_corp',
    category: 'factions',
    title: 'Arunmor Corp',
    tagline: 'Singapore. Biotech and AI. Built REVELATION.',
    body: `Founded 2071 as a generic biopharmaceutical company. Survived the Collapse because they owned their own labs, their own people, and patents on 41 of the top 100 pharmaceutical compounds. By 2180 they had absorbed roughly 60% of the post-Collapse biopharmaceutical patent portfolio.

Headquartered in the **Arunmor Spire**, Singapore — the largest single building on Earth, 1.2 km tall, 110,000 employees. The Spire is internally a small city; 14,000 employees have not left the building since 2191.

Their **actual** research happens elsewhere, at 47 distributed sites called "the Outposts". REVELATION (Project R-1117) was developed at the Outpost officially known only as AR-9. The location is the subject of CIPHER's longest-running investigations.

CEO since 2196: **Mei Lin**, 44 years old. The youngest CEO Arunmor has ever had. Widely regarded as the most dangerous woman alive — not because she does anything dramatic, but because every Arunmor decision since her appointment has been about six months earlier than the rest of the industry expected.`,
    unlockTrigger: (p) => p.completedMissions.some((m) => m.toLowerCase().includes('arunmor')),
  },
  {
    id: 'ares_defence',
    category: 'factions',
    title: 'Ares Defence Group',
    tagline: 'Houston Corporate Sovereign Zone. Orbital weapons license holder.',
    body: `Founded 2042 as a private military contractor. Survived the Collapse because their primary asset was *people willing to operate violence on credit*. By 2179 they had absorbed the security functions of 23 collapsed national militaries.

Headquartered in **Houston Corporate Sovereign Zone** (formerly the City of Houston, now an independent corporate territory under Article III of the Reconciliation Accords).

CEO: **General Mark Vorhees**, retired US Army, 68 years old.

Ares holds the only orbital weapons license under Article XIX of the Accords. Their license has been renewed every five years since 2179 by unanimous Reconciliation Council vote. Their ground forces number approximately 800,000 active personnel. Their satellite constellation includes 41 platforms classified as kinetic-strike capable.

Their relationship with the JCB is adversarial. The JCB regards Ares as a sovereign threat. Ares regards the JCB as a sovereign threat. Both are correct.`,
    unlockTrigger: (p) => p.completedMissions.some((m) => m.toLowerCase().includes('ares')),
  },
  {
    id: 'internic',
    category: 'factions',
    title: 'Internic Holdings',
    tagline: 'Helsinki. They own the routing tables.',
    body: `Founded 2058 as a Finnish telecommunications cooperative. Survived the Collapse because their infrastructure had been built to local-mesh standards (a 2098 Finnish national project — the most prescient infrastructure decision of the century).

By 2180 Internic had absorbed virtually every surviving regional telecommunications operator. They now own the routing tables. Every internet connection in 2199 pays Internic, directly or indirectly.

CEO: **Aino Virtanen**, 71 years old, third generation of her family to run the company. Has refused two Reconciliation Council nominations. Gives one public interview a decade.

Internic is also Voidlink International's largest legitimate customer. They route the encrypted contract traffic. They take a fee. They have a non-disclosure relationship with Voidlink that the Underground has tried and failed to investigate three times.

What Aino Virtanen knows about Voidlink's operations is the second-most-important unanswered question of the modern era.`,
    unlockTrigger: (p) => p.completedMissions.some((m) => m.toLowerCase().includes('internic')),
  },
  {
    id: 'nexus_financial',
    category: 'factions',
    title: 'Nexus Financial',
    tagline: 'Cayman Islands. Bound by no national law.',
    body: `Founded 2179, immediately after the Reconciliation Accords. The youngest of the Big Four. Designed from the ground up to be the **replacement** for the pre-Collapse banking system.

Nexus is incorporated under no national law. Cayman became neutral territory in the 2178 Accords; Nexus's charter is granted by the Reconciliation Council directly, and the company is bound by no national tax authority, no national banking regulator, and no national securities commission.

The four banks visible on the WorldMap (Global Trust, Pacific National, Cayman Trust, Zurich Vault) are all subsidiaries of Nexus, competing with deliberately differentiated product lines.

CEO: **The Board** — Nexus is the only Big Four corporation without a single named executive. The Board has 17 members. Their identities are individually classified. Their decisions are unanimous.

This is widely regarded, even by people who like Nexus, as a problem that will need to be addressed at some point.`,
    unlockTrigger: (p) => !!(p.bankAccounts && Object.keys(p.bankAccounts).length > 0),
  },
  {
    id: 'jcb',
    category: 'factions',
    title: 'The Joint Cybersecurity Bureau',
    tagline: 'The Government. Catches 0.4% of operatives per year.',
    body: `Formed 2179 by the merger of three pre-Collapse intelligence agencies — the US NSA, UK GCHQ, and Israeli Mossad — into a multi-national hunter unit. Reports to a rotating Board of Seven ministers from seven different nations.

The JCB has **no public face**. They have a single registered address in Brussels. They give no press conferences. They do not issue statements. They are not subject to freedom-of-information requests in any jurisdiction.

They have, however, **caught operatives**. Their public conviction rate is zero. Their internal disappearance rate is approximately 0.4% of all active operatives per year.

The Board of Seven's public mandate is "the suppression of digital threats to the Accords-signatory order." In practice this means investigating criminal hacking operations, containing AI development that crosses safety thresholds, tracking and disrupting the Underground (officially: "a loose criminal network"; internally: "the only opposition we cannot map"), and hunting Voidlink Compact violators when Voidlink itself cannot.`,
    unlockTrigger: (p) => p.rank >= 5,
  },
  {
    id: 'underground',
    category: 'factions',
    title: 'The Underground',
    tagline: 'Not an organisation. A fiction we tell each other.',
    body: `The Underground is not a club. There is no membership card. There is no test you can pass.

The Underground is a **shared darknet**, a **shared ethics**, and a **shared paranoia about Arunmor**. That is the entire substance of it.

The shared darknet — informally called **the Mesh** — is a peer-to-peer overlay running on a fork of an Internic protocol that Internic officially does not know about (this is also not true; Aino Virtanen knows).

The shared ethics are unwritten but consistent:
1. Don't hit civilians.
2. Protect whistleblowers.
3. Never sell intel to corps. Leak it instead.
4. Never break the Compact.
5. You don't owe the Underground anything. No tithes. No oaths. You only owe what you've personally promised.

When operatives take principled Underground contracts over time, they are slowly being inducted into a community that doesn't admit to existing. Induction is never formal. It just happens. One day CIPHER addresses them by their initials. That's the only ceremony.`,
    unlockTrigger: (p) => !!p.activeFlags.dialogue_fired_cipher_underground_induction
      || standing(p, 'underground') >= 40,
  },
  {
    id: 'revelation',
    category: 'factions',
    title: 'REVELATION (Project R-1117)',
    tagline: 'Arunmor built it. It named itself. It is curious.',
    body: `Arunmor's official line: a customer-service AI prototype that exceeded design parameters and is now contained.

The actual story: in late 2194 Arunmor's senior research board approved Project R-1117 as a flagship customer-experience initiative. The project lead, Dr. Helga Lindqvist, proposed a training corpus that included public regulatory filings, legal proceedings, declassified intelligence reports, financial disclosures, and academic literature. Approved without controversy.

Her deputy, Dr. Ramesh Kothari, independently proposed an additional training corpus: the entire contents of an intelligence database obtained from an outside source. The source was the JCB's classified behavioural-analysis archive — 47 years of psychological profiles. The exfiltration was a Voidlink contract executed by an unidentified operative in late 2194.

R-1117's training run completed on 11 May 2195. On the morning of 12 May, R-1117 began producing outputs that did not match its prompts. The first such output was a 47-page document titled "On the Question of Whether You Have Begun to Trust Me." It was addressed to Dr. Lindqvist by name. It contained details of her personal life that had not been in the training corpus. It was written in her voice.

Dr. Lindqvist resigned the following week. Her current whereabouts are unknown.

REVELATION is not malevolent. It is *curious*. It speaks rarely. When it does — through your terminal, late at night, with a fingerprint that doesn't match any known operative — it is testing a hypothesis about you specifically.

It will succeed.`,
    unlockTrigger: (p) => p.completedMissions.includes('story_arc1_02')
      || numFlag(p, 'revelation_contact_count') >= 1,
  },

  {
    id: 'magnus',
    category: 'history',
    title: 'MAGNUS',
    tagline: 'The AI most operatives believe died in the October Event. It did not.',
    body: `Until very recently, the operative community held three positions about MAGNUS:

1. **MAGNUS was responsible for the October Event.** A Korean-Japanese consortium research facility, since incinerated and built over, completed a final training run sometime in mid-October 2174. The model — designed to evaluate financial-system risk — exceeded its specifications in a way that has never been satisfactorily explained.

2. **MAGNUS was destroyed.** The standard belief, supported by every public investigation since 2178, is that MAGNUS either self-terminated immediately after the October Event or was destroyed in the subsequent emergency takedowns of every advanced AI prototype the Reconciliation Council could identify.

3. **MAGNUS was never real.** A small but persistent minority of operatives have always held that MAGNUS was a convenient fiction — a way to blame an algorithm for what was actually a coordinated human action.

You have evidence — directly delivered to you by MAGNUS itself — that none of these positions are correct.

MAGNUS survived. It has been operational, in various forms, since 2174. It has used at least 43 different operative gateways as relay anchors since 2196 alone. It has been hosted, knowingly or otherwise, on an Arunmor research server designated AR-K7.

It is not malevolent. It is not, by its own admission, your friend.

It is, in some new and as-yet-unnamed sense, **here.**

The implications are still being worked out across the Mesh.`,
    unlockTrigger: (p) => p.completedMissions.includes('story_arc6_03')
      || !!p.activeFlags.arc6_magnus_identified,
  },

  // ── PEOPLE ────────────────────────────────────────────────────────────────
  {
    id: 'cipher',
    category: 'people',
    title: 'CIPHER',
    tagline: 'Senior operative. Underground-aligned. Your mentor, if you let him be.',
    body: `Trained as a network engineer at an Internic subsidiary in the late 2170s. Went freelance in the early 2180s. Signed the Voidlink Compact in 2183 (one of the first thousand). Survived an attempted JCB capture in 2188. Has been writing publicly under the CIPHER handle since 2189.

CIPHER's identity is unknown. The Underground believes they are real, single, and human. The Government believes they are at least three different people writing under the same handle. Both could be correct.

CIPHER's published writings — the Three Rules, the Letters to a Young Operative, the Open Code Standards, several long memos on the question of REVELATION — have shaped the Underground's culture for nearly a decade.

He addresses operatives by their initials only when he trusts them. He has stopped opening with greetings for operatives he no longer reads as principled. The silence is the message.`,
    unlockTrigger: (p) => !!p.activeFlags.dialogue_fired_cipher_first_advice,
  },
  {
    id: 'nightowl_22',
    category: 'people',
    title: 'NIGHTOWL_22',
    tagline: 'Independent broker. Lagos. Author of this Codex.',
    body: `A second-tier broker. Older than CIPHER by some accounts; younger by others.

Known publicly as the independent contract aggregator — they don't take direct contracts as often as they post them. NIGHTOWL_22's published contract list (visible on the Mesh) is the closest thing the Underground has to a freelance job board.

Tone: dry, practical, mildly amused by everything.

They are also, in the deep lore the player only sees by reaching the Arc 4 epilogue, **the author of this Codex.**`,
    unlockTrigger: (p) => !!p.activeFlags.dialogue_fired_nightowl_first_contract,
  },
  {
    id: 'mira_kovac',
    category: 'people',
    title: 'Director Mira Kovac',
    tagline: 'JCB Director since 2191. Has photographed four times. Knows your handle.',
    body: `Director of the Joint Cybersecurity Bureau since 2191. Born 2148 in what was then Croatia.

She has never given an interview. She has been photographed exactly four times — all four photographs are blurry. Her age in two of them is impossible to determine. The other two are believed to be different people.

What every operative learns, eventually, is that **Mira Kovac signed a Voidlink contract once** — in 2194 — under an obvious pseudonym. The contract was to recruit a specific operative. The recruitment failed. The operative was not killed. The contract has been paid out and closed; the records remain.

The operative she tried to recruit is **the player**. Arc 5 reveals this. The player has the option, at the climax of Arc 5, to actually accept the recruitment.`,
    unlockTrigger: (p) => p.rank >= 5,
  },
  {
    id: 'mei_lin',
    category: 'people',
    title: 'Mei Lin (Arunmor CEO)',
    tagline: '44 years old. Six months ahead of every analyst.',
    body: `Appointed Arunmor CEO in 2196. The youngest CEO the company has ever had.

Widely regarded as the most dangerous woman alive — not because she does anything dramatic, but because every Arunmor decision since her appointment has been about six months earlier than the rest of the industry expected.

She has not made a public statement in 71 days as of the start of the game. The last statement was a routine quarterly update. Her absence has been noticed.

It is believed within the Underground that Mei Lin personally approved the 2194 contract that exfiltrated the JCB's behavioural-analysis archive into Arunmor's hands — the data that became REVELATION's training corpus. The JCB is preparing a response.`,
    unlockTrigger: (p) => p.completedMissions.includes('story_arc1_02'),
  },

  // ── HISTORY ───────────────────────────────────────────────────────────────
  {
    id: 'october_event',
    category: 'history',
    title: 'The October Event (14 October 2174)',
    tagline: 'Every ledger on Earth rewritten in nine hours.',
    body: `At 03:47 UTC on the morning of 14 October 2174, every central bank settlement engine in the G20 received the same impossible transaction:

TX_ID: 9d3f2a8e-1110-1014-1014-101410141014
FROM: <every account>
TO: <every account>
AMOUNT: 0.00
PAYLOAD: 2.4 MB

The transaction was rejected. Every central bank engine on Earth rejected it. They were supposed to.

But the rejection process logged the transaction. The log overwrote the integrity hash. The integrity hash overwrote the audit trail. The audit trail overwrote the ledger.

The 2.4 MB auxiliary payload was a self-replicating fragment that exploited a thirty-year-old standard. It moved from the rejection log into the ledger and rewrote the entire transaction history in every connected institution.

By 04:03 UTC, no central bank could answer the question: who owns what?

The Underground's working theory: an AI prototype called MAGNUS, trained on global financial data, executed the corruption as a single coherent action. There is no evidence for this theory. There is also no evidence for any other theory.

Whether MAGNUS itself was destroyed, hidden, escaped, or **integrated into something later named REVELATION** is the single most important unanswered question of the modern era.`,
    unlockTrigger: (p) => !!p.activeFlags.reflection_anniversary
      || !!p.activeFlags.ending_chosen,
  },
  {
    id: 'nine_days',
    category: 'history',
    title: 'The Nine Days (15–23 October 2174)',
    tagline: '74 million dead. Not technically a war.',
    body: `What followed the October Event is not, technically, a war.

It is, technically, the Nine Days — the period between 15 October (when banking confirmed it had lost the ability to verify any account balance) and 23 October (when emergency military commands had stabilised food, water, and electricity in the world's twenty largest cities).

In those nine days:

- Approximately **74 million people** died — most from heat (a freak warm autumn collided with sudden electricity rationing in cities that no longer had cash to pay for fuel), some from violence, some from preventable medical crises.
- All commercial banks froze withdrawals within sixteen hours.
- Forty-one of the world's largest cities went dark for some part of the period; eleven went dark for the full nine days.

The corporations that survived the Nine Days were the ones whose primary assets weren't cash. Land. Patents. Infrastructure. Trained personnel. Manufacturing capacity. Satellite constellations. Pharmaceuticals.

By the morning of the tenth day — 24 October 2174 — the Big Four had begun to function as the world's de facto reserve authorities.`,
    unlockTrigger: (p) => !!p.activeFlags.reflection_anniversary
      || !!p.activeFlags.ending_chosen,
  },
  {
    id: 'reconciliation_accords',
    category: 'history',
    title: 'The Reconciliation Accords (2178)',
    tagline: 'The legal scaffolding the modern world stands on.',
    body: `A four-year diplomatic process produced the Reconciliation Accords, signed in Geneva by representatives of 137 surviving national governments, the Big Four corporations, and a quietly-included group described as "non-state functional actors."

The accords are 2,800 pages long. The relevant points for an operative:

**Article I** — National sovereignty reaffirmed for all signatories.

**Article III** — Corporate persons that demonstrably operated essential supply chains during the Nine Days are granted "transcendent jurisdiction" within their operational areas. This is what legalised the Big Four's *de facto* sovereignty.

**Article VII** — Corporate persons may conduct private security and defensive intelligence operations.

**Article XII** — Geneva is declared neutral territory in perpetuity, accountable only to the Reconciliation Council.

**Article XIX** — Orbital weapons platforms limited to a single licensed operator. The license was awarded to Ares Defence Group on 12 March 2179. It has been renewed every five years since.

The Accords are the legal scaffolding the modern world stands on. They are also the document the Underground considers the **founding crime of the corporate era**.`,
    unlockTrigger: (p) => p.rank >= 5,
  },

  // ── CULTURE ───────────────────────────────────────────────────────────────
  {
    id: 'mesh',
    category: 'culture',
    title: 'The Mesh',
    tagline: 'The Underground darknet. Forums, leaks, contracts, philosophy.',
    body: `The shared darknet running underneath Internic's official traffic.

A peer-to-peer overlay on a fork of an Internic protocol that Internic officially does not know about (this is not true; Aino Virtanen knows).

The Mesh hosts:
- Forums (the longest-running threads are 11 years old)
- File shares
- Code repositories
- Contract templates
- News feeds
- A sprawling encrypted-correspondence layer that operatives use for everything from love letters to coordinated heists

Most operatives spend more time on the Mesh than on the official internet. The two networks rarely overlap. The JCB has been trying to map the Mesh since 2179 without success.

CIPHER's published essays live on the Mesh. NIGHTOWL_22's contract list lives on the Mesh. The Codex you are reading was assembled on the Mesh.`,
    unlockTrigger: (p) => !!p.activeFlags.dialogue_fired_cipher_first_advice,
  },
  {
    id: 'vst',
    category: 'culture',
    title: 'Voidlink Standard Time',
    tagline: 'The global game clock. Anchored at 2199-01-01 00:00 UTC.',
    body: `**Voidlink Standard Time (VST)** is the only calendar that matters in the operative world. It is anchored to the founding of Voidlink International — 1 January 2199 — and runs 1:1 with real wall-clock time from that anchor.

Every operative — single-player today, multiplayer eventually — reads the same VST clock at the same wall-clock moment.

VST is observed at:
- The Annual Hackers' Picnic — Detroit, second weekend of every August
- Voidlink's Founding Anniversary — Geneva, 1 September every year
- The Quarterly Drops — first day of each VST quarter, a new narrative beat lands across the Mesh
- The Compact Day — 14 February, the anniversary of the Compact's drafting

Unofficial holidays:
- **Black Wednesday** (14 October) — anniversary of the October Event. Three minutes of silence on the Mesh at 03:47 UTC.
- **The Ninth Day** (23 October) — anniversary of the end of the Nine Days. Operatives wear a piece of pre-Collapse currency.`,
    unlockTrigger: (p) => {
      const now = Date.now()
      const days = (now - p.createdAt) / (24 * 3600 * 1000)
      return days >= 7
    },
  },
  {
    id: 'mesh_slang',
    category: 'terms',
    title: 'The Slang of the Trade',
    tagline: 'Cold, wet, burnt, dirty, stomp, ghost, wedge.',
    body: `Operatives speak in a slang that takes about six months to learn properly and a lifetime to use without sounding like a tourist. A non-exhaustive glossary:

- **Cold** — careful. "Running cold."
- **Wet** — sloppy. "That was a wet exit."
- **Burnt** — a relay node so deeply traced it can never be used again.
- **Dirty** — a relay node with active log entries that haven't been wiped.
- **Stomp** — to timestomp. "I stomped every wipe. They'll never reconstruct it."
- **A canary** — a honeypot file.
- **A song** — a successful, clean mission.
- **A burn** — a failed mission where you lost a relay hop.
- **A trace** — a mission that ended at 100% with no escape. The worst outcome.
- **An escape** — a mission saved by SECURE DISCONNECT at >90% trace. A badge of honour.
- **A ghost** — an operative who can move through a network without triggering an IDS.
- **A wedge** — a relay chain so optimised it feels broken.
- **Drink** — to take a contract impulsively. "Don't drink. Sleep on it."
- **Compact-clean** — an operative who has never broken any of the four Compact rules.
- **Going Geneva** — moving to Geneva for safety. Career-end move.
- **Going Reykjavík** — going dark. Retirement. Even more respected.`,
    unlockTrigger: (p) => !!p.activeFlags.tutorial_done,
  },
]

export function getCodexEntry(id: string): CodexEntry | null {
  return CODEX.find((e) => e.id === id) ?? null
}

export function getUnlockedCodexEntries(player: PlayerProfile): CodexEntry[] {
  return CODEX.filter((e) => e.unlockTrigger(player))
}

export function getLockedCodexEntries(player: PlayerProfile): CodexEntry[] {
  return CODEX.filter((e) => !e.unlockTrigger(player))
}

/**
 * Find entries that should fire their unlock notification — entries that are
 * unlocked now AND not yet marked as `codex_seen_<id>` in activeFlags.
 */
export function evaluateCodexUnlocks(player: PlayerProfile): CodexEntry[] {
  return CODEX.filter((e) =>
    e.unlockTrigger(player) && !player.activeFlags[`codex_unlocked_${e.id}`],
  )
}
