import { useEffect, useMemo, useState } from 'react'
import { useGameStore } from '../../store/gameStore.ts'
import { getAvailableEndings, ENDINGS } from '@voidlink/core'
import type { EndingDefinition } from '@voidlink/core'
import { AudioEngine } from '../Audio/audioEngine.ts'
import styles from './EndingChoiceOverlay.module.css'

export function EndingChoiceOverlay() {
  const pendingEndingChoice = useGameStore((s) => s.pendingEndingChoice)
  const player              = useGameStore((s) => s.player)
  const chooseEnding        = useGameStore((s) => s.chooseEnding)
  const dismissEnding       = useGameStore((s) => s.dismissEnding)
  const [showEpilogue, setShowEpilogue] = useState<EndingDefinition | null>(null)

  const choices = useMemo(() => {
    if (!pendingEndingChoice || !player) return []
    return getAvailableEndings(player)
  }, [pendingEndingChoice, player])

  useEffect(() => {
    if (pendingEndingChoice && !showEpilogue) AudioEngine.playSfx('success')
  }, [pendingEndingChoice, showEpilogue])

  if (!pendingEndingChoice || !player) return null

  // Already chose — show the matching epilogue
  if (showEpilogue) {
    return (
      <div className={styles.root} role="dialog" aria-modal="true">
        <div className={styles.panel}>
          <div className={styles.epilogueRoot}>
            <div className={styles.epilogueTitle}>{showEpilogue.title}</div>
            <div className={styles.epilogueBody}>{showEpilogue.epilogue}</div>
          </div>
          <button
            className={styles.close}
            onClick={() => {
              setShowEpilogue(null)
              dismissEnding()
            }}
          >FINISH</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.root} role="dialog" aria-modal="true">
      <div className={styles.panel}>
        <div className={styles.preamble}>THE END OF ARC 5 — CHOOSE</div>
        <div className={styles.heading}>
          {choices.length === 1
            ? 'One path remains open to you.'
            : choices.length === 2
              ? 'Two paths remain open to you.'
              : 'Three paths remain open to you.'}
        </div>
        <div className={styles.choices}>
          {choices.map((c) => (
            <button
              key={c.id}
              className={styles.choice}
              onClick={() => {
                chooseEnding(c.id)
                setShowEpilogue(ENDINGS[c.id]!)
                AudioEngine.playSfx('success')
              }}
            >
              <span className={styles.choiceTitle}>{c.title}</span>
              <span className={styles.choiceTagline}>{c.tagline}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
