import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.ts'
import { Window } from '@uplink/ui'
import { Taskbar } from '../../game/Taskbar/Taskbar.tsx'
import { MissionBoard } from '../../game/MissionBoard/MissionBoard.tsx'
import { NetworkMap } from '../../game/NetworkMap/NetworkMap.tsx'
import { HackingInterface } from '../../game/HackingInterface/HackingInterface.tsx'
import { WelcomeTerminal } from '../../game/WelcomeTerminal/WelcomeTerminal.tsx'
import { MissionResult } from '../../game/MissionResult/MissionResult.tsx'
import { UpgradeShop } from '../../game/UpgradeShop/UpgradeShop.tsx'
import { ProfileWindow } from '../../game/ProfileWindow/ProfileWindow.tsx'
import { generateContract } from '@uplink/core'
import styles from './DesktopScreen.module.css'

const WINDOW_COMPONENTS: Record<string, React.ComponentType> = {
  MissionBoard,
  NetworkMap,
  HackingInterface,
  WelcomeTerminal,
  UpgradeShop,
  ProfileWindow,
}

export function DesktopScreen() {
  const windows = useGameStore((s) => s.activeWindows)
  const focusedId = useGameStore((s) => s.focusedWindowId)
  const focusWindow = useGameStore((s) => s.focusWindow)
  const closeWindow = useGameStore((s) => s.closeWindow)
  const minimizeWindow = useGameStore((s) => s.minimizeWindow)
  const openWindow = useGameStore((s) => s.openWindow)
  const loadMissions = useGameStore((s) => s.loadMissions)
  const tickGameLoop = useGameStore((s) => s.tickGameLoop)

  const lastTickRef = useRef<number>(Date.now())

  // Game loop
  useEffect(() => {
    let rafId: number
    function loop() {
      const now = Date.now()
      tickGameLoop(now - lastTickRef.current)
      lastTickRef.current = now
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [tickGameLoop])

  // Seed initial missions and open welcome terminal on mount
  useEffect(() => {
    const missions = [
      generateContract('file_theft', 3, 'corporate_intranet', 0xdeadbeef),
      generateContract('account_deletion', 2, 'personal_gateway', 0xcafebabe),
      generateContract('database_corruption', 5, 'government_classified', 0xf00dface),
      generateContract('network_sabotage', 4, 'corporate_intranet', 0xabad1dea),
      generateContract('bounty_hunt', 1, 'personal_gateway', 0x1337c0de),
    ]
    loadMissions(missions)

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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.desktop} aria-label="Uplink desktop environment">
      {/* Desktop icons row (future) */}
      <div className={styles.windowLayer}>
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
                onClose={closeWindow}
                onMinimize={minimizeWindow}
              >
                {Component ? <Component /> : <div className={styles.placeholder}>Loading…</div>}
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
    </div>
  )
}
