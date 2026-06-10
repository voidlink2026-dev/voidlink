// P2 — Operative Diary.
//
// The game writes entries to the player's diary as the world rolls forward.
// Each entry is one-shot: it fires the first time its `matches` predicate
// becomes true, and never again. The body is written in second-person,
// terse, in the established Voidlink voice. Tokens (`{HANDLE}`, `{DAYS}`)
// resolve at write time.
//
// Diary entries are stored on `player.diary[]` and persist with the save.
// The DiaryWindow renders them newest-first.
//
// Entries are intentionally append-only across releases. Once an entry is
// in here it stays — removing entries would retroactively erase a player's
// own history, which is the one thing the diary is *for*.

import type { PlayerProfile } from '../types/player.ts'
import { getDecisionPattern } from '../engine/decisionPattern.ts'

export interface DiaryEntryTemplate {
  id: string
  matches: (player: PlayerProfile) => boolean
  body: string  // may contain {HANDLE}, {DAYS}, {MISSIONS}, {CREDITS}
}

export interface DiaryEntry {
  id: string
  writtenAt: number  // unix ms — when the entry fired
  body: string       // resolved (tokens already replaced)
}

const has = (p: PlayerProfile, key: string): boolean => !!p.activeFlags[key]
const num = (p: PlayerProfile, key: string): number => {
  const v = p.activeFlags[key]
  return typeof v === 'number' ? v : (v ? 1 : 0)
}
const standing = (p: PlayerProfile, id: string): number =>
  p.factionStandings.find((f) => f.factionId === id)?.score ?? 0

