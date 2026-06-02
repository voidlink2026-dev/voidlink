// Audio engine — procedural SFX + file-based idle music.
// Call AudioEngine.init() once (after a user gesture) then use the static methods freely.

let ctx: AudioContext | null = null
let ambientGain: GainNode | null = null
let ambientOscs: OscillatorNode[] = []

// ── Idle music (file-based, looped) ───────────────────────────────────────────
let idleBuffer: AudioBuffer | null = null
let idleBufferLoading = false
let idleNode: AudioBufferSourceNode | null = null
let idleGain: GainNode | null = null
let idleFadeTimeout: ReturnType<typeof setTimeout> | null = null
let idleShouldPlay = false  // intent flag — survives context suspension

async function loadIdleMusic(): Promise<void> {
  if (idleBuffer || idleBufferLoading) return
  idleBufferLoading = true
  const ac = getCtx()
  const urls = ['/audio/idle_loop.ogg', '/audio/idle_loop.mp3']
  for (const url of urls) {
    try {
      const res = await fetch(url)
      if (!res.ok) continue
      const buf = await res.arrayBuffer()
      idleBuffer = await ac.decodeAudioData(buf)
      break
    } catch { /* try next */ }
  }
  idleBufferLoading = false
  // If music should be playing by the time the buffer finishes loading, start now
  if (idleShouldPlay && !idleNode) _playIdleNode()
}

function _playIdleNode() {
  if (idleNode || !idleBuffer) return
  const ac = getCtx()
  if (idleFadeTimeout) { clearTimeout(idleFadeTimeout); idleFadeTimeout = null }

  const doStart = () => {
    if (idleNode) return
    idleGain = ac.createGain()
    const target = _musicOn ? _musicVol * 0.55 : 0  // 0.55 = post-mix scale (original 0.36 was at vol 0.65)
    idleGain.gain.setValueAtTime(0, ac.currentTime)
    idleGain.gain.linearRampToValueAtTime(target, ac.currentTime + 3)
    idleGain.connect(ac.destination)
    idleNode = ac.createBufferSource()
    idleNode.buffer = idleBuffer!
    idleNode.loop = true
    idleNode.loopStart = 0
    idleNode.loopEnd = idleBuffer!.duration
    idleNode.connect(idleGain)
    idleNode.start()
  }

  // If the context auto-suspended between login and buffer-ready, resume it first.
  // A context that was previously running (unlocked by user gesture) can be resumed
  // without a new gesture — only the initial unlock needs one.
  if (ac.state === 'suspended') {
    ac.resume().then(doStart)
  } else {
    doStart()
  }
}

function startIdleMusic() {
  idleShouldPlay = true
  if (idleNode) return
  if (!idleBuffer) {
    void loadIdleMusic()   // loadIdleMusic calls _playIdleNode when done
    return
  }
  _playIdleNode()
}

function stopIdleMusic() {
  idleShouldPlay = false
  if (!ctx || !idleGain || !idleNode) return
  const now = ctx.currentTime
  idleGain.gain.linearRampToValueAtTime(0, now + 2.5)
  const n = idleNode, g = idleGain
  idleNode = null; idleGain = null
  idleFadeTimeout = setTimeout(() => {
    try { n.stop() } catch { /**/ }
    try { g.disconnect() } catch { /**/ }
  }, 3000)
}

function resumeCtx() {
  if (!ctx || ctx.state !== 'suspended') return
  ctx.resume().then(() => {
    if (idleShouldPlay && !idleNode) _playIdleNode()
  })
}

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext()
    // Register one-time gesture listeners as a fallback for browsers that
    // start AudioContext in the suspended state.
    const resume = () => { resumeCtx(); document.removeEventListener('click', resume); document.removeEventListener('keydown', resume) }
    document.addEventListener('click',   resume, { passive: true })
    document.addEventListener('keydown', resume, { passive: true })
  }
  if (ctx.state === 'suspended') {
    void ctx.resume()
  }
  return ctx
}

// ── Ambient drone ─────────────────────────────────────────────────────────────
// Two detuned oscillators through a lowpass filter — continuous background drone.

function startAmbient() {
  const ac = getCtx()
  if (ambientOscs.length > 0) return // already running

  ambientGain = ac.createGain()
  ambientGain.gain.setValueAtTime(0, ac.currentTime)
  ambientGain.gain.linearRampToValueAtTime(0.018, ac.currentTime + 3)

  const filter = ac.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 220
  filter.Q.value = 0.5

  for (const freq of [32, 34.5, 48]) {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    osc.connect(filter)
    osc.start()
    ambientOscs.push(osc)
  }
  filter.connect(ambientGain)
  ambientGain.connect(ac.destination)
}

