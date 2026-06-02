import { useGameStore } from '../../store/gameStore.ts'
import styles from './TargetInfoWindow.module.css'

// Static info shown when the player clicks a non-bank, non-bounce target on the World Map.
// These are eventually full networks the player can connect to (M15+) — for now,
// this gives them lore + a hint at what they'll unlock.
const TARGET_INFO: Record<string, {
  name: string
  type: string
  region: string
  description: string
  unlocksAt: string
  flavour: string
}> = {
  arunmor: {
    name: 'ARUNMOR HQ',
    type: 'CORPORATION',
    region: 'LONDON, UK',
    description:
      'Defence research conglomerate. Heavy security, multi-tier internal network, in-house IDS. ' +
      'Story-critical target for Arc 1: REVELATION and Arc 2: ARUNMOR.',
    unlocksAt: 'Triggered by Arc 1 storyline (no rep gate)',
    flavour: '"They built the cage. Now they need someone to break it."',
  },
  ares: {
    name: 'ARES DIVISION',
    type: 'GOVERNMENT — INTELLIGENCE',
    region: 'WASHINGTON D.C., USA',
    description:
      'Federal cyber-warfare division. Anyone who breaches Ares becomes a permanent priority target. ' +
      'Working FOR Ares gives access to bounty contracts on rival operatives.',
    unlocksAt: 'Faction standing — work hostile or contract',
    flavour: '"There is no after for the people who hit this one."',
  },
  interpol: {
    name: 'INTERPOL',
    type: 'GOVERNMENT — LAW ENFORCEMENT',
    region: 'LYON, FRANCE',
    description:
      'International criminal database. Breach to cleanse your forensic trail; planting evidence here ' +
      'is a high-end mission type (M14e).',
    unlocksAt: 'Specialised tools required (M14e)',
    flavour: '"Records that follow you whether you like it or not."',
  },
  nameless: {
    name: 'THE NAMELESS',
    type: 'UNDERGROUND COLLECTIVE',
    region: 'TOKYO, JAPAN',
    description:
      'Hacker collective that pre-dates the modern net. They\'ve watched every major breach for 17 years. ' +
      'Joining requires faction standing — but they offer the rarest contracts in the game.',
    unlocksAt: 'Faction standing: VETERAN (Underground)',
    flavour: '"You don\'t find them. They find you."',
  },
  voidlink: {
    name: 'VOIDLINK INTL',
    type: 'CONTRACTOR NETWORK',
    region: 'ZURICH, CH',
    description:
      'Your employer. The contractor platform that connects you with jobs. ' +
      'You can connect here to manage your operative profile and view internal communications.',
    unlocksAt: 'Always accessible (you work here)',
    flavour: '"Welcome to the network, operative."',
  },
}

export function TargetInfoWindow() {
  const targetId = useGameStore((s) => s.activeTargetInfoId)
  if (!targetId) {
    return <div className={styles.root}><div className={styles.empty}>No target selected.</div></div>
  }
  const info = TARGET_INFO[targetId]
  if (!info) {
    return <div className={styles.root}><div className={styles.empty}>No intel available for {targetId}.</div></div>
  }
  return (
    <div className={styles.root}>
      <div className={styles.header}>{info.name}</div>
      <div className={styles.type}>{info.type}</div>
      <div className={styles.region}>{info.region}</div>

      <div className={styles.divider} />

      <div className={styles.sectionLabel}>INTEL</div>
      <p className={styles.body}>{info.description}</p>

      <div className={styles.sectionLabel}>ACCESS</div>
      <p className={styles.body}>{info.unlocksAt}</p>

      <div className={styles.divider} />

      <p className={styles.flavour}>{info.flavour}</p>

      <div className={styles.footer}>
        DIRECT CONNECTION NOT YET AVAILABLE — contract via the MISSION BOARD.
      </div>
    </div>
  )
}
