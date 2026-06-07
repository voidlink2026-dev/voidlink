import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.ts'
import { getAchievement } from '@voidlink/core'
import styles from './AchievementUnlockToast.module.css'

const AUTO_DISMISS_MS = 7000

export function AchievementUnlockToast() {
  const queue   = useGameStore((s) => s.achievementUnlockQueue)
  const dismiss = useGameStore((s) => s.dismissAchievementUnlock)

  const head = queue[0]
  const [headId, setHeadId] = useState<string | null>(null)
  useEffect(() => {
    if (!head) return
    if (head === headId) return
    setHeadId(head)
    const t = setTimeout(() => dismiss(head), AUTO_DISMISS_MS)
    return () => clearTimeout(t)
  }, [head, headId, dismiss])

  return (
    <div className={styles.root}>
      <AnimatePresence>
        {queue.slice(0, 3).map((id) => {
          const entry = getAchievement(id)
          if (!entry) return null
          const tierClass = styles[`tier${entry.tier.charAt(0).toUpperCase()}${entry.tier.slice(1)}`]
          return (
            <motion.div
              key={id}
              className={styles.toast}
              initial={{ x: 380, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 380, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={() => dismiss(id)}
            >
              <div className={`${styles.label} ${tierClass}`}>
                <span>ACHIEVEMENT UNLOCKED</span>
                <span className={`${styles.tierChip} ${tierClass}`}>{entry.tier.toUpperCase()}</span>
              </div>
              <div className={styles.title}>{entry.title}</div>
              <div className={styles.description}>{entry.description}</div>
              <div className={styles.hint}>Click to dismiss · auto-dismiss in 7s</div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
