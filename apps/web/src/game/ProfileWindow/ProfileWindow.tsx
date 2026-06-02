import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGameStore } from '../../store/gameStore.ts'
import { levelFromXp, xpProgressPercent, xpForNextLevel, levelTitle } from '@voidlink/core'
import { Button } from '@voidlink/ui'
import styles from './ProfileWindow.module.css'

const HW_LABEL_KEYS: Record<string, string> = {
  cpuSpeed: 'profile.cpuSpeed',
  ramSlots: 'profile.ramSlots',
  hddCapacity: 'profile.hddCapacity',
  modemSpeed: 'profile.modemSpeed',
  gatewayBandwidth: 'profile.gatewayBandwidth',
}

const HW_UNIT_KEYS: Record<string, string> = {
  cpuSpeed: 'profile.unitGHz',
  ramSlots: 'profile.unitSlots',
  hddCapacity: 'profile.unitGB',
  modemSpeed: 'profile.unitMbps',
  gatewayBandwidth: 'profile.unitMbps',
}

type ProfileTab = 'overview' | 'factions' | 'standings'

export function ProfileWindow() {
  const { t } = useTranslation()
  const player = useGameStore((s) => s.player)
  const createFaction = useGameStore((s) => s.createFaction)
  const leaveFaction = useGameStore((s) => s.leaveFaction)
  const [tab, setTab] = useState<ProfileTab>('overview')
  const [factionName, setFactionName] = useState('')
  const [factionTag, setFactionTag] = useState('')
  const [factionDesc, setFactionDesc] = useState('')
  const [factionError, setFactionError] = useState('')

  if (!player) {
    return <div className={styles.empty}>{t('profile.noData')}</div>
  }

  const allTools = [
    ...player.software.passwordCrackers,
    ...player.software.proxies,
    ...player.software.logDeleters,
    ...player.software.portScanners,
    ...player.software.firewallBypassers,
    ...player.software.misc,
  ]

  const rankKeys = ['', 'profile.rank.1', 'profile.rank.2', 'profile.rank.3', 'profile.rank.4', 'profile.rank.5', 'profile.rank.6', 'profile.rank.7']
  const rankLabel = rankKeys[player.rank] ? t(rankKeys[player.rank] as Parameters<typeof t>[0]) : `RANK ${player.rank}`
  const successRate = player.stats.totalMissions > 0
    ? Math.round((player.stats.successfulBreaches / player.stats.totalMissions) * 100)
    : 0

  const xp = player.stats.xp ?? 0
  const level = levelFromXp(xp)
  const xpPct = xpProgressPercent(xp, level)
  const xpToNext = xpForNextLevel(level)
  const lvlTitle = levelTitle(level)

  function handleCreateFaction() {
    setFactionError('')
    if (!factionName.trim() || !factionTag.trim()) { setFactionError('Name and tag required.'); return }
    const result = createFaction(factionName.trim(), factionTag.trim(), factionDesc.trim())
    if (result === 'insufficient_funds') setFactionError('Need 50,000 Cr to found a faction.')
    else if (result === 'rank_required') setFactionError('Rank 3+ (SPECIALIST) required.')
    else if (result === 'already_in_faction') setFactionError('You are already in a faction.')
    else { setFactionName(''); setFactionTag(''); setFactionDesc('') }
  }

  return (
    <div className={styles.profile}>

      {/* Identity */}
      <div className={styles.identityRow}>
        <div className={styles.avatar} aria-hidden="true">[ ID ]</div>
        <div className={styles.identityInfo}>
          <div className={styles.handle}>{player.handle}</div>
          <div className={styles.username}>{player.username}</div>
          <div className={styles.rank}>{rankLabel}</div>
          {player.specialization && (
            <div className={styles.spec}>{t('profile.spec', { spec: player.specialization.toUpperCase() })}</div>
          )}
          {player.faction && (
            <div className={styles.factionTag}>[{player.faction.tag}] {player.faction.name}</div>
          )}
        </div>
        <div className={styles.balancePill}>
          <span className={styles.credits}>{player.credits.toLocaleString()} Cr</span>
          <span className={styles.rep}>REP {player.reputation}</span>
        </div>
      </div>

      {/* XP / Level */}
      <div className={styles.xpRow}>
        <div className={styles.xpInfo}>
          <span className={styles.xpLevel}>LVL {level}</span>
          <span className={styles.xpTitle}>{lvlTitle}</span>
          <span className={styles.xpNum}>{xp.toLocaleString()} XP</span>
        </div>
        <div className={styles.xpTrack} title={`${xpPct}% to level ${level + 1} (${xpToNext} XP needed)`}>
          <div className={styles.xpFill} style={{ width: `${xpPct}%` }} />
        </div>
      </div>

      {/* Tab bar */}
      <div className={styles.tabRow}>
        {(['overview', 'factions', 'standings'] as ProfileTab[]).map((t2) => (
          <button
            key={t2}
            className={`${styles.tabBtn} ${tab === t2 ? styles.tabBtnActive : ''}`}
            onClick={() => setTab(t2)}
          >
            {t2.toUpperCase()}
          </button>
        ))}
      </div>

      <div className={styles.divider} />

      {/* ── FACTIONS TAB ────────────────────────────── */}
      {tab === 'factions' && (
        <>
          {player.faction ? (
            <div className={styles.factionPanel}>
              <div className={styles.factionPanelHeader}>
                <span className={styles.factionPanelTag}>[{player.faction.tag}]</span>
                <span className={styles.factionPanelName}>{player.faction.name}</span>
              </div>
              <p className={styles.factionPanelDesc}>{player.faction.description || 'No description.'}</p>
              <div className={styles.factionPanelMeta}>
                <span>Founded by {player.faction.founderHandle}</span>
                <span>Members: {player.faction.memberHandles.length}</span>
              </div>
              <div className={styles.inviteRow}>
                <span className={styles.inviteLabel}>INVITE CODE</span>
                <span className={styles.inviteCode}>{player.faction.inviteCode}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={leaveFaction}>LEAVE FACTION</Button>
            </div>
          ) : (
            <div className={styles.factionCreatePanel}>
              <div className={styles.factionCreateHeader}>FOUND A FACTION</div>
              <div className={styles.factionCreateMeta}>Cost: 50,000 Cr · Requires: SPECIALIST (Rank 3)</div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>FACTION NAME</label>
                <input
                  className={styles.formInput}
                  value={factionName}
                  onChange={(e) => setFactionName(e.target.value)}
                  maxLength={32}
                  placeholder="e.g. The Null Collective"
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>TAG (max 6 chars)</label>
                <input
                  className={styles.formInput}
                  value={factionTag}
                  onChange={(e) => setFactionTag(e.target.value)}
                  maxLength={6}
                  placeholder="e.g. NULL"
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>DESCRIPTION</label>
                <input
                  className={styles.formInput}
                  value={factionDesc}
                  onChange={(e) => setFactionDesc(e.target.value)}
                  maxLength={120}
                  placeholder="Optional motto or description"
                />
              </div>
              {factionError && <div className={styles.formError}>{factionError}</div>}
              <Button variant="primary" size="sm" onClick={handleCreateFaction}>FOUND FACTION — 50,000 Cr</Button>
            </div>
          )}
        </>
      )}

      {/* ── STANDINGS TAB ───────────────────────────── */}
      {tab === 'standings' && (
        <div className={styles.factionList}>
          {player.factionStandings.length === 0 ? (
            <div className={styles.empty}>{t('profile.noFactions')}</div>
          ) : (
            player.factionStandings.map((fs) => {
              const cls = styles[`faction_${fs.factionId}`] ?? ''
              const score = Math.max(-100, Math.min(100, fs.score))
              const negPct = score < 0 ? Math.abs(score) : 0
              const posPct = score > 0 ? score : 0
              const label = fs.factionId.replace(/_/g, ' ').toUpperCase()
              return (
                <div key={fs.factionId} className={`${styles.factionRow} ${cls}`}>
                  <span className={styles.factionName} title={label}>{label}</span>
                  <div className={styles.factionBarWrap} aria-label={`${label} standing: ${score}`}>
                    <span className={styles.factionBarCenter} />
                    {negPct > 0 && (
                      <span className={styles.factionBarNeg} style={{ width: `${negPct / 2}%` }} />
                    )}
                    {posPct > 0 && (
                      <span className={styles.factionBarPos} style={{ width: `${posPct / 2}%` }} />
                    )}
                  </div>
                  <span className={styles.factionRank}>{fs.rank}</span>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* ── OVERVIEW TAB ────────────────────────────── */}
      {tab !== 'factions' && tab !== 'standings' && (
      <>
      {/* Two-column body */}
      <div className={styles.columns}>

        {/* Left: Hardware */}
        <div className={styles.col}>
          <div className={styles.colLabel}>{t('profile.hardware')}</div>
          {Object.entries(player.hardware).map(([key, val]) => (
            <div key={key} className={styles.statRow}>
              <span className={styles.statKey}>{t((HW_LABEL_KEYS[key] ?? key) as Parameters<typeof t>[0])}</span>
              <span className={styles.statVal}>{val} {HW_UNIT_KEYS[key] ? t(HW_UNIT_KEYS[key] as Parameters<typeof t>[0]) : ''}</span>
            </div>
          ))}
        </div>

        {/* Right: Stats */}
        <div className={styles.col}>
          <div className={styles.colLabel}>{t('profile.statistics')}</div>
          <div className={styles.statRow}>
            <span className={styles.statKey}>{t('profile.missions')}</span>
            <span className={styles.statVal}>{player.stats.totalMissions}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statKey}>{t('profile.successful')}</span>
            <span className={styles.statVal}>{player.stats.successfulBreaches}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statKey}>{t('profile.successRate')}</span>
            <span className={styles.statVal}>{successRate}%</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statKey}>{t('profile.traceFails')}</span>
            <span className={`${styles.statVal} ${player.stats.traceFailures > 0 ? styles.danger : ''}`}>
              {player.stats.traceFailures}
            </span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statKey}>{t('profile.escapes')}</span>
            <span className={styles.statVal}>{player.stats.traceEscapes}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statKey}>{t('profile.creditsEarned')}</span>
            <span className={styles.statVal}>{player.stats.creditsEarned.toLocaleString()}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statKey}>{t('profile.creditsSpent')}</span>
            <span className={styles.statVal}>{player.stats.creditsSpent.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Software */}
      <div className={styles.colLabel}>{t('profile.software')}</div>
      {allTools.length === 0 ? (
        <div className={styles.empty}>{t('profile.noSoftware')}</div>
      ) : (
        <div className={styles.softwareGrid}>
          {allTools.map((tool) => (
            <div key={tool.toolId} className={styles.tool}>
              <span className={styles.toolId}>{tool.toolId.replace(/_/g, ' ').toUpperCase()}</span>
              <span className={styles.toolMeta}>{t('profile.toolMeta', { version: tool.version, level: tool.level })}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.divider} />

      <div className={styles.divider} />

      {/* Footer */}
      <div className={styles.footer}>
        <span>{t('profile.since', { date: new Date(player.createdAt).toLocaleDateString() })}</span>
        <span>{t('profile.lastSeen', { time: new Date(player.lastSeenAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }) })}</span>
      </div>
      </>
      )}
    </div>
  )
}
