import { useGameStore } from './gameStore.ts'

const SAVE_KEY = 'uplink_ng_save'

interface SaveData {
  version: number
  savedAt: number
  player: ReturnType<typeof useGameStore.getState>['player']
  missions: ReturnType<typeof useGameStore.getState>['missions']
}

const SAVE_VERSION = 1

export function saveGame(): boolean {
  try {
    const s = useGameStore.getState()
    if (!s.player) return false
    const data: SaveData = {
      version: SAVE_VERSION,
      savedAt: Date.now(),
      player: s.player,
      missions: s.missions.filter((m) => m.status !== 'active'), // don't save mid-mission state
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function loadGame(): boolean {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return false
    const data: SaveData = JSON.parse(raw)
    if (data.version !== SAVE_VERSION) return false
    useGameStore.setState((s) => ({
      ...s,
      player: data.player,
      missions: data.missions,
      screen: 'desktop',
    }))
    return true
  } catch {
    return false
  }
}

export function hasSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY)
}

export function getSaveInfo(): { savedAt: number; handle: string } | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const data: SaveData = JSON.parse(raw)
    return { savedAt: data.savedAt, handle: data.player?.handle ?? '???' }
  } catch {
    return null
  }
}

// Auto-save every 60 seconds when a player is logged in
export function startAutoSave(): () => void {
  const id = setInterval(() => {
    const s = useGameStore.getState()
    if (s.player && s.screen === 'desktop') saveGame()
  }, 60_000)
  return () => clearInterval(id)
}
