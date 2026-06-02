import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useGameStore } from '../../store/gameStore.ts'
import type { NetworkNode, FileEntry, MissionType } from '@voidlink/core'
import styles from './NetworkMap.module.css'

// ─── Label sprite ──────────────────────────────────────────────────────
function createNodeLabel(text: string, hexColor: number): THREE.Sprite {
  const canvas = document.createElement('canvas')
  canvas.width  = 192
  canvas.height = 40
  const ctx2d   = canvas.getContext('2d')!
  ctx2d.clearRect(0, 0, 192, 40)
  ctx2d.font         = '700 13px "JetBrains Mono", monospace'
  ctx2d.fillStyle    = '#' + hexColor.toString(16).padStart(6, '0')
  ctx2d.globalAlpha  = 0.72
  ctx2d.textAlign    = 'center'
  ctx2d.textBaseline = 'middle'
  ctx2d.fillText(text, 96, 20)
  const texture  = new THREE.CanvasTexture(canvas)
  const mat      = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false })
  const sprite   = new THREE.Sprite(mat)
  sprite.scale.set(2.2, 0.46, 1)
  return sprite
}

// ─── Helpers ───────────────────────────────────────────────────────────
function mapPos(x: number, y: number, tier: number): THREE.Vector3 {
  return new THREE.Vector3(
    (x / 800 - 0.5) * 16,
    -(y / 600 - 0.5) * 12,
    (tier - 2.5) * 1.2,
  )
}

function nodeHex(node: NetworkNode): number {
  if (node.isBreached) return 0x39ff14
  if (node.isLockedOut) return 0xff2d20         // red flash for locked-out
  if (node.zone === 'B' && !node.isBreached) return 0xff6600  // zone B amber
  if (node.isPivotNode && !node.isBreached) return 0xffcc00   // pivot = bright yellow
  const map: Record<string, number> = {
    entry_point:        0xffffff,
    firewall:           0xff9900,
    router:             0x00cfff,
    file_server:        0xaaaaaa,
    database:           0x00cfff,
    mail_server:        0x888888,
    intrusion_detector: 0xff2d20,
    proxy:              0x888888,
    endpoint:           0x555555,
    admin_console:      0xff9900,
    ai_core:            0x39ff14,
  }
  return map[node.type] ?? 0x555555
}

