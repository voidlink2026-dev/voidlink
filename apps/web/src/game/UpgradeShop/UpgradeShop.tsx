import { useState, useMemo } from 'react'
import { useGameStore } from '../../store/gameStore.ts'
import { Button } from '@voidlink/ui'
import { HARDWARE_CATALOGUE, SOFTWARE_CATALOGUE } from '@voidlink/core'
import type { HardwareDefinition, ToolDefinition } from '@voidlink/core'
import styles from './UpgradeShop.module.css'

type View = 'graph' | 'list'
type NodeState = 'starter' | 'owned' | 'affordable' | 'locked-rep' | 'locked-funds' | 'unbuyable-prev'
type ItemDef =
  | { kind: 'hw'; data: HardwareDefinition }
  | { kind: 'sw'; data: ToolDefinition }

// ── Graph layout ─────────────────────────────────────────────────────────────
// Each column is one upgrade chain. Each row is a tier (1 = starter at top).
// Hardware columns: CPU, RAM, MODEM, GATEWAY.
// Software columns: CRACKER, PROXY, LOG, SCAN, FW, MISC.
interface NodeLayout {
  id: string                       // unique key (`hw:cpu_t2`, `sw:cracker_v3`, or `starter:cpu`)
  col: number                      // column index
  tier: number                     // row index (1..N)
  label: string
  badge: string
  isStarter?: boolean              // synthetic node — always owned, not buyable
  item?: ItemDef
}

const HW_COLS: { slot: HardwareDefinition['slot']; label: string; col: number; starterLabel: string }[] = [
  { slot: 'cpuSpeed',         label: 'CPU',     col: 0, starterLabel: 'CPU v1 (1 GHz)' },
  { slot: 'ramSlots',         label: 'RAM',     col: 1, starterLabel: 'RAM (2 slots)' },
  { slot: 'modemSpeed',       label: 'MODEM',   col: 2, starterLabel: 'Modem (10 Mb/s)' },
  { slot: 'gatewayBandwidth', label: 'GATEWAY', col: 3, starterLabel: 'Gateway (10 Mb/s)' },
]

const SW_COLS: { category: ToolDefinition['category']; label: string; col: number; starterId?: string; starterLabel?: string }[] = [
  { category: 'password',     label: 'CRACKER', col: 4, starterId: 'cracker_basic',     starterLabel: 'Cracker v1' },
  { category: 'proxy',        label: 'PROXY',   col: 5, starterId: 'proxy_basic',       starterLabel: 'Proxy v1' },
  { category: 'log',          label: 'LOG',     col: 6, starterId: 'log_deleter_basic', starterLabel: 'Log Deleter v1' },
  { category: 'port_scanner', label: 'SCAN',    col: 7, starterId: 'port_scanner_basic', starterLabel: 'Port Scanner v1' },
  { category: 'firewall',     label: 'FW',      col: 8 },
  { category: 'misc',         label: 'MISC',    col: 9 },
]

function buildLayout(): { nodes: NodeLayout[]; edges: { from: string; to: string }[] } {
  const nodes: NodeLayout[] = []
  const edges: { from: string; to: string }[] = []

  // Hardware: starter row + tiers from catalogue
  for (const c of HW_COLS) {
    const starterId = `starter:${c.slot}`
    nodes.push({ id: starterId, col: c.col, tier: 1, label: c.starterLabel, badge: 'T1', isStarter: true })
    const items = HARDWARE_CATALOGUE.filter((h) => h.slot === c.slot).sort((a, b) => a.tier - b.tier)
    let prev = starterId
    for (const item of items) {
      const id = `hw:${item.id}`
      nodes.push({ id, col: c.col, tier: item.tier, label: item.name, badge: `T${item.tier}`, item: { kind: 'hw', data: item } })
      edges.push({ from: prev, to: id })
      prev = id
    }
  }

  // Software: starter (if any) + version chain
  for (const c of SW_COLS) {
    let prev: string | null = null
    if (c.starterId && c.starterLabel) {
      const starterId = `starter:${c.starterId}`
      nodes.push({ id: starterId, col: c.col, tier: 1, label: c.starterLabel, badge: 'v1', isStarter: true })
      prev = starterId
    }
    const items = SOFTWARE_CATALOGUE.filter((s) => s.category === c.category)
    items.forEach((item, i) => {
      const id = `sw:${item.id}`
      // Software v2/v3/v4 = tier 2/3/4 visually; for single items without starter, tier 2
      const tier = c.starterId ? i + 2 : i + 2
      nodes.push({ id, col: c.col, tier, label: item.name, badge: `v${i + 2}`, item: { kind: 'sw', data: item } })
      if (prev) edges.push({ from: prev, to: id })
      prev = id
    })
  }

  return { nodes, edges }
}