function stopAmbient() {
  const ac = ctx
  if (!ac || !ambientGain) return
  const now = ac.currentTime
  ambientGain.gain.linearRampToValueAtTime(0, now + 1.5)
  setTimeout(() => {
    ambientOscs.forEach((o) => { try { o.stop() } catch { /* already stopped */ } })
    ambientOscs = []
    ambientGain = null
  }, 1800)
}

// ── Trace beeps ───────────────────────────────────────────────────────────────
// Proximity-style beep that starts at 10% trace and gets linearly closer
// as the bar fills. No continuous drone — beeps only.
// Interval: 5000 ms at 10% → 120 ms at 100% (linear).

const BEEP_START = 10    // % trace where beeping begins
const BEEP_MAX_MS = 5000 // interval (ms) at BEEP_START
const BEEP_MIN_MS = 120  // interval (ms) at 100%

let beepLevel = 0
let beepTimeout: ReturnType<typeof setTimeout> | null = null

function fireBeep() {
  if (!ctx || beepLevel < BEEP_START) return
  const ac  = ctx
  const t   = ac.currentTime
  const lvl = (beepLevel - BEEP_START) / (100 - BEEP_START)  // 0→1

  // ── Digital ping: click transient + short square tone ────────────────────
  // 1. Hard click: 3 ms noise burst through highpass — gives the "tick" character
  const clickBuf = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.003), ac.sampleRate)
  const cd = clickBuf.getChannelData(0)
  for (let i = 0; i < cd.length; i++) cd[i] = Math.random() * 2 - 1
  const click = ac.createBufferSource()
  click.buffer = clickBuf
  const clickHp = ac.createBiquadFilter()
  clickHp.type = 'highpass'
  clickHp.frequency.value = 4000
  const clickGain = ac.createGain()
  clickGain.gain.setValueAtTime(0.22, t)
  clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.003)
  click.connect(clickHp)
  clickHp.connect(clickGain)
  clickGain.connect(getSfxBus())
  click.start(t)

  // 2. Square tone: 1200 Hz → 1600 Hz as trace rises, 18 ms duration
  const freq = 1200 + lvl * 400
  const osc  = ac.createOscillator()
  osc.type   = 'square'
  osc.frequency.value = freq
  // Bandpass to kill harsh sub-harmonics and keep it crisp
  const bp = ac.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = freq * 1.5
  bp.Q.value = 0.8
  const g = ac.createGain()
  g.gain.setValueAtTime(0.09, t + 0.001)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.018)
  osc.connect(bp)
  bp.connect(g)
  g.connect(getSfxBus())
  osc.start(t + 0.001)
  osc.stop(t + 0.022)

  scheduleBeep()
}

function scheduleBeep() {
  if (beepTimeout) { clearTimeout(beepTimeout); beepTimeout = null }
  if (beepLevel < BEEP_START) return
  // Linear: BEEP_MAX_MS at BEEP_START → BEEP_MIN_MS at 100%
  const frac = (beepLevel - BEEP_START) / (100 - BEEP_START)   // 0 → 1
  const intervalMs = Math.round(BEEP_MAX_MS + (BEEP_MIN_MS - BEEP_MAX_MS) * frac)
  beepTimeout = setTimeout(fireBeep, intervalMs)
}

function setTraceLevel(level: number) {
  if (level <= 0) { stopTraceAlarm(); return }
  const clamped = Math.min(100, Math.max(0, level))
  const wasBelow = beepLevel < BEEP_START
  beepLevel = clamped
  if (wasBelow && clamped >= BEEP_START) scheduleBeep()
}

function stopTraceAlarm() {
  beepLevel = 0
  if (beepTimeout) { clearTimeout(beepTimeout); beepTimeout = null }
}

// ── One-shot SFX ──────────────────────────────────────────────────────────────

function playSfxScan() {
  const ac = getCtx()
  const master = ac.createGain()
  master.gain.value = 0.12
  master.connect(getSfxBus())
  const t = ac.currentTime
  // Three rising beeps: 440 → 550 → 660 Hz
  for (let i = 0; i < 3; i++) {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 440 + i * 110
    const g = ac.createGain()
    g.gain.setValueAtTime(0, t + i * 0.12)
    g.gain.linearRampToValueAtTime(0.8, t + i * 0.12 + 0.02)
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.1)
    osc.connect(g)
    g.connect(master)
    osc.start(t + i * 0.12)
    osc.stop(t + i * 0.12 + 0.12)
  }
}

