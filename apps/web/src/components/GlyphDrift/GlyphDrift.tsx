import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Voidlink original — "Stargate Wireframe".
// A slowly rotating wireframe sphere with packet trails arcing around its surface,
// rendered in Three.js. Lives behind everything as a background visual.
// Modern 3D feel, not 80s falling-character pastiche.
//
// (Kept the GlyphDrift filename + export name so existing imports keep working.)

interface StargateProps {
  opacity?: number
  density?: number     // packet density multiplier
  className?: string
  style?: React.CSSProperties
}

interface Packet {
  curve: THREE.QuadraticBezierCurve3
  line: THREE.Line
  head: THREE.Mesh
  t: number              // 0–1 along the curve
  speed: number          // per-second
  life: number           // total lifetime (s)
  age: number
  colorHex: number
}

export function GlyphDrift({
  opacity = 0.55,
  density = 1.0,
  className,
  style,
}: StargateProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    // Reduce DPR cost on the background — it's ambient, doesn't need pixel-perfect
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    // ── Scene setup ───────────────────────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 200)
    camera.position.set(0, 0, 32)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(dpr)
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(el.clientWidth, el.clientHeight)
    el.appendChild(renderer.domElement)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.inset = '0'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.pointerEvents = 'none'

    // ── Build the wireframe sphere ────────────────────────────────────────
    const SPHERE_R = 12
    const group = new THREE.Group()
    scene.add(group)

    // Outer wireframe — thin lat/lon grid
    const wireGeo = new THREE.SphereGeometry(SPHERE_R, 24, 12)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x1a8030,
      wireframe: true,
      transparent: true,
      opacity: 0.18 * opacity,
    })
    group.add(new THREE.Mesh(wireGeo, wireMat))

    // Inner shaded sphere — almost invisible, gives subtle volume
    const fillGeo = new THREE.SphereGeometry(SPHERE_R - 0.05, 32, 16)
    const fillMat = new THREE.MeshBasicMaterial({
      color: 0x031a08,
      transparent: true,
      opacity: 0.55 * opacity,
    })
    group.add(new THREE.Mesh(fillGeo, fillMat))

    // Equator + meridian accent rings
    const ringGeo = new THREE.TorusGeometry(SPHERE_R + 0.05, 0.04, 4, 96)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x39ff14, transparent: true, opacity: 0.32 * opacity })
    group.add(new THREE.Mesh(ringGeo, ringMat))
    const meridian = new THREE.Mesh(ringGeo.clone(), ringMat)
    meridian.rotation.y = Math.PI / 2
    group.add(meridian)
    const tilt = new THREE.Mesh(ringGeo.clone(), ringMat.clone())
    tilt.material.opacity = 0.18 * opacity
    tilt.rotation.x = Math.PI / 4
    group.add(tilt)

    // Halo glow — a slightly larger transparent sphere on the back-side
    const haloGeo = new THREE.SphereGeometry(SPHERE_R + 1.2, 32, 16)
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x39ff14,
      transparent: true,
      opacity: 0.04 * opacity,
      side: THREE.BackSide,
    })
    group.add(new THREE.Mesh(haloGeo, haloMat))

    // Outer atmosphere — bigger softer halo
    const atmGeo = new THREE.SphereGeometry(SPHERE_R + 3, 24, 12)
    const atmMat = new THREE.MeshBasicMaterial({
      color: 0x00cc33,
      transparent: true,
      opacity: 0.025 * opacity,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    group.add(new THREE.Mesh(atmGeo, atmMat))

    // ── Packet trail factory ──────────────────────────────────────────────
    const PACKET_COLORS = [0x39ff14, 0x00e5ff, 0xffaa00]
    const packets: Packet[] = []

    function spawnPacket() {
      // Pick two random points on the surface
      const a = randomSpherePoint(SPHERE_R + 0.4)
      const b = randomSpherePoint(SPHERE_R + 0.4)
      // Arc them through a control point pushed away from the centre
      const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(SPHERE_R + 2.5)
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b)
      const colorHex = PACKET_COLORS[Math.random() < 0.7 ? 0 : Math.random() < 0.85 ? 1 : 2]

      const points = curve.getPoints(24)
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
      const lineMat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.45 * opacity,
      })
      const line = new THREE.Line(lineGeo, lineMat)
      group.add(line)

      const headGeo = new THREE.SphereGeometry(0.18, 6, 6)
      const headMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: opacity })
      const head = new THREE.Mesh(headGeo, headMat)
      head.position.copy(a)
      group.add(head)

      packets.push({
        curve, line, head,
        t: 0, speed: 0.3 + Math.random() * 0.4,
        life: 5 + Math.random() * 3, age: 0,
        colorHex,
      })
    }

    function randomSpherePoint(r: number): THREE.Vector3 {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      )
    }

    // Seed initial packets
    const TARGET_PACKETS = Math.floor(14 * density)
    for (let i = 0; i < TARGET_PACKETS; i++) {
      spawnPacket()
      const p = packets[packets.length - 1]
      p.t = Math.random()
      p.age = Math.random() * p.life * 0.5
    }

    // ── Render loop (cap to 30fps for ambient bg) ─────────────────────────
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

      // Slow rotation
      group.rotation.y += 0.04 * stepSec
      group.rotation.x = Math.sin(now * 0.0001) * 0.08

      // Update packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i]
        p.age += stepSec
        p.t += p.speed * stepSec
        if (p.t >= 1 || p.age >= p.life) {
          group.remove(p.line); group.remove(p.head)
          p.line.geometry.dispose(); (p.line.material as THREE.Material).dispose()
          p.head.geometry.dispose(); (p.head.material as THREE.Material).dispose()
          packets.splice(i, 1)
          continue
        }
        p.head.position.copy(p.curve.getPoint(p.t))

        // Trail fade — material opacity scales with t (bright at start, fades by end)
        const fade = 1 - (p.t * 0.7)
        ;(p.line.material as THREE.LineBasicMaterial).opacity = 0.45 * opacity * fade
      }

      // Top-up to maintain target packet count
      while (packets.length < TARGET_PACKETS) spawnPacket()

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(frame)

    // ── Resize ────────────────────────────────────────────────────────────
    function resize() {
      if (!el) return
      const w = el.clientWidth, h = el.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      // Dispose all geometries/materials in the group
      group.traverse((obj) => {
        const m = obj as THREE.Mesh
        if (m.geometry) m.geometry.dispose()
        if (m.material) {
          if (Array.isArray(m.material)) m.material.forEach((mm) => mm.dispose())
          else m.material.dispose()
        }
      })
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
