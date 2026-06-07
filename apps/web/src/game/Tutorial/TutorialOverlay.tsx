import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.ts'
import { Button } from '@voidlink/ui'
import styles from './TutorialOverlay.module.css'

interface SpotlightRect {
  x: number
  y: number
  width: number
  height: number
}

interface Step {
  title: string
  body: string
  hint?: string
  /** CSS selector for the element to spotlight. Undefined = full-screen block (panel centred). */
  spotlightSelector?: string
  /** Auto-advances when this returns true. */
  condition?: (state: ReturnType<typeof useGameStore.getState>) => boolean
  waitingLabel?: string
  /** When step starts, minimise all open windows except these IDs. */
  keepOnlyWindows?: string[]
}

const STEPS: Step[] = [
  // ── Phase 1: Orientation ──────────────────────────────────────────────────
  {
    title: 'WELCOME TO VOIDLINK INTERNATIONAL',
    body: 'Identity confirmed. You are now an active operative. You have 5,000 Cr startup funding, a basic cracker, and a log-deleter tool. This tutorial covers everything — pay attention.',
    hint: 'Click NEXT to advance through informational steps.',
  },
  {
    title: 'YOUR DESKTOP',
    body: 'This is your operating environment. All activity happens inside windows that you can drag by their title bar, resize from any edge, and minimise or close. Nothing here is cosmetic — every window is a live tool.',
    hint: 'Ctrl+scroll zooms the entire window layer if things get crowded.',
    spotlightSelector: '[data-tutorial="window-layer"]',
  },
  {
    title: 'THE TASKBAR',
    body: 'The taskbar is your mission control. The left section launches windows. The centre shows your open windows and lets you focus or minimise them. The ⊞ button cascades all open windows into a tidy layout.',
    hint: 'NETWORK and HACK TOOLS are greyed out when no mission is active — they only work when you are connected.',
    spotlightSelector: '[data-tutorial="taskbar"]',
  },
  {
    title: 'YOUR OPERATIVE STATUS',
    body: 'The right side of the taskbar shows your handle, credit balance, and reputation score. Credits fund hardware and software upgrades. Reputation gates higher-tier contracts — the more you earn, the better the jobs available.',
    hint: 'Credits and REP update here instantly after every mission.',
    spotlightSelector: '[data-tutorial="taskbar-status"]',
  },
  {
    title: 'SYSTEM CONSOLE',
    body: 'The System Console (bottom-right) monitors your live processes: active mission trace %, your bounce route status, world events, and proxy count. It updates every tick and is always visible.',
    hint: 'Click the SYS header to collapse it if you need screen space.',
    spotlightSelector: '[data-tutorial="system-console"]',
  },
  {
    title: 'SYSTEM TERMINAL',
    body: 'The System Terminal logs every action you take — connections, scans, breaches, errors, and mission results. Red entries are warnings or failures. Green entries are successes. Keep an eye on it for intel the UI does not surface.',
    hint: 'The terminal also warns you when a rival hacker spawns on your network.',
    spotlightSelector: '[data-window-id="welcome"]',
  },
  // ── Phase 2: First Mission ────────────────────────────────────────────────
  {
    title: 'THE MISSION BOARD',
    body: 'Contracts come through the MISSION BOARD. Each card shows: the mission type, difficulty (1–5 dots), target archetype, and credit reward. Higher difficulty = higher payout but harder networks, more nodes, and faster trace accumulation.',
    hint: 'Story missions (bold, with a distinct header) unlock narrative events and unique pre-built networks.',
    spotlightSelector: '[data-window-id="missions"]',
  },
  {
    title: 'MISSION TYPES',
    body: 'There are five contract types:\n• FILE THEFT — exfiltrate a target file\n• ACCOUNT DELETION — erase a target account from a database\n• DATABASE CORRUPTION — corrupt mission-critical records\n• NETWORK SABOTAGE — disable a router or admin console\n• BOUNTY HUNT — breach a rival operative\'s gateway',
    hint: 'Each type involves different node targets on the network. Read the briefing before accepting.',
    spotlightSelector: '[data-window-id="missions"]',
  },
  {
    title: 'ACCEPT A CONTRACT',
    body: 'Select a contract with a LOW difficulty rating (1–2 dots) and click ACCEPT. This connects you to the target network and opens the Network Map and Hacking Interface automatically.',
    hint: 'FILE THEFT at difficulty I or II is the safest first contract.',
    spotlightSelector: '[data-window-id="missions"]',
    condition: (s) => s.activeMissionId !== null,
    waitingLabel: 'WAITING — ACCEPT A MISSION…',
  },
  // ── Phase 3: Network Map ──────────────────────────────────────────────────
  {
    title: 'THE NETWORK MAP',
    body: 'You are now connected. The Network Map renders the target system\'s topology as a 3D graph. Each node is a server, router, or device. Lines between nodes are live connections. Nodes dim from your entry point outward — reach them in order.',
    hint: 'Green glow = breached. Amber = Zone B (locked behind a pivot). Red pulsing = locked out.',
    spotlightSelector: '[data-window-id="network-map"]',
    condition: (s) => s.activeNetworkId !== null,
    waitingLabel: 'WAITING — LOADING NETWORK…',
  },
  {
    title: 'SELECT A NODE',
    body: 'Click any node in the Network Map to select it. The right-side panel shows: node type (router, database, admin_console…), security tier (I–V), breach status, and — after scanning — running services and discovered CVEs.',
    hint: 'Always start with Tier I–II nodes closest to the entry point. High-tier nodes need better tools.',
    spotlightSelector: '[data-window-id="network-map"]',
    condition: (s) => s.selectedNodeId !== null,
    waitingLabel: 'WAITING — CLICK A NODE…',
  },
  // ── Phase 4: Hacking Interface ────────────────────────────────────────────
  {
    title: 'THE HACKING INTERFACE',
    body: 'The Hacking Interface is your primary tool panel. From here you scan nodes, crack or exploit their security, execute mission actions, wipe your logs, and manage your proxy chain. The panel updates in real time as you select nodes.',
    hint: 'If the HI window is not visible, click HACK TOOLS in the taskbar.',
    spotlightSelector: '[data-window-id="hacking"]',
  },
  {
    title: 'THE TRACE BAR',
    body: 'The TRACE bar is the most important thing on screen. It fills left-to-right as the target system detects your activity. At 75% it enters ALARM — trace accelerates. At 100% you are CAUGHT. Mission fails. No payment. Trace failure on your record.',
    hint: 'Use proxies to slow accumulation. Ghost specialisation (unlocked at Rank 5) gives a massive reduction.',
    spotlightSelector: '[data-window-id="hacking"]',
  },
  {
    title: 'RELAY CHAIN — YOUR ANONYMITY NETWORK',
    body: 'Bounce chains route your connection through other servers so trace can\'t reach you directly. Open the WORLD MAP from the taskbar — click any green node to add it to your chain. If a hop is traced, only that node is exposed, not you.\n\nMax hops: 3 (basic proxy), 5 (proxy v2), 7 (proxy v3). Upgrade in SHOP to extend your chain.',
    hint: 'Dirty (logged) hops cannot be added — clean them via the Hack Tools window first.',
    spotlightSelector: '[data-tutorial="btn-world-map"]',
  },
  // ── Phase 5: The Hack ─────────────────────────────────────────────────────
  {
    title: 'SCAN THE NODE',
    body: 'With a node selected, click SCAN. Scanning reveals running services (SSH, FTP, RDP, MySQL…) and may uncover a CVE vulnerability. A VULN badge means you can EXPLOIT instead of cracking — 2–3× faster with protocol-specific side effects.',
    hint: 'Scanning always generates a small trace hit but is almost always worth it.',
    spotlightSelector: '[data-window-id="hacking"]',
    condition: (s) => {
      const net = s.activeNetworkId ? s.networks[s.activeNetworkId] : null
      return net?.nodes.some((n) => n.isScanned) ?? false
    },
    waitingLabel: 'WAITING — SCAN A NODE…',
  },
  {
    title: 'CRACK OR EXPLOIT',
    body: 'Click CRACK to brute-force the node\'s security (slower), or EXPLOIT [PROTOCOL] if you found a CVE (faster, with bonuses). Examples: EXPLOIT [FTP] auto-wipes the log. EXPLOIT [SQL] auto-completes database objectives. Read the terminal for side effects.',
    hint: 'Cancelling a crack mid-way on a Tier 4–5 node triggers a 30-second lockout and a trace spike.',
    spotlightSelector: '[data-window-id="hacking"]',
    condition: (s) => {
      const net = s.activeNetworkId ? s.networks[s.activeNetworkId] : null
      return net?.nodes.some((n) => n.isBreached) ?? false
    },
    waitingLabel: 'WAITING — BREACH A NODE…',
  },
  {
    title: 'DUMP CREDENTIALS',
    body: 'On admin consoles, endpoints, and mail servers you can DUMP CREDS after breaching. This caches credentials that let you bypass any other node on the same network instantly — no crack needed. Silent for Ghost operatives.',
    hint: 'Cached credentials expire after ~8 minutes. Use them before they expire.',
    spotlightSelector: '[data-window-id="hacking"]',
  },
  {
    title: 'TRANSFER THE FILE',
    body: 'Your first contract is a FILE THEFT. After breaching the file server, the right-side NETWORK MAP panel shows a ★ marked file. Click the TRANSFER button next to it. A progress bar runs while the file copies to your local storage.\n\nThis is your primary objective — the mission completes once the file is on your machine.',
    hint: 'Other mission types use different buttons in the same place: DELETE ACCOUNT (account deletion), CORRUPT DB (database corruption), SABOTAGE (network sabotage).',
    spotlightSelector: '[data-window-id="network-map"]',
    condition: (s) => {
      const mission = s.missions.find((m) => m.id === s.activeMissionId)
      return mission?.objectives.filter((o) => !o.isOptional).every((o) => o.isCompleted) ?? false
    },
    waitingLabel: 'WAITING — TRANSFER THE FILE…',
  },
  {
    title: 'COVER YOUR TRACKS — WIPE LOGS',
    body: 'Objective done — but every breached node holds a log entry with your fingerprint. Select each breached node and click WIPE LOG to destroy the evidence. The ✓ checklist at the top of the HI tracks which nodes are clean.',
    hint: 'Ghost operatives wipe logs silently (no trace spike). All others get a small spike per wipe.',
    spotlightSelector: '[data-window-id="hacking"]',
    condition: (s) => {
      const net = s.activeNetworkId ? s.networks[s.activeNetworkId] : null
      if (!net) return false
      const breached = net.nodes.filter((n) => n.isBreached)
      return breached.length > 0 && breached.every((n) => n.isLogWiped)
    },
    waitingLabel: 'WAITING — WIPE ALL LOGS…',
  },
  {
    title: 'SECURE DISCONNECT',
    body: 'All logs are clear. The SECURE DISCONNECT button is now green. Click it to exit cleanly. Credits are deposited, XP awarded, and trace resets. LEAVE NETWORK is a dirty exit — no payment, mission counted as abandoned, news feed notes the breach.',
    hint: 'You cannot log out while connected — the taskbar logout button is disabled during active missions.',
    spotlightSelector: '[data-window-id="hacking"]',
    condition: (s) => s.activeMissionId === null && s.missionResult !== 'fail',
    waitingLabel: 'WAITING — SECURE DISCONNECT…',
  },
  // ── Phase 6: Upgrades ─────────────────────────────────────────────────────
  {
    title: 'UPGRADE YOUR HARDWARE — OPEN SHOP',
    body: 'Click the SHOP button in the taskbar to open the Upgrade Store. Your credits from that mission are already in your balance. Better hardware means faster operations, more RAM slots for parallel tools, and higher data transfer rates.',
    hint: 'Architect specialisation (unlocked at Rank 5) gets 15% off every purchase in the shop.',
    spotlightSelector: '[data-tutorial="btn-shop"]',
    condition: (s) => s.activeWindows.some((w) => w.id === 'shop' && !w.isMinimized),
    waitingLabel: 'CLICK SHOP IN THE TASKBAR…',
  },
  {
    title: 'HARDWARE AND SOFTWARE',
    body: 'Hardware tab: CPU speed increases parallel tool operations. RAM slots determine how many tools can run simultaneously. HDD and Modem affect file transfer rates.\n\nSoftware tab: Cracker tools v1→v4 slash breach times by up to 80%. Proxy stacks increase your max hop count.',
    hint: 'Cracker v4 (Hydra Zero) is the best-in-class breach tool. Save for it.',
    spotlightSelector: '[data-window-id="shop"]',
    keepOnlyWindows: ['shop'],
  },
  // ── Phase 7: Profile and Advanced ────────────────────────────────────────
  {
    title: 'YOUR OPERATIVE PROFILE — OPEN PROFILE',
    body: 'Click PROFILE in the taskbar to inspect your full operative record: hardware specs, owned software, lifetime stats, XP progress, faction memberships, and faction standing bars.',
    hint: 'Specialisations unlock at Rank 5. Choose Ghost, Brute, or Architect based on your playstyle.',
    spotlightSelector: '[data-tutorial="btn-profile"]',
    condition: (s) => s.activeWindows.some((w) => w.id === 'profile' && !w.isMinimized),
    waitingLabel: 'CLICK PROFILE IN THE TASKBAR…',
  },
  {
    title: 'FACTION STANDINGS',
    body: 'Five factions track your operations: Voidlink International, Arunmor, Ares Division, The Underground, and The Nameless. Your choice of mission targets affects their opinion of you. High standing unlocks exclusive contracts and intel drops.',
    hint: 'Ares Division and Arunmor are ideological opposites — working for one antagonises the other. Choose a side.',
    spotlightSelector: '[data-window-id="profile"]',
    keepOnlyWindows: ['profile'],
  },
  {
    title: 'YOU ARE READY, OPERATIVE',
    body: 'That is everything. Find a contract, map the network, breach the target, cover your tracks, and get paid. Reinvest in hardware. Push deeper into Tier IV and V networks. The world is watching.\n\nGood hunting.',
    hint: 'World events (coloured pills in the taskbar) affect gameplay globally. Watch for GHOST MODE (trace cut) and CORP SWEEP (trace spike) — they can make or break a mission.',
    keepOnlyWindows: [],
  },
  // ── Phase 8: Closing handled in FACTION STANDINGS step above ──────────────
]