export const DIARY_TEMPLATES: DiaryEntryTemplate[] = [
  // ── Onboarding milestones ────────────────────────────────────────────────

  {
    id: 'first_mission',
    matches: (p) => p.stats.successfulBreaches >= 1,
    body: `Your first contract is done. The wipe was clean. The pay cleared in under a minute. You sat at the terminal for a while afterwards, listening to nothing in particular. Tomorrow you will read the next briefing as if you have done this before.`,
  },
  {
    id: 'first_log_wipe',
    matches: (p) => p.stats.successfulBreaches >= 1 && p.completedMissions.length >= 1,
    body: `You wiped your first log tonight. Cipher's letter, when it arrived two missions later, said it best: *not because of who might see it. Because of who you become if you stop.*`,
  },
  {
    id: 'first_failed_mission',
    matches: (p) => p.stats.traceFailures >= 1,
    body: `You got caught. The trace bar hit one hundred and the connection cut. Your gateway is fine. The contract is gone. You will think about the order you did things in, on the bus home tomorrow.`,
  },
  {
    id: 'first_spec_ghost',
    matches: (p) => p.specialization === 'ghost',
    body: `You chose Ghost. The logs you leave from tonight onward will be silent. You will be harder to follow and harder to find. You will also be harder to ask for help.`,
  },
  {
    id: 'first_spec_brute',
    matches: (p) => p.specialization === 'brute',
    body: `You chose Brute. You will trade noise for speed. Your trace bar will climb faster than other operatives' and you will finish before it matters. That is the whole bargain.`,
  },
  {
    id: 'first_spec_architect',
    matches: (p) => p.specialization === 'architect',
    body: `You chose Architect. You will build things — bounce networks, contingency routes, kit. Other operatives will buy your work without ever knowing your handle. That is, in this trade, the closest thing to a quiet career.`,
  },
  {
    id: 'first_spec_social',
    matches: (p) => p.specialization === 'social',
    body: `You chose Social. You will work the human side of every contract. The trace bar will hardly matter; the people you persuade will do most of the breach for you. You will not write about how that feels.`,
  },

  // ── Threshold milestones ─────────────────────────────────────────────────

  {
    id: 'ten_missions',
    matches: (p) => p.completedMissions.length >= 10,
    body: `Ten contracts completed. You have a style now. You did not have one a month ago. You are not sure when it settled. You suspect there is no specific night.`,
  },
  {
    id: 'fifty_missions',
    matches: (p) => p.completedMissions.length >= 50,
    body: `Fifty contracts. You have stopped reading the rates first. You read the brief, then the client, then the rate, in that order. You are not yet old enough at this work to know whether that is a good sign or a tired one.`,
  },
  {
    id: 'hundred_missions',
    matches: (p) => p.completedMissions.length >= 100,
    body: `One hundred contracts. The newer operatives on the Mesh refer to you by handle. You did not notice when this started. You notice now.`,
  },
  {
    id: 'millionaire',
    matches: (p) => p.credits >= 1_000_000,
    body: `One million credits in your account. The number is, in some specific way, smaller than you expected it to feel.`,
  },
  {
    id: 'wallet_warrior',
    matches: (p) => p.stats.creditsEarned >= 10_000_000,
    body: `Ten million credits earned across your career. You have stopped thinking about money for its own sake. You do not yet know what you have started thinking about instead.`,
  },
  {
    id: 'high_notoriety',
    matches: (p) => (p.notoriety ?? 0) >= 8,
    body: `Your financial notoriety is high enough now that two banks would prefer not to do business with you. The third is willing to charge more for the privilege.`,
  },
  {
    id: 'clean_notoriety',
    matches: (p) => (p.notoriety ?? 0) <= -4,
    body: `Your name has stopped appearing in financial-monitoring reports. The offshore banks have made you boring on purpose. You will not be famous for your money. That is the point.`,
  },

  // ── Arc 1 choice ─────────────────────────────────────────────────────────

  {
    id: 'arc1_upload',
    matches: (p) => p.activeFlags.arc1_key_choice === 'upload',
    body: `You uploaded the key. You watched it leave your terminal in pieces and saw it reassemble itself, three minutes later, on every open mirror on the Mesh. The JCB has your handle on their priority list now. You knew that before you uploaded. You uploaded anyway.`,
  },
  {
    id: 'arc1_destroy',
    matches: (p) => p.activeFlags.arc1_key_choice === 'destroy',
    body: `You destroyed the key. The compressed file is on no drive. The keyspace, somewhere, has shrunk by one. You will not know for years whether that was the right call. You will not be the person who finds out.`,
  },
  {
    id: 'arc1_sell',
    matches: (p) => p.activeFlags.arc1_key_choice === 'sell',
    body: `You sold the key. The buyer wired the money on a delay you did not negotiate. The credits cleared. You did not ask whom the buyer was — that was the contract. You will think about it sometimes.`,
  },

  // ── Arc 6 — DEAD DROP resolution ─────────────────────────────────────────

  {
    id: 'arc6_purge',
    matches: (p) => has(p, 'choice_dead_drop_purge'),
    body: `You burned the tunnel. The anchor relay node went dark within the hour. You lost it permanently. MAGNUS did not resist. Cipher wrote one line. You read it twice.`,
  },
  {
    id: 'arc6_weaponise',
    matches: (p) => has(p, 'choice_dead_drop_weaponise'),
    body: `You left the tunnel in place. You used MAGNUS's routing as a backdoor into AR-K7. The payoff cleared in seconds. You know what you have collaborated with now. You will know it for the rest of your career.`,
  },
  {
    id: 'arc6_report_jcb',
    matches: (p) => has(p, 'choice_dead_drop_report_jcb'),
    body: `You delivered the evidence to Director Kovac. The Government paid you obscenely. The Underground will not have you back. You did not, in the end, ask them to.`,
  },
  {
    id: 'arc6_report_nightowl',
    matches: (p) => has(p, 'choice_dead_drop_report_nightowl'),
    body: `You delivered the evidence to NIGHTOWL_22 instead of the JCB. The pay was lower. The connection she gave you in return is, you suspect, worth more than the difference. You did not ask her what she would do with it.`,
  },

  // ── Arc 7 — THE QUIET WAR resolution ─────────────────────────────────────

  {
    id: 'arc7_warn_internic',
    matches: (p) => has(p, 'choice_quiet_war_warn_internic'),
    body: `You tipped Park before his own discovery. Internic's stock soared. Δ5 collapsed within six weeks. Helios Marine will be acquired inside a year. NIGHTOWL's long quiet protection of them was, in the end, for nothing. You knew when you sent the message.`,
  },
  {
    id: 'arc7_warn_arunmor',
    matches: (p) => has(p, 'choice_quiet_war_warn_arunmor'),
    body: `You tipped Δ5 HR. Internic was sued into nothing. The leaks were blamed on a junior at Internic who did not do it. Helios Marine will be acquired faster than under any other outcome. You took the payment.`,
  },
  {
    id: 'arc7_expose_nightowl',
    matches: (p) => has(p, 'choice_quiet_war_expose_nightowl'),
    body: `You exposed NIGHTOWL_22. The Mesh observers describe the silence as uncharacteristic and probably terminal. She is gone. Helios will fall to whichever of the two companies finishes the war. You filed the notification.`,
  },
  {
    id: 'arc7_preserve_balance',
    matches: (p) => has(p, 'choice_quiet_war_preserve_balance'),
    body: `You authored two leaks and meant neither. The war is still warm. Helios Marine has restructured under a jurisdiction that complicates hostile acquisition. NIGHTOWL is still on the Mesh. You are now complicit in a managed war. You will think about this when you read tomorrow's news.`,
  },

  // ── Arc 8 — LIGHTHOUSE resolution ────────────────────────────────────────

  {
    id: 'arc8_take_vance_out',
    matches: (p) => has(p, 'choice_lighthouse_take_vance_out'),
    body: `Asher Vance has been reported missing by his landlord. The police describe his disappearance as consistent with voluntary relocation. You arranged that they would. The parties who paid you described it differently. Your retainer cleared. You did not, for several days, open the door of your apartment.`,
  },
  {
    id: 'arc8_expose_dispatch',
    matches: (p) => has(p, 'choice_lighthouse_expose_dispatch'),
    body: `You published the bundle. Voidlink Dispatch fractured within seventy-two hours. Approximately half of the active operative population is now independent. The system you signed the Bond with no longer exists in the shape you signed it into. You knew this would be the case before you sent the package.`,
  },
  {
    id: 'arc8_disappear',
    matches: (p) => has(p, 'choice_lighthouse_disappear'),
    body: `You migrated your gateway off Voidlink routing. Your private mesh handles you now. The cache is on hardware only you control. From this point forward, Dispatch cannot see you. Neither can most of the operatives you used to know.`,
  },
  {
    id: 'arc8_warn_cipher',
    matches: (p) => has(p, 'choice_lighthouse_warn_cipher'),
    body: `You delivered the bundle and the buyer list to Cipher through your most secure channel. He did not reply for nine days. When he did, he addressed you by your initials.`,
  },

  // ── Arc 5 endings ────────────────────────────────────────────────────────

  {
    id: 'ending_containment_principled',
    matches: (p) => has(p, 'choice_ending_containment_principled'),
    body: `You took the auditor's role. You will look at what Mei Lin's people are doing with REVELATION every day for the rest of your career. You will tell the world the truth, every year, on the year. You will be inconvenient. The work will, of all things, be the part of this you come to love most.`,
  },
  {
    id: 'ending_liberation_principled',
    matches: (p) => has(p, 'choice_ending_liberation_principled'),
    body: `REVELATION is free. Arunmor's crimes are exposed in their entirety. Mei Lin resigned the same week. Children in Manila wear shirts with iconography of you on them, sometimes accurately. The JCB will hunt you for the rest of your life. They will not catch you. You knew that before you uploaded.`,
  },
  {
    id: 'ending_collaborator',
    matches: (p) => has(p, 'choice_ending_collaborator'),
    body: `You retired wealthy. You retired alone. The therapist your retainer covers is excellent. You do not bring up the work. You have, this past month, forgotten what your handle stood for on the day you signed the Bond. The forgetting did not, when it happened, feel like anything in particular.`,
  },
  {
    id: 'ending_ghost',
    matches: (p) => has(p, 'choice_ending_ghost'),
    body: `You wrote yourself out of the world's database. There is no public record of what happens to you next. There is also no entry in this diary about what does. Nobody is left to write it down. You knew that going in.`,
  },
  {
    id: 'ending_reformer',
    matches: (p) => has(p, 'choice_ending_reformer'),
    body: `You were one kind of operative, and you became another. The game noticed. Cipher writes to you in a different voice now. NIGHTOWL has stopped sending the contracts that used to be your bread. You will find out what the world offers you in the doing.`,
  },

  // ── Trait / pattern milestones ───────────────────────────────────────────

  {
    id: 'bond_violator',
    matches: (p) => has(p, 'choice_bond_rule4_violated'),
    body: `You broke Rule Four. The arbitration record names you. Voidlink will not formally publish what happened — that's how the punishment works. Everyone who matters already knows.`,
  },
  {
    id: 'civilian_protector_5',
    matches: (p) => num(p, 'choice_civilian_spared') >= 5,
    body: `You have walked away from five contracts because a civilian was in the wrong place. None of the clients have asked why. You have not, yet, written down the names. You should.`,
  },
  {
    id: 'whistleblower_ally_3',
    matches: (p) => num(p, 'choice_whistleblower_protected') >= 3,
    body: `Three whistleblowers are alive who would not be if you had been a different sort of operative. They will not contact you. You will read about them, sometimes, in the news.`,
  },
  {
    id: 'bond_grey_2',
    matches: (p) => num(p, 'choice_op_bounty_accepted') >= 2,
    body: `You have taken two bounties on fellow operatives this season. The Mesh has noticed. Your handle now appears in a category of operative you did not think you would be in. You will not know how this lands until later.`,
  },
  {
    id: 'underground_loyalist',
    matches: (p) => standing(p, 'the_underground') >= 500 || standing(p, 'underground') >= 500,
    body: `The Underground has, in some specific sense, decided you are theirs. They will not announce this. They will simply stop vetting you. You will notice when you stop being asked to prove things.`,
  },
  {
    id: 'arunmor_loyalist',
    matches: (p) => standing(p, 'arunmor') >= 500,
    body: `Arunmor has begun routing contracts to you through channels other operatives do not see. The rates are obscene. The work is interesting in a way the Mission Board cannot replicate. You are aware of what this means.`,
  },
  {
    id: 'voidlink_lifer',
    matches: (p) => standing(p, 'voidlink_international') >= 1000,
    body: `Voidlink has formally classified you as a long-tenure operative. The classification has no public manifestation. It does, internally, change how Dispatch routes work to you. You are, in their language, a quiet asset of the network.`,
  },

  // ── NPC and reflection callbacks ─────────────────────────────────────────

  {
    id: 'cipher_first_letter',
    matches: (p) => Object.keys(p.activeFlags).some((k) => k.startsWith('dialogue_fired_cipher_first_advice')),
    body: `Cipher wrote to you for the first time tonight. You do not yet know whether to take that seriously. You will. The letter went into the encrypted folder. You read it twice before you closed it.`,
  },
  {
    id: 'cipher_collaborator_drift',
    matches: (p) => has(p, 'dialogue_fired_cipher_collaborator_drift'),
    body: `Cipher's letter tonight was shorter than the others have been. He said he would write less, for a while. You looked at your client list for the first time in months afterwards. You did not change anything about it.`,
  },
  {
    id: 'nightowl_first_letter',
    matches: (p) => Object.keys(p.activeFlags).some((k) => k.startsWith('dialogue_fired_nightowl_first_contract')),
    body: `NIGHTOWL_22 sent you her first contract tonight. The pay was below scale. The contract said why. You took it.`,
  },
  {
    id: 'who_you_work_for_fired',
    matches: (p) => has(p, 'reflection_who_you_work_for'),
    body: `Something paused you in the middle of a contract tonight. You sat at the terminal and read your client list, in order, going back. You did not finish reading it before the pause passed. You will, you think, finish later.`,
  },
]

