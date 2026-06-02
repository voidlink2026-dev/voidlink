import { useGameStore } from './gameStore.ts'

const SAVE_VERSION = 3  // v3: layout persistence (activeWindows + windowLastPositions)
const LEGACY_KEY = 'uplink_ng_save'  // original pre-rename key — kept for one-time migration
const SAVE_PREFIX = 'voidlink_save_'
const INDEX_KEY = 'voidlink_accounts'

interface SaveData {
  version: number
  savedAt: number
  player: ReturnType<typeof useGameStore.getState>['player']
  missions: ReturnType<typeof useGameStore.getState>['missions']
  newsFeed: ReturnType<typeof useGameStore.getState>['newsFeed']
  activeWorldEvents: ReturnType<typeof useGameStore.getState>['activeWorldEvents']
  nextWorldEventAt: ReturnType<typeof useGameStore.getState>['nextWorldEventAt']
  // v3 — desktop layout persistence
  activeWindows?: ReturnType<typeof useGameStore.getState>['activeWindows']
  windowLastPositions?: ReturnType<typeof useGameStore.getState>['windowLastPositions']
  windowZCounter?: ReturnType<typeof useGameStore.getState>['windowZCounter']
}

/** Windows that should NOT be restored because they require active mission state */
const MISSION_ONLY_WINDOWS = new Set(['hacking', 'network-map'])

export interface SaveMeta {
  handle: string
  username: string
  email: string
  savedAt: number
  rank: number
  credits: number
  passwordHash?: string
}

export async function hashPassword(password: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return (await hashPassword(password)) === hash
}

function saveKey(handle: string) {
  return `${SAVE_PREFIX}${handle.toLowerCase()}`
}

// Migrate legacy single-slot save if present
function migrateLegacy() {
  try {
    const raw = localStorage.getItem(LEGACY_KEY)
    if (!raw) return
    const data: SaveData = JSON.parse(raw)
    if (!data.player?.handle) return
    const handle = data.player.handle.toLowerCase()
    if (!localStorage.getItem(saveKey(handle))) {
      const migrated: SaveData = { ...data, version: SAVE_VERSION }
      localStorage.setItem(saveKey(handle), JSON.stringify(migrated))
      updateIndex(data.player)
    }
    localStorage.removeItem(LEGACY_KEY)
  } catch {
    // ignore corrupt legacy data
  }
}

function updateIndex(player: SaveData['player'], passwordHash?: string) {
  if (!player) return
  const all = getAllSaveMeta()
  const existing = all.find((m) => m.handle.toLowerCase() === player.handle.toLowerCase())
  const filtered = all.filter((m) => m.handle.toLowerCase() !== player.handle.toLowerCase())
  filtered.unshift({
    handle: player.handle,
    username: player.username,
    email: player.email,
    savedAt: Date.now(),
    rank: player.rank,
    credits: player.credits,
    // Preserve existing hash on auto-save; only replace when explicitly provided
    passwordHash: passwordHash ?? existing?.passwordHash,
  })
  localStorage.setItem(INDEX_KEY, JSON.stringify(filtered))
}

export function getAllSaveMeta(): SaveMeta[] {
  migrateLegacy()
  try {
    const raw = localStorage.getItem(INDEX_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SaveMeta[]
  } catch {
    return []
  }
}

export function registerOperative(player: SaveData['player'], passwordHash: string): void {
  updateIndex(player, passwordHash)
}

export function saveGame(): boolean {
  try {
    const s = useGameStore.getState()
    if (!s.player) return false
    const data: SaveData = {
      version: SAVE_VERSION,
      savedAt: Date.now(),
      player: s.player,
      missions: s.missions.filter((m) => m.status !== 'active'),
      newsFeed: s.newsFeed,
      activeWorldEvents: s.activeWorldEvents,
      nextWorldEventAt: s.nextWorldEventAt,
      // v3 — persist desktop layout so the player's arrangement survives logout
      activeWindows: s.activeWindows,
      windowLastPositions: s.windowLastPositions,
      windowZCounter: s.windowZCounter,
    }
    localStorage.setItem(saveKey(s.player.handle), JSON.stringify(data))
    updateIndex(s.player)
    return true
  } catch {
    return false
  }
}

export function loadGame(handle: string): boolean {
  migrateLegacy()
  try {
    const raw = localStorage.getItem(saveKey(handle))
    if (!raw) return false
    const data: SaveData = JSON.parse(raw)
    if (!data.player) return false
    const now = Date.now()
    // v3 layout: restore the player's saved window layout, but strip windows
    // that require an active mission (they'd render empty/broken on cold boot)
    const restoredWindows = (data.activeWindows ?? []).filter(
      (w) => !MISSION_ONLY_WINDOWS.has(w.id),
    )
    useGameStore.setState((s) => ({
      ...s,
      player: data.player,
      missions: data.missions ?? [],
      newsFeed: data.newsFeed ?? [],
      activeWorldEvents: (data.activeWorldEvents ?? []).filter((e) => e.endsAt > now),
      nextWorldEventAt: data.nextWorldEventAt ?? null,
      activeWindows: restoredWindows,
      windowLastPositions: data.windowLastPositions ?? {},
      windowZCounter: data.windowZCounter ?? 100,
      focusedWindowId: restoredWindows.length > 0
        ? restoredWindows.reduce((top, w) => (top.zOrder > w.zOrder ? top : w)).id
        : null,
      screen: 'desktop',
    }))
    setActiveSession(handle)
    return true
  } catch {
    return false
  }
}

export function deleteSave(handle: string): void {
  localStorage.removeItem(saveKey(handle))
  const all = getAllSaveMeta()
  localStorage.setItem(INDEX_KEY, JSON.stringify(all.filter((m) => m.handle.toLowerCase() !== handle.toLowerCase())))
}

/** @deprecated use getAllSaveMeta */
export function getSaveInfo(): { savedAt: number; handle: string } | null {
  const all = getAllSaveMeta()
  if (!all.length) return null
  return { savedAt: all[0].savedAt, handle: all[0].handle }
}

/** @deprecated use loadGame(handle) */
export function hasSave(): boolean {
  return getAllSaveMeta().length > 0
}

const SESSION_KEY = 'voidlink_session'

export function setActiveSession(handle: string): void {
  sessionStorage.setItem(SESSION_KEY, handle)
}

export function getActiveSession(): string | null {
  return sessionStorage.getItem(SESSION_KEY)
}

export function clearActiveSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
}

export function startAutoSave(): () => void {
  const id = setInterval(() => {
    const s = useGameStore.getState()
    if (s.player && s.screen === 'desktop') saveGame()
  }, 60_000)
  return () => clearInterval(id)
}