// ─── Three.js canvas component ─────────────────────────────────────────
function NetworkCanvas({
  nodes,
  selectedNodeId,
  rivalNodeId,
  targetNodeTypes,
  onNodeClick,
  onBgClick,
}: {
  nodes: NetworkNode[]
  selectedNodeId: string | null
  rivalNodeId: string | null
  targetNodeTypes: string[]
  onNodeClick: (n: NetworkNode) => void
  onBgClick: () => void
}) {
  const mountRef   = useRef<HTMLDivElement>(null)
  // Keep latest callbacks/state in refs so the animation loop doesn't go stale
  const selectedRef     = useRef(selectedNodeId)
  const rivalRef        = useRef(rivalNodeId)
  const nodesRef        = useRef(nodes)
  const targetTypesRef  = useRef(targetNodeTypes)
  selectedRef.current     = selectedNodeId
  rivalRef.current        = rivalNodeId
  nodesRef.current        = nodes
  targetTypesRef.current  = targetNodeTypes

  // Rebuild scene only when node topology changes (ids/positions)
  const nodeKey = nodes.map((n) => `${n.id}:${n.isBreached ? 1 : 0}`).join(',')

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Renderer ───────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x080808)
    renderer.setSize(mount.clientWidth || 600, mount.clientHeight || 400)
    mount.appendChild(renderer.domElement)

    // ── Scene / camera ─────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      55,
      (mount.clientWidth || 600) / (mount.clientHeight || 400),
      0.1,
      100,
    )
    camera.position.set(0, 4, 18)

    // ── Lights ─────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.35))
    const pl = new THREE.PointLight(0xffffff, 1.4)
    pl.position.set(0, 10, 10)
    scene.add(pl)

    // ── Controls ───────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enablePan    = false
    controls.minDistance  = 5
    controls.maxDistance  = 30
    controls.dampingFactor = 0.08
    controls.enableDamping = true

    // ── Geometry (shared) ──────────────────────────────────
    const icoGeo  = new THREE.IcosahedronGeometry(0.45, 2)
    const glowGeo = new THREE.IcosahedronGeometry(0.72, 1)
    const ringGeo = new THREE.TorusGeometry(0.68, 0.025, 8, 48)

    // ── Nodes ──────────────────────────────────────────────
    const meshByNode   = new Map<string, THREE.Mesh>()
    const groupByNode  = new Map<string, THREE.Group>()
    const ringByNode   = new Map<string, THREE.Mesh>()
    const rivalRingByNode = new Map<string, THREE.Mesh>()

    for (const node of nodes) {
      const col = new THREE.Color(nodeHex(node))
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: node.isBreached ? 0.7 : 0.15,
        transparent: !node.isActive,
        opacity: node.isActive ? 1 : 0.35,
      })
      const mesh = new THREE.Mesh(icoGeo, mat)
      meshByNode.set(node.id, mesh)

      const group = new THREE.Group()
      group.position.copy(mapPos(node.position.x, node.position.y, node.securityTier))
      group.add(mesh)

      if (node.isBreached) {
        const glow = new THREE.Mesh(
          glowGeo,
          new THREE.MeshBasicMaterial({
            color: col, transparent: true, opacity: 0.07,
            side: THREE.BackSide, depthWrite: false,
          }),
        )
        group.add(glow)
      }

      // Label sprite — always visible, faces camera
      const labelText = node.type.replace(/_/g, ' ').toUpperCase()
      const label = createNodeLabel(labelText, nodeHex(node))
      label.position.set(0, 0.9, 0)
      group.add(label)

      // Selection ring (hidden by default)
      const ring = new THREE.Mesh(
        ringGeo,
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0 }),
      )
      ring.rotation.x = Math.PI / 2
      group.add(ring)
      ringByNode.set(node.id, ring)

      // Rival ring (orange spinning torus, hidden by default)
      const rivalRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.95, 0.035, 8, 40),
        new THREE.MeshBasicMaterial({ color: 0xff9900, transparent: true, opacity: 0 }),
      )
      group.add(rivalRing)
      rivalRingByNode.set(node.id, rivalRing)

      groupByNode.set(node.id, group)
      scene.add(group)
    }

    // ── Edges ──────────────────────────────────────────────
    const edgeMats: THREE.LineBasicMaterial[] = []
    for (const node of nodes) {
      for (const tid of node.connectedTo) {
        const target = nodes.find((n) => n.id === tid)
        if (!target || node.id > tid) continue
        const pts = [
          mapPos(node.position.x, node.position.y, node.securityTier),
          mapPos(target.position.x, target.position.y, target.securityTier),
        ]
        const geo = new THREE.BufferGeometry().setFromPoints(pts)
        const mat = new THREE.LineBasicMaterial({ color: 0x1a1a1a })
        edgeMats.push(mat)
        scene.add(new THREE.Line(geo, mat))
      }
    }

    // ── Click / raycaster ──────────────────────────────────
    const raycaster = new THREE.Raycaster()
    const pointer   = new THREE.Vector2()
    let pointerMoved = false

    function onPointerDown() { pointerMoved = false }
    function onPointerMove() { pointerMoved = true }
    function onPointerUp(e: MouseEvent) {
      if (pointerMoved) return
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1
      pointer.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects([...meshByNode.values()])
      if (hits.length > 0) {
        const hitMesh = hits[0].object
        for (const [nid, m] of meshByNode) {
          if (m === hitMesh) {
            const node = nodesRef.current.find((n) => n.id === nid)
            if (node) onNodeClick(node)
            return
          }
        }
      }
      onBgClick()
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerup',   onPointerUp)

    // ── Resize ─────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      if (!mount) return
      const w = mount.clientWidth
      const h = mount.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    })
    ro.observe(mount)

    // ── Animation loop ─────────────────────────────────────
    const clock = new THREE.Clock()
    let raf: number

    function animate() {
      raf = requestAnimationFrame(animate)
      const t     = clock.getElapsedTime()
      const selId = selectedRef.current
      const rivId = rivalRef.current

      for (const node of nodesRef.current) {
        const group = groupByNode.get(node.id)
        const mesh  = meshByNode.get(node.id)
        const ring  = ringByNode.get(node.id)
        const rring = rivalRingByNode.get(node.id)
        if (!group || !mesh || !ring || !rring) continue

        const isSel   = node.id === selId
        const isRival = node.id === rivId
        const col     = new THREE.Color(nodeHex(node))

        // Node rotation
        group.rotation.y = isSel
          ? t * 0.65
          : node.isBreached ? t * 0.25 : 0

        // Material intensity — target nodes pulse cyan until breached
        const isTarget = !node.isBreached && targetTypesRef.current.includes(node.type)
        const targetPulse = isTarget ? (Math.sin(t * 2.5) * 0.5 + 0.5) * 0.5 + 0.1 : 0
        const mat = mesh.material as THREE.MeshStandardMaterial
        if (isTarget) {
          mat.emissive.set(0x00cfff)
          mat.emissiveIntensity = targetPulse
        } else {
          mat.emissive.set(new THREE.Color(nodeHex(node)))
          mat.emissiveIntensity = isSel ? 1.2 : node.isBreached ? 0.7 : 0.15
        }

        // Selection ring
        const ringMat = ring.material as THREE.MeshBasicMaterial
        ringMat.opacity  = isSel ? 0.9 : 0
        ringMat.color    = col

        // Rival ring
        const rringMat = rring.material as THREE.MeshBasicMaterial
        rringMat.opacity = isRival ? 0.85 : 0
        if (isRival) rring.rotation.z = t * 1.8
      }

      // Highlight edges connected to selected node
      // (edge highlight: update colour per-edge based on whether either endpoint is selected)
      // Skipping per-frame edge colour update for perf — edges stay dim

      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerup',   onPointerUp)
      controls.dispose()
      renderer.dispose()
      icoGeo.dispose()
      glowGeo.dispose()
      ringGeo.dispose()
      edgeMats.forEach((m) => m.dispose())
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeKey])

  return <div ref={mountRef} className={styles.canvasWrapper} />
}

