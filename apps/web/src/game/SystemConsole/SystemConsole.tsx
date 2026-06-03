import { useState } from 'react'
import { useGameStore } from '../../store/gameStore.ts'
import styles from './SystemConsole.module.css'

export function SystemConsole() {
  const [collapsed, setCollapsed] = useState(false)
  const player = useGameStore((s) => s.player)
  const activeRoute = useGameStore((s) => s.activeRoute)
  const traceState = useGameStore((s) => s.traceState)
  const activeMissionId = useGameStore((s) => s.activeMissionId)
  const activeWorldEvents = useGameStore((s) => s.activeWorldEvents)

  if (!player) return null

  const bounceLibrary = player.bounceLibrary ?? []
  const proxyCount = player.software.proxies.length

  const processes: Array<{ id: string; label: string; status: 'ok' | 'warn' | 'active' | 'err' }> = []

  // Active mission
  if (activeMissionId) {
    const traceLevel = traceState?.level ?? 0
    processes.push({
      id: 'mission',
      label: `MISSION ACTIVE — trace ${Math.round(traceLevel)}%`,
      status: traceLevel > 60 ? 'err' : traceLevel > 30 ? 'warn' : 'active',
    })
  }

  // Bounce route
  if (activeRoute.length > 0) {
    const hopsRemaining = traceState?.hopsRemaining ?? activeRoute.length
    const dirtyCount = bounceLibrary.filter((n) => activeRoute.includes(n.id) && n.logStatus === 'dirty').length
    processes.push({
      id: 'bounce',
      label: `RELAY CHAIN — ${hopsRemaining} HOP${hopsRemaining !== 1 ? 'S' : ''}${dirtyCount > 0 ? ` (${dirtyCount} DIRTY)` : ''}`,
      status: dirtyCount > 0 ? 'warn' : 'ok',
    })
  } else {
    processes.push({ id: 'bounce', label: 'RELAY CHAIN — NONE', status: 'warn' })
  }

  // Proxies
  if (proxyCount > 0) {
    processes.push({ id: 'proxy', label: `PROXY SOFTWARE — ${proxyCount} LOADED`, status: 'ok' })
  }

  // World events
  for (const evt of activeWorldEvents) {
    processes.push({ id: evt.id, label: `EVENT: ${evt.shortLabel}`, status: 'active' })
  }

  // System status (always present)
  processes.push({ id: 'gateway', label: `GATEWAY — ${player.hardware.gatewayBandwidth} Mb/s`, status: 'ok' })

  // M14h.5 — financial notoriety / grid presence
  const notoriety = player.notoriety ?? 0
  if (notoriety !== 0) {
    processes.push({
      id: 'notoriety',
      label: `NOTORIETY — ${notoriety > 0 ? '+' : ''}${notoriety.toFixed(1)}`,
      status: notoriety >= 3 ? 'err' : notoriety > 0 ? 'warn' : 'ok',
    })
  }

  const statusDot = (s: typeof processes[0]['status']) => {
    const colors = { ok: '#39ff14', warn: '#ff9900', active: '#00cfff', err: '#ff2d20' }
    return colors[s]
  }

  return (
    <div className={`${styles.console} ${collapsed ? styles.collapsed : ''}`} data-tutorial="system-console">
      <button
        className={styles.header}
        onClick={() => setCollapsed((v) => !v)}
        aria-expanded={!collapsed}
        aria-label="System console"
      >
        <span className={styles.title}>SYS</span>
        {!collapsed && <span className={styles.chevron}>▼</span>}
        {collapsed && <span className={styles.chevron}>▲</span>}
      </button>

      {!collapsed && (
        <div className={styles.body}>
          {processes.map((p) => (
            <div key={p.id} className={styles.process}>
              <span className={styles.dot} style={{ color: statusDot(p.status) }}>●</span>
              <span className={styles.label}>{p.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
