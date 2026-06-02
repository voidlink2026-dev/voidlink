import { useEffect, useRef } from 'react'

// Voidlink original — "Constellation Network".
// A sparse field of glowing nodes connected by faint edges. Packets travel along
// edges in both directions, occasionally branching. Nodes pulse briefly when a
// packet "arrives". Subtle parallax via depth layers. Reads as live network
// traffic rather than Matrix-style falling characters.
//
// (Kept the GlyphDrift filename + export name so existing imports keep working;
// the visual is now Constellation Network.)

interface Node {
  x: number; y: number
  vx: number; vy: number  // slow ambient drift
  depth: number           // 0 (back) → 1 (front), drives size + opacity
  pulse: number           // 0–1, decays each frame
}

interface Edge {
  a: number; b: number    // node indices
  length: number          // px (cached)
}

interface Packet {
  edge: number            // edge index
  direction: 1 | -1
  position: number        // 0 → 1 along edge
  speed: number           // px/s
  age: number
  color: 'g' | 'c' | 'a'
}

const COLORS = {
  g: { hue: '57, 255, 20'  },  // green
  c: { hue: '0, 229, 255'  },  // cyan
  a: { hue: '255, 170, 0'  },  // amber
}

interface ConstellationProps {
  opacity?: number
  density?: number   // multiplier for node count
  className?: string
  style?: React.CSSProperties
}

