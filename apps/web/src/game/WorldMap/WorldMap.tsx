import { useEffect, useRef, useCallback, useState } from 'react'
import * as THREE from 'three'
import { feature } from 'topojson-client'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useGameStore } from '../../store/gameStore.ts'
import styles from './WorldMap.module.css'

// ── Coordinates ───────────────────────────────────────────────────────────────
const REGION_COORDS: Record<string, [number, number]> = {
  'EU-NORTH':   [60,  10],
  'EU-WEST':    [52,   4],
  'EU-EAST':    [50,  20],
  'EU-SOUTH':   [41,  12],
  'US-EAST':    [40, -74],
  'US-WEST':    [37,-122],
  'US-CENTRAL': [41, -87],
  'APAC':       [ 1, 103],
  'JP':         [35, 139],
  'AU':         [-33, 151],
  'CN':         [39, 116],
  'RU':         [55,  37],
  'IN':         [28,  77],
  'BR':         [-15, -47],
  'ZA':         [-26,  28],
  'CA':         [45, -75],
  'MX':         [19, -99],
  'AR':         [-34, -58],
  'DARKWEB':    [0, 0],
}

const WORLD_TARGETS = [
  { id: 'arunmor',     label: 'ARUNMOR HQ',       lat: 51.5,  lon:  -0.1, type: 'corp' },
  { id: 'ares',        label: 'ARES DIVISION',     lat: 38.9,  lon: -77.0, type: 'gov' },
  { id: 'interpol',    label: 'INTERPOL',           lat: 48.9,  lon:   2.3, type: 'gov' },
  { id: 'globalbank',  label: 'GLOBAL TRUST BANK', lat: 40.7,  lon: -74.0, type: 'bank' },
  { id: 'pacificbank', label: 'PACIFIC NATIONAL',  lat: 37.8,  lon:-122.4, type: 'bank' },
  { id: 'nameless',    label: 'THE NAMELESS',      lat: 35.0,  lon: 139.0, type: 'underground' },
  { id: 'voidlink',    label: 'VOIDLINK INTL',     lat: 47.0,  lon:   8.0, type: 'network' },
]

const TYPE_COLORS: Record<string, number> = {
  corp:        0x00cfff,
  gov:         0xff2d20,
  bank:        0xffcc00,
  underground: 0x9900ff,
  darkweb:     0xff0066,
  network:     0x39ff14,
}

const G = 100    // globe radius
const G_OUT = 100.8  // surface offset for overlays

function latLonToVec3(lat: number, lon: number, r = G): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  )
}

// ── Country border loader ─────────────────────────────────────────────────────
async function buildCountries(scene: THREE.Scene) {
  try {
    // world-atlas ships a 110m resolution topojson — small (~100 KB) and accurate enough
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const world = await import('world-atlas/countries-110m.json') as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const countries = feature(world, world.objects.countries as any) as any
    const lineMat = new THREE.LineBasicMaterial({ color: 0x1a5e30, transparent: true, opacity: 0.55 })

    for (const country of countries.features) {
      const geom = country.geometry
      const rings: number[][][] = []
      if (geom.type === 'Polygon') rings.push(...geom.coordinates)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      else if (geom.type === 'MultiPolygon') geom.coordinates.forEach((p: any) => rings.push(...p))

      for (const ring of rings) {
        if (ring.length < 3) continue
        const pts: THREE.Vector3[] = ring.map(([lon, lat]) => latLonToVec3(lat, lon, G + 0.5))
        pts.push(pts[0]) // close the ring
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat))
      }
    }
  } catch { /* geo data unavailable — globe still usable */ }
}

// ── Globe builders ────────────────────────────────────────────────────────────
function buildGrid(scene: THREE.Scene) {
  const GREEN_DIM  = 0x0d3320
  const GREEN_MID  = 0x124428
  const GREEN_FULL = 0x1a6634

  // Latitude lines — every 15°
  for (let lat = -75; lat <= 75; lat += 15) {
    const major = lat % 30 === 0
    const pts: THREE.Vector3[] = []
    for (let lon = 0; lon <= 360; lon += 2) pts.push(latLonToVec3(lat, lon, G_OUT))
    const mat = new THREE.LineBasicMaterial({
      color: major ? GREEN_FULL : GREEN_MID,
      transparent: true,
      opacity: major ? 0.5 : 0.22,
    })
    scene.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), mat))
  }

  // Longitude lines — every 15°
  for (let lon = 0; lon < 360; lon += 15) {
    const major = lon % 30 === 0
    const pts: THREE.Vector3[] = []
    for (let lat = -90; lat <= 90; lat += 2) pts.push(latLonToVec3(lat, lon, G_OUT))
    const mat = new THREE.LineBasicMaterial({
      color: major ? GREEN_FULL : GREEN_MID,
      transparent: true,
      opacity: major ? 0.5 : 0.22,
    })
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat))
  }

  // Intersection dots at every 30° crossing
  const dotGeo = new THREE.SphereGeometry(0.35, 5, 5)
  for (let lat = -60; lat <= 60; lat += 30) {
    for (let lon = 0; lon < 360; lon += 30) {
      const dot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: GREEN_DIM }))
      dot.position.copy(latLonToVec3(lat, lon, G_OUT + 0.2))
      scene.add(dot)
    }
  }

  // Equator accent (brighter)
  const eqPts: THREE.Vector3[] = []
  for (let lon = 0; lon <= 360; lon += 1) eqPts.push(latLonToVec3(0, lon, G_OUT + 0.1))
  scene.add(new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(eqPts),
    new THREE.LineBasicMaterial({ color: 0x39ff14, transparent: true, opacity: 0.35 }),
  ))
}

