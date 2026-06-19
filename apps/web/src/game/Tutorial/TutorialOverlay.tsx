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
  /** L2 — diegetic sender. Undefined = no header (the few non-Cipher steps). */
  from?: string
  fromFingerprint?: string
  /** Signature line shown after the body when from is set. */
  sig?: string
  /** CSS selector for the element to spotlight. Undefined = full-screen block (panel centred). */
  spotlightSelector?: string
  /** Auto-advances when this returns true. */
  condition?: (state: ReturnType<typeof useGameStore.getState>) => boolean
  waitingLabel?: string
  /** When step starts, minimise all open windows except these IDs. */
  keepOnlyWindows?: string[]
}

const CIPHER = 'CIPHER'
const CIPHER_FP = 'C19H 3R20 7B83 D6CC'
const CIPHER_SIG = '— C.'

// L2 — "Cipher's First Contract." A senior Underground operative writes to the
// new signup and walks them through their first job, in his voice. The
// mechanics being taught are unchanged; the framing is now diegetic.
const STEPS: Step[] = [
  // ── Phase 1: Orientation ──────────────────────────────────────────────────
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'PRELIM',
    body: 'I run unofficial introductions for new operatives on the network. Voidlink Dispatch will handle the contracts. I will teach you not to die.\n\nYou have a desktop, 5,000 Cr, a basic cracker, and a log-deleter. That is enough. I started with less.',
    hint: 'Read each note. Click NEXT when you are ready to move on. Some steps will wait for you to do something — those advance on their own.',
  },
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'YOUR DESKTOP',
    body: 'This screen is the only thing standing between you and the JCB. Every tool you have lives in a window on it. Drag the title bars. Resize from any edge. Minimise the ones you are not using.\n\nNothing here is decorative. If a window is open, it is doing something.',
    hint: 'Ctrl+scroll zooms the whole layer if things get crowded.',
    spotlightSelector: '[data-tutorial="window-layer"]',
  },
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'THE TASKBAR',
    body: 'Your taskbar at the bottom. Left side launches windows. Centre tracks the ones you have open. The ⊞ button tidies a messy desktop into a layout you can read at a glance.\n\nNETWORK and HACK TOOLS will be greyed out until you are mid-job. That is by design.',
    hint: 'The taskbar never lies about what is open and what is not. Trust it.',
    spotlightSelector: '[data-tutorial="taskbar"]',
  },
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'YOUR STATUS',
    body: 'Right side of the taskbar shows three things that matter: your handle, your credit balance, and your reputation.\n\nCredits fund the work. Reputation is what the rest of the network thinks of you — Voidlink Dispatch will not route serious contracts to a new handle, and they shouldn\'t.',
    hint: 'Both update the moment a mission settles. Watch them.',
    spotlightSelector: '[data-tutorial="taskbar-status"]',
  },
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'THE SYSTEM CONSOLE',
    body: 'The console in the bottom-right is the heartbeat. Trace percentage, bounce route status, active world events, proxy count.\n\nWhen the rest of the screen lies to you — and a screen will lie eventually, that is what they are for — the console keeps telling the truth.',
    hint: 'Click SYS to collapse it when you need the space.',
    spotlightSelector: '[data-tutorial="system-console"]',
  },
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'THE TERMINAL',
    body: 'Every action you take logs to this terminal. Red entries are warnings. Green are successes. Whites are facts.\n\nNew operatives stop reading the terminal after the first few sessions. New operatives, statistically, do not last.',
    hint: 'The terminal is also where you find out a rival hacker has spawned on your network. Read it.',
    spotlightSelector: '[data-window-id="welcome"]',
  },
  // ── Phase 2: First Mission ────────────────────────────────────────────────
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'THE MISSION BOARD',
    body: 'Contracts arrive here. Type, difficulty, target archetype, payout. Difficulty is 1 to 5 dots. The harder the job, the more nodes, the faster the trace, the bigger the cheque.\n\nDo not let the cheque be the only thing you read.',
    hint: 'Story missions look different. They unlock when the world is ready for you to see them.',
    spotlightSelector: '[data-window-id="missions"]',
  },
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'WHAT CONTRACTS LOOK LIKE',
    body: 'Five types you will see most:\n• FILE THEFT — exfiltrate a file. Cleanest entry into the work.\n• ACCOUNT DELETION — erase someone from a database. Read the briefing twice.\n• DATABASE CORRUPTION — corrupt specific records. Subtler than it sounds.\n• NETWORK SABOTAGE — kill a router or admin console.\n• BOUNTY HUNT — breach a rival operative\'s gateway. Think about whether you want to be the kind of operative who takes these before you accept one.',
    hint: 'Read the brief. Read the client name. Both tell you what you are about to become.',
    spotlightSelector: '[data-window-id="missions"]',
  },
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'TAKE A CONTRACT',
    body: 'Pick a 1- or 2-dot FILE THEFT and click ACCEPT. The Network Map and Hacking Interface will open for you.\n\nDo not be a hero on the first one. Be a professional.',
    hint: 'FILE THEFT at difficulty I or II is what every operative on the network started with. Including me.',
    spotlightSelector: '[data-window-id="missions"]',
    condition: (s) => s.activeMissionId !== null,
    waitingLabel: 'WAITING — ACCEPT A CONTRACT…',
  },
  // ── Phase 3: Network Map ──────────────────────────────────────────────────
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'THE NETWORK MAP',
    body: 'You are in. This is the target system. Nodes are servers, routers, devices. Lines are live connections.\n\nThe ones closer to your entry point are the ones you can reach. Work outward. Nobody jumps to the centre on their first hop. Nobody who survives, anyway.',
    hint: 'Green glow means breached. Amber means Zone B — locked behind a pivot. Red means locked you out.',
    spotlightSelector: '[data-window-id="network-map"]',
    condition: (s) => s.activeNetworkId !== null,
    waitingLabel: 'WAITING — LOADING NETWORK…',
  },
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'PICK A NODE',
    body: 'Click any node to select it. The right panel will tell you its type, security tier (I–V), breach status. After you scan it, the services and any CVEs.\n\nStart with a low tier near the edge. Push inward only when you have the tools.',
    hint: 'Tier I and II for tonight. Save the high-tier ambition for when your hardware can back it up.',
    spotlightSelector: '[data-window-id="network-map"]',
    condition: (s) => s.selectedNodeId !== null,
    waitingLabel: 'WAITING — SELECT A NODE…',
  },
  // ── Phase 4: Hacking Interface ────────────────────────────────────────────
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'THE HACKING INTERFACE',
    body: 'This panel is the rest of the work. Scan. Crack or exploit. Run the mission action. Wipe your logs. Manage your proxy chain.\n\nIt updates live as you select nodes. You will spend more time in this window than anywhere else.',
    hint: 'If it is not visible: HACK TOOLS in the taskbar.',
    spotlightSelector: '[data-window-id="hacking"]',
  },
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'THE TRACE BAR',
    body: 'The single most important thing on this screen. Fills as the target system detects you. At 75% it goes into ALARM and accelerates. At 100% you are caught. No pay. The miss goes on your record.\n\nWatch this bar. If you only watch one thing, watch this.',
    hint: 'Proxies slow it. Ghost specialisation gutts it. Until then, your only tool is your judgment.',
    spotlightSelector: '[data-window-id="hacking"]',
  },
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'THE RELAY CHAIN',
    body: 'Bounce your connection through other servers so the trace does not arrive at your front door. WORLD MAP in the taskbar. Click any green node to add it. If a hop is traced, only that hop is exposed — not you.\n\nMax hops: 3 with the basic proxy, 5 with v2, 7 with v3. Upgrade in SHOP when you can.',
    hint: 'A dirty hop — one with a log on it — cannot be added. Clean it first, in Hack Tools.',
    spotlightSelector: '[data-tutorial="btn-world-map"]',
  },
  // ── Phase 5: The Hack ─────────────────────────────────────────────────────
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'SCAN FIRST',
    body: 'Always. With a node selected, click SCAN. It will reveal the services running on it — SSH, FTP, RDP, MySQL — and sometimes a CVE you can exploit instead of cracking.\n\nA VULN badge means you have an exploit path. Exploit is faster than crack. Use it when you have it.',
    hint: 'Scanning generates a small trace hit. It is almost always worth it. The alternative is going in blind.',
    spotlightSelector: '[data-window-id="hacking"]',
    condition: (s) => {
      const net = s.activeNetworkId ? s.networks[s.activeNetworkId] : null
      return net?.nodes.some((n) => n.isScanned) ?? false
    },
    waitingLabel: 'WAITING — SCAN A NODE…',
  },
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'CRACK OR EXPLOIT',
    body: 'CRACK brute-forces the node\'s security. Slow but always available. EXPLOIT uses the CVE you found. Faster, and with protocol-specific side effects — EXPLOIT [FTP] wipes the log for you, EXPLOIT [SQL] completes a database objective on its own.\n\nRead the terminal after the breach. It will tell you what happened.',
    hint: 'Cancelling a CRACK mid-way on a Tier 4 or 5 node triggers a 30-second lockout and a trace spike. Decide before you start, not during.',
    spotlightSelector: '[data-window-id="hacking"]',
    condition: (s) => {
      const net = s.activeNetworkId ? s.networks[s.activeNetworkId] : null
      return net?.nodes.some((n) => n.isBreached) ?? false
    },
    waitingLabel: 'WAITING — BREACH A NODE…',
  },
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'DUMP CREDS WHEN YOU CAN',
    body: 'Admin consoles, endpoints, mail servers — after you breach one, DUMP CREDS caches the credentials. Those creds let you bypass any other node on this network instantly. No crack. No exploit. Walk in.\n\nFor Ghost operatives, this happens silently. For the rest of us, it costs a small trace hit. Worth it.',
    hint: 'Cached creds expire in about eight minutes. Use them while they are warm.',
    spotlightSelector: '[data-window-id="hacking"]',
  },
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'PULL THE FILE',
    body: 'Your contract was a FILE THEFT. After breaching the file server, the Network Map panel marks a target file with a star. Click TRANSFER. A progress bar will run.\n\nThe second the file lands on your machine, the objective is yours.',
    hint: 'Other contract types put their action button in the same place: DELETE ACCOUNT, CORRUPT DB, SABOTAGE. You will find them when you need them.',
    spotlightSelector: '[data-window-id="network-map"]',
    condition: (s) => {
      const mission = s.missions.find((m) => m.id === s.activeMissionId)
      return mission?.objectives.filter((o) => !o.isOptional).every((o) => o.isCompleted) ?? false
    },
    waitingLabel: 'WAITING — TRANSFER THE FILE…',
  },
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'WIPE THE LOGS',
    body: 'The objective is done. The job is not. Every breached node holds a log entry with your fingerprint on it. Select each one. WIPE LOG.\n\nNew operatives skip this on easy jobs. New operatives explain themselves to a JCB liaison eighteen months later, and not under their own terms.\n\nWipe. Every. Time.',
    hint: 'Ghost wipes silently. Everyone else takes a small trace hit per wipe. Pay it.',
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
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'SECURE DISCONNECT',
    body: 'Logs clean. SECURE DISCONNECT is green now. Click it. Credits land, XP awards, trace resets.\n\nLEAVE NETWORK is the dirty exit. No payment. The job goes on the news feed as a breach. Use it when there is no other choice, not as a habit.',
    hint: 'You cannot log out while connected. The system disables it during a job, on purpose.',
    spotlightSelector: '[data-window-id="hacking"]',
    condition: (s) => s.activeMissionId === null && s.missionResult !== 'fail',
    waitingLabel: 'WAITING — SECURE DISCONNECT…',
  },
  // ── Phase 6: Upgrades ─────────────────────────────────────────────────────
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'REINVEST',
    body: 'SHOP in the taskbar. Open it.\n\nThe credits from that contract are already in your balance. Spend them on yourself. Better hardware means faster work; faster work means less trace; less trace means another contract tomorrow.',
    hint: 'Architect spec at Rank 5 takes 15% off everything in this shop. Worth aiming for.',
    spotlightSelector: '[data-tutorial="btn-shop"]',
    condition: (s) => s.activeWindows.some((w) => w.id === 'shop' && !w.isMinimized),
    waitingLabel: 'OPEN SHOP…',
  },
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'HARDWARE AND SOFTWARE',
    body: 'Hardware: CPU speed for parallel work, RAM slots for how many tools run at once, HDD and Modem for transfer rates.\n\nSoftware: Cracker tools v1 → v4 cut your breach times by up to 80%. Proxy stacks give you more relay hops.\n\nIf you make me recommend one thing — save for Cracker v4. Hydra Zero. There is nothing better.',
    hint: 'Buy the thing that fixes the slowest part of your last mission. That is the rule.',
    spotlightSelector: '[data-window-id="shop"]',
    keepOnlyWindows: ['shop'],
  },
  // ── Phase 7: Profile and Advanced ────────────────────────────────────────
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'YOUR PROFILE',
    body: 'PROFILE in the taskbar. This is your full record — hardware, software, lifetime stats, XP, faction memberships, faction standings.\n\nIt is also where you will pick a specialisation at Rank 5. Ghost. Brute. Architect. Pick the one that matches the operative you have actually been, not the one you said you would be.',
    hint: 'You will have an honest answer to that question by Rank 5. Wait for it.',
    spotlightSelector: '[data-tutorial="btn-profile"]',
    condition: (s) => s.activeWindows.some((w) => w.id === 'profile' && !w.isMinimized),
    waitingLabel: 'OPEN PROFILE…',
  },
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'FACTION STANDINGS',
    body: 'Five factions watch your work: Voidlink, Arunmor, Ares Division, the Underground, and the Nameless.\n\nYour targets and your clients change how each of them feels about you. High standing unlocks contracts and intel that nobody else sees.\n\nArunmor and Ares are not on speaking terms. Working for one closes doors at the other. The Underground notices everything.',
    hint: 'There is no neutral path. You will end up somewhere. The choice is whether you mean to.',
    spotlightSelector: '[data-window-id="profile"]',
    keepOnlyWindows: ['profile'],
  },
  {
    from: CIPHER, fromFingerprint: CIPHER_FP, sig: CIPHER_SIG,
    title: 'YOU ARE READY',
    body: 'That is the work.\n\nFind a contract. Map the network. Breach what you came for. Cover your tracks. Get paid. Spend it on the thing that fixes your weakest hour. Push deeper.\n\nI will not write you again until I have a reason to. Most operatives never give me one. The ones who do, I remember.\n\nGood hunting.',
    hint: 'World events (the coloured pills in the taskbar) change everything globally. GHOST MODE cuts trace. CORP SWEEP spikes it. Read them before you accept a job.',
    keepOnlyWindows: [],
  },
]

