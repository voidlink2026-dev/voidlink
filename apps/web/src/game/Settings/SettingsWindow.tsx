import { useEffect, useState } from 'react'
import { useSettingsStore } from '../../store/settingsStore.ts'
import { useGameStore } from '../../store/gameStore.ts'
import { REFLECTION_SCENES } from '@voidlink/core'
import { createBranchSave, listBranchSaves, restoreBranchSave, deleteBranchSave, setBranchLabel, type BranchSaveMeta } from '../../store/persistence.ts'
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

        {/* Playtester feedback: 'have an option to re-run the tutorial even
            after i have finished it'. Clears the tutorial_done flag on the
            active player so the tutorial overlay re-renders immediately. */}
        <div className={styles.scaleRow}>
          <span className={styles.sliderLabel}>TUTORIAL</span>
          <button
            className={styles.testBtn}
            onClick={() => {
              const player = useGameStore.getState().player
              if (!player) return
              if (!window.confirm('Replay the operative tutorial from the start? Your save is not affected.')) return
              useGameStore.getState().setPlayerFlag('tutorial_done', false)
            }}
          >REPLAY NOW</button>
        </div>

        {/* P9 — Replay Reflections — lists every reflection scene this
            character has unlocked, lets the player revisit any of them. */}
        <ReflectionReplayList />
      </section>

      {/* P10 — Branch saves */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>BRANCH SAVES</div>
        <BranchSavesPanel />
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

// P9 — Replay Reflections list. Renders every reflection scene the player
// has unlocked (i.e. activeFlags.reflection_<id> is set) as a clickable row
// that calls replayReflection(id) to surface it again.
function ReflectionReplayList() {
  const player = useGameStore((s) => s.player)
  const replayReflection = useGameStore((s) => s.replayReflection)

  const unlocked = Object.entries(REFLECTION_SCENES)
    .filter(([id]) => !!player?.activeFlags[`reflection_${id}`])
    .map(([id, scene]) => ({ id, title: scene.title }))

  if (unlocked.length === 0) {
    return (
      <div className={styles.scaleRow}>
        <span className={styles.sliderLabel}>REFLECTIONS</span>
        <span style={{ fontSize: 9, color: '#707070', letterSpacing: '0.08em', fontStyle: 'italic' }}>
          NO REFLECTIONS UNLOCKED YET
        </span>
      </div>
    )
  }

  return (
    <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div className={styles.sliderLabel} style={{ marginBottom: 2 }}>
        REFLECTIONS — {unlocked.length} UNLOCKED
      </div>
      {unlocked.map((r) => (
        <button
          key={r.id}
          className={styles.testBtn}
          style={{ textAlign: 'left', padding: '5px 10px' }}
          onClick={() => replayReflection(r.id)}
        >
          ▶ {r.title}
        </button>
      ))}
    </div>
  )
}

// P10 — Branch saves panel. Lets the player bookmark the current state
// before a major choice and restore it later. Useful for completionist runs
// that want to explore alternate Arc 1 / Arc 5 / Arc 6/7/8 resolutions.
function BranchSavesPanel() {
  const player = useGameStore((s) => s.player)
  const [bookmarks, setBookmarks] = useState<BranchSaveMeta[]>([])

  useEffect(() => {
    if (player) setBookmarks(listBranchSaves(player.handle))
  }, [player])

  if (!player) return null

  const handleCreate = () => {
    const label = window.prompt('Bookmark label (optional):', 'Before next choice') ?? 'Bookmark'
    const meta = createBranchSave(label)
    if (meta) {
      setBranchLabel(meta.handle, meta.id, meta.label)
      setBookmarks(listBranchSaves(player.handle))
    }
  }

  const handleRestore = (id: string) => {
    if (!window.confirm('Restore this bookmark? Your current progress will be overwritten.')) return
    if (restoreBranchSave(player.handle, id)) {
      window.location.reload()
    }
  }

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this bookmark?')) return
    deleteBranchSave(player.handle, id)
    setBookmarks(listBranchSaves(player.handle))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 9, letterSpacing: '0.16em', color: '#a8a8a8' }}>
          {bookmarks.length} BOOKMARK{bookmarks.length === 1 ? '' : 'S'}
        </span>
        <button className={styles.testBtn} onClick={handleCreate}>+ CREATE BOOKMARK</button>
      </div>
      {bookmarks.length === 0 ? (
        <span style={{ fontSize: 9, color: '#707070', fontStyle: 'italic', letterSpacing: '0.06em' }}>
          NO BOOKMARKS YET. CREATE ONE BEFORE A MAJOR CHOICE TO SAVE A BRANCH POINT.
        </span>
      ) : (
        bookmarks.map((b) => (
          <div key={b.id} style={{
            display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8,
            alignItems: 'center', padding: '6px 8px',
            border: '1px solid #1e1e1e', borderRadius: 2,
          }}>
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{ fontSize: 10, color: '#d4d4d4', fontWeight: 700 }}>{b.label}</div>
              <div style={{ fontSize: 8, color: '#888', letterSpacing: '0.06em' }}>
                Rank {b.rank} · {b.credits.toLocaleString()} Cr · {new Date(b.savedAt).toLocaleString()}
              </div>
            </div>
            <button className={styles.testBtn} onClick={() => handleRestore(b.id)}>RESTORE</button>
            <button className={styles.testBtn} onClick={() => handleDelete(b.id)} style={{ color: '#ff6666' }}>DELETE</button>
          </div>
        ))
      )}
    </div>
  )
}
