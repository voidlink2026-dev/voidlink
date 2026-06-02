import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.ts'
import { SPECIALIZATION_CATALOGUE } from '@voidlink/core'
import type { Specialization } from '@voidlink/core'
import styles from './SpecializationOverlay.module.css'

const TITLE_ID = 'spec-overlay-title'

export function SpecializationOverlay() {
  const pendingSpecialization = useGameStore((s) => s.pendingSpecialization)
  const chooseSpecialization = useGameStore((s) => s.chooseSpecialization)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (pendingSpecialization) {
      setTimeout(() => panelRef.current?.focus(), 350)
    }
  }, [pendingSpecialization])

  if (!pendingSpecialization) return null

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={TITLE_ID}
        tabIndex={-1}
        className={styles.panel}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3, ease: [0, 0, 0.2, 1] }}
      >
        <div className={styles.header}>
          <div className={styles.headerIcon} aria-hidden="true">◆</div>
          <div>
            <div id={TITLE_ID} className={styles.headerTitle}>RANK 5 ACHIEVED — ELITE</div>
            <div className={styles.headerSub}>Choose your specialization. This decision is permanent.</div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.grid} role="group" aria-label="Specialization options">
          {SPECIALIZATION_CATALOGUE.map((spec) => (
            <button
              key={spec.id}
              className={`${styles.card} ${styles[`card_${spec.id}`]}`}
              onClick={() => chooseSpecialization(spec.id as Specialization)}
              aria-label={`Choose ${spec.name}: ${spec.tagline}`}
            >
              <div className={styles.cardName}>{spec.name.toUpperCase()}</div>
              <div className={styles.cardTagline}>{spec.tagline}</div>
              <div className={styles.cardDesc}>{spec.description}</div>
              <ul className={styles.bonusList}>
                {spec.bonuses.map((b, i) => (
                  <li key={i} className={styles.bonusItem}>
                    <span className={styles.bonusDot} aria-hidden="true">▸</span>
                    {b}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
