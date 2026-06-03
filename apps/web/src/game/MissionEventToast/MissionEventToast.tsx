import { useEffect, useState, useRef } from 'react'
import { useGameStore } from '../../store/gameStore.ts'
import { AudioEngine } from '../Audio/audioEngine.ts'
import styles from './MissionEventToast.module.css'

// M14n — Surfaces mission runtime events as prominent on-screen banners.
// Watches the active mission's firedEventIds — when a new one appears, we display
// the corresponding event message for ~6 seconds.

interface ActiveToast {
  id: string
  message: string
  severity: 'good' | 'bad' | 'neutral'
  expiresAt: number
}

export function MissionEventToast() {
  const activeMissionId = useGameStore((s) => s.activeMissionId)
  const missions = useGameStore((s) => s.missions)
  const [toasts, setToasts] = useState<ActiveToast[]>([])
  const seenIdsRef = useRef<Set<string>>(new Set())

  const mission = missions.find((m) => m.id === activeMissionId)

  // Reset seen-set when mission changes (so on next mission, events fire again)
  useEffect(() => {
    seenIdsRef.current = new Set()
    setToasts([])
  }, [activeMissionId])

  // Watch firedEventIds for new entries
  useEffect(() => {
    if (!mission?.firedEventIds || !mission.events) return
    const fresh: ActiveToast[] = []
    for (const eid of mission.firedEventIds) {
      if (seenIdsRef.current.has(eid)) continue
      seenIdsRef.current.add(eid)
      const evt = mission.events.find((e) => e.id === eid)
      if (!evt) continue
      // Determine severity by effect
      const delta = evt.effect?.type === 'raise_trace_speed' ? evt.effect.delta : 0
      const severity: ActiveToast['severity'] = delta < 0
        ? 'good'
        : delta > 0.5 || evt.effect?.type === 'spawn_rival_hacker'
          ? 'bad'
          : 'neutral'
      fresh.push({
        id: eid,
        message: evt.message,
        severity,
        expiresAt: Date.now() + 6000,
      })
      AudioEngine.playSfx(severity === 'good' ? 'tick' : severity === 'bad' ? 'error' : 'click')
    }
    if (fresh.length > 0) {
      setToasts((cur) => [...cur, ...fresh])
    }
  }, [mission?.firedEventIds, mission?.events])

  // Expire toasts
  useEffect(() => {
    if (toasts.length === 0) return
    const interval = setInterval(() => {
      const now = Date.now()
      setToasts((cur) => cur.filter((t) => t.expiresAt > now))
    }, 250)
    return () => clearInterval(interval)
  }, [toasts.length])

  if (toasts.length === 0) return null

  return (
    <div className={styles.stack} aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${styles.toast} ${styles[`severity_${t.severity}`]}`}
          role="status"
        >
          <span className={styles.tag}>
            {t.severity === 'good'    ? '◆ INTEL'
            : t.severity === 'bad'   ? '⚠ ALERT'
            :                          'EVENT'}
          </span>
          <span className={styles.message}>{t.message}</span>
        </div>
      ))}
    </div>
  )
}