function playSfxCrack() {
  const ac = getCtx()
  const t = ac.currentTime
  // Irregular noise burst
  const bufSize = ac.sampleRate * 0.4
  const buffer = ac.createBuffer(1, bufSize, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1)
  const noise = ac.createBufferSource()
  noise.buffer = buffer
  const bpf = ac.createBiquadFilter()
  bpf.type = 'bandpass'
  bpf.frequency.value = 900
  bpf.Q.value = 2
  const noiseGain = ac.createGain()
  noiseGain.gain.setValueAtTime(0.15, t)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
  noise.connect(bpf)
  bpf.connect(noiseGain)
  noiseGain.connect(getSfxBus())
  noise.start(t)
  noise.stop(t + 0.4)
  // Success chord after noise
  for (const [freq, delay] of [[523, 0.35], [659, 0.42], [784, 0.49]] as [number, number][]) {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    const g = ac.createGain()
    g.gain.setValueAtTime(0, t + delay)
    g.gain.linearRampToValueAtTime(0.08, t + delay + 0.02)
    g.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.25)
    osc.connect(g)
    g.connect(getSfxBus())
    osc.start(t + delay)
    osc.stop(t + delay + 0.3)
  }
}

function playSfxWipe() {
  const ac = getCtx()
  const t = ac.currentTime
  const osc = ac.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(400, t)
  osc.frequency.exponentialRampToValueAtTime(80, t + 0.6)
  const g = ac.createGain()
  g.gain.setValueAtTime(0.1, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.6)
  const lpf = ac.createBiquadFilter()
  lpf.type = 'lowpass'
  lpf.frequency.value = 600
  osc.connect(lpf)
  lpf.connect(g)
  g.connect(getSfxBus())
  osc.start(t)
  osc.stop(t + 0.65)
}

function playSfxSuccess() {
  const ac = getCtx()
  const t = ac.currentTime
  // C major ascending: C5 E5 G5 C6
  const freqs = [523.25, 659.25, 783.99, 1046.50]
  freqs.forEach((freq, i) => {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    const g = ac.createGain()
    const onset = t + i * 0.09
    g.gain.setValueAtTime(0, onset)
    g.gain.linearRampToValueAtTime(0.12, onset + 0.02)
    g.gain.exponentialRampToValueAtTime(0.001, onset + 0.6)
    osc.connect(g)
    g.connect(getSfxBus())
    osc.start(onset)
    osc.stop(onset + 0.7)
  })
}

function playSfxFail() {
  const ac = getCtx()
  const t = ac.currentTime
  // Descending tritone: C5 → F#4, hard
  for (const [freq, onset, dur] of [[523, 0, 0.4], [370, 0.12, 0.5], [185, 0.28, 0.7]] as [number, number, number][]) {
    const osc = ac.createOscillator()
    osc.type = 'square'
    osc.frequency.value = freq
    const g = ac.createGain()
    g.gain.setValueAtTime(0.09, t + onset)
    g.gain.exponentialRampToValueAtTime(0.001, t + onset + dur)
    osc.connect(g)
    g.connect(getSfxBus())
    osc.start(t + onset)
    osc.stop(t + onset + dur + 0.05)
  }
}

