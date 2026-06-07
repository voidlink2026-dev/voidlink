// M14s — Client faction classifier.
//
// Given a contract's clientHandle, return the faction-alignment bucket that
// determines whether completing/refusing it tilts the player toward the
// Collaborator end of the spectrum or the Resistor end.
//
// Buckets:
//   - 'corporate'    → Big Four (Arunmor, Ares, Internic, Nexus) and their
//                      subsidiaries. Completing pushes toward bond_collaborator.
//   - 'government'   → JCB, surviving national agencies. Same direction.
//   - 'underground'  → Cipher, NightOwl, Null_Trader, Shadow_Broker and friends.
//                      Completing pushes toward bond_resistor.
//   - 'independent'  → freelance brokers, civilians, whistleblowers. Neutral
//                      for the axis (these still touch other axes).
//   - 'neutral'      → unknown / Voidlink itself. Doesn't move the needle.

export type ClientFaction =
  | 'corporate'
  | 'government'
  | 'underground'
  | 'independent'
  | 'neutral'

const CORPORATE_PATTERNS = [
  /^ARC_/i, /^ARES/i, /^ARUNMOR/i, /^INTERNIC/i, /^NEXUS/i,
  /_CORP$/i, /_BANK$/i, /_DEFENCE$/i, /_BIOTECH$/i,
]
const GOVERNMENT_PATTERNS = [
  /^JCB/i, /^GOV_/i, /_BUREAU$/i, /_AGENCY$/i, /^FED_/i,
]
const UNDERGROUND_PATTERNS = [
  /^CIPHER$/i, /^NIGHTOWL/i, /^NULL_TRADER$/i, /^SHADOW_BROKER$/i,
  /^ZERO_COOL$/i, /^THE_BROKER$/i, /^GHOST_/i, /_UNDERGROUND$/i,
]
const NEUTRAL_PATTERNS = [
  /^VOIDLINK/i, /^YOURSELF$/i, /^SYS\./i,
]

export function classifyClient(handle: string): ClientFaction {
  if (NEUTRAL_PATTERNS.some((r) => r.test(handle))) return 'neutral'
  if (CORPORATE_PATTERNS.some((r) => r.test(handle))) return 'corporate'
  if (GOVERNMENT_PATTERNS.some((r) => r.test(handle))) return 'government'
  if (UNDERGROUND_PATTERNS.some((r) => r.test(handle))) return 'underground'
  return 'independent'
}

/**
 * Map a completed mission's client to the choice flag (if any) that should
 * be bumped on the player. Returns null for neutral / independent — those
 * contracts don't shift the Collaborator/Resistor axis.
 */
export function flagForCompletedContract(handle: string): string | null {
  switch (classifyClient(handle)) {
    case 'corporate':   return 'choice_corp_contract_taken'
    case 'government':  return 'choice_gov_contract_taken'
    case 'underground': return 'choice_underground_contract_taken'
    default:            return null
  }
}

/**
 * Map a *refused* corporate contract to the resistor flag.
 */
export function flagForRefusedContract(handle: string): string | null {
  if (classifyClient(handle) === 'corporate') return 'choice_corp_contract_refused'
  return null
}
