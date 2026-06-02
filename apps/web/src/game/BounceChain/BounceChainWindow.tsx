import { useGameStore } from '../../store/gameStore.ts'
import { Button } from '@voidlink/ui'
import { AudioEngine } from '../Audio/audioEngine.ts'
import styles from './BounceChainWindow.module.css'

// Max bounce hops from player proxy software (mirror of WorldMap helper)
function getMaxHops(proxies: { toolId: string }[]): number {
  if (proxies.some((p) => p.toolId === 'proxy_v4')) return 8
  if (proxies.some((p) => p.toolId === 'proxy_v3')) return 7
  if (proxies.some((p) => p.toolId === 'proxy_v2')) return 5
  return 3
}

export function BounceChainWindow() {
  const player           = useGameStore((s) => s.player)
  const activeRoute      = useGameStore((s) => s.activeRoute)
  const setBounceRoute   = useGameStore((s) => s.setBounceRoute)
  const openWindow       = useGameStore((s) => s.openWindow)
  const focusWindow      = useGameStore((s) => s.focusWindow)
  const activeWindows    = useGameStore((s) => s.activeWindows)

  if (!player) return null

  const proxies   = player.software.proxies ?? []
  const maxHops   = getMaxHops(proxies)
  const bounceLib = player.bounceLibrary ?? []

  function openWorldMap() {
    const isOpen = activeWindows.some((w) => w.id === 'world-map')
    if (isOpen) {
      focusWindow('world-map')
    } else {
      openWindow({
        id: 'world-map', title: 'GLOBAL NETWORK MAP', component: 'WorldMap',
        x: 200, y: 80, width: 820, height: 580, isMinimized: false,
      })
    }
    AudioEngine.playSfx('click')
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span className={styles.title}>BOUNCE CHAIN</span>
        <span className={styles.slots}>{activeRoute.length}/{maxHops} HOPS</span>
      </div>

      {activeRoute.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyText}>No active route.</span>
          <span className={styles.emptyHint}>
            Open WORLD MAP and click green bounce nodes to build your chain.
          </span>
        </div>
      ) : (
        <div className={styles.chain}>
          <div className={styles.endpoint}>YOU</div>
          {activeRoute.map((hopId, i) => {
            const node = bounceLib.find((n) => n.id === hopId)
            return (
              <div key={hopId} className={styles.hopRow}>
                <span className={styles.arrow}>↓</span>
                <span className={styles.hopNum}>{i + 1}</span>
                <span className={`${styles.hopStatus} ${node ? styles[`hop_${node.logStatus}`] : ''}`}>●</span>
                <span className={styles.hopLabel}>{node?.label ?? hopId}</span>
                <button
                  className={styles.removeBtn}
                  onClick={() => setBounceRoute(activeRoute.filter((id) => id !== hopId))}
                  title="Remove this hop"
                >✕</button>
              </div>
            )
          })}
          <span className={styles.arrow}>↓</span>
          <div className={`${styles.endpoint} ${styles.target}`}>TARGET</div>
        </div>
      )}

      <div className={styles.actions}>
        <Button variant="primary" size="sm" onClick={openWorldMap} className={styles.editBtn}>
          ▶ EDIT ON WORLD MAP
        </Button>
        {activeRoute.length > 0 && (
          <button className={styles.clearBtn} onClick={() => setBounceRoute([])}>CLEAR</button>
        )}
      </div>

      <div className={styles.legend}>
        <span><span className={`${styles.hopStatus} ${styles.hop_clean}`}>●</span> Clean</span>
        <span><span className={`${styles.hopStatus} ${styles.hop_dirty}`}>●</span> Dirty</span>
        <span><span className={`${styles.hopStatus} ${styles.hop_traced}`}>●</span> Traced</span>
      </div>
    </div>
  )
}
