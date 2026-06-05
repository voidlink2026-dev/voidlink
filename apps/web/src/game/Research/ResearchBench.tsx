import { useGameStore } from '../../store/gameStore.ts'
import { RESEARCH_TREE, hasResearch } from '@voidlink/core'
import type { ResearchBranch, ResearchNode } from '@voidlink/core'
import { AudioEngine } from '../Audio/audioEngine.ts'
import styles from './ResearchBench.module.css'

const BRANCH_ORDER: ResearchBranch[] = ['crypto', 'stealth', 'hardware', 'social', 'ai']
const BRANCH_LABELS: Record<ResearchBranch, string> = {
  crypto: 'CRYPTO',
  stealth: 'STEALTH',
  hardware: 'HARDWARE',
  social: 'SOCIAL',
  ai: 'AI',
}
const BRANCH_CSS: Record<ResearchBranch, string> = {
  crypto: styles.bCrypto,
  stealth: styles.bStealth,
  hardware: styles.bHardware,
  social: styles.bSocial,
  ai: styles.bAi,
}

export function ResearchBench() {
  const player          = useGameStore((s) => s.player)
  const unlockResearch  = useGameStore((s) => s.unlockResearch)
  const logTerminal     = useGameStore((s) => s.logTerminal)

  if (!player) return null
  const rp = player.researchPoints ?? 0

  function handleUnlock(node: ResearchNode) {
    if (!player) return
    const r = unlockResearch(node.id)
    if (r === 'ok') AudioEngine.playSfx('success')
    else if (r === 'already_owned') logTerminal(`${node.name} already researched.`, 'dim')
    else if (r === 'insufficient_rp') logTerminal(`Need more RP for ${node.name}.`, 'error')
    else if (r === 'prereq_locked') logTerminal(`${node.name}: prereq required (${node.prereqId}).`, 'error')
    else if (r === 'flag_locked') logTerminal(`${node.name}: story-gated. Make contact first.`, 'error')
    else logTerminal(`${node.name}: research failed.`, 'error')
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span className={styles.title}>RESEARCH BENCH</span>
        <span className={styles.rpPill}>{rp} RP</span>
      </div>

      <div className={styles.branches}>
        {BRANCH_ORDER.map((branch) => {
          const nodes = RESEARCH_TREE.filter((n) => n.branch === branch)
          return (
            <div key={branch} className={styles.branch}>
              <div className={`${styles.branchLabel} ${BRANCH_CSS[branch]}`}>{BRANCH_LABELS[branch]}</div>
              {nodes.map((node) => {
                const owned = hasResearch(player, node.id)
                const prereqMet = !node.prereqId || hasResearch(player, node.prereqId)
                const flagOk = !node.flagGate
                  || ((typeof player.activeFlags[node.flagGate.key] === 'number'
                        ? player.activeFlags[node.flagGate.key] as number
                        : player.activeFlags[node.flagGate.key] ? 1 : 0) >= (node.flagGate.min ?? 1))
                const adjustedCost = branch === 'crypto' && hasResearch(player, 'C2')
                  ? Math.max(1, node.cost - 1)
                  : node.cost
                const canAfford = rp >= adjustedCost
                const locked = !prereqMet || !flagOk
                const cls = `${styles.node} ${owned ? styles.nodeOwned : locked ? styles.nodeLocked : canAfford ? styles.nodeAffordable : ''}`
                return (
                  <div
                    key={node.id}
                    className={cls}
                    onClick={() => !owned && !locked && canAfford && handleUnlock(node)}
                    title={node.description}
                  >
                    <div className={styles.nodeHead}>
                      <span className={styles.nodeId}>{node.id}</span>
                      {owned ? (
                        <span className={styles.ownedTag}>★</span>
                      ) : (
                        <span className={styles.nodeCost}>{adjustedCost} RP</span>
                      )}
                    </div>
                    <div className={styles.nodeName}>{node.name}</div>
                    <div className={styles.nodeEffect}>{node.effectLabel}</div>
                    {node.prereqId && !prereqMet && (
                      <div className={styles.nodePrereq}>req {node.prereqId}</div>
                    )}
                    {!flagOk && (
                      <div className={styles.nodePrereq}>story-gated</div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      <div className={styles.blurb}>
        Earn RP by completing contracts — base 1 RP per difficulty tier, +1 for clean runs (no IDS triggered), +1 if every wiped node was also timestomped.
      </div>
    </div>
  )
}
