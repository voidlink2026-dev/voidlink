import { useEffect, useRef, useState } from 'react'
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
  /** Optional accent colour override (faction tinting). When set, the
   *  bar's threshold-aware status colour is mixed with this hue. */
  accent?: string
}

const STATUS_LABELS: Record<TraceStatus, string> = {
  clean: 'CLEAN',
  monitoring: 'MONITORING',
  tracing: 'TRACING',
  traced: 'TRACED',
  escaped: 'ESCAPED',
}

const CELLS = 24
const THRESHOLDS = [30, 60, 75, 90] as const

export function TraceBar({ level, status, rate, hopsRemaining, totalHops, className, accent }: TraceBarProps) {
  const clampedLevel = Math.max(0, Math.min(100, level))
  const rateLabel = rate !== undefined ? `${rate.toFixed(1)}%/s` : null

  // Threshold crossing detection — fire a brief spark animation when the
  // bar crosses a major threshold (30/60/75/90/100). The spark is a CSS
  // class that adds an outline pulse for ~400ms.
  const prevLevelRef = useRef(clampedLevel)
  const [crossedFlash, setCrossedFlash] = useState<number | null>(null)
  useEffect(() => {
    const prev = prevLevelRef.current
    if (clampedLevel > prev) {
      for (const t of [...THRESHOLDS, 100]) {
        if (prev < t && clampedLevel >= t) {
          setCrossedFlash(t)
          window.setTimeout(() => setCrossedFlash(null), 420)
          break
        }
      }
    }
    prevLevelRef.current = clampedLevel
  }, [clampedLevel])

  // Determine intensity tier — drives the more dramatic pulse above 75%.
  const intensity =
    clampedLevel >= 90 ? 'critical' :
    clampedLevel >= 75 ? 'alarm' :
    clampedLevel >= 60 ? 'tracing' :
    clampedLevel >= 30 ? 'monitoring' :
    'clean'

  return (
    <div
      className={clsx(
        styles.container,
        styles[status],
        styles[`intensity_${intensity}`],
        crossedFlash !== null && styles[`flash_${crossedFlash}`],
        className,
      )}
      role="meter"
      aria-valuenow={clampedLevel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Trace level: ${Math.round(clampedLevel)}%`}
      style={accent ? ({ '--trace-accent': accent } as React.CSSProperties) : undefined}
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
        {/* Segmented fill — 24 cells. Each cell either filled, partially
            filled (the one at the level boundary), or empty. */}
        <div className={styles.cells} aria-hidden="true">
          {Array.from({ length: CELLS }).map((_, i) => {
            const cellStart = (i / CELLS) * 100
            const cellEnd = ((i + 1) / CELLS) * 100
            const filled = clampedLevel >= cellEnd
            const partial = !filled && clampedLevel > cellStart
            const partialPct = partial ? ((clampedLevel - cellStart) / (cellEnd - cellStart)) * 100 : 0
            return (
              <div
                key={i}
                className={clsx(
                  styles.cell,
                  filled && styles.cellFilled,
                  partial && styles.cellPartial,
                )}
                style={partial ? ({ '--cell-fill': `${partialPct}%` } as React.CSSProperties) : undefined}
              />
            )
          })}
        </div>

        {/* Threshold markers — vertical ticks above the bar */}
        {THRESHOLDS.map((t) => (
          <div
            key={t}
            className={clsx(styles.marker, t >= 75 && styles.markerCritical)}
            style={{ left: `${t}%` }}
            aria-hidden="true"
          >
            <span className={styles.markerLabel}>{t}</span>
          </div>
        ))}
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
