import { useState, useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore.ts'
import { Button, TraceBar } from '@uplink/ui'
import { startCrackJob, tickCrackJob, applyProxyBounce, removeProxyBounce } from '@uplink/core'
import type { CrackJob } from '@uplink/core'
import styles from './HackingInterface.module.css'

export function HackingInterface() {
  const traceState = useGameStore((s) => s.traceState)
  const networks = useGameStore((s) => s.networks)
  const activeNetworkId = useGameStore((s) => s.activeNetworkId)
  const selectedNodeId = useGameStore((s) => s.selectedNodeId)
  const player = useGameStore((s) => s.player)
  const logTerminal = useGameStore((s) => s.logTerminal)
  const breachNode = useGameStore((s) => s.breachNode)
  const disconnect = useGameStore((s) => s.disconnect)
  const rivalHacker = useGameStore((s) => s.rivalHacker)
  const interceptRival = useGameStore((s) => s.interceptRival)

  const [activeJob, setActiveJob] = useState<CrackJob | null>(null)
  const [jobProgress, setJobProgress] = useState(0)
  const [proxyCount, setProxyCount] = useState(0)
  const [wipeProgress, setWipeProgress] = useState(0)
  const [wipingNodeId, setWipingNodeId] = useState<string | null>(null)
  const [wipedNodeIds, setWipedNodeIds] = useState<Set<string>>(new Set())
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const wipeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const activeNetwork = activeNetworkId ? networks[activeNetworkId] : null
  const selectedNode = activeNetwork?.nodes.find((n) => n.id === selectedNodeId) ?? null

  // Clean up intervals on unmount
  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (wipeIntervalRef.current) clearInterval(wipeIntervalRef.current)
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

  function startCrack() {
    if (!selectedNode || !player || activeJob) return
    if (selectedNode.isBreached) {
      logTerminal(`${selectedNode.label} is already compromised.`, 'dim')
      return
    }

    const job = startCrackJob(
      selectedNode.id,
      'dictionary',
      player.software.passwordCrackers[0]?.toolId ?? 'cracker_basic',
      player.software.passwordCrackers[0]?.level ?? 1,
      selectedNode,
      player.hardware,
    )
    setActiveJob(job)
    setJobProgress(0)
    logTerminal(
      `Starting dictionary attack on ${selectedNode.type.replace(/_/g, ' ')} [T${selectedNode.securityTier}]...`,
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
          logTerminal(`Access granted: ${selectedNode.type.replace(/_/g, ' ')}`, 'success')
          logTerminal(`Files and services now accessible.`, 'system')
        }
      }
    }, 80)
  }

  function addProxy() {
    if (!traceState || proxyCount >= 3) return
    useGameStore.setState((s) => ({
      ...s,
      traceState: s.traceState ? applyProxyBounce(s.traceState) : null,
    }))
    setProxyCount((c) => c + 1)
    logTerminal(`Proxy bounce added (${proxyCount + 1}/3). Trace speed reduced.`, 'system')
  }

  function removeProxy() {
    if (!traceState || proxyCount <= 0) return
    useGameStore.setState((s) => ({
      ...s,
      traceState: s.traceState ? removeProxyBounce(s.traceState) : null,
    }))
    setProxyCount((c) => c - 1)
    logTerminal(`Proxy bounce removed.`, 'dim')
  }

  function handleIntercept() {
    if (!rivalHacker) return
    interceptRival()
    logTerminal(`Rival hacker ${rivalHacker.handle} intercepted and booted.`, 'success')
    logTerminal('Trace speed returning to normal.', 'system')
  }

  function handleDisconnect() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (wipeIntervalRef.current) clearInterval(wipeIntervalRef.current)
    setActiveJob(null)
    setWipingNodeId(null)
    setWipedNodeIds(new Set())
    setProxyCount(0)
    disconnect()
    logTerminal('Connection terminated.', 'system')
  }

  function wipeLog() {
    if (!selectedNode?.isBreached) {
      logTerminal('ERROR: Node must be breached before wiping logs.', 'error')
      return
    }
    if (wipedNodeIds.has(selectedNode.id)) {
      logTerminal(`Logs already wiped on ${selectedNode.type.replace(/_/g, ' ')}.`, 'dim')
      return
    }
    if (wipingNodeId) {
      logTerminal('Log wipe already in progress.', 'dim')
      return
    }

    const tier = selectedNode.securityTier
    const durationMs = Math.max(2000, tier * 1800 + Math.random() * 1000)
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
        setWipedNodeIds((prev) => new Set(prev).add(selectedNode.id))
        setWipingNodeId(null)
        logTerminal(`Log entries purged. No trace of access remains.`, 'success')
      }
    }, 80)
  }

  const activeMissions = useGameStore((s) => s.missions.filter((m) => m.status === 'active'))
  const primaryObjective = activeMissions[0]?.objectives.find((o) => !o.isOptional)

  if (!traceState) {
    return (
      <div className={styles.empty}>
        <p>No active connection.</p>
        <p className={styles.hint}>Accept a mission to begin hacking.</p>
      </div>
    )
  }

  return (
    <div className={styles.interface}>

      {/* Trace */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>TRACE STATUS</div>
        <TraceBar level={traceState.level} status={traceState.status} />
      </div>

      {/* Target info */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>TARGET NETWORK</div>
        {activeNetwork ? (
          <div className={styles.targetInfo}>
            <div className={styles.targetName}>{activeNetwork.label}</div>
            <div className={styles.targetMeta}>
              {activeNetwork.nodes.filter((n) => n.isBreached).length}/
              {activeNetwork.nodes.length} nodes &nbsp;·&nbsp;
              Base trace: {activeNetwork.traceSpeed}/s
            </div>
          </div>
        ) : (
          <span className={styles.dim}>Locating…</span>
        )}
      </div>

      {/* Objective */}
      {primaryObjective && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>OBJECTIVE</div>
          <div className={`${styles.objective} ${primaryObjective.isCompleted ? styles.objectiveDone : ''}`}>
            {primaryObjective.isCompleted ? '✓' : '○'} {primaryObjective.description}
          </div>
        </div>
      )}

      {/* Rival hacker alert */}
      {rivalHacker && (
        <div className={styles.rivalAlert}>
          <div className={styles.rivalHeader}>
            <span className={styles.rivalLabel}>⚠ INTRUDER DETECTED</span>
            <span className={styles.rivalHandle}>{rivalHacker.handle}</span>
          </div>
          <p className={styles.rivalDesc}>
            Rival operative on this network. Trace speed +50%.
          </p>
          <Button variant="danger" size="sm" onClick={handleIntercept}>
            INTERCEPT
          </Button>
        </div>
      )}

      {/* Selected node */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>SELECTED NODE</div>
        {selectedNode ? (
          <div className={styles.selectedNode}>
            <span className={styles.selectedNodeType}>
              {selectedNode.type.replace(/_/g, ' ').toUpperCase()}
            </span>
            <span className={`${styles.selectedNodeStatus} ${selectedNode.isBreached ? styles.breachedText : ''}`}>
              {selectedNode.isBreached ? 'COMPROMISED' : `Tier ${selectedNode.securityTier}`}
            </span>
          </div>
        ) : (
          <span className={styles.dim}>Click a node on the map to select it</span>
        )}
      </div>

      {/* Tools */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>TOOLS</div>
        <div className={styles.toolGrid}>
          <Button
            variant="danger"
            size="sm"
            onClick={startCrack}
            disabled={!selectedNode || !!activeJob || selectedNode?.isBreached}
          >
            {activeJob ? 'CRACKING…' : 'CRACK'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={wipeLog}
            disabled={
              !selectedNode?.isBreached ||
              !!wipingNodeId ||
              !!(selectedNode && wipedNodeIds.has(selectedNode.id))
            }
          >
            {wipingNodeId ? 'WIPING…' : selectedNode && wipedNodeIds.has(selectedNode.id) ? 'WIPED' : 'WIPE LOG'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={addProxy}
            disabled={proxyCount >= 3}
          >
            +PROXY ({proxyCount}/3)
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeProxy}
            disabled={proxyCount === 0}
          >
            -PROXY
          </Button>
        </div>

        {activeJob && (
          <div className={styles.progressSection}>
            <div className={styles.progressLabel}>
              CRACKING — {Math.round(jobProgress * 100)}%
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${jobProgress * 100}%` }} />
            </div>
          </div>
        )}

        {wipingNodeId && (
          <div className={styles.progressSection}>
            <div className={styles.progressLabel}>
              WIPING LOGS — {Math.round(wipeProgress * 100)}%
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFillWipe} style={{ width: `${wipeProgress * 100}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Disconnect */}
      <div className={styles.disconnectSection}>
        <Button
          variant={primaryObjective?.isCompleted ? 'primary' : 'secondary'}
          size="md"
          onClick={handleDisconnect}
          className={styles.disconnectBtn}
        >
          {primaryObjective?.isCompleted ? '▶ DISCONNECT & COLLECT' : 'DISCONNECT'}
        </Button>
        {!primaryObjective?.isCompleted && (
          <span className={styles.disconnectWarning}>
            Disconnecting before completing the objective will abandon the mission.
          </span>
        )}
      </div>
    </div>
  )
}
