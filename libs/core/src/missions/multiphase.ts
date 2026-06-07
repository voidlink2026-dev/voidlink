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

// ═══════════════════════════════════════════════════════════════════════════
// Arc 7 — THE QUIET WAR — Resolution
// Four-way choice with three payoff phases. WARN_INTERNIC and WARN_ARUNMOR
// share a single payoff phase (which side wins; faction deltas differ).
// EXPOSE_NIGHTOWL and PRESERVE_BALANCE each have their own.
// ═══════════════════════════════════════════════════════════════════════════
const QUIET_WAR_RESOLUTION: MultiPhaseMissionTemplate = {
  id: 'multiphase_quiet_war_resolution',
  briefingSubject: 'QUIET WAR — resolution',
  clientHandle: 'YOURSELF',
  difficulty: 6,
  baseCredits: 36000,
  baseReputation: 140,
  briefingBody:
    'You have confirmed the window. Daniel Park is forty-eight hours from identifying NIGHTOWL. The cache is on your storage. ' +
    'The choice is yours.\n\n' +
    '  WARN INTERNIC — tip Park ahead of his own discovery. ARUNMOR-Δ5 collapses. Internic stock soars. Helios Marine acquired within a year.\n' +
    '  WARN ARUNMOR — tip Δ5 HR. Internic is sued into bankruptcy. NIGHTOWL is blamed on a junior at Internic. Helios Marine acquired faster.\n' +
    '  EXPOSE NIGHTOWL — deliver her broker terminal. War ends on whoever learns first. NIGHTOWL gone within a week.\n' +
    '  PRESERVE BALANCE — leak fabricated thread to Park, leak counter to Δ5. War sustains for one more cycle. Bond-clean choice. Helios moves.\n\n' +
    'No outcome here is innocent. Choose with all of the facts.',

  phases: [
    {
      id: 'phase_qw_choice',
      label: 'Decide',
      description: 'Commit to a side. The phase you enter next will be determined by your selection.',
      targetNetworkId: 'corporate_intranet',
      objectives: [
        { id: 'obj_qw_decide', description: 'Commit to a resolution path', isOptional: false, isCompleted: false },
      ],
      phaseReward: { credits: 0, reputation: 0 },
      choices: [
        {
          id: 'warn_internic',
          label: 'WARN INTERNIC',
          description: 'Tip Park before his own discovery. Internic\'s side wins outright. Helios falls within twelve months.',
          nextPhaseIndex: 1,
          effects: {
            repDelta: 25,
            factionDeltas: { arunmor: -25, internic: 30, the_underground: -20 },
            setFlag: { flag: 'choice_quiet_war_warn_internic', value: true },
          },
        },
        {
          id: 'warn_arunmor',
          label: 'WARN ARUNMOR',
          description: 'Tip Δ5 HR. Internic is sued into nothing. NIGHTOWL is blamed on a junior. Δ5\'s side dominant.',
          nextPhaseIndex: 1,
          effects: {
            repDelta: 25,
            factionDeltas: { arunmor: 30, internic: -25, the_underground: -15 },
            setFlag: { flag: 'choice_quiet_war_warn_arunmor', value: true },
          },
        },
        {
          id: 'expose_nightowl',
          label: 'EXPOSE NIGHTOWL',
          description: 'Deliver the broker terminal. She disappears within a week. War ends however the recipient finishes it.',
          nextPhaseIndex: 2,
          effects: {
            repDelta: 35,
            factionDeltas: { the_underground: -45, government: 25, arunmor: 10, internic: 10 },
            setFlag: { flag: 'choice_quiet_war_expose_nightowl', value: true },
          },
        },
        {
          id: 'preserve_balance',
          label: 'PRESERVE BALANCE',
          description: 'Leak fabricated thread to Park. Counter-leak to Δ5 HR. War sustains. Helios moves. You are complicit in the next cycle.',
          nextPhaseIndex: 3,
          effects: {
            repDelta: 15,
            factionDeltas: { the_underground: 30, arunmor: -5, internic: -5 },
            setFlag: { flag: 'choice_quiet_war_preserve_balance', value: true },
          },
        },
      ],
    },
    // Phase 1 — WARN_INTERNIC / WARN_ARUNMOR shared payoff
    {
      id: 'phase_qw_warn',
      label: 'Warn',
      description: 'Deliver the briefing packet through a sanitised channel. The recipient will act within the hour.',
      targetNetworkId: 'corporate_intranet',
      objectives: [
        { id: 'obj_qw_warn', description: 'Deliver the briefing packet to the chosen executive\'s secure channel', isOptional: false, isCompleted: false },
      ],
      phaseReward: { credits: 48000, reputation: 80 },
    },
    // Phase 2 — EXPOSE_NIGHTOWL
    {
      id: 'phase_qw_expose',
      label: 'Expose',
      description: 'Package the LANTERN_BRIDGE broker terminal evidence. Deliver to Park or to Δ5 HR — whoever can act on it first.',
      targetNetworkId: 'corporate_intranet',
      objectives: [
        { id: 'obj_qw_expose', description: 'Package and deliver the broker-terminal evidence', isOptional: false, isCompleted: false },
      ],
      phaseReward: { credits: 65000, reputation: 50 },
    },
    // Phase 3 — PRESERVE_BALANCE
    {
      id: 'phase_qw_preserve',
      label: 'Preserve',
      description: 'Fabricate the false thread for Park. Author a credible counter-leak for Δ5 HR. Both delivered through anonymised channels.',
      targetNetworkId: 'corporate_intranet',
      objectives: [
        { id: 'obj_qw_preserve', description: 'Author and deliver both fabricated leaks', isOptional: false, isCompleted: false },
      ],
      phaseReward: { credits: 28000, reputation: 130 },
    },
  ],

  newsEchoes: {
    1: {  // WARN — either flavour
      headline: 'Sudden Resolution in Internic / Arunmor IP Dispute',
      body: 'The protracted intellectual-property contest between Internic Holdings and Arunmor Subsidiary Five has resolved suddenly and one-sidedly. Market analysts describe the conclusion as "informationally asymmetric." Both companies have declined comment.',
      category: 'corporate',
      delaySeconds: 90,
    },
    2: {  // EXPOSE
      headline: 'Underground Broker LANTERN_BRIDGE Goes Dark',
      body: 'A long-running broker handle on the Mesh has stopped responding. The handle was associated with eleven years of selective corporate leak operations. Mesh observers describe the silence as "uncharacteristic and probably terminal."',
      category: 'tech',
      delaySeconds: 120,
    },
    3: {  // PRESERVE
      headline: 'Helios Marine Group Announces Restructuring',
      body: 'Helios Marine, a labour cooperative based in the South China Sea, has announced a corporate restructuring that places its operations under multiple-jurisdiction registration. Industry observers note the move complicates any future hostile acquisition.',
      category: 'corporate',
      delaySeconds: 180,
    },
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// Arc 8 — LIGHTHOUSE — Resolution
// Four-way choice. The player has discovered Voidlink Dispatch has been
// profiling and selling operatives — including themselves — for at least
// eighteen months, and that the entire lighthouse pricing scheme was
// retrofitted around an older customer named MAGNUS_RELAY. They can:
//   - TAKE_VANCE_OUT: silence the whistleblower. Dispatch is preserved.
//   - EXPOSE_DISPATCH: publish everything. Voidlink fractures.
//   - DISAPPEAR: cache the evidence, go solo, build your own routing.
//   - WARN_CIPHER: tell only him. The system continues. Bond-clean.
// Each path is gated to lock part of Arcs 9 and 10 (forthcoming content).
// ═══════════════════════════════════════════════════════════════════════════
const LIGHTHOUSE_RESOLUTION: MultiPhaseMissionTemplate = {
  id: 'multiphase_lighthouse_resolution',
  briefingSubject: 'LIGHTHOUSE — resolution',
  clientHandle: 'YOURSELF',
  difficulty: 6,
  baseCredits: 42000,
  baseReputation: 160,
  briefingBody:
    'You have the buyer list, the MAGNUS_RELAY transaction history, and Asher Vance\'s decryption key. You have Cipher\'s ' +
    'message acknowledging he knew. You have your own L-rating, 7.2, sitting in your records.\n\n' +
    '  TAKE_VANCE_OUT — silence the whistleblower. Dispatch is preserved. The lighthouse continues. You are paid by parties unnamed.\n' +
    '  EXPOSE_DISPATCH — publish Vance\'s bundle, verified. Voidlink Dispatch fractures. The system you signed the Bond with ends.\n' +
    '  DISAPPEAR — cache the evidence. Build your own routing. You become a competitor to the platform you depended on.\n' +
    '  WARN_CIPHER — tell him quietly. He will know what to do. The system continues. You stay in. Bond-clean.\n\n' +
    'Each option locks part of what comes after. Choose deliberately. There will not be a second pass.',

  phases: [
    {
      id: 'phase_lh_choice',
      label: 'Decide',
      description: 'Commit. The phase you enter will be determined by your selection.',
      targetNetworkId: 'corporate_intranet',
      objectives: [
        { id: 'obj_lh_decide', description: 'Commit to a resolution path', isOptional: false, isCompleted: false },
      ],
      phaseReward: { credits: 0, reputation: 0 },
      choices: [
        {
          id: 'take_vance_out',
          label: 'TAKE THE TARGET OUT',
          description: 'Burn Vance. He goes silent permanently. Dispatch never learns its leak. Parties unnamed will pay generously for the cleanup.',
          nextPhaseIndex: 1,
          effects: {
            repDelta: 25,
            factionDeltas: { voidlink_international: 25, the_underground: -40 },
            setFlag: { flag: 'choice_lighthouse_take_vance_out', value: true },
          },
        },
        {
          id: 'expose_dispatch',
          label: 'EXPOSE DISPATCH',
          description: 'Publish the verified bundle. Voidlink fractures. Half the active operative population goes independent. The lighthouse ends.',
          nextPhaseIndex: 2,
          effects: {
            repDelta: 45,
            factionDeltas: { voidlink_international: -80, the_underground: 50, arunmor: -20, ares_division: -20 },
            setFlag: { flag: 'choice_lighthouse_expose_dispatch', value: true },
          },
        },
        {
          id: 'disappear',
          label: 'DISAPPEAR WITH THE DATA',
          description: 'Cache the evidence on your own infrastructure. Build private routing. You become a competitor to the platform. You also become harder to find.',
          nextPhaseIndex: 3,
          effects: {
            repDelta: 30,
            factionDeltas: { voidlink_international: -40, the_nameless: 30 },
            setFlag: { flag: 'choice_lighthouse_disappear', value: true },
          },
        },
        {
          id: 'warn_cipher',
          label: 'WARN CIPHER',
          description: 'Tell him quietly. Let him handle it. The system continues. You stay in. The choice you have made is to trust him.',
          nextPhaseIndex: 4,
          effects: {
            repDelta: 20,
            factionDeltas: { the_underground: 35 },
            setFlag: { flag: 'choice_lighthouse_warn_cipher', value: true },
          },
        },
      ],
    },
    // Phase 1 — TAKE_VANCE_OUT
    {
      id: 'phase_lh_take_out',
      label: 'Take Out',
      description: 'Burn Vance\'s personal cloud, his backup mesh node, and his correspondence. Inject a cover-story leak that frames his disappearance as voluntary relocation. The cleanup must be total.',
      targetNetworkId: 'corporate_intranet',
      objectives: [
        { id: 'obj_lh_take_out', description: 'Eliminate Vance\'s digital footprint and inject the cover-story leak', isOptional: false, isCompleted: false },
      ],
      phaseReward: { credits: 95000, reputation: 80 },
    },
    // Phase 2 — EXPOSE_DISPATCH
    {
      id: 'phase_lh_expose',
      label: 'Expose',
      description: 'Package the verified bundle. Distribute simultaneously to twelve Mesh broker channels, two journalist contacts of Vance\'s, and the JCB oversight desk. Once it lands, it cannot be retracted.',
      targetNetworkId: 'corporate_intranet',
      objectives: [
        { id: 'obj_lh_expose', description: 'Simultaneously distribute the verified bundle to all twelve recipients', isOptional: false, isCompleted: false },
      ],
      phaseReward: { credits: 18000, reputation: 220 },
    },
    // Phase 3 — DISAPPEAR
    {
      id: 'phase_lh_disappear',
      label: 'Disappear',
      description: 'Migrate your gateway off Voidlink routing. Build a private mesh. Cache the evidence on hardware only you control. From this point forward, Dispatch can no longer see you.',
      targetNetworkId: 'corporate_intranet',
      objectives: [
        { id: 'obj_lh_disappear', description: 'Migrate gateway, build private mesh, secure the cache offline', isOptional: false, isCompleted: false },
      ],
      phaseReward: { credits: 35000, reputation: 110 },
    },
    // Phase 4 — WARN_CIPHER
    {
      id: 'phase_lh_warn',
      label: 'Warn',
      description: 'Deliver the bundle and the buyer list to Cipher through your most secure channel. Wait. The Underground will decide.',
      targetNetworkId: 'corporate_intranet',
      objectives: [
        { id: 'obj_lh_warn', description: 'Deliver the bundle to Cipher via secure channel', isOptional: false, isCompleted: false },
      ],
      phaseReward: { credits: 22000, reputation: 140 },
    },
  ],

  newsEchoes: {
    1: {  // TAKE_VANCE_OUT
      headline: 'Reykjavík Consultant Reported Missing',
      body: 'Asher Vance, 41, a private consultant based in Reykjavík, has been reported missing by his landlord. Police describe his disappearance as "consistent with voluntary relocation" but have not ruled out other possibilities. Vance was formerly an analyst at Voidlink International.',
      category: 'crime',
      delaySeconds: 120,
    },
    2: {  // EXPOSE_DISPATCH
      headline: 'Voidlink International Engulfed By "Lighthouse" Disclosure',
      body: 'An evidence bundle alleging that Voidlink International\'s Dispatch division has been profiling and selling operative profiles to corporate intelligence buyers has been released on Mesh broker channels and is being independently verified by three established journalist outlets. Voidlink has declined to comment. Initial market response is severe.',
      category: 'tech',
      delaySeconds: 90,
    },
    3: {  // DISAPPEAR
      headline: 'Anomalous Routing Migration Observed',
      body: 'Mesh observers note that a significant routing migration has taken place over the last 48 hours involving an unnamed independent operator. The operator has transitioned off Voidlink routing entirely and onto a privately-administered alternative. Voidlink Dispatch declined to comment on individual handle activity.',
      category: 'tech',
      delaySeconds: 180,
    },
    4: {  // WARN_CIPHER
      headline: '(No public news echo — the Underground does not announce when it is moving.)',
      body: 'Mesh observers note an uptick in encrypted handshake traffic on Underground channels over the last 36 hours. No public statement has been issued. Routine.',
      category: 'tech',
      delaySeconds: 240,
    },
  },
}

export const MULTIPHASE_TEMPLATES: MultiPhaseMissionTemplate[] = [PROJECT_GHOST, BLACK_HALO, DEAD_DROP_RESOLUTION, QUIET_WAR_RESOLUTION, LIGHTHOUSE_RESOLUTION]

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
