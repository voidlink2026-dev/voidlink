import type { SecurityTier } from '../types/network.ts'

export type TraceStatus = 'clean' | 'monitoring' | 'tracing' | 'traced' | 'escaped'

export interface TraceState {
  level: number        // 0–100
  status: TraceStatus
  bounceCount: number  // active proxy hops (abstract +PROXY buttons)

  // Bounce routing hops — set from activeRoute length when mission starts
  hopsRemaining: number // how many physical bounce nodes remain before trace lands
  totalHops: number     // total hops in the route (for UI display N/N)

  // Rate components — all in %/second. Game store writes these before each tick.
  baseRate: number     // passive ambient from network difficulty (never changes mid-session)
  alarmRate: number    // temporary burst from a node breach
  alarmDecaysAt: number // absolute ms timestamp — alarm clears when nowMs >= this
  idsRate: number      // per unbreached IDS node present on network (+2.0%/s each)
  adminRate: number    // per active admin on network (+1.5%/s each)
  rivalRate: number    // rival hacker present (+1.0%/s)
  worldEventRate: number // net delta from active world events (can be negative)
}

const STATUS_THRESHOLDS = {
  monitoring: 25,
  tracing:    60,
  traced:     100,
} as const

// traceSpeed is the network's difficulty field (5–35).
// Dividing by 20 converts it to a comfortable %/s passive rate:
//   traceSpeed  5  → 0.25 %/s  (~7 min uninterrupted)
//   traceSpeed 15  → 0.75 %/s  (~2.2 min)
//   traceSpeed 35  → 1.75 %/s  (~57 s — but you should be using proxies)
export function createTraceState(networkTraceSpeed: number): TraceState {
  return {
    level: 0,
    status: 'clean',
    bounceCount: 0,
    hopsRemaining: 0,
    totalHops: 0,
    baseRate: networkTraceSpeed / 20,
    alarmRate: 0,
    alarmDecaysAt: 0,
    idsRate: 0,
    adminRate: 0,
    rivalRate: 0,
    worldEventRate: 0,
  }
}

// Pure tick. nowMs defaults to Date.now() in production; pass a fixed value in tests.
export function tickTrace(
  state: TraceState,
  deltaMs: number,
  nowMs: number = Date.now(),
): TraceState {
  const activeAlarm = nowMs < state.alarmDecaysAt ? state.alarmRate : 0
  const totalRate = Math.max(0, state.baseRate + activeAlarm + state.idsRate + state.adminRate + state.rivalRate + state.worldEventRate)
  const effectiveRate = totalRate * Math.pow(0.7, state.bounceCount)
  const newLevel = Math.min(100, state.level + effectiveRate * (deltaMs / 1000))

  return { ...state, level: newLevel, status: computeStatus(newLevel) }
}

// Called when a node is breached. Applies an immediate level spike and starts a
// temporary alarm rate that decays after ALARM_DURATION_MS.
const ALARM_DURATION_MS = 10_000

export function triggerBreachAlarm(
  state: TraceState,
  tier: SecurityTier,
  nowMs: number = Date.now(),
): TraceState {
  const spike = tier * 2            // +2% per tier (T1=+2%, T5=+10%)
  const boost = 1.0 + tier * 0.3   // alarm rate boost: T1=1.3%/s, T5=2.5%/s
  return {
    ...state,
    level: Math.min(100, state.level + spike),
    alarmRate: Math.max(state.alarmRate, boost),
    alarmDecaysAt: Math.max(state.alarmDecaysAt, nowMs + ALARM_DURATION_MS),
  }
}

export function applyProxyBounce(state: TraceState): TraceState {
  return { ...state, bounceCount: state.bounceCount + 1 }
}

export function removeProxyBounce(state: TraceState): TraceState {
  return { ...state, bounceCount: Math.max(0, state.bounceCount - 1) }
}

export function resetTrace(state: TraceState): TraceState {
  return { ...state, level: 0, status: 'clean' }
}

export function escapeTrace(state: TraceState): TraceState {
  return { ...state, level: 0, status: 'escaped' }
}

// Returns the current effective rate in %/s — useful for UI display.
export function computeEffectiveRate(
  state: TraceState,
  nowMs: number = Date.now(),
): number {
  const activeAlarm = nowMs < state.alarmDecaysAt ? state.alarmRate : 0
  const totalRate = Math.max(0, state.baseRate + activeAlarm + state.idsRate + state.adminRate + state.rivalRate + state.worldEventRate)
  return totalRate * Math.pow(0.7, state.bounceCount)
}

function computeStatus(level: number): TraceStatus {
  if (level >= STATUS_THRESHOLDS.traced)     return 'traced'
  if (level >= STATUS_THRESHOLDS.tracing)    return 'tracing'
  if (level >= STATUS_THRESHOLDS.monitoring) return 'monitoring'
  return 'clean'
}
