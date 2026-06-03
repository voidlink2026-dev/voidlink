// Global world clock — M14h.5.
//
// Single shared in-game time used by every player. Anchored so that
// real-world 2026-01-01T00:00:00Z corresponds to game 2199-01-01T00:00:00Z;
// from there the game advances 1:1 with real time.
//
// This lets future multiplayer features (events, world bosses, market open
// hours, scheduled drops) target one universal "VOIDLINK STANDARD TIME"
// (VST) instead of per-player session time. When we wire up an authoritative
// server later, replace `Date.now()` here with an NTP-synced offset; every
// consumer of `getWorldClockMs()` will then automatically agree.

const REAL_ANCHOR_MS = new Date('2026-01-01T00:00:00.000Z').getTime()
const GAME_ANCHOR_MS = new Date('2199-01-01T00:00:00.000Z').getTime()

/** Returns the current world game-time as a millisecond Date value. */
export function getWorldClockMs(nowMs: number = Date.now()): number {
  return GAME_ANCHOR_MS + (nowMs - REAL_ANCHOR_MS)
}

/** Format world time as DD.MMM.YYYY HH:MM:SS (UTC). */
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
export function formatWorldClock(nowMs: number = Date.now()): string {
  const d = new Date(getWorldClockMs(nowMs))
  const dd  = String(d.getUTCDate()).padStart(2, '0')
  const mon = MONTHS[d.getUTCMonth()]
  const yr  = d.getUTCFullYear()
  const hh  = String(d.getUTCHours()).padStart(2, '0')
  const mm  = String(d.getUTCMinutes()).padStart(2, '0')
  const ss  = String(d.getUTCSeconds()).padStart(2, '0')
  return `${dd}.${mon}.${yr} ${hh}:${mm}:${ss}`
}
