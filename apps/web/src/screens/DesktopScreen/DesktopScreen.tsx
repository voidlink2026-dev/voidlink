import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.ts'
import { Window } from '@voidlink/ui'
import { AudioEngine } from '../../game/Audio/audioEngine.ts'
import { Taskbar } from '../../game/Taskbar/Taskbar.tsx'
import { MissionBoard } from '../../game/MissionBoard/MissionBoard.tsx'
import { HackingInterface } from '../../game/HackingInterface/HackingInterface.tsx'
import { WelcomeTerminal } from '../../game/WelcomeTerminal/WelcomeTerminal.tsx'
import { MissionResult } from '../../game/MissionResult/MissionResult.tsx'
import { UpgradeShop } from '../../game/UpgradeShop/UpgradeShop.tsx'
import { ProfileWindow } from '../../game/ProfileWindow/ProfileWindow.tsx'
import { TutorialOverlay } from '../../game/Tutorial/TutorialOverlay.tsx'
import { NewsFeed } from '../../game/NewsFeed/NewsFeed.tsx'
import { SettingsWindow } from '../../game/Settings/SettingsWindow.tsx'
import { BankWindow } from '../../game/Bank/BankWindow.tsx'
import { SpecializationOverlay } from '../../game/SpecializationOverlay/SpecializationOverlay.tsx'
import { SystemConsole } from '../../game/SystemConsole/SystemConsole.tsx'
import { generateContract, STORY_MISSIONS } from '@voidlink/core'
import { DataRain } from '../../components/DataRain/DataRain.tsx'
import styles from './DesktopScreen.module.css'

// Three.js components — lazy-load (~600KB)
const NetworkMap = lazy(() =>
  import('../../game/NetworkMap/NetworkMap.tsx').then((m) => ({ default: m.NetworkMap })),
)
const WorldMap = lazy(() =>
  import('../../game/WorldMap/WorldMap.tsx').then((m) => ({ default: m.WorldMap })),
)

const WINDOW_COMPONENTS: Record<string, React.ComponentType> = {
  MissionBoard,
  NetworkMap,
  WorldMap,
  HackingInterface,
  WelcomeTerminal,
  UpgradeShop,
  ProfileWindow,
  NewsFeed,
  SettingsWindow,
  BankWindow,
}