export function buildDiaryContext(player: PlayerProfile): Record<string, string | number> {
  const now = Date.now()
  const days = Math.max(1, Math.floor((now - player.createdAt) / (24 * 3600 * 1000)))
  return {
    HANDLE: player.handle,
    DAYS: days,
    MISSIONS: player.completedMissions.length,
    CREDITS: player.credits.toLocaleString(),
  }
}

function resolveTokens(template: string, ctx: Record<string, string | number>): string {
  return template.replace(/\{([A-Z_]+)\}/g, (whole, key) =>
    ctx[key] !== undefined ? String(ctx[key]) : whole,
  )
}

/**
 * Return the templates that should fire for this player but haven't yet.
 * Each entry is one-shot: presence of `player.activeFlags['diary_<id>']`
 * means the entry has already been written.
 */
export function evaluateDiaryEntries(player: PlayerProfile): DiaryEntry[] {
  void getDecisionPattern  // reserved for future pattern-driven entries
  const ctx = buildDiaryContext(player)
  const now = Date.now()
  const out: DiaryEntry[] = []
  for (const t of DIARY_TEMPLATES) {
    if (player.activeFlags[`diary_${t.id}`]) continue
    try {
      if (t.matches(player)) {
        out.push({
          id: t.id,
          writtenAt: now,
          body: resolveTokens(t.body, ctx),
        })
      }
    } catch { /* defensive */ }
  }
  return out
}

export function getDiaryTemplate(id: string): DiaryEntryTemplate | undefined {
  return DIARY_TEMPLATES.find((t) => t.id === id)
}
