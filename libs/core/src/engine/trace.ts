export type TraceStatus = 'clean' | 'monitoring' | 'tracing' | 'traced' | 'escaped'

export interface TraceState {
  level: number // 0–100
  status: TraceStatus
  speed: number // points per second, based on network + active admins
  lastUpdatedAt: number
  bounceCount: number // active proxy bounces reducing trace speed
}

const TRACE_STATUS_THRESHOLDS = {
  monitoring: 25,
  tracing: 60,
  traced: 100,
} as const

export function createTraceState(networkTraceSpeed: number): TraceState {
  return {
    level: 0,
    status: 'clean',
    speed: networkTraceSpeed,
    lastUpdatedAt: Date.now(),
    bounceCount: 0,
  }
}

export function tickTrace(state: TraceState, deltaMs: number): TraceState {
  const effectiveSpeed = computeEffectiveSpeed(state)
  const increment = (effectiveSpeed * deltaMs) / 1000
  const newLevel = Math.min(100, state.level + increment)
  const status = computeStatus(newLevel)

  return { ...state, level: newLevel, status, lastUpdatedAt: state.lastUpdatedAt + deltaMs }
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

function computeEffectiveSpeed(state: TraceState): number {
  const bouncePenalty = Math.pow(0.7, state.bounceCount)
  return state.speed * bouncePenalty
}

function computeStatus(level: number): TraceStatus {
  if (level >= TRACE_STATUS_THRESHOLDS.traced) return 'traced'
  if (level >= TRACE_STATUS_THRESHOLDS.tracing) return 'tracing'
  if (level >= TRACE_STATUS_THRESHOLDS.monitoring) return 'monitoring'
  return 'clean'
}