// ─── Main export ───────────────────────────────────────────────────────
export function NetworkMap() {
  const networks        = useGameStore((s) => s.networks)
  const activeNetworkId = useGameStore((s) => s.activeNetworkId)
  const selectedNodeId  = useGameStore((s) => s.selectedNodeId)
  const activeMissionId = useGameStore((s) => s.activeMissionId)
  const missions        = useGameStore((s) => s.missions)
  const rivalHacker     = useGameStore((s) => s.rivalHacker)
  const player          = useGameStore((s) => s.player)
  const selectNode      = useGameStore((s) => s.selectNode)
  const collectFile     = useGameStore((s) => s.collectFile)
  const executeMissionObjective = useGameStore((s) => s.executeMissionObjective)
  const logTerminal     = useGameStore((s) => s.logTerminal)

  const [transferringFileId, setTransferringFileId] = useState<string | null>(null)
  const [transferProgress, setTransferProgress]     = useState(0)
  const transferIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const activeMissionType = missions.find((m) => m.id === activeMissionId)?.type ?? null

  const TARGET_NODE_TYPES_MAP: Partial<Record<string, string[]>> = {
    account_deletion:    ['database'],
    database_corruption: ['database'],
    file_theft:          ['file_server', 'database', 'mail_server'],
    network_sabotage:    ['router', 'admin_console'],
    evidence_planting:   ['file_server'],
    bounty_hunt:         ['endpoint', 'database'],
  }
  const targetNodeTypes = activeMissionType ? (TARGET_NODE_TYPES_MAP[activeMissionType] ?? []) : []
  const activeNetwork     = activeNetworkId ? networks[activeNetworkId] : null
  const selectedNode      = activeNetwork?.nodes.find((n) => n.id === selectedNodeId) ?? null

  function handleNodeClick(node: NetworkNode) {
    selectNode(node.id === selectedNodeId ? null : node.id)
  }


  function handleCollect(node: NetworkNode, file: FileEntry) {
    if (!activeNetwork) return
    if (transferringFileId) { logTerminal('Transfer already in progress.', 'dim'); return }
    const modemSpeed = player?.hardware.modemSpeed ?? 10
    const durationMs = Math.max(500, (file.sizeKb * 100) / modemSpeed)
    const startedAt  = Date.now()
    setTransferringFileId(file.id)
    setTransferProgress(0)
    logTerminal(`Initiating transfer: ${file.name} (${file.sizeKb} KB @ ${modemSpeed} KB/s)…`, 'system')
    transferIntervalRef.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - startedAt) / durationMs)
      setTransferProgress(p)
      if (p >= 1) {
        clearInterval(transferIntervalRef.current!)
        setTransferringFileId(null)
        collectFile(activeNetwork.id, node.id, file.id)
        logTerminal(`Transfer complete: ${file.name}`, 'success')
        if (file.missionObjective) logTerminal('Objective complete. Disconnect when ready.', 'system')
      }
    }, 80)
  }

  function handleExecuteObjective(node: NetworkNode) {
    if (!activeNetwork) return
    executeMissionObjective(activeNetwork.id, node.id)
    const labels: Partial<Record<string, string>> = {
      account_deletion:    `Account deleted from ${node.type.replace(/_/g, ' ')}. No recovery possible.`,
      database_corruption: `Database corrupted on ${node.type.replace(/_/g, ' ')}. Looks like a hardware failure.`,
      network_sabotage:    `Sabotage executed. Network is going offline.`,
      evidence_planting:   `Evidence uploaded to ${node.type.replace(/_/g, ' ')}. File appears legitimate.`,
    }
    logTerminal(labels[activeMissionType ?? ''] ?? 'Objective executed.', 'success')
    if (activeMissionType === 'evidence_planting') logTerminal('Wipe logs on this node to cover the upload trail.', 'system')
    if (activeMissionType === 'network_sabotage') logTerminal('ALERT: Emergency shutdown initiated. Disconnect within 30 seconds.', 'error')
    logTerminal('Objective complete. Disconnect when ready.', 'system')
  }

  if (!activeNetwork) {
    return (
      <div className={styles.empty}>
        <span>NO ACTIVE CONNECTION</span>
        <span className={styles.hint}>Accept a mission to connect to a target network</span>
      </div>
    )
  }

  return (
    <div className={styles.mapContainer}>
      <div className={styles.header}>
        <span className={styles.networkLabel}>{activeNetwork.label}</span>
        <span className={styles.nodeCount}>
          {activeNetwork.nodes.filter((n) => n.isBreached).length}/{activeNetwork.nodes.length} nodes breached
        </span>
      </div>

      <div className={styles.body}>
        <NetworkCanvas
          nodes={activeNetwork.nodes}
          selectedNodeId={selectedNodeId}
          rivalNodeId={rivalHacker?.currentNodeId ?? null}
          targetNodeTypes={targetNodeTypes}
          onNodeClick={handleNodeClick}
          onBgClick={() => selectNode(null)}
        />

        {selectedNode && (
          <NodePanel
            node={selectedNode}
            networkId={activeNetwork.id}
            activeMissionType={activeMissionType}
            transferringFileId={transferringFileId}
            transferProgress={transferProgress}
            hasFirewallBypasser={(player?.software.firewallBypassers.length ?? 0) > 0}
            onCollect={(file) => handleCollect(selectedNode, file)}
            onExecuteObjective={() => handleExecuteObjective(selectedNode)}
          />
        )}
      </div>
    </div>
  )
}