const SPOTLIGHT_PAD = 14

export function TutorialOverlay() {
  const player = useGameStore((s) => s.player)
  const setPlayerFlag = useGameStore((s) => s.setPlayerFlag)
  const minimizeWindow = useGameStore((s) => s.minimizeWindow)
  const focusWindow = useGameStore((s) => s.focusWindow)
  const openWindow = useGameStore((s) => s.openWindow)
  const activeWindows = useGameStore((s) => s.activeWindows)
  const [step, setStep] = useState(0)
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null)
  const conditionMet = useRef(false)
  const [furthestReached, setFurthestReached] = useState(0)   // gates BACK button to visited steps only

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

  // Re-measure on step change and on window resize.
  // Playtester feedback: spotlight stayed in place when windows were dragged
  // or resized. Now we re-measure on every animation frame whenever a
  // spotlight target is set — cheap (one querySelector + rect read per
  // frame) and always tracks live position changes.
  useEffect(() => {
    let raf = 0
    function loop() {
      measureSpotlight()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener('resize', measureSpotlight)
    return () => {
      cancelAnimationFrame(raf)
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
          if (step < STEPS.length - 1) {
            const next = step + 1
            setStep(next)
            setFurthestReached((f) => Math.max(f, next))
          } else {
            finishTutorial()
          }
        }, 600)
      }
    }, 250)

    return () => clearInterval(interval)
  }, [step, current.condition]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard navigation: arrow keys to step back/forward (within visited
  // range only); ESC does nothing (skip is via the SKIP button).
  useEffect(() => {
    if (!player || player.activeFlags.tutorial_done) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault()
        goBack()
      } else if ((e.key === 'ArrowRight' || e.key === 'Enter') && !current.condition) {
        e.preventDefault()
        advance()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [player, step, current.condition]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!player || player.activeFlags.tutorial_done) return null

  function advance() {
    if (step < STEPS.length - 1) {
      const next = step + 1
      setStep(next)
      setFurthestReached((f) => Math.max(f, next))
    } else {
      finishTutorial()
    }
  }

  function goBack() {
    if (step <= 0) return
    setStep((s) => s - 1)
  }

  function finishTutorial() {
    setPlayerFlag('tutorial_done', true)
    try { localStorage.setItem('voidlink_tutorial_completed_once', String(Date.now())) } catch { /**/ }
    // Playtester feedback: ending on a blank desktop after the tutorial was
    // clunky. Open a useful default layout (inbox + mission board + welcome
    // terminal) so the player has something to immediately engage with.
    const openIds = new Set(activeWindows.map((w) => w.id))
    if (!openIds.has('inbox')) {
      openWindow({ id: 'inbox', title: 'ENCRYPTED INBOX', component: 'EmailInbox', x: 80, y: 80, width: 720, height: 480, isMinimized: false })
    }
    if (!openIds.has('missions')) {
      openWindow({ id: 'missions', title: 'MISSION BOARD', component: 'MissionBoard', x: 820, y: 80, width: 540, height: 480, isMinimized: false })
    }
    if (!openIds.has('help')) {
      openWindow({ id: 'help', title: 'OPERATIVE HANDBOOK', component: 'HelpWindow', x: 200, y: 380, width: 880, height: 380, isMinimized: false })
    }
  }

  function dismiss() {
    finishTutorial()
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
        {/* Soft ambient dim — pointer-events: none, just visual */}
        <div className={styles.softDim} aria-hidden="true" />

        {/* Playtester feedback: 'I can just click ANYTHING I like without
            it forcing me to learn.' Now we block clicks outside the
            spotlight area. When there's no spotlight target, the whole
            screen blocks (the player must use the tutorial panel buttons).
            When there's a spotlight, we render four blocker rectangles
            around it so clicks only register inside the highlighted area. */}
        {!spotlight ? (
          <div className={styles.clickBlocker} aria-hidden="true" />
        ) : (
          <>
            {/* Top blocker */}
            <div className={styles.clickBlocker} style={{ top: 0, left: 0, right: 0, height: Math.max(0, spotlight.y) }} aria-hidden="true" />
            {/* Bottom blocker */}
            <div className={styles.clickBlocker} style={{ top: spotlight.y + spotlight.height, left: 0, right: 0, bottom: 0 }} aria-hidden="true" />
            {/* Left blocker */}
            <div className={styles.clickBlocker} style={{ top: spotlight.y, left: 0, width: Math.max(0, spotlight.x), height: spotlight.height }} aria-hidden="true" />
            {/* Right blocker */}
            <div className={styles.clickBlocker} style={{ top: spotlight.y, left: spotlight.x + spotlight.width, right: 0, height: spotlight.height }} aria-hidden="true" />
          </>
        )}

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

          {current.from && (
            <div className={styles.from}>
              <span className={styles.fromLabel}>FROM:</span>
              <span>{current.from}</span>
              {current.fromFingerprint && (
                <span className={styles.fromFingerprint}>{current.fromFingerprint}</span>
              )}
            </div>
          )}

          <div className={styles.title}>{current.title}</div>

          <p className={styles.body}>
            {current.body.split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </p>

          {current.sig && (
            <p className={styles.sig}>{current.sig}</p>
          )}

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
            {/* BACK button — playtester feedback. Always visible from step 2
                onward; lets the player re-read earlier instructions. */}
            {step > 0 && (
              <button className={styles.backBtn} onClick={goBack}>
                ‹ BACK
              </button>
            )}
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

          {/* Keyboard hint */}
          <div className={styles.kbdHint} aria-hidden="true">
            <kbd>←</kbd> back · {!current.condition && <><kbd>→</kbd> next · </>}<span style={{ opacity: 0.6 }}>visited {furthestReached + 1}/{STEPS.length}</span>
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
