import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { PlayerProfile, BounceNode, FactionData, Mission, MissionObjective, Network, NetworkNode, SecurityTier, TraceState, NetworkArchetype, HardwareDefinition, ToolDefinition, StoryMission, Specialization } from '@voidlink/core'
import { createTraceState, tickTrace, triggerBreachAlarm, generateNetwork, escapeTrace, RANK_THRESHOLDS, levelFromXp, missionXpReward, getBank, getStock, STOCKS, getConsumable } from '@voidlink/core'
import { saveGame, clearActiveSession } from './persistence.ts'

// ── M14m helper ──────────────────────────────────────────────────────────────
// Advance a multi-phase mission if the current phase's non-optional objectives
// are all complete. Returns true if a phase actually advanced.
// Designed to be called from within a set() callback where the draft is mutated directly.
function tryAdvanceMissionPhase(mission: Mission, draft: { terminalLines: Array<{ id: string; type: string; text: string }>; player: PlayerProfile | null }): boolean {
  if (!mission.phases || mission.phases.length === 0) return false
  const idx = mission.currentPhaseIndex ?? 0
  const phase = mission.phases[idx]
  if (!phase) return false
  // Phase objectives live in mission.objectives by id; check primaries done
  const phaseObjs = phase.objectives
    .map((po) => mission.objectives.find((o) => o.id === po.id))
    .filter((o): o is MissionObjective => !!o)
  const allDone = phaseObjs.filter((o) => !o.isOptional).every((o) => o.isCompleted)
  if (!allDone) return false
  if (idx >= mission.phases.length - 1) return false  // already on final phase

  // M14o: if this phase has choices, pause for the player to decide before advancing
  if (phase.choices && phase.choices.length > 0 && !mission.takenChoices?.[idx]) {
    mission.pendingChoiceFromPhaseIndex = idx
    draft.terminalLines.push({
      id: `log_phase_choice_${mission.id}_${idx}_${Date.now()}`,
      type: 'system',
      text: `▶ PHASE ${idx + 1} COMPLETE — choose your next move.`,
    })
    return false  // pause; the next phase will advance when the player picks a choice
  }

  const nextIdx = idx + 1
  mission.currentPhaseIndex = nextIdx
  const next = mission.phases[nextIdx]
  for (const po of next.objectives) {
    if (!mission.objectives.some((o) => o.id === po.id)) {
      mission.objectives.push({ ...po, isCompleted: false })
    }
  }
  draft.terminalLines.push({
    id: `log_phase_${mission.id}_${nextIdx}_${Date.now()}`,
    type: 'success',
    text: `▶ PHASE ${nextIdx + 1} — ${next.label.toUpperCase()}: ${next.description}`,
  })
  // Per-phase reward
  if (phase.phaseReward && draft.player) {
    const cr = phase.phaseReward.credits ?? 0
    const rp = phase.phaseReward.reputation ?? 0
    draft.player.credits += cr
    draft.player.stats.creditsEarned += cr
    draft.player.reputation += rp
    if (cr || rp) {
      draft.terminalLines.push({
        id: `log_phase_pay_${Date.now()}`,
        type: 'success',
        text: `Phase reward: +${cr.toLocaleString()} Cr · +${rp} REP`,
      })
    }
  }
  // Queue news echo if defined for the just-completed phase
  if (mission.newsEchoes && mission.newsEchoes[idx]) {
    if (!mission.narrativeFlags) mission.narrativeFlags = {}
    mission.narrativeFlags[`news_echo_pending_${idx}`] = Date.now() + ((mission.newsEchoes[idx].delaySeconds ?? 0) * 1000)
  }
  return true
}

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

export interface NewsItem {
  id: string
  timestamp: number
  headline: string
  body: string
  category: 'corporate' | 'crime' | 'tech' | 'player'
  isPlayerAction: boolean
}

export interface CredentialEntry {
  id: string
  sourceNodeId: string
  sourceNodeType: string
  sourceLabel: string      // human-readable: "ADMIN CONSOLE CREDENTIALS"
  method: 'dump' | 'scrape'
  targetNodeId?: string    // scrape only — the specific node these creds unlock
  targetLabel?: string     // scrape only — display name of target
  networkId: string
  expiresAt: number        // unix ms — cleared on disconnect
}

export type WorldEventEffect =
  | { type: 'trace_rate_delta'; delta: number }
  | { type: 'shop_discount'; pct: number }
  | { type: 'reward_boost'; mult: number }
  | { type: 'rival_frequency'; mult: number }
  | { type: 'market_crash' }  // M14e — stock prices crash 25%, savings APR zeroed

export interface WorldEvent {
  id: string
  name: string
  shortLabel: string
  description: string
  effect: WorldEventEffect
  endsAt: number
}

const WORLD_EVENT_CATALOGUE: Omit<WorldEvent, 'id' | 'endsAt'>[] = [
  {
    name: 'Ghost Protocol',
    shortLabel: 'GHOST',
    description: 'Global surveillance networks running below capacity. Trace speed reduced.',
    effect: { type: 'trace_rate_delta', delta: -0.5 },
  },
  {
    name: 'Grid Blackout',
    shortLabel: 'BLACKOUT',
    description: 'Rolling power cuts affecting corporate data centres. Defences weakened.',
    effect: { type: 'trace_rate_delta', delta: -0.8 },
  },
  {
    name: 'Interpol Sweep',
    shortLabel: 'SWEEP',
    description: 'Automated Interpol tracking is active worldwide. Trace speed elevated.',
    effect: { type: 'trace_rate_delta', delta: 1.0 },
  },
  {
    name: 'Data Broker Sale',
    shortLabel: 'SALE',
    description: 'Voidlink market correction — all tools and hardware 20% off.',
    effect: { type: 'shop_discount', pct: 0.2 },
  },
  {
    name: 'Open Season',
    shortLabel: 'OPEN SEASON',
    description: 'Rival crews are unusually active tonight. Expect company.',
    effect: { type: 'rival_frequency', mult: 2.5 },
  },
  {
    name: 'High-Value Contracts',
    shortLabel: 'HIGH VALUE',
    description: 'Client demand surge — all mission payouts doubled.',
    effect: { type: 'reward_boost', mult: 2.0 },
  },
  {
    name: 'Quiet Shift',
    shortLabel: 'QUIET',
    description: 'Night ops — security staff at minimum. Trace nearly silent.',
    effect: { type: 'trace_rate_delta', delta: -1.2 },
  },
  {
    name: 'Market Crash',
    shortLabel: 'CRASH',
    description: 'Global financial markets in freefall. All stocks down sharply, savings APR zeroed for the duration.',
    effect: { type: 'market_crash' },
  },
]

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
  newsFeed: NewsItem[]
  activeWorldEvents: WorldEvent[]
  nextWorldEventAt: number | null
  missionResult: 'success' | 'fail' | 'abandoned' | null
  pendingSpecialization: boolean
  activeRoute: string[] // ordered bounce node IDs (outermost first)
  credentialCache: CredentialEntry[]
  windowLastPositions: Record<string, { x: number; y: number; width: number; height: number }>
  activeBankId: string | null  // currently-viewed bank in BankWindow
  activeTargetInfoId: string | null  // currently-viewed Corp/Gov/Underground in TargetInfoWindow
  connectingUntil: number | null    // unix ms — while now < connectingUntil, trace accumulation is paused
                                    // (gives the ConnectionEffect animation time to play without burning the player)
  // Currency market: 1 Darkcoin = N credits — fluctuates over time
  darkcoinExchangeRate: number
  // Stock prices: keyed by stock id, current price in Cr — fluctuate over time
  stockPrices: Record<string, number>
  // Internal: last time market simulation ran (for tick deltas)
  lastMarketTickAt: number
}

