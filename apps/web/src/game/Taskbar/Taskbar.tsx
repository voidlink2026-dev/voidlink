import { useGameStore } from '../../store/gameStore.ts'
import { TraceBar } from '@uplink/ui'
import styles from './Taskbar.module.css'

interface AppDef {
  id: string
  label: string
  title: string
  component: string
  width: number
  height: number
  requiresActiveNetwork?: boolean
}

const APPS: AppDef[] = [
  { id: 'terminal',    label: 'TERMINAL',   title: 'SYSTEM TERMINAL',    component: 'WelcomeTerminal',  width: 520, height: 300 },
  { id: 'missions',    label: 'MISSIONS',   title: 'MISSION BOARD',       component: 'MissionBoard',     width: 560, height: 480 },
  { id: 'shop',        label: 'SHOP',       title: 'UPGRADE SHOP',        component: 'UpgradeShop',      width: 540, height: 500 },
  { id: 'profile',     label: 'PROFILE',    title: 'OPERATIVE PROFILE',   component: 'ProfileWindow',    width: 480, height: 520 },
  { id: 'network-map', label: 'NETWORK',    title: 'NETWORK MAP',         component: 'NetworkMap',       width: 660, height: 460, requiresActiveNetwork: true },
  { id: 'hacking',     label: 'HACK TOOLS', title: 'HACKING INTERFACE',   component: 'HackingInterface', width: 380, height: 360, requiresActiveNetwork: true },
]

// Cascade offset so multiple windows don't stack exactly on top of each other
let CASCADE = 0
function nextPos() {
  const offset = (CASCADE % 6) * 28
  CASCADE++
  return { x: 80 + offset, y: 60 + offset }
}

export function Taskbar() {
  const player = useGameStore((s) => s.player)
  const traceState = useGameStore((s) => s.traceState)
  const activeNetworkId = useGameStore((s) => s.activeNetworkId)
  const windows = useGameStore((s) => s.activeWindows)
  const focusedId = useGameStore((s) => s.focusedWindowId)
  const focusWindow = useGameStore((s) => s.focusWindow)
  const minimizeWindow = useGameStore((s) => s.minimizeWindow)
  const openWindow = useGameStore((s) => s.openWindow)

  function launch(app: AppDef) {
    const pos = nextPos()
    openWindow({
      id: app.id,
      title: app.title,
      component: app.component,
      x: pos.x,
      y: pos.y,
      width: app.width,
      height: app.height,
      isMinimized: false,
    })
  }

  return (
    <div className={styles.taskbar} role="toolbar" aria-label="Taskbar">

      {/* Left: app launcher buttons */}
      <div className={styles.launcher} role="group" aria-label="App launcher">
        {APPS.map((app) => {
          const disabled = app.requiresActiveNetwork && !activeNetworkId
          const isOpen = windows.some((w) => w.id === app.id)
          return (
            <button
              key={app.id}
              className={`${styles.launchBtn} ${isOpen ? styles.launchBtnOpen : ''}`}
              onClick={() => launch(app)}
              disabled={disabled}
              title={disabled ? `${app.title} — no active connection` : app.title}
              aria-label={`Open ${app.title}`}
            >
              {app.label}
              {isOpen && <span className={styles.openDot} aria-hidden="true" />}
            </button>
          )
        })}
      </div>

      {/* Centre: open window buttons */}
      <div className={styles.centre}>
        {windows.map((win) => {
          const isActive = win.id === focusedId && !win.isMinimized
          return (
            <button
              key={win.id}
              className={`${styles.winBtn} ${isActive ? styles.winBtnActive : ''} ${win.isMinimized ? styles.winBtnMinimized : ''}`}
              onClick={() => {
                if (win.isMinimized || win.id !== focusedId) {
                  focusWindow(win.id)
                } else {
                  minimizeWindow(win.id)
                }
              }}
              title={win.title}
              aria-pressed={isActive}
            >
              {win.title}
            </button>
          )
        })}
      </div>

      {/* Right: trace + player stats */}
      <div className={styles.right}>
        {traceState ? (
          <TraceBar level={traceState.level} status={traceState.status} className={styles.traceBar} />
        ) : (
          <div className={styles.noTrace}>NO ACTIVE CONNECTION</div>
        )}
        <div className={styles.playerStats}>
          <span className={styles.handle}>{player?.handle ?? '—'}</span>
          <span className={styles.credits}>{player?.credits.toLocaleString() ?? '0'} Cr</span>
          <span className={styles.rep}>REP {player?.reputation ?? 0}</span>
        </div>
      </div>

    </div>
  )
}
