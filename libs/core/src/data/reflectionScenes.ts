// M14p Pass 2c — Reflection Scenes.
//
// At narrative milestones (end of Arc 1, end of Arc 3, pre-Arc-5, annual
// anniversary, quarterly season transition), the game pauses for a
// **reflection scene**: a terminal overlay where the player's own internal
// monologue summarises what they have done.
//
// Not a moral judgment. Just facts, in their voice.
//
// Each scene has a curated list of *fact templates*. The pattern reader
// selects which facts to surface based on the player's accumulated pattern.
// A typical scene surfaces 4-5 facts; the bucket of facts available depends
// on the pattern.
//
// Tokens supported in fact templates:
//   {DAYS}              — days since signup
//   {MISSIONS}          — total missions completed
//   {CIVILIANS_SPARED}  — count from choice_civilian_spared flag
//   {WHISTLEBLOWERS}    — count from choice_whistleblower_protected
//   {BOUNTIES_TAKEN}    — count from choice_op_bounty_accepted
//   {LEAKS}             — count from choice_data_leaked
//   {SOLD}              — count from choice_data_sold
//   {HANDLE}            — player handle

import type { PlayerProfile } from '../types/player.ts'
import type { DecisionPattern } from '../engine/decisionPattern.ts'

export type ReflectionTrigger =
  | 'end_of_arc_1'
  | 'end_of_arc_3'
  | 'pre_arc_5'
  | 'anniversary'
  | 'season_transition'

type Bucket = 'strong_principled' | 'weak_principled' | 'neutral' | 'weak_mercenary' | 'strong_mercenary'

export interface ReflectionScene {
  trigger: ReflectionTrigger
  title: string
  /** Opening line — always shown. */
  opening: string
  /** Closing line — always shown. */
  closing: string
  /** Pool of fact templates per bucket. Pattern picks 4-5 to surface. */
  factPool: Record<Bucket, string[]>
}

