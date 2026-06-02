import { describe, it, expect } from 'vitest'
import {
  createTraceState,
  tickTrace,
  triggerBreachAlarm,
  applyProxyBounce,
  removeProxyBounce,
  resetTrace,
  escapeTrace,
} from './trace.ts'
import type { TraceState } from './trace.ts'

// Helper — override specific rate fields for isolated tests
function withRates(overrides: Partial<TraceState>): TraceState {
  return { ...createTraceState(0), ...overrides }
}

// ─── createTraceState ────────────────────────────────────────────────────────

describe('createTraceState', () => {
  it('starts at level 0, status clean, no active rates', () => {
    const s = createTraceState(20)
    expect(s.level).toBe(0)
    expect(s.status).toBe('clean')
    expect(s.bounceCount).toBe(0)
    expect(s.idsRate).toBe(0)
    expect(s.adminRate).toBe(0)
    expect(s.rivalRate).toBe(0)
    expect(s.alarmRate).toBe(0)
  })

  it('converts networkTraceSpeed to a slow base %/s rate', () => {
    // traceSpeed 20 → 1.0 %/s (100s to full trace passively)
    expect(createTraceState(20).baseRate).toBeCloseTo(1.0)
    // traceSpeed 5 → 0.25 %/s (easy network — ~7 min passive)
    expect(createTraceState(5).baseRate).toBeCloseTo(0.25)
    // traceSpeed 35 → 1.75 %/s (hard network)
    expect(createTraceState(35).baseRate).toBeCloseTo(1.75)
  })
})

// ─── tickTrace — base rate ───────────────────────────────────────────────────

describe('tickTrace — base rate', () => {
  it('accumulates level at baseRate per second', () => {
    const s = withRates({ baseRate: 2.0 })
    const ticked = tickTrace(s, 1000, 0)
    expect(ticked.level).toBeCloseTo(2.0)
  })

  it('caps level at 100', () => {
    const s = withRates({ baseRate: 999 })
    const ticked = tickTrace(s, 1000, 0)
    expect(ticked.level).toBe(100)
  })

  it('is immutable — does not mutate original state', () => {
    const s = withRates({ baseRate: 5.0 })
    tickTrace(s, 2000, 0)
    expect(s.level).toBe(0)
  })

  it('status: clean → monitoring at 25', () => {
    // Need 25% in 1s → baseRate=25
    const ticked = tickTrace(withRates({ baseRate: 25 }), 1000, 0)
    expect(ticked.status).toBe('monitoring')
  })

  it('status: monitoring → tracing at 60', () => {
    const ticked = tickTrace(withRates({ baseRate: 60 }), 1000, 0)
    expect(ticked.status).toBe('tracing')
  })

  it('status: tracing → traced at 100', () => {
    const ticked = tickTrace(withRates({ baseRate: 100 }), 1000, 0)
    expect(ticked.status).toBe('traced')
  })
})

// ─── tickTrace — IDS / admin / rival rates ───────────────────────────────────

describe('tickTrace — contextual rates', () => {
  it('IDS rate adds to effective rate', () => {
    const s = withRates({ idsRate: 3.0 })
    const ticked = tickTrace(s, 1000, 0)
    expect(ticked.level).toBeCloseTo(3.0)
  })

  it('admin rate adds to effective rate', () => {
    const s = withRates({ adminRate: 1.5 })
    const ticked = tickTrace(s, 1000, 0)
    expect(ticked.level).toBeCloseTo(1.5)
  })

  it('rival rate adds to effective rate', () => {
    const s = withRates({ rivalRate: 1.0 })
    const ticked = tickTrace(s, 1000, 0)
    expect(ticked.level).toBeCloseTo(1.0)
  })

  it('all components stack additively before dampening', () => {
    // base=1 + IDS=2 + admin=1.5 + rival=1 = 5.5 %/s total
    const s = withRates({ baseRate: 1.0, idsRate: 2.0, adminRate: 1.5, rivalRate: 1.0 })
    const ticked = tickTrace(s, 1000, 0)
    expect(ticked.level).toBeCloseTo(5.5)
  })
})

// ─── triggerBreachAlarm ──────────────────────────────────────────────────────

