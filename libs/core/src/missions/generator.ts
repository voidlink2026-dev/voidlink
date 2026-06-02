import type { Mission, MissionDifficulty, MissionRequirements, MissionType } from '../types/mission.ts'
import type { NetworkId } from '../types/network.ts'

const CLIENTS = [
  { handle: 'Shadow_Broker', avatar: 'avatar_shadow' },
  { handle: 'NightOwl_22', avatar: 'avatar_owl' },
  { handle: 'Cipher', avatar: 'avatar_cipher' },
  { handle: 'Zero_Cool', avatar: 'avatar_zero' },
  { handle: 'ARC_Internal', avatar: 'avatar_arc' },
  { handle: 'VoidlinkSupport', avatar: 'avatar_voidlink' },
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

// From GAME_DESIGN_MASTER.md §6.2
const REQUIREMENTS_BY_DIFFICULTY: Record<number, MissionRequirements> = {
  1:  { minCrackerLevel: 1, minCpuSpeed: 1.0, minReputation: 0 },
  2:  { minCrackerLevel: 1, minCpuSpeed: 1.0, minReputation: 10 },
  3:  { minCrackerLevel: 2, minCpuSpeed: 2.0, minReputation: 25 },
  4:  { minCrackerLevel: 2, minCpuSpeed: 2.0, minReputation: 50 },
  5:  { minCrackerLevel: 3, minCpuSpeed: 3.0, minReputation: 100 },
  6:  { minCrackerLevel: 3, minCpuSpeed: 3.0, minReputation: 200 },
  7:  { minCrackerLevel: 4, minCpuSpeed: 4.0, minReputation: 400 },
  8:  { minCrackerLevel: 4, minCpuSpeed: 4.0, minReputation: 750 },
  9:  { minCrackerLevel: 5, minCpuSpeed: 5.0, minReputation: 1500 },
  10: { minCrackerLevel: 5, minCpuSpeed: 5.0, minReputation: 3000 },
}

export function requirementsForDifficulty(difficulty: MissionDifficulty): MissionRequirements {
  return REQUIREMENTS_BY_DIFFICULTY[difficulty] ?? REQUIREMENTS_BY_DIFFICULTY[1]
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

  const objectives = [
    {
      id: `obj_${id}_primary`,
      description: buildPrimaryObjective(type),
      isOptional: false,
      isCompleted: false,
      targetNetworkId,
    },
    ...(difficulty >= 4
      ? [
          {
            id: `obj_${id}_stealth`,
            description: 'Cover your tracks — wipe logs on every breached node before disconnecting',
            isOptional: true,
            isCompleted: false,
          },
        ]
      : []),
  ]

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
    objectives,
    targetNetworkId,
    requirements: requirementsForDifficulty(difficulty),
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
