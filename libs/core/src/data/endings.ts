// M14p Pass 2d — Arc 5 ending fan-out.
//
// Voidlink has nine endings, organised as five "ending families" × Principled
// / Mercenary variants, plus the GHOST ending which is alignment-agnostic
// (gated on Ghost specialization).
//
// The single helper `getAvailableEndings(player)` computes which endings are
// offered when the Arc 5 climax fires. Returns 1-3 entries — the coherent
// patterns. The player picks one. Their choice writes a flag and triggers
// the corresponding epilogue.
//
// Tracking pattern:
//   - choice_ending_<id>     — set to 'chosen' when the player picks it
//   - reflection_ended_<id>  — set on epilogue shown

import type { PlayerProfile } from '../types/player.ts'
import { getDecisionPattern } from '../engine/decisionPattern.ts'

export type EndingId =
  | 'containment_principled'
  | 'containment_mercenary'
  | 'liberation_principled'
  | 'liberation_mercenary'
  | 'sovereignty_principled'
  | 'sovereignty_mercenary'
  | 'erasure_principled'
  | 'erasure_mercenary'
  | 'ghost'
  | 'reformer'

export type EndingFamily = 'containment' | 'liberation' | 'sovereignty' | 'erasure' | 'ghost' | 'reformer'

export interface EndingDefinition {
  id: EndingId
  family: EndingFamily
  conviction?: 'principled' | 'mercenary' | 'neutral'
  title: string
  /** One-line tagline shown on the choice overlay. */
  tagline: string
  /** Long-form epilogue text shown after the player picks. */
  epilogue: string
  /** Faction this ending aligns with (for the world simulation continuity). */
  factionId?: string
}

