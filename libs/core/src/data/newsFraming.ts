// M14p — News framing channel.
//
// Same event, different narration. The world's news feed reads the player's
// accumulated decision pattern and frames their actions in the voice it has
// learned to use for them.
//
// Templates use tokens of the form `{TOKEN}`. Tokens are resolved against
// the buckets below using the player's pattern.netScore.
//
// Buckets:
//   strong_principled  — netScore >= 10
//   weak_principled    — 1 <= netScore < 10
//   neutral            — abs(netScore) < 1
//   weak_mercenary     — -10 < netScore <= -1
//   strong_mercenary   — netScore <= -10
//
// Any template can use any token; if a token isn't recognised, it's left
// verbatim (so existing templates without tokens are unchanged).

import type { DecisionPattern } from '../engine/decisionPattern.ts'

type Bucket = 'strong_principled' | 'weak_principled' | 'neutral' | 'weak_mercenary' | 'strong_mercenary'

function bucketOf(pattern: DecisionPattern): Bucket {
  const n = pattern.netScore
  if (n >= 10)   return 'strong_principled'
  if (n >= 1)    return 'weak_principled'
  if (n <= -10)  return 'strong_mercenary'
  if (n <= -1)   return 'weak_mercenary'
  return 'neutral'
}

const TOKENS: Record<string, Record<Bucket, string[]>> = {
  // "anonymous", "vigilante", "ruthless"… — the adjective that describes the actor
  ACTOR_ADJ: {
    strong_principled: ['anonymous', 'principled', 'careful'],
    weak_principled:   ['unidentified', 'professional', 'skilled'],
    neutral:           ['anonymous', 'skilled', 'unattributed'],
    weak_mercenary:    ['ruthless', 'calculated', 'cold'],
    strong_mercenary:  ['savage', 'merciless', 'vicious'],
  },
  // The verb-cluster used for the action — e.g. "leak" vs "extraction" vs "theft"
  ACT_NOUN: {
    strong_principled: ['leak', 'disclosure', 'exposure'],
    weak_principled:   ['exfiltration', 'breach', 'intrusion'],
    neutral:           ['breach', 'intrusion', 'incident'],
    weak_mercenary:    ['theft', 'strike', 'attack'],
    strong_mercenary:  ['attack', 'assault', 'predation'],
  },
  // How investigators describe the work
  WORK_TONE: {
    strong_principled: ['exacting', 'forensic', 'restrained'],
    weak_principled:   ['careful', 'professional', 'methodical'],
    neutral:           ['professional', 'unattributed', 'skilled'],
    weak_mercenary:    ['cold', 'efficient', 'aggressive'],
    strong_mercenary:  ['brutal', 'merciless', 'remorseless'],
  },
  // Modifier on aftermath sentences — "the target was warned" vs "the target was destroyed"
  AFTERMATH: {
    strong_principled: ['the act has been claimed in the operative\'s name across the Mesh', 'the public response has been overwhelmingly positive', 'civilians appear to have been deliberately spared'],
    weak_principled:   ['the operative\'s identity remains unknown', 'civilians were not affected', 'the perimeter of the strike was unusually narrow'],
    neutral:           ['no attribution has been made', 'investigators have opened a file', 'the source remains unknown'],
    weak_mercenary:    ['collateral damage is being assessed', 'multiple secondary systems were affected', 'investigators describe the work as deliberately destructive'],
    strong_mercenary:  ['the destruction was disproportionate to the stated objective', 'civilian systems were left burning', 'investigators describe the operative as a known repeat offender'],
  },
}

/**
 * Pick a token value from the appropriate bucket. Stable per (token, bucket,
 * timestamp) so the same news article doesn't reshuffle on re-render.
 */
function pickToken(token: string, pattern: DecisionPattern, seed: number): string {
  const bucket = bucketOf(pattern)
  const options = TOKENS[token]?.[bucket]
  if (!options || options.length === 0) return ''
  const idx = Math.abs(seed) % options.length
  return options[idx]
}

/**
 * Replace `{TOKEN}` placeholders in a template. Unknown tokens are left
 * verbatim. Existing templates without tokens pass through unchanged.
 */
export function frameNewsText(
  template: string,
  pattern: DecisionPattern,
  seed: number = Date.now(),
): string {
  return template.replace(/\{([A-Z_]+)\}/g, (whole, token) => {
    const v = pickToken(token, pattern, seed + token.length)
    return v || whole
  })
}

/** Convenience for the common case of framing both headline and body together. */
export function frameNewsArticle(
  article: { headline: string; body: string },
  pattern: DecisionPattern,
  seed: number = Date.now(),
): { headline: string; body: string } {
  return {
    headline: frameNewsText(article.headline, pattern, seed),
    body:     frameNewsText(article.body, pattern, seed + 1),
  }
}
