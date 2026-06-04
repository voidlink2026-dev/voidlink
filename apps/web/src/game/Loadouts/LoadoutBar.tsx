import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore.ts'
import { AudioEngine } from '../Audio/audioEngine.ts'
import styles from './LoadoutBar.module.css'

export function LoadoutBar() {
  const player              = useGameStore((s) => s.player)
  const seedStarterLoadouts = useGameStore((s) => s.seedStarterLoadouts)
  const applyLoadout        = useGameStore((s) => s.applyLoadout)
  const saveCurrentAsLoadout = useGameStore((s) => s.saveCurrentAsLoadout)
  const activeMissionId     = useGameStore((s) => s.activeMissionId)

  // Seed the 3 presets on first interaction
  useEffect(() => { seedStarterLoadouts() }, [seedStarterLoadouts])

  const loadouts = player?.loadouts ?? []
  const activeId = player?.activeLoadoutId

  // Loadouts only apply pre-mission — once a mission is active the relay is
  // locked in, so the bar disables Apply but still allows Save for next time.
  const missionActive = !!activeMissionId

  function handleApply(id: string) {
    if (missionActive) return
    const r = applyLoadout(id)
    if (r === 'ok') AudioEngine.playSfx('success')
  }

  function handleSave(id: string) {
    saveCurrentAsLoadout(id)
    AudioEngine.playSfx('click')
  }

  if (loadouts.length === 0) return null

  return (
    <div className={styles.bar}>
      <span className={styles.label}>LOADOUT</span>
      {loadouts.map((lo) => {
        const isActive = lo.id === activeId
        return (
          <div key={lo.id} style={{ display: 'inline-flex', gap: 2 }}>
            <button
              className={`${styles.slot} ${isActive ? styles.slotActive : ''}`}
              onClick={() => handleApply(lo.id)}
              disabled={missionActive}
              title={
                missionActive
                  ? 'Disconnect first to apply a different loadout'
                  : `Apply: route (${lo.preferredRoute.length} hops), exfil ${lo.exfilChannel}${lo.armedConsumableId ? `, arm ${lo.armedConsumableId}` : ''}`
              }
            >
              <span className={styles.icon}>{lo.icon}</span>
              <span>{lo.name}</span>
            </button>
            <button
              className={styles.actionBtn}
              onClick={() => handleSave(lo.id)}
              title="Save current relay + exfil into this slot"
              style={{ padding: '3px 5px' }}
            >SAVE</button>
          </div>
        )
      })}
      {missionActive && <span className={styles.hint}>locked while connected</span>}
    </div>
  )
}
