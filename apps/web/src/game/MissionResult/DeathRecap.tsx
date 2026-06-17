import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.ts'
import styles from './DeathRecap.module.css'

// P5 — Death Recap. Renders the last 5 trace-impacting actions of the
// failed mission as a forensic walk-back. Each row shows the action label,
// the target node (if any), the trace level before, and the delta. Rows
// stagger-in from bottom-up so the most-recent action lands last and feels
// like the moment-of-no-return.

export function DeathRecap() {
  const traceActionLog = useGameStore((s) => s.traceActionLog)

  if (traceActionLog.length === 0) return null

  // Show the last 5 (oldest at top, newest at bottom).
  const recent = traceActionLog.slice(-5)
  const firstTs = recent[0]?.ts ?? Date.now()

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span className={styles.headerLabel}>HOW DID IT COME TO THIS</span>
        <span className={styles.headerSub}>last {recent.length} actions before TRACED</span>
      </div>

      <div className={styles.list}>
        {recent.map((entry, i) => {
          const delta = entry.traceAfter - entry.traceBefore
          const secondsBefore = ((entry.ts - firstTs) / 1000).toFixed(1)
          const willFinishHere = entry.traceAfter >= 100
          return (
            <motion.div
              key={entry.id}
              className={`${styles.row} ${willFinishHere ? styles.rowTerminal : ''}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12, duration: 0.25, ease: 'easeOut' }}
            >
              <div className={styles.rowTime}>T+{secondsBefore}s</div>
              <div className={styles.rowBody}>
                <span className={styles.rowAction}>{entry.action}</span>
                {entry.nodeLabel && <span className={styles.rowNode}> · {entry.nodeLabel}</span>}
              </div>
              <div className={styles.rowTrace}>
                <span className={styles.rowTraceBefore}>{entry.traceBefore.toFixed(1)}%</span>
                <span className={styles.rowTraceArrow}>→</span>
                <span className={`${styles.rowTraceAfter} ${willFinishHere ? styles.rowTraceAfterFatal : ''}`}>
                  {entry.traceAfter.toFixed(1)}%
                </span>
                <span className={styles.rowDelta}>+{delta.toFixed(1)}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className={styles.verdict}>
        {recent[recent.length - 1].traceAfter >= 100
          ? 'The last action put the trace over 100%. Whether the order was wrong or the order was inevitable is your call.'
          : 'Background trace accumulation finished what the last action started.'}
      </div>
    </div>
  )
}