function playSfxBreach() {
  // Short hard thud + scratch — used on node breach
  const ac = getCtx()
  const t = ac.currentTime
  const osc = ac.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(220, t)
  osc.frequency.exponentialRampToValueAtTime(55, t + 0.15)
  const g = ac.createGain()
  g.gain.setValueAtTime(0.18, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
  osc.connect(g)
  g.connect(getSfxBus())
  osc.start(t)
  osc.stop(t + 0.18)
}

// ── Additional UI SFX ─────────────────────────────────────────────────────────
function playSfxClick() {
  try {
    const ac = getCtx(); const t = ac.currentTime
    const nb = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.002), ac.sampleRate)
    const nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1
    const n = ac.createBufferSource(); n.buffer = nb
    const g = ac.createGain(); g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.002)
    n.connect(g); g.connect(getSfxBus()); n.start(t)
  } catch { /**/ }
}
function playSfxTick() {
  try {
    const ac = getCtx(); const t = ac.currentTime
    const osc = ac.createOscillator(); osc.type = 'square'; osc.frequency.value = 1400
    const g = ac.createGain(); g.gain.setValueAtTime(0.04, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.009)
    osc.connect(g); g.connect(getSfxBus()); osc.start(t); osc.stop(t + 0.012)
  } catch { /**/ }
}
function playSfxWindowOpen() {
  try {
    const ac = getCtx(); const t = ac.currentTime
    const osc = ac.createOscillator(); osc.type = 'sine'
    osc.frequency.setValueAtTime(300, t); osc.frequency.exponentialRampToValueAtTime(900, t + 0.08)
    const g = ac.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.07, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
    osc.connect(g); g.connect(getSfxBus()); osc.start(t); osc.stop(t + 0.09)
  } catch { /**/ }
}
function playSfxWindowClose() {
  try {
    const ac = getCtx(); const t = ac.currentTime
    const osc = ac.createOscillator(); osc.type = 'sine'
    osc.frequency.setValueAtTime(800, t); osc.frequency.exponentialRampToValueAtTime(200, t + 0.07)
    const g = ac.createGain(); g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.07)
    osc.connect(g); g.connect(getSfxBus()); osc.start(t); osc.stop(t + 0.08)
  } catch { /**/ }
}
function playSfxError() {
  try {
    const ac = getCtx(); const t = ac.currentTime
    for (const [freq, onset] of [[320, 0], [220, 0.09]] as [number, number][]) {
      const osc = ac.createOscillator(); osc.type = 'square'; osc.frequency.value = freq
      const g = ac.createGain(); g.gain.setValueAtTime(0.08, t + onset); g.gain.exponentialRampToValueAtTime(0.001, t + onset + 0.12)
      osc.connect(g); g.connect(getSfxBus()); osc.start(t + onset); osc.stop(t + onset + 0.14)
    }
  } catch { /**/ }
}

// ── Volume / enable stubs (wired up through idleGain when available) ──────────
let _musicVol = 0.65, _sfxVol = 0.75, _musicOn = true, _sfxOn = true
let sfxMaster: GainNode | null = null
function getSfxBus(): AudioNode {
  if (!ctx) return getCtx().destination
  if (!sfxMaster) {
    sfxMaster = ctx.createGain()
    sfxMaster.gain.value = _sfxOn ? _sfxVol : 0
    sfxMaster.connect(ctx.destination)
  }
  return sfxMaster
}
function setMusicVolume(vol: number) {
  _musicVol = Math.max(0, Math.min(1, vol))
  if (idleGain) idleGain.gain.setTargetAtTime(_musicOn ? _musicVol * 0.55 : 0, getCtx().currentTime, 0.05)
}
function setMusicEnabled(on: boolean) {
  _musicOn = on
  if (idleGain) idleGain.gain.setTargetAtTime(on ? _musicVol * 0.55 : 0, getCtx().currentTime, 0.05)
}
function setSfxVolume(vol: number) {
  _sfxVol = Math.max(0, Math.min(1, vol))
  if (sfxMaster) sfxMaster.gain.setTargetAtTime(_sfxOn ? _sfxVol : 0, getCtx().currentTime, 0.02)
}
function setSfxEnabled(on: boolean) {
  _sfxOn = on
  if (sfxMaster) sfxMaster.gain.setTargetAtTime(on ? _sfxVol : 0, getCtx().currentTime, 0.02)
}

export type SfxType = 'scan' | 'crack' | 'wipe' | 'success' | 'fail' | 'breach' | 'click' | 'tick' | 'windowOpen' | 'windowClose' | 'error'

export const AudioEngine = {
  init() { getCtx() },
  startAmbient,
  stopAmbient,
  loadIdleMusic,
  startIdleMusic,
  stopIdleMusic,
  setTraceLevel,
  stopTraceAlarm,
  setMusicVolume,
  setMusicEnabled,
  setSfxVolume,
  setSfxEnabled,
  playSfx(type: SfxType) {
    if (!_sfxOn) return
    try {
      if      (type === 'scan')        playSfxScan()
      else if (type === 'crack')       playSfxCrack()
      else if (type === 'wipe')        playSfxWipe()
      else if (type === 'success')     playSfxSuccess()
      else if (type === 'fail')        playSfxFail()
      else if (type === 'breach')      playSfxBreach()
      else if (type === 'click')       playSfxClick()
      else if (type === 'tick')        playSfxTick()
      else if (type === 'windowOpen')  playSfxWindowOpen()
      else if (type === 'windowClose') playSfxWindowClose()
      else if (type === 'error')       playSfxError()
    } catch { /* audio context may be suspended */ }
  },
}
