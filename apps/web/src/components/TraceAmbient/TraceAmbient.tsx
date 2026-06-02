import { useGameStore } from '../../store/gameStore.ts'
import styles from './TraceAmbient.module.css'

export function TraceAmbient() {
  const traceState = useGameStore((s) => s.traceState)
  const level = traceState?.level ?? 0

  if (level < 30) return null

  const danger = level >= 90
  const critical = level >= 97

  return (
    <div
      aria-hidden="true"
      className={`${styles.ambient} ${danger ? styles.danger : ''} ${critical ? styles.critical : ''}`}
      style={{ '--trace-level': level / 100 } as React.CSSProperties}
    >
      {danger && (
        <div className={styles.warningBanner}>
          {critical ? 'TRACE CRITICAL — DISCONNECT NOW' : 'TRACE IMMINENT — DISCONNECT NOW'}
        </div>
      )}
    </div>
  )
}