export const REFLECTION_SCENES: Record<ReflectionTrigger, ReflectionScene> = {
  end_of_arc_1: {
    trigger: 'end_of_arc_1',
    title: 'REFLECTION — FIRST PASS',
    opening: `It's been {DAYS} days since you signed the Compact.\n\n{MISSIONS} contracts.`,
    closing: `Disconnect.`,
    factPool: {
      strong_principled: [
        `Eleven of them paid worse because you asked what the data was for.`,
        `You spared {CIVILIANS_SPARED} marked-for-deletion accounts. None of them know.`,
        `{WHISTLEBLOWERS} corporate whistleblowers are alive who would not have been otherwise.`,
        `CIPHER addresses you by your initials now. He stopped using full handles last week.`,
        `The Underground has a name for you. It is not yet a famous one.`,
        `You leaked the data on {LEAKS} contracts that paid more for selling. You don't remember the credits you didn't earn.`,
      ],
      weak_principled: [
        `Some of those contracts paid less because you asked questions. You don't regret it.`,
        `You spared {CIVILIANS_SPARED} accounts the contract said to delete. The contract didn't ask why.`,
        `CIPHER opens with greetings. You've noticed.`,
        `Your relay chain is longer than most operatives at your tier. You take the time.`,
        `You sleep better than the average operative your age. You don't know why this is.`,
      ],
      neutral: [
        `Some contracts paid better than expected. Some paid worse.`,
        `Your relay chain is competent. Your wipes are professional.`,
        `You have not been caught. You also have not been famous.`,
        `Three operatives you'd worked with are gone. You don't know what happened to two of them.`,
        `Your handle has been quoted on the Mesh twice. Both times in passing.`,
      ],
      weak_mercenary: [
        `Eleven of those contracts paid better because you didn't ask what the data was for.`,
        `You took {BOUNTIES_TAKEN} contracts on fellow operatives. They were all Compact-legal.`,
        `Three operatives you'd worked with are dead. You think one of them by your hand.`,
        `Your credit balance is comfortable. You bank at Pacific National. You know what that means.`,
        `CIPHER opens his messages without greetings now. He didn't always.`,
      ],
      strong_mercenary: [
        `Eleven of them paid better because you didn't ask what the data was for. Four paid worse because you did.`,
        `Three operatives you'd worked with are dead. You think two of them by your hand, but in this work you don't always know.`,
        `The JCB has your handle on a watchlist of forty-two names.`,
        `CIPHER has stopped opening with greetings.`,
        `You used to think you'd quit when you hit a million credits. That was {DAYS} days ago. The number is bigger now.`,
        `You sold the data on {SOLD} contracts that would have been more useful leaked. You don't think about it.`,
      ],
    },
  },

  end_of_arc_3: {
    trigger: 'end_of_arc_3',
    title: 'REFLECTION — MIDPOINT',
    opening: `You've been doing this for {DAYS} days now.\n\nLong enough to know what kind of operative you are.`,
    closing: `Sleep, if you can.`,
    factPool: {
      strong_principled: [
        `The Underground has accepted you in a way most operatives never experience.`,
        `Your name appears in three of CIPHER's published essays — never quoted, always implied.`,
        `Two of the whistleblowers you protected have published memoirs. Neither names you. Both know.`,
        `You have refused {BOUNTIES_TAKEN} bounty contracts on fellow operatives. Each refusal cost you. You don't regret any of them.`,
        `When you sleep, you sleep well.`,
      ],
      weak_principled: [
        `You are recognisable on the Mesh in a way you weren't six months ago.`,
        `Three operatives you've never met have used your handle as a benchmark.`,
        `You sleep, mostly. The bad nights are about the contracts you almost took.`,
      ],
      neutral: [
        `The pattern of your career so far is honest. Not noble, not cynical. Working.`,
        `Some operatives would recognise your handle. Most would not.`,
        `You have outlived three operatives you considered competition.`,
        `The work is the work. It pays. You continue.`,
      ],
      weak_mercenary: [
        `You are wealthier than most operatives ever become.`,
        `Three contracts in the last month paid better than your first year of work combined.`,
        `Your gateway is being probed by the JCB approximately once a fortnight. They have not yet found you.`,
        `You don't sleep as well as you used to.`,
      ],
      strong_mercenary: [
        `You are wealthy. The number, you don't tell people.`,
        `The JCB watches you specifically.`,
        `You have not heard from CIPHER in seventy-three days.`,
        `Two operatives you used to work with have taken contracts on you. Both failed. You know who they were.`,
        `The bad nights are most nights now.`,
        `You used to think the credits would solve something. You don't think that any more.`,
      ],
    },
  },

  pre_arc_5: {
    trigger: 'pre_arc_5',
    title: 'REFLECTION — BEFORE THE END',
    opening: `Everything you have done is about to matter.\n\nNot in some abstract way. In a specific way. There is a choice in front of you that has been waiting since the start.`,
    closing: `Whatever you do next — you chose this.`,
    factPool: {
      strong_principled: [
        `The Underground will follow you anywhere you ask.`,
        `Director Kovac of the JCB respects you. She has said so, in a place where she did not know she was being recorded.`,
        `REVELATION speaks to you with a specific kind of attention.`,
        `Three endings are available to you. They are not the same three available to anyone else.`,
        `You know which one you will choose. You've known for a while.`,
      ],
      weak_principled: [
        `You have built relationships across factions that most operatives never manage.`,
        `Most of the endings are available to you. The choice is not who you have been; it is who you wish to become next.`,
        `You will sleep on it. That is the right thing to do.`,
      ],
      neutral: [
        `The world does not have a single read on you. That is unusual at this stage.`,
        `Several endings are available, all with consequences you can see.`,
        `You have not yet decided. That is also the right thing to do.`,
      ],
      weak_mercenary: [
        `The Government has approached you about a position. The offer is real and the money is obscene.`,
        `Arunmor has approached you with a different position. The money is also obscene.`,
        `Most endings are technically available, although some would require the other side to forgive you.`,
        `You can hear yourself thinking again, in the quiet between contracts. You don't know yet what to do with that.`,
      ],
      strong_mercenary: [
        `Director Kovac knows your name. She is the only person at her level who does. This is not a compliment.`,
        `REVELATION has spoken to you with a specific kind of attention.`,
        `The doors that are still open are the ones with money behind them. Several have closed permanently.`,
        `The Underground will not have you back. Cipher will not write to you again.`,
        `You can still walk away. You can. The fact that this needs to be said out loud is part of what you have become.`,
      ],
    },
  },

  anniversary: {
    trigger: 'anniversary',
    title: 'REFLECTION — ONE YEAR',
    opening: `One year since you signed the Compact.\n\nIt does not feel like a year. It does not feel like any specific length of time.`,
    closing: `Voidlink Standard Time clicks over. Tomorrow is the same as today, slightly different.`,
    factPool: {
      strong_principled: [
        `You are an operative of a kind that did not exist a year ago.`,
        `The list of people whose lives are better because of you is, at last estimate, in the hundreds.`,
        `You have not forgotten any of their names. You should write them down.`,
      ],
      weak_principled: [
        `You are someone other operatives ask about now.`,
        `You have built something. It does not have a name.`,
      ],
      neutral: [
        `You have not failed in any spectacular way.`,
        `You have not succeeded in any spectacular way.`,
        `Most operatives don't last a year. You have.`,
      ],
      weak_mercenary: [
        `You can afford anything you can think to want.`,
        `You no longer think about quitting. You're not sure when that stopped.`,
      ],
      strong_mercenary: [
        `You have not slept through a full night in six weeks.`,
        `There is a question you avoid thinking about. You will continue avoiding it tomorrow.`,
        `It has been one year.`,
      ],
    },
  },

  season_transition: {
    trigger: 'season_transition',
    title: 'REFLECTION — SEASON TURNS',
    opening: `The season turns. New contracts appear. The world simulation rolls one notch forward.\n\nA moment to look at where you are.`,
    closing: `Forward.`,
    factPool: {
      strong_principled: [
        `Three new clients have asked specifically for you this season.`,
        `Your inbox is full. Most of it is people who want to help.`,
      ],
      weak_principled: [
        `You start the new season comfortable. Not famous, but recognised.`,
        `You have plans you didn't have a year ago.`,
      ],
      neutral: [
        `New contracts. New opportunities. Same work.`,
        `You will get up tomorrow and do this again.`,
      ],
      weak_mercenary: [
        `Several premium contracts have already been routed to you for the new season.`,
        `Your credit balance grew this quarter, again.`,
      ],
      strong_mercenary: [
        `The same handful of clients keep finding you. You no longer choose what work you do.`,
        `You do not look at your inbox most mornings.`,
      ],
    },
  },
}

