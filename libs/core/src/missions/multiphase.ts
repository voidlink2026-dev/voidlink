// M14m — Hand-crafted multi-phase mission templates.
// These are the first taste of "missions as operations" rather than
// "missions as single click → file → wipe → done".

import type { Mission, MissionPhase, MissionNewsEcho } from '../types/mission.ts'

export interface MultiPhaseMissionTemplate {
  id: string
  briefingSubject: string
  briefingBody: string
  clientHandle: string
  difficulty: 3 | 4 | 5
  baseCredits: number
  baseReputation: number
  phases: MissionPhase[]
  newsEchoes?: Record<number, MissionNewsEcho>
}

// ── PROJECT GHOST — 3 phases, corporate_intranet → cloud_infrastructure → personal_gateway
// OSINT (find target) → Breach (steal package) → Cover (wipe + plant decoy)
const PROJECT_GHOST: MultiPhaseMissionTemplate = {
  id: 'multiphase_project_ghost',
  briefingSubject: 'Operation: PROJECT GHOST',
  clientHandle: 'NIGHTOWL_22',
  difficulty: 3,
  baseCredits: 18000,
  baseReputation: 60,
  briefingBody:
    'We need a particular corporate intelligence package — codename "GHOST". Three phases:\n\n' +
    '1) Find which subsidiary holds the file (OSINT — public corp records)\n' +
    '2) Breach the cloud server hosting it and transfer the package\n' +
    '3) Plant a decoy elsewhere AND wipe every trace\n\n' +
    'Standard rate: 18,000 Cr on completion + 60 REP. Phase 1 and 2 each pay a 4k advance. Don\'t come back unless every log is clean.',

  phases: [
    {
      id: 'phase_osint',
      label: 'OSINT',
      description: 'Locate the subsidiary holding the GHOST package. Breach the corporate intranet, find the directory file on the file_server, transfer it.',
      targetNetworkId: 'corporate_intranet',
      objectives: [
        { id: 'obj_ghost_osint', description: 'Transfer directory.enc from the corporate file_server', isOptional: false, isCompleted: false },
      ],
      phaseReward: { credits: 4000, reputation: 15 },
    },
    {
      id: 'phase_breach',
      label: 'Breach',
      description: 'Connect to the cloud infrastructure. Breach the database (Zone B — admin_console pivot required). Corrupt the index to mask the access.',
      targetNetworkId: 'cloud_infrastructure',
      objectives: [
        { id: 'obj_ghost_breach', description: 'Corrupt the GHOST package database', isOptional: false, isCompleted: false },
      ],
      phaseReward: { credits: 4000, reputation: 20 },
    },
    {
      id: 'phase_decoy',
      label: 'Decoy',
      description: 'Plant a decoy file on a third-party gateway to throw the trail. Then wipe everything and disconnect cleanly.',
      targetNetworkId: 'personal_gateway',
      objectives: [
        { id: 'obj_ghost_decoy', description: 'Upload decoy.enc to the personal_gateway file_server', isOptional: false, isCompleted: false },
      ],
    },
  ],

  newsEchoes: {
    0: {
      headline: 'Anonymous Audit Reveals Subsidiary Mismanagement',
      body: 'An unattributed records release has exposed previously confidential subsidiary holdings of a major corporate group. Sources point to an external party with deep network access.',
      category: 'corporate',
      delaySeconds: 60,
    },
    1: {
      headline: 'Corporate Database Corruption — Investigation Opens',
      body: 'Officials at the cloud infrastructure provider have confirmed that mission-critical indices were corrupted overnight. Forensic teams are working on restoration; no perpetrator has been identified.',
      category: 'crime',
      delaySeconds: 120,
    },
    2: {
      headline: 'Investigators Chase False Lead in Recent Breach',
      body: 'Authorities investigating the recent breach are following what insiders describe as "deliberate misdirection" — a decoy planted on an unrelated gateway, mirroring the original signature. The real attacker is believed to be already gone.',
      category: 'crime',
      delaySeconds: 240,
    },
  },
}

export const MULTIPHASE_TEMPLATES: MultiPhaseMissionTemplate[] = [PROJECT_GHOST]

// Generate a fully-formed Mission from a template, seeded by id
export function generateMultiPhaseMission(template: MultiPhaseMissionTemplate, instanceId?: string): Mission {
  const id = instanceId ?? `${template.id}_${Date.now().toString(36)}`
  // Flatten the phases' objectives into the mission's objectives list — only
  // the first phase's objectives are present at start; later phases inject on advance.
  const initialObjectives = template.phases[0].objectives.map((o) => ({ ...o, isCompleted: false }))
  return {
    id,
    type: 'corporate_espionage',  // type-tag for analytics; the phase system does the actual gameplay
    status: 'available',
    difficulty: template.difficulty,
    isStory: false,
    briefing: {
      clientHandle: template.clientHandle,
      clientAvatarId: 'avatar_anon',
      subject: template.briefingSubject,
      body: template.briefingBody,
    },
    objectives: initialObjectives,
    targetNetworkId: template.phases[0].targetNetworkId ?? 'corporate_intranet',
    requirements: { minCrackerLevel: template.difficulty - 1, minCpuSpeed: template.difficulty, minReputation: 30 },
    reward: { credits: template.baseCredits, reputation: template.baseReputation },
    events: [],

    // Multi-phase fields
    phases: template.phases,
    currentPhaseIndex: 0,
    newsEchoes: template.newsEchoes,
  }
}
