import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import type { TraceStatus } from '@uplink/core'
import styles from './TraceBar.module.css'

export interface TraceBarProps {
  level: number       // 0–100
  status: TraceStatus
  className?: string
}

const STATUS_LABELS: Record<TraceStatus, string> = {
  clean: 'CLEAN',
  monitoring: 'MONITORING',
  tracing: 'TRACING',
  traced: 'TRACED',
  escaped: 'ESCAPED',
}

export function TraceBar({ level, status, className }: TraceBarProps) {
  const clampedLevel = Math.max(0, Math.min(100, level))

  return (
    <div className={clsx(styles.container, styles[status], className)} role="meter" aria-valuenow={clampedLevel} aria-valuemin={0} aria-valuemax={100} aria-label={`Trace level: ${Math.round(clampedLevel)}%`}>
      <div className={styles.label}>
        <span className={styles.statusText}>{STATUS_LABELS[status]}</span>
        <span className={styles.percent}>{Math.round(clampedLevel)}%</span>
      </div>
      <div className={styles.track}>
        <motion.div
          className={styles.fill}
          initial={false}
          animate={{ width: `${clampedLevel}%` }}
          transition={{ duration: 0.3, ease: 'linear' }}
        />
        {/* Threshold markers */}
        <div className={styles.marker} style={{ left: '25%' }} aria-hidden="true" />
        <div className={styles.marker} style={{ left: '60%' }} aria-hidden="true" />
      </div>
      {status === 'traced' && (
        <div className={styles.tracedAlert} role="alert">
          TRACE COMPLETE — DISCONNECT NOW
        </div>
      )}
    </div>
  )
}