export function DesktopScreen() {
  const windows = useGameStore((s) => s.activeWindows)
  const focusedId = useGameStore((s) => s.focusedWindowId)
  const focusWindow = useGameStore((s) => s.focusWindow)
  const closeWindow = useGameStore((s) => s.closeWindow)
  const minimizeWindow = useGameStore((s) => s.minimizeWindow)
  const openWindow = useGameStore((s) => s.openWindow)
  const saveWindowPosition = useGameStore((s) => s.saveWindowPosition)
  const loadMissions = useGameStore((s) => s.loadMissions)
  const loadInitialNews = useGameStore((s) => s.loadInitialNews)
  const tickGameLoop = useGameStore((s) => s.tickGameLoop)

  const traceState = useGameStore((s) => s.traceState)
  const activeMissionId = useGameStore((s) => s.activeMissionId)
  const lastTickRef = useRef<number>(Date.now())
  const [zoom, setZoom] = useState(1.0)
  const initDone = useRef(false)

  // Global UI click SFX
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const el = e.target as HTMLElement
      if (el.closest('button') || el.closest('[role="switch"]')) AudioEngine.playSfx('click')
    }
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [])

  // Ambient audio on desktop mount — preload idle music immediately
  useEffect(() => {
    AudioEngine.init()
    AudioEngine.startAmbient()
    void AudioEngine.loadIdleMusic()
    AudioEngine.startIdleMusic()
    return () => {
      AudioEngine.stopAmbient()
      AudioEngine.stopIdleMusic()
    }
  }, [])

  // Idle music: fade out when a mission is active, fade back in when idle
  useEffect(() => {
    if (activeMissionId) {
      AudioEngine.stopIdleMusic()
    } else {
      AudioEngine.startIdleMusic()
    }
  }, [activeMissionId])

  // Trace alarm synced to trace level
  useEffect(() => {
    if (traceState) {
      AudioEngine.setTraceLevel(traceState.level)
    } else {
      AudioEngine.stopTraceAlarm()
    }
  }, [traceState?.level])

  // Game loop — 20 fps interval (50 ms). Pauses when the tab is hidden.
  // Also ticks bank interest accrual every loop iteration.
  const tickBankInterest = useGameStore((s) => s.tickBankInterest)
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null
    function tick() {
      const now = Date.now()
      tickGameLoop(now - lastTickRef.current)
      lastTickRef.current = now
      tickBankInterest()
    }
    function start() {
      if (intervalId) return
      lastTickRef.current = Date.now()
      intervalId = setInterval(tick, 50)
    }
    function stop() { if (intervalId) { clearInterval(intervalId); intervalId = null } }
    function onVis() { if (document.hidden) stop(); else start() }
    start()
    document.addEventListener('visibilitychange', onVis)
    return () => { stop(); document.removeEventListener('visibilitychange', onVis) }
  }, [tickGameLoop, tickBankInterest])

  // Ctrl+scroll zooms the entire window layer (railway.com-style)
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      if (!e.ctrlKey) return
      e.preventDefault()
      setZoom((prev) => Math.min(2.0, Math.max(0.4, prev - e.deltaY * 0.001)))
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  // Seed initial missions and open welcome terminal on mount
  useEffect(() => {
    if (initDone.current) return
    initDone.current = true
    const player = useGameStore.getState().player
    const completedIds = player?.completedMissions ?? []

    const flags = player?.activeFlags ?? {}

    const unlockedStoryMissions = STORY_MISSIONS.filter((sm) => {
      if (completedIds.includes(sm.id)) return false // already done — never re-show
      const req = sm.unlockRequirement
      if (req.completedMissionIds?.length) {
        if (!req.completedMissionIds.every((id) => completedIds.includes(id))) return false
      }
      if (req.requiredFlagValue) {
        const { flag, value } = req.requiredFlagValue
        if (flags[flag] !== value) return false
      }
      return true
    })

    const existingMissions = useGameStore.getState().missions
    if (existingMissions.length > 0) {
      // Loaded from save: inject any newly unlocked story missions not already present
      const existingIds = new Set(existingMissions.map((m) => m.id))
      const newStory = unlockedStoryMissions.filter((sm) => !existingIds.has(sm.id))
      if (newStory.length > 0) {
        loadMissions([...existingMissions, ...newStory])
      }
    } else {
      // Fresh session: generate full mission pool
      const missions = [
        ...unlockedStoryMissions,
        generateContract('file_theft', 3, 'corporate_intranet', 0xdeadbeef),
        generateContract('account_deletion', 2, 'personal_gateway', 0xcafebabe),
        generateContract('database_corruption', 5, 'government_classified', 0xf00dface),
        generateContract('network_sabotage', 4, 'corporate_intranet', 0xabad1dea),
        generateContract('bounty_hunt', 1, 'personal_gateway', 0x1337c0de),
      ]
      loadMissions(missions)
    }

    loadInitialNews()

    openWindow({
      id: 'news',
      title: 'VOIDLINK NEWSFEED',
      component: 'NewsFeed',
      x: 80,
      y: 380,
      width: 500,
      height: 300,
      isMinimized: false,
    })

    openWindow({
      id: 'welcome',
      title: 'SYSTEM TERMINAL',
      component: 'WelcomeTerminal',
      x: 80,
      y: 60,
      width: 520,
      height: 300,
      isMinimized: false,
    })

    openWindow({
      id: 'missions',
      title: 'MISSION BOARD',
      component: 'MissionBoard',
      x: 640,
      y: 60,
      width: 560,
      height: 480,
      isMinimized: false,
    })

    openWindow({
      id: 'profile',
      title: 'OPERATIVE PROFILE',
      component: 'ProfileWindow',
      x: 1220,
      y: 60,
      width: 380,
      height: 520,
      isMinimized: false,
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className={styles.desktop} aria-label="Voidlink desktop environment">
      <DataRain opacity={0.04} speed={0.18} fontSize={12} style={{ zIndex: 0 }} />

      <div
        className={styles.windowLayer}
        data-tutorial="window-layer"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
          width: `${100 / zoom}%`,
          height: `${100 / zoom}%`,
        }}
      >
        <AnimatePresence>
          {windows.map((win) => {
            const Component = WINDOW_COMPONENTS[win.component]
            return (
              <Window
                key={win.id}
                id={win.id}
                title={win.title}
                initialX={win.x}
                initialY={win.y}
                initialWidth={win.width}
                initialHeight={win.height}
                isActive={win.id === focusedId}
                isMinimized={win.isMinimized}
                zOrder={win.zOrder}
                onFocus={focusWindow}
                onClose={(id) => { AudioEngine.playSfx('windowClose'); closeWindow(id) }}
                onMinimize={minimizeWindow}
                onMove={saveWindowPosition}
              >
                <Suspense fallback={<div className={styles.placeholder}>Loading…</div>}>
                  {Component ? <Component /> : <div className={styles.placeholder}>Loading…</div>}
                </Suspense>
              </Window>
            )
          })}
        </AnimatePresence>
      </div>

      <Taskbar />

      {/* Mission result overlay */}
      <AnimatePresence>
        <MissionResult />
      </AnimatePresence>

      {/* New-player tutorial */}
      <TutorialOverlay />

      {/* Specialization selection — shown once when player reaches Rank 5 */}
      <SpecializationOverlay />

      {/* System console — always visible, shows background processes */}
      <SystemConsole />
    </main>
  )
}
