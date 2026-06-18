import { useGameStore } from './gameStore.ts'
import { signSave, verifySave, SAVE_INTEGRITY_FIELD } from '@voidlink/core'

const SAVE_VERSION = 5  // v5: exfilChannel persistence (M14j loadouts)
const LEGACY_KEY = 'uplink_ng_save'  // original pre-rename key — kept for one-time migration
const SAVE_PREFIX = 'voidlink_save_'
const INDEX_KEY = 'voidlink_accounts'

interface SaveData {
  version: number
  savedAt: number
  player: ReturnType<typeof useGameStore.getState>['player']
  missions: ReturnType<typeof useGameStore.getState>['missions']
  newsFeed: ReturnType<typeof useGameStore.getState>['newsFeed']
  inbox?: ReturnType<typeof useGameStore.getState>['inbox']  // v4
  exfilChannel?: ReturnType<typeof useGameStore.getState>['exfilChannel']  // v5
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

export function updatePassword(handle: string, passwordHash: string): boolean {
  const all = getAllSaveMeta()
  const idx = all.findIndex((m) => m.handle.toLowerCase() === handle.toLowerCase())
  if (idx === -1) return false
  all[idx] = { ...all[idx], passwordHash }
  localStorage.setItem(INDEX_KEY, JSON.stringify(all))
  return true
}

export function findSaveByEmail(email: string): SaveMeta | null {
  const e = email.trim().toLowerCase()
  if (!e) return null
  return getAllSaveMeta().find((m) => m.email?.toLowerCase() === e) ?? null
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
      inbox: s.inbox,
      exfilChannel: s.exfilChannel,
      activeWorldEvents: s.activeWorldEvents,
      nextWorldEventAt: s.nextWorldEventAt,
      // v3 — persist desktop layout so the player's arrangement survives logout
      activeWindows: s.activeWindows,
      windowLastPositions: s.windowLastPositions,
      windowZCounter: s.windowZCounter,
    }
    // L5.1 — sign the body before writing. The signature lets a future load
    // detect JSON-edit tampering and gate Steam-side achievement unlocks.
    const signed = { ...data, [SAVE_INTEGRITY_FIELD]: signSave(data) }
    localStorage.setItem(saveKey(s.player.handle), JSON.stringify(signed))
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
    const parsed = JSON.parse(raw) as SaveData & Record<string, unknown>
    if (!parsed.player) return false
    // L5.1 — verify integrity. Tampered saves still load (we don't punish
    // offline single-player play) but get a flag that prevents Steam-side
    // achievement unlocks downstream.
    const integrityOk = !!parsed[SAVE_INTEGRITY_FIELD] && verifySave(parsed)
    const { [SAVE_INTEGRITY_FIELD]: _sig, ...rest } = parsed
    void _sig
    const data: SaveData = rest as SaveData
    if (!integrityOk && data.player) {
      data.player.activeFlags = {
        ...data.player.activeFlags,
        save_tampered_at: Date.now(),
      }
      // One-shot in-fiction warning. Only inject if not already in the inbox.
      const inbox = data.inbox ?? []
      const alreadyWarned = inbox.some((m) => m.id === 'sys_save_integrity_warning')
      if (!alreadyWarned) {
        data.inbox = [
          {
            id: 'sys_save_integrity_warning',
            receivedAt: Date.now(),
            isRead: false,
            encrypted: false,
            category: 'system',
            from: 'sys.ops',
            subject: 'Local profile integrity — Steam unlocks paused',
            body:
              'Your local profile signature does not match. This usually means the save was edited outside the game.\n\n' +
              'Single-player gameplay is unaffected — you can keep playing this character normally. However, Steam achievements unlocked from this point on this character have been suspended to protect the integrity of the achievement system for other operatives.\n\n' +
              'If this was unintentional (a browser extension, an out-of-date save migration, an unusual sync), start a new character to restore Steam unlocks. The fix is not undoable on this character.\n\n' +
              '— sys.ops',
          },
          ...inbox,
        ]
      }
    }
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
      inbox: data.inbox ?? [],
      exfilChannel: data.exfilChannel ?? 'direct',
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

// ─── P10 — Branch saves ───────────────────────────────────────────────────────
// Players can bookmark the current state as a branch save before any major
// story choice, then restore later to explore the other path. Branch saves
// share the same SaveData shape and integrity signing as the main save.

const BRANCH_PREFIX = 'voidlink_branch_'

export interface BranchSaveMeta {
  id: string          // bookmark id (timestamp-based)
  handle: string
  label: string
  savedAt: number
  rank: number
  credits: number
  arcProgress?: string // e.g. "Arc 4 in progress" — derived from flags at write time
}

function branchKey(handle: string, id: string) {
  return `${BRANCH_PREFIX}${handle.toLowerCase()}_${id}`
}

function deriveArcProgress(s: ReturnType<typeof useGameStore.getState>): string {
  const flags = s.player?.activeFlags ?? {}
  if (flags.arc8_buyer_list_acquired) return 'Arc 8 LIGHTHOUSE — resolution pending'
  if (flags.arc8_started)             return 'Arc 8 LIGHTHOUSE in progress'
  if (flags.arc7_window_confirmed)    return 'Arc 7 QUIET WAR — resolution pending'
  if (flags.arc7_started)             return 'Arc 7 QUIET WAR in progress'
  if (flags.arc6_magnus_identified)   return 'Arc 6 DEAD DROP — resolution pending'
  if (flags.arc6_started)             return 'Arc 6 DEAD DROP in progress'
  if (typeof flags.arc1_key_choice === 'string') return `Arc 1 resolved (${flags.arc1_key_choice})`
  const mn = s.player?.completedMissions.length ?? 0
  return `${mn} missions completed`
}

export function createBranchSave(label: string): BranchSaveMeta | null {
  try {
    const s = useGameStore.getState()
    if (!s.player) return null
    const id = `bm_${Date.now()}`
    const data: SaveData = {
      version: SAVE_VERSION,
      savedAt: Date.now(),
      player: s.player,
      missions: s.missions.filter((m) => m.status !== 'active'),
      newsFeed: s.newsFeed,
      inbox: s.inbox,
      exfilChannel: s.exfilChannel,
      activeWorldEvents: s.activeWorldEvents,
      nextWorldEventAt: s.nextWorldEventAt,
      activeWindows: s.activeWindows,
      windowLastPositions: s.windowLastPositions,
      windowZCounter: s.windowZCounter,
    }
    const signed = { ...data, [SAVE_INTEGRITY_FIELD]: signSave(data) }
    localStorage.setItem(branchKey(s.player.handle, id), JSON.stringify(signed))
    return {
      id, handle: s.player.handle, label,
      savedAt: Date.now(), rank: s.player.rank, credits: s.player.credits,
      arcProgress: deriveArcProgress(s),
    }
  } catch {
    return null
  }
}

export function listBranchSaves(handle: string): BranchSaveMeta[] {
  const out: BranchSaveMeta[] = []
  const prefix = `${BRANCH_PREFIX}${handle.toLowerCase()}_`
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key || !key.startsWith(prefix)) continue
    try {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      const data = JSON.parse(raw) as SaveData & Record<string, unknown>
      const labelKey = `${BRANCH_PREFIX}label_${key.slice(BRANCH_PREFIX.length)}`
      const label = localStorage.getItem(labelKey) ?? 'Bookmark'
      out.push({
        id: key.slice(prefix.length),
        handle,
        label,
        savedAt: data.savedAt ?? 0,
        rank: data.player?.rank ?? 1,
        credits: data.player?.credits ?? 0,
      })
    } catch { /* ignore corrupt */ }
  }
  return out.sort((a, b) => b.savedAt - a.savedAt)
}

