import { useEffect, useState } from 'react'
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

const TEXT_DELAY = 0.4   // seconds before first boot line — quicker entry
const LINE_INTERVAL = 0.15

// V6 — Generate a short row of random hex bytes for the texture noise lines.
// Deterministic seed lets us memoise / freeze on first render.
function hexNoise(seed: number, len = 56): string {
  const chars = '0123456789ABCDEF '
  let h = seed
  const out: string[] = []
  for (let i = 0; i < len; i++) {
    h = (h * 1103515245 + 12345) >>> 0
    out.push(chars[h % chars.length])
  }
  return out.join('')
}

export function BootScreen() {
  // V6 — Glitch character that briefly flickers on the cursor line every ~2s.
  const [glitch, setGlitch] = useState(false)
  useEffect(() => {
    const tick = () => {
      setGlitch(true)
      window.setTimeout(() => setGlitch(false), 70)
    }
    const id = window.setInterval(tick, 2400)
    return () => window.clearInterval(id)
  }, [])

  return (
    <motion.main
      className={styles.boot}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(6px)' }}
      transition={{ duration: 0.5 }}
    >
      <GlyphDrift opacity={0.85} density={1.6} />

      {/* V6 — CRT power-on flash: bright horizontal sweep on first paint */}
      <motion.div
        className={styles.crtSweep}
        initial={{ opacity: 1, scaleY: 0.02 }}
        animate={{ opacity: 0, scaleY: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        aria-hidden="true"
      />

      {/* V6 — exit scanline-wipe: a horizontal bar sweeps top→bottom when
          we leave the boot screen for the prologue */}
      <motion.div
        className={styles.exitWipe}
        initial={{ opacity: 0, top: '-10%' }}
        exit={{ opacity: [0, 0.9, 0], top: '110%' }}
        transition={{ duration: 0.5, ease: 'easeIn' }}
        aria-hidden="true"
      />

      <div className={styles.lines}>
        {/* V6 — atmospheric hex noise lines at the top */}
        <motion.div
          className={styles.noiseLine}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.18 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          aria-hidden="true"
        >
          {hexNoise(0xdead, 72)}
        </motion.div>
        <motion.div
          className={styles.noiseLine}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ delay: 0.12, duration: 0.4 }}
          aria-hidden="true"
        >
          {hexNoise(0xbeef, 72)}
        </motion.div>

        {BOOT_LINES.map((line, i) => (
          <motion.div
            key={i}
            className={`${styles.line} ${line.startsWith('VOIDLINK') ? styles.lineHeader : ''}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: TEXT_DELAY + i * LINE_INTERVAL, duration: 0.06 }}
          >
            {line}
          </motion.div>
        ))}

        <div className={styles.cursorRow}>
          <motion.span
            className={styles.cursor}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              delay: TEXT_DELAY + BOOT_LINES.length * LINE_INTERVAL,
              repeat: Infinity,
              duration: 0.7,
            }}
            aria-hidden="true"
          >
            █
          </motion.span>
          {/* V6 — glitch flicker — occasionally shows a corrupt character */}
          {glitch && (
            <span className={styles.glitch} aria-hidden="true">
              ▓
            </span>
          )}
        </div>

        {/* V6 — closing noise line at the bottom */}
        <motion.div
          className={styles.noiseLine}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12 }}
          transition={{ delay: TEXT_DELAY + BOOT_LINES.length * LINE_INTERVAL + 0.3, duration: 0.4 }}
          aria-hidden="true"
        >
          {hexNoise(0xc0de, 72)}
        </motion.div>
      </div>
    </motion.main>
  )
}
