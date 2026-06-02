import { useEffect, useRef } from 'react'

// Cyber/hacker aesthetic — hex, binary, network symbols. Not Matrix katakana.
const CHARS = '0123456789ABCDEF><|/\\[]{}#$@%^&*~+=:;._'

interface DataRainProps {
  opacity?: number
  speed?: number        // drop speed multiplier (1 = normal)
  fontSize?: number
  color?: string
  fadeOut?: boolean     // if true, fades to zero after `fadeOutAfterMs`
  fadeOutAfterMs?: number
  className?: string
  style?: React.CSSProperties
}

export function DataRain({
  opacity = 0.18,
  speed = 0.35,
  fontSize = 12,
  color = '57, 255, 20',
  fadeOut = false,
  fadeOutAfterMs = 1800,
  className,
  style,
}: DataRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = canvas.offsetWidth  || window.innerWidth
      canvas.height = canvas.offsetHeight || window.innerHeight
    }
    resize()

    const cols  = Math.ceil(canvas.width / fontSize)
    const drops = Array.from({ length: cols }, () => Math.random() * -80)
    const start = Date.now()
    let raf: number

    function draw() {
      const elapsed = Date.now() - start
      let alpha = opacity
      if (fadeOut) {
        alpha = opacity * Math.max(0, 1 - (elapsed - fadeOutAfterMs) / 600)
      }

      ctx!.fillStyle = 'rgba(0,0,0,0.04)'
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      ctx!.font = `${fontSize}px "JetBrains Mono", monospace`

      for (let i = 0; i < drops.length; i++) {
        if (drops[i] * fontSize < 0) { drops[i] += speed; continue }

        const bright = Math.random() > 0.93
        ctx!.fillStyle = bright
          ? `rgba(${color}, ${Math.min(1, alpha * 2.2)})`
          : `rgba(${color}, ${alpha * 0.7})`

        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        ctx!.fillText(char, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas!.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += speed
      }

      if (!fadeOut || alpha > 0) {
        raf = requestAnimationFrame(draw)
      } else {
        ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      }
    }

    raf = requestAnimationFrame(draw)
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [opacity, speed, fontSize, color, fadeOut, fadeOutAfterMs])

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
