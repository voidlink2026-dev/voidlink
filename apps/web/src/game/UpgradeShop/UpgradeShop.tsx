import { useState } from 'react'
import { useGameStore } from '../../store/gameStore.ts'
import { Button } from '@voidlink/ui'
import { HARDWARE_CATALOGUE, SOFTWARE_CATALOGUE } from '@voidlink/core'
import type { HardwareDefinition, ToolDefinition } from '@voidlink/core'
import styles from './UpgradeShop.module.css'

type Tab = 'hardware' | 'software'

export function UpgradeShop() {
  const [tab, setTab] = useState<Tab>('hardware')
  const player = useGameStore((s) => s.player)
  const buyHardware = useGameStore((s) => s.buyHardware)
  const buyTool = useGameStore((s) => s.buyTool)
  const logTerminal = useGameStore((s) => s.logTerminal)

  if (!player) return <div className={styles.empty}>No profile loaded.</div>

  function handleBuyHardware(item: HardwareDefinition) {
    const result = buyHardware(item)
    if (result === 'ok') {
      logTerminal(`Purchased: ${item.name} — installed successfully.`, 'success')
    } else if (result === 'insufficient_funds') {
      logTerminal(`DENIED: Insufficient credits for ${item.name}.`, 'error')
    } else {
      logTerminal(`${item.name}: already installed or superseded.`, 'dim')
    }
  }

  function handleBuyTool(item: ToolDefinition) {
    const result = buyTool(item)
    if (result === 'ok') {
      logTerminal(`Purchased: ${item.name} — added to software loadout.`, 'success')
    } else if (result === 'insufficient_funds') {
      logTerminal(`DENIED: Insufficient credits for ${item.name}.`, 'error')
    } else {
      logTerminal(`${item.name}: already in your loadout.`, 'dim')
    }
  }

  const ownedToolIds = new Set([
    ...player.software.passwordCrackers,
    ...player.software.proxies,
    ...player.software.logDeleters,
    ...player.software.portScanners,
    ...player.software.firewallBypassers,
    ...player.software.misc,
  ].map((t) => t.toolId))

  return (
    <div className={styles.shop}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.balance}>
          <span className={styles.balanceLabel}>AVAILABLE CREDITS</span>
          <span className={styles.balanceValue}>{player.credits.toLocaleString()} Cr</span>
        </div>
        <div className={styles.repLine}>
          REP {player.reputation} · Rank {player.rank}
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs} role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'hardware'}
          className={`${styles.tab} ${tab === 'hardware' ? styles.tabActive : ''}`}
          onClick={() => setTab('hardware')}
        >
          HARDWARE
        </button>
        <button
          role="tab"
          aria-selected={tab === 'software'}
          className={`${styles.tab} ${tab === 'software' ? styles.tabActive : ''}`}
          onClick={() => setTab('software')}
        >
          SOFTWARE
        </button>
      </div>

      {/* Item list */}
      <div className={styles.list} role="tabpanel">
        {tab === 'hardware' &&
          HARDWARE_CATALOGUE.map((item) => {
            const statKey = item.slot as keyof typeof player.hardware
            const currentVal = player.hardware[statKey] as number
            const canAfford = player.credits >= item.price
            const locked = player.reputation < item.unlockReputation
            const owned = currentVal >= (item.tier * 2)

            return (
              <ShopItem
                key={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                canAfford={canAfford}
                locked={locked}
                owned={owned}
                lockRep={item.unlockReputation}
                badge={`T${item.tier}`}
                stat={`${item.slot.replace(/([A-Z])/g, ' $1').toUpperCase()} +${Object.values(item.statBoost)[0]}`}
                onBuy={() => handleBuyHardware(item)}
              />
            )
          })}

        {tab === 'software' &&
          SOFTWARE_CATALOGUE.map((item) => {
            const canAfford = player.credits >= item.unlockPrice
            const locked = player.reputation < item.unlockReputation
            const owned = ownedToolIds.has(item.id)

            return (
              <ShopItem
                key={item.id}
                name={item.name}
                description={item.description}
                price={item.unlockPrice}
                canAfford={canAfford}
                locked={locked}
                owned={owned}
                lockRep={item.unlockReputation}
                badge={item.category.toUpperCase()}
                stat={`RAM: ${item.ramCost} slot${item.ramCost > 1 ? 's' : ''}`}
                onBuy={() => handleBuyTool(item)}
              />
            )
          })}
      </div>
    </div>
  )
}

function ShopItem({
  name, description, price, canAfford, locked, owned, lockRep, badge, stat, onBuy,
}: {
  name: string
  description: string
  price: number
  canAfford: boolean
  locked: boolean
  owned: boolean
  lockRep: number
  badge: string
  stat: string
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
          <Button
            variant="primary"
            size="sm"
            onClick={onBuy}
            disabled={!canAfford}
          >
            BUY
          </Button>
        )}
      </div>
    </div>
  )
}
