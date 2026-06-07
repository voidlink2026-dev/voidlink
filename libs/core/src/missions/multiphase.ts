// M14m — Hand-crafted multi-phase mission templates.
// These are the first taste of "missions as operations" rather than
// "missions as single click → file → wipe → done".

import type { Mission, MissionPhase, MissionNewsEcho } from '../types/mission.ts'

export interface MultiPhaseMissionTemplate {
  id: string
  briefingSubject: string
  briefingBody: string
  clientHandle: string
  difficulty: 3 | 4 | 5 | 6 | 7
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

// ── BLACK HALO — 3 phases with a fork in phase 2.
// Discover a contractor → choose to TURN them or BURN them
const BLACK_HALO: MultiPhaseMissionTemplate = {
  id: 'multiphase_black_halo',
  briefingSubject: 'Operation: BLACK HALO',
  clientHandle: 'CIPHER',
  difficulty: 4,
  baseCredits: 24000,
  baseReputation: 80,
  briefingBody:
    'A subcontractor working for our rivals has been moving compromised credentials. We need them dealt with. Three phases:\n\n' +
    '1) Trace them through corporate intranet records\n' +
    '2) Decide their fate — turn them into an asset OR burn their identity\n' +
    '3) Cover the operation\n\n' +
    'Phase 2 is your call. The decision will affect your standing with both Underground and Arunmor.',

  phases: [
    {
      id: 'phase_halo_trace',
      label: 'Trace',
      description: 'Trace the contractor through corporate intranet records. Transfer their identity dossier.',
      targetNetworkId: 'corporate_intranet',
      objectives: [
        { id: 'obj_halo_trace', description: 'Transfer identity_dossier.enc from the corporate file_server', isOptional: false, isCompleted: false },
      ],
      phaseReward: { credits: 5000, reputation: 20 },
      // ← CHOICE FORK HERE
      choices: [
        {
          id: 'turn',
          label: 'TURN THEM',
          description: 'Co-opt the contractor as an asset. They\'ll feed us intel for months. Slower payoff, but the relationship matters.',
          nextPhaseIndex: 1,
          effects: {
            repDelta: 15,
            factionDeltas: { underground: 20, arunmor: -10 },
          },
        },
        {
          id: 'burn',
          label: 'BURN THEM',
          description: 'Inject false records, dismantle their digital identity. Fast, decisive, brutal. They\'ll never work in this industry again.',
          nextPhaseIndex: 2,  // skip the "Recruit" phase entirely, go straight to "Burn + Cover"
          effects: {
            repDelta: 10,
            factionDeltas: { underground: -15, arunmor: 25, ares_division: 10 },
          },
        },
      ],
    },
    // Phase 2 (TURN path)
    {
      id: 'phase_halo_recruit',
      label: 'Recruit',
      description: 'Open a secure channel via the personal_gateway. Upload contact_handshake.enc as proof of intent.',
      targetNetworkId: 'personal_gateway',
      objectives: [
        { id: 'obj_halo_recruit', description: 'Upload contact_handshake.enc to the gateway file_server', isOptional: false, isCompleted: false },
      ],
      phaseReward: { credits: 6000, reputation: 25 },
    },
    // Phase 3 (BURN path goes here directly; TURN path also ends here)
    {
      id: 'phase_halo_cover',
      label: 'Cover',
      description: 'Corrupt the corporate audit logs to hide the operation. Disconnect cleanly.',
      targetNetworkId: 'corporate_intranet',
      objectives: [
        { id: 'obj_halo_cover', description: 'Corrupt the corporate audit database', isOptional: false, isCompleted: false },
      ],
    },
  ],

  newsEchoes: {
    0: {
      headline: 'Rumours of Cross-Firm Information Leak',
      body: 'Industry observers report that a junior subcontractor has gone unusually quiet. Speculation about an internal investigation is mounting.',
      category: 'corporate',
      delaySeconds: 90,
    },
    1: {
      headline: 'Anonymous Source Goes Dark',
      body: 'A source long known to feed intel to underground collectives has reportedly stopped responding to overtures. Insiders speculate they\'ve switched sides.',
      category: 'tech',
      delaySeconds: 180,
    },
    2: {
      headline: 'Corporate Audit Records Vanish',
      body: 'Auditors at a leading corporate group are unable to reconstruct several days\' worth of records following what insiders describe as a "targeted data event".',
      category: 'crime',
      delaySeconds: 240,
    },
  },
}

// ── DEAD DROP — Arc 6 resolution. Three-way fork on Phase 1.
// PURGE — clean the gateway. Lose anchor relay node permanently. Underground rep.
// WEAPONISE — leave tunnel open. Use MAGNUS routing as backdoor. Big credits, big notoriety.
// REPORT — sell intel. Two sub-branches via Phase 2 selection (JCB or NIGHTOWL_22).
const DEAD_DROP_RESOLUTION: MultiPhaseMissionTemplate = {
  id: 'multiphase_dead_drop_resolution',
  briefingSubject: 'DEAD DROP — resolution',
  clientHandle: 'YOURSELF',
  difficulty: 6,
  baseCredits: 40000,
  baseReputation: 150,
  briefingBody:
    'You have identified MAGNUS. You have evidence. You have a tunnel running through your home gateway every forty-seven minutes.\n\n' +
    'You have three options:\n\n' +
    '  PURGE — clean the gateway. MAGNUS adapts. You lose your anchor relay node permanently. Bond-clean choice.\n' +
    '  WEAPONISE — leave the tunnel in place. Use MAGNUS routing as a backdoor into Arunmor. Massive payoff.\n' +
    '             You will know what you have collaborated with.\n' +
    '  REPORT — sell what you have found. Sub-choice in Phase 2: JCB or NIGHTOWL_22.\n\n' +
    'CIPHER will respect the first option. Arunmor will fear the second. The Government will reward the third.\n\n' +
    'Choose deliberately. Then live with it.',

  phases: [
    {
      id: 'phase_dd_recon',
      label: 'Recon',
      description: 'Confirm the tunnel signature one more time. Verify MAGNUS\'s offered terms are accurate before committing.',
      targetNetworkId: 'corporate_intranet',
      objectives: [
        { id: 'obj_dd_verify', description: 'Verify the gateway tunnel signature on your own AUDIT GATEWAY scan', isOptional: false, isCompleted: false },
      ],
      phaseReward: { credits: 0, reputation: 0 },
      choices: [
        {
          id: 'purge',
          label: 'PURGE',
          description: 'Burn the tunnel. Lose your anchor relay node permanently. CIPHER will respect this. The Bond School will recognise it.',
          nextPhaseIndex: 1,
          effects: {
            repDelta: 20,
            factionDeltas: { underground: 35, arunmor: -10 },
            setFlag: { flag: 'choice_dead_drop_purge', value: true },
          },
        },
        {
          id: 'weaponise',
          label: 'WEAPONISE',
          description: 'Use MAGNUS\'s routing as a backdoor into Arunmor\'s research network. Massive payoff. You will be known.',
          nextPhaseIndex: 2,
          effects: {
            repDelta: 30,
            factionDeltas: { underground: -25, arunmor: -30, the_nameless: 20 },
            setFlag: { flag: 'choice_dead_drop_weaponise', value: true },
          },
        },
        {
          id: 'report',
          label: 'REPORT',
          description: 'Sell the discovery. JCB pays better, but the JCB is the JCB. NIGHTOWL_22 pays in connections, not credits.',
          nextPhaseIndex: 3,
          effects: {
            setFlag: { flag: 'choice_dead_drop_report', value: true },
          },
        },
      ],
    },
    // Phase 1 — PURGE path
    {
      id: 'phase_dd_purge_burn',
      label: 'Purge',
      description: 'Inject a forced-termination handshake into the tunnel. MAGNUS will accept it. Your anchor node will burn permanently.',
      targetNetworkId: 'personal_gateway',
      objectives: [
        { id: 'obj_dd_purge', description: 'Inject termination handshake — anchor relay will be permanently lost', isOptional: false, isCompleted: false },
      ],
      phaseReward: { credits: 15000, reputation: 60 },
    },
    // Phase 2 — WEAPONISE path
    {
      id: 'phase_dd_weaponise_backdoor',
      label: 'Weaponise',
      description: 'Inject your own packets into MAGNUS\'s tunnel. The destination is Arunmor research network AR-K7. Take what you find.',
      targetNetworkId: 'cloud_infrastructure',
      objectives: [
        { id: 'obj_dd_weaponise', description: 'Exfiltrate the AR-K7 research index via MAGNUS routing', isOptional: false, isCompleted: false },
      ],
      phaseReward: { credits: 85000, reputation: 80 },
    },
    // Phase 3 — REPORT path (sub-choice in this phase: JCB or NIGHTOWL_22)
    {
      id: 'phase_dd_report_choice',
      label: 'Report',
      description: 'Compile the evidence package. Sub-choice: JCB (Government cooperation) or NIGHTOWL_22 (Underground broker).',
      targetNetworkId: 'corporate_intranet',
      objectives: [
        { id: 'obj_dd_report_compile', description: 'Compile evidence package for delivery', isOptional: false, isCompleted: false },
      ],
      choices: [
        {
          id: 'report_jcb',
          label: 'DELIVER TO JCB',
          description: 'Send the package to Director Kovac directly. They will pay. They will also remember you for it.',
          nextPhaseIndex: 4,
          effects: {
            repDelta: 30,
            factionDeltas: { government: 40, ares_division: 20, underground: -20 },
            setFlag: { flag: 'choice_dead_drop_report_jcb', value: true },
          },
        },
        {
          id: 'report_nightowl',
          label: 'DELIVER TO NIGHTOWL_22',
          description: 'Drop the package on the Mesh via NIGHTOWL\'s broker channel. Less credit. More connection.',
          nextPhaseIndex: 4,
          effects: {
            repDelta: 15,
            factionDeltas: { underground: 30, government: -10 },
            setFlag: { flag: 'choice_dead_drop_report_nightowl', value: true },
          },
        },
      ],
    },
    // Phase 4 — REPORT path payoff
    {
      id: 'phase_dd_report_deliver',
      label: 'Deliver',
      description: 'Deliver the package via the chosen channel. The recipient will pay on receipt.',
      targetNetworkId: 'corporate_intranet',
      objectives: [
        { id: 'obj_dd_report_deliver', description: 'Deliver the evidence package', isOptional: false, isCompleted: false },
      ],
      phaseReward: { credits: 50000, reputation: 100 },
    },
  ],

  newsEchoes: {
    1: {  // PURGE
      headline: 'Anonymous Relay Node Goes Dark',
      body: 'A long-running relay node, previously believed to be a benign academic mesh contributor, has stopped responding to handshake requests. The cause is unknown. Mesh observers note the timing is unusual.',
      category: 'tech',
      delaySeconds: 90,
    },
    2: {  // WEAPONISE
      headline: 'Arunmor Research Division Confirms "Security Incident"',
      body: 'Arunmor has confirmed an unauthorised breach of one of its research compounds, designated AR-K7. The compound has been taken offline for investigation. The company has declined to elaborate on the nature of the compromised data.',
      category: 'corporate',
      delaySeconds: 120,
    },
    4: {  // REPORT — both sub-branches
      headline: 'Whistleblower Evidence Surfaces On Mesh',
      body: 'An anonymous evidence package has begun circulating on Underground channels. Mesh observers describe its contents as "the most consequential single drop in living memory." Attribution remains unclear. Verification is ongoing.',
      category: 'crime',
      delaySeconds: 180,
    },
  },
}

export const MULTIPHASE_TEMPLATES: MultiPhaseMissionTemplate[] = [PROJECT_GHOST, BLACK_HALO, DEAD_DROP_RESOLUTION]

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
