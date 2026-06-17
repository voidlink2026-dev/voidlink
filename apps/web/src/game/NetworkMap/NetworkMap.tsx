import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { useGameStore } from '../../store/gameStore.ts'
import { useSettingsStore } from '../../store/settingsStore.ts'
import type { NetworkNode, FileEntry, MissionType, PlayerProfile } from '@voidlink/core'
import { researchCanarySpike } from '@voidlink/core'
import styles from './NetworkMap.module.css'

// ── M14f: Exfiltration Channels ──────────────────────────────────────────────
// File transfer can use one of several channels — faster = noisier.
// M14j — type now sourced from core so loadouts + store share it
import type { ExfilChannelId } from '@voidlink/core'

interface ExfilChannelDef {
  id: ExfilChannelId
  label: string
  description: string
  speedMult: number   // 1.0 = baseline modem speed
  traceMod: number    // % trace level applied at transfer START
  isAvailable: (player: PlayerProfile | null) => boolean
}

const EXFIL_CHANNELS: Record<ExfilChannelId, ExfilChannelDef> = {
  direct: {
    id: 'direct', label: 'DIRECT FTP',
    description: '100% modem speed. Logged in network traffic. The default.',
    speedMult: 1.0, traceMod: 0,
    isAvailable: () => true,
  },
  tunnel: {
    id: 'tunnel', label: 'ENCRYPTED TUNNEL',
    description: '60% speed but reduces visible trace by 5% during transfer. Needs Proxy v3+.',
    speedMult: 0.6, traceMod: -5,
    isAvailable: (p) => (p?.software?.proxies?.some((t) => t.toolId === 'proxy_v3' || t.toolId === 'proxy_v4') ?? false),
  },
  dns: {
    id: 'dns', label: 'DNS TUNNELING',
    description: '20% speed, near-undetectable. Slips through DNS queries. Needs Port Scanner v2+.',
    speedMult: 0.2, traceMod: -2,
    isAvailable: (p) => (p?.software?.portScanners?.some((t) => t.toolId === 'port_scanner_v2' || t.toolId === 'port_scanner_v3') ?? false),
  },
  icmp: {
    id: 'icmp', label: 'ICMP EXFIL',
    description: '5% speed but completely silent. Bypasses every IDS. Requires Ghost specialisation + CPU ≥ 4 GHz.',
    speedMult: 0.05, traceMod: -10,
    isAvailable: (p) => p?.specialization === 'ghost' && (p?.hardware?.cpuSpeed ?? 0) >= 4,
  },
}

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

// V2 — Per-node-type glyph map. Unicode characters that render cleanly in
// canvas with monospace fallback chain. Each glyph is single-character.
const NODE_GLYPHS: Record<string, string> = {
  entry_point:        '⊕',
  firewall:           '◫',
  router:             '⇄',
  file_server:        '▤',
  database:           '▦',
  mail_server:        '✉',
  intrusion_detector: '◉',
  proxy:              '⇌',
  endpoint:           '▣',
  admin_console:      '⌘',
  ai_core:            '◈',
}

