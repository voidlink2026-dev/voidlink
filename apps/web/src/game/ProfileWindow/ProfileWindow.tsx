import { useGameStore } from '../../store/gameStore.ts'
import styles from './ProfileWindow.module.css'

const RANK_LABELS = ['', 'NOVICE', 'FREELANCER', 'SPECIALIST', 'OPERATIVE', 'ELITE', 'SHADOW', 'PHANTOM']

const HW_LABELS: Record<string, string> = {
  cpuSpeed: 'CPU Speed',
  ramSlots: 'RAM Slots',
  hddCapacity: 'HDD Capacity',
  modemSpeed: 'Modem Speed',
  gatewayBandwidth: 'Gateway BW',
}

const HW_UNITS: Record<string, string> = {
  cpuSpeed: 'GHz',
  ramSlots: 'slots',
  hddCapacity: 'GB',
  modemSpeed: 'Mbps',
  gatewayBandwidth: 'Mbps',
}

export function ProfileWindow() {
  const player = useGameStore((s) => s.player)

  if (!player) {
    return <div className={styles.empty}>No operative data.</div>
  }

  const allTools = [
    ...player.software.passwordCrackers,
    ...player.software.proxies,
    ...player.software.logDeleters,
    ...player.software.portScanners,
    ...player.software.firewallBypassers,
    ...player.software.misc,
  ]

  const rankLabel = RANK_LABELS[player.rank] ?? `RANK ${player.rank}`
  const successRate = player.stats.totalMissions > 0
    ? Math.round((player.stats.successfulBreaches / player.stats.totalMissions) * 100)
    : 0

  return (
    <div className={styles.profile}>

      {/* Identity */}
      <div className={styles.identityRow}>
        <div className={styles.avatar} aria-hidden="true">[ ID ]</div>
        <div className={styles.identityInfo}>
          <div className={styles.handle}>{player.handle}</div>
          <div className={styles.username}>{player.username}</div>
          <div className={styles.rank}>{rankLabel}</div>
        </div>
        <div className={styles.balancePill}>
          <span className={styles.credits}>{player.credits.toLocaleString()} Cr</span>
          <span className={styles.rep}>REP {player.reputation}</span>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Two-column body */}
      <div className={styles.columns}>

        {/* Left: Hardware */}
        <div className={styles.col}>
          <div className={styles.colLabel}>HARDWARE</div>
          {Object.entries(player.hardware).map(([key, val]) => (
            <div key={key} className={styles.statRow}>
              <span className={styles.statKey}>{HW_LABELS[key] ?? key}</span>
              <span className={styles.statVal}>{val} {HW_UNITS[key] ?? ''}</span>
            </div>
          ))}
        </div>

        {/* Right: Stats */}
        <div className={styles.col}>
          <div className={styles.colLabel}>STATISTICS</div>
          <div className={styles.statRow}>
            <span className={styles.statKey}>Missions</span>
            <span className={styles.statVal}>{player.stats.totalMissions}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statKey}>Successful</span>
            <span className={styles.statVal}>{player.stats.successfulBreaches}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statKey}>Success rate</span>
            <span className={styles.statVal}>{successRate}%</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statKey}>Trace fails</span>
            <span className={`${styles.statVal} ${player.stats.traceFailures > 0 ? styles.danger : ''}`}>
              {player.stats.traceFailures}
            </span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statKey}>Escapes</span>
            <span className={styles.statVal}>{player.stats.traceEscapes}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statKey}>Credits earned</span>
            <span className={styles.statVal}>{player.stats.creditsEarned.toLocaleString()}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statKey}>Credits spent</span>
            <span className={styles.statVal}>{player.stats.creditsSpent.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Software */}
      <div className={styles.colLabel}>INSTALLED SOFTWARE</div>
      {allTools.length === 0 ? (
        <div className={styles.empty}>No software installed.</div>
      ) : (
        <div className={styles.softwareGrid}>
          {allTools.map((t) => (
            <div key={t.toolId} className={styles.tool}>
              <span className={styles.toolId}>{t.toolId.replace(/_/g, ' ').toUpperCase()}</span>
              <span className={styles.toolMeta}>v{t.version} · LVL {t.level}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.divider} />

      {/* Footer */}
      <div className={styles.footer}>
        <span>Operative since {new Date(player.createdAt).toLocaleDateString()}</span>
        <span>Last seen {new Date(player.lastSeenAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
      </div>
    </div>
  )
}
