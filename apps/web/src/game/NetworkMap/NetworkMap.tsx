import { useGameStore } from '../../store/gameStore.ts'
import type { NetworkNode, FileEntry, MissionType } from '@uplink/core'
import styles from './NetworkMap.module.css'

const NODE_ICONS: Record<string, string> = {
  entry_point:        '⬡',
  firewall:           '⬡',
  router:             '⬡',
  file_server:        '▣',
  database:           '▤',
  mail_server:        '✉',
  intrusion_detector: '◈',
  proxy:              '⊕',
  endpoint:           '◉',
  admin_console:      '⊞',
  ai_core:            '✦',
}

function nodeColour(node: NetworkNode): string {
  if (node.isBreached) return '#39ff14'
  const map: Record<string, string> = {
    entry_point:        '#ffffff',
    firewall:           '#ff9900',
    router:             '#00cfff',
    file_server:        '#aaaaaa',
    database:           '#00cfff',
    mail_server:        '#888888',
    intrusion_detector: '#ff2d20',
    proxy:              '#888888',
    endpoint:           '#555555',
    admin_console:      '#ff9900',
    ai_core:            '#39ff14',
  }
  return map[node.type] ?? '#555555'
}

export function NetworkMap() {
  const networks = useGameStore((s) => s.networks)
  const activeNetworkId = useGameStore((s) => s.activeNetworkId)
  const selectedNodeId = useGameStore((s) => s.selectedNodeId)
  const activeMissionId = useGameStore((s) => s.activeMissionId)
  const missions = useGameStore((s) => s.missions)
  const rivalHacker = useGameStore((s) => s.rivalHacker)
  const selectNode = useGameStore((s) => s.selectNode)
  const breachNode = useGameStore((s) => s.breachNode)
  const collectFile = useGameStore((s) => s.collectFile)
  const executeMissionObjective = useGameStore((s) => s.executeMissionObjective)
  const logTerminal = useGameStore((s) => s.logTerminal)

  const activeMissionType = missions.find((m) => m.id === activeMissionId)?.type ?? null

  const activeNetwork = activeNetworkId ? networks[activeNetworkId] : null
  const selectedNode = activeNetwork?.nodes.find((n) => n.id === selectedNodeId) ?? null

  function handleNodeClick(node: NetworkNode) {
    selectNode(node.id === selectedNodeId ? null : node.id)
  }

  function handleBreach(node: NetworkNode) {
    if (!activeNetwork) return
    if (node.isBreached) {
      logTerminal(`${node.label}: already compromised.`, 'dim')
      return
    }
    breachNode(activeNetwork.id, node.id)
    logTerminal(`Breach successful: ${node.type.replace(/_/g, ' ')} [T${node.securityTier}]`, 'success')
    logTerminal(`+10% trace accumulation from active countermeasures.`, 'system')
  }

  function handleCollect(node: NetworkNode, file: FileEntry) {
    if (!activeNetwork) return
    collectFile(activeNetwork.id, node.id, file.id)
    logTerminal(`File transferred: ${file.name} (${file.sizeKb} KB)`, 'success')
    if (file.missionObjective) {
      logTerminal(`Objective complete. Disconnect when ready.`, 'system')
    }
  }

  function handleExecuteObjective(node: NetworkNode) {
    if (!activeNetwork) return
    executeMissionObjective(activeNetwork.id, node.id)
    const labels: Partial<Record<string, string>> = {
      account_deletion: `Account deleted from ${node.type.replace(/_/g, ' ')}. No recovery possible.`,
      database_corruption: `Database corrupted on ${node.type.replace(/_/g, ' ')}. Looks like a hardware failure.`,
      network_sabotage: `Core router disabled. Network going offline.`,
    }
    logTerminal(labels[activeMissionType ?? ''] ?? 'Objective executed.', 'success')
    logTerminal('Objective complete. Disconnect when ready.', 'system')
  }

  if (!activeNetwork) {
    return (
      <div className={styles.empty}>
        <span>NO ACTIVE CONNECTION</span>
        <span className={styles.hint}>Accept a mission to connect to a target network</span>
      </div>
    )
  }

  return (
    <div className={styles.mapContainer}>
      <div className={styles.header}>
        <span className={styles.networkLabel}>{activeNetwork.label}</span>
        <span className={styles.nodeCount}>
          {activeNetwork.nodes.filter((n) => n.isBreached).length}/{activeNetwork.nodes.length} nodes breached
        </span>
      </div>

      <div className={styles.body}>
        {/* SVG map */}
        <svg
          className={styles.svg}
          viewBox="0 0 800 600"
          aria-label={`Network map: ${activeNetwork.label}`}
        >
          {/* Edges */}
          {activeNetwork.nodes.map((node) =>
            node.connectedTo.map((targetId) => {
              const target = activeNetwork.nodes.find((n) => n.id === targetId)
              if (!target || node.id > targetId) return null
              const isHighlighted =
                node.id === selectedNodeId || target.id === selectedNodeId
              return (
                <line
                  key={`${node.id}-${targetId}`}
                  x1={node.position.x} y1={node.position.y}
                  x2={target.position.x} y2={target.position.y}
                  className={isHighlighted ? styles.edgeActive : styles.edge}
                />
              )
            }),
          )}

          {/* Nodes */}
          {activeNetwork.nodes.map((node) => {
            const colour = nodeColour(node)
            const isSelected = node.id === selectedNodeId
            const hasRival = rivalHacker?.currentNodeId === node.id
            return (
              <g
                key={node.id}
                transform={`translate(${node.position.x},${node.position.y})`}
                onClick={() => handleNodeClick(node)}
                style={{ cursor: 'pointer' }}
                role="button"
                aria-label={`${node.type}: tier ${node.securityTier}${node.isBreached ? ', breached' : ''}${hasRival ? ', rival hacker present' : ''}`}
                aria-pressed={isSelected}
              >
                {/* Rival hacker ring */}
                {hasRival && (
                  <circle r={28} fill="none" stroke="#ff9900" strokeWidth={1.5}
                    strokeDasharray="3 3" opacity={0.9}>
                    <animateTransform attributeName="transform" type="rotate"
                      from="0" to="360" dur="4s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Selection ring */}
                {isSelected && (
                  <circle r={24} fill="none" stroke={colour} strokeWidth={1.5}
                    strokeDasharray="4 2" opacity={0.8} />
                )}
                {/* Breach glow */}
                {node.isBreached && (
                  <circle r={20} fill={`${colour}18`} stroke={colour} strokeWidth={0.5} />
                )}
                {/* Main circle */}
                <circle
                  r={16}
                  fill="#0d0d0d"
                  stroke={colour}
                  strokeWidth={isSelected ? 2 : 1}
                  opacity={node.isActive ? 1 : 0.4}
                />
                {/* Icon */}
                <text textAnchor="middle" dominantBaseline="central"
                  fontSize={13} fill={colour}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}>
                  {NODE_ICONS[node.type] ?? '?'}
                </text>
                {/* Node type label */}
                <text y={26} textAnchor="middle" fontSize={7} fill="#444"
                  fontFamily="JetBrains Mono, monospace"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}>
                  {node.type.replace(/_/g, ' ').toUpperCase()}
                </text>
                {/* Tier badge */}
                <text y={35} textAnchor="middle" fontSize={7} fill="#333"
                  fontFamily="JetBrains Mono, monospace"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}>
                  T{node.securityTier}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Node detail panel */}
        {selectedNode && (
          <NodePanel
            node={selectedNode}
            networkId={activeNetwork.id}
            activeMissionType={activeMissionType}
            onBreach={() => handleBreach(selectedNode)}
            onCollect={(file) => handleCollect(selectedNode, file)}
            onExecuteObjective={() => handleExecuteObjective(selectedNode)}
          />
        )}
      </div>
    </div>
  )
}

const OBJECTIVE_ACTIONS: Partial<Record<MissionType, { nodeTypes: string[]; label: string }>> = {
  account_deletion:   { nodeTypes: ['database'],               label: 'DELETE ACCOUNT' },
  database_corruption: { nodeTypes: ['database'],              label: 'CORRUPT DATABASE' },
  network_sabotage:   { nodeTypes: ['router', 'admin_console'], label: 'SABOTAGE NODE' },
}

function NodePanel({
  node,
  activeMissionType,
  onBreach,
  onCollect,
  onExecuteObjective,
}: {
  node: NetworkNode
  networkId: string
  activeMissionType: MissionType | null
  onBreach: () => void
  onCollect: (file: FileEntry) => void
  onExecuteObjective: () => void
}) {
  const colour = nodeColour(node)
  const objectiveAction = activeMissionType ? OBJECTIVE_ACTIONS[activeMissionType] : null
  const canExecuteObjective = node.isBreached && objectiveAction?.nodeTypes.includes(node.type)

  return (
    <div className={styles.nodePanel}>
      <div className={styles.nodePanelHeader} style={{ borderColor: colour }}>
        <span className={styles.nodePanelType} style={{ color: colour }}>
          {node.type.replace(/_/g, ' ').toUpperCase()}
        </span>
        <span className={styles.nodePanelTier}>TIER {node.securityTier}</span>
      </div>

      <div className={styles.nodePanelStatus}>
        <span className={node.isBreached ? styles.statusBreached : styles.statusSecure}>
          {node.isBreached ? '● COMPROMISED' : '○ SECURE'}
        </span>
        {!node.isActive && <span className={styles.statusOffline}>OFFLINE</span>}
      </div>

      {node.services.length > 0 && (
        <div className={styles.panelSection}>
          <div className={styles.panelSectionLabel}>SERVICES</div>
          {node.services.map((svc, i) => (
            <div key={i} className={styles.service}>
              {svc.protocol}:{svc.port} v{svc.version}
              {svc.hasKnownVulnerability && (
                <span className={styles.vuln}> [VULN]</span>
              )}
            </div>
          ))}
        </div>
      )}

      {node.files.length > 0 && (
        <div className={styles.panelSection}>
          <div className={styles.panelSectionLabel}>FILES</div>
          {node.files.map((file) => (
            <div key={file.id} className={styles.fileRow}>
              <span className={file.missionObjective ? styles.fileTarget : styles.fileName}>
                {file.missionObjective ? '★ ' : ''}{file.name}
              </span>
              <span className={styles.fileSize}>{file.sizeKb} KB</span>
              {node.isBreached && (
                <button
                  className={styles.collectBtn}
                  onClick={() => onCollect(file)}
                  aria-label={`Transfer ${file.name}`}
                >
                  TRANSFER
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {!node.isBreached && (
        <button className={styles.breachBtn} onClick={onBreach}>
          ▶ INITIATE BREACH
        </button>
      )}

      {canExecuteObjective && (
        <button className={styles.objectiveBtn} onClick={onExecuteObjective}>
          ▶ {objectiveAction!.label}
        </button>
      )}

      {node.isBreached && node.files.length === 0 && !canExecuteObjective && (
        <div className={styles.dimNote}>Node compromised — no files present</div>
      )}
    </div>
  )
}