const SPOTLIGHT_PAD = 14

export function TutorialOverlay() {
  const player = useGameStore((s) => s.player)
  const setPlayerFlag = useGameStore((s) => s.setPlayerFlag)
  const minimizeWindow = useGameStore((s) => s.minimizeWindow)
  const focusWindow = useGameStore((s) => s.focusWindow)
  const [step, setStep] = useState(0)
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null)
  const conditionMet = useRef(false)
  const measureRaf = useRef<number>(0)

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  // When a step with keepOnlyWindows starts: minimise all other windows
  useEffect(() => {
    if (!current.keepOnlyWindows) return
    const keep = new Set(current.keepOnlyWindows)
    const state = useGameStore.getState()
    for (const w of state.activeWindows) {
      if (!w.isMinimized && !keep.has(w.id)) {
        minimizeWindow(w.id)
      }
    }
  }, [step, current.keepOnlyWindows, minimizeWindow])

  // M14h.3 — if the spotlight points at a specific window, bring it to front so
  // it's never covered by another window. Parses [data-window-id="..."] selectors.
  useEffect(() => {
    if (!current.spotlightSelector) return
    const match = current.spotlightSelector.match(/\[data-window-id="([^"]+)"\]/)
    if (!match) return
    const windowId = match[1]
    // Defer to next frame so window-position effects settle first
    const raf = requestAnimationFrame(() => focusWindow(windowId))
    return () => cancelAnimationFrame(raf)
  }, [step, current.spotlightSelector, focusWindow])

  // Measure spotlight target
  const measureSpotlight = useCallback(() => {
    if (!current.spotlightSelector) {
      setSpotlight(null)
      return
    }
    const el = document.querySelector(current.spotlightSelector)
    if (!el) {
      setSpotlight(null)
      return
    }
    const r = el.getBoundingClientRect()
    setSpotlight({
      x: r.x - SPOTLIGHT_PAD,
      y: r.y - SPOTLIGHT_PAD,
      width: r.width + SPOTLIGHT_PAD * 2,
      height: r.height + SPOTLIGHT_PAD * 2,
    })
  }, [current.spotlightSelector])

  // Re-measure on step change and on window resize
  useEffect(() => {
    measureRaf.current = requestAnimationFrame(measureSpotlight)
    window.addEventListener('resize', measureSpotlight)
    return () => {
      cancelAnimationFrame(measureRaf.current)
      window.removeEventListener('resize', measureSpotlight)
    }
  }, [measureSpotlight])

  // Poll game state to auto-advance conditional steps
  useEffect(() => {
    if (!current.condition) return
    conditionMet.current = false

    const interval = setInterval(() => {
      if (conditionMet.current) return
      const state = useGameStore.getState()
      if (current.condition!(state)) {
        conditionMet.current = true
        clearInterval(interval)
        setTimeout(() => {
          if (step < STEPS.length - 1) setStep((s) => s + 1)
          else {
            setPlayerFlag('tutorial_done', true)
            try { localStorage.setItem('voidlink_tutorial_completed_once', String(Date.now())) } catch { /**/ }
          }
        }, 600)
      }
    }, 250)

    return () => clearInterval(interval)
  }, [step, current.condition]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!player || player.activeFlags.tutorial_done) return null

  function advance() {
    if (step < STEPS.length - 1) setStep((s) => s + 1)
    else dismiss()
  }

  function dismiss() {
    setPlayerFlag('tutorial_done', true)
    // M14r — mark that this machine has completed the tutorial at least once,
    // which unlocks the SKIP TUTORIAL button for future operatives.
    try { localStorage.setItem('voidlink_tutorial_completed_once', String(Date.now())) } catch { /**/ }
  }

  const showNextBtn = !current.condition

  // Panel position: avoid the spotlight
  const screenH = typeof window !== 'undefined' ? window.innerHeight : 800
  const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200
  const panelStyle: React.CSSProperties =
    spotlight && spotlight.y + spotlight.height > screenH * 0.62
      ? { top: 20, right: 20 }
      : spotlight && spotlight.x + spotlight.width > screenW * 0.62
        ? { bottom: 72, left: 20 }
        : { bottom: 72, right: 20 }

  return (
    <AnimatePresence>
      <div key="tutorial-root" className={styles.root}>
        {/* Soft ambient dim — does NOT block clicks */}
        <div className={styles.softDim} aria-hidden="true" />

        {/* Spotlight ring — pointer-events:none, just a glow outline */}
        {spotlight && (
          <div
            className={styles.spotlightRing}
            style={{
              position: 'fixed',
              left: spotlight.x,
              top: spotlight.y,
              width: spotlight.width,
              height: spotlight.height,
            }}
            aria-hidden="true"
          />
        )}

        {/* Tutorial panel */}
        <motion.div
          className={styles.panel}
          style={{ position: 'fixed', ...panelStyle }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
          role="dialog"
          aria-label="Operative tutorial"
          aria-live="polite"
        >
          <div className={styles.stepCount}>
            TUTORIAL {step + 1}&nbsp;/&nbsp;{STEPS.length}
          </div>

          <div className={styles.title}>{current.title}</div>

          <p className={styles.body}>
            {current.body.split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </p>

          {current.hint && (
            <p className={styles.hint}>▶ {current.hint}</p>
          )}

          {current.condition && (
            <p className={styles.waiting}>
              <span className={styles.waitingDot} aria-hidden="true">◉</span>
              {current.waitingLabel}
            </p>
          )}

          <div className={styles.actions}>
            {/* M14r — tutorial is MANDATORY on first signup. SKIP only appears
                for returning operatives who have completed a tutorial before
                on this machine (localStorage flag set when tutorial finishes). */}
            {(() => {
              let hasCompletedTutorialBefore = false
              try { hasCompletedTutorialBefore = !!localStorage.getItem('voidlink_tutorial_completed_once') } catch { /**/ }
              return hasCompletedTutorialBefore
            })() && (
              <button className={styles.skipBtn} onClick={dismiss}>
                SKIP TUTORIAL
              </button>
            )}
            {showNextBtn && (
              <Button variant="primary" size="sm" onClick={advance}>
                {isLast ? 'BEGIN' : 'NEXT ›'}
              </Button>
            )}
          </div>

          {/* Step pip track */}
          <div className={styles.pips} aria-hidden="true">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`${styles.pip} ${i === step ? styles.pipActive : i < step ? styles.pipDone : ''}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
