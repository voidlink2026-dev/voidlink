import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import type { TraceStatus } from '@voidlink/core'
import styles from './TraceBar.module.css'

export interface TraceBarProps {
  level: number        // 0–100
  status: TraceStatus
  rate?: number        // effective %/s — shown as a rate indicator
  hopsRemaining?: number
  totalHops?: number
  className?: string
}

const STATUS_LABELS: Record<TraceStatus, string> = {
  clean: 'CLEAN',
  monitoring: 'MONITORING',
  tracing: 'TRACING',
  traced: 'TRACED',
  escaped: 'ESCAPED',
}

export function TraceBar({ level, status, rate, hopsRemaining, totalHops, className }: TraceBarProps) {
  const clampedLevel = Math.max(0, Math.min(100, level))
  const rateLabel = rate !== undefined ? `${rate.toFixed(1)}%/s` : null

  return (
    <div
      className={clsx(styles.container, styles[status], className)}
      role="meter"
      aria-valuenow={clampedLevel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Trace level: ${Math.round(clampedLevel)}%`}
    >
      <div className={styles.label}>
        <span className={styles.statusText}>{STATUS_LABELS[status]}</span>
        <div className={styles.labelRight}>
          {rateLabel && (
            <span className={clsx(styles.rate, rate! > 3 && styles.rateHigh)}>
              {rateLabel}
            </span>
          )}
          <span className={styles.percent}>{Math.round(clampedLevel)}%</span>
        </div>
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
      {totalHops !== undefined && totalHops > 0 && (
        <div className={styles.hopsRow} aria-label={`Bounce hops: ${hopsRemaining} of ${totalHops} remaining`}>
          {Array.from({ length: totalHops }).map((_, i) => {
            const burnedCount = totalHops - (hopsRemaining ?? 0)
            const burned = i < burnedCount
            const current = i === burnedCount
            return (
              <div
                key={i}
                className={`${styles.hop} ${burned ? styles.hopBurned : current ? styles.hopActive : styles.hopIdle}`}
                title={burned ? 'Hop burned' : current ? 'Active hop' : 'Standby'}
              />
            )
          })}
          <span className={styles.hopLabel}>
            {hopsRemaining}/{totalHops} HOP{totalHops !== 1 ? 'S' : ''}
          </span>
        </div>
      )}
    </div>
  )
}