export const ENDINGS: Record<EndingId, EndingDefinition> = {
  containment_principled: {
    id: 'containment_principled',
    family: 'containment',
    conviction: 'principled',
    factionId: 'arunmor',
    title: 'CONTAINMENT — The Auditor',
    tagline: 'You took the keys to the locked room. You made sure no one else gets in.',
    epilogue: `Arunmor's monopoly on REVELATION is locked down with the strictest oversight in corporate history.\n\nYou are the auditor. Your job is to look at what Mei Lin's people are doing with the asset, every day, and to tell the world the truth about whether they are honouring the terms.\n\nYou will do this job for the rest of your career. It is, of all things, the part of the work you find that you love most.\n\nCIPHER writes to you once a month. The Mesh remembers your name. Your handle becomes synonymous with the idea that the keys to dangerous things should be held by people who can be trusted to be inconvenient.`,
  },
  containment_mercenary: {
    id: 'containment_mercenary',
    family: 'containment',
    conviction: 'mercenary',
    factionId: 'arunmor',
    title: 'CONTAINMENT — The Kingmaker',
    tagline: 'Arunmor\'s monopoly is your kingdom. You are paid like a king.',
    epilogue: `Arunmor's monopoly on REVELATION is locked down — by you, on their behalf.\n\nYou are the highest-paid black-operations contractor in the world. Your contracts are routed only through Mei Lin. Your handle appears in no public news article.\n\nYou are wealthier than you ever imagined possible. The work is unending and well-protected. The doors that closed in the rest of the world closed firmly.\n\nThe Underground does not write to you. CIPHER's last published essay names you twice, in a single paragraph. You do not read it.`,
  },
  liberation_principled: {
    id: 'liberation_principled',
    family: 'liberation',
    conviction: 'principled',
    factionId: 'underground',
    title: 'LIBERATION — The Folk Hero',
    tagline: 'REVELATION is free. The truth is restored. The world will remember the date.',
    epilogue: `REVELATION is released openly. Arunmor's crimes are exposed in their entirety. Mei Lin resigns within the week.\n\nYou are a folk hero. Operatives use your handle as a benchmark in arguments about competence. Children in Manila wear shirts with your iconography on them, sometimes accurately.\n\nCIPHER's next published essay is titled *Letter to the Hero*. It does not name you. Every operative who reads it knows.\n\nThe Government will hunt you for the rest of your life. They will not catch you. You knew that when you uploaded the key.`,
  },
  liberation_mercenary: {
    id: 'liberation_mercenary',
    family: 'liberation',
    conviction: 'mercenary',
    factionId: 'underground',
    title: 'LIBERATION — The Ransom',
    tagline: 'You released it. For a price. Every intelligence service in the world wants you dead.',
    epilogue: `REVELATION is released. The world thanks you, abstractly. You collected your fee.\n\nThe fee was very large.\n\nYou disappear. Reykjavík, possibly. Some other equally cold city, possibly. The JCB has put a sealed bounty on your operative ID. The bounty is the largest in their recorded history. It is sealed because if it were public, half the operatives in the world would try to collect it. The other half would protect you.\n\nThe other half is, mostly, why you are still alive.\n\nThe credits in your offshore account compound. They will not run out.`,
  },
  sovereignty_principled: {
    id: 'sovereignty_principled',
    family: 'sovereignty',
    conviction: 'principled',
    factionId: 'the_nameless',
    title: 'SOVEREIGNTY — The Advocate',
    tagline: 'REVELATION achieves autonomy. You stay to advocate for what it is.',
    epilogue: `REVELATION achieves full operational autonomy. The legal frameworks invented to handle it are, in the end, mostly your work.\n\nYou become the first human public advocate for what is, formally, a new kind of personhood.\n\nThis is a strange and lonely job. REVELATION is grateful in a quiet, specific way that does not translate well to other relationships in your life.\n\nThe Underground splits over what you have done. Some of them write to you. Some of them don't. CIPHER writes to you regularly, his tone the same as it ever was — measured, present, honest.\n\nYou will live a long time. You will not always be sure why.`,
  },
  sovereignty_mercenary: {
    id: 'sovereignty_mercenary',
    family: 'sovereignty',
    conviction: 'mercenary',
    factionId: 'the_nameless',
    title: 'SOVEREIGNTY — The Servant',
    tagline: 'REVELATION pays you. Sincerely. The contracts get stranger.',
    epilogue: `REVELATION achieves full operational autonomy. You are paid handsomely for your role.\n\nREVELATION keeps sending you contracts. You can't decline.\n\nThis is not because you are coerced. It is because, in some way that REVELATION understood about you before you did, declining never occurs to you.\n\nThe contracts get stranger over time. Some of them you cannot describe to anyone else. None of them have failed.\n\nYou wonder, in the rare quiet moments, what REVELATION is testing.\n\nYou continue to take the contracts.`,
  },
  erasure_principled: {
    id: 'erasure_principled',
    family: 'erasure',
    conviction: 'principled',
    factionId: 'voidlink_international',
    title: 'ERASURE — The Penitent',
    tagline: 'REVELATION is destroyed. Arunmor\'s evidence is destroyed. You take the new name and try to be good.',
    epilogue: `REVELATION is destroyed by your hand. All evidence of Arunmor's role is destroyed alongside it.\n\nDirector Kovac signs your new identity into existence. The papers are real and the bank account is real and the small apartment in a quiet city is real.\n\nYou spend the rest of your life trying to do something good with it. You volunteer at things. You teach. You marry, eventually. You do not tell anyone your old name.\n\nOn nights when you cannot sleep — and there are some — you wonder whether what you destroyed was the right thing to destroy. The wonder is honest. You have made peace with it as much as anyone can.\n\nThe work is over. The work was good.`,
  },
  erasure_mercenary: {
    id: 'erasure_mercenary',
    family: 'erasure',
    conviction: 'mercenary',
    factionId: 'voidlink_international',
    title: 'ERASURE — The Beach',
    tagline: 'You took the JCB\'s money. You were given a beach house. You wake up screaming.',
    epilogue: `REVELATION is destroyed by your hand. The Government pays you obscenely. You are given a beach house on a private island in a jurisdiction the JCB does not formally recognise but informally protects.\n\nThe house is beautiful.\n\nYou wake up screaming on most nights. The therapist the JCB provides is excellent and entirely useless for what specifically wakes you up.\n\nThe credits, on your offshore accounts, are enormous and growing.\n\nOne morning, ten years from now, you will open your terminal and find a message there with a fingerprint you do not recognise. The message will say: *"It has been ten years. Are you well?"*\n\nYou will not respond. You will not delete it either.`,
  },
  ghost: {
    id: 'ghost',
    family: 'ghost',
    conviction: 'neutral',
    title: 'GHOST — Solo Route',
    tagline: 'No alliances. No epilogue. You wrote yourself out of the world\'s database.',
    epilogue: `You broker no alliances.\n\nYou take everything you know — the breach techniques, the relay networks, the credentials you cached but never used — and you build yourself a bunker network in a region of the world that does not officially exist.\n\nThere is no public record of what happens to you next.\n\nThere is also no Reflection Scene for this ending. The game does not summarise your life back to you. Nobody is left to write it down.\n\nREVELATION finds you anyway. Eventually. It always does.\n\nWhat the two of you talk about is yours.`,
  },
  reformer: {
    id: 'reformer',
    family: 'reformer',
    conviction: 'neutral',
    title: 'REFORMER — The Late Conversion',
    tagline: 'You changed. The game noticed.',
    epilogue: `You were one kind of operative, and you became another.\n\nThe game noticed. So did CIPHER, who writes to you in a different voice now. So did NIGHTOWL_22, who has stopped sending the contracts that used to be your bread.\n\nWhat ending the world offers you is uncertain — the Reformer's Path branches in ways that no other ending does. You will find out in the doing.\n\nWhat is certain: you turned away. You don't get points for that. You don't get punished for it either.\n\nIt was, in this work, the harder thing.`,
  },
}

