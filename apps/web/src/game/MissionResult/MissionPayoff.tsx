import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Mission } from '@voidlink/core'
import styles from './MissionPayoff.module.css'

// V7 — Per-mission-type "payoff" micro-cinematic. ~2.5s of in-fiction
// detail after a successful mission — file checksum, struck-through name,
// corrupted hex dump, etc. — before the standard rewards block lands.

interface MissionPayoffProps {
  mission: Mission
}

// Deterministic hex/random helpers
function pseudoHash(seed: string, len = 16): string {
  let h = 5381
  for (const c of seed) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0
  const out: string[] = []
  for (let i = 0; i < len; i++) {
    h = (h * 1103515245 + 12345) >>> 0
    out.push('0123456789abcdef'[h % 16])
  }
  return out.join('')
}

function hexBlock(seed: string, rows: number, cols: number): string[] {
  let h = 0
  for (const c of seed) h = ((h * 31) + c.charCodeAt(0)) >>> 0
  const out: string[] = []
  for (let r = 0; r < rows; r++) {
    const row: string[] = []
    for (let c = 0; c < cols; c++) {
      h = (h * 1103515245 + 12345) >>> 0
      row.push(('00' + (h % 256).toString(16)).slice(-2).toUpperCase())
    }
    out.push(row.join(' '))
  }
  return out
}

export function MissionPayoff({ mission }: MissionPayoffProps) {
  // Reveal animation — text appears character-by-character / row-by-row
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setShown(true), 120)
    return () => window.clearTimeout(id)
  }, [])

  if (mission.type === 'file_theft') {
    // Find the target file in the mission objectives or just synthesize one
    const fileObj = mission.objectives.find((o) => 'targetFileId' in o)
    const fileName = fileObj && 'targetFileId' in fileObj && fileObj.targetFileId
      ? String(fileObj.targetFileId).replace(/^f_/, '').replace(/_/g, '_') + '.enc'
      : 'archive.tar.enc'
    const sizeKb = (pseudoHash(mission.id + 'size', 4).charCodeAt(0) % 90) * 12 + 64
    const sha256 = pseudoHash(mission.id, 16)
    return (
      <div className={styles.root}>
        <div className={styles.label}>FILE RECEIVED</div>
        <div className={styles.fileRow}>
          <span className={styles.fileIcon} aria-hidden="true">▤</span>
          <div className={styles.fileBody}>
            <div className={styles.fileName}>{fileName}</div>
            <div className={styles.fileMeta}>
              <span>{sizeKb.toLocaleString()} KB</span>
              <span className={styles.fileMetaDim}>·</span>
              <span>SHA-256: {sha256}…</span>
            </div>
          </div>
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.25, type: 'spring' }}
            className={styles.fileCheck}
            aria-label="received"
          >✓</motion.span>
        </div>
      </div>
    )
  }

  if (mission.type === 'account_deletion') {
    const seed = mission.id.slice(-6)
    const username = `user_${seed}`
    return (
      <div className={styles.root}>
        <div className={styles.label}>ACCOUNT REMOVED FROM RECORD</div>
        <div className={styles.accountRow}>
          <span className={styles.accountIcon} aria-hidden="true">◯</span>
          <motion.span
            className={styles.accountName}
            initial={{ filter: 'blur(0px)' }}
            animate={{ filter: 'blur(0px)' }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <span className={styles.struck}>{username}</span>
          </motion.span>
          <span className={styles.accountStatus}>DELETED</span>
        </div>
        <div className={styles.accountSub}>No backups. No recovery vector. The audit log entry has been over-written by a routine maintenance event.</div>
      </div>
    )
  }

  if (mission.type === 'database_corruption') {
    const rows = hexBlock(mission.id, 4, 12)
    return (
      <div className={styles.root}>
        <div className={styles.label}>DATABASE CORRUPTED</div>
        <pre className={styles.hexDump} aria-hidden="true">
          {rows.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 0.85, x: 0 }}
              transition={{ delay: 0.2 + i * 0.07, duration: 0.15 }}
            >
              <span className={styles.hexAddr}>{(i * 16).toString(16).padStart(4, '0').toUpperCase()}:</span> {row}
            </motion.div>
          ))}
        </pre>
        <div className={styles.accountSub}>Reads as hardware failure to forensic review. Integrity hashes invalid. Restore from backup will fail — backups are corrupted too.</div>
      </div>
    )
  }

  if (mission.type === 'network_sabotage') {
    return (
      <div className={styles.root}>
        <div className={styles.label}>TARGET INFRASTRUCTURE — STATUS</div>
        <div className={styles.sabotageRow}>
          <motion.div
            className={styles.sabotageBadge}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3, type: 'spring' }}
          >
            DOWN
          </motion.div>
          <div className={styles.sabotageSub}>
            Routing layer offline. Reads as a power-supply fault on the upstream switch. Expected MTTR: 6–9 hours.
          </div>
        </div>
      </div>
    )
  }

  if (mission.type === 'bounty_hunt') {
    const targetHandle = mission.briefing.subject.match(/\b([A-Z][A-Za-z0-9_]+)\b/)?.[1] ?? 'TARGET'
    return (
      <div className={styles.root}>
        <div className={styles.label}>BOUNTY RESOLVED</div>
        <div className={styles.accountRow}>
          <span className={styles.accountIcon} aria-hidden="true">◉</span>
          <motion.span
            className={styles.accountName}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <span className={styles.struck}>{targetHandle}</span>
          </motion.span>
          <span className={styles.accountStatus}>SETTLED</span>
        </div>
        <div className={styles.accountSub}>Bounty issuer notified. Arbitration sealed. The Mesh will not formally acknowledge this transaction.</div>
      </div>
    )
  }

  // Fallback for any unhandled mission type — silent (the rewards block follows)
  void shown
  return null
}
