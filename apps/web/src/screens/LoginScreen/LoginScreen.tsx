import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.ts'
import { Button } from '@voidlink/ui'
import { GlyphDrift } from '../../components/GlyphDrift/GlyphDriftLazy.tsx'
import { AudioEngine } from '../../game/Audio/audioEngine.ts'
import type { PlayerProfile } from '@voidlink/core'
import {
  loadGame,
  getAllSaveMeta,
  deleteSave,
  registerOperative,
  hashPassword,
  verifyPassword,
  setActiveSession,
  updatePassword,
  findSaveByEmail,
  type SaveMeta,
} from '../../store/persistence.ts'

function gen6DigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
import styles from './LoginScreen.module.css'

const RANK_LABELS = ['', 'NOVICE', 'FREELANCER', 'SPECIALIST', 'OPERATIVE', 'ELITE', 'SHADOW', 'PHANTOM']

type PendingSignup = { player: PlayerProfile; passwordHash: string; code: string }
type PendingReset  = { handle: string; email: string; code: string }

export function LoginScreen() {
  const [mode, setMode] = useState<'pick' | 'signup' | 'verify' | 'reset'>('pick')
  const [saves, setSaves] = useState<SaveMeta[]>([])

  // Signup fields
  const [handle, setHandle] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Verify (signup confirmation)
  const [pendingSignup, setPendingSignup] = useState<PendingSignup | null>(null)
  const [verifyCode, setVerifyCode] = useState('')

  // Reset
  const [resetEmail, setResetEmail] = useState('')
  const [resetStep, setResetStep] = useState<'request' | 'code'>('request')
  const [pendingReset, setPendingReset] = useState<PendingReset | null>(null)
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')

  // M14r — diegetic Bond signing
  const [bondOpen, setCompactOpen] = useState(false)
  const [bondAgreed, setCompactAgreed] = useState(false)

  // Per-card connect password
  const [connectingHandle, setConnectingHandle] = useState<string | null>(null)
  const [connectPassword, setConnectPassword] = useState('')

  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const setScreen = useGameStore((s) => s.setScreen)
  const setPlayer = useGameStore((s) => s.setPlayer)
  const logTerminal = useGameStore((s) => s.logTerminal)

  useEffect(() => {
    const all = getAllSaveMeta()
    setSaves(all)
    if (all.length === 0) setMode('signup')
  }, [])

  function resetConnectState() {
    setConnectingHandle(null)
    setConnectPassword('')
    setError('')
  }

  async function handleConnect(meta: SaveMeta) {
    AudioEngine.init()   // create AudioContext inside the user gesture
    setError('')
    if (meta.passwordHash) {
      // Password required — show inline prompt first
      if (connectingHandle !== meta.handle) {
        setConnectingHandle(meta.handle)
        setConnectPassword('')
        return
      }
      // Verify password
      setLoading(true)
      const ok = await verifyPassword(connectPassword, meta.passwordHash)
      setLoading(false)
      if (!ok) {
        setError('INCORRECT PASSWORD')
        return
      }
    }
    // Load save
    const loaded = loadGame(meta.handle)
    if (loaded) {
      logTerminal(`Welcome back, ${meta.handle}.`, 'success')
    } else {
      setError(`SAVE DATA FOR ${meta.handle} CORRUPTED`)
      setSaves(getAllSaveMeta())
      resetConnectState()
    }
  }

  function handleDeleteSave(meta: SaveMeta) {
    deleteSave(meta.handle)
    const updated = getAllSaveMeta()
    setSaves(updated)
    setConfirmDelete(null)
    resetConnectState()
    if (updated.length === 0) setMode('signup')
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    AudioEngine.init()   // create AudioContext inside the user gesture
    setError('')

    const trimHandle = handle.trim()
    const trimUser = username.trim()

    if (!trimHandle) { setError('HANDLE REQUIRED'); return }
    if (trimHandle.length < 3) { setError('HANDLE TOO SHORT — MINIMUM 3 CHARACTERS'); return }
    if (!/^[a-zA-Z0-9_\-]+$/.test(trimHandle)) {
      setError('HANDLE — LETTERS, NUMBERS, UNDERSCORES AND HYPHENS ONLY')
      return
    }
    if (!trimUser) { setError('USERNAME REQUIRED'); return }
    if (trimUser.length < 3) { setError('USERNAME TOO SHORT — MINIMUM 3 CHARACTERS'); return }

    const existing = getAllSaveMeta()
    if (existing.some((m) => m.handle.toLowerCase() === trimHandle.toLowerCase())) {
      setError('HANDLE ALREADY REGISTERED — CHOOSE ANOTHER')
      return
    }
    if (existing.some((m) => m.username.toLowerCase() === trimUser.toLowerCase())) {
      setError('USERNAME ALREADY TAKEN — CHOOSE ANOTHER')
      return
    }

    const trimEmail = email.trim().toLowerCase()
    if (!trimEmail) { setError('EMAIL REQUIRED'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimEmail)) {
      setError('INVALID EMAIL ADDRESS')
      return
    }
    if (existing.some((m) => m.email?.toLowerCase() === trimEmail)) {
      setError('EMAIL ALREADY REGISTERED')
      return
    }

    if (!password) { setError('PASSWORD REQUIRED'); return }
    if (password.length < 6) { setError('PASSWORD TOO SHORT — MINIMUM 6 CHARACTERS'); return }
    if (!/[!@#$%^&*()\-_=+\[\]{};':",.<>/?\\|`~]/.test(password)) {
      setError('PASSWORD MUST CONTAIN AT LEAST ONE SPECIAL CHARACTER')
      return
    }
    if (password !== confirmPassword) { setError('PASSWORDS DO NOT MATCH'); return }

    setLoading(true)
    const pwHash = await hashPassword(password)
    setLoading(false)

    const newPlayer: PlayerProfile = {
      id: `player_${Date.now()}`,
      username: trimUser.toLowerCase(),
      handle: trimHandle.toUpperCase(),
      email: trimEmail,
      avatarId: 'avatar_default',
      createdAt: Date.now(),
      lastSeenAt: Date.now(),
      credits: 5000,
      reputation: 0,
      rank: 1,
      specialization: null,
      factionStandings: [
        { factionId: 'voidlink_international', score: 10, rank: 'CONTRACTOR' },
        { factionId: 'arunmor', score: 0, rank: 'UNKNOWN' },
        { factionId: 'ares_division', score: 0, rank: 'UNKNOWN' },
        { factionId: 'underground', score: 0, rank: 'UNKNOWN' },
        { factionId: 'the_nameless', score: 0, rank: 'UNDETECTED' },
      ],
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
        xp: 0, level: 1,
      },
      faction: null,
      bounceLibrary: [
        { id: 'bounce_oslo_01',      label: 'UNI PROXY — OSLO',           region: 'EU-NORTH',   tier: 1, logStatus: 'clean', addedAt: Date.now() },
        { id: 'bounce_singapore_01', label: 'FREELANCE HOST — SINGAPORE', region: 'APAC',       tier: 1, logStatus: 'clean', addedAt: Date.now() },
        { id: 'bounce_amsterdam_01', label: 'CORP ENDPOINT — AMSTERDAM',  region: 'EU-WEST',    tier: 2, logStatus: 'clean', addedAt: Date.now() },
      ],
    }

    // Stage signup — require email confirmation before committing the save
    const code = gen6DigitCode()
    setPendingSignup({ player: newPlayer, passwordHash: pwHash, code })
    setVerifyCode('')
    setMode('verify')
  }

  async function handleVerifySignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!pendingSignup) { setError('NO PENDING REGISTRATION'); return }
    if (verifyCode.trim() !== pendingSignup.code) {
      setError('INCORRECT CODE — CHECK YOUR INBOX')
      return
    }
    const { player: newPlayer, passwordHash: pwHash } = pendingSignup
    registerOperative(newPlayer, pwHash)
    setActiveSession(newPlayer.handle)
    setPlayer(newPlayer)
    setPendingSignup(null)
    // M14r — mark Bond as signed so the Prologue stops replaying
    try { localStorage.setItem('voidlink_bond_signed', String(Date.now())) } catch { /**/ }
    logTerminal('VOIDLINK INTERNATIONAL — Bond bound. Hardware identity hash recorded.', 'system')
    logTerminal(`Handle: ${newPlayer.handle} · You are now operative #${(Math.floor(Math.random() * 4000) + 47000).toString()}.`, 'success')
    logTerminal('Onboarding balance: 5,000 Cr. Check inbox for intake confirmation. Open MISSIONS to begin.', 'system')
    // M14r — first-time signup goes through the Operative Intro before the desktop.
    let introSeen = false
    try { introSeen = !!localStorage.getItem('voidlink_operative_intro_seen') } catch { /**/ }
    setScreen(introSeen ? 'desktop' : 'intro')
  }

  function handleResendCode() {
    if (!pendingSignup) return
    setPendingSignup({ ...pendingSignup, code: gen6DigitCode() })
    setVerifyCode('')
    setError('')
  }

  function handleCancelVerify() {
    setPendingSignup(null)
    setVerifyCode('')
    setError('')
    setMode('signup')
  }

  // ── Password reset ──────────────────────────────────────────────────────────
  function startResetFlow() {
    setMode('reset')
    setResetStep('request')
    setResetEmail('')
    setResetCode('')
    setNewPassword('')
    setNewPasswordConfirm('')
    setPendingReset(null)
    setError('')
  }

  function handleResetRequest(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const e2 = resetEmail.trim().toLowerCase()
    if (!e2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e2)) {
      setError('INVALID EMAIL ADDRESS')
      return
    }
    const target = findSaveByEmail(e2)
    if (!target) {
      setError('NO OPERATIVE FOUND FOR THAT EMAIL')
      return
    }
    setPendingReset({ handle: target.handle, email: e2, code: gen6DigitCode() })
    setResetStep('code')
  }

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!pendingReset) { setError('NO PENDING RESET'); return }
    if (resetCode.trim() !== pendingReset.code) { setError('INCORRECT CODE'); return }
    if (!newPassword || newPassword.length < 6) { setError('PASSWORD TOO SHORT — MINIMUM 6 CHARACTERS'); return }
    if (!/[!@#$%^&*()\-_=+\[\]{};':",.<>/?\\|`~]/.test(newPassword)) {
      setError('PASSWORD MUST CONTAIN AT LEAST ONE SPECIAL CHARACTER')
      return
    }
    if (newPassword !== newPasswordConfirm) { setError('PASSWORDS DO NOT MATCH'); return }

    setLoading(true)
    const pwHash = await hashPassword(newPassword)
    const ok = updatePassword(pendingReset.handle, pwHash)
    setLoading(false)

    if (!ok) { setError('RESET FAILED — TRY AGAIN'); return }

    setPendingReset(null)
    setResetStep('request')
    setMode('pick')
    setSaves(getAllSaveMeta())
    setError('')
    logTerminal(`Password reset for ${pendingReset.handle}.`, 'success')
  }

  const saveDate = (meta: SaveMeta) =>
    new Date(meta.savedAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })

  return (
    <motion.main
      className={styles.login}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* M14r-fix — dim the globe behind the form so the text isn't fighting
          the neon. The panel itself now has its own backdrop. */}
      <GlyphDrift opacity={0.35} density={1.0} />

      <div className={styles.panel}>

        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoMain}>VOIDLINK</span>
          <span className={styles.logoSub}>CONTRACTOR INTAKE — GENEVA</span>
        </div>

        <div className={styles.divider} />

        <p className={styles.intro}>
          VOIDLINK INTERNATIONAL — Founded 2183. Geneva.
          <br />
          <span className={styles.muted}>Article XII neutral territory. All connections encrypted. All identities protected.</span>
        </p>

        {/* Tab bar */}
        {saves.length > 0 && (
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${mode === 'pick' ? styles.tabActive : ''}`}
              onClick={() => { setMode('pick'); setError(''); resetConnectState() }}
            >
              EXISTING OPERATIVE
            </button>
            <button
              className={`${styles.tab} ${mode === 'signup' ? styles.tabActive : ''}`}
              onClick={() => { setMode('signup'); setError(''); resetConnectState() }}
            >
              NEW OPERATIVE
            </button>
            {/* Playtester feedback: password reset wasn't discoverable.
                Now a top-level mode you can reach without first selecting
                an existing operative and entering a wrong password. */}
            <button
              className={`${styles.tab} ${mode === 'reset' ? styles.tabActive : ''}`}
              onClick={() => { startResetFlow() }}
              title="Reset your password via email code"
            >
              RECOVER ACCESS
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* --- Existing operative list --- */}
          {mode === 'pick' && (
            <motion.div
              key="pick"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className={styles.saveList}
            >
              {saves.map((meta, idx) => (
                <motion.div
                  key={meta.handle}
                  className={`${styles.saveCard} ${connectingHandle === meta.handle ? styles.saveCardActive : ''}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.22, duration: 0.35, ease: 'easeOut' }}
                  onAnimationStart={() => AudioEngine.playSfx('click')}
                >

                  {confirmDelete === meta.handle ? (
                    <div className={styles.deleteConfirm}>
                      <span className={styles.deleteWarning}>PERMANENTLY DELETE {meta.handle}?</span>
                      <div className={styles.deleteActions}>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteSave(meta)}>DELETE</Button>
                        <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>CANCEL</Button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.saveCardInner}>
                      <div className={styles.saveInfo}>
                        <div className={styles.saveHandle}>{meta.handle}</div>
                        <div className={styles.saveMeta}>
                          <span className={styles.saveRank}>{RANK_LABELS[meta.rank] ?? 'NOVICE'}</span>
                          <span className={styles.saveSep}>·</span>
                          <span className={styles.saveCredits}>{meta.credits.toLocaleString()} Cr</span>
                          <span className={styles.saveSep}>·</span>
                          <span className={styles.saveDate}>{saveDate(meta)}</span>
                        </div>
                      </div>
                      <div className={styles.saveActions}>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => { setConfirmDelete(meta.handle); resetConnectState() }}
                          aria-label={`Delete save for ${meta.handle}`}
                          title="Delete operative"
                        >✕</button>
                      </div>
                    </div>
                  )}

                  {/* Inline password prompt */}
                  {connectingHandle === meta.handle && confirmDelete !== meta.handle && (
                    <form
                      className={styles.connectForm}
                      onSubmit={(e) => { e.preventDefault(); handleConnect(meta) }}
                    >
                      <input
                        className={styles.input}
                        type="password"
                        value={connectPassword}
                        onChange={(e) => { setConnectPassword(e.target.value); setError('') }}
                        placeholder="enter password"
                        autoFocus
                        autoComplete="current-password"
                      />
                      {error && <span className={styles.error} role="alert">{error}</span>}
                      <div className={styles.connectActions}>
                        <Button type="submit" variant="primary" size="sm" disabled={loading}>
                          {loading ? 'VERIFYING…' : 'CONNECT'}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={resetConnectState} type="button">
                          CANCEL
                        </Button>
                        <button
                          type="button"
                          className={styles.forgotLink}
                          onClick={startResetFlow}
                        >FORGOT?</button>
                      </div>
                    </form>
                  )}

                  {/* Connect button (no inline prompt yet, or no password set) */}
                  {connectingHandle !== meta.handle && confirmDelete !== meta.handle && (
                    <div className={styles.connectRow}>
                      <Button variant="primary" size="sm" onClick={() => handleConnect(meta)}>
                        CONNECT
                      </Button>
                    </div>
                  )}

                </motion.div>
              ))}

              {error && connectingHandle === null && (
                <span className={styles.error} role="alert">{error}</span>
              )}
            </motion.div>
          )}

          {/* --- New operative signup (the Bond signing) --- */}
          {mode === 'signup' && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <p className={styles.intakeBlurb}>
                <strong>CONTRACTOR INTAKE.</strong> Voidlink International binds new operatives via cryptographic
                signature against the four-rule <em>Bond</em>. Once signed, the binding is irrevocable.
                Choose your handle carefully. You will be known by it for the rest of your career.
              </p>

              <form className={styles.form} onSubmit={handleSignup} noValidate>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="handle">
                    OPERATIVE HANDLE
                    <span className={styles.fieldHint}>your professional alias — every contract bears this name</span>
                  </label>
                  <input
                    id="handle"
                    className={styles.input}
                    type="text"
                    value={handle}
                    onChange={(e) => { setHandle(e.target.value); setError('') }}
                    placeholder="e.g. CIPHER_7 or NULL_PTR"
                    autoFocus
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={24}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="username">
                    REGISTRY NAME
                    <span className={styles.fieldHint}>private — Voidlink's internal billing ledger only</span>
                  </label>
                  <input
                    id="username"
                    className={styles.input}
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError('') }}
                    placeholder="given name + initial — never disclosed to clients"
                    autoComplete="username"
                    spellCheck={false}
                    maxLength={32}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="email">
                    RELAY ADDRESS
                    <span className={styles.fieldHint}>encrypted — used for the one-time intake handshake only</span>
                  </label>
                  <input
                    id="email"
                    className={styles.input}
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    placeholder="any valid relay — operative@darknet.io"
                    autoComplete="email"
                    spellCheck={false}
                    maxLength={254}
                  />
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="password">
                      PASSWORD
                      <button type="button" className={styles.showBtn} onClick={() => setShowPassword((v) => !v)}>
                        {showPassword ? 'HIDE' : 'SHOW'}
                      </button>
                    </label>
                    <input
                      id="password"
                      className={styles.input}
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError('') }}
                      placeholder="min 6 characters"
                      autoComplete="new-password"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="confirmPassword">CONFIRM</label>
                    <input
                      id="confirmPassword"
                      className={styles.input}
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                      placeholder="repeat password"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                {/* The Bond viewer — collapsible. Encourages reading, doesn't force it. */}
                <div className={styles.bondBox}>
                  <button
                    type="button"
                    className={styles.bondToggle}
                    onClick={() => setCompactOpen((v) => !v)}
                    aria-expanded={bondOpen}
                  >
                    <span className={styles.bondToggleLabel}>
                      {bondOpen ? '▾' : '▸'} THE VOIDLINK COMPACT — read the four rules you are about to sign
                    </span>
                  </button>
                  {bondOpen && (
                    <div className={styles.bondBody}>
                      <p className={styles.bondPara}>
                        To the operatives of the Voidlink International contractor network. By signature you agree to the following,
                        irrevocably, anonymously, and without right of resignation:
                      </p>
                      <p className={styles.bondPara}>
                        <strong>One.</strong> Voidlink International is entitled to its contracted percentage of every transaction
                        effected through the network. This percentage shall be <strong>twelve percent</strong>.
                      </p>
                      <p className={styles.bondPara}>
                        <strong>Two.</strong> Disputes between operatives, between operatives and clients, or between operatives
                        and Voidlink International shall be resolved through <strong>Voidlink arbitration</strong>.
                        Outside enforcement is itself a breach of this Bond. The arbitrator's decision is final.
                      </p>
                      <p className={styles.bondPara}>
                        <strong>Three.</strong> Operatives may take contracts from any client. <strong>Discrimination based on client
                        identity, alignment, or stated purpose is prohibited.</strong> The operative is free to decline.
                        The operative is not free to refuse on the basis of who is asking.
                      </p>
                      <p className={styles.bondPara}>
                        <strong>Four.</strong> Killing other operatives outside the sanctioned arbitration process is grounds for the
                        <strong> immediate, permanent, and public revocation</strong> of operative status. The revocation may include
                        physical sanctions. <strong>No appeal will be heard. No statute of limitations applies.</strong>
                      </p>
                      <p className={styles.bondSig}>
                        Signed by hardware identity hash. Recorded irrevocably. We are not changing this document.<br />
                        — Yaakov Stern, February 2183
                      </p>
                    </div>
                  )}
                </div>

                {/* Bond agreement */}
                <label className={styles.bondCheckbox}>
                  <input
                    type="checkbox"
                    checked={bondAgreed}
                    onChange={(e) => { setCompactAgreed(e.target.checked); setError('') }}
                  />
                  <span>
                    I bind my hardware identity hash to the Voidlink Bond, irrevocably and without right of resignation.
                  </span>
                </label>

                {error && (
                  <span className={styles.error} role="alert">{error}</span>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className={styles.submitBtn}
                  disabled={loading || !bondAgreed}
                >
                  {loading ? 'BINDING IDENTITY…' : 'SIGN THE BOND'}
                </Button>
              </form>
            </motion.div>
          )}

          {/* --- Email confirmation code --- */}
          {mode === 'verify' && pendingSignup && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <form className={styles.form} onSubmit={handleVerifySignup} noValidate>
                <div className={styles.verifyHeader}>
                  DARKNET RELAY — CONFIRMATION REQUIRED
                </div>
                <p className={styles.verifyBlurb}>
                  A 6-digit one-time code has been dispatched to <strong>{pendingSignup.player.email}</strong>.
                  Enter it below to activate your operative account.
                </p>
                <div className={styles.demoBox}>
                  <span className={styles.demoLabel}>INTERCEPTED (demo build):</span>
                  <span className={styles.demoCode}>{pendingSignup.code}</span>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="verifyCode">CONFIRMATION CODE</label>
                  <input
                    id="verifyCode"
                    className={styles.input}
                    type="text"
                    inputMode="numeric"
                    value={verifyCode}
                    onChange={(e) => { setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError('') }}
                    placeholder="6-digit code"
                    autoFocus
                    autoComplete="one-time-code"
                    maxLength={6}
                  />
                </div>
                {error && <span className={styles.error} role="alert">{error}</span>}
                <div className={styles.connectActions}>
                  <Button type="submit" variant="primary" size="lg" className={styles.submitBtn}>
                    VERIFY & CONNECT
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={handleResendCode}>
                    RESEND
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={handleCancelVerify}>
                    CANCEL
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* --- Password reset --- */}
          {mode === 'reset' && (
            <motion.div
              key="reset"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {resetStep === 'request' && (
                <form className={styles.form} onSubmit={handleResetRequest} noValidate>
                  <div className={styles.verifyHeader}>PASSWORD RESET</div>
                  <p className={styles.verifyBlurb}>
                    Enter the email associated with your operative account.
                    A one-time reset code will be dispatched.
                  </p>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="resetEmail">EMAIL</label>
                    <input
                      id="resetEmail"
                      className={styles.input}
                      type="email"
                      value={resetEmail}
                      onChange={(e) => { setResetEmail(e.target.value); setError('') }}
                      placeholder="account email"
                      autoFocus
                      autoComplete="email"
                      maxLength={254}
                    />
                  </div>
                  {error && <span className={styles.error} role="alert">{error}</span>}
                  <div className={styles.connectActions}>
                    <Button type="submit" variant="primary" size="lg" className={styles.submitBtn}>
                      SEND RESET CODE
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => { setMode('pick'); setError('') }}>
                      CANCEL
                    </Button>
                  </div>
                </form>
              )}

              {resetStep === 'code' && pendingReset && (
                <form className={styles.form} onSubmit={handleResetSubmit} noValidate>
                  <div className={styles.verifyHeader}>RESET CODE — {pendingReset.handle}</div>
                  <p className={styles.verifyBlurb}>
                    A reset code has been sent to <strong>{pendingReset.email}</strong>.
                    Enter it below and choose a new password.
                  </p>
                  <div className={styles.demoBox}>
                    <span className={styles.demoLabel}>INTERCEPTED (demo build):</span>
                    <span className={styles.demoCode}>{pendingReset.code}</span>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label} htmlFor="resetCode">CODE</label>
                    <input
                      id="resetCode"
                      className={styles.input}
                      type="text"
                      inputMode="numeric"
                      value={resetCode}
                      onChange={(e) => { setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError('') }}
                      placeholder="6-digit code"
                      autoFocus
                      autoComplete="one-time-code"
                      maxLength={6}
                    />
                  </div>
                  <div className={styles.fieldRow}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label} htmlFor="newPassword">
                        NEW PASSWORD
                        <button type="button" className={styles.showBtn} onClick={() => setShowPassword((v) => !v)}>
                          {showPassword ? 'HIDE' : 'SHOW'}
                        </button>
                      </label>
                      <input
                        id="newPassword"
                        className={styles.input}
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setError('') }}
                        placeholder="min 6 + 1 special"
                        autoComplete="new-password"
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label} htmlFor="newPasswordConfirm">CONFIRM</label>
                      <input
                        id="newPasswordConfirm"
                        className={styles.input}
                        type={showPassword ? 'text' : 'password'}
                        value={newPasswordConfirm}
                        onChange={(e) => { setNewPasswordConfirm(e.target.value); setError('') }}
                        placeholder="repeat password"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  {error && <span className={styles.error} role="alert">{error}</span>}
                  <div className={styles.connectActions}>
                    <Button type="submit" variant="primary" size="lg" className={styles.submitBtn} disabled={loading}>
                      {loading ? 'UPDATING…' : 'UPDATE PASSWORD'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => { setPendingReset(p => p ? { ...p, code: gen6DigitCode() } : null); setResetCode(''); setError('') }}
                    >RESEND</Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => { setMode('pick'); setPendingReset(null); setError('') }}>
                      CANCEL
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          )}

        </AnimatePresence>

        <p className={styles.disclaimer}>
          Voidlink International — Article XII neutral territory. All operatives bound by the Bond.
          Disputes resolved through Voidlink arbitration only.
        </p>
      </div>
    </motion.main>
  )
}
