import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { PlayerProfile, Mission, Network, TraceState, NetworkArchetype, HardwareDefinition, ToolDefinition } from '@uplink/core'
import { createTraceState, tickTrace, generateNetwork, escapeTrace } from '@uplink/core'

export type Screen = 'boot' | 'login' | 'desktop'

export interface RivalHacker {
  handle: string
  currentNodeId: string
  spawnedAt: number
  nextMoveAt: number
}

export interface WindowState {
  id: string
  title: string
  component: string
  x: number
  y: number
  width: number
  height: number
  isMinimized: boolean
  zOrder: number
}

export interface TerminalLine {
  id: string
  type: string
  text: string
}

interface GameState {
  screen: Screen
  player: PlayerProfile | null
  activeWindows: WindowState[]
  focusedWindowId: string | null
  windowZCounter: number
  missions: Mission[]
  networks: Record<string, Network>
  activeMissionId: string | null
  activeNetworkId: string | null
  selectedNodeId: string | null
  traceState: TraceState | null
  rivalHacker: RivalHacker | null
  rivalSpawnAt: number | null
  terminalLines: TerminalLine[]
  missionResult: 'success' | 'fail' | null
}

interface GameActions {
  setScreen: (screen: Screen) => void
  setPlayer: (player: PlayerProfile) => void
  openWindow: (win: Omit<WindowState, 'zOrder'>) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  loadMissions: (missions: Mission[]) => void
  acceptMission: (missionId: string) => void
  loadNetwork: (network: Network) => void
  selectNode: (nodeId: string | null) => void
  breachNode: (networkId: string, nodeId: string) => void
  collectFile: (networkId: string, nodeId: string, fileId: string) => void
  executeMissionObjective: (networkId: string, nodeId: string) => void
  disconnect: () => void
  completeMission: (success: boolean) => void
  buyHardware: (item: HardwareDefinition) => 'ok' | 'insufficient_funds' | 'already_owned'
  buyTool: (item: ToolDefinition) => 'ok' | 'insufficient_funds' | 'already_owned'
  interceptRival: () => void
  tickGameLoop: (deltaMs: number) => void
  logTerminal: (text: string, type?: string) => void
}