describe('triggerBreachAlarm', () => {
  it('applies immediate level spike scaled by tier', () => {
    const s = createTraceState(0)
    const tier1 = triggerBreachAlarm(s, 1, 0)
    const tier3 = triggerBreachAlarm(s, 3, 0)
    expect(tier1.level).toBeCloseTo(2)   // tier 1 → +2%
    expect(tier3.level).toBeCloseTo(6)   // tier 3 → +6%
  })

  it('sets alarmRate and alarmDecaysAt', () => {
    const s = createTraceState(0)
    const alarmed = triggerBreachAlarm(s, 2, 1000)
    expect(alarmed.alarmRate).toBeGreaterThan(0)
    expect(alarmed.alarmDecaysAt).toBe(11_000) // now=1000 + 10s window
  })

  it('alarm rate contributes during the alarm window', () => {
    const s = createTraceState(0)
    const alarmed = triggerBreachAlarm(s, 2, 0) // alarm active 0–10000ms
    const during = tickTrace(alarmed, 1000, 5000) // nowMs=5000, inside window
    expect(during.level).toBeGreaterThan(alarmed.level)
  })

  it('alarm rate does not contribute after alarmDecaysAt', () => {
    const s = createTraceState(0)
    const alarmed = triggerBreachAlarm(s, 2, 0) // alarmDecaysAt = 10000
    const levelAfterSpike = alarmed.level

    // tick with nowMs after alarm has decayed — no alarm boost, no base rate
    const after = tickTrace(alarmed, 1000, 15_000)
    expect(after.level).toBeCloseTo(levelAfterSpike) // only baseRate=0 applies
  })

  it('stacks multiple alarms — takes the larger alarmRate and furthest decayAt', () => {
    const s = createTraceState(0)
    const first  = triggerBreachAlarm(s, 1, 0)   // small alarm
    const second = triggerBreachAlarm(first, 5, 2000) // larger alarm at t=2000
    expect(second.alarmRate).toBeGreaterThan(first.alarmRate)
    expect(second.alarmDecaysAt).toBe(12_000) // t=2000 + 10s
  })

  it('does not exceed level 100 even from a high-tier spike', () => {
    const s = { ...createTraceState(0), level: 98 }
    const alarmed = triggerBreachAlarm(s, 5, 0) // +10% spike
    expect(alarmed.level).toBe(100)
  })
})

// ─── proxy bounces ───────────────────────────────────────────────────────────

describe('proxy bounces', () => {
  it('each bounce reduces effective rate by 30%', () => {
    const s = withRates({ baseRate: 10 })
    const bounced = applyProxyBounce(s)
    const ticked = tickTrace(bounced, 1000, 0)
    expect(ticked.level).toBeCloseTo(7.0) // 10 * 0.7
  })

  it('three bounces stack multiplicatively', () => {
    let s = withRates({ baseRate: 10 })
    s = applyProxyBounce(s)
    s = applyProxyBounce(s)
    s = applyProxyBounce(s)
    const ticked = tickTrace(s, 1000, 0)
    expect(ticked.level).toBeCloseTo(3.43, 1) // 10 * 0.7^3
  })

  it('dampening applies to the combined total of all rates', () => {
    // base=2 + IDS=4 = 6 total; one bounce → 6 * 0.7 = 4.2
    const s = applyProxyBounce(withRates({ baseRate: 2, idsRate: 4 }))
    const ticked = tickTrace(s, 1000, 0)
    expect(ticked.level).toBeCloseTo(4.2)
  })

  it('removeProxyBounce decrements, minimum 0', () => {
    const s = createTraceState(10)
    expect(removeProxyBounce(s).bounceCount).toBe(0)

    const withOne = applyProxyBounce(s)
    expect(removeProxyBounce(withOne).bounceCount).toBe(0)
  })
})

// ─── resetTrace / escapeTrace ────────────────────────────────────────────────

describe('resetTrace', () => {
  it('resets level to 0 and status to clean, preserves baseRate', () => {
    let s = withRates({ baseRate: 5 })
    s = tickTrace(s, 30_000, 0)
    const reset = resetTrace(s)
    expect(reset.level).toBe(0)
    expect(reset.status).toBe('clean')
    expect(reset.baseRate).toBe(5)
  })
})

describe('escapeTrace', () => {
  it('sets level to 0 and status to escaped', () => {
    let s = withRates({ baseRate: 5 })
    s = tickTrace(s, 30_000, 0)
    const escaped = escapeTrace(s)
    expect(escaped.level).toBe(0)
    expect(escaped.status).toBe('escaped')
  })
})

// ─── real-world scenario ─────────────────────────────────────────────────────

describe('real-world scenario', () => {
  it('government network (traceSpeed 30) with IDS + admin: proxies are essential', () => {
    // Without proxies: base 1.5 + IDS 2.0 + admin 1.5 = 5.0 %/s → full trace in 20s
    const noProxy = withRates({ baseRate: 1.5, idsRate: 2.0, adminRate: 1.5 })
    const after20s = tickTrace(noProxy, 20_000, 0)
    expect(after20s.level).toBeCloseTo(100)

    // With 2 proxies: 5.0 * 0.49 ≈ 2.45 %/s → ~41s to full trace
    let withProxy = applyProxyBounce(applyProxyBounce(noProxy))
    const after20sWithProxy = tickTrace(withProxy, 20_000, 0)
    expect(after20sWithProxy.level).toBeCloseTo(49, 0) // ≈ 49% after 20s — still in it
  })

  it('easy network (traceSpeed 5) passive only: ~400s to full trace', () => {
    const s = createTraceState(5) // baseRate 0.25 %/s
    const after200s = tickTrace(s, 200_000, 0)
    expect(after200s.level).toBeCloseTo(50) // halfway after 200s
  })
})
