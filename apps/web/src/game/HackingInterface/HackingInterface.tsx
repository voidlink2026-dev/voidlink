import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useGameStore } from '../../store/gameStore.ts'
import type { CredentialEntry } from '../../store/gameStore.ts'
import { Button, TraceBar } from '@voidlink/ui'
import { startCrackJob, tickCrackJob } from '@voidlink/core'
import type { CrackJob } from '@voidlink/core'
import { AudioEngine } from '../Audio/audioEngine.ts'
import styles from './HackingInterface.module.css'

export function HackingInterface() {
  const { t } = useTranslation()
  const traceState = useGameStore((s) => s.traceState)
  const networks = useGameStore((s) => s.networks)
  const activeNetworkId = useGameStore((s) => s.activeNetworkId)
  const selectedNodeId = useGameStore((s) => s.selectedNodeId)
  const player = useGameStore((s) => s.player)
  const logTerminal = useGameStore((s) => s.logTerminal)
  const breachNode = useGameStore((s) => s.breachNode)
  const wipeNodeLog = useGameStore((s) => s.wipeNodeLog)
  const disconnect = useGameStore((s) => s.disconnect)
  const openWindow = useGameStore((s) => s.openWindow)
  const rivalHacker = useGameStore((s) => s.rivalHacker)
  const interceptRival = useGameStore((s) => s.interceptRival)
  const scanNode = useGameStore((s) => s.scanNode)
  const activeRoute = useGameStore((s) => s.activeRoute)
  const credentialCache = useGameStore((s) => s.credentialCache)
  const dumpCredentials = useGameStore((s) => s.dumpCredentials)
  const scrapeMemory = useGameStore((s) => s.scrapeMemory)
  const useCredential = useGameStore((s) => s.useCredential)
  const wipeBounceNode = useGameStore((s) => s.wipeBounceNode)
  const applyExploitEffects = useGameStore((s) => s.applyExploitEffects)
  const triggerNodeLockout = useGameStore((s) => s.triggerNodeLockout)
  const recordFailedCrack = useGameStore((s) => s.recordFailedCrack)

  const [activeJob, setActiveJob] = useState<CrackJob | null>(null)
  const [jobProgress, setJobProgress] = useState(0)
  // proxyCount kept only because resetMission still calls setProxyCount(0); the
  // +PROXY UI was removed in M14h.5 — bounce reduction now comes from the
  // active relay route instead.
  const [, setProxyCount] = useState(0)
  const [wipeProgress, setWipeProgress] = useState(0)
  const [wipingNodeId, setWipingNodeId] = useState<string | null>(null)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanningNodeId, setScanningNodeId] = useState<string | null>(null)
  const [dumpingNodeId, setDumpingNodeId] = useState<string | null>(null)
  const [dumpProgress, setDumpProgress] = useState(0)
  const [scrapingNodeId, setScrapingNodeId] = useState<string | null>(null)
  const [scrapeProgress, setScrapeProgress] = useState(0)
  const [scrapeResult, setScrapeResult] = useState<CredentialEntry | null>(null)
  const [cleaningHopId, setCleaningHopId] = useState<string | null>(null)
  const [cleanHopProgress, setCleanHopProgress] = useState(0)
  const [credentialAccessing, setCredentialAccessing] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const wipeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dumpIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const scrapeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cleanHopIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const activeNetwork = activeNetworkId ? networks[activeNetworkId] : null
  const selectedNode = activeNetwork?.nodes.find((n) => n.id === selectedNodeId) ?? null

  // Clean up intervals on unmount
  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (wipeIntervalRef.current) clearInterval(wipeIntervalRef.current)
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current)
    if (dumpIntervalRef.current) clearInterval(dumpIntervalRef.current)
    if (scrapeIntervalRef.current) clearInterval(scrapeIntervalRef.current)
    if (cleanHopIntervalRef.current) clearInterval(cleanHopIntervalRef.current)
  }, [])

  // Announce rival hacker on first appearance
  const prevRivalRef = useRef<string | null>(null)
  useEffect(() => {
    if (rivalHacker && prevRivalRef.current !== rivalHacker.handle) {
      prevRivalRef.current = rivalHacker.handle
      logTerminal(`WARNING: Rival operative ${rivalHacker.handle} detected on network.`, 'error')
      logTerminal('Trace speed increased. Use INTERCEPT to remove them.', 'system')
    }
    if (!rivalHacker) prevRivalRef.current = null
  }, [rivalHacker, logTerminal])

  function runScan() {
    if (!selectedNode || !activeNetworkId) return
    if (selectedNode.isScanned) {
      logTerminal(`${selectedNode.type.replace(/_/g, ' ')} already scanned.`, 'dim')
      return
    }
    if (scanningNodeId) {
      logTerminal('Scan already in progress.', 'dim')
      return
    }
    const durationMs = selectedNode.securityTier * 1200 + Math.random() * 800
    const startedAt = Date.now()
    setScanningNodeId(selectedNode.id)
    setScanProgress(0)
    AudioEngine.playSfx('scan')
    logTerminal(`Port scanning ${selectedNode.type.replace(/_/g, ' ')} [T${selectedNode.securityTier}]…`, 'system')

    scanIntervalRef.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - startedAt) / durationMs)
      setScanProgress(p)
      if (p >= 1) {
        clearInterval(scanIntervalRef.current!)
        setScanningNodeId(null)
        scanNode(activeNetworkId, selectedNode.id)
        // Report findings
        const vulnServices = selectedNode.services.filter((sv) => sv.hasKnownVulnerability)
        if (vulnServices.length > 0) {
          logTerminal(`Scan complete — ${vulnServices.length} exploitable service(s) found.`, 'success')
          vulnServices.forEach((sv) =>
            logTerminal(`  ${sv.protocol}:${sv.port} → ${sv.vulnerabilityId}`, 'success'),
          )
          logTerminal('CRACK will now use exploit method (faster).', 'system')
        } else {
          logTerminal(`Scan complete — no known vulnerabilities on this node.`, 'system')
        }
      }
    }, 80)
  }

  function startCrack() {
    if (!selectedNode || !player || activeJob) return
    if (selectedNode.isBreached) {
      logTerminal(`${selectedNode.label} is already compromised.`, 'dim')
      return
    }

    // Lockout check
    const now0 = Date.now()
    if (selectedNode.isLockedOut && selectedNode.lockoutUntil && selectedNode.lockoutUntil > now0) {
      const secsLeft = Math.ceil((selectedNode.lockoutUntil - now0) / 1000)
      logTerminal(`LOCKOUT ACTIVE — ${selectedNode.label}: ${secsLeft}s remaining. Wait or select a different target.`, 'error')
      return
    }

    // Determine exploit protocol
    const vulnService = selectedNode.isScanned
      ? selectedNode.services.find((sv) => sv.hasKnownVulnerability)
      : null
    const hasExploit = !!vulnService
    const method = hasExploit ? 'exploit' : 'dictionary'
    const exploitProtocol = vulnService?.protocol

    // Zone B gate: cannot access if zone B and pivot not breached
    if (selectedNode.zone === 'B' && activeNetwork) {
      const pivotBreached = activeNetwork.nodes.some((n) => n.isPivotNode && n.isBreached)
      if (!pivotBreached) {
        logTerminal(`ZONE B LOCKED — ${selectedNode.label} is in the internal subnet. Breach the ADMIN CONSOLE (pivot node) first.`, 'error')
        return
      }
    }

    // SMB: requires cached credentials
    if (exploitProtocol === 'SMB' && hasExploit) {
      const hasCreds = credentialCache.some(
        (c) => c.networkId === activeNetworkId && c.expiresAt > now0,
      )
      if (!hasCreds) {
        logTerminal(`SMB PASS-THE-HASH requires cached credentials. Dump credentials from another node first.`, 'error')
        return
      }
    }

    const hasCredentials = credentialCache.some(
      (c) => c.networkId === activeNetworkId && c.expiresAt > now0,
    )

    const baseJob = startCrackJob(
      selectedNode.id,
      method,
      player.software.passwordCrackers[0]?.toolId ?? 'cracker_basic',
      player.software.passwordCrackers[0]?.level ?? 1,
      selectedNode,
      player.hardware,
      { exploitProtocol, hasCredentials },
    )
    // GPU acceleration: t1 = ×0.75 duration, t2 = ×0.55, t3 = ×0.35
    const gpuMult = { 0: 1, 1: 0.75, 2: 0.55, 3: 0.35 }[player.hardware.gpuTier ?? 0] ?? 1
    let job = player.specialization === 'brute'
      ? { ...baseJob, durationMs: Math.round(baseJob.durationMs / 1.35 * gpuMult) }
      : { ...baseJob, durationMs: Math.round(baseJob.durationMs * gpuMult) }

    // Credential pack consumable: instant breach
    if (player.activeFlags.consumable_cred_pack_armed) {
      job = { ...job, durationMs: 200 }
      logTerminal('CRED PACK consumed — instant bypass active.', 'system')
      // Clear the flag through the store
      useGameStore.setState((s) => {
        if (s.player?.activeFlags) delete s.player.activeFlags.consumable_cred_pack_armed
        return s
      })
    }
    setActiveJob(job)
    setJobProgress(0)

    const exploitLabel = exploitProtocol
      ? `EXPLOIT [${exploitProtocol}]`
      : method.replace('_', ' ')
    logTerminal(
      `${exploitLabel} — ${selectedNode.type.replace(/_/g, ' ')} [T${selectedNode.securityTier}]…`,
      'system',
    )

    intervalRef.current = setInterval(() => {
      const now = Date.now()
      const updated = tickCrackJob(job, now)
      setJobProgress(updated.progress)
      if (updated.isComplete) {
        clearInterval(intervalRef.current!)
        setActiveJob(null)
        if (activeNetworkId) {
          breachNode(activeNetworkId, selectedNode.id)
          if (exploitProtocol) {
            applyExploitEffects(activeNetworkId, selectedNode.id, exploitProtocol)
          }
          AudioEngine.playSfx('crack')
          if (!exploitProtocol) {
            logTerminal(`Access granted: ${selectedNode.type.replace(/_/g, ' ')}`, 'success')
            logTerminal(`Files and services now accessible.`, 'system')
          }
        }
      }
    }, 80)
  }

  function cancelCrack() {
    if (!activeJob || !selectedNode || !activeNetworkId) return
    clearInterval(intervalRef.current!)
    setActiveJob(null)
    setJobProgress(0)
    // Brute lockout: tier 4-5 nodes lock on cancel (brute spec needs 2 fails)
    if (selectedNode.securityTier >= 4) {
      const attempts = (selectedNode.failedCrackAttempts ?? 0) + 1
      const lockoutThreshold = player?.specialization === 'brute' ? 2 : 1
      if (attempts >= lockoutThreshold) {
        triggerNodeLockout(activeNetworkId, selectedNode.id)
      } else {
        recordFailedCrack(activeNetworkId, selectedNode.id)
        logTerminal(`CRACK CANCELLED — ${selectedNode.label}: failed attempt ${attempts}/${lockoutThreshold} before lockout.`, 'warn')
      }
    } else {
      logTerminal(`Crack cancelled.`, 'dim')
    }
  }

  function handleIntercept() {
    if (!rivalHacker) return
    interceptRival()
    logTerminal(`Rival hacker ${rivalHacker.handle} intercepted and booted.`, 'success')
    logTerminal('Trace speed returning to normal.', 'system')
  }

  function startDump() {
    if (!selectedNode || !activeNetworkId || dumpingNodeId) return
    if (!selectedNode.isBreached) { logTerminal('ERROR: Node must be breached first.', 'error'); return }
    const already = credentialCache.some(
      (c) => c.sourceNodeId === selectedNode.id && c.networkId === activeNetworkId,
    )
    if (already) { logTerminal('Credentials already cached from this node.', 'dim'); return }
    const durationMs = selectedNode.securityTier * 700 + 1500 + Math.random() * 800
    const startedAt = Date.now()
    setDumpingNodeId(selectedNode.id)
    setDumpProgress(0)
    logTerminal(`Extracting credentials from ${selectedNode.type.replace(/_/g, ' ')} [T${selectedNode.securityTier}]…`, 'system')
    dumpIntervalRef.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - startedAt) / durationMs)
      setDumpProgress(p)
      if (p >= 1) {
        clearInterval(dumpIntervalRef.current!)
        setDumpingNodeId(null)
        dumpCredentials(activeNetworkId, selectedNode.id)
      }
    }, 80)
  }

  function startScrape() {
    if (!selectedNode || !activeNetworkId || scrapingNodeId) return
    if (!selectedNode.isBreached) { logTerminal('ERROR: Node must be breached first.', 'error'); return }
    if ((player?.hardware.cpuSpeed ?? 0) < 2) {
      logTerminal('MEMORY SCRAPE requires CPU ≥ 2 GHz.', 'error'); return
    }
    const durationMs = selectedNode.securityTier * 500 + 1200 + Math.random() * 600
    const startedAt = Date.now()
    setScrapingNodeId(selectedNode.id)
    setScrapeProgress(0)
    setScrapeResult(null)
    logTerminal(`Scraping process memory on ${selectedNode.type.replace(/_/g, ' ')} [T${selectedNode.securityTier}]…`, 'system')
    scrapeIntervalRef.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - startedAt) / durationMs)
      setScrapeProgress(p)
      if (p >= 1) {
        clearInterval(scrapeIntervalRef.current!)
        setScrapingNodeId(null)
        const result = scrapeMemory(activeNetworkId, selectedNode.id)
        if (result) {
          setScrapeResult(result)
        } else {
          logTerminal('MEMORY SCRAPE — no adjacent unbreached nodes to extract credentials for.', 'dim')
        }
      }
    }, 80)
  }

  function handleUseCredential() {
    if (!selectedNode || !activeNetworkId || credentialAccessing) return
    setCredentialAccessing(true)
    logTerminal(`Passing credentials to ${selectedNode.type.replace(/_/g, ' ')}…`, 'system')
    setTimeout(() => {
      setCredentialAccessing(false)
      const result = useCredential(activeNetworkId, selectedNode.id)
      if (result === 'ok') {
        AudioEngine.playSfx('crack')
      } else {
        logTerminal('No valid credential found for this node.', 'error')
      }
    }, 600)
  }

  function handleDisconnect() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (wipeIntervalRef.current) clearInterval(wipeIntervalRef.current)
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current)
    if (dumpIntervalRef.current) clearInterval(dumpIntervalRef.current)
    if (scrapeIntervalRef.current) clearInterval(scrapeIntervalRef.current)
    setActiveJob(null)
    setWipingNodeId(null)
    setScanningNodeId(null)
    setDumpingNodeId(null)
    setScrapingNodeId(null)
    setScrapeResult(null)
    setCredentialAccessing(false)
    setProxyCount(0)
    disconnect()
    logTerminal('Connection terminated.', 'system')
  }

  function wipeLog() {
    if (!selectedNode?.isBreached) {
      logTerminal('ERROR: Node must be breached before wiping logs.', 'error')
      return
    }
    if (selectedNode.isLogWiped) {
      logTerminal(`Logs already wiped on ${selectedNode.type.replace(/_/g, ' ')}.`, 'dim')
      return
    }
    if (wipingNodeId) {
      logTerminal('Log wipe already in progress.', 'dim')
      return
    }

    const tier = selectedNode.securityTier
    const wipeMult = player?.specialization === 'ghost' ? 0.6 : 1
    const durationMs = Math.max(2000, (tier * 1800 + Math.random() * 1000) * wipeMult)
    const startedAt = Date.now()
    setWipingNodeId(selectedNode.id)
    setWipeProgress(0)
    logTerminal(`Wiping log entries on ${selectedNode.type.replace(/_/g, ' ')} [T${tier}]…`, 'system')

    wipeIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt
      const p = Math.min(1, elapsed / durationMs)
      setWipeProgress(p)
      if (p >= 1) {
        clearInterval(wipeIntervalRef.current!)
        setWipingNodeId(null)
        if (activeNetworkId) wipeNodeLog(activeNetworkId, selectedNode.id)
        AudioEngine.playSfx('wipe')
        logTerminal(`Log entries purged. No trace of access remains.`, 'success')
      }
    }, 80)
  }

  // Wipe every breached + un-wiped node sequentially.
  function startWipeAll() {
    if (!activeNetworkId || !activeNetwork) return
    const remaining = activeNetwork.nodes.filter((n) => n.isBreached && !n.isLogWiped)
    if (remaining.length === 0) return
    logTerminal(`Wiping ${remaining.length} node${remaining.length === 1 ? '' : 's'}…`, 'system')

    const wipeMult = player?.specialization === 'ghost' ? 0.6 : 1
    const queue = [...remaining]
    let cancelled = false

    function wipeNext() {
      if (cancelled) return
      const node = queue.shift()
      if (!node) {
        setWipingNodeId(null)
        logTerminal('All log entries purged. No trace remains.', 'success')
        AudioEngine.playSfx('success')
        return
      }
      const tier = node.securityTier
      const durationMs = Math.max(2000, (tier * 1800 + Math.random() * 1000) * wipeMult)
      const startedAt = Date.now()
      setWipingNodeId(node.id)
      setWipeProgress(0)
      wipeIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startedAt
        const p = Math.min(1, elapsed / durationMs)
        setWipeProgress(p)
        if (p >= 1) {
          clearInterval(wipeIntervalRef.current!)
          if (activeNetworkId) wipeNodeLog(activeNetworkId, node.id)
          AudioEngine.playSfx('wipe')
          logTerminal(`${node.type.replace(/_/g, ' ').toUpperCase()}: logs purged.`, 'system')
          wipeNext()
        }
      }, 80)
    }
    wipeNext()
  }

  const activeMissions = useGameStore((s) => s.missions.filter((m) => m.status === 'active'))
  const activeMission = activeMissions[0] ?? null
  const primaryObjective = activeMission?.objectives.find((o) => !o.isOptional)
  const optionalObjectives = activeMission?.objectives.filter((o) => o.isOptional) ?? []

  const allPrimaryDone = activeMission
    ? activeMission.objectives.filter((o) => !o.isOptional).every((o) => o.isCompleted)
    : false

  const breachedNodes = activeNetwork?.nodes.filter((n) => n.isBreached) ?? []
  const dirtyNodes = breachedNodes.filter((n) => !n.isLogWiped)
  const allLogsClear = breachedNodes.length === 0 || dirtyNodes.length === 0
  const readyToExit = allPrimaryDone && allLogsClear

  // ── Dynamic step guide ────────────────────────────────────────────────
  const TARGET_NODE_TYPES: Partial<Record<string, string[]>> = {
    account_deletion:    ['database'],
    database_corruption: ['database'],
    file_theft:          ['file_server', 'database', 'mail_server'],
    network_sabotage:    ['router', 'admin_console'],
    evidence_planting:   ['file_server'],
    bounty_hunt:         ['endpoint', 'database'],
  }
  const ACTION_LABEL: Partial<Record<string, string>> = {
    account_deletion:    'DELETE ACCOUNT',
    database_corruption: 'CORRUPT DATABASE',
    network_sabotage:    'SABOTAGE NODE',
    evidence_planting:   'UPLOAD EVIDENCE',
  }
  const missionStep = (() => {
    if (!activeMission || !activeNetwork) return null
    const targetTypes = TARGET_NODE_TYPES[activeMission.type] ?? []
    const targetNodes = activeNetwork.nodes.filter((n) => targetTypes.includes(n.type))
    const targetBreached = targetNodes.some((n) => n.isBreached)
    const targetNodeLabel = targetTypes[0]?.replace(/_/g, ' ').toUpperCase() ?? 'TARGET NODE'
    const actionLabel = ACTION_LABEL[activeMission.type]

    if (allPrimaryDone && allLogsClear) {
      return { step: 4, done: true, description: 'Ready to disconnect', detail: 'Click SECURE DISCONNECT to complete the mission and collect payment.' }
    }
    if (allPrimaryDone) {
      return { step: 3, done: false, description: 'Cover your tracks', detail: `Select each breached node in the Network Map, then run WIPE LOG in the Hacking Interface.` }
    }
    if (activeMission.type === 'file_theft') {
      if (!targetBreached) {
        return { step: 1, done: false, description: `Breach a node with mission files`, detail: `In the Network Map, click a FILE SERVER or DATABASE node → SCAN → CRACK. Then transfer the ★ marked file.` }
      }
      return { step: 2, done: false, description: `Transfer the target file`, detail: `Click the breached node in the Network Map. Find the ★ marked file in the right panel and click TRANSFER.` }
    }
    if (actionLabel) {
      if (!targetBreached) {
        return { step: 1, done: false, description: `Breach the ${targetNodeLabel}`, detail: `In the Network Map, click the ${targetNodeLabel} node → SCAN it → CRACK it to gain access.` }
      }
      return { step: 2, done: false, description: `Execute: ${actionLabel}`, detail: `Click the breached ${targetNodeLabel} in the Network Map. The ${actionLabel} button will appear in the right panel.` }
    }
    return null
  })()

  const ramSlots = (player?.hardware.ramSlots ?? 2) + (player?.specialization === 'architect' ? 1 : 0)
  const activeToolCount = (!!scanningNodeId ? 1 : 0) + (!!activeJob ? 1 : 0) + (!!wipingNodeId ? 1 : 0) +
    (!!dumpingNodeId ? 1 : 0) + (!!scrapingNodeId ? 1 : 0)
  const ramFull = activeToolCount >= ramSlots

  // Node lockout state
  const lockoutSecsLeft = selectedNode?.isLockedOut && selectedNode.lockoutUntil
    ? Math.max(0, Math.ceil((selectedNode.lockoutUntil - Date.now()) / 1000))
    : 0
  const isNodeLockedOut = lockoutSecsLeft > 0

  // Zone B blocked (pivot not breached)
  const zoneBBlocked = selectedNode?.zone === 'B' && activeNetwork
    ? !activeNetwork.nodes.some((n) => n.isPivotNode && n.isBreached)
    : false

  // Exploit protocol label
  const vulnSvc = selectedNode?.isScanned
    ? selectedNode.services.find((sv) => sv.hasKnownVulnerability)
    : null
  const exploitLabel = vulnSvc
    ? `EXPLOIT [${vulnSvc.protocol}]`
    : null

  const now = Date.now()
  const activeCreds = credentialCache.filter((c) => c.networkId === activeNetworkId && c.expiresAt > now)
  const hasActiveCred = activeCreds.length > 0
  const credForSelected = selectedNode
    ? activeCreds.find((c) => c.method === 'dump' || c.targetNodeId === selectedNode.id)
    : null
  const alreadyDumped = selectedNode
    ? credentialCache.some((c) => c.sourceNodeId === selectedNode.id && c.networkId === activeNetworkId)
    : false
  const canDump = !!selectedNode?.isBreached &&
    ['admin_console', 'endpoint', 'database', 'mail_server'].includes(selectedNode.type) &&
    !alreadyDumped && !dumpingNodeId
  const canScrape = !!selectedNode?.isBreached &&
    ['admin_console', 'endpoint', 'mail_server'].includes(selectedNode.type) &&
    (player?.hardware.cpuSpeed ?? 0) >= 2 && !scrapingNodeId
  const canUseCred = !!selectedNode && !selectedNode.isBreached && !!credForSelected && !credentialAccessing

  function startCleanHop(hopId: string) {
    if (cleaningHopId) return
    setCleaningHopId(hopId)
    setCleanHopProgress(0)
    const durationMs = 6000 + Math.random() * 3000
    const startedAt = Date.now()
    logTerminal(`Connecting to bounce node — wiping access logs…`, 'system')
    cleanHopIntervalRef.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - startedAt) / durationMs)
      setCleanHopProgress(p)
      if (p >= 1) {
        clearInterval(cleanHopIntervalRef.current!)
        setCleaningHopId(null)
        wipeBounceNode(hopId)
        AudioEngine.playSfx('wipe')
        logTerminal('Bounce node logs wiped — node status: CLEAN.', 'success')
      }
    }, 80)
  }

  // Pre-mission: bounce routing has moved to the WORLD MAP.
  // Keep this panel minimal — a launcher + dirty-hop cleanup utility.
  if (!traceState) {
    const bounceLibrary = player?.bounceLibrary ?? []
    const dirtyHops = bounceLibrary.filter((n) => n.logStatus === 'dirty')
    const tracedHops = bounceLibrary.filter((n) => n.logStatus === 'traced')

    return (
      <div className={styles.bouncePanel} data-tutorial="bounce-panel">
        <div className={styles.section}>
          <div className={styles.sectionLabel}>RELAY CHAIN</div>
          <span className={styles.dim}>
            Configure your relay chain on the WORLD MAP. Each relay hop slows trace accumulation. Max hops scale with your installed Relay software (basic = 3, v2 = 5, v3 = 7).
          </span>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>ACTIVE ROUTE — {activeRoute.length} HOP{activeRoute.length !== 1 ? 'S' : ''}</div>
          {activeRoute.length === 0 ? (
            <span className={styles.dim}>No route set — traces will reach you directly.</span>
          ) : (
            <div className={styles.routeChain}>
              <div className={styles.routeOrigin}>YOU</div>
              {activeRoute.map((hopId) => {
                const node = bounceLibrary.find((n) => n.id === hopId)
                if (!node) return null
                return (
                  <div key={hopId} className={styles.routeHop}>
                    <span className={styles.routeArrow}>↓</span>
                    <div className={styles.routeNode}>
                      <span className={`${styles.bounceStatus} ${styles[`status_${node.logStatus}`]}`}>●</span>
                      <span className={styles.routeNodeLabel}>{node.label}</span>
                      <span className={styles.routeNodeMeta}>{node.region} · T{node.tier}</span>
                    </div>
                  </div>
                )
              })}
              <span className={styles.routeArrow}>↓</span>
              <div className={styles.routeTarget}>TARGET</div>
            </div>
          )}
          <Button variant="primary" size="sm" onClick={() => openWindow({
            id: 'world-map', title: 'GLOBAL NETWORK MAP', component: 'WorldMap',
            x: 200, y: 80, width: 820, height: 580, isMinimized: false,
          })}>
            ▶ OPEN WORLD MAP TO EDIT ROUTE
          </Button>
        </div>

        {/* Cleanup utility: only show dirty hops here */}
        {dirtyHops.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>DIRTY HOPS — CLEAN BEFORE REUSE</div>
            {dirtyHops.map((node) => (
              <div key={node.id} className={styles.bounceNode}>
                <div className={styles.bounceNodeInfo}>
                  <span className={`${styles.bounceStatus} ${styles[`status_${node.logStatus}`]}`}>●</span>
                  <span className={styles.bounceNodeLabel}>{node.label}</span>
                  <span className={styles.bounceNodeMeta}>{node.region}</span>
                  <span className={styles.bounceTier}>T{node.tier}</span>
                </div>
                {cleaningHopId !== node.id ? (
                  <div className={styles.hopActionRow}>
                    <span className={styles.dirtyWarn}>⚠ LOGS DIRTY</span>
                    <Button variant="ghost" size="sm" onClick={() => startCleanHop(node.id)} disabled={!!cleaningHopId}>
                      CLEAN HOP
                    </Button>
                  </div>
                ) : (
                  <div className={styles.hopCleanProgress}>
                    <div className={styles.hopCleanLabel}>WIPING LOGS… {Math.round(cleanHopProgress * 100)}%</div>
                    <div className={styles.progressTrack}>
                      <div className={styles.progressFillWipe} style={{ width: `${cleanHopProgress * 100}%` }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tracedHops.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>TRACED HOPS — CANNOT BE REUSED</div>
            {tracedHops.map((node) => (
              <div key={node.id} className={styles.bounceNode}>
                <div className={styles.bounceNodeInfo}>
                  <span className={`${styles.bounceStatus} ${styles.status_traced}`}>●</span>
                  <span className={styles.bounceNodeLabel}>{node.label}</span>
                  <span className={styles.bounceNodeMeta}>{node.region}</span>
                </div>
                <span className={`${styles.dirtyWarn} ${styles.status_traced}`}>✗ TRACED</span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.section}>
          <span className={styles.dim}>Accept a mission from the Mission Board to begin.</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.interface}>

      {/* Trace */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>{t('hackingInterface.traceStatus')}</div>
        <TraceBar
          level={traceState.level}
          status={traceState.status}
          hopsRemaining={traceState.hopsRemaining}
          totalHops={traceState.totalHops}
        />
      </div>

      {/* Bounce chain status */}
      {traceState.totalHops > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>
            RELAY CHAIN — {traceState.hopsRemaining}/{traceState.totalHops} HOPS REMAINING
          </div>
          <div className={styles.hopChain}>
            {activeRoute.map((hopId, i) => {
              const burnedCount = traceState.totalHops - traceState.hopsRemaining
              const burned = i < burnedCount
              const current = i === burnedCount
              const node = player?.bounceLibrary.find((n) => n.id === hopId)
              return (
                <div
                  key={hopId}
                  className={`${styles.hopNode} ${burned ? styles.hopBurned : current ? styles.hopCurrent : styles.hopPending}`}
                >
                  {burned ? '✗' : current ? '◉' : '○'} {node?.label ?? hopId}
                  {burned && <span style={{ marginLeft: 6, fontSize: 9, color: '#ff9900' }}>LOGGED</span>}
                  {current && <span style={{ marginLeft: 6, fontSize: 9, color: '#00cfff' }}>ACTIVE HOP</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Target info */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>{t('hackingInterface.targetNetwork')}</div>
        {activeNetwork ? (
          <div className={styles.targetInfo}>
            <div className={styles.targetName}>{activeNetwork.label}</div>
            <div className={styles.targetMeta}>
              {t('hackingInterface.nodesBreached', {
                breached: activeNetwork.nodes.filter((n) => n.isBreached).length,
                total: activeNetwork.nodes.length,
              })} &nbsp;·&nbsp;
              {t('hackingInterface.baseTrace', { speed: activeNetwork.traceSpeed })}
            </div>
          </div>
        ) : (
          <span className={styles.dim}>{t('hackingInterface.locating')}</span>
        )}
      </div>

      {/* Objectives */}
      {(primaryObjective || optionalObjectives.length > 0) && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>{t('hackingInterface.objectives')}</div>
          {primaryObjective && (
            <div className={`${styles.objective} ${primaryObjective.isCompleted ? styles.objectiveDone : ''}`}>
              {primaryObjective.isCompleted ? '✓' : '○'} {primaryObjective.description}
            </div>
          )}
          {optionalObjectives.map((obj) => (
            <div key={obj.id} className={`${styles.objectiveOptional} ${obj.isCompleted ? styles.objectiveDone : ''}`}>
              {obj.isCompleted ? '✓' : '◌'} <span className={styles.optionalLabel}>{t('hackingInterface.optional')}</span> {obj.description}
            </div>
          ))}
        </div>
      )}

      {/* M14m: phase indicator — only shown if the mission has phases */}
      {activeMission?.phases && activeMission.phases.length > 1 && (
        <div className={styles.phaseStrip}>
          <div className={styles.phaseHeader}>
            <span className={styles.phaseBadge}>
              PHASE {(activeMission.currentPhaseIndex ?? 0) + 1} / {activeMission.phases.length}
            </span>
            <span className={styles.phaseLabel}>
              {activeMission.phases[activeMission.currentPhaseIndex ?? 0]?.label.toUpperCase()}
            </span>
          </div>
          <div className={styles.phaseDots}>
            {activeMission.phases.map((_, i) => {
              const done = i < (activeMission.currentPhaseIndex ?? 0)
              const current = i === (activeMission.currentPhaseIndex ?? 0)
              return (
                <span
                  key={i}
                  className={`${styles.phaseDot} ${done ? styles.phaseDotDone : ''} ${current ? styles.phaseDotCurrent : ''}`}
                />
              )
            })}
          </div>
          <div className={styles.phaseDesc}>
            {activeMission.phases[activeMission.currentPhaseIndex ?? 0]?.description}
          </div>
        </div>
      )}

      {/* Step guide */}
      {missionStep && (
        <div className={`${styles.stepGuide} ${missionStep.done ? styles.stepGuideDone : ''}`}>
          <div className={styles.stepGuideHeader}>
            <span className={styles.stepBadge}>STEP {missionStep.step}/4</span>
            NEXT ACTION
          </div>
          <div className={styles.stepDescription}>{missionStep.description}</div>
          <div className={styles.stepDetail}>{missionStep.detail}</div>
        </div>
      )}

      {/* Rival hacker alert */}
      {rivalHacker && (
        <div className={styles.rivalAlert} role="alert" aria-live="assertive">
          <div className={styles.rivalHeader}>
            <span className={styles.rivalLabel}>{t('hackingInterface.intruderDetected')}</span>
            <span className={styles.rivalHandle}>{rivalHacker.handle}</span>
          </div>
          <p className={styles.rivalDesc}>{t('hackingInterface.rivalDesc')}</p>
          <Button variant="danger" size="sm" onClick={handleIntercept}>
            {t('hackingInterface.intercept')}
          </Button>
        </div>
      )}

      {/* Selected node */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>{t('hackingInterface.selectedNode')}</div>
        {selectedNode ? (
          <div className={styles.selectedNode}>
            <span className={styles.selectedNodeType}>
              {selectedNode.type.replace(/_/g, ' ').toUpperCase()}
              {selectedNode.zone && (
                <span className={selectedNode.zone === 'B' ? styles.zoneBadgeB : styles.zoneBadgeA}>
                  {' '}ZONE {selectedNode.zone}
                </span>
              )}
            </span>
            <span className={`${styles.selectedNodeStatus} ${selectedNode.isBreached ? styles.breachedText : isNodeLockedOut ? styles.lockedOutText : ''}`}>
              {selectedNode.isBreached
                ? t('hackingInterface.compromised')
                : isNodeLockedOut
                  ? `LOCKED OUT — ${lockoutSecsLeft}s`
                  : zoneBBlocked
                    ? 'ZONE B — PIVOT REQUIRED'
                    : t('hackingInterface.tier', { tier: selectedNode.securityTier })}
            </span>
          </div>
        ) : (
          <span className={styles.dim}>{t('hackingInterface.clickNode')}</span>
        )}
      </div>

      {/* Tools */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>
          {t('hackingInterface.tools')}
          <span className={ramFull ? styles.ramFull : styles.ramOk}>
            {' '}{t('hackingInterface.ram', { active: activeToolCount, total: ramSlots })}
          </span>
        </div>
        <div className={styles.toolGrid}>
          <Button
            variant="secondary"
            size="sm"
            onClick={runScan}
            disabled={!selectedNode || !!scanningNodeId || selectedNode?.isScanned || (!scanningNodeId && ramFull)}
          >
            {scanningNodeId
              ? t('hackingInterface.scanning')
              : selectedNode?.isScanned
                ? t('hackingInterface.scanned')
                : t('hackingInterface.scan')}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={activeJob ? cancelCrack : startCrack}
            disabled={
              !selectedNode ||
              selectedNode?.isBreached ||
              isNodeLockedOut ||
              zoneBBlocked ||
              (!activeJob && ramFull)
            }
            title={isNodeLockedOut ? `Locked out — wait ${lockoutSecsLeft}s` : zoneBBlocked ? 'Breach pivot node first' : undefined}
          >
            {activeJob
              ? `${t('hackingInterface.cracking')} [CANCEL]`
              : isNodeLockedOut
                ? `LOCKED ${lockoutSecsLeft}s`
                : exploitLabel ?? t('hackingInterface.crack')}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={wipeLog}
            disabled={!selectedNode?.isBreached || !!wipingNodeId || selectedNode?.isLogWiped || (!wipingNodeId && ramFull)}
          >
            {wipingNodeId
              ? t('hackingInterface.wiping')
              : selectedNode?.isLogWiped
                ? t('hackingInterface.wiped')
                : t('hackingInterface.wipeLog')}
          </Button>
          {/* +PROXY / -PROXY buttons removed in M14h.5 — bounce reduction now
              comes entirely from the active relay route (WORLD MAP). */}
          <Button
            variant="secondary"
            size="sm"
            onClick={startDump}
            disabled={!canDump || (!dumpingNodeId && ramFull)}
            title={
              !selectedNode?.isBreached ? 'Breach node first' :
              alreadyDumped ? 'Already cached' :
              !['admin_console','endpoint','database','mail_server'].includes(selectedNode?.type ?? '') ? 'Node type not supported' :
              'Dump cached credentials from this node'
            }
          >
            {dumpingNodeId === selectedNode?.id ? 'DUMPING…' : alreadyDumped ? 'DUMPED ✓' : 'DUMP CREDS'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={startScrape}
            disabled={!canScrape || (!scrapingNodeId && ramFull)}
            title={
              !selectedNode?.isBreached ? 'Breach node first' :
              (player?.hardware.cpuSpeed ?? 0) < 2 ? 'Requires CPU ≥ 2 GHz' :
              'Silently scrape process memory for credentials (no log entry)'
            }
          >
            {scrapingNodeId === selectedNode?.id ? 'SCRAPING…' : 'SCRAPE MEM'}
          </Button>
          {canUseCred && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleUseCredential}
              disabled={credentialAccessing}
              title="Instant access using cached credentials — no crack required"
            >
              {credentialAccessing ? 'ACCESSING…' : 'USE CREDENTIALS'}
            </Button>
          )}
        </div>

        {scanningNodeId && (
          <div className={styles.progressSection}>
            <div className={styles.progressLabel} aria-hidden="true">
              {t('hackingInterface.portScan', { pct: Math.round(scanProgress * 100) })}
            </div>
            <div
              className={styles.progressTrack}
              role="progressbar"
              aria-valuenow={Math.round(scanProgress * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Port scan progress"
            >
              <div className={styles.progressFillScan} style={{ width: `${scanProgress * 100}%` }} />
            </div>
          </div>
        )}

        {activeJob && (
          <div className={styles.progressSection}>
            <div className={styles.progressLabel} aria-hidden="true">
              {activeJob.method === 'exploit'
                ? t('hackingInterface.exploitingProgress', { pct: Math.round(jobProgress * 100) })
                : t('hackingInterface.crackingProgress', { pct: Math.round(jobProgress * 100) })}
            </div>
            <div
              className={styles.progressTrack}
              role="progressbar"
              aria-valuenow={Math.round(jobProgress * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={activeJob.method === 'exploit' ? 'Exploit progress' : 'Crack progress'}
            >
              <div className={styles.progressFill} style={{ width: `${jobProgress * 100}%` }} />
            </div>
          </div>
        )}

        {wipingNodeId && (
          <div className={styles.progressSection}>
            <div className={styles.progressLabel} aria-hidden="true">
              {t('hackingInterface.wipingProgress', { pct: Math.round(wipeProgress * 100) })}
            </div>
            <div
              className={styles.progressTrack}
              role="progressbar"
              aria-valuenow={Math.round(wipeProgress * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Log wipe progress"
            >
              <div className={styles.progressFillWipe} style={{ width: `${wipeProgress * 100}%` }} />
            </div>
          </div>
        )}

        {dumpingNodeId && (
          <div className={styles.progressSection}>
            <div className={styles.progressLabel}>CREDENTIAL DUMP — {Math.round(dumpProgress * 100)}%</div>
            <div className={styles.progressTrack} role="progressbar" aria-valuenow={Math.round(dumpProgress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Credential dump progress">
              <div className={styles.progressFillDump} style={{ width: `${dumpProgress * 100}%` }} />
            </div>
          </div>
        )}

        {scrapingNodeId && (
          <div className={styles.progressSection}>
            <div className={styles.progressLabel}>MEMORY SCRAPE — {Math.round(scrapeProgress * 100)}%</div>
            <div className={styles.progressTrack} role="progressbar" aria-valuenow={Math.round(scrapeProgress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Memory scrape progress">
              <div className={styles.progressFillScrape} style={{ width: `${scrapeProgress * 100}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Credential cache — shown when any active creds exist */}
      {hasActiveCred && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>CREDENTIAL CACHE — {activeCreds.length} ACTIVE</div>
          <div className={styles.credCache}>
            {activeCreds.map((cred) => {
              const minsLeft = Math.max(0, Math.ceil((cred.expiresAt - now) / 60_000))
              return (
                <div key={cred.id} className={styles.credEntry}>
                  <span className={styles.credIcon}>{cred.method === 'scrape' ? '⬤' : '⬛'}</span>
                  <div className={styles.credInfo}>
                    <span className={styles.credLabel}>{cred.sourceLabel}</span>
                    {cred.targetLabel && (
                      <span className={styles.credTarget}>→ {cred.targetLabel}</span>
                    )}
                  </div>
                  <span className={styles.credExpiry}>{minsLeft}m</span>
                </div>
              )
            })}
          </div>
          {scrapeResult && (
            <div className={styles.scrapeAlert}>
              SCRAPED: {scrapeResult.targetLabel ?? 'adjacent node'} — credentials ready
            </div>
          )}
        </div>
      )}

      {/* Cover tracks checklist — shown after primary objectives complete */}
      {allPrimaryDone && breachedNodes.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>
            COVER YOUR TRACKS
            {allLogsClear && <span className={styles.tracksClear}> — CLEAR</span>}
          </div>
          {breachedNodes.map((node) => (
            <div
              key={node.id}
              className={`${styles.trackNode} ${node.isLogWiped ? styles.trackNodeDone : styles.trackNodeDirty}`}
            >
              {node.isLogWiped ? '✓' : '✗'}{' '}
              {node.type.replace(/_/g, ' ').toUpperCase()}
              {!node.isLogWiped && (
                <span className={styles.trackNodeWarning}> — LOGS REMAIN</span>
              )}
            </div>
          ))}
          {!allLogsClear && !wipingNodeId && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => startWipeAll()}
              className={styles.wipeAllBtn}
            >
              ▶ WIPE ALL LOGS ({dirtyNodes.length})
            </Button>
          )}
        </div>
      )}

      {/* Disconnect */}
      <div className={styles.disconnectSection}>
        <Button
          variant={readyToExit ? 'primary' : 'secondary'}
          size="md"
          onClick={handleDisconnect}
          className={styles.disconnectBtn}
        >
          {readyToExit
            ? 'SECURE DISCONNECT'
            : allPrimaryDone
              ? 'LEAVE NETWORK'
              : t('hackingInterface.disconnect')}
        </Button>
        {!allPrimaryDone && (
          <span className={styles.disconnectWarning}>
            {t('hackingInterface.disconnectWarning')}
          </span>
        )}
        {allPrimaryDone && !allLogsClear && (
          <span className={styles.disconnectWarning}>
            ⚠ MISSION WILL FAIL — wipe all logs first to get paid. Dirty exit = no payment + corp opens an investigation against you.
          </span>
        )}
      </div>
    </div>
  )
}
