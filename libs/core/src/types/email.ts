// Encrypted email / contacts inbox — M14h.6.
//
// Replaces the never-shipped "mobile phone contact" idea. Every NPC contact
// dispatches messages to the operative's encrypted inbox; mission briefings,
// faction tip-offs, and reward acknowledgements all arrive here.
//
// Messages are stored client-side; the "encryption" is in-fiction (PGP-style
// fingerprint badges + cipher art on the unread state) — there is no real
// crypto here, this is a single-player game.

export type EmailCategory =
  | 'mission'   // contract dispatch
  | 'contact'   // NPC personal correspondence
  | 'faction'   // alignment / heat / standing updates
  | 'system'    // automated VoidLink ops
  | 'darknet'   // anonymous tips, market updates
  | 'rival'     // taunts / counter-intel

export interface EmailMessage {
  id: string
  receivedAt: number   // world-clock ms — formatWorldClock-compatible
  from: string         // display name / handle of sender
  fromFingerprint?: string // short PGP-fingerprint mock (e.g. 'A4F1 9E20 7B83 D6CC')
  subject: string
  body: string         // plain-text body; line breaks preserved by <pre> render
  category: EmailCategory
  isRead: boolean
  isStarred?: boolean
  encrypted?: boolean  // if true, render with cipher overlay until clicked
}

/**
 * The five preset contacts that seed every new operative's address book.
 * Mission generators reference these by `id` when dispatching mail. Add new
 * ones here rather than hard-coding handles inside store actions.
 */
export interface EmailContact {
  id: string
  name: string
  handle: string
  fingerprint: string
  role: string         // short blurb shown next to the name
  faction?: string     // for colour coding
}

export const SEED_CONTACTS: EmailContact[] = [
  {
    id: 'voidlink_dispatch',
    name: 'VoidLink Dispatch',
    handle: 'dispatch@voidlink.int',
    fingerprint: '0001 0001 V01D L1NK',
    role: 'Automated contract dispatcher',
    faction: 'voidlink_international',
  },
  {
    id: 'cipher',
    name: 'CIPHER',
    handle: 'cipher@ghostnet.dn',
    fingerprint: 'C19H 3R20 7B83 D6CC',
    role: 'Senior operative — old guard',
    faction: 'underground',
  },
  {
    id: 'nightowl_22',
    name: 'NIGHTOWL_22',
    handle: 'no22@nightowl.dn',
    fingerprint: 'F00D BABE C0FF EE42',
    role: 'Independent broker',
  },
  {
    id: 'sysop',
    name: 'sys.ops',
    handle: 'sys@voidlink.int',
    fingerprint: '5Y50 P5DM 1NK4 N0NE',
    role: 'System notifications',
  },
  {
    id: 'arunmor_recruiter',
    name: 'Arunmor Talent',
    handle: 'talent@arunmor.corp',
    fingerprint: 'A4F1 9E20 7B83 D6CC',
    role: 'Corporate recruiting (Arunmor)',
    faction: 'arunmor',
  },
]