// Kept the original export name so callers don't need to change imports.
export function GlyphDrift({
  opacity = 0.55,
  density = 1.0,
  className,
  style,
}: ConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      if (!canvas) return
      canvas.width  = canvas.offsetWidth  || window.innerWidth
      canvas.height = canvas.offsetHeight || window.innerHeight
    }
    resize()

    // ── Build the constellation ────────────────────────────────────────────
    const area = canvas.width * canvas.height
    const NODE_COUNT = Math.max(20, Math.floor((area / 30000) * density))
    const MAX_EDGE_DIST = Math.min(canvas.width, canvas.height) * 0.18
    const nodes: Node[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.04,
        vy: (Math.random() - 0.5) * 0.04,
        depth: Math.random(),
        pulse: 0,
      })
    }

    // Edges: connect each node to its nearest few neighbours within range
    const edges: Edge[] = []
    function rebuildEdges() {
      edges.length = 0
      for (let i = 0; i < nodes.length; i++) {
        // Find 2–3 nearest neighbours within MAX_EDGE_DIST
        const dists: Array<{ idx: number; d: number }> = []
        for (let j = 0; j < nodes.length; j++) {
          if (j === i) continue
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < MAX_EDGE_DIST) dists.push({ idx: j, d })
        }
        dists.sort((a, b) => a.d - b.d)
        const take = Math.min(3, dists.length)
        for (let k = 0; k < take; k++) {
          const j = dists[k].idx
          // Avoid duplicate edges
          if (edges.some((e) => (e.a === i && e.b === j) || (e.a === j && e.b === i))) continue
          edges.push({ a: i, b: j, length: dists[k].d })
        }
      }
    }
    rebuildEdges()

    // Periodically rebuild edges as nodes drift
    let lastRebuild = 0
    const REBUILD_INTERVAL = 4000

    // ── Packet system ──────────────────────────────────────────────────────
    const packets: Packet[] = []
    function spawnPacket() {
      if (edges.length === 0) return
      const edgeIdx = Math.floor(Math.random() * edges.length)
      const roll = Math.random()
      const color: Packet['color'] = roll < 0.8 ? 'g' : roll < 0.95 ? 'c' : 'a'
      packets.push({
        edge: edgeIdx,
        direction: Math.random() < 0.5 ? 1 : -1,
        position: Math.random() < 0.5 ? 0 : 1,
        speed: 60 + Math.random() * 90,  // px/s
        age: 0,
        color,
      })
    }
    // Seed initial packets
    for (let i = 0; i < Math.min(8, Math.floor(edges.length * 0.25)); i++) spawnPacket()

    // ── Animation loop ─────────────────────────────────────────────────────
    let raf: number
    let lastFrame = 0
    const FRAME_MS = 1000 / 30  // 30fps — fluid enough for packet motion

    function draw(ts: number) {
      raf = requestAnimationFrame(draw)
      if (ts - lastFrame < FRAME_MS) return
      const dt = lastFrame === 0 ? FRAME_MS : ts - lastFrame
      lastFrame = ts

      // Rebuild edges occasionally as nodes drift
      if (ts - lastRebuild > REBUILD_INTERVAL) {
        rebuildEdges()
        lastRebuild = ts
      }

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      // Drift nodes
      for (const n of nodes) {
        n.x += n.vx * dt
        n.y += n.vy * dt
        if (n.x < 0 || n.x > canvas!.width)  n.vx *= -1
        if (n.y < 0 || n.y > canvas!.height) n.vy *= -1
        n.pulse = Math.max(0, n.pulse - dt / 800)
      }

      // Draw edges (faint, length-attenuated)
      for (const e of edges) {
        const a = nodes[e.a]; const b = nodes[e.b]
        const fadeFactor = 1 - (e.length / MAX_EDGE_DIST)
        const edgeAlpha = 0.04 * fadeFactor * opacity
        ctx!.strokeStyle = `rgba(${COLORS.g.hue}, ${edgeAlpha.toFixed(3)})`
        ctx!.lineWidth = 0.7
        ctx!.beginPath()
        ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y)
        ctx!.stroke()
      }

      // Spawn new packets at a steady rate
      const spawnChance = 0.04 + (edges.length / 200) * 0.06
      if (Math.random() < spawnChance) spawnPacket()

      // Update + draw packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i]
        const e = edges[p.edge]
        if (!e) { packets.splice(i, 1); continue }
        const a = nodes[e.a]; const b = nodes[e.b]
        const delta = (p.speed * dt / 1000) / e.length
        p.position += delta * p.direction
        p.age += dt

        // If packet arrived at an endpoint: pulse the node, maybe rebound
        if (p.position >= 1 || p.position <= 0) {
          const targetNode = p.position >= 1 ? nodes[e.b] : nodes[e.a]
          targetNode.pulse = 1
          // 30% chance to branch onto another edge from this node
          if (Math.random() < 0.3) {
            const fromIdx = p.position >= 1 ? e.b : e.a
            const candidates = edges.filter((ee) =>
              (ee.a === fromIdx || ee.b === fromIdx) && ee !== e,
            )
            if (candidates.length > 0) {
              const next = candidates[Math.floor(Math.random() * candidates.length)]
              p.edge = edges.indexOf(next)
              p.direction = (next.a === fromIdx ? 1 : -1)
              p.position = next.a === fromIdx ? 0 : 1
              p.age = 0
              continue
            }
          }
          packets.splice(i, 1)
          continue
        }

        // Draw packet — glowing dot at interpolated position
        const px = a.x + (b.x - a.x) * p.position
        const py = a.y + (b.y - a.y) * p.position
        const hue = COLORS[p.color].hue
        ctx!.fillStyle = `rgba(${hue}, ${0.95 * opacity})`
        ctx!.beginPath()
        ctx!.arc(px, py, 1.8, 0, Math.PI * 2)
        ctx!.fill()
        // Outer glow
        ctx!.fillStyle = `rgba(${hue}, ${0.25 * opacity})`
        ctx!.beginPath()
        ctx!.arc(px, py, 5, 0, Math.PI * 2)
        ctx!.fill()
      }

      // Draw nodes (after packets so they sit on top)
      for (const n of nodes) {
        const size = 1.5 + n.depth * 2.5 + n.pulse * 4
        const nodeAlpha = (0.45 + n.depth * 0.45) * opacity
        const pulseAlpha = n.pulse * opacity * 0.6

        // Pulse halo
        if (n.pulse > 0) {
          ctx!.fillStyle = `rgba(${COLORS.g.hue}, ${pulseAlpha.toFixed(3)})`
          ctx!.beginPath()
          ctx!.arc(n.x, n.y, size + 6, 0, Math.PI * 2)
          ctx!.fill()
        }
        // Core dot
        ctx!.fillStyle = `rgba(${COLORS.g.hue}, ${nodeAlpha.toFixed(3)})`
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, size, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    raf = requestAnimationFrame(draw)
    const ro = new ResizeObserver(() => {
      resize()
      rebuildEdges()
    })
    ro.observe(canvas)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [opacity, density])

  return (
    <canvas
      ref={canvasRef}
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
