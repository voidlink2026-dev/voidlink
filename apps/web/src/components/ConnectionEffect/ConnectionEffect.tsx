import { useEffect, useState, useRef } from 'react'
import { useGameStore } from '../../store/gameStore.ts'
import { AudioEngine } from '../../game/Audio/audioEngine.ts'
import styles from './ConnectionEffect.module.css'

// Plays a brief "dialling" effect when the player connects to a network.
// Triggered by activeNetworkId transitioning from null → non-null.
const SEQUENCE: { text: string; ms: number }[] = [
  { text: 'INITIATING CONNECTION...',         ms: 350 },
  { text: 'ESTABLISHING BOUNCE ROUTE...',     ms: 500 },
  { text: 'NEGOTIATING HANDSHAKE...',         ms: 450 },
  { text: 'AUTHENTICATING UPLINK...',         ms: 400 },
  { text: 'AWAITING REMOTE ACK...',           ms: 600 },
  { text: '◉ CONNECTION ACKNOWLEDGED',        ms: 350 },
]

function playDialSfx() {
  // Procedural dial-tone: ascending tone burst, then handshake-style buzz
  try {
    const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }
    const Ctx = w.AudioContext || w.webkitAudioContext
    if (!Ctx) return
    const ac = new Ctx()
    const t = ac.currentTime
    // 4 ascending tones (dial pulses)
    for (let i = 0; i < 4; i++) {
      const osc = ac.createOscillator()
      osc.type = 'square'
      osc.frequency.value = 380 + i * 90
      const g = ac.createGain()
      const onset = t + i * 0.15
      g.gain.setValueAtTime(0, onset)
      g.gain.linearRampToValueAtTime(0.06, onset + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, onset + 0.12)
      osc.connect(g); g.connect(ac.destination)
      osc.start(onset); osc.stop(onset + 0.14)
    }
    // Handshake buzz at the end — band-passed noise
    const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.6), ac.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.4
    const n = ac.createBufferSource(); n.buffer = buf
    const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1200; bp.Q.value = 4
    const ng = ac.createGain(); ng.gain.setValueAtTime(0.05, t + 0.65); ng.gain.exponentialRampToValueAtTime(0.001, t + 1.2)
    n.connect(bp); bp.connect(ng); ng.connect(ac.destination)
    n.start(t + 0.65); n.stop(t + 1.25)
    setTimeout(() => ac.close().catch(() => {}), 2500)
  } catch { /* ignore */ }
}

export function ConnectionEffect() {
  const activeNetworkId = useGameStore((s) => s.activeNetworkId)
  const activeRoute     = useGameStore((s) => s.activeRoute)
  const player          = useGameStore((s) => s.player)
  const [active, setActive] = useState(false)
  const [step, setStep]     = useState(0)
  const prevNetwork = useRef<string | null>(null)

  useEffect(() => {
    if (activeNetworkId && !prevNetwork.current) {
      setActive(true)
      setStep(0)
      playDialSfx()
      AudioEngine.playSfx('scan')
      let i = 0
      let timeout: ReturnType<typeof setTimeout>
      const tick = () => {
        setStep(i)
        if (i < SEQUENCE.length) {
          timeout = setTimeout(() => { i++; tick() }, SEQUENCE[i].ms)
        } else {
          setActive(false)
        }
      }
      tick()
      return () => clearTimeout(timeout)
    }
    prevNetwork.current = activeNetworkId
  }, [activeNetworkId])

  if (!active) return null

  const hops = activeRoute
  const bounceLib = player?.bounceLibrary ?? []
  const currentText = SEQUENCE[Math.min(step, SEQUENCE.length - 1)]?.text ?? ''

  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={styles.panel}>
        <div className={styles.title}>VOIDLINK UPLINK SERVICE</div>

        <div className={styles.chain}>
          <NodeBox label="YOU" sub="localhost" active={step >= 0} />
          {hops.map((hopId, i) => {
            const node = bounceLib.find((n) => n.id === hopId)
            return (
              <span key={hopId} className={styles.chainSegment}>
                <span className={`${styles.link} ${step >= i + 1 ? styles.linkActive : ''}`} />
                <NodeBox label={node?.label ?? 'HOP'} sub={node?.region ?? ''} active={step >= i + 1} />
              </span>
            )
          })}
          <span className={styles.chainSegment}>
            <span className={`${styles.link} ${step >= hops.length + 1 ? styles.linkActive : ''}`} />
            <NodeBox label="TARGET" sub="234.773.0.666" active={step >= hops.length + 1} dim />
          </span>
        </div>

        <div className={styles.statusLine}>
          <span className={styles.cursor}>▌</span> {currentText}
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${(step / SEQUENCE.length) * 100}%` }} />
        </div>
      </div>
    </div>
  )
}

function NodeBox({ label, sub, active, dim }: { label: string; sub: string; active: boolean; dim?: boolean }) {
  return (
    <div className={`${styles.node} ${active ? styles.nodeActive : ''} ${dim ? styles.nodeTarget : ''}`}>
      <div className={styles.nodeIcon}>▣</div>
      <div className={styles.nodeLabel}>{label}</div>
      <div className={styles.nodeSub}>{sub}</div>
    </div>
  )
}
