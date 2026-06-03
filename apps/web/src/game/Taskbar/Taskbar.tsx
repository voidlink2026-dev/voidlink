import { useState, useEffect } from 'react'
import { useGameStore } from '../../store/gameStore.ts'
import type { WorldEvent } from '../../store/gameStore.ts'
import { TraceBar } from '@voidlink/ui'
import { computeEffectiveRate } from '@voidlink/core'
import { AudioEngine } from '../Audio/audioEngine.ts'
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
  { id: 'news',        label: 'NEWS',       title: 'VOIDLINK NEWSFEED',   component: 'NewsFeed',         width: 500, height: 300 },
  { id: 'inbox',       label: 'INBOX',      title: 'ENCRYPTED INBOX',     component: 'EmailInbox',       width: 720, height: 480 },
  { id: 'shop',        label: 'SHOP',       title: 'UPGRADE SHOP',        component: 'UpgradeShop',      width: 1280, height: 620 },
  { id: 'profile',     label: 'PROFILE',    title: 'OPERATIVE PROFILE',   component: 'ProfileWindow',    width: 480, height: 560 },
  { id: 'world-map',   label: 'WORLD MAP',  title: 'GLOBAL NETWORK MAP',  component: 'WorldMap',         width: 820, height: 580 },
  { id: 'bounce-chain', label: 'RELAY',     title: 'RELAY CHAIN',         component: 'BounceChainWindow', width: 340, height: 240 },
  { id: 'network-map', label: 'NETWORK',    title: 'NETWORK MAP',         component: 'NetworkMap',       width: 660, height: 460, requiresActiveNetwork: true },
  { id: 'hacking',     label: 'HACK TOOLS', title: 'HACKING INTERFACE',   component: 'HackingInterface', width: 480, height: 360 },
]

let CASCADE = 0
function nextPos() {
  const offset = (CASCADE % 6) * 28
  CASCADE++
  return { x: 80 + offset, y: 60 + offset }
}

// Voidlink Standard Time — a single global game-clock shared by every
// operative, anchored in core/engine/worldClock.ts. Updates once per second.
import { formatWorldClock } from '@voidlink/core'

function useGameClock() {
  const [display, setDisplay] = useState(() => formatWorldClock())
  useEffect(() => {
    const id = setInterval(() => setDisplay(formatWorldClock()), 1000)
    return () => clearInterval(id)
  }, [])
  return display
}

