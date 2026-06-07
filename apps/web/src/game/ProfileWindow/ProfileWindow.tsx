import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGameStore } from '../../store/gameStore.ts'
import { levelFromXp, xpProgressPercent, xpForNextLevel, levelTitle, GATEWAYS, getActiveGateway, ACHIEVEMENTS } from '@voidlink/core'
import type { AchievementDefinition, PlayerProfile } from '@voidlink/core'
import { Button } from '@voidlink/ui'
import { AudioEngine } from '../Audio/audioEngine.ts'
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

type ProfileTab = 'overview' | 'factions' | 'standings' | 'achievements'

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
        {(['overview', 'factions', 'standings', 'achievements'] as ProfileTab[]).map((t2) => (
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

      {/* ── ACHIEVEMENTS TAB ────────────────────────── */}
      {tab === 'achievements' && <AchievementsTab player={player} />}

      {/* ── OVERVIEW TAB ────────────────────────────── */}
      {tab === 'overview' && (
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

      {/* M14l — Gateway */}
      <GatewayPanel />

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

// ── M14l — Physical Gateway panel ──────────────────────────────────────────
function GatewayPanel() {
  const player           = useGameStore((s) => s.player)
  const unlockGateway    = useGameStore((s) => s.unlockGateway)
  const setActiveGateway = useGameStore((s) => s.setActiveGateway)
  const logTerminal      = useGameStore((s) => s.logTerminal)

  if (!player) return null
  const active = getActiveGateway(player)

  function handleUnlock(id: string, name: string) {
    const r = unlockGateway(id)
    if (r === 'ok') AudioEngine.playSfx('success')
    else if (r === 'insufficient_funds') logTerminal(`DENIED: insufficient credits for ${name}.`, 'error')
    else if (r === 'already_owned') logTerminal(`${name} already acquired.`, 'dim')
  }

  function handleActivate(id: string, name: string) {
    const r = setActiveGateway(id)
    if (r === 'ok') AudioEngine.playSfx('click')
    else if (r === 'not_owned') logTerminal(`${name}: acquire first.`, 'error')
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 11, letterSpacing: '0.12em', color: '#888', marginBottom: 6 }}>
        <span>PHYSICAL GATEWAY</span>
        <span style={{ color: '#00e5ff', fontSize: 10 }}>— {active.name}</span>
        <span style={{ color: '#606060', fontSize: 9 }}>({active.region})</span>
      </div>
      <div style={{ fontSize: 10, color: '#909090', marginBottom: 8 }}>{active.effectLabel}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {GATEWAYS.map((gw) => {
          const owned = gw.id === 'home' || (player.ownedGateways?.includes(gw.id) ?? false)
          const isActive = (player.activeGatewayId ?? 'home') === gw.id
          const paidUntil = player.gatewayPaidUntil?.[gw.id] ?? 0
          const daysLeft = paidUntil > Date.now() ? Math.max(0, Math.round((paidUntil - Date.now()) / (24 * 3600 * 1000))) : 0
          return (
            <div key={gw.id} style={{
              border: `1px solid ${isActive ? '#00e5ff' : owned ? '#39ff14' : '#2a2a2a'}`,
              background: isActive ? 'rgba(0, 229, 255, 0.06)' : 'transparent',
              borderRadius: 2,
              padding: '6px 8px',
              fontSize: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, color: isActive ? '#00e5ff' : '#d4d4d4' }}>{gw.name}</span>
                {gw.unlockCost > 0 && !owned && <span style={{ color: '#ffd700', fontSize: 9 }}>{gw.unlockCost.toLocaleString()} Cr</span>}
                {owned && gw.rentPerWeek > 0 && isActive && (
                  <span style={{ color: daysLeft <= 1 ? '#ff9900' : '#909090', fontSize: 9 }}>{daysLeft}d rent</span>
                )}
              </div>
              <div style={{ fontSize: 9, color: '#606060' }}>{gw.effectLabel}</div>
              {!owned ? (
                <Button variant="secondary" size="sm" onClick={() => handleUnlock(gw.id, gw.name)} disabled={player.credits < gw.unlockCost}>
                  ACQUIRE
                </Button>
              ) : isActive ? (
                <span style={{ fontSize: 9, color: '#39ff14', letterSpacing: '0.1em' }}>★ ACTIVE</span>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => handleActivate(gw.id, gw.name)}>SWITCH</Button>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

// L5 — Achievements tab. Grid of all 50 entries grouped by tier. Hidden
// story/platinum entries display as locked silhouettes until earned.
const TIER_ORDER: AchievementDefinition['tier'][] = ['platinum', 'gold', 'story', 'silver', 'bronze', 'trivial']
const TIER_LABEL: Record<AchievementDefinition['tier'], string> = {
  platinum: 'PLATINUM',
  gold: 'GOLD',
  story: 'STORY',
  silver: 'SILVER',
  bronze: 'BRONZE',
  trivial: 'TRIVIAL',
}
const TIER_COLOR: Record<AchievementDefinition['tier'], string> = {
  platinum: '#e5e4e2',
  gold: '#ffd700',
  story: '#00cfff',
  silver: '#b6b6b6',
  bronze: '#c47a3c',
  trivial: '#888',
}

function AchievementsTab({ player }: { player: PlayerProfile }) {
  const total = ACHIEVEMENTS.length
  const unlockedCount = ACHIEVEMENTS.filter((a) => !!player.activeFlags[`achievement_${a.id}`]).length
  const pct = Math.round((unlockedCount / total) * 100)

  return (
    <div style={{ padding: '8px 4px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontSize: 10, letterSpacing: '0.16em', color: '#a8a8a8' }}>UNLOCKED</span>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#00cfff', letterSpacing: '0.04em' }}>
          {unlockedCount} <span style={{ color: '#909090', fontWeight: 400 }}>/ {total}</span>
        </span>
        <span style={{ fontSize: 10, color: '#909090', letterSpacing: '0.1em', marginLeft: 'auto' }}>{pct}%</span>
      </div>
      <div style={{ height: 1, background: 'rgba(0,229,255,0.18)' }} />

      {TIER_ORDER.map((tier) => {
        const items = ACHIEVEMENTS.filter((a) => a.tier === tier)
        if (items.length === 0) return null
        const tierColor = TIER_COLOR[tier]
        return (
          <div key={tier} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{
              fontSize: 9, letterSpacing: '0.22em', color: tierColor,
              textShadow: tier === 'platinum' ? `0 0 10px ${tierColor}` : 'none',
            }}>
              {TIER_LABEL[tier]} · {items.filter((a) => !!player.activeFlags[`achievement_${a.id}`]).length} / {items.length}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 6 }}>
              {items.map((a) => {
                const unlocked = !!player.activeFlags[`achievement_${a.id}`]
                const hideContent = a.hidden && !unlocked
                return (
                  <div
                    key={a.id}
                    style={{
                      border: `1px solid ${unlocked ? tierColor : 'rgba(255,255,255,0.06)'}`,
                      background: unlocked ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)',
                      padding: '8px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                      opacity: unlocked ? 1 : 0.55,
                    }}
                  >
                    <div style={{
                      fontSize: 10, fontWeight: 700,
                      color: unlocked ? '#d4d4d4' : '#6a6a6a',
                      letterSpacing: '0.04em',
                    }}>
                      {hideContent ? '— LOCKED —' : a.title}
                    </div>
                    <div style={{
                      fontSize: 9, color: unlocked ? '#a0a0a0' : '#7a7a7a',
                      fontStyle: 'italic', lineHeight: 1.4,
                    }}>
                      {hideContent ? 'Achievement criteria hidden until earned.' : a.description}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
