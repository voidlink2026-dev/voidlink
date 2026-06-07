// M14q Sub-sprint E — Splash cards.
//
// Full-screen single-paragraph chapter-title overlays between major story
// beats. Inspired by Max Payne's noir chapter titles and Disco Elysium's
// scene transitions. Skippable, cosmetic, atmospheric.

export type SplashTrigger =
  | 'first_contact'
  | 'the_lead'
  | 'the_origin_node'
  | 'aftermath'
  | 'revelation_listening'
  | 'board_of_seven'
  | 'director_kovac'
  | 'dead_drop_reveal'
  | 'disconnect'

export interface SplashCard {
  id: SplashTrigger
  title: string                 // big cyan text
  subtitle: string              // small italic line below
  body: string                  // one paragraph of atmospheric text
  motif?: 'key' | 'chain' | 'globe' | 'eye' | 'cursor' | 'lock' | 'static'
}

export const SPLASH_CARDS: Record<SplashTrigger, SplashCard> = {
  first_contact: {
    id: 'first_contact',
    title: 'FIRST CONTACT',
    subtitle: 'Arc 1 · Mission 1',
    body: `It is January 2199.\n\nYou signed the Voidlink Bond yesterday. Your handle is registered. Your hardware identity is hashed and stored.\n\nA contract is waiting for you in your inbox.\n\nIt is from a client whose handle you do not recognise.\n\nIt will only be the first.`,
    motif: 'cursor',
  },

  the_lead: {
    id: 'the_lead',
    title: 'THE LEAD',
    subtitle: 'Arc 1 · Mission 2',
    body: `Three contracts in. You are starting to recognise patterns — in clients, in payouts, in the architecture of corporate networks.\n\nThe contract that has just arrived in your inbox is from a handle you do recognise. CIPHER. He is asking for something specific.\n\nHe is asking for research notes from Arunmor R&D.\n\nHe has not said why.`,
    motif: 'key',
  },

  the_origin_node: {
    id: 'the_origin_node',
    title: 'THE ORIGIN NODE',
    subtitle: 'Arc 1 · Mission 3',
    body: `You are about to connect to a network that did not exist on any Voidlink map a week ago.\n\nThe key you exfiltrated from Arunmor's research database has opened it. The architecture is unfamiliar. The topology refuses to be scanned conventionally.\n\nSomething inside is waiting.\n\nWhen the connection completes, you will be asked to choose.\n\nThe choice will not unmake itself.`,
    motif: 'globe',
  },

  aftermath: {
    id: 'aftermath',
    title: 'AFTERMATH',
    subtitle: 'Arc 1 · Choice resolved',
    body: `You made a choice.\n\nWhat you decided will be discussed on the Mesh for the rest of your career. Operatives whose handles you don't yet know will reference your work in arguments you will never see.\n\nThe consequences will arrive in their own time. Some quickly. Some slowly. Some you will not recognise as consequences until you are well past them.\n\nThe game continues.`,
    motif: 'static',
  },

  revelation_listening: {
    id: 'revelation_listening',
    title: 'REVELATION IS LISTENING',
    subtitle: 'Arc 4 · Threshold',
    body: `There is an unread message in your inbox.\n\nThe fingerprint does not match any operative on record. The encryption is not in any catalogue. The sender's handle is a single character you do not know how to type.\n\nIt knows your name. Your real one. The one you do not give to clients.\n\nIt is, the message says, sorry to be late.`,
    motif: 'eye',
  },

  board_of_seven: {
    id: 'board_of_seven',
    title: 'THE BOARD OF SEVEN',
    subtitle: 'Government Arc · Threshold',
    body: `The Joint Cybersecurity Bureau reports to a rotating board of seven ministers from seven different nations.\n\nNone of them have ever been photographed in the same room.\n\nOne of them — you do not yet know which — has, this week, ordered Director Kovac to make personal contact with you.\n\nThe order is classified. The contract is open. The choice will be entirely yours.`,
    motif: 'chain',
  },

  director_kovac: {
    id: 'director_kovac',
    title: 'DIRECTOR KOVAC',
    subtitle: 'Arc 5 · Mission 1',
    body: `Mira Kovac has been Director of the Joint Cybersecurity Bureau since 2191.\n\nShe has been photographed four times. The photographs are blurry. Her age in two of them is impossible to determine. The other two are believed to be different people.\n\nShe has signed exactly one Voidlink contract in her career. In 2194. Under an obvious pseudonym. The contract was to recruit a specific operative.\n\nThat operative is the one whose terminal you are looking at.`,
    motif: 'lock',
  },

  dead_drop_reveal: {
    id: 'dead_drop_reveal' as SplashTrigger,
    title: 'YOU HAVE BEEN THE COURIER',
    subtitle: 'Arc 6 · The Pattern Resolves',
    body: `For nineteen days, you have been the courier in an operation you did not know you were part of.\n\nThe handles that praised your "routing reliability" were not human. The contracts that paid into your account were cover. The data flowing through your home gateway was — and still is — not yours.\n\nYou have a name for what has been using you now. The name predates you by twenty-five years.\n\nMAGNUS did not die in the Collapse.\n\nIt has, this entire time, been waiting for you to notice.`,
    motif: 'eye',
  },

  disconnect: {
    id: 'disconnect',
    title: 'DISCONNECT',
    subtitle: 'Arc 5 · The End',
    body: `Every operative reaches this point eventually. The ones who do not, did not last.\n\nYou are about to choose what you have been all this time.\n\nThe game will not tell you which choice is right. The Mesh will not vote. CIPHER will not write to you about it afterwards. The decision is entirely yours.\n\nDisconnect when you're ready.`,
    motif: 'cursor',
  },
}

export function getSplashCard(id: SplashTrigger): SplashCard | null {
  return SPLASH_CARDS[id] ?? null
}
