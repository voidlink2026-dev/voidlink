import type { Mission, MissionDifficulty, MissionType } from '../types/mission.ts'
import type { NetworkId } from '../types/network.ts'

const CLIENTS = [
  { handle: 'Shadow_Broker', avatar: 'avatar_shadow' },
  { handle: 'NightOwl_22', avatar: 'avatar_owl' },
  { handle: 'Cipher', avatar: 'avatar_cipher' },
  { handle: 'Zero_Cool', avatar: 'avatar_zero' },
  { handle: 'ARC_Internal', avatar: 'avatar_arc' },
  { handle: 'UplinkSupport', avatar: 'avatar_uplink' },
]

const BRIEFING_TEMPLATES: Record<MissionType, string[]> = {
  file_theft: [
    'We need you to acquire a specific file from the target network. Leave no trace.',
    'A competitor has data we need. Extract it cleanly. Our people are watching.',
  ],
  account_deletion: [
    'Delete the specified account from the target database. No backups, no recovery.',
    'Someone needs to disappear from the system. Make it happen.',
  ],
  database_corruption: [
    'Corrupt the target database. Make it look like a hardware failure.',
    'Their research needs to be set back six months. You know what to do.',
  ],
  network_sabotage: [
    'Take their network offline. Every minute of downtime costs them a fortune.',
    'Disrupt their infrastructure at the most inconvenient time possible.',
  ],
  evidence_planting: [
    'Plant the provided file on the target system. It must look legitimate.',
    'We need their audit trail to show something it never did.',
  ],
  counter_hacking: [
    'Someone is attacking a client of ours. Intercept the attacker and shut them down.',
    "Defensive work today. Harden the target before the wolves get there.",
  ],
  bounty_hunt: [
    'A bounty has been posted on this gateway. First in, first paid.',
    "Target's been marked. Whoever gets there first collects.",
  ],
  corporate_espionage: [
    'Full intelligence package on the target corporation. Emails, financials, R&D — everything.',
    'We need to know what they know. Complete access.',
  ],
  story: [],
}

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

export function generateContract(
  type: MissionType,
  difficulty: MissionDifficulty,
  targetNetworkId: NetworkId,
  seed: number,
): Mission {
  const rng = seededRandom(seed)
  const client = CLIENTS[Math.floor(rng() * CLIENTS.length)]
  const templates = BRIEFING_TEMPLATES[type]
  const body = templates[Math.floor(rng() * templates.length)] ?? 'Complete the objective.'

  const baseCredits = difficulty * difficulty * 2500
  const credits = Math.round(baseCredits * (0.8 + rng() * 0.4))
  const reputation = difficulty * 20

  const id = `mission_${seed.toString(16)}`

  return {
    id,
    type,
    status: 'available',
    difficulty,
    isStory: false,
    briefing: {
      clientHandle: client.handle,
      clientAvatarId: client.avatar,
      subject: `Contract: ${type.replace(/_/g, ' ')} [${id.slice(-6)}]`,
      body,
    },
    objectives: [
      {
        id: `obj_${id}_primary`,
        description: buildPrimaryObjective(type),
        isOptional: false,
        isCompleted: false,
        targetNetworkId,
      },
    ],
    targetNetworkId,
    reward: { credits, reputation },
    events: [],
    timeLimitSeconds: difficulty >= 7 ? 300 - difficulty * 10 : undefined,
  }
}

function buildPrimaryObjective(type: MissionType): string {
  const map: Record<MissionType, string> = {
    file_theft: 'Locate and transfer the target file to your gateway',
    account_deletion: 'Delete the specified account from the target database',
    database_corruption: 'Corrupt the primary database on the target network',
    network_sabotage: 'Disable the core router to take the network offline',
    evidence_planting: 'Upload the provided file to the target file server',
    counter_hacking: 'Identify and disconnect the attacker from the target network',
    bounty_hunt: 'Breach the target personal gateway',
    corporate_espionage: 'Access and copy the corporate intelligence package',
    story: 'Complete your mission',
  }
  return map[type]
}
