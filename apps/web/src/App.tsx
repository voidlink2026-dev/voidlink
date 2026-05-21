import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGameStore } from './store/gameStore.ts'
import { BootScreen } from './screens/BootScreen/BootScreen.tsx'
import { LoginScreen } from './screens/LoginScreen/LoginScreen.tsx'
import { DesktopScreen } from './screens/DesktopScreen/DesktopScreen.tsx'

export function App() {
  const screen = useGameStore((s) => s.screen)
  const setScreen = useGameStore((s) => s.setScreen)

  // Simulate boot sequence on first load
  useEffect(() => {
    const t = setTimeout(() => setScreen('login'), 3200)
    return () => clearTimeout(t)
  }, [setScreen])

  return (
    <AnimatePresence mode="wait">
      {screen === 'boot' && <BootScreen key="boot" />}
      {screen === 'login' && <LoginScreen key="login" />}
      {screen === 'desktop' && <DesktopScreen key="desktop" />}
    </AnimatePresence>
  )
}
