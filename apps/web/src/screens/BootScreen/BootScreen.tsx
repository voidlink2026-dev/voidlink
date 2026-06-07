import { motion } from 'framer-motion'
import { GlyphDrift } from '../../components/GlyphDrift/GlyphDriftLazy.tsx'
import styles from './BootScreen.module.css'

const BOOT_LINES = [
  'VOIDLINK BIOS v2.1.0 — Internic-licensed routing — © 2199 Voidlink International, Geneva',
  'Initializing secure kernel...',
  'Loading cryptographic modules........... OK',
  'Establishing anonymous routing layer.... OK',
  'Scanning hardware interfaces............ OK',
  'Mounting encrypted filesystem........... OK',
  'Starting network daemon................. OK',
  '',
  'VOIDLINK OS v4.7.1',
  'All connections are anonymous. All actions are deniable.',
  '',
  'Loading user interface...',
]

const TEXT_DELAY = 1.6  // seconds before first boot line

export function BootScreen() {
  return (
    <motion.main
      className={styles.boot}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(4px)' }}
      transition={{ duration: 0.5 }}
    >
      <GlyphDrift opacity={0.85} density={1.6} />

      <div className={styles.lines}>
        {BOOT_LINES.map((line, i) => (
          <motion.div
            key={i}
            className={`${styles.line} ${line.startsWith('VOIDLINK') ? styles.lineHeader : ''}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: TEXT_DELAY + i * 0.13, duration: 0.06 }}
          >
            {line}
          </motion.div>
        ))}
        <motion.span
          className={styles.cursor}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            delay: TEXT_DELAY + BOOT_LINES.length * 0.13,
            repeat: Infinity,
            duration: 0.7,
          }}
          aria-hidden="true"
        >
          █
        </motion.span>
      </div>
    </motion.main>
  )
}