// ─── Node detail panel ─────────────────────────────────────────────────
const OBJECTIVE_ACTIONS: Partial<Record<MissionType, { nodeTypes: string[]; label: string }>> = {
  account_deletion:    { nodeTypes: ['database'],                label: 'DELETE ACCOUNT' },
  database_corruption: { nodeTypes: ['database'],                label: 'CORRUPT DATABASE' },
  network_sabotage:    { nodeTypes: ['router', 'admin_console'], label: 'SABOTAGE NODE' },
  evidence_planting:   { nodeTypes: ['file_server'],             label: 'UPLOAD EVIDENCE' },
}

function NodePanel({
  node, activeMissionType, transferringFileId, transferProgress,
  hasFirewallBypasser, onCollect, onExecuteObjective,
}: {
  node: NetworkNode; networkId: string; activeMissionType: MissionType | null
  transferringFileId: string | null; transferProgress: number
  hasFirewallBypasser: boolean
  onCollect: (f: FileEntry) => void; onExecuteObjective: () => void
}) {
  const hexStr = '#' + nodeHex(node).toString(16).padStart(6, '0')
  const objAction = activeMissionType ? OBJECTIVE_ACTIONS[activeMissionType] : null
  const canExecute = node.isBreached && objAction?.nodeTypes.includes(node.type)

  return (
    <div className={styles.nodePanel}>
      <div className={styles.nodePanelHeader} style={{ borderColor: hexStr }}>
        <span className={styles.nodePanelType} style={{ color: hexStr }}>
          {node.type.replace(/_/g, ' ').toUpperCase()}
        </span>
        <span className={styles.nodePanelTier}>TIER {node.securityTier}</span>
      </div>
      <div className={styles.nodePanelStatus}>
        <span className={node.isBreached ? styles.statusBreached : styles.statusSecure}>
          {node.isBreached ? '● COMPROMISED' : '○ SECURE'}
        </span>
        {node.isScanned && <span className={styles.scannedBadge}>SCANNED</span>}
        {!node.isActive && <span className={styles.statusOffline}>OFFLINE</span>}
        {node.zone === 'B' && !node.isBreached && <span className={styles.zoneBBadge}>ZONE B</span>}
        {node.isPivotNode && <span className={styles.pivotBadge}>PIVOT</span>}
        {node.isLockedOut && node.lockoutUntil && node.lockoutUntil > Date.now() && (
          <span className={styles.lockoutBadge}>LOCKED OUT</span>
        )}
        {node.exploitedVia && node.isBreached && (
          <span className={styles.exploitBadge}>via {node.exploitedVia}</span>
        )}
      </div>
      <div className={styles.panelSection}>
        <div className={styles.panelSectionLabel}>SERVICES</div>
        {!node.isScanned ? (
          <div className={styles.notScanned}>Run SCAN to discover services</div>
        ) : node.services.length === 0 ? (
          <div className={styles.notScanned}>No services detected</div>
        ) : node.services.map((svc, i) => (
          <div key={i} className={styles.service}>
            {svc.protocol}:{svc.port} v{svc.version}
            {svc.hasKnownVulnerability && <span className={styles.vuln}> [VULN]</span>}
          </div>
        ))}
      </div>
      {node.files.length > 0 && (
        <div className={styles.panelSection}>
          <div className={styles.panelSectionLabel}>FILES</div>
          {node.files.map((file) => {
            const isXfr = transferringFileId === file.id
            return (
              <div key={file.id} className={styles.fileRow}>
                <span className={file.missionObjective ? styles.fileTarget : styles.fileName}>
                  {file.missionObjective ? '★ ' : ''}{file.name}
                </span>
                <span className={styles.fileSize}>{file.sizeKb} KB</span>
                {node.isBreached && !isXfr && (
                  <button className={styles.collectBtn} onClick={() => onCollect(file)}
                    disabled={!!transferringFileId} aria-label={`Transfer ${file.name}`}>
                    TRANSFER
                  </button>
                )}
                {isXfr && (
                  <div className={styles.transferProgress}>
                    <div className={styles.transferFill} style={{ width: `${transferProgress * 100}%` }} />
                    <span className={styles.transferPct}>{Math.round(transferProgress * 100)}%</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      {!node.isBreached && node.type === 'firewall' && !hasFirewallBypasser && (
        <div className={styles.firewallWarning}>
          ⚠ No Firewall Disabler — breach will trigger emergency alarm (+{node.securityTier * 5}% trace)
        </div>
      )}
      {/* Breach is handled entirely via HACK TOOLS (HackingInterface) */}
      {canExecute && (
        <button className={styles.objectiveBtn} onClick={onExecuteObjective}>
          ▶ {objAction!.label}
        </button>
      )}
      {node.isBreached && node.files.length === 0 && !canExecute && (
        <div className={styles.dimNote}>Node compromised — no files present</div>
      )}
    </div>
  )
}
