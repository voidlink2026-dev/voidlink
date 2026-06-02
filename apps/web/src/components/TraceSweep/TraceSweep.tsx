import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore.ts'

// Voidlink original — replaces the data-rain background while a trace is active.
// A faint scanning grid + a downward sweep band + occasional "pings" that flare
// where the sweep passes. Intensity scales with trace %.
//
//   trace 0–30   : subtle green grid, gentle 4s sweep
//   trace 30–60  : sweep speeds up, ping density rises
//   trace 60–85  : grid becomes amber, sweep adds vertical scan line
//   trace 85–100 : red flashing, sweep doubles, ping shockwave
//
// Sits underneath windows (z-index: 0). Only renders when traceState is non-null.

interface Ping {
  x: number
  y: number
  age: number       // ms since spawn
  life: number      // total lifetime
  intensity: number // 0–1
}

export function TraceSweep() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const traceState = useGameStore((s) => s.traceState)
  const level = traceState?.level ?? 0
  const active = !!traceState

  // Keep a ref to level so the RAF loop sees the latest value without re-attaching
  const levelRef = useRef(level)
  levelRef.current = level

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      if (!canvas) return
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const pings: Ping[] = []
    let raf: number
    let lastFrame = 0
    let sweepY = 0
    let scanX  = 0
    const FRAME_MS = 1000 / 24  // 24 fps — smoother than glyph drift since this needs the sweep

    function colorFor(lvl: number, alpha: number): string {
      if (lvl >= 85) return `rgba(255, 51, 51, ${alpha})`
      if (lvl >= 60) return `rgba(255, 170, 0, ${alpha})`
      return `rgba(57, 255, 20, ${alpha})`
    }

    function draw(ts: number) {
      raf = requestAnimationFrame(draw)
      if (ts - lastFrame < FRAME_MS) return
      const dt = lastFrame === 0 ? FRAME_MS : ts - lastFrame
      lastFrame = ts

      const lvl = levelRef.current
      const W = canvas!.width
      const H = canvas!.height
      ctx!.clearRect(0, 0, W, H)

      // ── 1. Grid ────────────────────────────────────────────────────────────
      const gridAlpha = 0.04 + (lvl / 100) * 0.06
      ctx!.strokeStyle = colorFor(lvl, gridAlpha)
      ctx!.lineWidth = 1
      const gridSize = 48
      ctx!.beginPath()
      for (let y = 0; y < H; y += gridSize) {
        ctx!.moveTo(0, y); ctx!.lineTo(W, y)
      }
      for (let x = 0; x < W; x += gridSize) {
        ctx!.moveTo(x, 0); ctx!.lineTo(x, H)
      }
      ctx!.stroke()

      // ── 2. Sweep band — horizontal scan line moving downward ──────────────
      const sweepSpeed = 90 + (lvl / 100) * 240   // px/s, 90 idle → 330 at 100%
      sweepY = (sweepY + sweepSpeed * dt / 1000) % (H + 80)
      const sweepHeight = 80
      const grd = ctx!.createLinearGradient(0, sweepY - sweepHeight, 0, sweepY + sweepHeight)
      grd.addColorStop(0,   colorFor(lvl, 0))
      grd.addColorStop(0.5, colorFor(lvl, 0.20 + (lvl / 100) * 0.25))
      grd.addColorStop(1,   colorFor(lvl, 0))
      ctx!.fillStyle = grd
      ctx!.fillRect(0, sweepY - sweepHeight, W, sweepHeight * 2)

      // Bright leading edge
      ctx!.strokeStyle = colorFor(lvl, 0.4 + (lvl / 100) * 0.4)
      ctx!.lineWidth = 1.5
      ctx!.beginPath()
      ctx!.moveTo(0, sweepY); ctx!.lineTo(W, sweepY)
      ctx!.stroke()

      // ── 3. Vertical scan line (only above 60% trace) ──────────────────────
      if (lvl >= 60) {
        const scanSpeed = (lvl >= 85 ? 280 : 180)
        scanX = (scanX + scanSpeed * dt / 1000) % (W + 80)
        const sgrd = ctx!.createLinearGradient(scanX - 60, 0, scanX + 60, 0)
        sgrd.addColorStop(0,   colorFor(lvl, 0))
        sgrd.addColorStop(0.5, colorFor(lvl, 0.20))
        sgrd.addColorStop(1,   colorFor(lvl, 0))
        ctx!.fillStyle = sgrd
        ctx!.fillRect(scanX - 60, 0, 120, H)
      }

      // ── 4. Pings — spawn new ones near the sweep line, fade out ──────────
      const spawnChance = 0.05 + (lvl / 100) * 0.5
      if (Math.random() < spawnChance) {
        pings.push({
          x: Math.random() * W,
          y: sweepY + (Math.random() - 0.5) * 30,
          age: 0,
          life: 1200 + Math.random() * 500,
          intensity: 0.4 + Math.random() * 0.6,
        })
      }
      for (let i = pings.length - 1; i >= 0; i--) {
        const p = pings[i]
        p.age += dt
        const t = p.age / p.life
        if (t >= 1) { pings.splice(i, 1); continue }
        const radius = 4 + t * 30
        const alpha = (1 - t) * p.intensity
        // Outer ring
        ctx!.strokeStyle = colorFor(lvl, alpha * 0.5)
        ctx!.lineWidth = 1.5
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx!.stroke()
        // Inner dot
        ctx!.fillStyle = colorFor(lvl, alpha)
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx!.fill()
      }

      // ── 5. Red flashing strobe at >90% ────────────────────────────────────
      if (lvl >= 90) {
        const flashAlpha = (Math.sin(ts / 80) + 1) * 0.5 * 0.06
        ctx!.fillStyle = `rgba(255, 51, 51, ${flashAlpha})`
        ctx!.fillRect(0, 0, W, H)
      }
    }

    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        mixBlendMode: 'screen',
      }}
    />
  )
}
