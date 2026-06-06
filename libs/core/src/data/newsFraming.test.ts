import { describe, it, expect } from 'vitest'
import { frameNewsText, frameNewsArticle } from './newsFraming.ts'
import type { DecisionPattern } from '../engine/decisionPattern.ts'

function pattern(netScore: number): DecisionPattern {
  return {
    principledScore: Math.max(0, netScore),
    mercenaryScore: Math.max(0, -netScore),
    total: Math.abs(netScore),
    netScore,
    recentTrend: 'none',
    dominantTraits: [],
    isReformer: false,
  }
}

describe('frameNewsText', () => {
  it('returns unchanged text when no tokens present', () => {
    const out = frameNewsText('Hello world.', pattern(5), 1)
    expect(out).toBe('Hello world.')
  })

  it('substitutes ACTOR_ADJ for strong principled pattern', () => {
    const out = frameNewsText('A {ACTOR_ADJ} operative.', pattern(15), 0)
    expect(['anonymous', 'principled', 'careful']).toContain(
      out.replace(/A /, '').replace(/ operative\./, ''),
    )
  })

  it('substitutes ACTOR_ADJ for strong mercenary pattern', () => {
    const out = frameNewsText('A {ACTOR_ADJ} operative.', pattern(-15), 0)
    expect(['savage', 'merciless', 'vicious']).toContain(
      out.replace(/A /, '').replace(/ operative\./, ''),
    )
  })

  it('substitutes ACT_NOUN differently for opposite patterns', () => {
    const principled = frameNewsText('a {ACT_NOUN}', pattern(15), 0)
    const mercenary  = frameNewsText('a {ACT_NOUN}', pattern(-15), 0)
    expect(principled).not.toBe(mercenary)
  })

  it('is stable for same seed', () => {
    const a = frameNewsText('{ACTOR_ADJ} {ACT_NOUN}', pattern(5), 42)
    const b = frameNewsText('{ACTOR_ADJ} {ACT_NOUN}', pattern(5), 42)
    expect(a).toBe(b)
  })

  it('leaves unknown tokens verbatim', () => {
    const out = frameNewsText('{NOT_A_TOKEN} {ACTOR_ADJ}', pattern(0), 0)
    expect(out).toMatch(/^\{NOT_A_TOKEN\} /)
  })

  it('handles neutral pattern with the neutral bucket', () => {
    const out = frameNewsText('an {ACTOR_ADJ} attack', pattern(0), 0)
    expect(['anonymous', 'skilled', 'unattributed']).toContain(
      out.replace(/an /, '').replace(/ attack/, ''),
    )
  })
})

describe('frameNewsArticle', () => {
  it('frames both headline and body', () => {
    const out = frameNewsArticle(
      { headline: 'A {ACTOR_ADJ} strike.', body: 'It was a {WORK_TONE} operation.' },
      pattern(15),
      1,
    )
    expect(out.headline).not.toContain('{ACTOR_ADJ}')
    expect(out.body).not.toContain('{WORK_TONE}')
  })

  it('returns identical output for no-token input', () => {
    const out = frameNewsArticle({ headline: 'X', body: 'Y' }, pattern(0), 0)
    expect(out).toEqual({ headline: 'X', body: 'Y' })
  })
})