function buildAtmosphere(scene: THREE.Scene) {
  // Inner halo
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(G + 4, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0x00ff44,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.04,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  ))
  // Outer halo
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(G + 10, 24, 24),
    new THREE.MeshBasicMaterial({
      color: 0x00cc33,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.02,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  ))
}

function buildStars(scene: THREE.Scene) {
  const count = 1200
  const pos   = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(Math.random() * 2 - 1)
    const r     = 700 + Math.random() * 300
    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = r * Math.cos(phi)
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
    color: 0xffffff, size: 0.9, transparent: true, opacity: 0.45,
  })))
}

function makeLabel(text: string, color: string): THREE.Sprite {
  const c = document.createElement('canvas')
  c.width = 256; c.height = 44
  const ctx = c.getContext('2d')!
  ctx.font = 'bold 16px "JetBrains Mono", monospace'
  ctx.fillStyle = color
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 4, 22)
  const mat = new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthTest: false })
  const s = new THREE.Sprite(mat)
  s.scale.set(22, 4, 1)
  return s
}

function makeGlowDot(color: number, r = 1.6): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.SphereGeometry(r, 10, 10),
    new THREE.MeshBasicMaterial({ color }),
  )
}

function makeArc(a: THREE.Vector3, b: THREE.Vector3, color: number): THREE.Line {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= 60; i++) {
    pts.push(new THREE.Vector3().lerpVectors(a, b, i / 60).normalize().multiplyScalar(G + 3))
  }
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color, opacity: 0.9, transparent: true }),
  )
}

// Max bounce hops from player proxy software
function getMaxHops(proxies: { toolId: string }[]): number {
  if (proxies.some((p) => p.toolId === 'proxy_v3')) return 7
  if (proxies.some((p) => p.toolId === 'proxy_v2')) return 5
  return 3
}