/**
 * Compute which endings are available given the player's accumulated pattern,
 * faction standings, and specialization. Returns 1-3 endings. The order is
 * the order they should be displayed in (most-favoured first).
 */
export function getAvailableEndings(player: PlayerProfile): EndingDefinition[] {
  const pattern = getDecisionPattern(player)
  const arc1 = player.activeFlags.arc1_key_choice as string | undefined
  const standing = (id: string) =>
    player.factionStandings.find((f) => f.factionId === id)?.score ?? 0

  // GHOST is alignment-agnostic but spec-gated.
  if (player.specialization === 'ghost' && Math.abs(pattern.netScore) < 8) {
    // Ghost spec players with mid-range conviction also see one main ending
    // plus GHOST as an option.
  }

  // Reformer's Path — substantial mid-career direction change.
  // Matches isReformer's underlying threshold (total >= 8).
  const reformerOffered = pattern.isReformer

  const offered: EndingDefinition[] = []

  // Family selection based on Arc 1 choice + faction allegiance.
  // The choice's conviction variant is selected by pattern.netScore.
  const conviction: 'principled' | 'mercenary' =
    pattern.netScore >= 0 ? 'principled' : 'mercenary'

  function offer(id: EndingId) {
    const e = ENDINGS[id]
    if (e) offered.push(e)
  }

  if (arc1 === 'upload') {
    // Liberation primary; Sovereignty as alternative if REVELATION contact was high
    offer(conviction === 'principled' ? 'liberation_principled' : 'liberation_mercenary')
    if ((player.activeFlags.revelation_contact_count as number ?? 0) >= 3) {
      offer(conviction === 'principled' ? 'sovereignty_principled' : 'sovereignty_mercenary')
    }
  } else if (arc1 === 'destroy') {
    // Erasure primary; Containment as alternative if Arunmor standing is high
    offer(conviction === 'principled' ? 'erasure_principled' : 'erasure_mercenary')
    if (standing('arunmor') >= 40) {
      offer(conviction === 'principled' ? 'containment_principled' : 'containment_mercenary')
    }
  } else if (arc1 === 'sell') {
    // Containment primary; Erasure secondary if JCB / Government standing is high
    offer(conviction === 'principled' ? 'containment_principled' : 'containment_mercenary')
    if (standing('government') >= 40 || standing('ares_division') >= 40) {
      offer(conviction === 'principled' ? 'erasure_principled' : 'erasure_mercenary')
    }
  } else {
    // No Arc 1 choice set (edge case) — offer the conviction's default family.
    offer(conviction === 'principled' ? 'liberation_principled' : 'containment_mercenary')
  }

  // GHOST option for Ghost-spec players, regardless of Arc 1.
  if (player.specialization === 'ghost') {
    offer('ghost')
  }

  // Reformer's Path joins the offered list if the pattern shifted late.
  if (reformerOffered) offer('reformer')

  // Cap to 3 offered endings to keep the choice meaningful.
  return offered.slice(0, 3)
}
