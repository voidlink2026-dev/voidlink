import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.ts'
import { getCodexEntry } from '@voidlink/core'
import styles from './CodexUnlockToast.module.css'

const AUTO_DISMISS_MS = 4000   // Playtester feedback: previous 8s was too long

export function CodexUnlockToast() {
  const queue           = useGameStore((s) => s.codexUnlockQueue)
  const dismissUnlock   = useGameStore((s) => s.dismissCodexUnlock)
  const openWindow      = useGameStore((s) => s.openWindow)
  const focusWindow     = useGameStore((s) => s.focusWindow)
  const setCodexFocusId = useGameStore((s) => s.setCodexFocusId)
  const activeWindows   = useGameStore((s) => s.activeWindows)

  // Auto-dismiss the head of the queue after timeout
  const head = queue[0]
  const [headId, setHeadId] = useState<string | null>(null)
  useEffect(() => {
    if (!head) return
    if (head === headId) return
    setHeadId(head)
    const t = setTimeout(() => dismissUnlock(head), AUTO_DISMISS_MS)
    return () => clearTimeout(t)
  }, [head, headId, dismissUnlock])

  function handleClick(id: string) {
    // Open or focus the Codex window
    if (!activeWindows.some((w) => w.id === 'codex')) {
      openWindow({
        id: 'codex', title: 'CODEX', component: 'CodexWindow',
        x: 280, y: 100, width: 880, height: 580, isMinimized: false,
      })
    } else {
      focusWindow('codex')
    }
    setCodexFocusId(id)
    dismissUnlock(id)
  }

  return (
    <div className={styles.root}>
      <AnimatePresence>
        {queue.slice(0, 3).map((id) => {
          const entry = getCodexEntry(id)
          if (!entry) return null
          return (
            <motion.div
              key={id}
              className={styles.toast}
              initial={{ x: 360, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 360, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={() => handleClick(id)}
            >
              <div className={styles.label}>NEW CODEX ENTRY</div>
              <div className={styles.title}>{entry.title}</div>
              <div className={styles.tagline}>{entry.tagline}</div>
              <div className={styles.hint}>Click to read · auto-dismiss in 4s · CODEX has the rest</div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