// ── Component ─────────────────────────────────────────────────────────────────
export function WorldMap() {
  const mountRef    = useRef<HTMLDivElement>(null)
  const rendRef     = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef    = useRef<THREE.Scene | null>(null)
  const cameraRef   = useRef<THREE.PerspectiveCamera | null>(null)
  const ctrlRef     = useRef<OrbitControls | null>(null)
  const rafRef      = useRef<number>(0)
  const bounceHitTargets = useRef<{ mesh: THREE.Mesh; id: string }[]>([])
  const arcGroupRef = useRef<THREE.Group | null>(null)

  const player      = useGameStore((s) => s.player)
  const activeRoute = useGameStore((s) => s.activeRoute)
  const setBounceRoute = useGameStore((s) => s.setBounceRoute)

  const bounceLib   = player?.bounceLibrary ?? []
  const proxies     = player?.software?.proxies ?? []
  const maxHops     = getMaxHops(proxies)

  const [hoverNodeId, setHoverNodeId] = useState<string | null>(null)

  // ── Build scene ─────────────────────────────────────────────────────────────
  const build = useCallback(() => {
    const el = mountRef.current
    if (!el) return

    const scene  = new THREE.Scene()
    scene.background = new THREE.Color(0x010306)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 2000)
    camera.position.set(0, 0, 290)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(el.clientWidth, el.clientHeight)
    el.appendChild(renderer.domElement)
    rendRef.current = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance   = 140
    controls.maxDistance   = 500
    ctrlRef.current = controls

    // Globe base
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(G, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x020c14 }),
    ))

    // Neon grid + country borders (async — loads in background)
    buildGrid(scene)
    buildAtmosphere(scene)
    buildStars(scene)
    void buildCountries(scene)

    // World target nodes
    for (const t of WORLD_TARGETS) {
      const pos = latLonToVec3(t.lat, t.lon)
      const col = TYPE_COLORS[t.type] ?? 0x888888
      const dot = makeGlowDot(col, t.type === 'gov' ? 1.8 : 1.2)
      dot.position.copy(pos)
      scene.add(dot)
      const lbl = makeLabel(t.label, `#${col.toString(16).padStart(6, '0')}`)
      lbl.position.copy(pos.clone().multiplyScalar(1.12))
      scene.add(lbl)
    }

    // Bounce library nodes (larger, clickable)
    bounceHitTargets.current = []
    for (const node of bounceLib) {
      const coords = REGION_COORDS[node.region]
      if (!coords) continue
      const pos = latLonToVec3(coords[0], coords[1])
      const clr = node.logStatus === 'traced' ? 0xff2d20
                : node.logStatus === 'dirty'  ? 0xff9900
                : 0x39ff14
      const dot = makeGlowDot(clr, 2.2)
      dot.position.copy(pos)
      dot.userData.bounceId = node.id
      scene.add(dot)
      bounceHitTargets.current.push({ mesh: dot, id: node.id })
      const lbl = makeLabel(node.label, `#${clr.toString(16).padStart(6, '0')}`)
      lbl.position.copy(pos.clone().multiplyScalar(1.13))
      scene.add(lbl)
    }

    // Arc group (rebuilt when route changes)
    const arcGroup = new THREE.Group()
    scene.add(arcGroup)
    arcGroupRef.current = arcGroup

    // Resize
    const ro = new ResizeObserver(() => {
      if (!el || !camera || !renderer) return
      camera.aspect = el.clientWidth / el.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(el.clientWidth, el.clientHeight)
    })
    ro.observe(el)

    // Render loop (30 fps cap — globe is interactive but doesn't need 60)
    let last = 0
    function animate(ts: number) {
      rafRef.current = requestAnimationFrame(animate)
      if (ts - last < 33) return
      last = ts
      controls.update()
      renderer.render(scene, camera)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      controls.dispose()
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounceLib.length])

  useEffect(() => {
    const cleanup = build()
    return cleanup
  }, [build])

  // ── Rebuild arcs when activeRoute changes ────────────────────────────────
  useEffect(() => {
    const group = arcGroupRef.current
    if (!group) return
    group.clear()
    if (activeRoute.length === 0) return

    // Player origin
    const origin = latLonToVec3(51.5, -0.1)
    const hops: THREE.Vector3[] = [origin]

    for (const hopId of activeRoute) {
      const node   = bounceLib.find((n) => n.id === hopId)
      const coords = node ? REGION_COORDS[node.region] : null
      if (coords) hops.push(latLonToVec3(coords[0], coords[1]))
    }

    for (let i = 0; i < hops.length - 1; i++) {
      group.add(makeArc(hops[i], hops[i + 1], 0x39ff14))
    }
    // Animate pulsing dot on each hop node
    for (const hopId of activeRoute) {
      const node   = bounceLib.find((n) => n.id === hopId)
      const coords = node ? REGION_COORDS[node.region] : null
      if (!coords) continue
      const pulse = makeGlowDot(0x39ff14, 3.0)
      pulse.position.copy(latLonToVec3(coords[0], coords[1]))
      group.add(pulse)
    }
  }, [activeRoute, bounceLib])

  // ── Raycasting for bounce node clicks ───────────────────────────────────────
  useEffect(() => {
    const renderer = rendRef.current
    const camera   = cameraRef.current
    if (!renderer || !camera) return

    const raycaster = new THREE.Raycaster()
    const mouse     = new THREE.Vector2()

    function onClick(e: MouseEvent) {
      const rect = renderer!.domElement.getBoundingClientRect()
      mouse.x =  ((e.clientX - rect.left)  / rect.width)  * 2 - 1
      mouse.y = -((e.clientY - rect.top)   / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera!)
      const meshes = bounceHitTargets.current.map((h) => h.mesh)
      const hits   = raycaster.intersectObjects(meshes)
      if (hits.length === 0) return
      const hitMesh = hits[0].object as THREE.Mesh
      const target  = bounceHitTargets.current.find((h) => h.mesh === hitMesh)
      if (!target) return

      const node = bounceLib.find((n) => n.id === target.id)
      if (!node || node.logStatus === 'traced') return

      const inRoute = activeRoute.includes(target.id)
      if (inRoute) {
        setBounceRoute(activeRoute.filter((id) => id !== target.id))
      } else if (activeRoute.length < maxHops) {
        if (node.logStatus === 'dirty') return // dirty — must clean first
        setBounceRoute([...activeRoute, target.id])
      }
    }

    function onMove(e: MouseEvent) {
      const rect = renderer!.domElement.getBoundingClientRect()
      mouse.x =  ((e.clientX - rect.left)  / rect.width)  * 2 - 1
      mouse.y = -((e.clientY - rect.top)   / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera!)
      const meshes = bounceHitTargets.current.map((h) => h.mesh)
      const hits   = raycaster.intersectObjects(meshes)
      if (hits.length > 0) {
        const hitMesh = hits[0].object as THREE.Mesh
        const target  = bounceHitTargets.current.find((h) => h.mesh === hitMesh)
        setHoverNodeId(target?.id ?? null)
        renderer!.domElement.style.cursor = 'pointer'
      } else {
        setHoverNodeId(null)
        renderer!.domElement.style.cursor = ''
      }
    }

    renderer.domElement.addEventListener('click', onClick)
    renderer.domElement.addEventListener('mousemove', onMove)
    return () => {
      renderer.domElement.removeEventListener('click', onClick)
      renderer.domElement.removeEventListener('mousemove', onMove)
    }
  }, [activeRoute, bounceLib, maxHops, setBounceRoute])

  // ── Hover node info ──────────────────────────────────────────────────────────
  const hoverNode = bounceLib.find((n) => n.id === hoverNodeId)

  return (
    <div className={styles.worldMap}>
      <div ref={mountRef} className={styles.canvas} />

      {/* Bounce chain UI */}
      <div className={styles.chainPanel}>
        <div className={styles.chainHeader}>
          BOUNCE CHAIN
          <span className={styles.chainSlots}>{activeRoute.length}/{maxHops} HOPS</span>
        </div>

        {activeRoute.length === 0 ? (
          <div className={styles.chainEmpty}>
            Click green nodes on the globe to add bounce hops.
            Chain is active when you accept a mission.
          </div>
        ) : (
          <div className={styles.chainRoute}>
            <span className={styles.chainOrigin}>YOU</span>
            {activeRoute.map((id) => {
              const node = bounceLib.find((n) => n.id === id)
              return (
                <span key={id} className={styles.chainHop}>
                  <span className={styles.chainArrow}>→</span>
                  <span
                    className={styles.chainNode}
                    title="Click to remove"
                    onClick={() => setBounceRoute(activeRoute.filter((i) => i !== id))}
                  >
                    {node?.label ?? id}
                  </span>
                </span>
              )
            })}
            <span className={styles.chainArrow}>→</span>
            <span className={styles.chainTarget}>TARGET</span>
          </div>
        )}

        {activeRoute.length > 0 && (
          <button className={styles.clearBtn} onClick={() => setBounceRoute([])}>
            CLEAR ROUTE
          </button>
        )}

        {activeRoute.length >= maxHops && (
          <div className={styles.chainFull}>MAX HOPS — upgrade PROXY to add more</div>
        )}
      </div>

      {/* Hover tooltip */}
      {hoverNode && (
        <div className={styles.tooltip}>
          <div className={styles.tooltipLabel}>{hoverNode.label}</div>
          <div className={styles.tooltipMeta}>
            {hoverNode.region} · T{hoverNode.tier} ·{' '}
            <span className={
              hoverNode.logStatus === 'clean' ? styles.statusClean
              : hoverNode.logStatus === 'dirty' ? styles.statusDirty
              : styles.statusTraced
            }>
              {hoverNode.logStatus.toUpperCase()}
            </span>
          </div>
          {activeRoute.includes(hoverNode.id)
            ? <div className={styles.tooltipAction}>Click to REMOVE from chain</div>
            : hoverNode.logStatus === 'traced'
              ? <div className={styles.tooltipAction}>TRACED — cannot use</div>
              : hoverNode.logStatus === 'dirty'
                ? <div className={styles.tooltipAction}>DIRTY — clean logs first in HACK TOOLS</div>
                : <div className={styles.tooltipAction}>Click to ADD to chain</div>
          }
        </div>
      )}

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendTitle}>NODE TYPES</div>
        {[['CORP', 0x00cfff], ['GOV', 0xff2d20], ['BANK', 0xffcc00], ['UNDERGROUND', 0x9900ff], ['BOUNCE', 0x39ff14]].map(([label, color]) => (
          <div key={label as string} className={styles.legendRow}>
            <span className={styles.legendDot} style={{ color: `#${(color as number).toString(16).padStart(6, '0')}` }}>●</span>
            <span className={styles.legendLabel}>{label as string}</span>
          </div>
        ))}
      </div>

      <div className={styles.hint}>DRAG to rotate · SCROLL to zoom · CLICK green nodes to chain</div>
    </div>
  )
}
