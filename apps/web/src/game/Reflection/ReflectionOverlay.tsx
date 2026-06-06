import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore.ts'
import { buildReflectionText, getDecisionPattern } from '@voidlink/core'
import type { ReflectionTrigger } from '@voidlink/core'
import { AudioEngine } from '../Audio/audioEngine.ts'
import styles from './ReflectionOverlay.module.css'

export function ReflectionOverlay() {
  const pendingReflection = useGameStore((s) => s.pendingReflection)
  const player            = useGameStore((s) => s.player)
  const dismissReflection = useGameStore((s) => s.dismissReflection)
  const [text, setText] = useState<{ title: string; body: string } | null>(null)

  useEffect(() => {
    if (!pendingReflection || !player) { setText(null); return }
    const pattern = getDecisionPattern(player)
    setText(buildReflectionText(pendingReflection as ReflectionTrigger, player, pattern))
    AudioEngine.playSfx('success')  // soft cue
  }, [pendingReflection, player])

  if (!pendingReflection || !text) return null

  return (
    <div className={styles.root} role="dialog" aria-modal="true">
      <div className={styles.panel}>
        <div className={styles.title}>{text.title}</div>
        <div className={styles.body}>{text.body}</div>
        <button
          className={styles.continue}
          onClick={dismissReflection}
        >CONTINUE</button>
      </div>
    </div>
  )
}