export function Taskbar() {
  const player           = useGameStore((s) => s.player)
  const traceState       = useGameStore((s) => s.traceState)
  const activeNetworkId  = useGameStore((s) => s.activeNetworkId)
  const activeWorldEvents = useGameStore((s) => s.activeWorldEvents)
  const windows          = useGameStore((s) => s.activeWindows)
  const focusedId        = useGameStore((s) => s.focusedWindowId)
  const focusWindow      = useGameStore((s) => s.focusWindow)
  const minimizeWindow   = useGameStore((s) => s.minimizeWindow)
  const openWindow       = useGameStore((s) => s.openWindow)
  const resetWindowLayout = useGameStore((s) => s.resetWindowLayout)
  const logout           = useGameStore((s) => s.logout)

  const gameClock = useGameClock()

  function worldEventPillClass(evt: WorldEvent): string {
    const e = evt.effect
    if (e.type === 'trace_rate_delta') return e.delta < 0 ? styles.pillGood : styles.pillBad
    if (e.type === 'shop_discount')    return styles.pillShop
    if (e.type === 'reward_boost')     return styles.pillReward
    return styles.pillRival
  }

  function launch(app: AppDef) {
    const pos = nextPos()
    openWindow({
      id: app.id, title: app.title, component: app.component,
      x: pos.x, y: pos.y, width: app.width, height: app.height, isMinimized: false,
    })
    AudioEngine.playSfx('windowOpen')
  }

  function openSettings() {
    const isOpen = windows.some((w) => w.id === 'settings')
    if (isOpen) { focusWindow('settings'); return }
    openWindow({ id: 'settings', title: 'SETTINGS', component: 'SettingsWindow', x: 200, y: 80, width: 360, height: 500, isMinimized: false })
    AudioEngine.playSfx('windowOpen')
  }

  return (
    <div className={styles.taskbar} role="toolbar" aria-label="Taskbar" data-tutorial="taskbar">

      {/* Left: app launcher — also acts as focus/minimise toggle when the window is open */}
      <div className={styles.launcher} role="group" aria-label="App launcher">
        {APPS.map((app) => {
          const disabled = app.requiresActiveNetwork && !activeNetworkId
          const openWin  = windows.find((w) => w.id === app.id)
          const isOpen     = !!openWin
          const isFocused  = openWin && focusedId === app.id && !openWin.isMinimized
          const isMinimised = openWin?.isMinimized ?? false
          return (
            <button
              key={app.id}
              className={`${styles.launchBtn} ${isOpen ? styles.launchBtnOpen : ''} ${isFocused ? styles.launchBtnFocused : ''} ${isMinimised ? styles.launchBtnMin : ''}`}
              onClick={() => {
                // Currently focused + visible → minimise
                if (openWin && !openWin.isMinimized && isFocused) {
                  minimizeWindow(app.id)
                  return
                }
                // Otherwise launch() — covers brand-new open, restore-from-minimised,
                // and focus-from-background. openWindow store action handles all three.
                launch(app)
              }}
              disabled={disabled}
              title={disabled ? `${app.title} — no active connection` : app.title}
              aria-label={`Open ${app.title}`}
              data-tutorial={`btn-${app.id}`}
              aria-pressed={isFocused}
            >
              {app.label}
              {isOpen && <span className={styles.openDot} aria-hidden="true" />}
            </button>
          )
        })}
      </div>

      {/* Centre: only ad-hoc windows that aren't in the APPS launcher (settings, bank, target-info) */}
      <div className={styles.centre}>
        {windows
          .filter((w) => !APPS.some((a) => a.id === w.id))
          .map((win) => {
            const isActive = win.id === focusedId && !win.isMinimized
            return (
              <button
                key={win.id}
                className={`${styles.winBtn} ${isActive ? styles.winBtnActive : ''} ${win.isMinimized ? styles.winBtnMinimized : ''}`}
                onClick={() => {
                  if (win.isMinimized || win.id !== focusedId) focusWindow(win.id)
                  else minimizeWindow(win.id)
                }}
                title={win.title}
                aria-pressed={isActive}
              >
                {win.title}
              </button>
            )
          })}
      </div>

      {/* World events pills */}
      {activeWorldEvents.length > 0 && (
        <div className={styles.worldEvents} aria-label="Active global events">
          {activeWorldEvents.map((evt) => (
            <div
              key={evt.id}
              className={`${styles.worldPill} ${worldEventPillClass(evt)}`}
              title={evt.description}
              aria-label={`${evt.name}: ${evt.description}`}
            >
              <span className={styles.pillPulse} aria-hidden="true" />
              {evt.shortLabel}
            </div>
          ))}
        </div>
      )}

      {/* Right: clock + trace + stats */}
      <div className={styles.right} data-tutorial="taskbar-status">
        {gameClock && (
          <div className={styles.gameClock} aria-label="In-game date and time">{gameClock}</div>
        )}
        {traceState ? (
          <TraceBar
            level={traceState.level}
            status={traceState.status}
            rate={computeEffectiveRate(traceState)}
            className={styles.traceBar}
          />
        ) : (
          <div className={styles.noTrace}>NO ACTIVE CONNECTION</div>
        )}
        <div className={styles.playerStats}>
          <span className={styles.handle}>{player?.handle ?? '—'}</span>
          <span className={styles.credits}>{player?.credits.toLocaleString() ?? '0'} Cr</span>
          <span className={styles.rep}>REP {player?.reputation ?? 0}</span>
        </div>
      </div>

      {/* Layout reset */}
      <button className={styles.resetBtn} onClick={resetWindowLayout} title="Cascade all open windows" aria-label="Reset window layout">⊞</button>

      {/* Settings */}
      <button className={styles.settingsBtn} onClick={openSettings} title="Settings" aria-label="Open settings" data-tutorial="btn-settings">⚙</button>

      {/* Logout */}
      <button
        className={styles.logoutBtn}
        onClick={logout}
        title="Save and disconnect from Voidlink"
        aria-label="Log out"
        disabled={!!traceState}
      >
        ⏻
      </button>
    </div>
  )
}
