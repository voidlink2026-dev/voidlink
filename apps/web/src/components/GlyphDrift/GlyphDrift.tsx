import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { feature } from 'topojson-client'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

// Voidlink original — "Neon Data Globe".
// Real continent outlines from world-atlas TopoJSON, drawn as glowing cyan lines
// on a transparent sphere. UnrealBloomPass post-process gives the genuine neon
// look (this is the missing magic from prior attempts).
//
// (Kept the GlyphDrift filename + export name so existing imports keep working.)

interface NeonGlobeProps {
  opacity?: number
  density?: number
  className?: string
  style?: React.CSSProperties
}

interface Pulse {
  curve: THREE.QuadraticBezierCurve3
  head: THREE.Mesh
  glow: THREE.Mesh
  t: number
  speed: number
  life: number
  age: number
}

function latLonToVec3(lat: number, lon: number, r: number): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta),
  )
}

export function GlyphDrift({
  opacity = 0.9,
  density = 1.0,
  className,
  style,
}: NeonGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    // ── Scene ─────────────────────────────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 200)
    camera.position.set(0, 0, 42)  // a bit further out — globe sits comfortably in frame

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(dpr)
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(el.clientWidth, el.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    el.appendChild(renderer.domElement)
    Object.assign(renderer.domElement.style, {
      position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none',
    })

    // ── Post-processing — UnrealBloomPass is the magic ─────────────────────
    const composer = new EffectComposer(renderer)
    composer.setSize(el.clientWidth, el.clientHeight)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(el.clientWidth, el.clientHeight),
      1.0,   // strength — tuned so continents glow without halos turning into rings
      0.5,   // radius
      0.10,  // threshold — only genuinely bright pixels bloom
    )
    composer.addPass(bloom)

    const group = new THREE.Group()
    scene.add(group)

    const R = 12

    // ── Inner dark sphere (gives the globe a black silhouette behind continents)
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(R - 0.02, 64, 32),
      new THREE.MeshBasicMaterial({ color: 0x020812, transparent: true, opacity: 0.95 }),
    ))

    // ── Subtle latitude/longitude grid (faint, low-bloom)
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x0a4a6a, transparent: true, opacity: 0.35,
    })
    // 6 latitude rings
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: THREE.Vector3[] = []
      for (let lon = 0; lon <= 360; lon += 4) pts.push(latLonToVec3(lat, lon, R + 0.05))
      group.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), gridMat))
    }
    // 8 meridians
    for (let lon = 0; lon < 360; lon += 45) {
      const pts: THREE.Vector3[] = []
      for (let lat = -90; lat <= 90; lat += 4) pts.push(latLonToVec3(lat, lon, R + 0.05))
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat))
    }

    // ── Continent outlines — this is the centrepiece
    // Load world-atlas TopoJSON, render every country border as a glowing cyan line
    const continentMat = new THREE.LineBasicMaterial({
      color: 0x33ddff,
      transparent: true,
      opacity: opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    // Magenta-pink accent for visual interest (some countries get a pop)
    const accentMat = new THREE.LineBasicMaterial({
      color: 0xff66cc,
      transparent: true,
      opacity: opacity * 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    void (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const world = await import('world-atlas/countries-110m.json') as any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const countries = feature(world, world.objects.countries as any) as any
        const features = countries.features
        for (let ci = 0; ci < features.length; ci++) {
          const country = features[ci]
          const geom = country.geometry
          const rings: number[][][] = []
          if (geom.type === 'Polygon') rings.push(...geom.coordinates)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          else if (geom.type === 'MultiPolygon') geom.coordinates.forEach((p: any) => rings.push(...p))

          // ~15% of countries use the magenta accent for colour variety
          const useAccent = (ci * 7) % 100 < 15
          const mat = useAccent ? accentMat : continentMat

          for (const ring of rings) {
            if (ring.length < 3) continue
            const pts: THREE.Vector3[] = ring.map(([lon, lat]) => latLonToVec3(lat, lon, R + 0.08))
            pts.push(pts[0])
            group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat))
          }
        }
      } catch (e) {
        console.error('Failed to load country outlines for globe', e)
      }
    })()

    // ── City-light dots — distributed across the globe as bright nodes
    // (Use Fibonacci sphere for even coverage; these are the "data hubs")
    function fibonacciSphere(n: number): THREE.Vector3[] {
      const points: THREE.Vector3[] = []
      const phi = Math.PI * (Math.sqrt(5) - 1)
      for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2
        const radius = Math.sqrt(1 - y * y)
        const theta = phi * i
        points.push(new THREE.Vector3(
          Math.cos(theta) * radius * R, y * R, Math.sin(theta) * radius * R,
        ))
      }
      return points
    }
    const HUB_COUNT = Math.floor(40 * density)
    const hubPositions = fibonacciSphere(HUB_COUNT * 4).filter((_, i) => i % 4 === 0)

    // Hub mesh — small bright sphere
    const hubGeo = new THREE.SphereGeometry(0.16, 8, 8)
    const hubMat = new THREE.MeshBasicMaterial({
      color: 0x88f0ff,
      transparent: true,
      opacity: opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const hubMeshes: THREE.Mesh[] = []
    for (const pos of hubPositions) {
      const m = new THREE.Mesh(hubGeo, hubMat)
      m.position.copy(pos)
      group.add(m)
      hubMeshes.push(m)
    }

    // ── Polygon mesh "network field" around the globe
    // (Like the floating geometric net in the reference images)
    function buildNetField() {
      // 80 random points in a shell around the globe
      const FIELD_POINTS = 80
      const fieldPoints: THREE.Vector3[] = []
      for (let i = 0; i < FIELD_POINTS; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(Math.random() * 2 - 1)
        const r = R + 4 + Math.random() * 8
        fieldPoints.push(new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta),
        ))
      }
      // Connect each point to its 2 nearest neighbours
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x2266aa,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      for (let i = 0; i < fieldPoints.length; i++) {
        const dists: Array<{ idx: number; d: number }> = []
        for (let j = 0; j < fieldPoints.length; j++) {
          if (j === i) continue
          dists.push({ idx: j, d: fieldPoints[i].distanceTo(fieldPoints[j]) })
        }
        dists.sort((a, b) => a.d - b.d)
        for (let k = 0; k < 2; k++) {
          const j = dists[k].idx
          if (i < j) {  // avoid duplicate edges
            const geo = new THREE.BufferGeometry().setFromPoints([fieldPoints[i], fieldPoints[j]])
            group.add(new THREE.Line(geo, lineMat))
          }
        }
      }
      // And bright dots at the field intersections
      const fieldDotGeo = new THREE.SphereGeometry(0.18, 6, 6)
      const fieldDotMat = new THREE.MeshBasicMaterial({
        color: 0x66e8ff,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      for (const p of fieldPoints) {
        const m = new THREE.Mesh(fieldDotGeo, fieldDotMat)
        m.position.copy(p)
        group.add(m)
      }
    }
    buildNetField()

    // ── Atmospheric back-glow halo — single subtle layer (bloom amplifies it)
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(R + 0.3, 32, 16),
      new THREE.MeshBasicMaterial({
        color: 0x0066bb, transparent: true, opacity: 0.05,
        side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
      }),
    ))

    // ── Data pulses between hub points
    const pulses: Pulse[] = []
    function spawnPulse() {
      if (hubPositions.length < 2) return
      const a = hubPositions[Math.floor(Math.random() * hubPositions.length)]
      const b = hubPositions[Math.floor(Math.random() * hubPositions.length)]
      if (a === b) return
      const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R + 1.8)
      const curve = new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone())

      const headMat2 = new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 1,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), headMat2)
      head.position.copy(a)
      group.add(head)

      const glowMat2 = new THREE.MeshBasicMaterial({
        color: 0x33ccff, transparent: true, opacity: 0.6,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), glowMat2)
      glow.position.copy(a)
      group.add(glow)

      pulses.push({
        curve, head, glow,
        t: 0, speed: 0.5 + Math.random() * 0.5,
        life: 4, age: 0,
      })
    }
    const TARGET_PULSES = Math.floor(12 * density)
    for (let i = 0; i < TARGET_PULSES; i++) {
      spawnPulse()
      if (pulses.length > 0) {
        const p = pulses[pulses.length - 1]
        p.t = Math.random()
        p.age = Math.random() * p.life * 0.5
      }
    }

    // ── Render loop ───────────────────────────────────────────────────────
    let raf: number
    let last = performance.now()
    let frameAccum = 0
    const FRAME_MS = 1000 / 30

    function frame(now: number) {
      raf = requestAnimationFrame(frame)
      const dt = now - last
      last = now
      frameAccum += dt
      if (frameAccum < FRAME_MS) return
      const stepSec = frameAccum / 1000
      frameAccum = 0

      group.rotation.y += 0.035 * stepSec
      group.rotation.x = Math.sin(now * 0.0001) * 0.05

      // Hub pulse
      const hubScale = 0.85 + Math.sin(now * 0.0025) * 0.15
      for (const h of hubMeshes) h.scale.setScalar(hubScale)

      // Update data pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        p.age += stepSec
        p.t += p.speed * stepSec
        if (p.t >= 1 || p.age >= p.life) {
          group.remove(p.head); group.remove(p.glow)
          p.head.geometry.dispose(); (p.head.material as THREE.Material).dispose()
          p.glow.geometry.dispose(); (p.glow.material as THREE.Material).dispose()
          pulses.splice(i, 1)
          continue
        }
        const pos = p.curve.getPoint(p.t)
        p.head.position.copy(pos)
        p.glow.position.copy(pos)
        p.glow.scale.setScalar(0.85 + Math.sin(p.age * 12) * 0.2)
      }

      while (pulses.length < TARGET_PULSES) spawnPulse()

      composer.render()
    }
    raf = requestAnimationFrame(frame)

    function resize() {
      if (!el) return
      const w = el.clientWidth, h = el.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      composer.setSize(w, h)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      group.traverse((obj) => {
        const m = obj as THREE.Mesh
        if (m.geometry) m.geometry.dispose()
        if (m.material) {
          if (Array.isArray(m.material)) m.material.forEach((mm) => mm.dispose())
          else m.material.dispose()
        }
      })
      composer.dispose()
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [opacity, density])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}