// V2 — Glyph sprite, drawn larger than the label text. Sits just above the
// node icosahedron so the player can read network topology at a glance
// without clicking through every node.
function createNodeGlyph(nodeType: string, hexColor: number): THREE.Sprite {
  const glyph = NODE_GLYPHS[nodeType] ?? '●'
  const canvas = document.createElement('canvas')
  canvas.width  = 64
  canvas.height = 64
  const ctx2d   = canvas.getContext('2d')!
  ctx2d.clearRect(0, 0, 64, 64)
  ctx2d.font         = '700 44px "JetBrains Mono", "DejaVu Sans Mono", monospace'
  ctx2d.fillStyle    = '#' + hexColor.toString(16).padStart(6, '0')
  ctx2d.globalAlpha  = 0.95
  ctx2d.textAlign    = 'center'
  ctx2d.textBaseline = 'middle'
  // Subtle outer shadow for legibility against dark backgrounds
  ctx2d.shadowColor   = '#000'
  ctx2d.shadowBlur    = 6
  ctx2d.fillText(glyph, 32, 36)
  const texture  = new THREE.CanvasTexture(canvas)
  const mat      = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false })
  const sprite   = new THREE.Sprite(mat)
  sprite.scale.set(0.95, 0.95, 1)
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
  // M14h.3 — Clear status colours: untouched=type-coloured / scanned=yellow / breached=green
  if (node.isBreached) return 0x39ff14
  if (node.isLockedOut) return 0xff2d20         // red flash for locked-out
  if (node.zone === 'B' && !node.isBreached && !node.isScanned) return 0xff6600
  if (node.isPivotNode && !node.isBreached && !node.isScanned) return 0xffcc00
  if (node.isScanned) return 0xffd700           // scanned = bright yellow (universal)
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
    renderer.setClearColor(0x02040a)  // very dark navy — M14h.7 cyber backdrop
    renderer.setSize(mount.clientWidth || 600, mount.clientHeight || 400)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
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

    // ── M14h.7 cyber backdrop: starfield + scan grid + bloom ─────────────
    // Starfield — distant points, low brightness, gentle parallax
    {
      const count = 600
      const pos = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        const r = 50 + Math.random() * 80
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(Math.random() * 2 - 1)
        pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
        pos[i * 3 + 1] = r * Math.cos(phi)
        pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
        color: 0x99ccff, size: 0.15, transparent: true, opacity: 0.45, sizeAttenuation: true,
      })))
    }
    // Scan-grid plane — sits well below the node graph; cyan wireframe
    {
      const grid = new THREE.GridHelper(80, 40, 0x004466, 0x002233)
      grid.position.y = -8
      ;(grid.material as THREE.Material).transparent = true
      ;(grid.material as THREE.Material).opacity = 0.35
      scene.add(grid)
    }
    // L6 — Bloom composer skipped in low-quality mode.
    const lowQuality = useSettingsStore.getState().lowQuality
    let composer: EffectComposer | null = null
    if (!lowQuality) {
      composer = new EffectComposer(renderer)
      composer.setSize(mount.clientWidth || 600, mount.clientHeight || 400)
      composer.addPass(new RenderPass(scene, camera))
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(mount.clientWidth || 600, mount.clientHeight || 400),
        0.55,   // strength — matches WorldMap so dots don't smear
        0.4,    // radius
        0.22,   // threshold — only bright emissives bloom
      )
      composer.addPass(bloom)
    }

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

      // V2 — Type glyph sprite. Sits just above the node mesh so the
      // player can read network topology at a glance without clicking
      // through every node. Faces camera.
      const glyph = createNodeGlyph(node.type, nodeHex(node))
      glyph.position.set(0, 0.45, 0)
      group.add(glyph)

      // Label sprite — type name, sits above the glyph
      const labelText = node.type.replace(/_/g, ' ').toUpperCase()
      const label = createNodeLabel(labelText, nodeHex(node))
      label.position.set(0, 1.05, 0)
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
        // M14h.7 — edges are now cyan-tinted so the network graph reads as
        // a live data-link diagram instead of grey scaffolding. Subtle, but
        // bloom catches the brighter pixels and gives the whole topology a
        // soft glow that follows the camera.
        const mat = new THREE.LineBasicMaterial({ color: 0x2a4a6a, transparent: true, opacity: 0.8 })
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
      if (composer) {
        composer.setSize(w, h)
      }
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
      if (composer) composer.render()
      else renderer.render(scene, camera)
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
  const escalatePrivileges = useGameStore((s) => s.escalatePrivileges)
  const plantBackdoor   = useGameStore((s) => s.plantBackdoor)
  const logTerminal     = useGameStore((s) => s.logTerminal)

  const [transferringFileId, setTransferringFileId] = useState<string | null>(null)
  const [transferProgress, setTransferProgress]     = useState(0)
  // M14j — exfilChannel hoisted to gameStore so loadouts can drive it.
  const exfilChannel    = useGameStore((s) => s.exfilChannel)
  const setExfilChannel = useGameStore((s) => s.setExfilChannel)
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

    // M14f.1 — Canary trip. Touching a honeypot file is catastrophic.
    // M14i — Forensic Static research (S3) softens the spike to +15%.
    if (file.isCanary) {
      const corpId = activeNetwork.ownerId
      const spike = researchCanarySpike(player ?? null)
      useGameStore.setState((s) => {
        if (s.traceState) {
          s.traceState.level = Math.min(100, s.traceState.level + spike)
          s.traceState.alarmRate = Math.max(s.traceState.alarmRate, 3.0)
          s.traceState.alarmDecaysAt = Math.max(s.traceState.alarmDecaysAt, Date.now() + 15_000)
        }
        if (s.player) s.player.activeFlags[`heat_${corpId}`] = Date.now()
      })
      logTerminal(`⚠ CANARY TRIPPED: ${file.name} was a honeypot. IDS auto-alerted security.`, 'error')
      logTerminal(`Trace +${spike}%, alarm rate +3%/s for 15s, this corp will start every future mission on heightened alert.`, 'error')
      // Mark it visible so future glances at this node show the trap was sprung
      file.isCanary = false  // mutate is OK — it's a transient session state
      return
    }

    // M14f — Exfiltration channel selection
    // Channel determines transfer speed AND trace impact
    const channel = exfilChannel  // from state, default 'direct'
    const channelDef = EXFIL_CHANNELS[channel]
    const modemSpeed = player?.hardware.modemSpeed ?? 10
    const baseMs = Math.max(500, (file.sizeKb * 100) / modemSpeed)
    const durationMs = baseMs / channelDef.speedMult
    const startedAt  = Date.now()
    setTransferringFileId(file.id)
    setTransferProgress(0)
    logTerminal(
      `[${channelDef.label}] Initiating transfer: ${file.name} (${file.sizeKb} KB @ ${(modemSpeed * channelDef.speedMult).toFixed(1)} KB/s${channelDef.traceMod !== 0 ? `, trace ${channelDef.traceMod > 0 ? '+' : ''}${channelDef.traceMod}%` : ''})…`,
      'system',
    )
    // Apply per-transfer trace effect at start
    if (channelDef.traceMod !== 0) {
      useGameStore.setState((s) => {
        if (s.traceState) s.traceState.level = Math.max(0, Math.min(100, s.traceState.level + channelDef.traceMod))
        return s
      })
    }
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

  function handleEscalate(node: NetworkNode) {
    if (!activeNetwork) return
    const r = escalatePrivileges(activeNetwork.id, node.id)
    if (r === 'underqualified') logTerminal('ESCALATE: requires CPU ≥ 3 GHz and Cracker v3+.', 'error')
    else if (r === 'no_breach') logTerminal('ESCALATE: node must be breached first.', 'error')
    else if (r === 'already_root') logTerminal('ESCALATE: already root on this node.', 'dim')
  }

  function handleBackdoor(node: NetworkNode) {
    if (!activeNetwork) return
    const r = plantBackdoor(activeNetwork.id, node.id)
    if (r === 'no_root') logTerminal('BACKDOOR: requires root. Escalate first.', 'error')
    else if (r === 'already_planted') logTerminal('BACKDOOR: already planted on this node.', 'dim')
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

      {/* M14f: Exfiltration channel selector */}
      <div className={styles.exfilBar}>
        <span className={styles.exfilLabel}>EXFIL:</span>
        {(Object.values(EXFIL_CHANNELS)).map((ch) => {
          const available = ch.isAvailable(player ?? null)
          const active = exfilChannel === ch.id
          return (
            <button
              key={ch.id}
              className={`${styles.exfilBtn} ${active ? styles.exfilBtnActive : ''} ${!available ? styles.exfilBtnLocked : ''}`}
              disabled={!available || !!transferringFileId}
              onClick={() => setExfilChannel(ch.id)}
              title={ch.description}
            >
              {ch.label}
              {!available && <span className={styles.exfilLock}> 🔒</span>}
            </button>
          )
        })}
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
            // M14f.1 — canary detection requires either a stealth scanner OR
            // a sniffer. Without one the canary looks like any other file.
            canSeeCanaries={
              (player?.software.portScanners.some((t) => t.toolId === 'port_scanner_stealth' || t.toolId === 'port_scanner_v3') ?? false) ||
              (player?.software.misc?.some((t) => t.toolId === 'sniffer_v2') ?? false)
            }
            onCollect={(file) => handleCollect(selectedNode, file)}
            onExecuteObjective={() => handleExecuteObjective(selectedNode)}
            onEscalate={() => handleEscalate(selectedNode)}
            onBackdoor={() => handleBackdoor(selectedNode)}
            canEscalate={
              (player?.hardware.cpuSpeed ?? 0) >= 3 &&
              (player?.software.passwordCrackers.some(
                (c) => c.toolId === 'cracker_v3' || c.toolId === 'cracker_v4' || c.toolId === 'cracker_v5',
              ) ?? false)
            }
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
  hasFirewallBypasser, canSeeCanaries, onCollect, onExecuteObjective, onEscalate, onBackdoor,
  canEscalate,
}: {
  node: NetworkNode; networkId: string; activeMissionType: MissionType | null
  transferringFileId: string | null; transferProgress: number
  hasFirewallBypasser: boolean
  canSeeCanaries: boolean
  canEscalate: boolean
  onCollect: (f: FileEntry) => void
  onExecuteObjective: () => void
  onEscalate: () => void
  onBackdoor: () => void
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
                  {file.isCanary && canSeeCanaries && (
                    <span style={{ marginLeft: 6, color: '#ff2d20', fontSize: 8, letterSpacing: '0.12em' }}> ⚠ CANARY</span>
                  )}
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

      {/* M15 — Privilege escalation + persistent backdoor */}
      {node.isBreached && !node.hasRoot && (
        <button
          className={styles.escalateBtn}
          onClick={onEscalate}
          disabled={!canEscalate}
          title={canEscalate ? 'Escalate to root — unlocks PLANT BACKDOOR' : 'Requires CPU ≥ 3 GHz and Cracker v3+'}
        >
          ▲ ESCALATE PRIVILEGES
        </button>
      )}
      {node.hasRoot && !node.hasBackdoor && (
        <button className={styles.backdoorBtn} onClick={onBackdoor}>
          ◉ PLANT BACKDOOR
        </button>
      )}
      {node.hasBackdoor && (
        <div className={styles.backdoorActive}>
          ✓ BACKDOOR ACTIVE — future missions to this target start with this node pre-breached
        </div>
      )}
      {node.hasRoot && (
        <div className={styles.rootBadge}>[ROOT]</div>
      )}
    </div>
  )
}
