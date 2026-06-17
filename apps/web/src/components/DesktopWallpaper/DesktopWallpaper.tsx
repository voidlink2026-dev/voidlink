import { useMemo } from 'react'
import styles from './DesktopWallpaper.module.css'

// V8 — Programmatic SVG city silhouette + grid behind the desktop. Gives
// the workspace something to sit on without committing to commissioned art.
// Pure SVG — no Three.js, no perf cost, no extra dependencies.
//
// Renders as a single absolute-positioned div behind GlyphDrift. The grid
// is a CSS background; the skyline is an SVG drawn once and memoised.

interface Building {
  x: number
  w: number
  h: number
  windows: { dx: number; dy: number; w: number; h: number; on: boolean }[]
}

function generateSkyline(seed: number, width: number, count: number): Building[] {
  let h = seed
  const rng = () => {
    h = (h * 1103515245 + 12345) >>> 0
    return (h % 10000) / 10000
  }

  const buildings: Building[] = []
  let x = -40
  for (let i = 0; i < count; i++) {
    const w = 22 + Math.floor(rng() * 38)         // building width
    const ht = 60 + Math.floor(rng() * 170)        // building height
    const windows: Building['windows'] = []
    // Window grid — small lit/dark rectangles
    const winW = 3
    const winH = 4
    const padX = 4
    const padY = 6
    const cols = Math.max(2, Math.floor((w - padX * 2) / (winW + 2)))
    const rows = Math.max(3, Math.floor((ht - padY * 2) / (winH + 3)))
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        windows.push({
          dx: padX + c * (winW + 2),
          dy: padY + r * (winH + 3),
          w: winW,
          h: winH,
          on: rng() < 0.18,  // ~18% of windows lit
        })
      }
    }
    buildings.push({ x, w, h: ht, windows })
    x += w - Math.floor(rng() * 6)   // overlap slightly so buildings cluster
    if (x > width + 40) break
  }
  return buildings
}

export function DesktopWallpaper() {
  // Seed is a constant so the skyline is the same every render and across
  // sessions. Could be derived from player handle in a future variant for
  // per-character cities (paired with P3 wallpaper-shift).
  const SKYLINE_SEED = 0xC17A53D
  const VIEW_W = 1600
  const VIEW_H = 280

  const buildings = useMemo(
    () => generateSkyline(SKYLINE_SEED, VIEW_W, 40),
    [],
  )

  return (
    <div className={styles.root} aria-hidden="true">
      {/* Grid layer — pure CSS, no SVG cost */}
      <div className={styles.grid} />

      {/* Skyline SVG — single render, never animates */}
      <svg
        className={styles.skyline}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMax meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle distant haze behind the skyline */}
        <defs>
          <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#0a1820" stopOpacity="0.0" />
            <stop offset="60%" stopColor="#0a1820" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0a1820" stopOpacity="0.7" />
          </linearGradient>
          <filter id="topGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#haze)" />

        {buildings.map((b, i) => (
          <g key={i} transform={`translate(${b.x},${VIEW_H - b.h})`}>
            {/* Building silhouette */}
            <rect
              x="0" y="0" width={b.w} height={b.h}
              fill="#020610"
              stroke="#0c2632"
              strokeWidth="0.5"
            />
            {/* Roof glow line — adds subtle skyline definition */}
            <rect
              x="0" y="0" width={b.w} height="1"
              fill="#1a4a5c"
              opacity="0.6"
              filter="url(#topGlow)"
            />
            {/* Windows */}
            {b.windows.map((w, j) => (
              <rect
                key={j}
                x={w.dx} y={w.dy}
                width={w.w} height={w.h}
                fill={w.on ? '#1a6878' : '#080d12'}
                opacity={w.on ? 0.55 : 0.7}
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  )
}