// ── Component ────────────────────────────────────────────────────────────────
export function UpgradeShop() {
  const [view, setView] = useState<View>('graph')
  const [selected, setSelected] = useState<string | null>(null)
  const player = useGameStore((s) => s.player)
  const buyHardware = useGameStore((s) => s.buyHardware)
  const buyTool = useGameStore((s) => s.buyTool)
  const logTerminal = useGameStore((s) => s.logTerminal)

  const { nodes, edges } = useMemo(() => buildLayout(), [])

  if (!player) return <div className={styles.empty}>No profile loaded.</div>
  const p = player  // narrow into a local const so closures keep the non-null type

  const ownedToolIds = new Set([
    ...p.software.passwordCrackers,
    ...p.software.proxies,
    ...p.software.logDeleters,
    ...p.software.portScanners,
    ...p.software.firewallBypassers,
    ...p.software.misc,
  ].map((t) => t.toolId))

  function isHwOwned(item: HardwareDefinition): boolean {
    const statKey = item.slot as keyof typeof p.hardware
    const currentVal = p.hardware[statKey] as number
    return currentVal >= (item.tier * 2)
  }

  function nodeState(n: NodeLayout): NodeState {
    if (n.isStarter) return 'starter'
    if (!n.item) return 'unbuyable-prev'
    if (n.item.kind === 'hw') {
      if (isHwOwned(n.item.data)) return 'owned'
      if (p.reputation < n.item.data.unlockReputation) return 'locked-rep'
      if (p.credits < n.item.data.price) return 'locked-funds'
      return 'affordable'
    } else {
      if (ownedToolIds.has(n.item.data.id)) return 'owned'
      if (p.reputation < n.item.data.unlockReputation) return 'locked-rep'
      if (p.credits < n.item.data.unlockPrice) return 'locked-funds'
      return 'affordable'
    }
  }

  function handleBuy(item: ItemDef) {
    if (item.kind === 'hw') {
      const result = buyHardware(item.data)
      if (result === 'ok') logTerminal(`Purchased: ${item.data.name} — installed successfully.`, 'success')
      else if (result === 'insufficient_funds') logTerminal(`DENIED: Insufficient credits for ${item.data.name}.`, 'error')
      else logTerminal(`${item.data.name}: already installed or superseded.`, 'dim')
    } else {
      const result = buyTool(item.data)
      if (result === 'ok') logTerminal(`Purchased: ${item.data.name} — added to software loadout.`, 'success')
      else if (result === 'insufficient_funds') logTerminal(`DENIED: Insufficient credits for ${item.data.name}.`, 'error')
      else logTerminal(`${item.data.name}: already in your loadout.`, 'dim')
    }
  }

  // ── Layout constants ──────────────────────────────────────────────────────
  const COL_GAP = 110
  const ROW_GAP = 90
  const COL_OFFSET = 60
  const ROW_OFFSET = 50
  const NODE_R = 18

  const xOf = (col: number) => COL_OFFSET + col * COL_GAP
  const yOf = (tier: number) => ROW_OFFSET + (tier - 1) * ROW_GAP

  const maxCol = Math.max(...nodes.map((n) => n.col))
  const maxTier = Math.max(...nodes.map((n) => n.tier))
  const width = COL_OFFSET * 2 + maxCol * COL_GAP
  const height = ROW_OFFSET * 2 + (maxTier - 1) * ROW_GAP

  const selectedNode = selected ? nodes.find((n) => n.id === selected) : null

  return (
    <div className={styles.shop}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.balance}>
          <span className={styles.balanceLabel}>AVAILABLE CREDITS</span>
          <span className={styles.balanceValue}>{player.credits.toLocaleString()} Cr</span>
        </div>
        <div className={styles.repLine}>REP {player.reputation} · Rank {player.rank}</div>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleBtn} ${view === 'graph' ? styles.toggleActive : ''}`}
            onClick={() => setView('graph')}
          >GRAPH</button>
          <button
            className={`${styles.toggleBtn} ${view === 'list' ? styles.toggleActive : ''}`}
            onClick={() => setView('list')}
          >LIST</button>
        </div>
      </div>

      {view === 'graph' ? (
        <div className={styles.graphLayout}>
          <div className={styles.graphCanvas}>
            <svg width={width} height={height} className={styles.graphSvg}>
              {/* Column headers */}
              {[...HW_COLS, ...SW_COLS].map((c) => (
                <text key={c.label} x={xOf(c.col)} y={20} textAnchor="middle" className={styles.colHeader}>
                  {c.label}
                </text>
              ))}

              {/* HW / SW band separator */}
              <line
                x1={(xOf(3) + xOf(4)) / 2} y1={36}
                x2={(xOf(3) + xOf(4)) / 2} y2={height - 10}
                className={styles.bandSeparator}
              />
              <text x={(xOf(0) + xOf(3)) / 2} y={36} textAnchor="middle" className={styles.bandHeader}>HARDWARE</text>
              <text x={(xOf(4) + xOf(9)) / 2} y={36} textAnchor="middle" className={styles.bandHeader}>SOFTWARE</text>

              {/* Edges */}
              {edges.map((e) => {
                const a = nodes.find((n) => n.id === e.from)
                const b = nodes.find((n) => n.id === e.to)
                if (!a || !b) return null
                const aOwned = nodeState(a) === 'owned' || nodeState(a) === 'starter'
                return (
                  <line
                    key={`${e.from}->${e.to}`}
                    x1={xOf(a.col)} y1={yOf(a.tier)}
                    x2={xOf(b.col)} y2={yOf(b.tier)}
                    className={aOwned ? styles.edgeActive : styles.edge}
                  />
                )
              })}

              {/* Nodes */}
              {nodes.map((n) => {
                const state = nodeState(n)
                const isSelected = selected === n.id
                return (
                  <g
                    key={n.id}
                    transform={`translate(${xOf(n.col)}, ${yOf(n.tier)})`}
                    className={`${styles.nodeGroup} ${styles[`node_${state}`]} ${isSelected ? styles.nodeSelected : ''}`}
                    onClick={() => setSelected(n.id)}
                  >
                    <circle r={NODE_R} className={styles.nodeCircle} />
                    {state === 'owned' && <text y={5} textAnchor="middle" className={styles.nodeCheck}>✓</text>}
                    {state === 'starter' && <text y={5} textAnchor="middle" className={styles.nodeCheck}>●</text>}
                    {state === 'locked-rep' && <text y={5} textAnchor="middle" className={styles.nodeLock}>🔒</text>}
                    {(state === 'affordable' || state === 'locked-funds') && (
                      <text y={5} textAnchor="middle" className={styles.nodeBadge}>{n.badge}</text>
                    )}
                    <text y={NODE_R + 14} textAnchor="middle" className={styles.nodeLabel}>{n.label.split(' — ')[0]}</text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Side panel — node detail */}
          <aside className={styles.detailPanel}>
            {!selectedNode ? (
              <div className={styles.detailHint}>
                <div className={styles.detailHintHeader}>UPGRADE TREE</div>
                <p>Each column is an upgrade chain. Hover (or click) a node to see details and buy it.</p>
                <div className={styles.legend}>
                  <LegendDot state="starter" label="Starter (always owned)" />
                  <LegendDot state="owned" label="Owned" />
                  <LegendDot state="affordable" label="Can buy now" />
                  <LegendDot state="locked-funds" label="Not enough credits" />
                  <LegendDot state="locked-rep" label="Not enough reputation" />
                </div>
              </div>
            ) : (
              <NodeDetail node={selectedNode} state={nodeState(selectedNode)} player={player} onBuy={handleBuy} />
            )}
          </aside>
        </div>
      ) : (
        <ListView
          player={player}
          ownedToolIds={ownedToolIds}
          onBuyHw={(it) => handleBuy({ kind: 'hw', data: it })}
          onBuySw={(it) => handleBuy({ kind: 'sw', data: it })}
        />
      )}
    </div>
  )
}

function LegendDot({ state, label }: { state: string; label: string }) {
  return (
    <div className={styles.legendRow}>
      <span className={`${styles.legendDot} ${styles[`node_${state}`]}`} />
      <span className={styles.legendLabel}>{label}</span>
    </div>
  )
}

function NodeDetail({
  node, state, player, onBuy,
}: {
  node: NodeLayout; state: NodeState; player: import('@voidlink/core').PlayerProfile
  onBuy: (item: ItemDef) => void
}) {
  if (node.isStarter || !node.item) {
    return (
      <div>
        <div className={styles.detailName}>{node.label}</div>
        <div className={styles.detailBadge}>STARTER ITEM</div>
        <p className={styles.detailDesc}>You start with this. It's always installed.</p>
      </div>
    )
  }
  const item = node.item
  const isHw = item.kind === 'hw'
  const price = isHw ? item.data.price : item.data.unlockPrice
  const lockRep = isHw ? item.data.unlockReputation : item.data.unlockReputation
  const desc = item.data.description
  const stat = isHw
    ? `${item.data.slot.replace(/([A-Z])/g, ' $1').toUpperCase()} +${Object.values(item.data.statBoost)[0]}`
    : `RAM: ${item.data.ramCost} slot${item.data.ramCost > 1 ? 's' : ''}`

  return (
    <div>
      <div className={styles.detailName}>{item.data.name}</div>
      <div className={styles.detailBadge}>{node.badge}</div>
      <p className={styles.detailDesc}>{desc}</p>
      <div className={styles.detailStat}>{stat}</div>
      <div className={styles.detailPrice}>{price.toLocaleString()} Cr</div>
      {state === 'owned' ? (
        <div className={styles.installedTag}>INSTALLED</div>
      ) : state === 'locked-rep' ? (
        <div className={styles.lockedTag}>Requires {lockRep} REP (you have {player.reputation})</div>
      ) : state === 'locked-funds' ? (
        <div className={styles.lockedTag}>Need {(price - player.credits).toLocaleString()} more Cr</div>
      ) : (
        <Button variant="primary" size="md" onClick={() => onBuy(item)} className={styles.buyBtn}>
          BUY — {price.toLocaleString()} Cr
        </Button>
      )}
    </div>
  )
}

// ── List view (legacy) ────────────────────────────────────────────────────
function ListView({
  player, ownedToolIds, onBuyHw, onBuySw,
}: {
  player: import('@voidlink/core').PlayerProfile
  ownedToolIds: Set<string>
  onBuyHw: (it: HardwareDefinition) => void
  onBuySw: (it: ToolDefinition) => void
}) {
  const [tab, setTab] = useState<'hardware' | 'software'>('hardware')
  return (
    <>
      <div className={styles.tabs} role="tablist">
        <button role="tab" aria-selected={tab === 'hardware'}
          className={`${styles.tab} ${tab === 'hardware' ? styles.tabActive : ''}`}
          onClick={() => setTab('hardware')}>HARDWARE</button>
        <button role="tab" aria-selected={tab === 'software'}
          className={`${styles.tab} ${tab === 'software' ? styles.tabActive : ''}`}
          onClick={() => setTab('software')}>SOFTWARE</button>
      </div>
      <div className={styles.list} role="tabpanel">
        {tab === 'hardware' && HARDWARE_CATALOGUE.map((item) => {
          const statKey = item.slot as keyof typeof player.hardware
          const currentVal = player.hardware[statKey] as number
          const canAfford = player.credits >= item.price
          const locked = player.reputation < item.unlockReputation
          const owned = currentVal >= (item.tier * 2)
          return (
            <ShopItem key={item.id}
              name={item.name} description={item.description} price={item.price}
              canAfford={canAfford} locked={locked} owned={owned} lockRep={item.unlockReputation}
              badge={`T${item.tier}`}
              stat={`${item.slot.replace(/([A-Z])/g, ' $1').toUpperCase()} +${Object.values(item.statBoost)[0]}`}
              onBuy={() => onBuyHw(item)} />
          )
        })}
        {tab === 'software' && SOFTWARE_CATALOGUE.map((item) => {
          const canAfford = player.credits >= item.unlockPrice
          const locked = player.reputation < item.unlockReputation
          const owned = ownedToolIds.has(item.id)
          return (
            <ShopItem key={item.id}
              name={item.name} description={item.description} price={item.unlockPrice}
              canAfford={canAfford} locked={locked} owned={owned} lockRep={item.unlockReputation}
              badge={item.category.toUpperCase()}
              stat={`RAM: ${item.ramCost} slot${item.ramCost > 1 ? 's' : ''}`}
              onBuy={() => onBuySw(item)} />
          )
        })}
      </div>
    </>
  )
}

function ShopItem({
  name, description, price, canAfford, locked, owned, lockRep, badge, stat, onBuy,
}: {
  name: string; description: string; price: number
  canAfford: boolean; locked: boolean; owned: boolean
  lockRep: number; badge: string; stat: string
  onBuy: () => void
}) {
  return (
    <div className={`${styles.item} ${owned ? styles.itemOwned : ''} ${locked ? styles.itemLocked : ''}`}>
      <div className={styles.itemLeft}>
        <div className={styles.itemHeader}>
          <span className={styles.itemName}>{name}</span>
          <span className={styles.badge}>{badge}</span>
        </div>
        <div className={styles.itemDesc}>{description}</div>
        <div className={styles.itemStat}>{stat}</div>
      </div>
      <div className={styles.itemRight}>
        <div className={`${styles.price} ${!canAfford && !owned ? styles.priceAfford : ''}`}>
          {price.toLocaleString()} Cr
        </div>
        {locked ? (
          <div className={styles.locked}>REP {lockRep} required</div>
        ) : owned ? (
          <div className={styles.ownedBadge}>INSTALLED</div>
        ) : (
          <Button variant="primary" size="sm" onClick={onBuy} disabled={!canAfford}>BUY</Button>
        )}
      </div>
    </div>
  )
}
