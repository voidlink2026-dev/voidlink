import { motion } from 'framer-motion'
import styles from './BootScreen.module.css'

const BOOT_LINES = [
  'UPLINK BIOS v2.1.0 © 2027 Uplink International',
  'Initializing secure kernel...',
  'Loading cryptographic modules........... OK',
  'Establishing anonymous routing layer.... OK',
  'Scanning hardware interfaces............ OK',
  'Mounting encrypted filesystem........... OK',
  'Starting network daemon................. OK',
  '',
  'UPLINK OPERATING SYSTEM v4.7.1',
  'All connections are anonymous. All actions are deniable.',
  '',
  'Loading user interface...',
]

export function BootScreen() {
  return (
    <motion.div
      className={styles.boot}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.lines}>
        {BOOT_LINES.map((line, i) => (
          <motion.div
            key={i}
            className={styles.line}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.15, duration: 0.05 }}
          >
            {line}
          </motion.div>
        ))}
        <motion.span
          className={styles.cursor}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ delay: BOOT_LINES.length * 0.15, repeat: Infinity, duration: 0.8 }}
        >
          _
        </motion.span>
      </div>
    </motion.div>
  )
}
