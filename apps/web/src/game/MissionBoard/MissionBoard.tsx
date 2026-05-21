import { useGameStore } from '../../store/gameStore.ts'
import { Button } from '@uplink/ui'
import type { Mission } from '@uplink/core'
import styles from './MissionBoard.module.css'

const DIFFICULTY_LABEL = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
const TYPE_DISPLAY: Record<string, string> = {
  file_theft: 'FILE THEFT',
  account_deletion: 'ACCOUNT DELETION',
  database_corruption: 'DB CORRUPTION',
  network_sabotage: 'SABOTAGE',
  evidence_planting: 'EVIDENCE',
  counter_hacking: 'COUNTER-HACK',
  bounty_hunt: 'BOUNTY',
  corporate_espionage: 'ESPIONAGE',
  story: 'STORY',
}

export function MissionBoard() {
  const missions = useGameStore((s) => s.missions)
  const activeMissionId = useGameStore((s) => s.activeMissionId)
  const acceptMission = useGameStore((s) => s.acceptMission)
  const openWindow = useGameStore((s) => s.openWindow)
  const logTerminal = useGameStore((s) => s.logTerminal)

  function handleAccept(mission: Mission) {
    if (activeMissionId) {
      logTerminal('ERROR: You already have an active mission. Complete or abandon it first.', 'error')
      return
    }
    acceptMission(mission.id)
    logTerminal(`Mission accepted: ${mission.briefing.subject}`, 'success')
    logTerminal(`Target network located. Establishing route...`, 'system')
    openWindow({
      id: 'network-map',
      title: 'NETWORK MAP',
      component: 'NetworkMap',
      x: 120,
      y: 120,
      width: 640,
      height: 440,
      isMinimized: false,
    })
    openWindow({
      id: 'hacking',
      title: 'HACKING INTERFACE',
      component: 'HackingInterface',
      x: 800,
      y: 200,
      width: 380,
      height: 340,
      isMinimized: false,
    })
  }

  const available = missions.filter((m) => m.status === 'available')
  const active = missions.find((m) => m.status === 'active')

  return (
    <div className={styles.board}>
      {active && (
        <div className={styles.activeSection}>
          <div className={styles.sectionLabel}>ACTIVE MISSION</div>
          <MissionCard mission={active} isActive onAccept={() => {}} />
        </div>
      )}

      <div className={styles.sectionLabel}>
        AVAILABLE CONTRACTS ({available.length})
      </div>

      {available.length === 0 ? (
        <p className={styles.empty}>No contracts available. Check back later.</p>
      ) : (
        <div className={styles.list}>
          {available.map((m) => (
            <MissionCard
              key={m.id}
              mission={m}
              isActive={false}
              onAccept={() => handleAccept(m)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function MissionCard({
  mission,
  isActive,
  onAccept,
}: {
  mission: Mission
  isActive: boolean
  onAccept: () => void
}) {
  return (
    <div className={`${styles.card} ${isActive ? styles.cardActive : ''}`}>
      <div className={styles.cardHeader}>
        <span className={styles.missionType}>
          {TYPE_DISPLAY[mission.type] ?? mission.type}
        </span>
        <span className={styles.difficulty}>
          LVL {DIFFICULTY_LABEL[mission.difficulty]}
        </span>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.subject}>{mission.briefing.subject}</div>
        <div className={styles.client}>
          FROM: <span className={styles.clientHandle}>{mission.briefing.clientHandle}</span>
        </div>
        <div className={styles.reward}>
          <span className={styles.credits}>{mission.reward.credits.toLocaleString()} Cr</span>
          <span className={styles.rep}>+{mission.reward.reputation} REP</span>
          {mission.timeLimitSeconds && (
            <span className={styles.timelimit}>⏱ {mission.timeLimitSeconds}s</span>
          )}
        </div>
      </div>
      {!isActive && (
        <Button variant="primary" size="sm" onClick={onAccept} className={styles.acceptBtn}>
          ACCEPT
        </Button>
      )}
    </div>
  )
}
