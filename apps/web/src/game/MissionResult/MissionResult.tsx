import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.ts'
import { Button } from '@uplink/ui'
import styles from './MissionResult.module.css'

export function MissionResult() {
  const missionResult = useGameStore((s) => s.missionResult)
  const player = useGameStore((s) => s.player)
  const missions = useGameStore((s) => s.missions)

  const lastMission = [...missions]
    .reverse()
    .find((m) => m.status === 'completed' || m.status === 'failed')

  function handleDismiss() {
    useGameStore.setState((s) => ({ ...s, missionResult: null }))
  }

  if (!missionResult) return null

  const isSuccess = missionResult === 'success'

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`${styles.panel} ${isSuccess ? styles.success : styles.fail}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.25, ease: [0, 0, 0.2, 1] }}
      >
        <div className={styles.header}>
          <span className={styles.statusIcon}>{isSuccess ? '▲' : '▼'}</span>
          <span className={styles.statusText}>
            {isSuccess ? 'MISSION COMPLETE' : 'MISSION FAILED'}
          </span>
        </div>

        <div className={styles.divider} />

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

        {!isSuccess && (
          <div className={styles.failText}>
            <p>Trace complete. Your connection was identified.</p>
            <p className={styles.failSub}>All evidence of the intrusion has been flagged.
            Your reputation may be affected.</p>
          </div>
        )}

        <Button
          variant={isSuccess ? 'primary' : 'secondary'}
          size="md"
          onClick={handleDismiss}
          className={styles.dismissBtn}
        >
          {isSuccess ? 'CONTINUE' : 'ACKNOWLEDGE'}
        </Button>
      </motion.div>
    </motion.div>
  )
}
