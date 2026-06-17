import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.ts'
import { Button } from '@voidlink/ui'
import type { StoryMission } from '@voidlink/core'
import { AudioEngine } from '../Audio/audioEngine.ts'
import { MissionPayoff } from './MissionPayoff.tsx'
import { DeathRecap } from './DeathRecap.tsx'
import styles from './MissionResult.module.css'

const ARC1_CHOICES = [
  {
    key: 'upload' as const,
    label: 'UPLOAD THE KEY',
    sub: 'Let REVELATION spread to every machine on the network. The world changes tonight.',
    consequence: 'Key transmitted. REVELATION has been released. The relay network will never be the same.',
  },
  {
    key: 'destroy' as const,
    label: 'DESTROY THE KEY',
    sub: 'Wipe the upload key. REVELATION stays contained. This ends here.',
    consequence: 'Key destroyed. REVELATION upload vector eliminated. Arunmor\'s nightmare is over.',
  },
  {
    key: 'sell' as const,
    label: 'SELL TO THE HIGHEST BIDDER',
    sub: 'Someone will pay enormously for this. +50,000 Cr. Let them worry about what it means.',
    consequence: 'Sold. 50,000 Cr transferred. The key is someone else\'s problem now.',
  },
]

export function MissionResult() {
  const missionResult = useGameStore((s) => s.missionResult)
  const player = useGameStore((s) => s.player)
  const missions = useGameStore((s) => s.missions)
  const resolveArc1Choice = useGameStore((s) => s.resolveArc1Choice)
  const [choiceConsequence, setChoiceConsequence] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (missionResult === 'success') AudioEngine.playSfx('success')
    else if (missionResult === 'fail' || missionResult === 'abandoned') AudioEngine.playSfx('fail')
    if (missionResult) {
      setTimeout(() => panelRef.current?.focus(), 350)
    }
  }, [missionResult])

  // Close on Escape
  useEffect(() => {
    if (!missionResult) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionResult])

  const lastMission = [...missions]
    .reverse()
    .find((m) => m.status === 'completed' || m.status === 'failed')

  function handleDismiss() {
    useGameStore.setState((s) => ({ ...s, missionResult: null }))
    setChoiceConsequence(null)
  }

  function handleArc1Choice(choice: 'upload' | 'destroy' | 'sell') {
    const def = ARC1_CHOICES.find((c) => c.key === choice)
    resolveArc1Choice(choice)
    setChoiceConsequence(def?.consequence ?? null)
  }

  if (!missionResult) return null

  const isSuccess = missionResult === 'success'
  const isAbandoned = missionResult === 'abandoned'
  const isTraced = missionResult === 'fail'
  const storyMission = lastMission as StoryMission | undefined
  const storyCoda = isSuccess ? (storyMission?.coda ?? null) : null

  const isArc1KeyChoice = isSuccess
    && lastMission?.id === 'story_arc03'
    && !player?.activeFlags.arc1_key_choice

  const titleId = 'mission-result-title'

  const panelClass = isSuccess
    ? styles.success
    : isAbandoned
      ? styles.abandoned
      : styles.fail

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      aria-hidden="false"
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`${styles.panel} ${panelClass}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.25, ease: [0, 0, 0.2, 1] }}
      >
        <div className={styles.header}>
          <span className={styles.statusIcon} aria-hidden="true">
            {isSuccess ? '▲' : isAbandoned ? '◈' : '▼'}
          </span>
          <span id={titleId} className={styles.statusText}>
            {isSuccess ? 'MISSION COMPLETE' : isAbandoned ? 'CONNECTION SEVERED' : 'MISSION FAILED — TRACED'}
          </span>
        </div>

        <div className={styles.divider} />

        {/* V7 — Per-mission-type payoff cinematic, shown above the rewards block */}
        {isSuccess && lastMission && <MissionPayoff mission={lastMission} />}

        {isSuccess && lastMission && (
          <div className={styles.rewards}>
            <div className={styles.rewardRow}>
              <span className={styles.rewardLabel}>CREDITS EARNED</span>
              <span className={styles.rewardValue}>+{lastMission.reward.credits.toLocaleString()} Cr</span>
            </div>
            <div className={styles.rewardRow}>
              <span className={styles.rewardLabel}>REPUTATION</span>
              <span className={styles.rewardValueGreen}>+{lastMission.reward.reputation} REP</span>
            </div>
            <div className={styles.rewardRow}>
              <span className={styles.rewardLabel}>TOTAL CREDITS</span>
              <span className={styles.rewardValueDim}>{player?.credits.toLocaleString()} Cr</span>
            </div>
          </div>
        )}

        {storyCoda && (
          <div className={styles.storyCoda}>
            <div className={styles.storyCodaLabel}>TRANSMISSION RECEIVED</div>
            <p className={styles.storyCodaText}>{storyCoda}</p>
          </div>
        )}

        {isAbandoned && (
          <div className={styles.abandonedText}>
            <p>You disconnected before completing your objectives.</p>
            <p className={styles.abandonedSub}>No credits. No trace. No record.</p>
          </div>
        )}

        {isTraced && (
          <>
            <div className={styles.failText}>
              <p>Trace complete. Your connection was identified.</p>
              <p className={styles.failSub}>All evidence of the intrusion has been flagged.
              Your reputation may be affected.</p>
            </div>
            {/* P5 — Death Recap: forensic walk-back of the last 5 actions */}
            <DeathRecap />
          </>
        )}

        {/* Arc 1 key choice — shown after arc03 completes */}
        {isArc1KeyChoice && !choiceConsequence && (
          <div className={styles.choiceBlock}>
            <div className={styles.choiceLabel}>WHAT DO YOU DO WITH THE KEY?</div>
            {ARC1_CHOICES.map((c) => (
              <button
                key={c.key}
                className={styles.choiceBtn}
                onClick={() => handleArc1Choice(c.key)}
              >
                <span className={styles.choiceBtnLabel}>{c.label}</span>
                <span className={styles.choiceBtnSub}>{c.sub}</span>
              </button>
            ))}
          </div>
        )}

        {choiceConsequence && (
          <div className={styles.consequenceText}>{choiceConsequence}</div>
        )}

        {(!isArc1KeyChoice || choiceConsequence) && (
          <Button
            variant={isSuccess ? 'primary' : 'secondary'}
            size="md"
            onClick={handleDismiss}
            className={styles.dismissBtn}
          >
            {isSuccess ? 'CONTINUE' : isAbandoned ? 'DISCONNECT' : 'ACKNOWLEDGE'}
          </Button>
        )}
      </motion.div>
    </motion.div>
  )
}
