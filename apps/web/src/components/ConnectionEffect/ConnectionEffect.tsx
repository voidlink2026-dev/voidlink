import { useEffect, useState, useRef } from 'react'
import { useGameStore } from '../../store/gameStore.ts'
import { AudioEngine } from '../../game/Audio/audioEngine.ts'
import styles from './ConnectionEffect.module.css'

// Plays a brief "dialling" effect when the player connects to a network.
// Triggered by activeNetworkId transitioning from null → non-null.
const SEQUENCE: { text: string; ms: number }[] = [
  { text: 'DIALLING...',                      ms: 950 },   // DTMF tones
  { text: 'RING — REMOTE ANSWERING...',       ms: 500 },
  { text: 'NEGOTIATING CARRIER...',           ms: 700 },   // hiss + warble
  { text: 'AUTHENTICATING UPLINK...',         ms: 500 },
  { text: 'AWAITING REMOTE ACK...',           ms: 500 },
  { text: '◉ CONNECTION ACKNOWLEDGED',        ms: 400 },   // chirp
]

function playDialSfx() {
  // Richer dial-up handshake: DTMF-style number pulses → carrier hiss →
  // dual-tone handshake warble → high-frequency negotiation chirp.
  try {
    const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }
    const Ctx = w.AudioContext || w.webkitAudioContext
    if (!Ctx) return
    const ac = new Ctx()
    const t = ac.currentTime
    const master = ac.createGain()
    master.gain.value = 0.55
    master.connect(ac.destination)

    // 1. DTMF dial — 7-digit number being dialled (697/770/852/941 × 1209/1336/1477)
    const dtmf: [number, number][] = [
      [697, 1209], [770, 1336], [852, 1477],
      [697, 1336], [941, 1209], [697, 1477], [770, 1209],
    ]
    let beat = 0
    for (const [low, high] of dtmf) {
      const onset = t + beat * 0.13
      for (const f of [low, high]) {
        const osc = ac.createOscillator(); osc.type = 'sine'; osc.frequency.value = f
        const g = ac.createGain()
        g.gain.setValueAtTime(0, onset)
        g.gain.linearRampToValueAtTime(0.10, onset + 0.005)
        g.gain.setValueAtTime(0.10, onset + 0.075)
        g.gain.exponentialRampToValueAtTime(0.001, onset + 0.090)
        osc.connect(g); g.connect(master)
        osc.start(onset); osc.stop(onset + 0.10)
      }
      beat++
    }

    // 2. Pickup ring-tone fragment (~100ms, classic ring frequencies)
    const ringStart = t + 1.0
    for (const f of [440, 480]) {
      const osc = ac.createOscillator(); osc.type = 'sine'; osc.frequency.value = f
      const g = ac.createGain()
      g.gain.setValueAtTime(0, ringStart)
      g.gain.linearRampToValueAtTime(0.06, ringStart + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, ringStart + 0.35)
      osc.connect(g); g.connect(master)
      osc.start(ringStart); osc.stop(ringStart + 0.38)
    }

    // 3. Carrier hiss — bandpassed pink-ish noise (300ms ramp-in)
    const hissStart = t + 1.45
    const hissDur = 0.9
    const hissBuf = ac.createBuffer(1, Math.floor(ac.sampleRate * hissDur), ac.sampleRate)
    const hd = hissBuf.getChannelData(0)
    let last = 0
    for (let i = 0; i < hd.length; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.06 * white) / 1.06  // pink-ish filter
      hd[i] = last * 3
    }
    const hissSrc = ac.createBufferSource(); hissSrc.buffer = hissBuf
    const hissBp = ac.createBiquadFilter(); hissBp.type = 'bandpass'; hissBp.frequency.value = 1500; hissBp.Q.value = 1.2
    const hissG = ac.createGain()
    hissG.gain.setValueAtTime(0, hissStart)
    hissG.gain.linearRampToValueAtTime(0.07, hissStart + 0.2)
    hissG.gain.setValueAtTime(0.07, hissStart + hissDur - 0.2)
    hissG.gain.exponentialRampToValueAtTime(0.001, hissStart + hissDur)
    hissSrc.connect(hissBp); hissBp.connect(hissG); hissG.connect(master)
    hissSrc.start(hissStart); hissSrc.stop(hissStart + hissDur + 0.05)

    // 4. Dual-tone modem warble — 1270 Hz + 2225 Hz (Bell 103 mark/space mimic)
    const warbleStart = t + 1.6
    for (const [f, vol] of [[1270, 0.045], [2225, 0.045]] as [number, number][]) {
      const osc = ac.createOscillator(); osc.type = 'sine'; osc.frequency.value = f
      const g = ac.createGain()
      g.gain.setValueAtTime(0, warbleStart)
      g.gain.linearRampToValueAtTime(vol, warbleStart + 0.05)
      // Add a slow LFO wobble for that "negotiating" feel
      const lfo = ac.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 8
      const lfoG = ac.createGain(); lfoG.gain.value = vol * 0.5
      lfo.connect(lfoG); lfoG.connect(g.gain)
      g.gain.setValueAtTime(vol, warbleStart + 0.6)
      g.gain.exponentialRampToValueAtTime(0.001, warbleStart + 0.85)
      osc.connect(g); g.connect(master)
      osc.start(warbleStart); osc.stop(warbleStart + 0.9)
      lfo.start(warbleStart); lfo.stop(warbleStart + 0.9)
    }

    // 5. Negotiation chirp — frequency sweep at the end (handshake success)
    const chirpStart = t + 2.4
    const chirp = ac.createOscillator(); chirp.type = 'square'
    chirp.frequency.setValueAtTime(2400, chirpStart)
    chirp.frequency.exponentialRampToValueAtTime(900, chirpStart + 0.35)
    const cg = ac.createGain()
    cg.gain.setValueAtTime(0.05, chirpStart)
    cg.gain.exponentialRampToValueAtTime(0.001, chirpStart + 0.4)
    chirp.connect(cg); cg.connect(master)
    chirp.start(chirpStart); chirp.stop(chirpStart + 0.4)

    // Auto-close context after everything has played
    setTimeout(() => ac.close().catch(() => {}), 3500)
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
