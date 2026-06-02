import { useEffect, useRef } from 'react'

const VERT = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const FRAG = `
  precision mediump float;
  uniform float time;
  uniform vec2  resolution;
  uniform float traceLevel;  // 0.0 – 1.0

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution;

    // ── Vignette ──────────────────────────────────
    vec2 vig = uv * (1.0 - uv.yx);
    float vignette = clamp(vig.x * vig.y * 16.0, 0.0, 1.0);
    vignette = pow(vignette, 0.38);
    float darkness = (1.0 - vignette) * 0.6;

    // ── Scanlines ─────────────────────────────────
    float scan = sin(uv.y * resolution.y * 1.5707963) * 0.022 + 0.022;

    // ── Animated grain ────────────────────────────
    float grain = hash(uv + fract(time * 0.037)) * 0.038;

    // ── Occasional horizontal flash ───────────────
    float flashRow  = floor(uv.y * resolution.y / 3.0);
    float flashTime = floor(time * 4.0);
    float flash = step(0.997, hash(vec2(flashRow, flashTime))) * 0.07;
    flash *= smoothstep(0.0, 0.04, uv.y) * smoothstep(1.0, 0.96, uv.y);

    // ── Trace-driven red vignette ─────────────────
    float trace = clamp(traceLevel, 0.0, 1.0);
    float traceStart = 0.45;
    float traceIntensity = clamp((trace - traceStart) / (1.0 - traceStart), 0.0, 1.0);
    traceIntensity = pow(traceIntensity, 1.6);

    // Pulse when high
    float pulse = 0.0;
    if (trace > 0.75) {
      float pulseSpeed = mix(1.5, 4.0, clamp((trace - 0.75) / 0.25, 0.0, 1.0));
      pulse = sin(time * pulseSpeed * 6.28318) * 0.5 + 0.5;
      pulse *= clamp((trace - 0.75) / 0.25, 0.0, 1.0) * 0.6;
    }

    float redVig = (1.0 - vignette) * traceIntensity * (1.0 + pulse * 0.4);

    // ── Combine ───────────────────────────────────
    float blackAlpha = clamp(darkness + scan + grain - flash, 0.0, 0.88);
    float redAlpha   = clamp(redVig * 0.55, 0.0, 0.75);

    // Blend: black effects + red trace overlay
    vec3  rgb   = mix(vec3(0.0), vec3(0.55, 0.0, 0.0), redAlpha / max(blackAlpha + redAlpha, 0.001));
    float alpha = clamp(blackAlpha + redAlpha, 0.0, 0.92);

    gl_FragColor = vec4(rgb * alpha, alpha);
  }
`

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  return s
}

export function CRTOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
    if (!gl) return

    // Compile program
    const prog = gl.createProgram()!
    gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER,   VERT))
    gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    // Full-screen quad
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    const posLoc = gl.getAttribLocation(prog, 'position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    // Uniform locations
    const uTime       = gl.getUniformLocation(prog, 'time')
    const uResolution = gl.getUniformLocation(prog, 'resolution')
    const uTrace      = gl.getUniformLocation(prog, 'traceLevel')

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    let raf: number
    const start = performance.now()

    // Import gameStore lazily to avoid circular dep — use window accessor
    function getTraceLevel(): number {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const store = (window as any).__voidlinkStore?.getState?.()
        return (store?.traceState?.level ?? 0) / 100
      } catch { return 0 }
    }

    function resize() {
      canvas!.width  = window.innerWidth
      canvas!.height = window.innerHeight
      gl!.viewport(0, 0, canvas!.width, canvas!.height)
    }
    resize()

    function frame() {
      const t = (performance.now() - start) / 1000
      resize()
      gl!.clear(gl!.COLOR_BUFFER_BIT)
      gl!.uniform1f(uTime, t)
      gl!.uniform2f(uResolution, canvas!.width, canvas!.height)
      gl!.uniform1f(uTrace, getTraceLevel())
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9996,
      }}
    />
  )
}
