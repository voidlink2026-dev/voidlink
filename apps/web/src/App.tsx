import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGameStore } from './store/gameStore.ts'
import { useSettingsStore } from './store/settingsStore.ts'
import { BootScreen } from './screens/BootScreen/BootScreen.tsx'
import { PrologueScreen, PROLOGUE_SEEN_KEY } from './screens/PrologueScreen/PrologueScreen.tsx'
import { LoginScreen } from './screens/LoginScreen/LoginScreen.tsx'
import { DesktopScreen } from './screens/DesktopScreen/DesktopScreen.tsx'
import { TraceAmbient } from './components/TraceAmbient/TraceAmbient.tsx'
import { ConnectionEffect } from './components/ConnectionEffect/ConnectionEffect.tsx'
import { startAutoSave, getActiveSession, loadGame } from './store/persistence.ts'

export function App() {
  const screen    = useGameStore((s) => s.screen)
  const setScreen = useGameStore((s) => s.setScreen)
  const theme     = useSettingsStore((s) => s.theme)
  const uiScale   = useSettingsStore((s) => s.uiScale)

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Apply UI scale via zoom
  useEffect(() => {
    ;(document.documentElement.style as CSSStyleDeclaration & { zoom: string }).zoom = String(uiScale)
  }, [uiScale])

  useEffect(() => {
    return startAutoSave()
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      const sessionHandle = getActiveSession()
      if (sessionHandle) {
        const restored = loadGame(sessionHandle)
        if (restored) return
      }
      // M14q Sub-sprint A — first-ever boot shows the Prologue before login.
      // Settings can clear `voidlink_prologue_seen` from localStorage to replay it.
      let seen = false
      try { seen = !!localStorage.getItem(PROLOGUE_SEEN_KEY) } catch { /**/ }
      setScreen(seen ? 'login' : 'prologue')
    }, 3200)
    return () => clearTimeout(t)
  }, [setScreen])

  return (
    <>
      <AnimatePresence mode="wait">
        {screen === 'boot'     && <BootScreen     key="boot" />}
        {screen === 'prologue' && <PrologueScreen key="prologue" />}
        {screen === 'login'    && <LoginScreen    key="login" />}
        {screen === 'desktop'  && <DesktopScreen  key="desktop" />}
      </AnimatePresence>
      <TraceAmbient />
      {screen === 'desktop' && <ConnectionEffect />}
    </>
  )
}
