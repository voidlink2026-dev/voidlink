import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Settings {
  musicEnabled: boolean
  musicVolume: number       // 0–1
  sfxEnabled: boolean
  sfxVolume: number         // 0–1
  theme: 'dark' | 'light'
  reducedMotion: boolean
  showFps: boolean
  uiScale: number           // 0.8–1.5 — applied as CSS zoom on root
  disableSplashCards: boolean  // M14q Sub-sprint E
}

interface SettingsActions {
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
}

const defaults: Settings = {
  musicEnabled: true,
  musicVolume: 0.65,
  sfxEnabled: true,
  sfxVolume: 0.75,
  theme: 'dark',
  reducedMotion: false,
  showFps: false,
  uiScale: 1.0,
  disableSplashCards: false,
}

export const useSettingsStore = create<Settings & SettingsActions>()(
  persist(
    (set) => ({
      ...defaults,
      setSetting: (key, value) => set({ [key]: value } as Partial<Settings>),
    }),
    { name: 'voidlink-settings' },
  ),
)
