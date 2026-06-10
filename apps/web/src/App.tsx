import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGameStore } from './store/gameStore.ts'
import { useSettingsStore } from './store/settingsStore.ts'
import { BootScreen } from './screens/BootScreen/BootScreen.tsx'
import { PrologueScreen, BOND_SIGNED_KEY } from './screens/PrologueScreen/PrologueScreen.tsx'
import { OperativeIntroScreen } from './screens/OperativeIntroScreen/OperativeIntroScreen.tsx'
import { LoginScreen } from './screens/LoginScreen/LoginScreen.tsx'
import { DesktopScreen } from './screens/DesktopScreen/DesktopScreen.tsx'
import { TraceAmbient } from './components/TraceAmbient/TraceAmbient.tsx'
import { ConnectionEffect } from './components/ConnectionEffect/ConnectionEffect.tsx'
import { startAutoSave, getActiveSession, loadGame } from './store/persistence.ts'

export function App() {
  const screen    = useGameStore((s) => s.screen)
  const setScreen = useGameStore((s) => s.setScreen)
  const theme      = useSettingsStore((s) => s.theme)
  const uiScale    = useSettingsStore((s) => s.uiScale)
  const lowQuality = useSettingsStore((s) => s.lowQuality)
  const crtMode    = useSettingsStore((s) => s.crtMode)

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // L6 — Apply quality preset to document root. CSS rules under
  // [data-quality=low] strip backdrop-filter blurs (cheap GPU win).
  useEffect(() => {
    document.documentElement.setAttribute('data-quality', lowQuality ? 'low' : 'high')
  }, [lowQuality])

  // P4 — CRT / scanline mode. data-crt attribute on root drives the overlay.
  useEffect(() => {
    document.documentElement.setAttribute('data-crt', crtMode ? 'on' : 'off')
  }, [crtMode])

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
      // M14r — Prologue plays on every visit UNTIL the player completes signup.
      // The only gate is "compact signed" — set when an operative is actually
      // bound. Seeing the old prologue does NOT count as having signed up.
      let bondSigned = false
      try {
        bondSigned = !!localStorage.getItem(BOND_SIGNED_KEY)
        // Migrate testers who signed the old "Compact" key before the rename.
        if (!bondSigned && localStorage.getItem('voidlink_compact_signed')) {
          localStorage.setItem(BOND_SIGNED_KEY, '1')
          localStorage.removeItem('voidlink_compact_signed')
          bondSigned = true
        }
        // Clear the legacy one-shot key so existing testers get the new flow.
        localStorage.removeItem('voidlink_prologue_seen')
      } catch { /**/ }
      setScreen(bondSigned ? 'login' : 'prologue')
    }, 3200)
    return () => clearTimeout(t)
  }, [setScreen])

  return (
    <>
      <AnimatePresence mode="wait">
        {screen === 'boot'     && <BootScreen           key="boot" />}
        {screen === 'prologue' && <PrologueScreen       key="prologue" />}
        {screen === 'login'    && <LoginScreen          key="login" />}
        {screen === 'intro'    && <OperativeIntroScreen key="intro" />}
        {screen === 'desktop'  && <DesktopScreen        key="desktop" />}
      </AnimatePresence>
      <TraceAmbient />
      {screen === 'desktop' && <ConnectionEffect />}
      {/* P4 — CRT / scanline overlay. Pointer-events:none; renders only when
          data-crt=on on the root. Effect is pure CSS — zero perf when off. */}
      {crtMode && <div className="crt-overlay" aria-hidden="true" />}
    </>
  )
}