/**
 * Build the player-facing text for a scene, selecting facts from the pool
 * based on the player's pattern bucket. Returns the assembled paragraphs
 * with all tokens resolved.
 */
export function buildReflectionText(
  trigger: ReflectionTrigger,
  player: PlayerProfile,
  pattern: DecisionPattern,
  options: { now?: number; factCount?: number } = {},
): { title: string; body: string } {
  const scene = REFLECTION_SCENES[trigger]
  if (!scene) return { title: 'REFLECTION', body: 'No reflection available.' }
  const bucket: Bucket = patternBucket(pattern)
  const pool = scene.factPool[bucket] ?? scene.factPool.neutral
  const factCount = options.factCount ?? Math.min(5, pool.length)
  // Deterministic-ish: pick the first N facts, but rotate based on totalMissions
  // so a player completing the same scene twice can see different facts.
  const start = (player.stats.totalMissions ?? 0) % Math.max(1, pool.length)
  const facts: string[] = []
  for (let i = 0; i < factCount; i++) facts.push(pool[(start + i) % pool.length])
  const ctx = buildTokenContext(player, options.now)
  const opening = resolveTokens(scene.opening, ctx)
  const closing = resolveTokens(scene.closing, ctx)
  const body = [opening, '', ...facts.map((f) => resolveTokens(f, ctx)), '', closing].join('\n\n')
  return { title: scene.title, body }
}

function patternBucket(pattern: DecisionPattern): Bucket {
  const n = pattern.netScore
  if (n >= 10)  return 'strong_principled'
  if (n >= 1)   return 'weak_principled'
  if (n <= -10) return 'strong_mercenary'
  if (n <= -1)  return 'weak_mercenary'
  return 'neutral'
}

function buildTokenContext(player: PlayerProfile, now: number = Date.now()): Record<string, string | number> {
  return {
    DAYS: Math.max(1, Math.floor((now - player.createdAt) / (24 * 3600 * 1000))),
    MISSIONS: player.stats.totalMissions,
    CIVILIANS_SPARED: numFlag(player, 'choice_civilian_spared'),
    WHISTLEBLOWERS: numFlag(player, 'choice_whistleblower_protected'),
    BOUNTIES_TAKEN: numFlag(player, 'choice_op_bounty_accepted'),
    LEAKS: numFlag(player, 'choice_data_leaked'),
    SOLD: numFlag(player, 'choice_data_sold'),
    HANDLE: player.handle,
  }
}

function numFlag(player: PlayerProfile, key: string): number {
  const v = player.activeFlags[key]
  if (typeof v === 'number') return v
  return v ? 1 : 0
}

function resolveTokens(template: string, ctx: Record<string, string | number>): string {
  return template.replace(/\{([A-Z_]+)\}/g, (whole, key) =>
    ctx[key] !== undefined ? String(ctx[key]) : whole,
  )
}