export function setBranchLabel(handle: string, id: string, label: string) {
  localStorage.setItem(`${BRANCH_PREFIX}label_${handle.toLowerCase()}_${id}`, label)
}

export function restoreBranchSave(handle: string, id: string): boolean {
  try {
    const raw = localStorage.getItem(branchKey(handle, id))
    if (!raw) return false
    const parsed = JSON.parse(raw) as SaveData & Record<string, unknown>
    if (!parsed.player) return false
    const integrityOk = !!parsed[SAVE_INTEGRITY_FIELD] && verifySave(parsed)
    const { [SAVE_INTEGRITY_FIELD]: _sig, ...rest } = parsed
    void _sig
    const data: SaveData = rest as SaveData
    if (!integrityOk && data.player) {
      data.player.activeFlags = { ...data.player.activeFlags, save_tampered_at: Date.now() }
    }
    const now = Date.now()
    const restoredWindows = (data.activeWindows ?? []).filter(
      (w) => !MISSION_ONLY_WINDOWS.has(w.id),
    )
    useGameStore.setState((s) => ({
      ...s,
      player: data.player,
      missions: data.missions ?? [],
      newsFeed: data.newsFeed ?? [],
      inbox: data.inbox ?? [],
      exfilChannel: data.exfilChannel ?? 'direct',
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
    // Persist the restored state to the main save key so subsequent autosaves
    // continue from the bookmark.
    saveGame()
    return true
  } catch {
    return false
  }
}

export function deleteBranchSave(handle: string, id: string): void {
  localStorage.removeItem(branchKey(handle, id))
  localStorage.removeItem(`${BRANCH_PREFIX}label_${handle.toLowerCase()}_${id}`)
}