interface GameActions {
  setScreen: (screen: Screen) => void
  setPlayer: (player: PlayerProfile) => void
  openWindow: (win: Omit<WindowState, 'zOrder'>) => void
  saveWindowPosition: (id: string, x: number, y: number, width: number, height: number) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  loadMissions: (missions: Mission[]) => void
  acceptMission: (missionId: string) => void
  chooseMissionOption: (choiceId: string) => 'ok' | 'no_pending_choice'
  loadNetwork: (network: Network) => void
  selectNode: (nodeId: string | null) => void
  scanNode: (networkId: string, nodeId: string) => void
  breachNode: (networkId: string, nodeId: string) => void
  collectFile: (networkId: string, nodeId: string, fileId: string) => void
  wipeNodeLog: (networkId: string, nodeId: string) => void
  executeMissionObjective: (networkId: string, nodeId: string) => void
  disconnect: () => void
  completeMission: (success: boolean) => void
  buyHardware: (item: HardwareDefinition) => 'ok' | 'insufficient_funds' | 'already_owned'
  buyTool: (item: ToolDefinition) => 'ok' | 'insufficient_funds' | 'already_owned'
  buyConsumable: (id: string, qty?: number) => 'ok' | 'insufficient_funds' | 'unknown' | 'max_stack'
  useConsumable: (id: string) => 'ok' | 'no_stock' | 'not_applicable'
  interceptRival: () => void
  setPlayerFlag: (key: string, value: boolean | string | number) => void
  addNewsItem: (item: Omit<NewsItem, 'id' | 'timestamp'>) => void
  loadInitialNews: () => void
  resolveArc1Choice: (choice: 'upload' | 'destroy' | 'sell') => void
  resetWindowLayout: () => void
  chooseSpecialization: (spec: Specialization) => void
  setBounceRoute: (nodeIds: string[]) => void
  addBounceNode: (node: BounceNode) => void
  removeBounceNode: (nodeId: string) => void
  wipeBounceNode: (nodeId: string) => void
  dumpCredentials: (networkId: string, nodeId: string) => 'ok' | 'not_breached' | 'already_dumped'
  scrapeMemory: (networkId: string, nodeId: string) => CredentialEntry | null
  useCredential: (networkId: string, nodeId: string) => 'ok' | 'no_credential'
  applyExploitEffects: (networkId: string, nodeId: string, protocol: string) => void
  triggerNodeLockout: (networkId: string, nodeId: string) => void
  recordFailedCrack: (networkId: string, nodeId: string) => void
  createFaction: (name: string, tag: string, description: string) => 'ok' | 'insufficient_funds' | 'rank_required' | 'already_in_faction'
  leaveFaction: () => void
  openBankAccount: (bankId: string) => 'ok' | 'insufficient_funds' | 'already_open' | 'unknown_bank'
  bankDeposit: (bankId: string, amount: number) => 'ok' | 'insufficient_funds' | 'no_account'
  bankWithdraw: (bankId: string, amount: number) => 'ok' | 'insufficient_balance' | 'no_account'
  tickBankInterest: () => void
  setActiveBank: (bankId: string | null) => void
  setActiveTargetInfo: (targetId: string | null) => void
  takeLoan: (bankId: string, amount: number) => 'ok' | 'no_account' | 'over_limit' | 'has_loan' | 'no_loans_at_bank'
  repayLoan: (bankId: string, amount: number) => 'ok' | 'no_account' | 'no_loan' | 'insufficient_funds'
  tradeCurrency: (direction: 'buy_dc' | 'sell_dc', amountCr: number) => 'ok' | 'insufficient_funds'
  buyStock: (stockId: string, shares: number) => 'ok' | 'insufficient_funds' | 'invalid_amount'
  sellStock: (stockId: string, shares: number) => 'ok' | 'insufficient_shares' | 'invalid_amount'
  tickMarket: () => void
  tickGameLoop: (deltaMs: number) => void
  logTerminal: (text: string, type?: string) => void
  logout: () => void
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
    newsFeed: [],
    activeWorldEvents: [],
    nextWorldEventAt: null,
    missionResult: null,
    pendingSpecialization: false,
    activeRoute: [],
    credentialCache: [],
    windowLastPositions: {},
    activeBankId: null,
    activeTargetInfoId: null,
    connectingUntil: null,
    darkcoinExchangeRate: 142,
    stockPrices: { ARMR: 245, ARES: 612, INTC: 88, GTBK: 178 },
    lastMarketTickAt: Date.now(),

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
        // Restore last known position/size, BUT clamp to current viewport so a
        // window saved at a position that's now off-screen (different display
        // size, UI scale changed, etc.) is always visible when reopened.
        const saved = s.windowLastPositions[win.id]
        let x = win.x, y = win.y, width = win.width, height = win.height
        if (saved) { x = saved.x; y = saved.y; width = saved.width; height = saved.height }
        if (typeof window !== 'undefined') {
          const vw = window.innerWidth
          const vh = window.innerHeight - 40  // taskbar height
          // Keep at least 80px of the title bar visible
          x = Math.max(0, Math.min(vw - 80, x))
          y = Math.max(0, Math.min(vh - 40, y))
          width = Math.min(width, vw)
          height = Math.min(height, vh)
        }
        s.windowZCounter++
        s.activeWindows.push({ ...win, x, y, width, height, zOrder: s.windowZCounter } as WindowState)
        s.focusedWindowId = win.id
      }),

    saveWindowPosition: (id, x, y, width, height) =>
      set((s) => {
        s.windowLastPositions[id] = { x, y, width, height }
        // Also update the live window state so saveGame() picks up the new size/pos
        const win = s.activeWindows.find((w) => w.id === id)
        if (win) {
          win.x = x; win.y = y; win.width = width; win.height = height
        }
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
          win.isMinimized = false  // un-minimise on focus
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
        // Connection-effect grace period: pause time-based trace accumulation
        // until the dial-up animation finishes (~3.5s). Per-action spikes still apply.
        s.connectingUntil = Date.now() + 3500
        s.activeMissionId = missionId
        s.missionResult = null

        const isStory = (mission as StoryMission).isStory === true
        const seed = (Math.random() * 0xffffffff) | 0
        const corpId = mission.briefing.clientHandle
        const network: Network = isStory
          ? (mission as StoryMission).network
          : generateNetwork(mission.targetNetworkId as NetworkArchetype, corpId, seed)

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
        }

        if (mission.type === 'bounty_hunt') {
          // Find a non-entry endpoint to serve as the bounty target
          const endpointNodes = network.nodes.filter(
            (n) => n.type === 'endpoint',
          )
          const targetNode = endpointNodes.length > 0
            ? endpointNodes[Math.floor(endpointNodes.length / 2)] // pick middle depth
            : network.nodes.find((n) => n.type !== 'entry_point') ?? network.nodes[network.nodes.length - 1]
          if (targetNode) {
            targetNode.label = `TARGET — ${mission.briefing.clientHandle}`
            if (!mission.narrativeFlags) mission.narrativeFlags = {}
            mission.narrativeFlags.bounty_target_node_id = targetNode.id
            const obj = mission.objectives.find((o) => !o.isOptional)
            if (obj) {
              obj.description = `Locate and breach the target endpoint: ${targetNode.label}`
            }
          }
        }

        if (mission.type === 'account_deletion' || mission.type === 'database_corruption') {
          const hasDatabase = network.nodes.some((n) => n.type === 'database')
          if (!hasDatabase) {
            const connectTo = network.nodes.find((n) => n.type !== 'entry_point') ?? network.nodes[network.nodes.length - 1]
            const dbTier = Math.min(5, mission.difficulty + 1) as SecurityTier
            const dbNode: NetworkNode = {
              id: `node_${seed}_db`,
              type: 'database',
              label: 'CORP DATABASE',
              securityTier: dbTier,
              isBreached: false,
              isScanned: false,
              isActive: true,
              isLogWiped: false,
              services: [{ protocol: 'SQL', port: 1433, version: '14.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2024-0001' }],
              files: [],
              connectedTo: connectTo ? [connectTo.id] : [],
              position: { x: (connectTo?.position.x ?? 0) + 2, y: connectTo?.position.y ?? 0 },
            }
            network.nodes.push(dbNode)
            if (connectTo) connectTo.connectedTo.push(dbNode.id)
          }
        }

        // Sabotage needs a router (or admin_console) — inject one if absent
        if (mission.type === 'network_sabotage') {
          const hasSabotageTarget = network.nodes.some((n) => n.type === 'router' || n.type === 'admin_console')
          if (!hasSabotageTarget) {
            const connectTo = network.nodes.find((n) => n.type !== 'entry_point') ?? network.nodes[network.nodes.length - 1]
            const rtrTier = Math.min(5, mission.difficulty + 1) as SecurityTier
            const routerNode: NetworkNode = {
              id: `node_${seed}_rtr`,
              type: 'router',
              label: 'CORE ROUTER',
              securityTier: rtrTier,
              isBreached: false,
              isScanned: false,
              isActive: true,
              isLogWiped: false,
              services: [{ protocol: 'Telnet', port: 23, version: '2.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2018-9866' }],
              files: [],
              connectedTo: connectTo ? [connectTo.id] : [],
              position: { x: (connectTo?.position.x ?? 0) + 2, y: connectTo?.position.y ?? 0 },
            }
            network.nodes.push(routerNode)
            if (connectTo) connectTo.connectedTo.push(routerNode.id)
          }
        }

        s.networks[network.id] = network
        s.activeNetworkId = network.id
        s.traceState = createTraceState(network.traceSpeed)

        // Wire active bounce route into trace state
        const routeLen = s.activeRoute.length
        s.traceState.hopsRemaining = routeLen
        s.traceState.totalHops = routeLen

        // Apply heat penalty if player left dirty logs on this corp before
        if (s.player?.activeFlags[`heat_${corpId}`]) {
          s.traceState.baseRate += 2.0
          s.terminalLines.push({
            id: `log_heat_${Date.now()}`,
            type: 'error',
            text: `WARNING: ${corpId} network is on heightened alert — previous intrusion detected. Trace speed +2.0%/s.`,
          })
        }

        // Apply corp patching: if enough real time has passed since breach detection, CVEs are gone
        const PATCH_WINDOW_MS = 3 * 60_000 // 3 real-time minutes = "3 in-game days"
        const patchTimestamp = s.player?.activeFlags[`patch_${corpId}`]
        if (typeof patchTimestamp === 'number') {
          const elapsed = Date.now() - patchTimestamp
          if (elapsed >= PATCH_WINDOW_MS) {
            let patchedCount = 0
            for (const node of network.nodes) {
              for (const svc of node.services) {
                if (svc.hasKnownVulnerability) {
                  svc.hasKnownVulnerability = false
                  svc.vulnerabilityId = undefined
                  patchedCount++
                }
              }
            }
            if (s.player) delete s.player.activeFlags[`patch_${corpId}`]
            if (patchedCount > 0) {
              s.terminalLines.push({
                id: `log_patch_${Date.now()}`,
                type: 'warn',
                text: `NOTICE: ${corpId} has patched ${patchedCount} known CVE${patchedCount !== 1 ? 's' : ''} since your last intrusion. Expect hardened defences.`,
              })
            }
          } else {
            const minsLeft = Math.ceil((PATCH_WINDOW_MS - elapsed) / 60_000)
            s.terminalLines.push({
              id: `log_patch_pending_${Date.now()}`,
              type: 'warn',
              text: `NOTE: ${corpId} is actively patching from previous breach. Estimated ${minsLeft} day${minsLeft !== 1 ? 's' : ''} until patch cycle completes.`,
            })
          }
        }
      }),

    // M14o: pick a choice presented by a pending phase
    chooseMissionOption: (choiceId) => {
      let result: 'ok' | 'no_pending_choice' = 'ok'
      set((s) => {
        const mission = s.missions.find((m) => m.id === s.activeMissionId)
        if (!mission || mission.pendingChoiceFromPhaseIndex === undefined) { result = 'no_pending_choice'; return }
        const fromIdx = mission.pendingChoiceFromPhaseIndex
        const phase = mission.phases?.[fromIdx]
        if (!phase?.choices) { result = 'no_pending_choice'; return }
        const choice = phase.choices.find((c) => c.id === choiceId)
        if (!choice) { result = 'no_pending_choice'; return }

        // Apply choice effects
        if (choice.effects) {
          if (choice.effects.repDelta && s.player) {
            s.player.reputation = Math.max(0, s.player.reputation + choice.effects.repDelta)
          }
          if (choice.effects.factionDeltas && s.player) {
            for (const [fid, delta] of Object.entries(choice.effects.factionDeltas)) {
              const fs = s.player.factionStandings.find((f) => f.factionId === fid)
              if (fs) fs.score += delta
            }
          }
          if (choice.effects.setFlag && s.player) {
            s.player.activeFlags[choice.effects.setFlag.flag] = choice.effects.setFlag.value
          }
        }
        // Record the choice
        if (!mission.takenChoices) mission.takenChoices = {}
        mission.takenChoices[fromIdx] = choiceId
        // Determine next phase
        const nextIdx = choice.nextPhaseIndex ?? (fromIdx + 1)
        if (nextIdx >= (mission.phases?.length ?? 0)) {
          // Choice ended the mission — all objectives auto-marked complete to allow disconnect
          mission.objectives.forEach((o) => { if (!o.isOptional) o.isCompleted = true })
          s.terminalLines.push({
            id: `log_choice_end_${Date.now()}`, type: 'success',
            text: `Choice taken: "${choice.label}". Mission concluded.`,
          })
        } else {
          mission.currentPhaseIndex = nextIdx
          const next = mission.phases![nextIdx]
          for (const po of next.objectives) {
            if (!mission.objectives.some((o) => o.id === po.id)) {
              mission.objectives.push({ ...po, isCompleted: false })
            }
          }
          s.terminalLines.push({
            id: `log_choice_${Date.now()}`, type: 'success',
            text: `Choice taken: "${choice.label}". ▶ Advancing to phase ${nextIdx + 1} — ${next.label.toUpperCase()}.`,
          })
        }
        mission.pendingChoiceFromPhaseIndex = undefined
      })
      return result
    },

    loadNetwork: (network) => set((s) => { s.networks[network.id] = network }),

    selectNode: (nodeId) => set((s) => { s.selectedNodeId = nodeId }),

    scanNode: (networkId, nodeId) =>
      set((s) => {
        const network = s.networks[networkId]
        if (!network) return
        const node = network.nodes.find((n) => n.id === nodeId)
        if (!node) return
        node.isScanned = true
        // Zero-day pack consumable: guarantee a vuln on the next scanned service
        if (s.player?.activeFlags.consumable_zero_day_armed) {
          for (const svc of node.services) {
            svc.hasKnownVulnerability = true
            if (!svc.vulnerabilityId) svc.vulnerabilityId = 'CVE-0DAY-PACK'
            break
          }
          delete s.player.activeFlags.consumable_zero_day_armed
          s.terminalLines.push({
            id: `log_zd_used_${Date.now()}`, type: 'success',
            text: 'Zero-day pack consumed — CVE injected into scan results.',
          })
        }
      }),

    breachNode: (networkId, nodeId) =>
      set((s) => {
        const network = s.networks[networkId]
        if (!network) return
        const node = network.nodes.find((n) => n.id === nodeId)
        if (!node) return
        node.isBreached = true
        // M14h: PacketGhost sniffer auto-scans adjacent nodes when a router is breached
        const hasSniffer = (s.player?.software.sniffers?.length ?? 0) > 0
        if (hasSniffer && node.type === 'router') {
          let revealed = 0
          for (const adjId of node.connectedTo) {
            const adj = network.nodes.find((n) => n.id === adjId)
            if (adj && !adj.isScanned) { adj.isScanned = true; revealed++ }
          }
          if (revealed > 0) {
            s.terminalLines.push({
              id: `log_sniffer_${Date.now()}`, type: 'success',
              text: `SNIFFER: ${revealed} adjacent node${revealed === 1 ? '' : 's'} auto-revealed.`,
            })
          }
        }
        if (s.traceState) {
          const hasFirewallBypasser = (s.player?.software.firewallBypassers.length ?? 0) > 0
          if (node.type === 'firewall' && !hasFirewallBypasser) {
            // Hard breach — firewall triggers emergency alarm without bypasser
            // Brute spec halves the immediate trace spike
            const bruteMod = s.player?.specialization === 'brute' ? 0.5 : 1
            const now2 = Date.now()
            s.traceState.level = Math.min(100, s.traceState.level + node.securityTier * 5 * bruteMod)
            s.traceState.alarmRate = (3.0 + node.securityTier * 1.0) * bruteMod
            s.traceState.alarmDecaysAt = now2 + 15_000
          } else {
            s.traceState = triggerBreachAlarm(s.traceState, node.securityTier, Date.now())
          }
        }
        // bounty_hunt objective: breach the specific target endpoint
        if (s.activeMissionId) {
          const mission = s.missions.find((m: Mission) => m.id === s.activeMissionId)
          if (mission?.type === 'bounty_hunt') {
            const targetId = mission.narrativeFlags?.bounty_target_node_id
            if (targetId === node.id) {
              const obj = mission.objectives.find((o) => !o.isOptional && !o.isCompleted)
              if (obj) {
                obj.isCompleted = true
                tryAdvanceMissionPhase(mission, s)
              }
            }
          }
        }

        // M14h+: Bounce-library expansion — breaching an entry_point or router on a
        // corporate/cloud/legacy network adds it to the player's bounce library.
        // Lets the player chain through compromised hosts they've already owned.
        if (
          s.player &&
          (node.type === 'entry_point' || node.type === 'router') &&
          s.activeMissionId
        ) {
          const mission = s.missions.find((m: Mission) => m.id === s.activeMissionId)
          if (mission) {
            const corpId = mission.briefing.clientHandle
            const archetype = mission.targetNetworkId as string
            // Region map by archetype (approximate)
            const REGION_BY_ARCH: Record<string, string> = {
              corporate_intranet:    'US-EAST',
              cloud_infrastructure:  'EU-WEST',
              government_classified: 'US-CENTRAL',
              iot_mesh:              'APAC',
              legacy_mainframe:      'EU-EAST',
              personal_gateway:      'EU-NORTH',
            }
            const region = REGION_BY_ARCH[archetype] ?? 'US-EAST'
            // De-dupe by id
            const bounceId = `bounce_breached_${corpId}_${node.type}_${node.id}`.slice(0, 64)
            const exists = s.player.bounceLibrary.some((n) => n.id === bounceId)
            if (!exists) {
              s.player.bounceLibrary.push({
                id: bounceId,
                label: `${corpId} — ${node.type.toUpperCase()}`,
                region,
                tier: Math.min(3, Math.max(1, node.securityTier - 1)) as 1 | 2 | 3,
                logStatus: 'clean',
                addedAt: Date.now(),
              })
              s.terminalLines.push({
                id: `log_bounce_added_${Date.now()}`, type: 'success',
                text: `+ BOUNCE NODE ACQUIRED: ${corpId} — ${node.type}. Added to library.`,
              })
            }
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
            if (obj) {
              obj.isCompleted = true
              tryAdvanceMissionPhase(mission, s)
            }
          }
        }

        if (s.player) {
          s.player.credits += 0 // file transfer — reward comes at mission completion
        }
      }),

    wipeNodeLog: (networkId, nodeId) =>
      set((s) => {
        const network = s.networks[networkId]
        if (!network) return
        const node = network.nodes.find((n) => n.id === nodeId)
        if (!node?.isBreached) return
        node.isLogWiped = true
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
          (mission.type === 'network_sabotage' && (node.type === 'router' || node.type === 'admin_console')) ||
          (mission.type === 'evidence_planting' && node.type === 'file_server')

        if (!valid) return

        const obj = mission.objectives.find((o) => !o.isOptional && !o.isCompleted)
        if (obj) {
          obj.isCompleted = true
          tryAdvanceMissionPhase(mission, s)
        }

        if (mission.type === 'network_sabotage') {
          if (!mission.narrativeFlags) mission.narrativeFlags = {}
          // 60s escape window (was 30s), scales up with bounce hops for breathing room
          const hops = s.activeRoute.length
          mission.narrativeFlags.sabotage_deadline = Date.now() + 60_000 + (hops * 15_000)
          if (s.traceState) {
            // Spike but don't drown — proxy v3 (50% reduction) makes this manageable
            s.traceState.baseRate += 3.0
            s.traceState.alarmRate = 2.5
            s.traceState.alarmDecaysAt = Date.now() + 45_000
          }
          // M14e: sabotage drops a corporate stock 15%. If the player short-sold by
          // owning a put consumable (future M14e+), they'd profit. For now: just
          // shows the player their actions move markets.
          const stockIds = Object.keys(s.stockPrices)
          if (stockIds.length > 0) {
            const targetStock = stockIds[Math.floor(Math.random() * stockIds.length)]
            const oldPrice = s.stockPrices[targetStock]
            const newPrice = oldPrice * 0.85
            s.stockPrices[targetStock] = newPrice
            s.terminalLines.push({
              id: `log_stock_drop_${Date.now()}`, type: 'system',
              text: `MARKET REACTION: ${targetStock} dropped ${(15).toFixed(0)}% to ${newPrice.toFixed(2)} Cr (sabotage detected).`,
            })
          }
        }
      }),

    disconnect: () =>
      set((s) => {
        const mission = s.missions.find((m: Mission) => m.id === s.activeMissionId)
        const allObjectivesDone = mission?.objectives
          .filter((o) => !o.isOptional)
          .every((o) => o.isCompleted) ?? false

        const breachedNodes = s.activeNetworkId
          ? (s.networks[s.activeNetworkId]?.nodes.filter((n) => n.isBreached) ?? [])
          : []
        const allLogsClear = breachedNodes.length === 0 || breachedNodes.every((n) => n.isLogWiped)

        if (s.traceState && s.traceState.level >= 100) {
          if (mission) mission.status = 'failed'
          s.missionResult = 'fail'
          if (s.player) {
            s.player.stats.traceFailures++
            s.player.stats.totalMissions++
          }
          // News: security teams detected and logged the breach
          const target = mission?.briefing.clientHandle ?? 'Unknown Target'
          s.newsFeed.unshift({
            id: `news_traced_${Date.now()}`,
            timestamp: Date.now(),
            headline: `Intrusion Detected and Logged at ${target}`,
            body: `Security systems at ${target} successfully identified and traced an attempted breach. The attacker's connection was severed before objectives could be completed. Forensic data has been handed to authorities.`,
            category: 'crime',
            isPlayerAction: true,
          })
          if (s.newsFeed.length > 100) s.newsFeed.splice(100)
        } else if (allObjectivesDone && !allLogsClear) {
          // Objectives done but log traces remain — abandoned, client won't pay a dirty exit
          if (mission) mission.status = 'failed'
          if (s.player) s.player.stats.totalMissions++
          s.missionResult = 'abandoned'
          s.terminalLines.push({
            id: `log_dirty_${Date.now()}`,
            type: 'error',
            text: 'EXIT UNCLEAN — trace logs detected on network. Client refused payment.',
          })
          // News: logs found, partial attribution possible
          const target2 = mission?.briefing.clientHandle ?? 'Unknown Target'
          s.newsFeed.unshift({
            id: `news_dirty_${Date.now()}`,
            timestamp: Date.now(),
            headline: `Residual Breach Logs Found at ${target2} — Partial Attribution`,
            body: `Forensic analysts at ${target2} have discovered access log entries from an unidentified intrusion. The attacker appeared to complete objectives but left identifiable traces. Investigation is ongoing.`,
            category: 'crime',
            isPlayerAction: true,
          })
          if (s.newsFeed.length > 100) s.newsFeed.splice(100)
        } else if (allObjectivesDone && mission) {
          // Evaluate optional stealth objective before awarding rewards
          const stealthObj = mission.objectives.find(
            (o) => o.isOptional && o.id.endsWith('_stealth'),
          )
          if (stealthObj && !stealthObj.isCompleted && s.activeNetworkId) {
            const network = s.networks[s.activeNetworkId]
            if (network) {
              const breachedNodes = network.nodes.filter((n) => n.isBreached)
              if (breachedNodes.length > 0 && breachedNodes.every((n) => n.isLogWiped)) {
                stealthObj.isCompleted = true
              }
            }
          }

          mission.status = 'completed'
          mission.completedAt = Date.now()
          if (s.player) {
            const rewardMult = s.activeWorldEvents.reduce((m, e) =>
              e.effect.type === 'reward_boost' ? m * e.effect.mult : m, 1) *
              (s.player?.specialization === 'social' ? 1.25 : 1)
            const boostedCredits = Math.floor(mission.reward.credits * rewardMult)
            s.player.credits += boostedCredits
            s.player.reputation += mission.reward.reputation
            s.player.stats.creditsEarned += boostedCredits
            if (stealthObj?.isCompleted) {
              const stealthPct = s.player.specialization === 'ghost' ? 0.75 : 0.5
              const stealthRep = Math.floor(mission.reward.reputation * stealthPct)
              s.player.reputation += stealthRep
            }
            s.player.stats.successfulBreaches++
            s.player.stats.totalMissions++
            s.player.completedMissions.push(mission.id)

            // Award XP
            const isStory = !!(mission as StoryMission).isStory
            const xpGain = missionXpReward(mission.difficulty, isStory)
            s.player.stats.xp = (s.player.stats.xp ?? 0) + xpGain
            const newLevel = levelFromXp(s.player.stats.xp)
            if (newLevel > (s.player.stats.level ?? 1)) {
              s.player.stats.level = newLevel
              s.terminalLines.push({
                id: `log_lvl_${Date.now()}`,
                type: 'success',
                text: `LEVEL UP → ${newLevel}. XP gained this mission: ${xpGain}.`,
              })
            }
          }
          s.missionResult = 'success'

          // Generate player-action news article
          const actionData: Partial<Record<string, { headline: string; body: string }>> = {
            file_theft: {
              headline: 'Data Exfiltration Confirmed at ' + mission.briefing.clientHandle,
              body: `Internal audits at ${mission.briefing.clientHandle} have confirmed unauthorised access and data theft. Security teams are reviewing access logs. No attribution has been made.`,
            },
            account_deletion: {
              headline: 'Identity Erasure Operation Strikes ' + mission.briefing.clientHandle,
              body: `A user account was permanently and irreversibly deleted from ${mission.briefing.clientHandle}'s systems in what investigators are calling a "precision intrusion". The target's identity has been scrubbed clean.`,
            },
            database_corruption: {
              headline: mission.briefing.clientHandle + ' Databases Critically Compromised',
              body: `${mission.briefing.clientHandle} is reporting severe database corruption following what appears to be a deliberate cyberattack. Recovery efforts are ongoing; data loss is expected to be significant.`,
            },
            network_sabotage: {
              headline: mission.briefing.clientHandle + ' Network Goes Dark — Sabotage Suspected',
              body: `Systems at ${mission.briefing.clientHandle} went offline following what engineers are calling "deliberate infrastructural damage". The incident is being treated as targeted sabotage.`,
            },
            evidence_planting: {
              headline: 'Planted Evidence Found in ' + mission.briefing.clientHandle + ' Audit',
              body: `Digital forensics experts have discovered fabricated evidence in ${mission.briefing.clientHandle}'s systems. The origin of the forgery remains unknown, and legal proceedings may be affected.`,
            },
            bounty_hunt: {
              headline: 'Target Located via Anonymous Tip — ' + mission.briefing.clientHandle,
              body: `An anonymous intelligence package led to the identification of a target linked to ${mission.briefing.clientHandle}. The source of the information cannot be confirmed.`,
            },
            corporate_espionage: {
              headline: mission.briefing.clientHandle + ' Hit by Corporate Intelligence Theft',
              body: `${mission.briefing.clientHandle} is investigating a suspected intelligence leak. Competitors may have benefited from stolen strategic data. Internal investigations are ongoing.`,
            },
          }
          const nd = actionData[mission.type] ?? {
            headline: 'Cyber Incident Reported — ' + mission.briefing.clientHandle,
            body: `An unattributed cyber incident has been reported involving ${mission.briefing.clientHandle}. Authorities have opened an investigation but no suspects have been named.`,
          }
          s.newsFeed.unshift({
            id: `news_${Date.now()}`,
            timestamp: Date.now(),
            headline: nd.headline,
            body: nd.body,
            category: 'crime',
            isPlayerAction: true,
          })
          if (s.newsFeed.length > 100) s.newsFeed.splice(100)

          // M14m: post any queued multi-phase news echoes
          if (mission.newsEchoes && mission.phases) {
            const phasesDone = mission.currentPhaseIndex ?? 0
            // Phases 0..phasesDone-1 are completed (player advanced past them);
            // if the player completed the final phase too, include it.
            const finalPhaseDone = mission.objectives
              .filter((o) => !o.isOptional).every((o) => o.isCompleted)
            const completedThrough = finalPhaseDone ? mission.phases.length - 1 : phasesDone - 1
            for (let i = 0; i <= completedThrough; i++) {
              const echo = mission.newsEchoes[i]
              if (!echo) continue
              s.newsFeed.unshift({
                id: `news_echo_${mission.id}_${i}_${Date.now()}`,
                timestamp: Date.now() + ((echo.delaySeconds ?? 0) * 1000),
                headline: echo.headline,
                body: echo.body,
                category: echo.category,
                isPlayerAction: false,
              })
            }
            if (s.newsFeed.length > 100) s.newsFeed.splice(100)
          }
        } else {
          // Incomplete disconnect — objectives not done, not traced.
          // Reset the mission to 'available' so the player can retry.
          if (mission) {
            mission.status = 'available'
            // Reset objectives so the mission is fresh for the next attempt
            mission.objectives.forEach((o) => { o.isCompleted = false })
          }
          s.missionResult = 'abandoned'
          s.terminalLines.push({
            id: `log_exit_${Date.now()}`, type: 'warn',
            text: 'DISCONNECTED — objectives incomplete. Mission remains available for retry.',
          })
        }

        // Track heat and patching: if player left dirty logs, corp is alerted and begins patching
        if (s.activeNetworkId && s.player && mission) {
          const network = s.networks[s.activeNetworkId]
          if (network) {
            const dirtyNodes = network.nodes.filter((n) => n.isBreached && !n.isLogWiped)
            const corpId = mission.briefing.clientHandle
            // M14h: Anti-Forensic Module reduces probability of heat being recorded
            const antiForensicLevel = s.player.software.antiForensics?.length ?? 0
            const heatSurvivalRoll = Math.random()
            const heatReduction = antiForensicLevel >= 2 ? 0.6 : antiForensicLevel === 1 ? 0.3 : 0
            const heatSuppressed = heatSurvivalRoll < heatReduction
            if (dirtyNodes.length > 0 && !heatSuppressed) {
              const now2 = Date.now()
              s.player.activeFlags[`heat_${corpId}`] = now2
              if (!s.player.activeFlags[`patch_${corpId}`]) {
                s.player.activeFlags[`patch_${corpId}`] = now2
              }
            } else if (dirtyNodes.length > 0 && heatSuppressed) {
              s.terminalLines.push({
                id: `log_af_${Date.now()}`, type: 'success',
                text: `ANTI-FORENSIC: evidence reduction held. ${corpId} did not link the breach to you.`,
              })
              delete s.player.activeFlags[`heat_${corpId}`]
            } else {
              delete s.player.activeFlags[`heat_${corpId}`]
              // patch_<corpId> intentionally kept — corp continues patching regardless of clean exit
            }
          }
        }

        // Rank-up check — promote based on reputation thresholds
        if (s.player) {
          const rep = s.player.reputation
          const newRank = RANK_THRESHOLDS.reduce(
            (best, threshold, idx) => (rep >= threshold ? idx : best), 1,
          )
          if (newRank > s.player.rank) {
            const oldRank = s.player.rank
            s.player.rank = newRank
            s.terminalLines.push({
              id: `log_rankup_${Date.now()}`,
              type: 'success',
              text: `RANK PROMOTION: ${['', 'NOVICE', 'FREELANCER', 'SPECIALIST', 'OPERATIVE', 'ELITE', 'SHADOW', 'PHANTOM'][newRank]} (was ${['', 'NOVICE', 'FREELANCER', 'SPECIALIST', 'OPERATIVE', 'ELITE', 'SHADOW', 'PHANTOM'][oldRank]})`,
            })
            if (newRank === 5 && !s.player.specialization) {
              s.pendingSpecialization = true
            }
          }
        }

        // Update faction standings based on the mission outcome
        if (s.player && mission && s.activeNetworkId) {
          const network = s.networks[s.activeNetworkId]
          const ownerId = network?.ownerId ?? ''
          const clientHandle = mission.briefing.clientHandle
          const succeeded = mission.status === 'completed'

          const socialMult = s.player?.specialization === 'social' ? 1.5 : 1

          function shiftStanding(factionId: string, delta: number, rankFn: (n: number) => string) {
            if (!s.player) return
            const boosted = delta > 0 ? Math.round(delta * socialMult) : delta
            const fs = s.player.factionStandings
            const existing = fs.find((f) => f.factionId === factionId)
            if (existing) {
              existing.score = Math.max(-100, Math.min(100, existing.score + boosted))
              existing.rank = rankFn(existing.score)
            } else {
              const score = Math.max(-100, Math.min(100, boosted))
              fs.push({ factionId, score, rank: rankFn(score) })
            }
          }

          if (succeeded) {
            // Voidlink International: +2 for any successful mission
            shiftStanding('voidlink_international', 2, (n) =>
              n >= 60 ? 'PARTNER' : n >= 30 ? 'ASSOCIATE' : n >= 0 ? 'CONTRACTOR' : n >= -30 ? 'SUSPENDED' : 'BANNED',
            )
            // Target network owner
            if (ownerId === 'arunmor_corp') {
              shiftStanding('arunmor', -15, (n) =>
                n >= 0 ? 'UNKNOWN' : n >= -30 ? 'SUSPECT' : n >= -60 ? 'THREAT' : 'ENEMY',
              )
            }
            if (ownerId === 'ares_division') {
              shiftStanding('ares_division', -20, (n) =>
                n >= 0 ? 'UNKNOWN' : n >= -30 ? 'FLAGGED' : n >= -60 ? 'TARGET' : 'PRIORITY TARGET',
              )
            }
            if (ownerId === 'the_nameless') {
              shiftStanding('the_nameless', 8, (n) =>
                n <= 0 ? 'UNDETECTED' : n < 30 ? 'OBSERVED' : n < 60 ? 'TRACKED' : 'SUBJECT',
              )
            }
            if (ownerId === 'law_enforcement') {
              shiftStanding('voidlink_international', -3, (n) =>
                n >= 60 ? 'PARTNER' : n >= 30 ? 'ASSOCIATE' : n >= 0 ? 'CONTRACTOR' : n >= -30 ? 'SUSPENDED' : 'BANNED',
              )
            }
            // Client-based underground rep
            if (clientHandle === 'Null_Trader' || clientHandle === 'The_Broker') {
              shiftStanding('underground', 12, (n) =>
                n <= 0 ? 'UNKNOWN' : n < 20 ? 'CONTACT' : n < 50 ? 'TRUSTED' : n < 80 ? 'MEMBER' : 'VETERAN',
              )
            }
            // Working for Ares as client gives them leverage — ambiguous
            if (clientHandle === 'ARES_DIVISION') {
              shiftStanding('ares_division', 5, (n) =>
                n >= 0 ? 'UNKNOWN' : n >= -30 ? 'FLAGGED' : n >= -60 ? 'TARGET' : 'PRIORITY TARGET',
              )
            }
          }
        }

        if (s.traceState) s.traceState = escapeTrace(s.traceState)
        s.activeMissionId = null
        s.activeNetworkId = null
        s.selectedNodeId = null
        s.traceState = null
        s.rivalHacker = null
        s.rivalSpawnAt = null
        s.credentialCache = []

        // Auto-close hacking and network map windows on disconnect
        s.activeWindows = s.activeWindows.filter(
          (w) => w.id !== 'hacking' && w.id !== 'network-map',
        )
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
          s.player.stats.creditsEarned += mission.reward.credits
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
        s.activeWindows = s.activeWindows.filter(
          (w) => w.id !== 'hacking' && w.id !== 'network-map',
        )
      }),

    buyHardware: (item) => {
      let result: 'ok' | 'insufficient_funds' | 'already_owned' = 'ok'
      set((s) => {
        if (!s.player) { result = 'insufficient_funds'; return }
        const eventDiscount = s.activeWorldEvents.reduce((d, e) =>
          e.effect.type === 'shop_discount' ? Math.max(d, e.effect.pct) : d, 0)
        const archDiscount = s.player.specialization === 'architect' ? 0.15 : 0
        const discount = Math.min(0.5, eventDiscount + archDiscount)
        const effectivePrice = Math.floor(item.price * (1 - discount))
        if (s.player.credits < effectivePrice) { result = 'insufficient_funds'; return }
        const key = item.slot as keyof typeof s.player.hardware
        // gpuTier and coolingTier start undefined — default to 0
        const current = (s.player.hardware[key] as number | undefined) ?? 0
        // For 'tiered slots' (gpuTier/coolingTier), the stored value IS the tier.
        // For continuous slots (cpuSpeed, ramSlots etc.), the threshold is tier*2.
        const isDiscreteTier = key === 'gpuTier' || key === 'coolingTier'
        const ownedThreshold = isDiscreteTier ? item.tier : item.tier * 2
        if (current >= ownedThreshold) {
          result = 'already_owned'; return
        }
        s.player.credits -= effectivePrice
        const boost = item.statBoost[item.slot] ?? 1
        if (isDiscreteTier) {
          ;(s.player.hardware[key] as number) = item.tier  // discrete tier set, not added
        } else {
          ;(s.player.hardware[key] as number) = current + boost
        }
        s.player.stats.creditsSpent += effectivePrice
      })
      return result
    },

    buyTool: (item) => {
      let result: 'ok' | 'insufficient_funds' | 'already_owned' = 'ok'
      set((s) => {
        if (!s.player) { result = 'insufficient_funds'; return }
        const eventDiscount2 = s.activeWorldEvents.reduce((d, e) =>
          e.effect.type === 'shop_discount' ? Math.max(d, e.effect.pct) : d, 0)
        const archDiscount2 = s.player.specialization === 'architect' ? 0.15 : 0
        const discount2 = Math.min(0.5, eventDiscount2 + archDiscount2)
        const effectivePrice = Math.floor(item.unlockPrice * (1 - discount2))
        if (s.player.credits < effectivePrice) { result = 'insufficient_funds'; return }
        const sw = s.player.software
        if (!sw.sniffers)        sw.sniffers = []
        if (!sw.memoryScrapers)  sw.memoryScrapers = []
        if (!sw.antiForensics)   sw.antiForensics = []
        const allTools = [
          ...sw.passwordCrackers, ...sw.proxies, ...sw.logDeleters,
          ...sw.portScanners, ...sw.firewallBypassers,
          ...(sw.sniffers ?? []), ...(sw.memoryScrapers ?? []), ...(sw.antiForensics ?? []),
          ...sw.misc,
        ]
        if (allTools.some((t) => t.toolId === item.id)) {
          result = 'already_owned'; return
        }
        s.player.credits -= effectivePrice
        s.player.stats.creditsSpent += effectivePrice
        const toolInstance = { toolId: item.id, level: 1, version: '1.0' }
        switch (item.category) {
          case 'password':       sw.passwordCrackers.push(toolInstance); break
          case 'proxy':          sw.proxies.push(toolInstance); break
          case 'log':            sw.logDeleters.push(toolInstance); break
          case 'port_scanner':   sw.portScanners.push(toolInstance); break
          case 'firewall':       sw.firewallBypassers.push(toolInstance); break
          case 'sniffer':        sw.sniffers.push(toolInstance); break
          case 'memory_scraper': sw.memoryScrapers.push(toolInstance); break
          case 'anti_forensic':  sw.antiForensics.push(toolInstance); break
          default:               sw.misc.push(toolInstance); break
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

    setPlayerFlag: (key, value) =>
      set((s) => {
        if (!s.player) return
        s.player.activeFlags[key] = value
      }),

    tickGameLoop: (deltaMs) =>
      set((s) => {
        if (!s.traceState) return

        // Connection grace: pause trace ticks until the dial-up animation finishes.
        if (s.connectingUntil && Date.now() < s.connectingUntil) {
          return
        }
        // Clear the flag once the grace period has elapsed.
        if (s.connectingUntil && Date.now() >= s.connectingUntil) {
          s.connectingUntil = null
        }

        // Freeze time-based trace accumulation while the tutorial is active.
        // Per-action spikes (scan, crack) still apply — only the background tick pauses.
        if (!s.player?.activeFlags?.tutorial_done) {
          s.traceState.baseRate = 0
          s.traceState.idsRate  = 0
          s.traceState.adminRate = 0
          s.traceState.rivalRate = 0
          s.traceState.worldEventRate = 0
          return
        }

        // Rival hacker: spawn after random delay, then move every ~6s
        const now = Date.now()
        if (s.activeMissionId && !s.rivalHacker && !s.rivalSpawnAt) {
          // Schedule spawn 20-40s after mission start
          const mission = s.missions.find((m: Mission) => m.id === s.activeMissionId)
          const missionAge = mission?.startedAt ? now - mission.startedAt : 0
          if (missionAge > 5000) {
            const rivalMult = s.activeWorldEvents.reduce((m, e) =>
              e.effect.type === 'rival_frequency' ? m * e.effect.mult : m, 1)
            const window = rivalMult > 1 ? 8000 : 20000
            s.rivalSpawnAt = now + window + Math.random() * window
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

        // World events: schedule, spawn, and expire
        if (s.player) {
          // Kick off scheduler on first desktop tick
          if (s.nextWorldEventAt === null) {
            s.nextWorldEventAt = now + 60_000 + Math.random() * 60_000 // first event in 1–2 min
          }
          // Expire finished events
          s.activeWorldEvents = s.activeWorldEvents.filter((e) => e.endsAt > now)
          // Spawn new event if scheduled and we have room (max 2 active)
          if (s.nextWorldEventAt <= now && s.activeWorldEvents.length < 2) {
            const existing = new Set(s.activeWorldEvents.map((e) => e.name))
            const pool = WORLD_EVENT_CATALOGUE.filter((e) => !existing.has(e.name))
            if (pool.length > 0) {
              const def = pool[Math.floor(Math.random() * pool.length)]
              const durationMs = 3 * 60_000 + Math.random() * 2 * 60_000 // 3–5 min
              const evt: WorldEvent = {
                ...def,
                id: `we_${now}`,
                endsAt: now + durationMs,
              }
              s.activeWorldEvents.push(evt)
              // Post to news feed
              s.newsFeed.unshift({
                id: `news_we_${now}`,
                timestamp: now,
                headline: `Global Alert: ${evt.name}`,
                body: evt.description,
                category: 'tech',
                isPlayerAction: false,
              })
              if (s.newsFeed.length > 100) s.newsFeed.splice(100)
            }
            // Schedule next event 4–7 min from now
            s.nextWorldEventAt = now + 240_000 + Math.random() * 180_000
          }
        }

        // Update contextual trace rates from current network state
        if (s.activeNetworkId && s.traceState) {
          const network = s.networks[s.activeNetworkId]
          if (network) {
            const idsUnbreached = network.nodes.filter(
              (n) => n.type === 'intrusion_detector' && !n.isBreached,
            ).length
            s.traceState.idsRate   = idsUnbreached * 2.0
            s.traceState.adminRate = network.activeAdmins * 1.5
            s.traceState.rivalRate = s.rivalHacker ? 1.0 : 0
          }
          // Apply world event trace deltas + Ghost specialization bonus
          const traceEventDelta = s.activeWorldEvents.reduce((sum, e) => {
            return e.effect.type === 'trace_rate_delta' ? sum + e.effect.delta : sum
          }, 0)
          const ghostMod = s.player?.specialization === 'ghost'
            ? -(s.traceState.baseRate + s.traceState.idsRate + s.traceState.adminRate) * 0.25
            : 0
          s.traceState.worldEventRate = traceEventDelta + ghostMod
        }

        s.traceState = tickTrace(s.traceState, deltaMs, now)

        // Evaluate mission events
        if (s.activeMissionId && s.activeNetworkId) {
          const mission = s.missions.find((m: Mission) => m.id === s.activeMissionId)
          const network = s.networks[s.activeNetworkId]
          if (mission && network && mission.events.length > 0) {
            if (!mission.firedEventIds) mission.firedEventIds = []
            const missionAgeSeconds = mission.startedAt ? (now - mission.startedAt) / 1000 : 0

            for (const evt of mission.events) {
              if (mission.firedEventIds.includes(evt.id)) continue

              const cond = evt.triggerCondition
              let triggered = false
              if (cond.type === 'trace_threshold' && s.traceState) {
                triggered = s.traceState.level >= cond.percent
              } else if (cond.type === 'time_elapsed') {
                triggered = missionAgeSeconds >= cond.seconds
              } else if (cond.type === 'node_breached') {
                triggered = network.nodes.some((n) => n.type === cond.nodeType && n.isBreached)
              } else if (cond.type === 'objective_complete') {
                triggered = mission.objectives.some(
                  (o) => o.id === cond.objectiveId && o.isCompleted,
                )
              }

              if (!triggered) continue

              mission.firedEventIds.push(evt.id)
              s.terminalLines.push({
                id: `log_${now}_evt_${evt.id}`,
                type: 'system',
                text: `[EVENT] ${evt.message}`,
              })
              if (s.terminalLines.length > 500) s.terminalLines.splice(0, 100)

              if (evt.effect) {
                if (evt.effect.type === 'spawn_rival_hacker' && !s.rivalHacker) {
                  const idx = Math.floor(Math.random() * network.nodes.length)
                  const handles = ['REVELATION_AGENT', 'SHADOW_TRACE', 'WATCHDOG_7', 'SPECTER_9']
                  s.rivalHacker = {
                    handle: handles[Math.floor(Math.random() * handles.length)],
                    currentNodeId: network.nodes[idx].id,
                    spawnedAt: now,
                    nextMoveAt: now + 5000 + Math.random() * 3000,
                  }
                  s.rivalSpawnAt = null
                } else if (evt.effect.type === 'raise_trace_speed' && s.traceState) {
                  s.traceState.baseRate += evt.effect.delta
                } else if (evt.effect.type === 'lock_node') {
                  const node = network.nodes.find((n) => n.id === (evt.effect as { type: 'lock_node'; nodeId: string }).nodeId)
                  if (node) node.isActive = false
                } else if (evt.effect.type === 'set_flag') {
                  if (!mission.narrativeFlags) mission.narrativeFlags = {}
                  mission.narrativeFlags[(evt.effect as { type: 'set_flag'; flag: string; value: boolean | string | number }).flag] =
                    (evt.effect as { type: 'set_flag'; flag: string; value: boolean | string | number }).value
                }
              }
            }
          }
        }

        // Network sabotage: force trace at deadline
        if (s.activeMissionId && s.traceState) {
          const sabMission = s.missions.find((m: Mission) => m.id === s.activeMissionId)
          const deadline = sabMission?.narrativeFlags?.sabotage_deadline
          if (typeof deadline === 'number' && now >= deadline) {
            s.traceState.level = 100
          }
        }

        // Bounce hop intercept: burn next hop instead of failing when trace hits 100%
        if (s.traceState.level >= 100 && s.traceState.hopsRemaining > 0) {
          const burntHopIndex = s.traceState.totalHops - s.traceState.hopsRemaining
          const burntHopId = s.activeRoute[burntHopIndex]
          if (s.player && burntHopId) {
            const hopNode = s.player.bounceLibrary.find((n) => n.id === burntHopId)
            if (hopNode) hopNode.logStatus = 'dirty'
          }
          s.traceState.hopsRemaining--
          s.traceState.level = 0
          s.traceState.status = 'clean'
          s.traceState.alarmRate = 0
          s.traceState.alarmDecaysAt = 0
          const hopsLeft = s.traceState.hopsRemaining
          const burntLabel = s.player?.bounceLibrary.find((n) => n.id === burntHopId)?.label ?? 'UNKNOWN HOP'
          s.terminalLines.push({
            id: `hop_${now}`,
            type: 'warn',
            text: `TRACE BYPASSED — ${burntLabel} logged. Rerouting... ${hopsLeft} hop${hopsLeft !== 1 ? 's' : ''} remaining.`,
          })
        }

        // Auto-fail if traced
        if (s.traceState.level >= 100 && s.traceState.status !== 'traced') {
          if (s.activeMissionId) {
            const mission = s.missions.find((m: Mission) => m.id === s.activeMissionId)
            if (mission) mission.status = 'failed'
          }
          if (s.player) {
            s.player.stats.traceFailures++
            s.player.stats.totalMissions++
          }
          s.missionResult = 'fail'
          s.activeMissionId = null
          s.activeNetworkId = null
          s.selectedNodeId = null
          s.traceState = null
          s.rivalHacker = null
          s.rivalSpawnAt = null
          s.activeWindows = s.activeWindows.filter(
            (w) => w.id !== 'hacking' && w.id !== 'network-map',
          )
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
                s.player.stats.creditsEarned += mission.reward.credits
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

    addNewsItem: (item) =>
      set((s) => {
        s.newsFeed.unshift({
          ...item,
          id: `news_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
          timestamp: Date.now(),
        })
        if (s.newsFeed.length > 100) s.newsFeed.splice(100)
      }),

    loadInitialNews: () =>
      set((s) => {
        if (s.newsFeed.length > 0) return
        const now = Date.now()
        const items: NewsItem[] = [
          {
            id: 'news_init_1', timestamp: now - 86_400_000 * 3,
            headline: 'Arunmor Corporation Reports Q3 Earnings Surge',
            body: 'Pharmaceutical and biotech firm Arunmor Corp posted record revenues, citing advances in its classified "Project REVELATION" division. No further details were provided.',
            category: 'corporate', isPlayerAction: false,
          },
          {
            id: 'news_init_2', timestamp: now - 86_400_000 * 2,
            headline: 'Interpol Issues Advisory on "Ghost Hacker" Collective',
            body: 'Interpol\'s cybercrime division issued a global advisory regarding an anonymous hacking collective responsible for twelve high-profile corporate breaches in the last quarter.',
            category: 'crime', isPlayerAction: false,
          },
          {
            id: 'news_init_3', timestamp: now - 86_400_000 * 2 + 3600_000,
            headline: 'Voidlink International Expands Contractor Programme',
            body: 'Voidlink International, the private brokerage network, announced it is accepting new contractor applications. "Qualified individuals need only pass verification," a spokesperson said.',
            category: 'corporate', isPlayerAction: false,
          },
          {
            id: 'news_init_4', timestamp: now - 86_400_000 * 1,
            headline: 'Three Banking Networks Suffer Simultaneous Outage',
            body: 'Unplanned outages struck Pacific National, Vericom Trust, and Delta Credit in a three-hour window yesterday. Authorities suspect coordinated intrusion rather than hardware failure.',
            category: 'crime', isPlayerAction: false,
          },
          {
            id: 'news_init_5', timestamp: now - 86_400_000 * 1 + 7200_000,
            headline: 'Next-Gen Encryption Standard Ratified by ISO',
            body: 'The International Standards Organisation has ratified the AES-512 successor protocol, citing increasing threats from nation-state hacking programmes. Corporate adoption is expected to take 18–24 months.',
            category: 'tech', isPlayerAction: false,
          },
          {
            id: 'news_init_6', timestamp: now - 3_600_000,
            headline: 'Darkweb Marketplace "NullBay" Taken Offline',
            body: 'Europol confirmed the seizure of NullBay, a darkweb marketplace specialising in stolen credentials and exploit kits. Administrators remain at large.',
            category: 'crime', isPlayerAction: false,
          },
          {
            id: 'news_init_7', timestamp: now - 1_800_000,
            headline: 'Government Systems Suffer "Unexplained Data Loss"',
            body: 'Multiple federal agencies reported unexplained data anomalies in a routine audit. The incident is under investigation. Officials declined to speculate on a cause.',
            category: 'corporate', isPlayerAction: false,
          },
        ]
        s.newsFeed.push(...items)
      }),

    chooseSpecialization: (spec) =>
      set((s) => {
        if (!s.player || s.player.specialization) return
        s.player.specialization = spec
        s.pendingSpecialization = false
        s.terminalLines.push({
          id: `log_spec_${Date.now()}`,
          type: 'success',
          text: `SPECIALIZATION ACTIVE: ${spec.toUpperCase()}. Operative bonuses applied.`,
        })
      }),

    resolveArc1Choice: (choice) =>
      set((s) => {
        if (!s.player) return
        if (s.player.activeFlags.arc1_key_choice) return // already chosen
        s.player.activeFlags.arc1_key_choice = choice

        function shiftFaction(factionId: string, delta: number, rankFn: (n: number) => string) {
          if (!s.player) return
          const fs = s.player.factionStandings
          const existing = fs.find((f) => f.factionId === factionId)
          if (existing) {
            existing.score = Math.max(-100, Math.min(100, existing.score + delta))
            existing.rank = rankFn(existing.score)
          } else {
            const score = Math.max(-100, Math.min(100, delta))
            fs.push({ factionId, score, rank: rankFn(score) })
          }
        }

        if (choice === 'upload') {
          // REVELATION spreads — nameless faction gains, Ares loses, Voidlink worried
          shiftFaction('the_nameless', 20, (n) =>
            n <= 0 ? 'UNDETECTED' : n < 30 ? 'OBSERVED' : n < 60 ? 'TRACKED' : 'SUBJECT',
          )
          shiftFaction('ares_division', -15, (n) =>
            n >= 0 ? 'UNKNOWN' : n >= -30 ? 'FLAGGED' : n >= -60 ? 'TARGET' : 'PRIORITY TARGET',
          )
          shiftFaction('arunmor', -10, (n) =>
            n >= 0 ? 'UNKNOWN' : n >= -30 ? 'SUSPECT' : n >= -60 ? 'THREAT' : 'ENEMY',
          )
          s.terminalLines.push({
            id: `log_arc1_upload_${Date.now()}`,
            type: 'error',
            text: 'REVELATION: Upload sequence initiated. The key has been transmitted to the Voidlink relay network.',
          })
          s.newsFeed.unshift({
            id: `news_arc1_upload_${Date.now()}`,
            timestamp: Date.now(),
            headline: 'Anomalous Data Packets Detected Across Voidlink Relay Network',
            body: 'Voidlink International has reported unexplained payload propagation across contractor relay nodes. Source and intent unknown. Investigation ongoing.',
            category: 'tech',
            isPlayerAction: true,
          })
        } else if (choice === 'destroy') {
          // Key destroyed — Arunmor relieved, Nameless antagonised, Voidlink neutral
          shiftFaction('arunmor', 20, (n) =>
            n >= 0 ? 'UNKNOWN' : n >= -30 ? 'SUSPECT' : n >= -60 ? 'THREAT' : 'ENEMY',
          )
          shiftFaction('the_nameless', -15, (n) =>
            n <= 0 ? 'UNDETECTED' : n < 30 ? 'OBSERVED' : n < 60 ? 'TRACKED' : 'SUBJECT',
          )
          shiftFaction('voidlink_international', 5, (n) =>
            n >= 60 ? 'PARTNER' : n >= 30 ? 'ASSOCIATE' : n >= 0 ? 'CONTRACTOR' : n >= -30 ? 'SUSPENDED' : 'BANNED',
          )
          s.terminalLines.push({
            id: `log_arc1_destroy_${Date.now()}`,
            type: 'success',
            text: 'Key destroyed. REVELATION upload vector eliminated. Arunmor R&D threat assessment downgraded.',
          })
          s.newsFeed.unshift({
            id: `news_arc1_destroy_${Date.now()}`,
            timestamp: Date.now(),
            headline: 'Arunmor Corp Announces "Project REVELATION Resolved"',
            body: 'Arunmor Corporation issued a brief statement confirming that an internal security issue has been "permanently resolved." No further comment was given.',
            category: 'corporate',
            isPlayerAction: false,
          })
        } else {
          // Sold — massive credit windfall, Ares empowered, underground suspicious
          s.player.credits += 50000
          s.player.stats.creditsEarned += 50000
          shiftFaction('ares_division', -20, (n) =>
            n >= 0 ? 'UNKNOWN' : n >= -30 ? 'FLAGGED' : n >= -60 ? 'TARGET' : 'PRIORITY TARGET',
          )
          shiftFaction('underground', -10, (n) =>
            n <= 0 ? 'UNKNOWN' : n < 20 ? 'CONTACT' : n < 50 ? 'TRUSTED' : n < 80 ? 'MEMBER' : 'VETERAN',
          )
          s.terminalLines.push({
            id: `log_arc1_sell_${Date.now()}`,
            type: 'warn',
            text: 'Key sold. Transfer of 50,000 Cr confirmed. Buyer identity withheld by intermediary.',
          })
          s.newsFeed.unshift({
            id: `news_arc1_sell_${Date.now()}`,
            timestamp: Date.now(),
            headline: 'Underground Sources Report "REVELATION Asset" Changed Hands',
            body: 'Darkweb intelligence suggests a high-value Arunmor research artefact was acquired by an anonymous buyer. Price rumoured to exceed six figures.',
            category: 'crime',
            isPlayerAction: true,
          })
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

    resetWindowLayout: () =>
      set((s) => {
        const cols = Math.min(3, s.activeWindows.length)
        s.activeWindows.forEach((win, i) => {
          const col = i % cols
          const row = Math.floor(i / cols)
          win.x = 60 + col * (win.width + 20)
          win.y = 60 + row * 48
          win.isMinimized = false
        })
      }),

    setBounceRoute: (nodeIds) =>
      set((s) => { s.activeRoute = nodeIds }),

    addBounceNode: (node) =>
      set((s) => {
        if (!s.player) return
        if (!s.player.bounceLibrary.some((n) => n.id === node.id)) {
          s.player.bounceLibrary.push(node)
        }
      }),

    removeBounceNode: (nodeId) =>
      set((s) => {
        if (!s.player) return
        s.player.bounceLibrary = s.player.bounceLibrary.filter((n) => n.id !== nodeId)
        s.activeRoute = s.activeRoute.filter((id) => id !== nodeId)
      }),

    applyExploitEffects: (networkId, nodeId, protocol) =>
      set((s) => {
        const network = s.networks[networkId]
        const node = network?.nodes.find((n) => n.id === nodeId)
        if (!node) return

        node.exploitedVia = protocol

        if (protocol === 'FTP') {
          // Anonymous auth bypass: no log left on node — auto-wiped
          node.isLogWiped = true
          s.terminalLines.push({ id: `log_ftp_${Date.now()}`, type: 'warn',
            text: `FTP ANON AUTH — ${node.label}: no log entry. Caution: FTP transfer visible in network flow analysis.` })
        } else if (protocol === 'Telnet') {
          // Auto-scan all directly connected nodes
          let count = 0
          for (const n of network!.nodes) {
            if (node.connectedTo.includes(n.id) && !n.isScanned) {
              n.isScanned = true; count++
            }
          }
          if (count > 0)
            s.terminalLines.push({ id: `log_telnet_${Date.now()}`, type: 'success',
              text: `TELNET PIVOT — weak auth exposed config dump. Auto-scanned ${count} connected node${count !== 1 ? 's' : ''}.` })
        } else if (protocol === 'RDP' || protocol === 'HTTPS') {
          // Suppress admin rate for 45 seconds
          node.adminSuppressedUntil = Date.now() + 45_000
          if (s.traceState) {
            s.traceState.alarmRate = Math.max(0, s.traceState.alarmRate - 1.5)
          }
          s.terminalLines.push({ id: `log_rdp_${Date.now()}`, type: 'success',
            text: `SESSION HIJACK — ${node.label}: admin session taken over. Admin monitoring suppressed for 45s.` })
        } else if (protocol === 'MySQL' || protocol === 'PostgreSQL') {
          // SQL injection: auto-complete database mission objective
          const mission = s.missions.find((m) => m.id === s.activeMissionId)
          if (mission && (mission.type === 'database_corruption' || mission.type === 'account_deletion')) {
            const obj = mission.objectives.find((o) => !o.isOptional && !o.isCompleted)
            if (obj) {
              obj.isCompleted = true
              s.terminalLines.push({ id: `log_sql_${Date.now()}`, type: 'success',
                text: `SQL INJECTION — ${node.label}: direct database access achieved. Mission objective auto-completed.` })
            }
          } else {
            s.terminalLines.push({ id: `log_sql2_${Date.now()}`, type: 'success',
              text: `SQL INJECTION — ${node.label}: database schema exposed. Credential hints available.` })
          }
        } else if (protocol === 'SMTP' || protocol === 'IMAP') {
          // Reveal a credential hint
          s.terminalLines.push({ id: `log_smtp_${Date.now()}`, type: 'success',
            text: `MAIL EXPLOIT — ${node.label}: intercepted ${protocol === 'SMTP' ? 'outgoing' : 'cached'} credentials. Check credential cache.` })
          // Simulate: auto-dump credentials from this node
          if (!s.credentialCache.some((c) => c.sourceNodeId === nodeId && c.networkId === networkId)) {
            s.credentialCache.push({
              id: `cred_mail_${Date.now()}`,
              sourceNodeId: nodeId,
              sourceNodeType: node.type,
              sourceLabel: `MAIL INTERCEPT — ${node.type.replace(/_/g, ' ').toUpperCase()}`,
              method: 'dump',
              networkId,
              expiresAt: Date.now() + 8 * 60_000,
            })
          }
        }
      }),

    triggerNodeLockout: (networkId, nodeId) =>
      set((s) => {
        const network = s.networks[networkId]
        const node = network?.nodes.find((n) => n.id === nodeId)
        if (!node || node.isBreached) return
        node.isLockedOut = true
        node.lockoutUntil = Date.now() + 30_000
        node.failedCrackAttempts = (node.failedCrackAttempts ?? 0) + 1
        if (s.traceState) {
          s.traceState.level = Math.min(s.traceState.level + 2, 100)
        }
        s.terminalLines.push({ id: `log_lockout_${Date.now()}`, type: 'error',
          text: `LOCKOUT TRIGGERED — ${node.label}: ${node.failedCrackAttempts} failed attempt${node.failedCrackAttempts !== 1 ? 's' : ''}. Node locked for 30 seconds. IDS alert raised.` })
      }),

    recordFailedCrack: (networkId, nodeId) =>
      set((s) => {
        const network = s.networks[networkId]
        const node = network?.nodes.find((n) => n.id === nodeId)
        if (!node || node.isBreached) return
        node.failedCrackAttempts = (node.failedCrackAttempts ?? 0) + 1
      }),

    wipeBounceNode: (nodeId) =>
      set((s) => {
        if (!s.player) return
        const node = s.player.bounceLibrary.find((n) => n.id === nodeId)
        if (node) node.logStatus = 'clean'
      }),

    dumpCredentials: (networkId, nodeId) => {
      let result: 'ok' | 'not_breached' | 'already_dumped' = 'ok'
      set((s) => {
        const network = s.networks[networkId]
        const node = network?.nodes.find((n) => n.id === nodeId)
        if (!node?.isBreached) { result = 'not_breached'; return }
        if (s.credentialCache.some((c) => c.sourceNodeId === nodeId && c.networkId === networkId)) {
          result = 'already_dumped'; return
        }
        const entry: CredentialEntry = {
          id: `cred_${Date.now()}`,
          sourceNodeId: nodeId,
          sourceNodeType: node.type,
          sourceLabel: `${node.type.replace(/_/g, ' ').toUpperCase()} CREDENTIALS`,
          method: 'dump',
          networkId,
          expiresAt: Date.now() + 8 * 60_000,
        }
        s.credentialCache.push(entry)
        if (s.player?.specialization !== 'ghost' && s.traceState) {
          s.traceState.level = Math.min(s.traceState.level + 1.5, 100)
        }
        s.terminalLines.push({
          id: `log_dump_${Date.now()}`,
          type: 'success',
          text: s.player?.specialization === 'ghost'
            ? `CREDENTIAL DUMP — ${node.label}: silent extraction, no log entry.`
            : `CREDENTIAL DUMP — ${node.label}: credentials extracted (CREDENTIAL_ACCESS logged, +1.5% trace).`,
        })
      })
      return result
    },

    scrapeMemory: (networkId, nodeId) => {
      let result: CredentialEntry | null = null
      set((s) => {
        const network = s.networks[networkId]
        const node = network?.nodes.find((n) => n.id === nodeId)
        if (!node?.isBreached) return
        const adjacent = network!.nodes.filter(
          (n) => node.connectedTo.includes(n.id) && !n.isBreached,
        )
        if (adjacent.length === 0) return
        const target = adjacent[Math.floor(Math.random() * adjacent.length)]
        const entry: CredentialEntry = {
          id: `scraped_${Date.now()}`,
          sourceNodeId: nodeId,
          sourceNodeType: node.type,
          sourceLabel: `MEMORY EXTRACT — ${node.label}`,
          method: 'scrape',
          targetNodeId: target.id,
          targetLabel: target.label,
          networkId,
          expiresAt: Date.now() + 8 * 60_000,
        }
        s.credentialCache.push(entry)
        result = entry
        s.terminalLines.push({
          id: `log_scrape_${Date.now()}`,
          type: 'success',
          text: `MEMORY SCRAPE — process memory read from ${node.label}. Found credentials for ${target.label}. No log entry created.`,
        })
      })
      return result
    },

    useCredential: (networkId, nodeId) => {
      let result: 'ok' | 'no_credential' = 'no_credential'
      set((s) => {
        const network = s.networks[networkId]
        const node = network?.nodes.find((n) => n.id === nodeId)
        if (!node || node.isBreached) return
        const now = Date.now()
        const cred = s.credentialCache.find(
          (c) => c.networkId === networkId && c.expiresAt > now &&
            (c.method === 'dump' || c.targetNodeId === nodeId),
        )
        if (!cred) return
        result = 'ok'
        node.isBreached = true
        if (s.player?.specialization !== 'ghost' && s.traceState) {
          s.traceState.level = Math.min(s.traceState.level + 3, 100)
        }
        s.terminalLines.push({
          id: `log_cred_use_${Date.now()}`,
          type: 'success',
          text: `CREDENTIAL ACCESS — ${node.label} bypassed using cached credentials. No crack required.`,
        })
      })
      return result
    },

    createFaction: (name, tag, description) => {
      let result: 'ok' | 'insufficient_funds' | 'rank_required' | 'already_in_faction' = 'ok'
      set((s) => {
        if (!s.player) { result = 'rank_required'; return }
        if (s.player.faction) { result = 'already_in_faction'; return }
        if (s.player.rank < 3) { result = 'rank_required'; return }
        const FACTION_COST = 50_000
        if (s.player.credits < FACTION_COST) { result = 'insufficient_funds'; return }
        s.player.credits -= FACTION_COST
        s.player.stats.creditsSpent += FACTION_COST
        const inviteCode = Math.random().toString(36).slice(2, 10).toUpperCase()
        const faction: FactionData = {
          id: `faction_${Date.now()}`,
          name,
          tag: tag.toUpperCase().slice(0, 6),
          description,
          createdAt: Date.now(),
          founderHandle: s.player.handle,
          memberHandles: [s.player.handle],
          inviteCode,
        }
        s.player.faction = faction
        s.terminalLines.push({
          id: `log_faction_${Date.now()}`,
          type: 'success',
          text: `FACTION CREATED: [${faction.tag}] ${faction.name}. Invite code: ${inviteCode}`,
        })
      })
      return result
    },

    leaveFaction: () =>
      set((s) => {
        if (!s.player) return
        s.player.faction = null
      }),

    openBankAccount: (bankId) => {
      let result: 'ok' | 'insufficient_funds' | 'already_open' | 'unknown_bank' = 'ok'
      set((s) => {
        if (!s.player) { result = 'insufficient_funds'; return }
        const bank = getBank(bankId)
        if (!bank) { result = 'unknown_bank'; return }
        if (!s.player.bankAccounts) s.player.bankAccounts = {}
        if (s.player.bankAccounts[bankId]) { result = 'already_open'; return }
        if (s.player.credits < bank.openCost) { result = 'insufficient_funds'; return }
        s.player.credits -= bank.openCost
        s.player.stats.creditsSpent += bank.openCost
        s.player.bankAccounts[bankId] = {
          bankId, balance: 0, apr: bank.apr,
          openedAt: Date.now(), lastInterestTickAt: Date.now(),
          totalInterestEarned: 0,
        }
        s.terminalLines.push({
          id: `log_bank_open_${Date.now()}`, type: 'success',
          text: `Account opened at ${bank.name}. APR ${(bank.apr * 100).toFixed(2)}%. Setup fee: ${bank.openCost} Cr.`,
        })
      })
      return result
    },

    bankDeposit: (bankId, amount) => {
      let result: 'ok' | 'insufficient_funds' | 'no_account' = 'ok'
      set((s) => {
        if (!s.player) { result = 'no_account'; return }
        const acct = s.player.bankAccounts?.[bankId]
        if (!acct) { result = 'no_account'; return }
        const amt = Math.max(0, Math.floor(amount))
        if (s.player.credits < amt) { result = 'insufficient_funds'; return }
        s.player.credits -= amt
        acct.balance += amt
        s.terminalLines.push({
          id: `log_bank_dep_${Date.now()}`, type: 'system',
          text: `Deposited ${amt.toLocaleString()} Cr. Balance: ${acct.balance.toLocaleString()} Cr.`,
        })
      })
      return result
    },

    setActiveBank: (bankId) => set((s) => { s.activeBankId = bankId }),

    // ── Consumables (M14h) ───────────────────────────────────────────────────
    buyConsumable: (id, qty = 1) => {
      let result: 'ok' | 'insufficient_funds' | 'unknown' | 'max_stack' = 'ok'
      set((s) => {
        if (!s.player) { result = 'unknown'; return }
        const def = getConsumable(id)
        if (!def) { result = 'unknown'; return }
        if (s.player.reputation < def.unlockReputation) { result = 'unknown'; return }
        const cost = def.price * qty
        if (s.player.credits < cost) { result = 'insufficient_funds'; return }
        if (!s.player.consumables) s.player.consumables = {}
        const max = def.maxStack ?? 5
        const have = s.player.consumables[id] ?? 0
        if (have + qty > max) { result = 'max_stack'; return }
        s.player.credits -= cost
        s.player.stats.creditsSpent += cost
        s.player.consumables[id] = have + qty
        s.terminalLines.push({
          id: `log_buy_consumable_${Date.now()}`, type: 'success',
          text: `Purchased: ${def.name} ×${qty}.`,
        })
      })
      return result
    },

    useConsumable: (id) => {
      let result: 'ok' | 'no_stock' | 'not_applicable' = 'ok'
      set((s) => {
        if (!s.player?.consumables) { result = 'no_stock'; return }
        const have = s.player.consumables[id] ?? 0
        if (have <= 0) { result = 'no_stock'; return }
        const def = getConsumable(id)
        if (!def) { result = 'not_applicable'; return }

        // Apply effect
        const ef = def.effect
        if (ef.kind === 'panic_disconnect') {
          if (!s.traceState) { result = 'not_applicable'; return }
          // Force a clean abandon — reset trace + clear mission state
          if (s.activeMissionId) {
            const m = s.missions.find((mm) => mm.id === s.activeMissionId)
            if (m) {
              m.status = 'available'
              m.objectives.forEach((o) => { o.isCompleted = false })
            }
          }
          s.traceState = null
          s.activeMissionId = null
          s.activeNetworkId = null
          s.selectedNodeId = null
          s.rivalHacker = null
          s.rivalSpawnAt = null
          s.credentialCache = []
          s.activeWindows = s.activeWindows.filter((w) => w.id !== 'hacking' && w.id !== 'network-map')
          s.missionResult = 'abandoned'
          s.terminalLines.push({
            id: `log_panic_${Date.now()}`, type: 'warn',
            text: 'PANIC DISCONNECT — uplink severed. Mission abandoned. Trace cleared.',
          })
        } else if (ef.kind === 'zero_day_pack') {
          s.player.activeFlags.consumable_zero_day_armed = true
          s.terminalLines.push({
            id: `log_zd_${Date.now()}`, type: 'system',
            text: 'Zero-day exploit primed. Your next scan will reveal a guaranteed CVE.',
          })
        } else if (ef.kind === 'decoy_log') {
          s.player.activeFlags.consumable_decoy_active = Date.now() + 600_000  // 10 min cooldown reduction
          s.terminalLines.push({
            id: `log_decoy_${Date.now()}`, type: 'system',
            text: 'Decoy logs planted. Corporate heat diverted for ~10 minutes.',
          })
        } else if (ef.kind === 'false_flag') {
          s.player.activeFlags.consumable_false_flag = true
          s.terminalLines.push({
            id: `log_ff_${Date.now()}`, type: 'system',
            text: 'False flag primed. Next mission attributed to another faction.',
          })
        } else if (ef.kind === 'rep_token') {
          s.player.reputation += ef.amount
          s.terminalLines.push({
            id: `log_rep_${Date.now()}`, type: 'success',
            text: `Reputation token consumed. +${ef.amount} REP. Total: ${s.player.reputation}.`,
          })
        } else if (ef.kind === 'cred_pack') {
          s.player.activeFlags.consumable_cred_pack_armed = true
          s.terminalLines.push({
            id: `log_cp_${Date.now()}`, type: 'system',
            text: 'Pre-acquired credentials loaded. Next CRACK becomes instant bypass.',
          })
        }

        s.player.consumables[id] = have - 1
        if (s.player.consumables[id] === 0) delete s.player.consumables[id]
      })
      return result
    },
    setActiveTargetInfo: (targetId) => set((s) => { s.activeTargetInfoId = targetId }),

    tickBankInterest: () =>
      set((s) => {
        if (!s.player?.bankAccounts) return
        const now = Date.now()
        const YEAR_MS = 365.25 * 24 * 3600 * 1000
        // M14e: savings APR zeroed during market crash
        const crashActive = s.activeWorldEvents.some((e) => e.effect.type === 'market_crash')
        for (const acct of Object.values(s.player.bankAccounts)) {
          // Savings interest (zero during market crash)
          const effectiveApr = crashActive ? 0 : acct.apr
          const dt = now - acct.lastInterestTickAt
          if (dt > 0 && acct.balance > 0 && effectiveApr > 0) {
            const factor = Math.exp(effectiveApr * dt / YEAR_MS)
            const newBalance = acct.balance * factor
            acct.totalInterestEarned += newBalance - acct.balance
            acct.balance = newBalance
          }
          acct.lastInterestTickAt = now

          // Loan interest accrual — grows the principal owed
          if (acct.loanPrincipal && acct.loanPrincipal > 0 && acct.loanRate) {
            const ldt = now - (acct.loanLastInterestTickAt ?? now)
            if (ldt > 0) {
              const factor = Math.exp(acct.loanRate * ldt / YEAR_MS)
              const newPrincipal = acct.loanPrincipal * factor
              acct.loanTotalInterestAccrued = (acct.loanTotalInterestAccrued ?? 0) + (newPrincipal - acct.loanPrincipal)
              acct.loanPrincipal = newPrincipal
            }
            acct.loanLastInterestTickAt = now

            // M14e: loan defaulting — principal exceeds 5× player's liquid assets
            const liquid = s.player.credits + Object.values(s.player.bankAccounts).reduce((sum, a) => sum + a.balance, 0)
            if (acct.loanPrincipal > liquid * 5 && liquid > 0 && !s.player.activeFlags[`loan_default_${acct.bankId}`]) {
              s.player.activeFlags[`loan_default_${acct.bankId}`] = Date.now()
              // Bank reports the default — rep penalty, news article
              s.player.reputation = Math.max(0, s.player.reputation - 50)
              s.terminalLines.push({
                id: `log_loan_default_${Date.now()}`, type: 'error',
                text: `⚠ LOAN DEFAULT at ${acct.bankId}. Principal ${Math.ceil(acct.loanPrincipal).toLocaleString()} Cr exceeds your collateral. -50 REP. Recovery agents have your file.`,
              })
              s.newsFeed.unshift({
                id: `news_default_${Date.now()}`, timestamp: Date.now(),
                headline: 'Unidentified Borrower Flagged for Loan Default',
                body: `${acct.bankId} has placed a recovery contract on an anonymous high-risk borrower after their outstanding principal exceeded all liquid collateral. Independent recovery agents are reportedly evaluating the case.`,
                category: 'crime', isPlayerAction: true,
              })
            }
          }
        }
      }),

    bankWithdraw: (bankId, amount) => {
      let result: 'ok' | 'insufficient_balance' | 'no_account' = 'ok'
      set((s) => {
        if (!s.player) { result = 'no_account'; return }
        const acct = s.player.bankAccounts?.[bankId]
        if (!acct) { result = 'no_account'; return }
        const amt = Math.max(0, Math.floor(amount))
        if (acct.balance < amt) { result = 'insufficient_balance'; return }
        acct.balance -= amt
        s.player.credits += amt
        s.terminalLines.push({
          id: `log_bank_wd_${Date.now()}`, type: 'system',
          text: `Withdrew ${amt.toLocaleString()} Cr. Balance: ${acct.balance.toLocaleString()} Cr.`,
        })
      })
      return result
    },

    // ── Loans ────────────────────────────────────────────────────────────────
    takeLoan: (bankId, amount) => {
      let result: 'ok' | 'no_account' | 'over_limit' | 'has_loan' | 'no_loans_at_bank' = 'ok'
      set((s) => {
        if (!s.player) { result = 'no_account'; return }
        const bank = getBank(bankId)
        const acct = s.player.bankAccounts?.[bankId]
        if (!bank || !acct) { result = 'no_account'; return }
        if (!bank.features.includes('loans') || bank.maxLoanMultiplier <= 0) { result = 'no_loans_at_bank'; return }
        if ((acct.loanPrincipal ?? 0) > 0) { result = 'has_loan'; return }
        const amt = Math.max(0, Math.floor(amount))
        // Max loan = max(player credits, bank balance) × multiplier, with a floor of 1000
        const collateral = Math.max(s.player.credits + acct.balance, 1000)
        const maxLoan = Math.floor(collateral * bank.maxLoanMultiplier)
        if (amt > maxLoan) { result = 'over_limit'; return }
        s.player.credits += amt
        s.player.stats.creditsEarned += amt
        acct.loanPrincipal = amt
        acct.loanRate = bank.loanRate
        acct.loanTakenAt = Date.now()
        acct.loanLastInterestTickAt = Date.now()
        acct.loanTotalInterestAccrued = 0
        s.terminalLines.push({
          id: `log_loan_${Date.now()}`, type: 'success',
          text: `Loan approved: ${amt.toLocaleString()} Cr @ ${(bank.loanRate * 100).toFixed(2)}% APR from ${bank.name}.`,
        })
      })
      return result
    },

    repayLoan: (bankId, amount) => {
      let result: 'ok' | 'no_account' | 'no_loan' | 'insufficient_funds' = 'ok'
      set((s) => {
        if (!s.player) { result = 'no_account'; return }
        const acct = s.player.bankAccounts?.[bankId]
        if (!acct) { result = 'no_account'; return }
        if (!acct.loanPrincipal || acct.loanPrincipal <= 0) { result = 'no_loan'; return }
        const amt = Math.min(Math.max(0, Math.floor(amount)), Math.ceil(acct.loanPrincipal))
        if (s.player.credits < amt) { result = 'insufficient_funds'; return }
        s.player.credits -= amt
        s.player.stats.creditsSpent += amt
        acct.loanPrincipal -= amt
        if (acct.loanPrincipal < 0.01) {
          acct.loanPrincipal = 0
          acct.loanRate = undefined
          acct.loanTakenAt = undefined
          acct.loanLastInterestTickAt = undefined
          s.terminalLines.push({
            id: `log_loan_paid_${Date.now()}`, type: 'success',
            text: `Loan repaid in full at ${getBank(bankId)?.name ?? bankId}.`,
          })
        } else {
          s.terminalLines.push({
            id: `log_loan_pay_${Date.now()}`, type: 'system',
            text: `Repaid ${amt.toLocaleString()} Cr. Principal remaining: ${Math.ceil(acct.loanPrincipal).toLocaleString()} Cr.`,
          })
        }
      })
      return result
    },

    // ── Currency trading ─────────────────────────────────────────────────────
    tradeCurrency: (direction, amountCr) => {
      let result: 'ok' | 'insufficient_funds' = 'ok'
      set((s) => {
        if (!s.player) { result = 'insufficient_funds'; return }
        const rate = s.darkcoinExchangeRate
        if (!s.player.darkcoin) s.player.darkcoin = 0
        if (direction === 'buy_dc') {
          // Pay Cr, receive Darkcoin at current rate (small 1% spread)
          const cr = Math.max(0, Math.floor(amountCr))
          if (s.player.credits < cr) { result = 'insufficient_funds'; return }
          const dc = (cr * 0.99) / rate
          s.player.credits -= cr
          s.player.darkcoin += dc
          s.terminalLines.push({
            id: `log_dc_buy_${Date.now()}`, type: 'system',
            text: `Bought ${dc.toFixed(4)} DC for ${cr.toLocaleString()} Cr @ ${rate.toFixed(2)} Cr/DC.`,
          })
        } else {
          // sell_dc — amountCr is interpreted as DC amount × 1000 (to keep one numeric input)
          // Actually, treat amountCr as direct DC amount × 100 for fractional clarity
          // Simpler: the UI sends DC * 10000 as integer; here we convert back
          const dcAmount = amountCr / 10000  // DC quantity
          if (s.player.darkcoin < dcAmount) { result = 'insufficient_funds'; return }
          const cr = Math.floor(dcAmount * rate * 0.99)
          s.player.darkcoin -= dcAmount
          s.player.credits += cr
          s.terminalLines.push({
            id: `log_dc_sell_${Date.now()}`, type: 'system',
            text: `Sold ${dcAmount.toFixed(4)} DC for ${cr.toLocaleString()} Cr @ ${rate.toFixed(2)} Cr/DC.`,
          })
        }
      })
      return result
    },

    // ── Stocks ───────────────────────────────────────────────────────────────
    buyStock: (stockId, shares) => {
      let result: 'ok' | 'insufficient_funds' | 'invalid_amount' = 'ok'
      set((s) => {
        if (!s.player) { result = 'insufficient_funds'; return }
        const stock = getStock(stockId)
        if (!stock || shares <= 0 || !Number.isFinite(shares)) { result = 'invalid_amount'; return }
        const n = Math.floor(shares)
        const price = s.stockPrices[stockId] ?? stock.basePrice
        const cost = Math.ceil(price * n)
        if (s.player.credits < cost) { result = 'insufficient_funds'; return }
        if (!s.player.stockHoldings) s.player.stockHoldings = {}
        const h = s.player.stockHoldings[stockId] ?? { stockId, shares: 0, costBasis: 0 }
        h.shares += n
        h.costBasis += cost
        s.player.stockHoldings[stockId] = h
        s.player.credits -= cost
        s.player.stats.creditsSpent += cost
        s.terminalLines.push({
          id: `log_stock_buy_${Date.now()}`, type: 'system',
          text: `Bought ${n} ${stock.ticker} @ ${price.toFixed(2)} Cr. Total: ${cost.toLocaleString()} Cr.`,
        })
      })
      return result
    },

    sellStock: (stockId, shares) => {
      let result: 'ok' | 'insufficient_shares' | 'invalid_amount' = 'ok'
      set((s) => {
        if (!s.player) { result = 'insufficient_shares'; return }
        const stock = getStock(stockId)
        if (!stock || shares <= 0 || !Number.isFinite(shares)) { result = 'invalid_amount'; return }
        const n = Math.floor(shares)
        const h = s.player.stockHoldings?.[stockId]
        if (!h || h.shares < n) { result = 'insufficient_shares'; return }
        const price = s.stockPrices[stockId] ?? stock.basePrice
        const proceeds = Math.floor(price * n)
        // Reduce cost basis proportionally
        const fraction = n / h.shares
        const reduced = h.costBasis * fraction
        h.shares -= n
        h.costBasis -= reduced
        if (h.shares === 0) delete s.player.stockHoldings![stockId]
        s.player.credits += proceeds
        s.player.stats.creditsEarned += proceeds
        const pnl = proceeds - reduced
        s.terminalLines.push({
          id: `log_stock_sell_${Date.now()}`, type: pnl >= 0 ? 'success' : 'warn',
          text: `Sold ${n} ${stock.ticker} @ ${price.toFixed(2)} Cr. Realised P&L: ${pnl >= 0 ? '+' : ''}${pnl.toFixed(0)} Cr.`,
        })
      })
      return result
    },

    // ── Market simulation tick ───────────────────────────────────────────────
    tickMarket: () =>
      set((s) => {
        const now = Date.now()
        const dt = now - s.lastMarketTickAt
        if (dt < 1500) return  // throttle: only update every 1.5s of real time
        s.lastMarketTickAt = now

        // M14e: market crash event active → stocks crash, no mean reversion
        const crashActive = s.activeWorldEvents.some((e) => e.effect.type === 'market_crash')

        for (const stock of STOCKS) {
          const cur = s.stockPrices[stock.id] ?? stock.basePrice
          if (crashActive) {
            // Aggressive downward drift, no mean reversion. ~5% per tick at most.
            const next = Math.max(stock.basePrice * 0.4, cur * (0.94 + Math.random() * 0.04))
            s.stockPrices[stock.id] = next
          } else {
            const noise = (Math.random() - 0.5) * 2 * stock.volatility * cur
            const meanReversion = (stock.basePrice - cur) * 0.005
            const next = Math.max(0.5, cur + noise + meanReversion)
            s.stockPrices[stock.id] = next
          }
        }
        const dcNoise = (Math.random() - 0.5) * 2 * 0.025 * s.darkcoinExchangeRate
        const dcDrift = (142 - s.darkcoinExchangeRate) * 0.002
        s.darkcoinExchangeRate = Math.max(20, s.darkcoinExchangeRate + dcNoise + dcDrift)
      }),

    logout: () => {
      saveGame()
      clearActiveSession()
      useGameStore.setState({
        screen: 'login',
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
        newsFeed: [],
        activeWorldEvents: [],
        nextWorldEventAt: null,
        missionResult: null,
        pendingSpecialization: false,
        activeRoute: [],
        credentialCache: [],
        activeBankId: null,
        activeTargetInfoId: null,
        connectingUntil: null,
      })
    },
  })),
)

// Expose store for WebGL CRT overlay (reads trace level without React subscription overhead)
;(window as any).__voidlinkStore = useGameStore
