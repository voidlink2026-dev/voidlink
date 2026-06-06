import { useTranslation } from 'react-i18next'
import { useGameStore } from '../../store/gameStore.ts'
import { Button } from '@voidlink/ui'
import type { Mission, MissionRequirements, PlayerProfile, StoryMission } from '@voidlink/core'
import { getDecisionPattern } from '@voidlink/core'
import { LoadoutBar } from '../Loadouts/LoadoutBar.tsx'
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

// toolId encodes the version: cracker_basic=1, cracker_v2=2, cracker_v3=3, cracker_v4=4
const CRACKER_VERSION: Record<string, number> = {
  cracker_basic: 1,
  cracker_v2:    2,
  cracker_v3:    3,
  cracker_v4:    4,
}
function maxCrackerLevel(player: PlayerProfile): number {
  const versions = player.software.passwordCrackers.map((t) => CRACKER_VERSION[t.toolId] ?? t.level)
  return versions.length ? Math.max(...versions) : 0
}

function meetsRequirements(reqs: MissionRequirements, player: PlayerProfile, activeRouteLen: number) {
  // M14p Pass 2b — pattern gates check the player's accumulated decision
  // pattern. The pattern is internal; the UI only ever shows the
  // human-readable `patternGateLabel`, never a number.
  const pattern = getDecisionPattern(player)
  const principledOk = reqs.minPrincipledScore === undefined
    || pattern.principledScore >= reqs.minPrincipledScore
  const mercenaryOk  = reqs.minMercenaryScore === undefined
    || pattern.mercenaryScore  >= reqs.minMercenaryScore
  return {
    cracker: maxCrackerLevel(player) >= reqs.minCrackerLevel,
    cpu:     player.hardware.cpuSpeed >= reqs.minCpuSpeed,
    rep:     player.reputation >= reqs.minReputation,
    relay:   activeRouteLen >= (reqs.minRelayHops ?? 0),
    pattern: principledOk && mercenaryOk,
    get all() { return this.cracker && this.cpu && this.rep && this.relay && this.pattern },
  }
}

export function MissionBoard() {
  const { t } = useTranslation()
  const missions = useGameStore((s) => s.missions)
  const activeMissionId = useGameStore((s) => s.activeMissionId)
  const acceptMission = useGameStore((s) => s.acceptMission)
  const openWindow = useGameStore((s) => s.openWindow)
  const logTerminal = useGameStore((s) => s.logTerminal)
  const player = useGameStore((s) => s.player)

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
      <LoadoutBar />
      {active && player && (
        <div className={styles.activeSection}>
          <div className={styles.sectionLabel}>{t('missionBoard.activeHeader')}</div>
          <MissionCard mission={active} isActive player={player} onAccept={() => {}} />
        </div>
      )}

      <div className={styles.sectionLabel}>
        {t('missionBoard.availableHeader')} ({available.length})
      </div>

      {available.length === 0 ? (
        <p className={styles.empty}>{t('missionBoard.noMissions')}</p>
      ) : (
        <div className={styles.list}>
          {player && available.map((m) => (
            <MissionCard
              key={m.id}
              mission={m}
              isActive={false}
              player={player}
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
  player,
  onAccept,
}: {
  mission: Mission
  isActive: boolean
  player: PlayerProfile
  onAccept: () => void
}) {
  const { t } = useTranslation()
  const isStory = (mission as StoryMission).isStory === true
  const activeRouteLen = useGameStore((s) => s.activeRoute.length)
  const reqs = meetsRequirements(mission.requirements, player, activeRouteLen)

  return (
    <div className={`${styles.card} ${isActive ? styles.cardActive : ''} ${isStory ? styles.cardStory : ''} ${!reqs.all && !isActive ? styles.cardLocked : ''}`}>
      <div className={styles.cardHeader}>
        <span className={isStory ? styles.missionTypeStory : styles.missionType}>
          {TYPE_DISPLAY[mission.type] ?? mission.type}
        </span>
        <div className={styles.cardHeaderRight}>
          {isStory && <span className={styles.storyBadge}>{t('missionBoard.storyBadge')}</span>}
          <span className={styles.difficulty}>
            LVL {DIFFICULTY_LABEL[mission.difficulty]}
          </span>
        </div>
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

      <div className={styles.requirements}>
        <span className={reqs.cracker ? styles.reqMet : styles.reqUnmet}>
          {reqs.cracker ? '✓' : '✗'} CRACKER LV{mission.requirements.minCrackerLevel}+
        </span>
        <span className={reqs.cpu ? styles.reqMet : styles.reqUnmet}>
          {reqs.cpu ? '✓' : '✗'} CPU {mission.requirements.minCpuSpeed.toFixed(1)}GHz+
        </span>
        <span className={reqs.rep ? styles.reqMet : styles.reqUnmet}>
          {reqs.rep ? '✓' : '✗'} REP {mission.requirements.minReputation}+
        </span>
        {mission.requirements.minRelayHops && mission.requirements.minRelayHops > 0 && (
          <span className={reqs.relay ? styles.reqMet : styles.reqUnmet}>
            {reqs.relay ? '✓' : '✗'} RELAY ≥{mission.requirements.minRelayHops} HOPS
          </span>
        )}
        {/* M14p Pass 2b — pattern gate chip. We display the human-readable
            label, never the underlying number. */}
        {(mission.requirements.minPrincipledScore !== undefined
          || mission.requirements.minMercenaryScore !== undefined) && (
          <span className={reqs.pattern ? styles.reqMet : styles.reqUnmet}>
            {reqs.pattern ? '✓' : '✗'} {mission.requirements.patternGateLabel ?? 'TRACK RECORD'}
          </span>
        )}
      </div>

      {!isActive && (
        <div className={styles.acceptRow}>
          {!reqs.all && (
            <span className={styles.upgradeHint}>
              {!reqs.pattern && reqs.cracker && reqs.cpu && reqs.rep && reqs.relay
                ? 'Client wants a different kind of operative — earn the track record'
                : !reqs.relay && reqs.cracker && reqs.cpu && reqs.rep
                  ? `Build a ${mission.requirements.minRelayHops}-hop relay on WORLD MAP`
                  : 'Upgrade in SHOP to unlock'}
            </span>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={onAccept}
            className={styles.acceptBtn}
            disabled={!reqs.all}
          >
            {t('missionBoard.accept')}
          </Button>
        </div>
      )}
    </div>
  )
}
