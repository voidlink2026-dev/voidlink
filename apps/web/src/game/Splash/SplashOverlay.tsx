import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.ts'
import { getSplashCard } from '@voidlink/core'
import { AudioEngine } from '../Audio/audioEngine.ts'
import { useSettingsStore } from '../../store/settingsStore.ts'
import styles from './SplashOverlay.module.css'

// Motif glyph per card. Cheap, atmospheric — pure unicode.
const MOTIF: Record<string, string> = {
  key:     '⚿',
  chain:   '⛓',
  globe:   '✺',
  eye:     '◉',
  cursor:  '█',
  lock:    '⌬',
  static:  '▒',
}

export function SplashOverlay() {
  const splash         = useGameStore((s) => s.pendingSplash)
  const dismissSplash  = useGameStore((s) => s.dismissSplash)
  const disabled       = useSettingsStore((s) => s.disableSplashCards)

  const card = splash ? getSplashCard(splash as Parameters<typeof getSplashCard>[0]) : null

  const close = useCallback(() => dismissSplash(), [dismissSplash])

  // Auto-dismiss after 12 seconds; SPACE/click/Escape skips
  useEffect(() => {
    if (!card) return
    AudioEngine.playSfx('success')
    const t = setTimeout(close, 12_000)
    function onKey(e: KeyboardEvent) {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
    }
  }, [card, close])

  // If splash cards are disabled in Settings, auto-dismiss any pending one
  // without rendering.
  useEffect(() => {
    if (splash && disabled) dismissSplash()
  }, [splash, disabled, dismissSplash])

  return (
    <AnimatePresence>
      {card && !disabled && (
        <motion.div
          className={styles.root}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={close}
        >
          <div className={styles.bg} />
          {card.motif === 'static' && <div className={styles.bgStatic} />}

          <motion.div
            className={styles.panel}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.12 }}
          >
            {card.motif && (
              <div className={styles.motif}>{MOTIF[card.motif] ?? '◆'}</div>
            )}
            <div className={styles.subtitle}>{card.subtitle}</div>
            <h1 className={styles.title}>{card.title}</h1>
            <div className={styles.body}>{card.body}</div>
          </motion.div>

          <div className={styles.skipHint}>
            <kbd>SPACE</kbd> or click to dismiss
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
