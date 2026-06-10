import { useEffect } from 'react'
import { useSettingsStore } from '../../store/settingsStore.ts'
import { AudioEngine } from '../Audio/audioEngine.ts'
import styles from './SettingsWindow.module.css'

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className={styles.toggleRow}>
      <span className={styles.toggleLabel}>{label}</span>
      <button role="switch" aria-checked={on} className={`${styles.toggle} ${on ? styles.toggleOn : ''}`} onClick={() => onChange(!on)}>
        <span className={styles.toggleThumb} />
      </button>
    </label>
  )
}

function Slider({ label, value, min = 0, max = 1, step = 0.01, onChange, disabled }: {
  label: string; value: number; min?: number; max?: number; step?: number
  onChange: (v: number) => void; disabled?: boolean
}) {
  return (
    <label className={`${styles.sliderRow} ${disabled ? styles.disabled : ''}`}>
      <span className={styles.sliderLabel}>{label}</span>
      <div className={styles.sliderTrack}>
        <input type="range" className={styles.slider} min={min} max={max} step={step} value={value} disabled={disabled} onChange={(e) => onChange(parseFloat(e.target.value))} />
        <span className={styles.sliderValue}>{min === 0.8 ? `${Math.round(value * 100)}%` : `${Math.round(value * 100)}%`}</span>
      </div>
    </label>
  )
}

export function SettingsWindow() {
  const s = useSettingsStore()

  useEffect(() => {
    AudioEngine.setMusicEnabled(s.musicEnabled)
    AudioEngine.setMusicVolume(s.musicVolume)
  }, [s.musicEnabled, s.musicVolume])

  useEffect(() => {
    AudioEngine.setSfxEnabled(s.sfxEnabled)
    AudioEngine.setSfxVolume(s.sfxVolume)
  }, [s.sfxEnabled, s.sfxVolume])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', s.theme)
  }, [s.theme])

  // UI scale — applied as zoom on the root element
  useEffect(() => {
    document.documentElement.style.setProperty('--ui-scale', String(s.uiScale))
    ;(document.documentElement.style as CSSStyleDeclaration & { zoom: string }).zoom = String(s.uiScale)
  }, [s.uiScale])

  return (
    <div className={styles.root}>

      {/* ── Audio ─────────────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>AUDIO</div>
        <Toggle label="MUSIC" on={s.musicEnabled} onChange={(v) => s.setSetting('musicEnabled', v)} />
        <Slider label="MUSIC VOLUME" value={s.musicVolume} onChange={(v) => s.setSetting('musicVolume', v)} disabled={!s.musicEnabled} />
        <div className={styles.divider} />
        <Toggle label="SOUND EFFECTS" on={s.sfxEnabled} onChange={(v) => s.setSetting('sfxEnabled', v)} />
        <Slider label="SFX VOLUME" value={s.sfxVolume} onChange={(v) => s.setSetting('sfxVolume', v)} disabled={!s.sfxEnabled} />
        <button className={styles.testBtn} disabled={!s.sfxEnabled} onClick={() => AudioEngine.playSfx('scan')}>TEST SFX</button>
      </section>

      {/* ── Display ───────────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>DISPLAY</div>

        <div className={styles.themeRow}>
          <span className={styles.toggleLabel}>THEME</span>
          <div className={styles.themeButtons}>
            <button className={`${styles.themeBtn} ${s.theme === 'dark'  ? styles.themeBtnActive : ''}`} onClick={() => s.setSetting('theme', 'dark')}>◼ DARK</button>
            <button className={`${styles.themeBtn} ${s.theme === 'light' ? styles.themeBtnActive : ''}`} onClick={() => s.setSetting('theme', 'light')}>◻ LIGHT</button>
          </div>
        </div>

        {/* UI scale — accessibility slider */}
        <div className={styles.scaleRow}>
          <span className={styles.sliderLabel}>UI SCALE</span>
          <div className={styles.sliderTrack}>
            <input
              type="range" className={styles.slider}
              min={0.7} max={1.5} step={0.05}
              value={s.uiScale}
              onChange={(e) => s.setSetting('uiScale', parseFloat(e.target.value))}
            />
            <span className={styles.sliderValue}>{Math.round(s.uiScale * 100)}%</span>
          </div>
          <div className={styles.scaleHint}>
            {s.uiScale < 0.9 ? 'Small' : s.uiScale > 1.2 ? 'Large — good for accessibility' : 'Normal'}
          </div>
          <button className={styles.testBtn} onClick={() => s.setSetting('uiScale', 1.0)}>RESET</button>
        </div>

        <Toggle label="REDUCE MOTION" on={s.reducedMotion} onChange={(v) => s.setSetting('reducedMotion', v)} />
        <Toggle label="SHOW FPS COUNTER" on={s.showFps} onChange={(v) => s.setSetting('showFps', v)} />
        <Toggle label="DISABLE SPLASH CARDS" on={s.disableSplashCards} onChange={(v) => s.setSetting('disableSplashCards', v)} />
        <Toggle label="LOW QUALITY (perf · reload to apply)" on={s.lowQuality} onChange={(v) => s.setSetting('lowQuality', v)} />
        <Toggle label="CRT / SCANLINE MODE" on={s.crtMode} onChange={(v) => s.setSetting('crtMode', v)} />

        {/* M14q Sub-sprint A — Replay Prologue */}
        <div className={styles.scaleRow} style={{ marginTop: 12 }}>
          <span className={styles.sliderLabel}>SHORT INTRO</span>
          <button
            className={styles.testBtn}
            onClick={() => {
              try {
                localStorage.removeItem('voidlink_prologue_seen')
                localStorage.removeItem('voidlink_bond_signed')
              } catch { /**/ }
              alert('Short intro will replay on next boot (until you sign up again).')
            }}
          >REPLAY ON NEXT BOOT</button>
        </div>

        {/* M14r — Replay Operative Intro */}
        <div className={styles.scaleRow}>
          <span className={styles.sliderLabel}>OPERATIVE INTRO</span>
          <button
            className={styles.testBtn}
            onClick={() => {
              try { localStorage.removeItem('voidlink_operative_intro_seen') } catch { /**/ }
              alert('Operative intro will replay the next time you sign in.')
            }}
          >REPLAY ON NEXT LOGIN</button>
        </div>
      </section>

      {/* ── Shortcuts ─────────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>SHORTCUTS</div>
        <div className={styles.keybinds}>
          <div className={styles.keybindRow}><kbd>Ctrl</kbd><span>+</span><kbd>Scroll</kbd><span>Zoom desktop</span></div>
          <div className={styles.keybindRow}><kbd>⊞</kbd><span>Cascade windows</span></div>
          <div className={styles.keybindRow}><kbd>⏻</kbd><span>Save &amp; logout</span></div>
          <div className={styles.keybindRow}><kbd>⚙</kbd><span>Settings (this window)</span></div>
        </div>
      </section>

      <div className={styles.version}>VOIDLINK OS v4.7.1 — PRE-ALPHA · © 2199 Voidlink International</div>
    </div>
  )
}