export const useGameStore = create<GameState & GameActions>()(
  immer((set) => ({
    screen: 'boot',
    player: null,
    activeWindows: [],
    focusedWindowId: null,
    windowZCounter: 100,
    missions: [],
    networks: {},
    activeMissionId: null,
    activeNetworkId: null,
    selectedNodeId: null,
    traceState: null,
    rivalHacker: null,
    rivalSpawnAt: null,
    terminalLines: [],
    missionResult: null,

    setScreen: (screen) => set((s) => { s.screen = screen }),

    setPlayer: (player) => set((s) => { s.player = player }),

    openWindow: (win) =>
      set((s) => {
        const existing = s.activeWindows.find((w: WindowState) => w.id === win.id)
        if (existing) {
          existing.isMinimized = false
          existing.zOrder = ++s.windowZCounter
          s.focusedWindowId = win.id
          return
        }
        s.windowZCounter++
        s.activeWindows.push({ ...win, zOrder: s.windowZCounter } as WindowState)
        s.focusedWindowId = win.id
      }),

    closeWindow: (id) =>
      set((s) => {
        s.activeWindows = s.activeWindows.filter((w: WindowState) => w.id !== id)
        if (s.focusedWindowId === id) {
          const top = s.activeWindows.reduce<WindowState | null>(
            (best: WindowState | null, w: WindowState) =>
              (!best || w.zOrder > best.zOrder ? w : best),
            null,
          )
          s.focusedWindowId = top?.id ?? null
        }
      }),

    focusWindow: (id) =>
      set((s) => {
        const win = s.activeWindows.find((w: WindowState) => w.id === id)
        if (win) {
          win.zOrder = ++s.windowZCounter
          s.focusedWindowId = id
        }
      }),

    minimizeWindow: (id) =>
      set((s) => {
        const win = s.activeWindows.find((w: WindowState) => w.id === id)
        if (win) win.isMinimized = true
        if (s.focusedWindowId === id) s.focusedWindowId = null
      }),

    loadMissions: (missions) => set((s) => { s.missions = missions }),

    acceptMission: (missionId) =>
      set((s) => {
        const mission = s.missions.find((m: Mission) => m.id === missionId)
        if (!mission) return
        mission.status = 'active'
        mission.assignedTo = s.player?.id
        mission.startedAt = Date.now()
        s.activeMissionId = missionId
        s.missionResult = null

        const seed = (Math.random() * 0xffffffff) | 0
        const network = generateNetwork(mission.targetNetworkId as NetworkArchetype, 'target', seed)

        // Seed mission-specific targets into the generated network
        if (mission.type === 'file_theft' || mission.type === 'corporate_espionage') {
          const fileServer = network.nodes.find((n) => n.type === 'file_server')
          if (fileServer) {
            fileServer.files.push({
              id: `file_target_${seed}`,
              name: mission.type === 'corporate_espionage' ? 'corp_intel_package.enc' : 'classified_data.enc',
              sizeKb: 512,
              isEncrypted: true,
              isLog: false,
              missionObjective: missionId,
            })
          }
        } else if (mission.type === 'evidence_planting') {
          const fileServer = network.nodes.find((n) => n.type === 'file_server')
          if (fileServer) {
            fileServer.files.push({
              id: `file_plant_${seed}`,
              name: 'audit_log_modified.enc',
              sizeKb: 128,
              isEncrypted: false,
              isLog: true,
              missionObjective: missionId,
            })
          }
        }

        s.networks[network.id] = network
        s.activeNetworkId = network.id
        s.traceState = createTraceState(network.traceSpeed)
      }),

    loadNetwork: (network) => set((s) => { s.networks[network.id] = network }),

    selectNode: (nodeId) => set((s) => { s.selectedNodeId = nodeId }),

    breachNode: (networkId, nodeId) =>
      set((s) => {
        const network = s.networks[networkId]
        if (!network) return
        const node = network.nodes.find((n) => n.id === nodeId)
        if (!node) return
        node.isBreached = true
        if (s.traceState) {
          s.traceState.level = Math.min(100, s.traceState.level + 10)
        }
        // bounty_hunt objective: breach the entry_point
        if (s.activeMissionId) {
          const mission = s.missions.find((m: Mission) => m.id === s.activeMissionId)
          if (mission?.type === 'bounty_hunt' && node.type === 'entry_point') {
            const obj = mission.objectives.find((o) => !o.isOptional && !o.isCompleted)
            if (obj) obj.isCompleted = true
          }
        }
      }),

    collectFile: (networkId, nodeId, fileId) =>
      set((s) => {
        const network = s.networks[networkId]
        if (!network) return
        const node = network.nodes.find((n) => n.id === nodeId)
        if (!node) return
        const fileIdx = node.files.findIndex((f) => f.id === fileId)
        if (fileIdx === -1) return
        const file = node.files[fileIdx]
        node.files.splice(fileIdx, 1)

        // Check if this satisfies a mission objective
        if (file.missionObjective && s.activeMissionId === file.missionObjective) {
          const mission = s.missions.find((m: Mission) => m.id === s.activeMissionId)
          if (mission) {
            const obj = mission.objectives.find((o) => !o.isOptional && !o.isCompleted)
            if (obj) obj.isCompleted = true
          }
        }

        if (s.player) {
          s.player.credits += 0 // file transfer — reward comes at mission completion
        }
      }),

    executeMissionObjective: (networkId, nodeId) =>
      set((s) => {
        if (!s.activeMissionId) return
        const mission = s.missions.find((m: Mission) => m.id === s.activeMissionId)
        if (!mission) return
        const network = s.networks[networkId]
        if (!network) return
        const node = network.nodes.find((n) => n.id === nodeId)
        if (!node?.isBreached) return

        const valid =
          (mission.type === 'account_deletion' && node.type === 'database') ||
          (mission.type === 'database_corruption' && node.type === 'database') ||
          (mission.type === 'network_sabotage' && (node.type === 'router' || node.type === 'admin_console'))

        if (!valid) return

        const obj = mission.objectives.find((o) => !o.isOptional && !o.isCompleted)
        if (obj) obj.isCompleted = true
      }),

    disconnect: () =>
      set((s) => {
        const mission = s.missions.find((m: Mission) => m.id === s.activeMissionId)
        const allObjectivesDone = mission?.objectives
          .filter((o) => !o.isOptional)
          .every((o) => o.isCompleted) ?? false

        if (s.traceState && s.traceState.level >= 100) {
          if (mission) mission.status = 'failed'
          s.missionResult = 'fail'
          if (s.player) s.player.stats.traceFailures++
        } else if (allObjectivesDone && mission) {
          mission.status = 'completed'
          mission.completedAt = Date.now()
          if (s.player) {
            s.player.credits += mission.reward.credits
            s.player.reputation += mission.reward.reputation
            s.player.stats.successfulBreaches++
            s.player.stats.totalMissions++
            s.player.completedMissions.push(mission.id)
          }
          s.missionResult = 'success'
        } else {
          // Abandoned — no reward, no penalty
          if (mission) mission.status = 'failed'
          s.missionResult = 'fail'
        }

        if (s.traceState) s.traceState = escapeTrace(s.traceState)
        s.activeMissionId = null
        s.activeNetworkId = null
        s.selectedNodeId = null
        s.traceState = null
        s.rivalHacker = null
        s.rivalSpawnAt = null
      }),

    completeMission: (success) =>
      set((s) => {
        const mission = s.missions.find((m: Mission) => m.id === s.activeMissionId)
        if (!mission) return
        mission.status = success ? 'completed' : 'failed'
        mission.completedAt = Date.now()

        if (success && s.player) {
          s.player.credits += mission.reward.credits
          s.player.reputation += mission.reward.reputation
          s.player.stats.successfulBreaches++
          s.player.completedMissions.push(mission.id)
        } else if (!success && s.player) {
          s.player.stats.traceFailures++
        }

        s.missionResult = success ? 'success' : 'fail'
        s.activeMissionId = null
        s.activeNetworkId = null
        s.selectedNodeId = null
        s.traceState = null
      }),

    buyHardware: (item) => {
      let result: 'ok' | 'insufficient_funds' | 'already_owned' = 'ok'
      set((s) => {
        if (!s.player) { result = 'insufficient_funds'; return }
        if (s.player.credits < item.price) { result = 'insufficient_funds'; return }
        const key = item.slot as keyof typeof s.player.hardware
        if ((s.player.hardware[key] as number) >= item.tier * 2) {
          result = 'already_owned'; return
        }
        s.player.credits -= item.price
        ;(s.player.hardware[key] as number) += item.statBoost[item.slot] ?? 1
        s.player.stats.creditsSpent += item.price
      })
      return result
    },

    buyTool: (item) => {
      let result: 'ok' | 'insufficient_funds' | 'already_owned' = 'ok'
      set((s) => {
        if (!s.player) { result = 'insufficient_funds'; return }
        if (s.player.credits < item.unlockPrice) { result = 'insufficient_funds'; return }
        const allTools = [
          ...s.player.software.passwordCrackers,
          ...s.player.software.proxies,
          ...s.player.software.logDeleters,
          ...s.player.software.portScanners,
          ...s.player.software.firewallBypassers,
          ...s.player.software.misc,
        ]
        if (allTools.some((t) => t.toolId === item.id)) {
          result = 'already_owned'; return
        }
        s.player.credits -= item.unlockPrice
        s.player.stats.creditsSpent += item.unlockPrice
        const toolInstance = { toolId: item.id, level: 1, version: '1.0' }
        switch (item.category) {
          case 'password':  s.player.software.passwordCrackers.push(toolInstance); break
          case 'proxy':     s.player.software.proxies.push(toolInstance); break
          case 'log':       s.player.software.logDeleters.push(toolInstance); break
          case 'port_scanner': s.player.software.portScanners.push(toolInstance); break
          case 'firewall':  s.player.software.firewallBypassers.push(toolInstance); break
          default:          s.player.software.misc.push(toolInstance); break
        }
      })
      return result
    },

    interceptRival: () =>
      set((s) => {
        if (!s.rivalHacker) return
        s.rivalHacker = null
        s.rivalSpawnAt = null
        if (s.player) s.player.stats.traceEscapes++
      }),

    tickGameLoop: (deltaMs) =>
      set((s) => {
        if (!s.traceState) return

        // Rival hacker: spawn after random delay, then move every ~6s
        const now = Date.now()
        if (s.activeMissionId && !s.rivalHacker && !s.rivalSpawnAt) {
          // Schedule spawn 20-40s after mission start
          const mission = s.missions.find((m: Mission) => m.id === s.activeMissionId)
          const missionAge = mission?.startedAt ? now - mission.startedAt : 0
          if (missionAge > 5000) {
            s.rivalSpawnAt = now + 20000 + Math.random() * 20000
          }
        }
        if (s.rivalSpawnAt && !s.rivalHacker && now >= s.rivalSpawnAt && s.activeNetworkId) {
          const network = s.networks[s.activeNetworkId]
          if (network && network.nodes.length > 0) {
            const idx = Math.floor(Math.random() * network.nodes.length)
            const handles = ['GHOST_7731', 'NULL_PTR', 'D3ADFACE', 'CRYPTOVIPER', 'R00TKIT']
            s.rivalHacker = {
              handle: handles[Math.floor(Math.random() * handles.length)],
              currentNodeId: network.nodes[idx].id,
              spawnedAt: now,
              nextMoveAt: now + 5000 + Math.random() * 3000,
            }
            s.rivalSpawnAt = null
          }
        }
        if (s.rivalHacker && s.activeNetworkId) {
          // Move to adjacent node periodically
          if (now >= s.rivalHacker.nextMoveAt) {
            const network = s.networks[s.activeNetworkId]
            const currentNode = network?.nodes.find((n) => n.id === s.rivalHacker!.currentNodeId)
            if (currentNode && currentNode.connectedTo.length > 0) {
              const nextId = currentNode.connectedTo[Math.floor(Math.random() * currentNode.connectedTo.length)]
              s.rivalHacker.currentNodeId = nextId
            }
            s.rivalHacker.nextMoveAt = now + 5000 + Math.random() * 3000
          }
          // Auto-expire after 90s (leaves on their own)
          if (now - s.rivalHacker.spawnedAt > 90000) {
            s.rivalHacker = null
          }
        }

        // Rival boosts trace speed by 50%
        const effectiveDelta = s.rivalHacker ? deltaMs * 1.5 : deltaMs
        s.traceState = tickTrace(s.traceState, effectiveDelta)

        // Auto-fail if traced
        if (s.traceState.level >= 100 && s.traceState.status !== 'traced') {
          if (s.activeMissionId) {
            const mission = s.missions.find((m: Mission) => m.id === s.activeMissionId)
            if (mission) mission.status = 'failed'
          }
          s.missionResult = 'fail'
          s.activeNetworkId = null
          s.selectedNodeId = null
        }

        // Check mission objectives completion
        if (s.activeMissionId) {
          const mission = s.missions.find((m: Mission) => m.id === s.activeMissionId)
          if (mission) {
            const allDone = mission.objectives
              .filter((o) => !o.isOptional)
              .every((o) => o.isCompleted)
            if (allDone && mission.status === 'active') {
              mission.status = 'completed'
              mission.completedAt = Date.now()
              if (s.player) {
                s.player.credits += mission.reward.credits
                s.player.reputation += mission.reward.reputation
                s.player.stats.successfulBreaches++
                s.player.completedMissions.push(mission.id)
                s.player.stats.totalMissions++
              }
              s.missionResult = 'success'
              s.activeMissionId = null
              s.activeNetworkId = null
              s.selectedNodeId = null
              s.traceState = null
            }
          }
        }
      }),

    logTerminal: (text, type = 'output') =>
      set((s) => {
        s.terminalLines.push({
          id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
          type,
          text,
        })
        if (s.terminalLines.length > 500) s.terminalLines.splice(0, 100)
      }),
  })),
)
