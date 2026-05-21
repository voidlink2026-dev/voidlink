import { describe, it, expect } from 'vitest'
import {
  createTraceState,
  tickTrace,
  applyProxyBounce,
  removeProxyBounce,
  resetTrace,
  escapeTrace,
} from './trace.ts'

describe('createTraceState', () => {
  it('starts at level 0, status clean', () => {
    const s = createTraceState(20)
    expect(s.level).toBe(0)
    expect(s.status).toBe('clean')
    expect(s.speed).toBe(20)
    expect(s.bounceCount).toBe(0)
  })
})

describe('tickTrace', () => {
  it('accumulates level proportionally to speed and delta', () => {
    const s = createTraceState(10) // 10 pts/s
    const ticked = tickTrace(s, 1000) // 1 second
    expect(ticked.level).toBeCloseTo(10)
  })

  it('caps level at 100', () => {
    const s = createTraceState(999)
    const ticked = tickTrace(s, 1000)
    expect(ticked.level).toBe(100)
  })

  it('transitions status: clean → monitoring at 25', () => {
    const s = createTraceState(100)
    const ticked = tickTrace(s, 250) // 25 pts
    expect(ticked.status).toBe('monitoring')
  })

  it('transitions status: monitoring → tracing at 60', () => {
    const s = createTraceState(100)
    const ticked = tickTrace(s, 600) // 60 pts
    expect(ticked.status).toBe('tracing')
  })

  it('transitions status: tracing → traced at 100', () => {
    const s = createTraceState(100)
    const ticked = tickTrace(s, 1000) // 100 pts
    expect(ticked.status).toBe('traced')
  })

  it('does not modify the original state (immutable)', () => {
    const s = createTraceState(20)
    tickTrace(s, 1000)
    expect(s.level).toBe(0)
  })
})

describe('proxy bounces', () => {
  it('each bounce reduces effective speed by 30%', () => {
    const base = createTraceState(10)
    const one = applyProxyBounce(base)
    const ticked = tickTrace(one, 1000)
    // 10 * 0.7^1 = 7 pts in 1s
    expect(ticked.level).toBeCloseTo(7)
  })

  it('three bounces stack multiplicatively', () => {
    let s = createTraceState(10)
    s = applyProxyBounce(s)
    s = applyProxyBounce(s)
    s = applyProxyBounce(s)
    const ticked = tickTrace(s, 1000)
    // 10 * 0.7^3 ≈ 3.43 pts
    expect(ticked.level).toBeCloseTo(3.43, 1)
  })

  it('removeProxyBounce decrements bounceCount, minimum 0', () => {
    const s = createTraceState(10)
    const removed = removeProxyBounce(s)
    expect(removed.bounceCount).toBe(0)

    const withOne = applyProxyBounce(s)
    const removedOne = removeProxyBounce(withOne)
    expect(removedOne.bounceCount).toBe(0)
  })
})

describe('resetTrace', () => {
  it('resets level to 0 and status to clean', () => {
    let s = createTraceState(50)
    s = tickTrace(s, 2000) // push to 100
    const reset = resetTrace(s)
    expect(reset.level).toBe(0)
    expect(reset.status).toBe('clean')
    expect(reset.speed).toBe(50) // speed preserved
  })
})

describe('escapeTrace', () => {
  it('sets level to 0 and status to escaped', () => {
    let s = createTraceState(50)
    s = tickTrace(s, 2000)
    const escaped = escapeTrace(s)
    expect(escaped.level).toBe(0)
    expect(escaped.status).toBe('escaped')
  })
})
