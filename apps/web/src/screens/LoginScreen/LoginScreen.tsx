import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.ts'
import { Button } from '@uplink/ui'
import type { PlayerProfile } from '@uplink/core'
import { loadGame, getSaveInfo, deleteSave, startAutoSave } from '../../store/persistence.ts'
import styles from './LoginScreen.module.css'

export function LoginScreen() {
  const [handle, setHandle] = useState('')
  const [error, setError] = useState('')
  const [saveInfo, setSaveInfo] = useState(getSaveInfo())
  const setScreen = useGameStore((s) => s.setScreen)
  const setPlayer = useGameStore((s) => s.setPlayer)
  const logTerminal = useGameStore((s) => s.logTerminal)

  // Start auto-save once we're on the desktop
  useEffect(() => {
    const stop = startAutoSave()
    return stop
  }, [])

  function handleContinue() {
    const ok = loadGame()
    if (ok) {
      logTerminal('Save restored. Welcome back.', 'success')
    } else {
      setError('SAVE DATA CORRUPTED OR INCOMPATIBLE')
      setSaveInfo(null)
    }
  }

  function handleDeleteSave() {
    deleteSave()
    setSaveInfo(null)
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!handle.trim()) { setError('HANDLE REQUIRED'); return }
    if (handle.length < 3) { setError('HANDLE TOO SHORT — MINIMUM 3 CHARACTERS'); return }

    const newPlayer: PlayerProfile = {
      id: `player_${Date.now()}`,
      username: handle.trim(),
      handle: handle.trim().toUpperCase(),
      avatarId: 'avatar_default',
      createdAt: Date.now(),
      lastSeenAt: Date.now(),
      credits: 5000,
      reputation: 0,
      rank: 1,
      specialization: null,
      factionStandings: [],
      hardware: { cpuSpeed: 1, ramSlots: 2, hddCapacity: 10, modemSpeed: 10, gatewayBandwidth: 10 },
      software: {
        passwordCrackers: [{ toolId: 'cracker_basic', level: 1, version: '1.0' }],
        proxies:          [{ toolId: 'proxy_basic',   level: 1, version: '1.0' }],
        firewallBypassers: [],
        logDeleters:      [{ toolId: 'log_deleter_basic', level: 1, version: '1.0' }],
        portScanners:     [{ toolId: 'port_scanner_basic', level: 1, version: '1.0' }],
        misc: [],
      },
      completedMissions: [],
      activeFlags: {},
      stats: {
        totalMissions: 0, successfulBreaches: 0, traceEscapes: 0,
        traceFailures: 0, creditsEarned: 5000, creditsSpent: 0, hoursPlayed: 0,
      },
    }

    setPlayer(newPlayer)
    logTerminal(`Welcome to Uplink International, ${handle.toUpperCase()}.`, 'success')
    logTerminal('Your gateway has been provisioned. Starting balance: 5,000 Cr.', 'system')
    logTerminal('Open MISSIONS to browse available contracts.', 'system')
    setScreen('desktop')
  }

  const saveDate = saveInfo
    ? new Date(saveInfo.savedAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
    : null

  return (
    <motion.div
      className={styles.login}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.panel}>
        <div className={styles.logo}>
          <span className={styles.logoMain}>UPLINK</span>
          <span className={styles.logoSub}>NEXT GENERATION</span>
        </div>

        <div className={styles.divider} />

        {/* Continue from save */}
        {saveInfo && (
          <div className={styles.savePanel}>
            <div className={styles.saveMeta}>
              <span className={styles.saveHandle}>{saveInfo.handle}</span>
              <span className={styles.saveDate}>Last session: {saveDate}</span>
            </div>
            <div className={styles.saveActions}>
              <Button variant="primary" size="md" onClick={handleContinue}>
                CONTINUE
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDeleteSave}>
                DELETE SAVE
              </Button>
            </div>
          </div>
        )}

        {saveInfo && <div className={styles.orDivider}><span>— OR CREATE NEW OPERATIVE —</span></div>}

        <p className={styles.intro}>
          UPLINK INTERNATIONAL — ANONYMOUS CONTRACTOR NETWORK
          <br />
          <span className={styles.muted}>All connections encrypted. All identities protected.</span>
        </p>

        <form className={styles.form} onSubmit={handleLogin}>
          <label className={styles.label} htmlFor="handle">OPERATIVE HANDLE</label>
          <input
            id="handle"
            className={styles.input}
            type="text"
            value={handle}
            onChange={(e) => { setHandle(e.target.value); setError('') }}
            placeholder="enter your handle"
            autoFocus={!saveInfo}
            autoComplete="off"
            spellCheck={false}
            maxLength={24}
            aria-describedby={error ? 'login-error' : undefined}
          />
          {error && <span id="login-error" className={styles.error} role="alert">{error}</span>}
          <Button type="submit" variant={saveInfo ? 'secondary' : 'primary'} size="lg" className={styles.submitBtn}>
            NEW OPERATIVE
          </Button>
        </form>

        <p className={styles.disclaimer}>
          By connecting you acknowledge that all activities conducted through this network are entirely your own responsibility.
        </p>
      </div>
    </motion.div>
  )
}
