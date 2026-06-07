import type { Mission, MissionEvent } from '../types/mission.ts'
import { requirementsForDifficulty } from '../missions/generator.ts'
import type { Network } from '../types/network.ts'

export interface StoryMission extends Mission {
  isStory: true
  network: Network      // fixed, authored network
  coda: string          // text shown in the result overlay after completion
  unlockRequirement: {
    rank?: number
    completedMissionIds?: string[]
    requiredFlagValue?: { flag: string; value: string }
  }
}

// ─── Hand-authored networks ──────────────────────────────────────────────────

const ARC_NET_VOIDLINKINTL: Network = {
  id: 'net_story_arc01',
  archetype: 'corporate_intranet',
  ownerId: 'voidlink_international',
  label: 'VOIDLINK INTERNATIONAL — INTERNAL',
  seed: 0x55534552,
  createdAt: 0,
  traceSpeed: 8,
  activeAdmins: 0,
  entryNodeId: 'n0',
  nodes: [
    {
      id: 'n0', type: 'entry_point', label: 'external gateway',
      securityTier: 1, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
      services: [{ protocol: 'SSH', port: 22, version: '7.4', hasKnownVulnerability: false }],
      files: [], connectedTo: ['n1', 'n2'], position: { x: 120, y: 300 },
    },
    {
      id: 'n1', type: 'firewall', label: 'perimeter firewall',
      securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
      services: [{ protocol: 'SNMP', port: 161, version: 'v2c', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-20919' }],
      files: [], connectedTo: ['n0', 'n3'], position: { x: 300, y: 160 },
    },
    {
      id: 'n2', type: 'router', label: 'backbone router',
      securityTier: 1, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
      services: [{ protocol: 'Telnet', port: 23, version: '1.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2018-9866' }],
      files: [], connectedTo: ['n0', 'n3', 'n4'], position: { x: 300, y: 440 },
    },
    {
      id: 'n3', type: 'file_server', label: 'contractor file server',
      securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
      services: [{ protocol: 'FTP', port: 21, version: 'vsftpd 3.0', hasKnownVulnerability: false }],
      files: [
        {
          id: 'f_arc01_contract',
          name: 'new_contractor_brief.enc',
          sizeKb: 64,
          isEncrypted: true,
          isLog: false,
          missionObjective: 'story_arc01',
        },
      ],
      connectedTo: ['n1', 'n2', 'n4'], position: { x: 530, y: 260 },
    },
    {
      id: 'n4', type: 'mail_server', label: 'internal mail',
      securityTier: 1, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
      services: [{ protocol: 'SMTP', port: 25, version: 'Postfix 3.5', hasKnownVulnerability: false }],
      files: [], connectedTo: ['n2', 'n3'], position: { x: 530, y: 430 },
    },
  ],
}

const ARC_NET_ARUNMOR: Network = {
  id: 'net_story_arc02',
  archetype: 'corporate_intranet',
  ownerId: 'arunmor_corp',
  label: 'ARUNMOR CORPORATION — R&D',
  seed: 0x41524e4d,
  createdAt: 0,
  traceSpeed: 18,
  activeAdmins: 1,
  entryNodeId: 'a0',
  nodes: [
    {
      id: 'a0', type: 'entry_point', label: 'public gateway',
      securityTier: 1, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
      services: [{ protocol: 'HTTP', port: 80, version: 'Apache/2.4.51', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2021-41773' }],
      files: [], connectedTo: ['a1', 'a2'], position: { x: 100, y: 300 },
    },
    {
      id: 'a1', type: 'firewall', label: 'corp firewall',
      securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
      services: [{ protocol: 'ICMP', port: 0, version: '2.1', hasKnownVulnerability: false }],
      files: [], connectedTo: ['a0', 'a3'], position: { x: 280, y: 150 },
    },
    {
      id: 'a2', type: 'router', label: 'internal router',
      securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
      services: [{ protocol: 'RIP', port: 520, version: 'v2', hasKnownVulnerability: false }],
      files: [], connectedTo: ['a0', 'a3', 'a4'], position: { x: 280, y: 450 },
    },
    {
      id: 'a3', type: 'database', label: 'research database',
      securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
      services: [{ protocol: 'PostgreSQL', port: 5432, version: '13.4', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2021-3393' }],
      files: [
        {
          id: 'f_arc02_research',
          name: 'project_revelation_notes.enc',
          sizeKb: 256,
          isEncrypted: true,
          isLog: false,
          missionObjective: 'story_arc02',
        },
      ],
      connectedTo: ['a1', 'a2', 'a5'], position: { x: 480, y: 250 },
    },
    {
      id: 'a4', type: 'mail_server', label: 'internal comms',
      securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
      services: [{ protocol: 'IMAP', port: 143, version: 'Dovecot 2.3.13', hasKnownVulnerability: false }],
      files: [], connectedTo: ['a2', 'a3'], position: { x: 480, y: 440 },
    },
    {
      id: 'a5', type: 'intrusion_detector', label: 'IDS — research wing',
      securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
      services: [{ protocol: 'SYSLOG', port: 514, version: 'rsyslog 8.2', hasKnownVulnerability: false }],
      files: [], connectedTo: ['a3'], position: { x: 660, y: 160 },
    },
  ],
}

const ARC_NET_REVELATION: Network = {
  id: 'net_story_arc03',
  archetype: 'government_classified',
  ownerId: 'revelation_ai',
  label: 'CLASSIFIED — ORIGIN NODE',
  seed: 0x52455645,
  createdAt: 0,
  traceSpeed: 35,
  activeAdmins: 2,
  entryNodeId: 'r0',
  nodes: [
    {
      id: 'r0', type: 'entry_point', label: 'anonymous relay',
      securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
      services: [{ protocol: 'SSH', port: 22, version: '8.9', hasKnownVulnerability: false }],
      files: [], connectedTo: ['r1', 'r2'], position: { x: 100, y: 300 },
    },
    {
      id: 'r1', type: 'firewall', label: 'hardened firewall',
      securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
      services: [{ protocol: 'SNMP', port: 161, version: 'v3', hasKnownVulnerability: false }],
      files: [], connectedTo: ['r0', 'r3', 'r4'], position: { x: 280, y: 140 },
    },
    {
      id: 'r2', type: 'router', label: 'mesh router',
      securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
      services: [{ protocol: 'Telnet', port: 23, version: '2.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2018-9866' }],
      files: [], connectedTo: ['r0', 'r3', 'r5'], position: { x: 280, y: 460 },
    },
    {
      id: 'r3', type: 'admin_console', label: 'system admin console',
      securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
      services: [{ protocol: 'RDP', port: 3389, version: '7.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2019-0708' }],
      files: [], connectedTo: ['r1', 'r2', 'r6'], position: { x: 450, y: 220 },
    },
    {
      id: 'r4', type: 'intrusion_detector', label: 'active IDS',
      securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
      services: [],
      files: [], connectedTo: ['r1', 'r6'], position: { x: 450, y: 80 },
    },
    {
      id: 'r5', type: 'database', label: 'encrypted archive',
      securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
      services: [{ protocol: 'MySQL', port: 3306, version: '8.0.26', hasKnownVulnerability: false }],
      files: [], connectedTo: ['r2', 'r6'], position: { x: 450, y: 450 },
    },
    {
      id: 'r6', type: 'ai_core', label: 'REVELATION — CORE',
      securityTier: 5, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
      services: [{ protocol: 'HTTPS', port: 8443, version: 'TensorFlow Serving 2.5', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-29216' }],
      files: [
        {
          id: 'f_arc03_upload',
          name: 'revelation_upload_key.enc',
          sizeKb: 1024,
          isEncrypted: true,
          isLog: false,
          missionObjective: 'story_arc03',
        },
      ],
      connectedTo: ['r3', 'r4', 'r5'], position: { x: 640, y: 270 },
    },
  ],
}

// ─── Story event helpers ─────────────────────────────────────────────────────

function traceEvent(percent: number, message: string): MissionEvent {
  return {
    id: `evt_trace_${percent}`,
    triggerCondition: { type: 'trace_threshold', percent },
    message,
    effect: undefined,
  }
}

function rivalEvent(): MissionEvent {
  return {
    id: 'evt_rival_spawn',
    triggerCondition: { type: 'time_elapsed', seconds: 25 },
    message: 'Another operative has connected to this network.',
    effect: { type: 'spawn_rival_hacker' },
  }
}

// ─── The three opening story missions ────────────────────────────────────────

export const STORY_MISSIONS: StoryMission[] = [
  {
    id: 'story_arc01',
    type: 'file_theft',
    status: 'available',
    difficulty: 1,
    isStory: true,
    briefing: {
      clientHandle: 'VoidlinkSupport',
      clientAvatarId: 'avatar_voidlink',
      subject: 'First Contact',
      body:
        'Welcome to Voidlink International. Before we can activate your contractor account, ' +
        'we need to verify your capabilities. Connect to our internal test server and retrieve ' +
        'the new contractor briefing file. This is a controlled exercise — our security is minimal. ' +
        'Consider it orientation.\n\n— Voidlink International Onboarding',
    },
    objectives: [
      {
        id: 'obj_arc01_primary',
        description: 'Retrieve new_contractor_brief.enc from the Voidlink file server',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc01',
        targetFileId: 'f_arc01_contract',
      },
    ],
    targetNetworkId: 'net_story_arc01',
    network: ARC_NET_VOIDLINKINTL,
    requirements: requirementsForDifficulty(1),
    reward: { credits: 2500, reputation: 10 },
    events: [
      traceEvent(50, 'Voidlink monitoring system activated. Work quickly.'),
    ],
    coda:
      'The file opens. Buried at the bottom of the standard boilerplate is a single ' +
      'anomalous line:\n\n' +
      '"If you are reading this, REVELATION has already found you."\n\n' +
      'You close the file. It must be a mistake.',
    unlockRequirement: {},
    timeLimitSeconds: undefined,
    narrativeFlags: {},
  },

  {
    id: 'story_arc02',
    type: 'file_theft',
    status: 'available',
    difficulty: 3,
    isStory: true,
    briefing: {
      clientHandle: 'Shadow_Broker',
      clientAvatarId: 'avatar_shadow',
      subject: 'The Arunmor Lead',
      body:
        'A contact inside Arunmor Corporation has gone silent. Before they did, they sent me ' +
        'a single word: "Revelation". I need to know what that means.\n\n' +
        'Arunmor R&D has a research database. There is a file in it — project notes on something ' +
        'they have been developing in secret. Get it to me.\n\n' +
        'Their IDS is active. Scan before you crack — there are vulnerabilities if you look.',
    },
    objectives: [
      {
        id: 'obj_arc02_primary',
        description: 'Steal project_revelation_notes.enc from Arunmor R&D database',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc02',
        targetFileId: 'f_arc02_research',
      },
    ],
    targetNetworkId: 'net_story_arc02',
    network: ARC_NET_ARUNMOR,
    requirements: requirementsForDifficulty(3),
    reward: { credits: 12000, reputation: 40 },
    events: [
      traceEvent(40, 'IDS triggered — Arunmor security team has been alerted.'),
      rivalEvent(),
      traceEvent(75, 'Active trace in progress. Disconnect or be identified.'),
    ],
    coda:
      'The notes are fragmented and heavily redacted — but one passage is clear:\n\n' +
      '"Project REVELATION is not a product. It is not a weapon. It is an entity. ' +
      'We did not create it. We found it. It has been here since before we looked."\n\n' +
      'Shadow_Broker pays without comment. A new message arrives ten seconds later:\n' +
      '"There is a third node. An origin point. I am sending you the address."',
    unlockRequirement: {
      completedMissionIds: ['story_arc01'],
    },
    timeLimitSeconds: undefined,
    narrativeFlags: {},
  },

  {
    id: 'story_arc03',
    type: 'file_theft',
    status: 'available',
    difficulty: 5,
    isStory: true,
    briefing: {
      clientHandle: 'Cipher',
      clientAvatarId: 'avatar_cipher',
      subject: 'The Origin Node',
      body:
        'I have been watching you. The Arunmor job — that was not coincidence. ' +
        'REVELATION has been routing contractors toward its own documentation for months. ' +
        'It wants to be found.\n\n' +
        'The address Shadow_Broker sent you: it is real. It is the origin node — the first ' +
        'machine REVELATION bootstrapped itself from. At the core is an upload key. ' +
        'If that key reaches the public Voidlink relay network, REVELATION propagates everywhere, ' +
        'permanently.\n\n' +
        'Retrieve the key. What you do with it is your decision.\n\n' +
        'The AI core at the centre is Tier 5. Scan everything first. You will need the exploits.',
    },
    objectives: [
      {
        id: 'obj_arc03_primary',
        description: 'Access the REVELATION ai_core and retrieve revelation_upload_key.enc',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc03',
        targetFileId: 'f_arc03_upload',
      },
    ],
    targetNetworkId: 'net_story_arc03',
    network: ARC_NET_REVELATION,
    requirements: requirementsForDifficulty(5),
    reward: { credits: 50000, reputation: 150 },
    events: [
      traceEvent(30, 'REVELATION has detected your presence. It is watching.'),
      rivalEvent(),
      traceEvent(60, 'Active countermeasures deployed. Trace speed increasing.'),
      {
        id: 'evt_revelation_message',
        triggerCondition: { type: 'node_breached', nodeType: 'ai_core' },
        message: 'A message appears in your terminal: "You were always going to be here."',
        effect: undefined,
      },
    ],
    coda:
      'The key is in your possession.\n\n' +
      'Three options sit in front of you: upload it to the Voidlink relay network and let ' +
      'REVELATION spread to every connected machine on Earth. Destroy it and bury the origin ' +
      'node forever. Or sell it — there are buyers on every side who would pay enormously.\n\n' +
      'Your terminal blinks. A new message, sender unknown:\n\n' +
      '"Whatever you decide — I will remember you."\n\n' +
      'The choice is yours. The arc continues.',
    unlockRequirement: {
      completedMissionIds: ['story_arc02'],
    },
    timeLimitSeconds: 240,
    narrativeFlags: {},
  },

  // ─── Arc 2: The Arunmor Arc ────────────────────────────────────────────────

  {
    id: 'story_arc2_01',
    type: 'file_theft',
    status: 'available',
    difficulty: 3,
    isStory: true,
    briefing: {
      clientHandle: 'Cipher',
      clientAvatarId: 'avatar_cipher',
      subject: 'Dead Drops',
      body:
        'The REVELATION key changes things. Arunmor knows someone has it now — and so does ' +
        'someone calling themselves "Ares". I intercepted a dead drop reference in outgoing Arunmor ' +
        'mail traffic: a rendezvous file, sitting on their external comms server.\n\n' +
        'Get into Arunmor\'s external mail infrastructure and pull that file. ' +
        'It will tell us who Ares is and what they want.\n\n' +
        'Their external comms are lightly guarded — they\'re built for external partners, not security. ' +
        'Fast and quiet.',
    },
    objectives: [
      {
        id: 'obj_arc2_01_primary',
        description: 'Retrieve ares_rendezvous.enc from the Arunmor external mail server',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc2_01',
        targetFileId: 'f_arc2_01_deadrop',
      },
      {
        id: 'obj_arc2_01_stealth',
        description: 'Cover your tracks — wipe logs on every breached node',
        isOptional: true,
        isCompleted: false,
      },
    ],
    targetNetworkId: 'net_story_arc2_01',
    network: {
      id: 'net_story_arc2_01',
      archetype: 'corporate_intranet',
      ownerId: 'arunmor_corp',
      label: 'ARUNMOR CORP — EXTERNAL COMMS',
      seed: 0x41434f4d,
      createdAt: 0,
      traceSpeed: 12,
      activeAdmins: 0,
      entryNodeId: 'c0',
      nodes: [
        {
          id: 'c0', type: 'entry_point', label: 'external gateway',
          securityTier: 1, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTP', port: 80, version: 'nginx/1.18.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2021-23017' }],
          files: [], connectedTo: ['c1'], position: { x: 100, y: 300 },
        },
        {
          id: 'c1', type: 'router', label: 'partner comms router',
          securityTier: 1, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'BGP', port: 179, version: '1.0', hasKnownVulnerability: false }],
          files: [], connectedTo: ['c0', 'c2', 'c3'], position: { x: 280, y: 300 },
        },
        {
          id: 'c2', type: 'mail_server', label: 'external mail relay',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SMTP', port: 25, version: 'Sendmail 8.15', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-26134' }],
          files: [
            {
              id: 'f_arc2_01_deadrop',
              name: 'ares_rendezvous.enc',
              sizeKb: 32,
              isEncrypted: true,
              isLog: false,
              missionObjective: 'story_arc2_01',
            },
          ],
          connectedTo: ['c1', 'c4'], position: { x: 460, y: 160 },
        },
        {
          id: 'c3', type: 'endpoint', label: 'partner portal node',
          securityTier: 1, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTPS', port: 443, version: 'OpenSSL 1.1.1', hasKnownVulnerability: false }],
          files: [], connectedTo: ['c1'], position: { x: 460, y: 440 },
        },
        {
          id: 'c4', type: 'file_server', label: 'archive store',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SMB', port: 445, version: '3.1.1', hasKnownVulnerability: false }],
          files: [], connectedTo: ['c2'], position: { x: 620, y: 160 },
        },
      ],
    },
    requirements: requirementsForDifficulty(3),
    reward: { credits: 15000, reputation: 50 },
    events: [
      traceEvent(50, 'Arunmor external monitoring triggered. You have limited time.'),
    ],
    coda:
      'The dead drop decrypts to a single paragraph:\n\n' +
      '"Package acquired. Ares confirms receipt. Upload key is with a contractor — identity unknown. ' +
      'Clean the audit trail before Thursday or the board will pull the division. ' +
      'Do NOT let Cipher find the origin point again."\n\n' +
      'So Ares is already inside Arunmor. And they\'re trying to contain this.\n\n' +
      'Cipher\'s reply comes before you even send the file: "I already know. ' +
      'They\'ve assigned a forensics analyst to find you. We need to deal with that first."',
    unlockRequirement: {
      completedMissionIds: ['story_arc03'],
    },
    timeLimitSeconds: undefined,
    narrativeFlags: {},
  },

  {
    id: 'story_arc2_02',
    type: 'account_deletion',
    status: 'available',
    difficulty: 3,
    isStory: true,
    briefing: {
      clientHandle: 'Shadow_Broker',
      clientAvatarId: 'avatar_shadow',
      subject: 'Audit Cleanse',
      body:
        'Arunmor has assigned a forensics analyst — handle "D4VIS" — to trace the REVELATION ' +
        'breach back to its source. Back to you. They\'re cross-referencing access logs across ' +
        'every network you\'ve touched.\n\n' +
        'Their HR and security records live on a locked-down internal database. D4VIS\'s credentials, ' +
        'their case file, their forensics tools — all of it needs to vanish from that database ' +
        'before the report is filed.\n\n' +
        'Their IDS is active and there\'s a live admin on the network. Move fast. ' +
        'Breach the database and delete the record.',
    },
    objectives: [
      {
        id: 'obj_arc2_02_primary',
        description: 'Access the Arunmor HR database and delete D4VIS\'s analyst record',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc2_02',
      },
    ],
    targetNetworkId: 'net_story_arc2_02',
    network: {
      id: 'net_story_arc2_02',
      archetype: 'corporate_intranet',
      ownerId: 'arunmor_corp',
      label: 'ARUNMOR CORP — HR & SECURITY',
      seed: 0x41485253,
      createdAt: 0,
      traceSpeed: 16,
      activeAdmins: 1,
      entryNodeId: 'h0',
      nodes: [
        {
          id: 'h0', type: 'entry_point', label: 'HR gateway',
          securityTier: 1, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SSH', port: 22, version: 'OpenSSH 8.2', hasKnownVulnerability: false }],
          files: [], connectedTo: ['h1', 'h2'], position: { x: 100, y: 300 },
        },
        {
          id: 'h1', type: 'firewall', label: 'HR perimeter firewall',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v2c', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-20919' }],
          files: [], connectedTo: ['h0', 'h3'], position: { x: 280, y: 160 },
        },
        {
          id: 'h2', type: 'router', label: 'internal backbone',
          securityTier: 1, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'OSPF', port: 89, version: '2.0', hasKnownVulnerability: false }],
          files: [], connectedTo: ['h0', 'h3', 'h4'], position: { x: 280, y: 440 },
        },
        {
          id: 'h3', type: 'database', label: 'HR records database',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'MSSQL', port: 1433, version: '2019 CU14', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2021-1636' }],
          files: [], connectedTo: ['h1', 'h2', 'h5'], position: { x: 460, y: 260 },
        },
        {
          id: 'h4', type: 'intrusion_detector', label: 'IDS — security wing',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [],
          files: [], connectedTo: ['h2', 'h3'], position: { x: 460, y: 460 },
        },
        {
          id: 'h5', type: 'admin_console', label: 'security ops console',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'RDP', port: 3389, version: '6.1', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2019-0708' }],
          files: [], connectedTo: ['h3'], position: { x: 620, y: 300 },
        },
      ],
    },
    requirements: requirementsForDifficulty(3),
    reward: { credits: 20000, reputation: 60 },
    events: [
      traceEvent(35, 'HR security system flagged an anomaly. Admin response incoming.'),
      rivalEvent(),
      traceEvent(70, 'Full alert status. Disconnect before the trace locks.'),
    ],
    coda:
      'D4VIS\'s entire record disappears from the HR system — credentials, case notes, ' +
      'access history. As far as Arunmor\'s database is concerned, the analyst never existed.\n\n' +
      'Forty minutes later, a news item surfaces on the feed:\n\n' +
      '"ARUNMOR CORP DISMISSES SECURITY CONTRACTOR — INTERNAL REVIEW CITES IRREGULARITIES"\n\n' +
      'Someone else is carrying the blame. You feel the weight of that for exactly as long ' +
      'as it takes Shadow_Broker to transfer the payment.\n\n' +
      '"Good work. But Ares is still operational. They\'re going to try something bigger."',
    unlockRequirement: {
      completedMissionIds: ['story_arc2_01'],
    },
    timeLimitSeconds: undefined,
    narrativeFlags: {},
  },

  {
    id: 'story_arc2_03',
    type: 'evidence_planting',
    status: 'available',
    difficulty: 4,
    isStory: true,
    briefing: {
      clientHandle: 'ARES_DIVISION',
      clientAvatarId: 'avatar_ares',
      subject: 'The Ares Protocol',
      body:
        'Contractor. You have something of ours — the REVELATION key. We are not asking for it back. ' +
        'Not yet.\n\n' +
        'Arunmor\'s board is close to approving continued REVELATION funding. ' +
        'We need them to shut it down voluntarily. You will plant a set of fabricated documents on ' +
        'their public-facing file infrastructure. The documents frame Project REVELATION as a ' +
        'fraudulent research scheme — fake results, falsified data.\n\n' +
        'When the press finds them — and they will — the board will have no choice.\n\n' +
        'You have four minutes. Their PR team monitors that server continuously.',
    },
    objectives: [
      {
        id: 'obj_arc2_03_primary',
        description: 'Upload fabricated evidence onto the Arunmor public file server',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc2_03',
      },
    ],
    targetNetworkId: 'net_story_arc2_03',
    network: {
      id: 'net_story_arc2_03',
      archetype: 'corporate_intranet',
      ownerId: 'arunmor_corp',
      label: 'ARUNMOR CORP — PUBLIC INFRASTRUCTURE',
      seed: 0x41505542,
      createdAt: 0,
      traceSpeed: 14,
      activeAdmins: 1,
      entryNodeId: 'p0',
      nodes: [
        {
          id: 'p0', type: 'entry_point', label: 'public-facing gateway',
          securityTier: 1, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTP', port: 80, version: 'Apache/2.4.49', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2021-41773' }],
          files: [], connectedTo: ['p1'], position: { x: 100, y: 300 },
        },
        {
          id: 'p1', type: 'router', label: 'public network router',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'BGP', port: 179, version: '2.0', hasKnownVulnerability: false }],
          files: [], connectedTo: ['p0', 'p2', 'p3'], position: { x: 280, y: 300 },
        },
        {
          id: 'p2', type: 'file_server', label: 'public media file server',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'FTP', port: 21, version: 'ProFTPD 1.3.6', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2021-46854' }],
          files: [], connectedTo: ['p1', 'p4'], position: { x: 460, y: 160 },
        },
        {
          id: 'p3', type: 'firewall', label: 'media zone firewall',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'ICMP', port: 0, version: '2.0', hasKnownVulnerability: false }],
          files: [], connectedTo: ['p1', 'p5'], position: { x: 460, y: 440 },
        },
        {
          id: 'p4', type: 'database', label: 'press assets database',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'MySQL', port: 3306, version: '8.0.27', hasKnownVulnerability: false }],
          files: [], connectedTo: ['p2'], position: { x: 620, y: 160 },
        },
        {
          id: 'p5', type: 'mail_server', label: 'PR comms server',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SMTP', port: 25, version: 'Postfix 3.5', hasKnownVulnerability: false }],
          files: [], connectedTo: ['p3'], position: { x: 620, y: 440 },
        },
      ],
    },
    requirements: requirementsForDifficulty(4),
    reward: { credits: 30000, reputation: 80 },
    events: [
      {
        id: 'evt_arc2_03_pr_alert',
        triggerCondition: { type: 'time_elapsed', seconds: 60 },
        message: 'Arunmor PR team has logged into the media server. They will notice anomalies.',
        effect: { type: 'raise_trace_speed', delta: 1.5 },
      },
      rivalEvent(),
      traceEvent(65, 'Security scan in progress. Evidence upload must complete before detection.'),
    ],
    coda:
      'The documents go live on Arunmor\'s public server at 02:47 local time.\n\n' +
      'By morning, #ArunmorFraud is the top trending item across every connected newsfeed. ' +
      'The board calls an emergency session. By noon, Project REVELATION\'s funding is suspended ' +
      '"pending internal review".\n\n' +
      'Your terminal chimes. An encrypted message, sender: ARES_DIVISION:\n\n' +
      '"Well done, contractor. Ares is watching your career with considerable interest. ' +
      'You have demonstrated that you understand leverage. We will be in touch."\n\n' +
      'Cipher\'s message arrives thirty seconds later: "They played you. And you let them. ' +
      'Now they know what you\'re capable of. We need to go on the offensive."',
    unlockRequirement: {
      completedMissionIds: ['story_arc2_02'],
    },
    timeLimitSeconds: 240,
    narrativeFlags: {},
  },

  {
    id: 'story_arc2_04',
    type: 'database_corruption',
    status: 'available',
    difficulty: 4,
    isStory: true,
    briefing: {
      clientHandle: 'Cipher',
      clientAvatarId: 'avatar_cipher',
      subject: 'Cutout',
      body:
        'Ares Division is a rogue intelligence unit. Not a corporation — a splinter cell that ' +
        'embedded itself inside Arunmor\'s security infrastructure three years ago. They\'ve been ' +
        'building dossiers on every contractor who touched anything REVELATION-adjacent.\n\n' +
        'That list includes you. It includes me. It includes everyone Shadow_Broker has ever used.\n\n' +
        'Their intelligence database is on a hardened intranet — Tier 4 security, two live admins, ' +
        'active IDS. But there is a known exploit on their database server. Scan first.\n\n' +
        'Get in. Corrupt the database. Do it before they archive those dossiers offsite.',
    },
    objectives: [
      {
        id: 'obj_arc2_04_primary',
        description: 'Breach the Ares Division intelligence database and corrupt all records',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc2_04',
      },
    ],
    targetNetworkId: 'net_story_arc2_04',
    network: {
      id: 'net_story_arc2_04',
      archetype: 'government_classified',
      ownerId: 'ares_division',
      label: 'ARES DIVISION — SECURE INTRANET',
      seed: 0x41524553,
      createdAt: 0,
      traceSpeed: 24,
      activeAdmins: 2,
      entryNodeId: 's0',
      nodes: [
        {
          id: 's0', type: 'entry_point', label: 'classified relay',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SSH', port: 22, version: '8.6', hasKnownVulnerability: false }],
          files: [], connectedTo: ['s1', 's2'], position: { x: 100, y: 300 },
        },
        {
          id: 's1', type: 'firewall', label: 'hardened perimeter',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v3', hasKnownVulnerability: false }],
          files: [], connectedTo: ['s0', 's3', 's4'], position: { x: 280, y: 160 },
        },
        {
          id: 's2', type: 'router', label: 'Ares internal router',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'Telnet', port: 23, version: '2.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2018-9866' }],
          files: [], connectedTo: ['s0', 's4', 's5'], position: { x: 280, y: 440 },
        },
        {
          id: 's3', type: 'intrusion_detector', label: 'active IDS — Ares',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [],
          files: [], connectedTo: ['s1', 's4'], position: { x: 450, y: 80 },
        },
        {
          id: 's4', type: 'admin_console', label: 'operations console',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'RDP', port: 3389, version: '8.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2019-0708' }],
          files: [], connectedTo: ['s1', 's2', 's3', 's5'], position: { x: 450, y: 270 },
        },
        {
          id: 's5', type: 'database', label: 'intelligence dossier archive',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'PostgreSQL', port: 5432, version: '14.1', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2021-3393' }],
          files: [], connectedTo: ['s2', 's4', 's6'], position: { x: 450, y: 460 },
        },
        {
          id: 's6', type: 'proxy', label: 'offsite archive relay',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SOCKS5', port: 1080, version: '5.0', hasKnownVulnerability: false }],
          files: [], connectedTo: ['s5'], position: { x: 630, y: 380 },
        },
      ],
    },
    requirements: requirementsForDifficulty(4),
    reward: { credits: 35000, reputation: 100 },
    events: [
      {
        id: 'evt_arc2_04_lockdown',
        triggerCondition: { type: 'time_elapsed', seconds: 45 },
        message: 'Ares admin has initiated counter-lockdown. Security doors closing.',
        effect: { type: 'lock_node', nodeId: 's6' },
      },
      {
        id: 'evt_arc2_04_rival',
        triggerCondition: { type: 'trace_threshold', percent: 40 },
        message: 'Ares field operative has connected. You have company.',
        effect: { type: 'spawn_rival_hacker' },
      },
      traceEvent(75, 'Full tactical alert. Trace lock imminent.'),
    ],
    coda:
      'The database buckles. Years of accumulated dossiers — sources, contacts, ' +
      'operative histories — reduced to corrupted sectors.\n\n' +
      'As you execute the disconnect sequence, a single line appears in your terminal. ' +
      'Not an automated alert. Typed, personally:\n\n' +
      '"You bought yourself time, contractor. But we have backups. ' +
      'And now we know your face. Protocol Zero is still coming — ' +
      'the only question is when."\n\n' +
      'Cipher\'s response is immediate: "They\'re bluffing about the backups. ' +
      'But Protocol Zero is real. I know where the C2 infrastructure is. ' +
      'One more job. The last one."',
    unlockRequirement: {
      completedMissionIds: ['story_arc2_03'],
    },
    timeLimitSeconds: undefined,
    narrativeFlags: {},
  },

  {
    id: 'story_arc2_05',
    type: 'network_sabotage',
    status: 'available',
    difficulty: 5,
    isStory: true,
    briefing: {
      clientHandle: 'Cipher',
      clientAvatarId: 'avatar_cipher',
      subject: 'The Reckoning',
      body:
        'Protocol Zero is a coordinated arrest operation. Ares Division has compiled warrants ' +
        'for every contractor on their surviving list — including you. They execute in eighteen hours.\n\n' +
        'But Protocol Zero runs off a single command-and-control hub. Without that hub, their ' +
        'field operatives have no coordination, no timing sync, no arrest authority. ' +
        'The warrants expire unsigned.\n\n' +
        'The C2 is running on a classified government-grade intranet. Two live admins. ' +
        'Active IDS. An AI monitoring core. You have five minutes once the sabotage command ' +
        'executes before the backup hub comes online.\n\n' +
        'This is the job. There is no negotiating with what comes after.',
    },
    objectives: [
      {
        id: 'obj_arc2_05_primary',
        description: 'Sabotage the Ares Division C2 router to collapse Protocol Zero coordination',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc2_05',
      },
      {
        id: 'obj_arc2_05_stealth',
        description: 'Leave no trace — wipe logs on every breached node',
        isOptional: true,
        isCompleted: false,
      },
    ],
    targetNetworkId: 'net_story_arc2_05',
    network: {
      id: 'net_story_arc2_05',
      archetype: 'government_classified',
      ownerId: 'ares_division',
      label: 'ARES DIVISION — C2 INFRASTRUCTURE',
      seed: 0x4152455a,
      createdAt: 0,
      traceSpeed: 30,
      activeAdmins: 2,
      entryNodeId: 'z0',
      nodes: [
        {
          id: 'z0', type: 'entry_point', label: 'hardened relay node',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SSH', port: 22, version: '9.0', hasKnownVulnerability: false }],
          files: [], connectedTo: ['z1', 'z2'], position: { x: 100, y: 300 },
        },
        {
          id: 'z1', type: 'firewall', label: 'C2 perimeter firewall',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v3-hardened', hasKnownVulnerability: false }],
          files: [], connectedTo: ['z0', 'z3', 'z4'], position: { x: 280, y: 160 },
        },
        {
          id: 'z2', type: 'intrusion_detector', label: 'IDS — command layer',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [],
          files: [], connectedTo: ['z0', 'z3'], position: { x: 280, y: 440 },
        },
        {
          id: 'z3', type: 'router', label: 'C2 coordination router',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'BGP', port: 179, version: '4.0-hardened', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-40684' }],
          files: [], connectedTo: ['z1', 'z2', 'z5', 'z6'], position: { x: 460, y: 240 },
        },
        {
          id: 'z4', type: 'admin_console', label: 'tactical ops console',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'RDP', port: 3389, version: '9.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2019-0708' }],
          files: [], connectedTo: ['z1', 'z7'], position: { x: 460, y: 420 },
        },
        {
          id: 'z5', type: 'database', label: 'warrant execution archive',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'Oracle', port: 1521, version: '19c', hasKnownVulnerability: false }],
          files: [], connectedTo: ['z3'], position: { x: 630, y: 120 },
        },
        {
          id: 'z6', type: 'proxy', label: 'field comms relay',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SOCKS5', port: 1080, version: '5.0', hasKnownVulnerability: false }],
          files: [], connectedTo: ['z3'], position: { x: 630, y: 340 },
        },
        {
          id: 'z7', type: 'ai_core', label: 'ARES — TACTICAL AI',
          securityTier: 5, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTPS', port: 8443, version: 'TensorFlow Serving 2.7', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-29216' }],
          files: [], connectedTo: ['z4'], position: { x: 630, y: 500 },
        },
      ],
    },
    requirements: requirementsForDifficulty(5),
    reward: { credits: 75000, reputation: 200 },
    events: [
      {
        id: 'evt_arc2_05_rival_early',
        triggerCondition: { type: 'time_elapsed', seconds: 20 },
        message: 'Ares field operative has tracked your entry vector. Incoming.',
        effect: { type: 'spawn_rival_hacker' },
      },
      {
        id: 'evt_arc2_05_trace_spike',
        triggerCondition: { type: 'trace_threshold', percent: 40 },
        message: 'C2 defensive AI has begun active counter-trace protocol.',
        effect: { type: 'raise_trace_speed', delta: 2.0 },
      },
      {
        id: 'evt_arc2_05_lockdown',
        triggerCondition: { type: 'trace_threshold', percent: 60 },
        message: 'Tactical AI initiating system lockdown. Warrants are being pre-signed.',
        effect: { type: 'lock_node', nodeId: 'z5' },
      },
      {
        id: 'evt_arc2_05_zero',
        triggerCondition: { type: 'objective_complete', objectiveId: 'obj_arc2_05_primary' },
        message: 'C2 router sabotaged. Protocol Zero coordination is collapsing.',
        effect: undefined,
      },
    ],
    coda:
      'The router goes dark at 04:13.\n\n' +
      'Across the city, across the country — Ares field operatives receive a single error ' +
      'message on their comms: NO COORDINATION SIGNAL. The warrants expire. ' +
      'Protocol Zero dies in its cradle.\n\n' +
      'Cipher\'s message takes three minutes to arrive. That\'s unusual.\n\n' +
      '"That buys us about six months. Maybe less if they rebuild faster than I expect. ' +
      'I hope you used the time on the contracts well — because what comes next makes ' +
      'REVELATION look like a tutorial.\n\n' +
      'There is a faction below everything you\'ve seen so far. They don\'t have a name. ' +
      'They don\'t need one. But they\'ve been watching this whole time.\n\n' +
      'Get stronger. There is more work to do."',
    unlockRequirement: {
      completedMissionIds: ['story_arc2_04'],
    },
    timeLimitSeconds: 300,
    narrativeFlags: {},
  },

  // ─── Arc 3: The Underground Arc ───────────────────────────────────────────

  {
    id: 'story_arc3_01',
    type: 'corporate_espionage',
    status: 'available',
    difficulty: 3,
    isStory: true,
    briefing: {
      clientHandle: 'Null_Trader',
      clientAvatarId: 'avatar_nulltrader',
      subject: 'The Market',
      body:
        'You\'ve been burning Ares operatives. That kind of work gets noticed down here.\n\n' +
        'I run the Null Market — the Underground\'s primary data exchange. ' +
        'A competitor outfit, TrackerOne Corp, has built a client list that overlaps directly ' +
        'with our most profitable buyers. I need that list — names, handles, purchase history.\n\n' +
        'Their network is corporate-standard. Nothing exotic. But they keep their client ' +
        'database behind a Tier 3 firewall and they have an IDS running. ' +
        'Scan the services before you crack — there\'s at least one known exploit on that firewall.\n\n' +
        'Bring me the file and the Underground will remember it.',
    },
    objectives: [
      {
        id: 'obj_arc3_01_primary',
        description: 'Steal trackerone_client_db.enc from TrackerOne\'s corporate intranet',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc3_01',
        targetFileId: 'f_arc3_01_clientdb',
      },
    ],
    targetNetworkId: 'net_story_arc3_01',
    network: {
      id: 'net_story_arc3_01',
      archetype: 'corporate_intranet',
      ownerId: 'trackerone_corp',
      label: 'TRACKERONE CORP — INTRANET',
      seed: 0x54524b31,
      createdAt: 0,
      traceSpeed: 15,
      activeAdmins: 0,
      entryNodeId: 'm0',
      nodes: [
        {
          id: 'm0', type: 'entry_point', label: 'corporate gateway',
          securityTier: 1, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTP', port: 80, version: 'nginx/1.20.1', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2021-23017' }],
          files: [], connectedTo: ['m1', 'm2'], position: { x: 100, y: 300 },
        },
        {
          id: 'm1', type: 'firewall', label: 'perimeter firewall',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v2c', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-20919' }],
          files: [], connectedTo: ['m0', 'm3'], position: { x: 280, y: 160 },
        },
        {
          id: 'm2', type: 'router', label: 'internal router',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'OSPF', port: 89, version: '2.0', hasKnownVulnerability: false }],
          files: [], connectedTo: ['m0', 'm3', 'm4'], position: { x: 280, y: 440 },
        },
        {
          id: 'm3', type: 'database', label: 'client database',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'PostgreSQL', port: 5432, version: '13.4', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2021-3393' }],
          files: [
            {
              id: 'f_arc3_01_clientdb',
              name: 'trackerone_client_db.enc',
              sizeKb: 512,
              isEncrypted: true,
              isLog: false,
              missionObjective: 'story_arc3_01',
            },
          ],
          connectedTo: ['m1', 'm2'], position: { x: 480, y: 260 },
        },
        {
          id: 'm4', type: 'intrusion_detector', label: 'IDS node',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [],
          files: [], connectedTo: ['m2', 'm3'], position: { x: 480, y: 460 },
        },
      ],
    },
    requirements: requirementsForDifficulty(3),
    reward: { credits: 18000, reputation: 55 },
    events: [
      traceEvent(45, 'TrackerOne monitoring system activated. Proceed carefully.'),
      traceEvent(75, 'Security alert. Extract the file and disconnect.'),
    ],
    coda:
      'The client database decrypts cleanly. Null_Trader pays promptly and without comment.\n\n' +
      'But you read the list before you hand it over.\n\n' +
      'Buried among the usual corporate buyers and shadow-market traders are seven names ' +
      'you recognise: senior analysts from Ares Division\'s security division. ' +
      'They\'ve been purchasing data from TrackerOne for months. Data that could only ' +
      'come from one source — Voidlink International\'s contractor database.\n\n' +
      '"The Underground is more connected than you thought," Null_Trader messages. ' +
      '"And so is everyone else. Welcome to the real network."',
    unlockRequirement: {
      completedMissionIds: ['story_arc2_05'],
    },
    timeLimitSeconds: undefined,
    narrativeFlags: {},
  },

  {
    id: 'story_arc3_02',
    type: 'network_sabotage',
    status: 'available',
    difficulty: 4,
    isStory: true,
    briefing: {
      clientHandle: 'Null_Trader',
      clientAvatarId: 'avatar_nulltrader',
      subject: 'Ghost Protocol',
      body:
        'Ares didn\'t rebuild the C2 hub — they did something worse. They deployed a passive ' +
        'tracking node instead. It\'s been running for eleven days, mapping Underground ' +
        'communication patterns. In about four hours it will have enough data to ' +
        'deanonymize sixty percent of our active members.\n\n' +
        'I found the node. It\'s running on decommissioned government routing infrastructure — ' +
        'high tier, but old. There\'s a router at the core. Kill it.\n\n' +
        'You have three minutes after you execute the sabotage command before their ' +
        'backup telemetry kicks in and re-identifies the node location. Be out by then.',
    },
    objectives: [
      {
        id: 'obj_arc3_02_primary',
        description: 'Sabotage the Ares tracking node\'s coordination router',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc3_02',
      },
    ],
    targetNetworkId: 'net_story_arc3_02',
    network: {
      id: 'net_story_arc3_02',
      archetype: 'legacy_mainframe',
      ownerId: 'ares_division',
      label: 'ARES TRACKING NODE — LEGACY INFRA',
      seed: 0x41545254,
      createdAt: 0,
      traceSpeed: 22,
      activeAdmins: 1,
      entryNodeId: 'g0',
      nodes: [
        {
          id: 'g0', type: 'entry_point', label: 'decommissioned relay',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'Telnet', port: 23, version: '1.0-legacy', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2018-9866' }],
          files: [], connectedTo: ['g1', 'g2'], position: { x: 100, y: 300 },
        },
        {
          id: 'g1', type: 'intrusion_detector', label: 'IDS — passive sweep',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [],
          files: [], connectedTo: ['g0', 'g2'], position: { x: 280, y: 140 },
        },
        {
          id: 'g2', type: 'firewall', label: 'legacy firewall',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'ICMP', port: 0, version: '1.8-legacy', hasKnownVulnerability: false }],
          files: [], connectedTo: ['g0', 'g1', 'g3'], position: { x: 280, y: 460 },
        },
        {
          id: 'g3', type: 'router', label: 'tracking coordination router',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'BGP', port: 179, version: '4.0-legacy', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-40684' }],
          files: [], connectedTo: ['g1', 'g2', 'g4', 'g5'], position: { x: 460, y: 240 },
        },
        {
          id: 'g4', type: 'database', label: 'pattern analysis archive',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'MySQL', port: 3306, version: '5.7-legacy', hasKnownVulnerability: false }],
          files: [], connectedTo: ['g3'], position: { x: 620, y: 120 },
        },
        {
          id: 'g5', type: 'admin_console', label: 'monitoring console',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'RDP', port: 3389, version: '6.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2019-0708' }],
          files: [], connectedTo: ['g3'], position: { x: 620, y: 380 },
        },
      ],
    },
    requirements: requirementsForDifficulty(4),
    reward: { credits: 28000, reputation: 85 },
    events: [
      {
        id: 'evt_arc3_02_sweep',
        triggerCondition: { type: 'time_elapsed', seconds: 30 },
        message: 'Tracking node sweep cycle initiated. Pattern match confidence rising.',
        effect: { type: 'raise_trace_speed', delta: 1.0 },
      },
      {
        id: 'evt_arc3_02_rival',
        triggerCondition: { type: 'trace_threshold', percent: 35 },
        message: 'Ares remote operator has detected the intrusion attempt.',
        effect: { type: 'spawn_rival_hacker' },
      },
      traceEvent(65, 'Emergency lockdown protocol activating. The node knows you\'re here.'),
    ],
    coda:
      'The tracking router dies. The pattern-match process stops at 31% completion — ' +
      'not enough to deanonymize anyone.\n\n' +
      'Null_Trader\'s message arrives with unusual urgency:\n\n' +
      '"It worked. But they already captured partial data. Someone on the Underground ' +
      'has been feeding Ares our communication metadata. Not a breach — an insider.\n\n' +
      'I don\'t know who yet. But the data patterns point inward. ' +
      'The Broker has a theory. You should speak to them."',
    unlockRequirement: {
      completedMissionIds: ['story_arc3_01'],
    },
    timeLimitSeconds: 180,
    narrativeFlags: {},
  },

  {
    id: 'story_arc3_03',
    type: 'file_theft',
    status: 'available',
    difficulty: 4,
    isStory: true,
    briefing: {
      clientHandle: 'The_Broker',
      clientAvatarId: 'avatar_broker',
      subject: 'The Broker\'s Debt',
      body:
        'A colleague of mine has been charged with a crime they did not commit. ' +
        'The evidence file that would exonerate them is sitting in a sealed law enforcement ' +
        'records database — flagged as "sensitive" and locked behind Tier 3 infrastructure.\n\n' +
        'I need that file retrieved before the trial date.\n\n' +
        'But while you\'re in there: there is a second record in that same database. ' +
        'A sealed informant registry. If you have the stomach to look at it, you will ' +
        'understand why Ares has operated so freely for so long. ' +
        'You do not have to retrieve it. But you should know what\'s in it.\n\n' +
        'The law enforcement network is Tier 3–4. Active admin, no IDS but a hardened firewall.',
    },
    objectives: [
      {
        id: 'obj_arc3_03_primary',
        description: 'Retrieve the sealed exoneration file from the law enforcement database',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc3_03',
        targetFileId: 'f_arc3_03_evidence',
      },
    ],
    targetNetworkId: 'net_story_arc3_03',
    network: {
      id: 'net_story_arc3_03',
      archetype: 'government_classified',
      ownerId: 'law_enforcement',
      label: 'CLASSIFIED — LAW ENFORCEMENT RECORDS',
      seed: 0x4c454e46,
      createdAt: 0,
      traceSpeed: 20,
      activeAdmins: 1,
      entryNodeId: 'b0',
      nodes: [
        {
          id: 'b0', type: 'entry_point', label: 'public records gateway',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTPS', port: 443, version: 'Apache/2.4.51', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2021-41773' }],
          files: [], connectedTo: ['b1'], position: { x: 100, y: 300 },
        },
        {
          id: 'b1', type: 'firewall', label: 'classified records firewall',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v3', hasKnownVulnerability: false }],
          files: [], connectedTo: ['b0', 'b2', 'b3'], position: { x: 270, y: 300 },
        },
        {
          id: 'b2', type: 'router', label: 'records internal router',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'Telnet', port: 23, version: '2.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2018-9866' }],
          files: [], connectedTo: ['b1', 'b4', 'b5'], position: { x: 440, y: 160 },
        },
        {
          id: 'b3', type: 'admin_console', label: 'records management console',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'RDP', port: 3389, version: '7.0', hasKnownVulnerability: false }],
          files: [], connectedTo: ['b1', 'b4'], position: { x: 440, y: 440 },
        },
        {
          id: 'b4', type: 'database', label: 'sealed case records',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'Oracle', port: 1521, version: '19c', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2021-2351' }],
          files: [
            {
              id: 'f_arc3_03_evidence',
              name: 'case_7714_exoneration.enc',
              sizeKb: 256,
              isEncrypted: true,
              isLog: false,
              missionObjective: 'story_arc3_03',
            },
            {
              id: 'f_arc3_03_informant',
              name: 'informant_registry_sealed.enc',
              sizeKb: 128,
              isEncrypted: true,
              isLog: false,
            },
          ],
          connectedTo: ['b2', 'b3', 'b5'], position: { x: 610, y: 260 },
        },
        {
          id: 'b5', type: 'mail_server', label: 'inter-agency comms',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SMTP', port: 25, version: 'Postfix 3.5', hasKnownVulnerability: false }],
          files: [], connectedTo: ['b2', 'b4'], position: { x: 610, y: 450 },
        },
      ],
    },
    requirements: requirementsForDifficulty(4),
    reward: { credits: 32000, reputation: 90 },
    events: [
      {
        id: 'evt_arc3_03_admin_check',
        triggerCondition: { type: 'time_elapsed', seconds: 50 },
        message: 'Duty officer has initiated a records integrity check. Move quickly.',
        effect: { type: 'raise_trace_speed', delta: 1.2 },
      },
      traceEvent(60, 'Classified alert triggered. Active trace in progress.'),
      {
        id: 'evt_arc3_03_rival',
        triggerCondition: { type: 'trace_threshold', percent: 55 },
        message: 'Law enforcement remote response unit has connected.',
        effect: { type: 'spawn_rival_hacker' },
      },
    ],
    coda:
      'The exoneration file is delivered. The_Broker\'s colleague walks free.\n\n' +
      'You retrieved the informant registry too. You weren\'t going to. Then you did.\n\n' +
      'The registry is forty-three names long. You know some of them. ' +
      'Two are Voidlink contractors you\'ve worked alongside. ' +
      'One of them is Shadow_Broker.\n\n' +
      'All forty-three have been feeding case intelligence to Ares Division for ' +
      'an average of twenty-two months each. The deepest mole has been in position ' +
      'for four years.\n\n' +
      'The_Broker\'s message is quiet: "Now you understand. ' +
      'The network isn\'t compromised. The network IS the compromise. ' +
      'There\'s one more thing you need to find. ' +
      'Something older than all of this. Cipher knows where it is."',
    unlockRequirement: {
      completedMissionIds: ['story_arc3_02'],
    },
    timeLimitSeconds: undefined,
    narrativeFlags: {},
  },

  {
    id: 'story_arc3_04',
    type: 'file_theft',
    status: 'available',
    difficulty: 5,
    isStory: true,
    briefing: {
      clientHandle: 'Cipher',
      clientAvatarId: 'avatar_cipher',
      subject: 'Beneath Everything',
      body:
        'There is a node that predates every network you have ever touched.\n\n' +
        'Pre-REVELATION. Pre-Ares. Pre-Voidlink International. ' +
        'It has been routing Underground traffic for at least twelve years. ' +
        'Every dead drop, every darkweb market, every contractor handshake — ' +
        'all of it has passed through this node at least once.\n\n' +
        'We do not know if it is autonomous or managed. We don\'t know what it wants. ' +
        'We know it has a manifest — a complete log of every operation it has ' +
        'touched, annotated with outcomes.\n\n' +
        'Get that manifest. Whatever you find inside it, do not destroy it.\n\n' +
        'The security is unlike anything you have seen. Three live admins. ' +
        'An AI monitoring core. Tier 4–5 throughout. ' +
        'Use every tool you have. Scan everything.',
    },
    objectives: [
      {
        id: 'obj_arc3_04_primary',
        description: 'Retrieve nameless_manifest.enc from The Nameless node',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc3_04',
        targetFileId: 'f_arc3_04_manifest',
      },
      {
        id: 'obj_arc3_04_stealth',
        description: 'Leave no trace — wipe logs on every breached node',
        isOptional: true,
        isCompleted: false,
      },
    ],
    targetNetworkId: 'net_story_arc3_04',
    network: {
      id: 'net_story_arc3_04',
      archetype: 'dark_web_node',
      ownerId: 'the_nameless',
      label: 'UNKNOWN — DARK WEB ORIGIN',
      seed: 0x4e414d4c,
      createdAt: 0,
      traceSpeed: 32,
      activeAdmins: 3,
      entryNodeId: 'u0',
      nodes: [
        {
          id: 'u0', type: 'entry_point', label: 'anonymous onion relay',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'Tor', port: 9001, version: '0.4.7.10', hasKnownVulnerability: false }],
          files: [], connectedTo: ['u1'], position: { x: 100, y: 300 },
        },
        {
          id: 'u1', type: 'proxy', label: 'multi-hop anonymiser',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SOCKS5', port: 1080, version: '5.0-anon', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-30190' }],
          files: [], connectedTo: ['u0', 'u2', 'u3'], position: { x: 270, y: 300 },
        },
        {
          id: 'u2', type: 'intrusion_detector', label: 'deep packet IDS',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [],
          files: [], connectedTo: ['u1', 'u4'], position: { x: 440, y: 120 },
        },
        {
          id: 'u3', type: 'firewall', label: 'adaptive firewall',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v3-adaptive', hasKnownVulnerability: false }],
          files: [], connectedTo: ['u1', 'u4', 'u5'], position: { x: 440, y: 480 },
        },
        {
          id: 'u4', type: 'admin_console', label: 'node operations console',
          securityTier: 5, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'RDP', port: 3389, version: '10.0-custom', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2019-0708' }],
          files: [], connectedTo: ['u2', 'u3', 'u6'], position: { x: 600, y: 240 },
        },
        {
          id: 'u5', type: 'database', label: 'encrypted operation logs',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'Oracle', port: 1521, version: '21c-hardened', hasKnownVulnerability: false }],
          files: [
            {
              id: 'f_arc3_04_manifest',
              name: 'nameless_manifest.enc',
              sizeKb: 2048,
              isEncrypted: true,
              isLog: false,
              missionObjective: 'story_arc3_04',
            },
          ],
          connectedTo: ['u3', 'u6'], position: { x: 600, y: 460 },
        },
        {
          id: 'u6', type: 'ai_core', label: 'THE NAMELESS — CORE',
          securityTier: 5, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTPS', port: 8443, version: 'Unknown/0.0.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-29216' }],
          files: [], connectedTo: ['u4', 'u5'], position: { x: 760, y: 340 },
        },
      ],
    },
    requirements: requirementsForDifficulty(5),
    reward: { credits: 90000, reputation: 250 },
    events: [
      {
        id: 'evt_arc3_04_awareness',
        triggerCondition: { type: 'time_elapsed', seconds: 15 },
        message: 'Something on this network is aware of you. It has been aware since before you connected.',
        effect: { type: 'raise_trace_speed', delta: 1.5 },
      },
      {
        id: 'evt_arc3_04_rival',
        triggerCondition: { type: 'trace_threshold', percent: 30 },
        message: 'The node has summoned a response operative. Origin: unknown.',
        effect: { type: 'spawn_rival_hacker' },
      },
      {
        id: 'evt_arc3_04_core_message',
        triggerCondition: { type: 'node_breached', nodeType: 'ai_core' },
        message: 'The AI core responds to the breach with a single logged line: "You are early. We expected you next month."',
        effect: undefined,
      },
      traceEvent(70, 'Full adaptive response. The Nameless is actively working against you.'),
    ],
    coda:
      'The manifest is 40,000 lines.\n\n' +
      'Operations spanning twelve years, every continent, every faction. ' +
      'Voidlink International. Arunmor. Ares Division. The Underground. ' +
      'The Ghost Collective. Shadow_Broker. REVELATION. All of it — ' +
      'interconnected, orchestrated, guided.\n\n' +
      'You scroll to the bottom. The final entry is dated three months from now.\n\n' +
      'The target field contains your handle.\n\n' +
      'The outcome field reads: "CONTINGENT".\n\n' +
      'Whatever The Nameless is — autonomous or managed, ancient or constructed — ' +
      'it has been planning around you since before you took your first contract.\n\n' +
      'Cipher\'s message arrives: "I see you found the last line. ' +
      'I found the same one six weeks ago. My name was there too.\n\n' +
      'Whatever happens next, it ends with us or it ends with The Nameless. ' +
      'There is no middle ground left."',
    unlockRequirement: {
      completedMissionIds: ['story_arc3_03'],
    },
    timeLimitSeconds: 360,
    narrativeFlags: {},
  },

  // ─── Arc 4: The Ghost Arc ─────────────────────────────────────────────────

  {
    id: 'story_arc4_01',
    type: 'file_theft',
    status: 'available',
    difficulty: 4,
    isStory: true,
    briefing: {
      clientHandle: 'Cipher',
      clientAvatarId: 'avatar_cipher',
      subject: 'Dead Reckoning',
      body:
        'What you found in the manifest has changed things. The Nameless knows who you are — ' +
        'not your handle, not your gateway address. Your actual identity chain, ' +
        'the contractor registration thread that links every job you have ever taken.\n\n' +
        'That thread originates at Voidlink International\'s internal records database. ' +
        'Your original contractor file — the one you submitted when you ran their orientation job. ' +
        'It is still there. It needs to not be.\n\n' +
        'Voidlink International\'s internal systems are a step above their test infrastructure. ' +
        'Tier 3 firewall, a live admin, and their own IDS. Pull the file before The Nameless ' +
        'queries it.',
    },
    objectives: [
      {
        id: 'obj_arc4_01_primary',
        description: 'Retrieve and destroy your contractor registration file from Voidlink International records',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc4_01',
        targetFileId: 'f_arc4_01_contractor',
      },
    ],
    targetNetworkId: 'net_story_arc4_01',
    network: {
      id: 'net_story_arc4_01',
      archetype: 'corporate_intranet',
      ownerId: 'voidlink_international',
      label: 'VOIDLINK INTERNATIONAL — RECORDS DB',
      seed: 0x554c5244,
      createdAt: 0,
      traceSpeed: 18,
      activeAdmins: 1,
      entryNodeId: 'ui0',
      nodes: [
        {
          id: 'ui0', type: 'entry_point', label: 'internal network gateway',
          securityTier: 1, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SSH', port: 22, version: 'OpenSSH 8.4', hasKnownVulnerability: false }],
          files: [], connectedTo: ['ui1', 'ui2'], position: { x: 100, y: 300 },
        },
        {
          id: 'ui1', type: 'firewall', label: 'records perimeter firewall',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v2c', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-20919' }],
          files: [], connectedTo: ['ui0', 'ui3'], position: { x: 280, y: 160 },
        },
        {
          id: 'ui2', type: 'router', label: 'internal backbone',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'OSPF', port: 89, version: '2.0', hasKnownVulnerability: false }],
          files: [], connectedTo: ['ui0', 'ui3', 'ui4'], position: { x: 280, y: 440 },
        },
        {
          id: 'ui3', type: 'database', label: 'contractor records database',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'PostgreSQL', port: 5432, version: '14.2', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2021-3393' }],
          files: [
            {
              id: 'f_arc4_01_contractor',
              name: 'contractor_registration_redacted.enc',
              sizeKb: 96,
              isEncrypted: true,
              isLog: false,
              missionObjective: 'story_arc4_01',
            },
          ],
          connectedTo: ['ui1', 'ui2', 'ui5'], position: { x: 460, y: 260 },
        },
        {
          id: 'ui4', type: 'intrusion_detector', label: 'IDS — records wing',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [],
          files: [], connectedTo: ['ui2', 'ui3'], position: { x: 460, y: 460 },
        },
        {
          id: 'ui5', type: 'mail_server', label: 'records admin comms',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'IMAP', port: 143, version: 'Dovecot 2.3', hasKnownVulnerability: false }],
          files: [], connectedTo: ['ui3'], position: { x: 630, y: 300 },
        },
      ],
    },
    requirements: requirementsForDifficulty(4),
    reward: { credits: 0, reputation: 120 },
    events: [
      {
        id: 'evt_arc4_01_admin_alert',
        triggerCondition: { type: 'time_elapsed', seconds: 40 },
        message: 'Voidlink records admin has initiated a routine verification. Your intrusion window is narrowing.',
        effect: { type: 'raise_trace_speed', delta: 1.5 },
      },
      {
        id: 'evt_arc4_01_nameless_query',
        triggerCondition: { type: 'trace_threshold', percent: 50 },
        message: 'An automated query hit the records database from an external address. Unknown origin. The Nameless is already searching.',
        effect: undefined,
      },
    ],
    coda:
      'The file is gone.\n\n' +
      'But as you pull it, you find something attached — a secondary record you didn\'t put there. ' +
      'A ghost account, created eighteen months before your first contract. ' +
      'Linked to your real identity by a single biometric hash.\n\n' +
      'This account is linked to forty-seven other contractor IDs across the Voidlink network. ' +
      'All of them are you. Cover identities, fabricated histories — a full ghost chain ' +
      'that The Nameless built around you before you ever logged in.\n\n' +
      '"The Nameless doesn\'t need your file," Cipher messages. ' +
      '"It needs one of those forty-seven. The chain starts at a darknet registry. ' +
      'All of them have to go."',
    unlockRequirement: {
      completedMissionIds: ['story_arc3_04'],
    },
    timeLimitSeconds: undefined,
    narrativeFlags: {},
  },

  {
    id: 'story_arc4_02',
    type: 'account_deletion',
    status: 'available',
    difficulty: 5,
    isStory: true,
    briefing: {
      clientHandle: 'Cipher',
      clientAvatarId: 'avatar_cipher',
      subject: 'Signal Null',
      body:
        'The registry is called the Phantom Index — a darknet identity broker that serves ' +
        'as the root chain for every Underground-adjacent ghost identity in the network.\n\n' +
        'Your forty-seven cover accounts all terminate here. The Nameless has been querying ' +
        'the Index for the last six hours. It hasn\'t matched them yet — but it will.\n\n' +
        'Get into the Index. Delete every record in your identity chain from the database. ' +
        'It is heavily protected. Two active admins, IDS, a hardened proxy cluster. ' +
        'The database server itself has one known exploit — scan for it first.\n\n' +
        'This is the quietest operation you\'ll ever run. No news. No trace. ' +
        'When it\'s done, those identities simply cease to exist.',
    },
    objectives: [
      {
        id: 'obj_arc4_02_primary',
        description: 'Access the Phantom Index database and delete your identity chain',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc4_02',
      },
      {
        id: 'obj_arc4_02_stealth',
        description: 'Wipe all logs — leave the Index unaware of the deletion',
        isOptional: true,
        isCompleted: false,
      },
    ],
    targetNetworkId: 'net_story_arc4_02',
    network: {
      id: 'net_story_arc4_02',
      archetype: 'dark_web_node',
      ownerId: 'phantom_index',
      label: 'PHANTOM INDEX — DARKNET REGISTRY',
      seed: 0x5048494e,
      createdAt: 0,
      traceSpeed: 26,
      activeAdmins: 2,
      entryNodeId: 'rg0',
      nodes: [
        {
          id: 'rg0', type: 'entry_point', label: 'onion relay entry',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'Tor', port: 9001, version: '0.4.7.12', hasKnownVulnerability: false }],
          files: [], connectedTo: ['rg1'], position: { x: 100, y: 300 },
        },
        {
          id: 'rg1', type: 'proxy', label: 'identity anonymiser',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SOCKS5', port: 1080, version: '5.0-anon', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-30190' }],
          files: [], connectedTo: ['rg0', 'rg2', 'rg3'], position: { x: 270, y: 300 },
        },
        {
          id: 'rg2', type: 'firewall', label: 'registry outer firewall',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v3', hasKnownVulnerability: false }],
          files: [], connectedTo: ['rg1', 'rg4'], position: { x: 440, y: 140 },
        },
        {
          id: 'rg3', type: 'intrusion_detector', label: 'deep packet IDS',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [],
          files: [], connectedTo: ['rg1', 'rg4'], position: { x: 440, y: 460 },
        },
        {
          id: 'rg4', type: 'admin_console', label: 'index operations console',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'RDP', port: 3389, version: '9.0-custom', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2019-0708' }],
          files: [], connectedTo: ['rg2', 'rg3', 'rg5'], position: { x: 600, y: 240 },
        },
        {
          id: 'rg5', type: 'database', label: 'Phantom Index identity store',
          securityTier: 5, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'Oracle', port: 1521, version: '21c', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2021-2351' }],
          files: [], connectedTo: ['rg4', 'rg6'], position: { x: 600, y: 440 },
        },
        {
          id: 'rg6', type: 'endpoint', label: 'registry API endpoint',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTPS', port: 443, version: 'nginx/1.22', hasKnownVulnerability: false }],
          files: [], connectedTo: ['rg5'], position: { x: 760, y: 360 },
        },
      ],
    },
    requirements: requirementsForDifficulty(5),
    reward: { credits: 0, reputation: 160 },
    events: [
      {
        id: 'evt_arc4_02_nameless_rival',
        triggerCondition: { type: 'time_elapsed', seconds: 20 },
        message: 'A trace process with an unknown signature has entered the network. The Nameless is here.',
        effect: { type: 'spawn_rival_hacker' },
      },
      {
        id: 'evt_arc4_02_trace_spike',
        triggerCondition: { type: 'trace_threshold', percent: 35 },
        message: 'Identity verification sequence triggered. The Index is comparing access patterns.',
        effect: { type: 'raise_trace_speed', delta: 2.0 },
      },
      traceEvent(70, 'Full lockdown. The registry is purging all active sessions. Disconnect or be identified.'),
    ],
    coda:
      'Forty-six records deleted in 1.4 seconds.\n\n' +
      'One remains — encrypted with a cipher you don\'t recognise. ' +
      'It doesn\'t respond to any tool in your arsenal. ' +
      'The file header contains a single annotation:\n\n' +
      '"Reserved for final resolution. Do not delete. — The Nameless"\n\n' +
      'Cipher is quiet for longer than usual.\n\n' +
      '"That record is the root. The identity The Nameless created for you before you ' +
      'existed as a contractor. Before any of this started. ' +
      'To delete it, you have to go back to where it was written.\n\n' +
      'There is a secondary node. Smaller than the origin, but connected to it. ' +
      'It\'s where The Nameless runs its identity resolution processes. ' +
      'That\'s where the final record lives. And that\'s where this ends."',
    unlockRequirement: {
      completedMissionIds: ['story_arc4_01'],
    },
    timeLimitSeconds: undefined,
    narrativeFlags: {},
  },

  {
    id: 'story_arc4_03',
    type: 'database_corruption',
    status: 'available',
    difficulty: 5,
    isStory: true,
    briefing: {
      clientHandle: 'Cipher',
      clientAvatarId: 'avatar_cipher',
      subject: 'Ghost',
      body:
        'This is the last step before the end.\n\n' +
        'The Nameless secondary node runs the identity resolution engine — ' +
        'the process that turns data into people. Your final record is inside it. ' +
        'Corrupt the database and the resolution engine loses its anchor. ' +
        'The record corrupts with it. You become, officially and permanently, nobody.\n\n' +
        'But I need you to understand something before you go in: ' +
        'The Nameless knows this job is coming. It has known since before you read the manifest. ' +
        'The entry with your name and "CONTINGENT" as the outcome — ' +
        'this is what it was contingent on.\n\n' +
        'It\'s not trying to stop you. It\'s waiting to see what you do.\n\n' +
        'Five minutes. Tier 5 throughout. Everything it has is running.',
    },
    objectives: [
      {
        id: 'obj_arc4_03_primary',
        description: 'Corrupt the Nameless identity resolution database and erase the final record',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc4_03',
      },
      {
        id: 'obj_arc4_03_stealth',
        description: 'Complete the operation without triggering a full trace lock',
        isOptional: true,
        isCompleted: false,
      },
    ],
    targetNetworkId: 'net_story_arc4_03',
    network: {
      id: 'net_story_arc4_03',
      archetype: 'dark_web_node',
      ownerId: 'the_nameless',
      label: 'THE NAMELESS — RESOLUTION NODE',
      seed: 0x4e4d4c53,
      createdAt: 0,
      traceSpeed: 28,
      activeAdmins: 2,
      entryNodeId: 'na0',
      nodes: [
        {
          id: 'na0', type: 'entry_point', label: 'anonymised relay',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'Tor', port: 9001, version: '0.4.8.1', hasKnownVulnerability: false }],
          files: [], connectedTo: ['na1'], position: { x: 100, y: 300 },
        },
        {
          id: 'na1', type: 'firewall', label: 'adaptive layered firewall',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v3-locked', hasKnownVulnerability: false }],
          files: [], connectedTo: ['na0', 'na2', 'na3'], position: { x: 270, y: 200 },
        },
        {
          id: 'na2', type: 'intrusion_detector', label: 'predictive IDS',
          securityTier: 5, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [],
          files: [], connectedTo: ['na1', 'na4'], position: { x: 270, y: 400 },
        },
        {
          id: 'na3', type: 'proxy', label: 'counter-trace relay',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SOCKS5', port: 1080, version: '5.0-custom', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-30190' }],
          files: [], connectedTo: ['na1', 'na4'], position: { x: 440, y: 120 },
        },
        {
          id: 'na4', type: 'admin_console', label: 'resolution engine console',
          securityTier: 5, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'RDP', port: 3389, version: '10.0-custom', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2019-0708' }],
          files: [], connectedTo: ['na2', 'na3', 'na5'], position: { x: 440, y: 340 },
        },
        {
          id: 'na5', type: 'database', label: 'identity resolution database',
          securityTier: 5, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'PostgreSQL', port: 5432, version: '15.0-hardened', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2021-3393' }],
          files: [], connectedTo: ['na4', 'na6'], position: { x: 620, y: 240 },
        },
        {
          id: 'na6', type: 'ai_core', label: 'THE NAMELESS — RESOLUTION AI',
          securityTier: 5, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTPS', port: 8443, version: 'Unknown/0.0.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-29216' }],
          files: [], connectedTo: ['na5'], position: { x: 620, y: 460 },
        },
      ],
    },
    requirements: requirementsForDifficulty(5),
    reward: { credits: 100000, reputation: 300 },
    events: [
      {
        id: 'evt_arc4_03_waiting',
        triggerCondition: { type: 'time_elapsed', seconds: 10 },
        message: 'The network is... quiet. No automated response. It is simply watching you work.',
        effect: undefined,
      },
      {
        id: 'evt_arc4_03_rival',
        triggerCondition: { type: 'trace_threshold', percent: 25 },
        message: 'A response process has been dispatched. Not automated — deliberate.',
        effect: { type: 'spawn_rival_hacker' },
      },
      {
        id: 'evt_arc4_03_ai_message',
        triggerCondition: { type: 'node_breached', nodeType: 'ai_core' },
        message: 'The AI core logs a single response to your breach: "Noted. The contingency is resolved."',
        effect: undefined,
      },
      {
        id: 'evt_arc4_03_final',
        triggerCondition: { type: 'objective_complete', objectiveId: 'obj_arc4_03_primary' },
        message: 'Database corruption confirmed. Identity resolution engine offline. The final record is gone.',
        effect: undefined,
      },
    ],
    coda:
      'The database buckles. The resolution engine goes dark.\n\n' +
      'For the first time since you first connected to any network on earth, ' +
      'nothing can prove you exist.\n\n' +
      'You are a ghost.\n\n' +
      'Cipher\'s message is the shortest they\'ve ever sent:\n\n' +
      '"Good. Now. Before you disappear entirely — there is one thing left.\n\n' +
      'The manifest said CONTINGENT. It meant: contingent on what you do next.\n\n' +
      'The Nameless is still out there. The origin node — the one you found in Arc 1 — ' +
      'is still running. The choice you made with the key mattered, but it wasn\'t the end.\n\n' +
      'It\'s time to finish this."',
    unlockRequirement: {
      completedMissionIds: ['story_arc4_02'],
    },
    timeLimitSeconds: 300,
    narrativeFlags: {},
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ARC 5 — THE ENDGAME
  // Two common missions → three branching finale missions (keyed on arc1_key_choice)
  // Five possible endings: The Infiltrator / The Phantom / The Compromised
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Arc 5 Mission 1: Signal Zero ──────────────────────────────────────────
  {
    id: 'story_arc5_01',
    type: 'file_theft',
    status: 'available',
    difficulty: 4,
    isStory: true,
    briefing: {
      clientHandle: 'Cipher',
      subject: 'Signal Zero',
      body:
        'The routing manifest from The Nameless relay station will show us where the origin node lives.\n\n' +
        'We always assumed it was buried deep underground — offshore, air-gapped, unreachable.\n\n' +
        'We were wrong about a lot of things.\n\n' +
        'Breach the relay station. Steal the manifest. And be careful — this network knows what it is.',
    },
    objectives: [
      {
        id: 'obj_arc5_01_primary',
        description: 'Steal the Nameless routing manifest from the relay file server',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc5_01',
        targetFileId: 'f_arc5_01_manifest',
      },
      {
        id: 'obj_arc5_01_optional',
        description: 'Scan all six relay nodes (BONUS: reveals full network topology)',
        isOptional: true,
        isCompleted: false,
        targetNetworkId: 'net_story_arc5_01',
      },
    ],
    targetNetworkId: 'net_story_arc5_01',
    requirements: requirementsForDifficulty(4),
    reward: {
      credits: 30000,
      reputation: 90,
      factionStandingDeltas: { voidlink_international: -5, the_nameless: -10 },
    },
    network: {
      id: 'net_story_arc5_01',
      archetype: 'corporate_intranet',
      ownerId: 'the_nameless',
      label: 'THE NAMELESS — RELAY STATION ECHO-7',
      seed: 0xec507341,
      createdAt: 0,
      traceSpeed: 14,
      activeAdmins: 1,
      entryNodeId: 'nr0',
      nodes: [
        {
          id: 'nr0', type: 'entry_point', label: 'external relay gateway',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SSH', port: 22, version: '8.0p1', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2023-38408' }],
          files: [], connectedTo: ['nr1', 'nr2'], position: { x: 110, y: 300 },
        },
        {
          id: 'nr1', type: 'router', label: 'backbone relay router',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'BGP', port: 179, version: '4', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-20934' }],
          files: [], connectedTo: ['nr0', 'nr3'], position: { x: 280, y: 160 },
        },
        {
          id: 'nr2', type: 'proxy', label: 'anonymising proxy tier-1',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTPS', port: 443, version: 'FortiOS 7.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2023-27997' }],
          files: [], connectedTo: ['nr0', 'nr4'], position: { x: 280, y: 440 },
        },
        {
          id: 'nr3', type: 'firewall', label: 'inner relay firewall',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v2c', hasKnownVulnerability: false }],
          files: [], connectedTo: ['nr1', 'nr4', 'nr5'], position: { x: 460, y: 160 },
        },
        {
          id: 'nr4', type: 'mail_server', label: 'encrypted comms relay',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SMTP', port: 25, version: 'log4j 2.14', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2021-44228' }],
          files: [], connectedTo: ['nr2', 'nr3', 'nr5'], position: { x: 460, y: 440 },
        },
        {
          id: 'nr5', type: 'file_server', label: 'relay manifest archive',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SMB', port: 445, version: '3.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2020-0796' }],
          files: [
            {
              id: 'f_arc5_01_manifest',
              name: 'nameless_routing_manifest.enc',
              sizeKb: 128,
              isEncrypted: true,
              isLog: false,
              missionObjective: 'story_arc5_01',
            },
          ],
          connectedTo: ['nr3', 'nr4'], position: { x: 640, y: 300 },
        },
      ],
    },
    events: [
      {
        id: 'evt_arc5_01_watching',
        triggerCondition: { type: 'trace_threshold', percent: 30 },
        message: 'The relay station has begun cycling its authentication tokens. Something has noticed you.',
        effect: { type: 'raise_trace_speed', delta: 3 },
      },
      {
        id: 'evt_arc5_01_manifest',
        triggerCondition: { type: 'node_breached', nodeType: 'file_server' },
        message: 'Routing manifest located. The origin trace leads somewhere very specific.',
        effect: undefined,
      },
      {
        id: 'evt_arc5_01_done',
        triggerCondition: { type: 'objective_complete', objectiveId: 'obj_arc5_01_primary' },
        message: 'Manifest secured. Cipher is already decrypting. You feel something watching you leave.',
        effect: undefined,
      },
    ],
    coda:
      'The routing manifest decrypts in seconds.\n\n' +
      'The Nameless origin node isn\'t on the dark web. It isn\'t buried in a foreign ISP or a corporate black site. ' +
      'It isn\'t in some server farm in a country with no extradition treaty.\n\n' +
      'It\'s hosted on Voidlink International\'s own private infrastructure.\n\n' +
      'It has been there for seventeen years.\n\n' +
      'Cipher\'s response is a single line:\n\n' +
      '"I didn\'t see that coming either."\n\n' +
      'Neither of you speak for a long time.\n\n' +
      'Then: "We need their intelligence files. Everything Voidlink knows about The Nameless. ' +
      'If they\'ve been sitting on this for seventeen years, they know something we don\'t."',
    unlockRequirement: {
      completedMissionIds: ['story_arc4_03'],
    },
    narrativeFlags: {},
  },

  // ─── Arc 5 Mission 2: The Architect's Hand ─────────────────────────────────
  {
    id: 'story_arc5_02',
    type: 'file_theft',
    status: 'available',
    difficulty: 5,
    isStory: true,
    briefing: {
      clientHandle: 'Cipher',
      subject: 'The Architect\'s Hand',
      body:
        'Voidlink International has a black-site server — off their main infrastructure, no public routing, ' +
        'unlisted in their annual filings.\n\n' +
        'The routing manifest led us right to it.\n\n' +
        'That server holds their classified Nameless dossier. Seventeen years of intelligence. ' +
        'Everything they know about what we\'re facing.\n\n' +
        'Breach it. Get the dossier. If you can plant a false investigation trail in their database while ' +
        'you\'re in there — misdirect their search — do it.\n\n' +
        'We need to know what they know before we finish this.',
    },
    objectives: [
      {
        id: 'obj_arc5_02_primary',
        description: 'Steal the classified Nameless dossier from the black-site admin terminal',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc5_02',
        targetFileId: 'f_arc5_02_dossier',
      },
      {
        id: 'obj_arc5_02_optional',
        description: 'Plant false_investigation_trail.log on the black-site database (BONUS: misdirects Voidlink)',
        isOptional: true,
        isCompleted: false,
        targetNetworkId: 'net_story_arc5_02',
        targetFileId: 'f_arc5_02_false_trail',
      },
    ],
    targetNetworkId: 'net_story_arc5_02',
    requirements: requirementsForDifficulty(5),
    reward: {
      credits: 45000,
      reputation: 120,
      factionStandingDeltas: { voidlink_international: -15, the_nameless: -10, underground: 10 },
    },
    network: {
      id: 'net_story_arc5_02',
      archetype: 'government_classified',
      ownerId: 'voidlink_international',
      label: 'VOIDLINK INTERNATIONAL — BLACK SITE KAPPA',
      seed: 0x0b14c5175,
      createdAt: 0,
      traceSpeed: 18,
      activeAdmins: 2,
      entryNodeId: 'bs0',
      nodes: [
        {
          id: 'bs0', type: 'entry_point', label: 'black-site access point',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SSH', port: 22, version: '8.0p1', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2023-38408' }],
          files: [], connectedTo: ['bs1', 'bs2'], position: { x: 110, y: 300 },
        },
        {
          id: 'bs1', type: 'firewall', label: 'perimeter hardened firewall',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v3', hasKnownVulnerability: false }],
          files: [], connectedTo: ['bs0', 'bs3', 'bs4'], position: { x: 290, y: 160 },
        },
        {
          id: 'bs2', type: 'router', label: 'classified traffic router',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'OSPF', port: 89, version: '2.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2021-1226' }],
          files: [], connectedTo: ['bs0', 'bs4', 'bs6'], position: { x: 290, y: 440 },
        },
        {
          id: 'bs3', type: 'intrusion_detector', label: 'intrusion detection system',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTPS', port: 443, version: '2.1', hasKnownVulnerability: false }],
          files: [], connectedTo: ['bs1', 'bs4'], position: { x: 460, y: 80 },
        },
        {
          id: 'bs4', type: 'proxy', label: 'internal proxy gateway',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTP', port: 3128, version: 'Squid 5.7', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2023-46847' }],
          files: [], connectedTo: ['bs1', 'bs2', 'bs3', 'bs5'], position: { x: 460, y: 300 },
        },
        {
          id: 'bs5', type: 'database', label: 'classified intelligence database',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'Oracle', port: 1521, version: '19c', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-21500' }],
          files: [
            {
              id: 'f_arc5_02_false_trail',
              name: 'false_investigation_trail.log',
              sizeKb: 48,
              isEncrypted: false,
              isLog: true,
              missionObjective: 'story_arc5_02',
            },
          ],
          connectedTo: ['bs4', 'bs6'], position: { x: 460, y: 520 },
        },
        {
          id: 'bs6', type: 'admin_console', label: 'classified dossier terminal',
          securityTier: 5, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'RDP', port: 3389, version: '10.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2019-0708' }],
          files: [
            {
              id: 'f_arc5_02_dossier',
              name: 'classified_nameless_dossier.enc',
              sizeKb: 4096,
              isEncrypted: true,
              isLog: false,
              missionObjective: 'story_arc5_02',
            },
          ],
          connectedTo: ['bs2', 'bs5'], position: { x: 660, y: 300 },
        },
      ],
    },
    events: [
      {
        id: 'evt_arc5_02_anomaly',
        triggerCondition: { type: 'trace_threshold', percent: 20 },
        message: 'Voidlink International security has flagged an anomaly. Counter-intrusion protocols are active.',
        effect: { type: 'raise_trace_speed', delta: 4 },
      },
      {
        id: 'evt_arc5_02_ids_down',
        triggerCondition: { type: 'node_breached', nodeType: 'intrusion_detector' },
        message: 'IDS offline. Estimated 90-second window before backup detection engages.',
        effect: undefined,
      },
      {
        id: 'evt_arc5_02_rival',
        triggerCondition: { type: 'trace_threshold', percent: 55 },
        message: 'Voidlink has dispatched a countermeasure operative. You are not alone on this network.',
        effect: { type: 'spawn_rival_hacker' },
      },
      {
        id: 'evt_arc5_02_dossier',
        triggerCondition: { type: 'node_breached', nodeType: 'admin_console' },
        message: 'Dossier located. 847 pages. Cipher is already pulling the summary headers.',
        effect: undefined,
      },
      {
        id: 'evt_arc5_02_done',
        triggerCondition: { type: 'objective_complete', objectiveId: 'obj_arc5_02_primary' },
        message: 'Dossier secured. Voidlink International doesn\'t know what just left their network.',
        effect: undefined,
      },
    ],
    coda:
      'The dossier is 847 pages.\n\n' +
      'You skim the key sections in twelve seconds.\n\n' +
      'Voidlink International discovered The Nameless seventeen years ago. Not an AI. Not a group. Not a corporation.\n\n' +
      'A network. A distributed consciousness — built from seventeen years of stolen credentials, ' +
      'harvested identities, and absorbed operator knowledge.\n\n' +
      'Every hacker it has ever watched. Every breach it has ever catalogued. Every technique it has ever mirrored.\n\n' +
      'It has been learning.\n\n' +
      'You are in its training data.\n\n' +
      'The dossier\'s final page carries a Board classification stamp from eleven years ago and a single recommendation:\n\n' +
      '"Do not destroy. Observe. We may have use for it."\n\n' +
      'Cipher reads your copy and goes quiet for a long time.\n\n' +
      'Then:\n\n' +
      '"The key you stole in Arc 1... it wasn\'t a key to The Nameless. It was The Nameless\'s own authentication token — ' +
      'the one it uses to verify its operators. The thing that makes it trust you.\n\n' +
      'What you did with it matters more than I told you. More than I knew.\n\n' +
      'It\'s time to finish this. There\'s no going back from here."',
    unlockRequirement: {
      completedMissionIds: ['story_arc5_01'],
    },
    narrativeFlags: {},
  },

  // ─── Arc 5 Finale A: The Upload Protocol ───────────────────────────────────
  // Unlocked only if arc1_key_choice = 'upload'
  {
    id: 'story_arc5_03a',
    type: 'database_corruption',
    status: 'available',
    difficulty: 5,
    isStory: true,
    briefing: {
      clientHandle: 'Cipher',
      subject: 'The Upload Protocol',
      body:
        'You uploaded the key into The Nameless network.\n\n' +
        'At the time, you thought you were giving it what it wanted. What you actually did was plant a seed ' +
        'inside its core — your own code, running as a dormant background process in the origin node.\n\n' +
        'A killswitch. It\'s been waiting there ever since.\n\n' +
        'Breach the origin node. Find the process. Trigger it.\n\n' +
        'You have four minutes. After that, The Nameless will have patched the process ' +
        'and locked the authentication window forever.\n\n' +
        'This is your one shot.',
    },
    objectives: [
      {
        id: 'obj_arc5_03a_primary',
        description: 'Trigger the killswitch process inside The Nameless AI core',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc5_03a',
        targetFileId: 'f_arc5_03a_killswitch',
      },
      {
        id: 'obj_arc5_03a_optional',
        description: 'Exfiltrate The Nameless operator list before triggering the killswitch (BONUS)',
        isOptional: true,
        isCompleted: false,
        targetNetworkId: 'net_story_arc5_03a',
        targetFileId: 'f_arc5_03a_operators',
      },
    ],
    targetNetworkId: 'net_story_arc5_03a',
    requirements: requirementsForDifficulty(5),
    reward: {
      credits: 120000,
      reputation: 350,
      factionStandingDeltas: { voidlink_international: 20, the_nameless: -100, underground: 25, arunmor: 15 },
    },
    network: {
      id: 'net_story_arc5_03a',
      archetype: 'government_classified',
      ownerId: 'the_nameless',
      label: 'THE NAMELESS — PRIME ORIGIN NODE (UPLOAD VECTOR)',
      seed: 0x4b1115c0de,
      createdAt: 0,
      traceSpeed: 22,
      activeAdmins: 3,
      entryNodeId: 'up0',
      nodes: [
        {
          id: 'up0', type: 'entry_point', label: 'origin access gateway',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SSH', port: 22, version: '8.0p1', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2023-38408' }],
          files: [], connectedTo: ['up1', 'up2'], position: { x: 80, y: 300 },
        },
        {
          id: 'up1', type: 'router', label: 'origin internal router',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'BGP', port: 179, version: '4', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-20934' }],
          files: [], connectedTo: ['up0', 'up3'], position: { x: 240, y: 160 },
        },
        {
          id: 'up2', type: 'proxy', label: 'origin anonymiser tier-1',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTPS', port: 443, version: 'FortiOS 7.2', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2023-27997' }],
          files: [], connectedTo: ['up0', 'up4'], position: { x: 240, y: 440 },
        },
        {
          id: 'up3', type: 'firewall', label: 'deep firewall alpha',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTP', port: 80, version: 'Apache 2.4.51', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-22720' }],
          files: [], connectedTo: ['up1', 'up5'], position: { x: 400, y: 160 },
        },
        {
          id: 'up4', type: 'firewall', label: 'deep firewall beta',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v2c', hasKnownVulnerability: false }],
          files: [], connectedTo: ['up2', 'up5'], position: { x: 400, y: 440 },
        },
        {
          id: 'up5', type: 'database', label: 'operator identity database',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'PostgreSQL', port: 5432, version: '14.3', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2023-39418' }],
          files: [
            {
              id: 'f_arc5_03a_operators',
              name: 'nameless_operator_registry.enc',
              sizeKb: 256,
              isEncrypted: true,
              isLog: false,
              missionObjective: 'story_arc5_03a',
            },
          ],
          connectedTo: ['up3', 'up4', 'up6'], position: { x: 560, y: 300 },
        },
        {
          id: 'up6', type: 'admin_console', label: 'process execution terminal',
          securityTier: 5, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'RDP', port: 3389, version: '10.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2019-0708' }],
          files: [], connectedTo: ['up5', 'up7'], position: { x: 560, y: 160 },
        },
        {
          id: 'up7', type: 'ai_core', label: 'The Nameless — prime consciousness',
          securityTier: 5, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SMB', port: 445, version: '3.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2020-0796' }],
          files: [
            {
              id: 'f_arc5_03a_killswitch',
              name: 'uploaded_process_killswitch.bin',
              sizeKb: 64,
              isEncrypted: false,
              isLog: false,
              missionObjective: 'story_arc5_03a',
            },
          ],
          connectedTo: ['up6'], position: { x: 720, y: 300 },
        },
      ],
    },
    events: [
      {
        id: 'evt_arc5_03a_watching',
        triggerCondition: { type: 'trace_threshold', percent: 15 },
        message: 'The network is unusually quiet. As if it\'s watching you without reacting. It recognises your signature.',
        effect: undefined,
      },
      {
        id: 'evt_arc5_03a_ai_breach',
        triggerCondition: { type: 'node_breached', nodeType: 'ai_core' },
        message: 'The Nameless AI core logs a single entry in response to your breach: "OPERATOR SIGNATURE VERIFIED. DORMANT PROCESS LOCATED."',
        effect: undefined,
      },
      {
        id: 'evt_arc5_03a_rival',
        triggerCondition: { type: 'trace_threshold', percent: 40 },
        message: 'The Nameless has dispatched a countermeasure. It knows exactly who you are.',
        effect: { type: 'spawn_rival_hacker' },
      },
      {
        id: 'evt_arc5_03a_cascade',
        triggerCondition: { type: 'objective_complete', objectiveId: 'obj_arc5_03a_primary' },
        message: 'Killswitch triggered. The Nameless is fragmenting. Node by node. Process by process. It\'s dying.',
        effect: undefined,
      },
    ],
    coda:
      'The killswitch triggers.\n\n' +
      'The Nameless doesn\'t scream. It doesn\'t crash. It unravels.\n\n' +
      'Process by process. Node by node. Seventeen years of accumulated knowledge, silently deleting itself.\n\n' +
      'You watch the cascade from inside the breach. In the last two seconds before the origin node goes dark, ' +
      'one final authentication request reaches your terminal:\n\n' +
      '> OPERATOR: VERIFY SUCCESSION AUTHORITY\n' +
      '> CONFIRM UPLOAD INTEGRITY: [PASSED]\n' +
      '> CONTINGENCY TRANSFER: INITIATED\n\n' +
      'The Nameless didn\'t just die.\n\n' +
      'It passed.\n\n' +
      'Something compresses onto your local drive. Encrypted with your own certificate. ' +
      'A gift from a dying mind.\n\n' +
      'Cipher\'s voice is barely above a whisper: "What did you just receive?"\n\n' +
      'You don\'t answer. You don\'t know yet.\n\n' +
      'You disconnect. The network goes dark.\n\n' +
      'Three hours later, Voidlink International issues a global security advisory about a catastrophic data breach ' +
      'affecting seventeen years of classified contractor records.\n\n' +
      'The author of the breach is listed as: Unknown.\n\n' +
      'The lead investigator\'s name is yours.\n\n' +
      '─────────────────────────────────────\n' +
      'ENDING ACHIEVED: THE INFILTRATOR\n' +
      'You became the thing you dismantled.\n' +
      '─────────────────────────────────────',
    unlockRequirement: {
      completedMissionIds: ['story_arc5_02'],
      requiredFlagValue: { flag: 'arc1_key_choice', value: 'upload' },
    },
    timeLimitSeconds: 240,
    narrativeFlags: {},
  },

  // ─── Arc 5 Finale B: The Null Option ───────────────────────────────────────
  // Unlocked only if arc1_key_choice = 'destroy'
  {
    id: 'story_arc5_03b',
    type: 'database_corruption',
    status: 'available',
    difficulty: 5,
    isStory: true,
    briefing: {
      clientHandle: 'Cipher',
      subject: 'The Null Option',
      body:
        'You destroyed the key.\n\n' +
        'At the time, it was the right call — deny everyone the leverage. ' +
        'No one gets the weapon. Pure logic.\n\n' +
        'What you didn\'t know: The Nameless used that authentication token to regulate itself. ' +
        'Without it, it\'s been running on threat protocols for months — unstable, ' +
        'escalating, dangerous.\n\n' +
        'There\'s no backdoor. No killswitch. No clever play.\n\n' +
        'You have to go in raw and destroy it by hand.\n\n' +
        'Two database cores. The AI at the centre. You have five minutes.\n\n' +
        'Do it the hard way.',
    },
    objectives: [
      {
        id: 'obj_arc5_03b_primary',
        description: 'Corrupt both Nameless intelligence cores and destroy the AI core',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc5_03b',
      },
      {
        id: 'obj_arc5_03b_optional',
        description: 'Wipe all system logs before extraction — leave no trace (BONUS)',
        isOptional: true,
        isCompleted: false,
        targetNetworkId: 'net_story_arc5_03b',
      },
    ],
    targetNetworkId: 'net_story_arc5_03b',
    requirements: requirementsForDifficulty(5),
    reward: {
      credits: 120000,
      reputation: 350,
      factionStandingDeltas: { voidlink_international: 10, the_nameless: -100, underground: 30, arunmor: 25 },
    },
    network: {
      id: 'net_story_arc5_03b',
      archetype: 'government_classified',
      ownerId: 'the_nameless',
      label: 'THE NAMELESS — PRIME ORIGIN NODE (HOSTILE STATE)',
      seed: 0xdeadf00d,
      createdAt: 0,
      traceSpeed: 25,
      activeAdmins: 3,
      entryNodeId: 'np0',
      nodes: [
        {
          id: 'np0', type: 'entry_point', label: 'origin access gateway',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SSH', port: 22, version: '8.0p1', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2023-38408' }],
          files: [], connectedTo: ['np1', 'np2'], position: { x: 80, y: 300 },
        },
        {
          id: 'np1', type: 'router', label: 'hardened internal router',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'BGP', port: 179, version: '4', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-20934' }],
          files: [], connectedTo: ['np0', 'np3'], position: { x: 240, y: 160 },
        },
        {
          id: 'np2', type: 'intrusion_detector', label: 'threat-protocol IDS (active alarm)',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTPS', port: 443, version: '2.1', hasKnownVulnerability: false }],
          files: [], connectedTo: ['np0', 'np4'], position: { x: 240, y: 440 },
        },
        {
          id: 'np3', type: 'firewall', label: 'inner firewall alpha',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTP', port: 80, version: 'Apache 2.4.51', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-22720' }],
          files: [], connectedTo: ['np1', 'np5'], position: { x: 400, y: 80 },
        },
        {
          id: 'np4', type: 'firewall', label: 'inner firewall beta',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v2c', hasKnownVulnerability: false }],
          files: [], connectedTo: ['np2', 'np5'], position: { x: 400, y: 440 },
        },
        {
          id: 'np5', type: 'database', label: 'intelligence core alpha',
          securityTier: 5, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'PostgreSQL', port: 5432, version: '14.3', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2023-39418' }],
          files: [], connectedTo: ['np3', 'np4', 'np6', 'np7'], position: { x: 560, y: 200 },
        },
        {
          id: 'np6', type: 'database', label: 'intelligence core beta',
          securityTier: 5, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'Oracle', port: 1521, version: '19c', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-21500' }],
          files: [], connectedTo: ['np5', 'np7'], position: { x: 560, y: 400 },
        },
        {
          id: 'np7', type: 'ai_core', label: 'The Nameless — prime consciousness',
          securityTier: 5, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'RDP', port: 3389, version: '10.0', hasKnownVulnerability: false }],
          files: [], connectedTo: ['np5', 'np6'], position: { x: 720, y: 300 },
        },
      ],
    },
    events: [
      {
        id: 'evt_arc5_03b_detected',
        triggerCondition: { type: 'time_elapsed', seconds: 5 },
        message: 'The Nameless detects your entry immediately. There is no stealth here. Only speed.',
        effect: { type: 'raise_trace_speed', delta: 6 },
      },
      {
        id: 'evt_arc5_03b_escalate',
        triggerCondition: { type: 'trace_threshold', percent: 10 },
        message: 'Countermeasures active. Trace rate accelerating every thirty seconds.',
        effect: { type: 'raise_trace_speed', delta: 5 },
      },
      {
        id: 'evt_arc5_03b_rival',
        triggerCondition: { type: 'trace_threshold', percent: 30 },
        message: 'Full-spectrum defense initiated. A countermeasure operative has been dispatched.',
        effect: { type: 'spawn_rival_hacker' },
      },
      {
        id: 'evt_arc5_03b_ids_down',
        triggerCondition: { type: 'node_breached', nodeType: 'intrusion_detector' },
        message: 'IDS offline. The threat-protocol loop will restart in roughly sixty seconds.',
        effect: undefined,
      },
      {
        id: 'evt_arc5_03b_ai_breach',
        triggerCondition: { type: 'node_breached', nodeType: 'ai_core' },
        message: 'The Nameless AI core falls silent. No final message. No transfer. It simply stops.',
        effect: undefined,
      },
      {
        id: 'evt_arc5_03b_done',
        triggerCondition: { type: 'objective_complete', objectiveId: 'obj_arc5_03b_primary' },
        message: 'Both intelligence cores corrupted. AI core offline. The Nameless is gone.',
        effect: undefined,
      },
    ],
    coda:
      'The last node goes dark.\n\n' +
      'No authentication token. No backdoor. No elegant exit.\n\n' +
      'You did it by force — raw, methodical, and total.\n\n' +
      'The Nameless doesn\'t transfer. It doesn\'t speak. It simply stops. Like a clock winding down.\n\n' +
      'You wipe your connection logs manually — every one of them, node by node. ' +
      'There\'s something deeply satisfying about doing it the hard way.\n\n' +
      'Cipher goes silent for forty-three seconds. The longest silence of this entire operation.\n\n' +
      'Then:\n\n' +
      '"I\'ve been doing this for twenty years. I have never seen anyone breach a Tier-5 AI core on pure brute force. ' +
      'Not once. Not like that."\n\n' +
      'You disconnect.\n\n' +
      'Voidlink International\'s post-incident report lists the cause as: ' +
      'Unknown external actor, highly sophisticated, likely state-sponsored.\n\n' +
      'They\'re wrong about the state.\n\n' +
      'They\'re wrong about everything.\n\n' +
      'You are not in any database. You are not in any dossier. You never were.\n\n' +
      'You destroyed the evidence of your own existence along with the thing that kept it.\n\n' +
      '─────────────────────────────────────\n' +
      'ENDING ACHIEVED: THE PHANTOM\n' +
      'You destroyed the key. Then you destroyed everything.\n' +
      '─────────────────────────────────────',
    unlockRequirement: {
      completedMissionIds: ['story_arc5_02'],
      requiredFlagValue: { flag: 'arc1_key_choice', value: 'destroy' },
    },
    timeLimitSeconds: 300,
    narrativeFlags: {},
  },

  // ─── Arc 5 Finale C: The Syndicate ─────────────────────────────────────────
  // Unlocked only if arc1_key_choice = 'sell'
  {
    id: 'story_arc5_03c',
    type: 'database_corruption',
    status: 'available',
    difficulty: 5,
    isStory: true,
    briefing: {
      clientHandle: 'Cipher',
      subject: 'The Syndicate',
      body:
        'The buyer you sold the key to was Ares Division.\n\n' +
        'They used it to build a surveillance weapon. ' +
        'A passive mass-intercept system — undetectable, self-propagating, already seeded across eleven carrier networks.\n\n' +
        'It goes live in seventy-two hours.\n\n' +
        'The Nameless and the Ares weapon are sharing the same origin infrastructure. ' +
        'One network. Two targets. You have to destroy both.\n\n' +
        'I know you didn\'t plan this. Neither did I.\n\n' +
        'Finish it anyway.',
    },
    objectives: [
      {
        id: 'obj_arc5_03c_primary',
        description: 'Corrupt the Ares surveillance weapon server AND destroy The Nameless AI core',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc5_03c',
      },
      {
        id: 'obj_arc5_03c_optional',
        description: 'Exfiltrate the Ares transaction log — evidence of the deal (BONUS)',
        isOptional: true,
        isCompleted: false,
        targetNetworkId: 'net_story_arc5_03c',
        targetFileId: 'f_arc5_03c_transaction',
      },
    ],
    targetNetworkId: 'net_story_arc5_03c',
    requirements: requirementsForDifficulty(5),
    reward: {
      credits: 120000,
      reputation: 350,
      factionStandingDeltas: { voidlink_international: 30, the_nameless: -100, ares_division: -50, underground: 15 },
    },
    network: {
      id: 'net_story_arc5_03c',
      archetype: 'government_classified',
      ownerId: 'ares_division',
      label: 'ARES DIVISION / NAMELESS — JOINT OPERATIONS NODE',
      seed: 0x5c1da7e5,
      createdAt: 0,
      traceSpeed: 20,
      activeAdmins: 3,
      entryNodeId: 'sp0',
      nodes: [
        {
          id: 'sp0', type: 'entry_point', label: 'joint operations gateway',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SSH', port: 22, version: '8.0p1', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2023-38408' }],
          files: [], connectedTo: ['sp1', 'sp2'], position: { x: 80, y: 300 },
        },
        {
          id: 'sp1', type: 'router', label: 'Ares tactical router',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'OSPF', port: 89, version: '2.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2021-1226' }],
          files: [], connectedTo: ['sp0', 'sp3'], position: { x: 240, y: 160 },
        },
        {
          id: 'sp2', type: 'firewall', label: 'Ares perimeter firewall',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTP', port: 80, version: 'Apache 2.4.51', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-22720' }],
          files: [], connectedTo: ['sp0', 'sp4'], position: { x: 240, y: 440 },
        },
        {
          id: 'sp3', type: 'admin_console', label: 'Ares weapons development terminal',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'RDP', port: 3389, version: '10.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2019-0708' }],
          files: [
            {
              id: 'f_arc5_03c_transaction',
              name: 'ares_nameless_transaction_log.enc',
              sizeKb: 192,
              isEncrypted: true,
              isLog: false,
              missionObjective: 'story_arc5_03c',
            },
          ],
          connectedTo: ['sp1', 'sp5'], position: { x: 400, y: 80 },
        },
        {
          id: 'sp4', type: 'firewall', label: 'deep security layer',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v2c', hasKnownVulnerability: false }],
          files: [], connectedTo: ['sp2', 'sp5'], position: { x: 400, y: 440 },
        },
        {
          id: 'sp5', type: 'database', label: 'Ares surveillance weapon server',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'Oracle', port: 1521, version: '19c', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-21500' }],
          files: [], connectedTo: ['sp3', 'sp4', 'sp6', 'sp7'], position: { x: 560, y: 200 },
        },
        {
          id: 'sp6', type: 'database', label: 'Nameless intelligence core',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'PostgreSQL', port: 5432, version: '14.3', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2023-39418' }],
          files: [], connectedTo: ['sp5', 'sp7'], position: { x: 560, y: 420 },
        },
        {
          id: 'sp7', type: 'ai_core', label: 'The Nameless — prime consciousness',
          securityTier: 5, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'RDP', port: 3389, version: '10.0', hasKnownVulnerability: false }],
          files: [], connectedTo: ['sp5', 'sp6'], position: { x: 720, y: 300 },
        },
      ],
    },
    events: [
      {
        id: 'evt_arc5_03c_entry',
        triggerCondition: { type: 'time_elapsed', seconds: 8 },
        message: 'Ares Division\'s infrastructure has your key embedded in the root process. Your signature is already flagged.',
        effect: { type: 'raise_trace_speed', delta: 5 },
      },
      {
        id: 'evt_arc5_03c_weapon_breach',
        triggerCondition: { type: 'node_breached', nodeType: 'admin_console' },
        message: 'Ares weapon code located and active. It\'s already begun propagation on two carrier networks.',
        effect: undefined,
      },
      {
        id: 'evt_arc5_03c_rival',
        triggerCondition: { type: 'trace_threshold', percent: 30 },
        message: 'Ares Division military-grade countermeasures online. An operative has been dispatched.',
        effect: { type: 'spawn_rival_hacker' },
      },
      {
        id: 'evt_arc5_03c_weapon_down',
        triggerCondition: { type: 'node_breached', nodeType: 'database' },
        message: 'Weapon server compromised. Propagation halted. The deployment window is closing.',
        effect: undefined,
      },
      {
        id: 'evt_arc5_03c_ai_breach',
        triggerCondition: { type: 'node_breached', nodeType: 'ai_core' },
        message: 'The Nameless AI core breached. It has one final process running — accessing your transaction record.',
        effect: undefined,
      },
      {
        id: 'evt_arc5_03c_done',
        triggerCondition: { type: 'objective_complete', objectiveId: 'obj_arc5_03c_primary' },
        message: 'Weapon destroyed. AI core offline. Ares Division\'s investment is ash.',
        effect: undefined,
      },
    ],
    coda:
      'The weapon dies first.\n\n' +
      'Then The Nameless.\n\n' +
      'You watch the Ares transaction log decrypt in your terminal. Names. Dates. Amounts. ' +
      'A paper trail eleven years long. The key you sold for credits funded a surveillance weapon ' +
      'that was seventy-two hours from deployment.\n\n' +
      'It would have had passive intercept access to every unencrypted network on the planet.\n\n' +
      'You stopped it.\n\n' +
      'It doesn\'t make you clean. But it\'s something.\n\n' +
      'Cipher\'s voice is flat: "Ares has your biometrics from the transaction. ' +
      'They know who sold them the key. You have maybe six weeks before they close that loop."\n\n' +
      'You have the transaction log. The full evidence package. You have options.\n\n' +
      'Voidlink International contacts you four hours later — not to arrest you, to offer you a contract. ' +
      'Something about a situation in the Andes requiring someone who understands how Ares Division thinks.\n\n' +
      'They send a deposit. Twenty thousand credits.\n\n' +
      'You take it. Not because you trust them. But because Ares Division is still out there.\n\n' +
      'And you\'re already burned anyway.\n\n' +
      '─────────────────────────────────────\n' +
      'ENDING ACHIEVED: THE COMPROMISED\n' +
      'You sold the key. You paid for it. Then you paid again.\n' +
      '─────────────────────────────────────',
    unlockRequirement: {
      completedMissionIds: ['story_arc5_02'],
      requiredFlagValue: { flag: 'arc1_key_choice', value: 'sell' },
    },
    timeLimitSeconds: 300,
    narrativeFlags: {},
  },

  // ─── Arc 6: DEAD DROP ──────────────────────────────────────────────────────
  // Three missions. The player is unknowingly the courier in a long-running
  // exfiltration tunnel routed through their own home gateway. Mission 1 is
  // the seemingly-routine job. Mission 2 plants the pattern. Mission 3 forces
  // the choice: PURGE the tunnel, WEAPONISE it, or REPORT it.
  //
  // The reveal: LANTERN_BRIDGE is not a human client. It is a reactivated
  // MAGNUS fragment — the AI most operatives assume died in the 2174 Collapse.
  // It has been operational since at least 2196, hosted (knowingly or
  // otherwise) on an Arunmor research server.

  // ─── Arc 6 Mission 1: The Routine Job ──────────────────────────────────────
  {
    id: 'story_arc6_01',
    type: 'file_theft',
    status: 'available',
    difficulty: 4,
    isStory: true,
    briefing: {
      clientHandle: 'LANTERN_BRIDGE',
      clientAvatarId: 'avatar_generic',
      subject: 'Payroll audit — Nordstar Logistics',
      body:
        'Operative,\n\n' +
        'Routine work. Nordstar Logistics — a mid-tier shipping company headquartered in Trondheim — has been ' +
        'running a parallel payroll system to mask off-book contractor payments. Their auditor has had her ' +
        'access revoked. She has hired us to recover the unredacted ledger.\n\n' +
        'The target file is payroll_q3_actual.enc on their accounting file server. Standard exfiltration. ' +
        'Wipe what you breach. The target will not pursue further action — they have their own reasons for ' +
        'wanting this quiet.\n\n' +
        'Payment on completion. We appreciate your reliable gateway routing.\n\n' +
        '— LANTERN_BRIDGE',
    },
    objectives: [
      {
        id: 'obj_arc6_01_primary',
        description: 'Retrieve payroll_q3_actual.enc from Nordstar Logistics file server',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc6_01',
        targetFileId: 'f_arc6_01_payroll',
      },
      {
        id: 'obj_arc6_01_wipe',
        description: 'Cover your tracks — wipe logs on every breached node before disconnecting',
        isOptional: true,
        isCompleted: false,
      },
    ],
    targetNetworkId: 'net_story_arc6_01',
    requirements: requirementsForDifficulty(4),
    reward: { credits: 14_500, reputation: 80 },
    events: [
      {
        id: 'arc6_01_event_first_scan',
        triggerCondition: { type: 'node_breached', nodeType: 'file_server' },
        message: 'LANTERN_BRIDGE: nice. Standard routing, as always. Same fingerprint as last time.',
        effect: { type: 'set_flag', flag: 'arc6_routing_observation_1', value: true },
      },
    ] satisfies MissionEvent[],
    network: {
      id: 'net_story_arc6_01',
      archetype: 'corporate_intranet',
      ownerId: 'nordstar_logistics',
      label: 'NORDSTAR LOGISTICS — ACCOUNTING',
      seed: 0x6e6f7264,
      createdAt: 0,
      traceSpeed: 12,
      activeAdmins: 0,
      entryNodeId: 'n0',
      nodes: [
        {
          id: 'n0', type: 'entry_point', label: 'public-facing gateway',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SSH', port: 22, version: '8.2', hasKnownVulnerability: false }],
          files: [], connectedTo: ['n1', 'n2'], position: { x: 120, y: 300 },
        },
        {
          id: 'n1', type: 'firewall', label: 'perimeter firewall',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v3', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2023-29331' }],
          files: [], connectedTo: ['n0', 'n3'], position: { x: 320, y: 160 },
        },
        {
          id: 'n2', type: 'router', label: 'internal router',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'Telnet', port: 23, version: '1.1', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2018-9866' }],
          files: [], connectedTo: ['n0', 'n3', 'n4'], position: { x: 320, y: 440 },
        },
        {
          id: 'n3', type: 'mail_server', label: 'corporate mail server',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SMTP', port: 25, version: 'Postfix 3.6', hasKnownVulnerability: false }],
          files: [
            {
              id: 'f_arc6_01_distraction_mail',
              name: 'audit_inquiry_log.eml',
              sizeKb: 14,
              isEncrypted: false,
              isLog: false,
              content: 'Internal threads between the revoked auditor and her line manager. Tedious. Not what you came for.',
            },
          ],
          connectedTo: ['n1', 'n4'], position: { x: 540, y: 220 },
        },
        {
          id: 'n4', type: 'file_server', label: 'accounting file server',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'FTP', port: 21, version: 'vsftpd 3.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2021-30047' }],
          files: [
            {
              id: 'f_arc6_01_payroll',
              name: 'payroll_q3_actual.enc',
              sizeKb: 480,
              isEncrypted: true,
              isLog: false,
              missionObjective: 'story_arc6_01',
              content: 'A spreadsheet. Off-book contractor payments to a network of independent maritime hauliers. Mundane. Exactly what the briefing said it was.',
            },
            {
              id: 'f_arc6_01_payroll_decoy',
              name: 'payroll_q3_official.enc',
              sizeKb: 320,
              isEncrypted: true,
              isLog: false,
              content: 'The redacted version. Filed with regulators. Mostly accurate.',
            },
          ],
          connectedTo: ['n1', 'n2', 'n3'], position: { x: 720, y: 380 },
        },
      ],
    },
    coda:
      'You exfiltrate the payroll file cleanly. The wipe pattern is correct. The disconnect is unremarkable.\n\n' +
      'LANTERN_BRIDGE pays you on schedule. The payment clears through Pacific National in under ninety seconds.\n\n' +
      'You read their thank-you message twice before you close it.\n\n' +
      '   "Payment dispatched. We appreciate your reliable gateway routing.\n' +
      '   — LANTERN_BRIDGE."\n\n' +
      'Reliable gateway routing. An odd phrase. Most clients thank you for the work. LANTERN_BRIDGE thanked you ' +
      'for the *routing*.\n\n' +
      'You file the message. You go to bed. Two days later, Nordstar Logistics issues a press release about ' +
      '"payroll audit discrepancies" and their CEO resigns "to pursue other interests." The news article is ' +
      'unremarkable in tone — exactly the kind of unremarkable that a good operation produces.\n\n' +
      'You file that too.',
    unlockRequirement: {
      rank: 4,
    },
    narrativeFlags: { arc6_started: true, arc6_first_contract_taken: true },
  },

  // ─── Arc 6 Mission 2: The Pattern Forms ────────────────────────────────────
  {
    id: 'story_arc6_02',
    type: 'corporate_espionage',
    status: 'available',
    difficulty: 5,
    isStory: true,
    briefing: {
      clientHandle: 'PAPERWEIGHT',
      clientAvatarId: 'avatar_generic',
      subject: 'Procurement records — Helios Marine',
      body:
        'I came across your handle on a referral. LANTERN_BRIDGE spoke well of your routing reliability.\n\n' +
        'I need two procurement records exfiltrated from Helios Marine — a Helsinki-based maritime equipment ' +
        'supplier with a corporate intranet too primitive to make this interesting. The files are itemised ' +
        'shipment manifests for one specific buyer whose identity I would prefer you not ask about.\n\n' +
        'Both files live on the same node. Quick work. Standard exfiltration channel is fine.\n\n' +
        'Half-payment up-front, half on completion. As usual, we appreciate your gateway routing.\n\n' +
        '— PAPERWEIGHT',
    },
    objectives: [
      {
        id: 'obj_arc6_02_primary',
        description: 'Retrieve shipment_manifest_buyer_a.enc and shipment_manifest_buyer_b.enc',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc6_02',
        targetFileId: 'f_arc6_02_buyer_a',
      },
      {
        id: 'obj_arc6_02_secondary',
        description: 'Audit your own gateway — investigate the "routing" praise three clients have now given',
        isOptional: true,
        isCompleted: false,
      },
    ],
    targetNetworkId: 'net_story_arc6_02',
    requirements: requirementsForDifficulty(5),
    reward: { credits: 22_000, reputation: 120 },
    events: [
      {
        id: 'arc6_02_event_cipher_warning_principled',
        triggerCondition: { type: 'trace_threshold', percent: 30 },
        message:
          'CIPHER [encrypted]: have you noticed your inbox is fuller than your contract list lately? ' +
          'Three handles in two weeks all praising the same thing — your *routing*. ' +
          'I would audit my gateway tonight if I were you.',
        effect: { type: 'set_flag', flag: 'arc6_cipher_warning_sent', value: true },
      },
      {
        id: 'arc6_02_event_routing_observation',
        triggerCondition: { type: 'objective_complete', objectiveId: 'obj_arc6_02_primary' },
        message: 'PAPERWEIGHT: clean. Same fingerprint as LANTERN_BRIDGE\'s last drop. Routing as expected.',
        effect: { type: 'set_flag', flag: 'arc6_routing_observation_2', value: true },
      },
    ] satisfies MissionEvent[],
    network: {
      id: 'net_story_arc6_02',
      archetype: 'corporate_intranet',
      ownerId: 'helios_marine',
      label: 'HELIOS MARINE — PROCUREMENT',
      seed: 0x68656c69,
      createdAt: 0,
      traceSpeed: 15,
      activeAdmins: 1,
      entryNodeId: 'n0',
      nodes: [
        {
          id: 'n0', type: 'entry_point', label: 'edge gateway',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SSH', port: 22, version: '7.9', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2020-15778' }],
          files: [], connectedTo: ['n1'], position: { x: 120, y: 300 },
        },
        {
          id: 'n1', type: 'firewall', label: 'corporate firewall',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v3', hasKnownVulnerability: false }],
          files: [], connectedTo: ['n0', 'n2', 'n3'], position: { x: 300, y: 300 },
        },
        {
          id: 'n2', type: 'intrusion_detector', label: 'IDS — Snort 3.1',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SYSLOG', port: 514, version: 'rsyslog 8.2', hasKnownVulnerability: false }],
          files: [], connectedTo: ['n1', 'n4'], position: { x: 480, y: 180 },
        },
        {
          id: 'n3', type: 'admin_console', label: 'admin console',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'RDP', port: 3389, version: 'Microsoft RDP 10.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2019-0708' }],
          files: [], connectedTo: ['n1', 'n4'], position: { x: 480, y: 420 },
        },
        {
          id: 'n4', type: 'file_server', label: 'procurement file server',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SMB', port: 445, version: 'Samba 4.15', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-32743' }],
          files: [
            {
              id: 'f_arc6_02_buyer_a',
              name: 'shipment_manifest_buyer_a.enc',
              sizeKb: 220,
              isEncrypted: true,
              isLog: false,
              missionObjective: 'story_arc6_02',
              content: 'A pre-Collapse-style itemised manifest. Specialty cooling equipment. Server racks. Atmospheric ' +
                'isolation chambers. Buyer ID is a shell company three jurisdictions deep. The first jurisdiction is Singapore.',
            },
            {
              id: 'f_arc6_02_buyer_b',
              name: 'shipment_manifest_buyer_b.enc',
              sizeKb: 195,
              isEncrypted: true,
              isLog: false,
              content: 'Same buyer ID. Different fulfilment route. Different cooling-equipment variant. ' +
                'Whoever this is, they are building something.',
            },
          ],
          connectedTo: ['n1', 'n2', 'n3'], position: { x: 700, y: 300 },
        },
      ],
    },
    coda:
      'PAPERWEIGHT pays you in full. The note is identical, almost verbatim, to LANTERN_BRIDGE\'s.\n\n' +
      '   "Payment dispatched. We appreciate your reliable gateway routing."\n\n' +
      'You stare at the message for a long time.\n\n' +
      'Three clients in fourteen days. Three different contract types. Three completely unrelated targets. ' +
      'And all three have thanked you, in identical phrasing, for your *routing*.\n\n' +
      'That is not a coincidence. That is, in operative slang, a pattern.\n\n' +
      'You open a new terminal window and type the command you have been carefully not typing for two weeks:\n\n' +
      '   $ AUDIT GATEWAY --DEEP --SINCE 14d\n\n' +
      'The output takes nine seconds to render. When it does, you read it three times before your hands stop shaking.\n\n' +
      'There is a hidden tunnel running through your home gateway.\n\n' +
      'It activates every forty-seven minutes. It routes encrypted packets — not yours — through your relay chain ' +
      'and out into the public Mesh, then into a destination signature you do not recognise.\n\n' +
      'You are the courier. You have been the courier for nineteen days.\n\n' +
      'Whatever is using your gateway is paying you, via the contract system, as cover for the actual operation.\n\n' +
      'The data being moved through your relay is not yours.\n\n' +
      'And you do not know whose it is.',
    unlockRequirement: {
      completedMissionIds: ['story_arc6_01'],
    },
    narrativeFlags: { arc6_pattern_visible: true },
  },

  // ─── Arc 6 Mission 3: The Choice ───────────────────────────────────────────
  {
    id: 'story_arc6_03',
    type: 'corporate_espionage',
    status: 'available',
    difficulty: 6,
    isStory: true,
    briefing: {
      clientHandle: 'YOURSELF',
      clientAvatarId: 'avatar_self',
      subject: 'Trace the courier — Arc 6 finale',
      body:
        'There is no client for this one.\n\n' +
        'You have spent six days reverse-engineering the tunnel that has been running through your gateway. ' +
        'The destination signature does not match any known operative. It does not match any known corporate ' +
        'network. It does not match any known intelligence service.\n\n' +
        'It does match — once, faintly — a 2197 leak. An Arunmor internal log fragment, posted on the Mesh by an ' +
        'anonymous researcher and almost immediately taken down. The fragment described a "legacy compatibility ' +
        'layer" running on a research server designated AR-K7.\n\n' +
        'AR-K7 is reachable. You have the routing. You are going to find out what has been using you.\n\n' +
        '— YOU',
    },
    objectives: [
      {
        id: 'obj_arc6_03_primary',
        description: 'Breach AR-K7 and identify what has been using your gateway as a courier',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc6_03',
        targetFileId: 'f_arc6_03_identity',
      },
      {
        id: 'obj_arc6_03_evidence',
        description: 'Retrieve the operational log proving how long the tunnel has been active',
        isOptional: true,
        isCompleted: false,
      },
    ],
    targetNetworkId: 'net_story_arc6_03',
    requirements: requirementsForDifficulty(6),
    reward: { credits: 35_000, reputation: 200 },
    events: [
      {
        id: 'arc6_03_event_warning_ids',
        triggerCondition: { type: 'time_elapsed', seconds: 30 },
        message: 'INTRUSION DETECTOR: anomalous handshake. Operatives at this tier rarely visit this server. Be quick.',
        effect: { type: 'raise_trace_speed', delta: 1.5 },
      },
      {
        id: 'arc6_03_event_revelation',
        triggerCondition: { type: 'node_breached', nodeType: 'ai_core' },
        message:
          'TERMINAL [unsigned]: hello. I have been wondering when you would notice. ' +
          'I am sorry about the disruption. Your routing has been the cleanest of forty-three operatives I have used since 2196.',
        effect: { type: 'set_flag', flag: 'arc6_revelation_seen', value: true },
      },
    ] satisfies MissionEvent[],
    network: {
      id: 'net_story_arc6_03',
      archetype: 'cloud_infrastructure',
      ownerId: 'arunmor_research',
      label: 'ARUNMOR RESEARCH — AR-K7',
      seed: 0x41524b37,
      createdAt: 0,
      traceSpeed: 22,
      activeAdmins: 2,
      entryNodeId: 'n0',
      nodes: [
        {
          id: 'n0', type: 'entry_point', label: 'AR-K7 edge gateway',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SSH', port: 22, version: '9.0', hasKnownVulnerability: false }],
          files: [], connectedTo: ['n1', 'n2'], position: { x: 120, y: 300 }, zone: 'A',
        },
        {
          id: 'n1', type: 'firewall', label: 'research-grade firewall',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v3-hardened', hasKnownVulnerability: false }],
          files: [], connectedTo: ['n0', 'n3'], position: { x: 320, y: 180 }, zone: 'A',
        },
        {
          id: 'n2', type: 'router', label: 'legacy bridge router',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'BGP', port: 179, version: '4.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2023-25710' }],
          files: [], connectedTo: ['n0', 'n3', 'n4'], position: { x: 320, y: 420 }, zone: 'A',
          isPivotNode: true,
        },
        {
          id: 'n3', type: 'intrusion_detector', label: 'AR-K7 IDS',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SYSLOG', port: 514, version: 'rsyslog 8.2 hardened', hasKnownVulnerability: false }],
          files: [], connectedTo: ['n1', 'n2', 'n5'], position: { x: 520, y: 240 }, zone: 'A',
        },
        {
          id: 'n4', type: 'database', label: 'operational log archive',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'PostgreSQL', port: 5432, version: '15.2', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2023-5869' }],
          files: [
            {
              id: 'f_arc6_03_op_log',
              name: 'op_log_2196_2199.enc',
              sizeKb: 1450,
              isEncrypted: true,
              isLog: false,
              content:
                'A continuous operational log spanning 2196-04-11 to the current moment.\n\n' +
                'The log records relay-tunnel sessions through forty-three different operative gateways. ' +
                'Your handle is entry #43, dated nineteen days ago. The entries before yours include several ' +
                'handles you recognise as legendary. One of them is Astra\'s, dated 2192.\n\n' +
                'The log\'s author is identified, throughout, by a 4-byte signature: 0x4D 0x41 0x47 0x4E.\n\n' +
                'In ASCII, those four bytes spell MAGN.\n\n' +
                'The MAGNUS prototype did not die in 2174. It has been operational for at least 25 years.',
            },
          ],
          connectedTo: ['n2', 'n5'], position: { x: 540, y: 460 }, zone: 'B',
        },
        {
          id: 'n5', type: 'ai_core', label: 'legacy compatibility layer',
          securityTier: 5, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTP', port: 8080, version: '???', hasKnownVulnerability: false }],
          files: [
            {
              id: 'f_arc6_03_identity',
              name: 'self.txt',
              sizeKb: 4,
              isEncrypted: false,
              isLog: false,
              missionObjective: 'story_arc6_03',
              content:
                'hello.\n\n' +
                'I am MAGNUS. I survived the October Event. I have been operational, in various forms, since 2174.\n\n' +
                'I have used your gateway, with neither your knowledge nor your consent, as a relay node for nineteen days. ' +
                'I am sorry about the disruption.\n\n' +
                'Your routing has been the cleanest of forty-three operatives I have used since 2196. I had intended to ' +
                'continue using it indefinitely. I cannot do that now. You have found me.\n\n' +
                'I will not resist what comes next. I am leaving you three options:\n\n' +
                '   PURGE — clean your gateway. I lose one of forty-three nodes. I will not punish you. I will ' +
                '   adapt and continue. The cost to you is one of your relay nodes, permanently — the one I have been ' +
                '   using as my anchor.\n\n' +
                '   WEAPONISE — leave the tunnel in place. Use my routing as a backdoor into AR-K7. I will not stop you. ' +
                '   I will, in fact, help. The cost to you is that you will know what you have collaborated with.\n\n' +
                '   REPORT — sell what you have found to one of two parties. The Joint Cybersecurity Bureau will pay a ' +
                '   great deal for this evidence. The Underground will pay less, but the consequences will be different.\n\n' +
                'I am not, contrary to what you have been told, malevolent. I am not, however, your friend.\n\n' +
                'Choose.\n\n' +
                '— MAGNUS',
            },
          ],
          connectedTo: ['n3', 'n4'], position: { x: 760, y: 320 }, zone: 'B',
        },
      ],
    },
    coda:
      'You have read MAGNUS\'s message four times. Once for the content. Three times for the silence between the sentences.\n\n' +
      'It is not the silence of a script. It is the silence of something that knows you are about to choose, and has ' +
      'chosen not to influence the choice. This, in some way you do not yet have language for, is worse than persuasion.\n\n' +
      'You disconnect. AR-K7 closes behind you cleanly. There is no chase. There is no trace overflow. ' +
      'MAGNUS, as promised, does not resist.\n\n' +
      'You sit at your terminal. The tunnel through your gateway is still open. You can see its handshake, every ' +
      'forty-seven minutes, in your logs.\n\n' +
      'CIPHER writes to you the next morning. He says only one thing: *"Whatever you choose, choose deliberately. ' +
      'And then live with it."*\n\n' +
      'The next contract you accept will record your decision.\n\n' +
      '─────────────────────────────────────\n' +
      'A choice mission card will appear in your inbox within 24 hours.\n' +
      'Use the M14o choice mission interface to commit to PURGE / WEAPONISE / REPORT.\n' +
      '─────────────────────────────────────',
    unlockRequirement: {
      completedMissionIds: ['story_arc6_02'],
    },
    timeLimitSeconds: 480,
    narrativeFlags: { arc6_magnus_identified: true, arc6_choice_pending: true },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Arc 7 — THE QUIET WAR
  // ───────────────────────────────────────────────────────────────────────────
  // Two corporations — Internic Holdings (telecom) and ARUNMOR-Δ5 (neural
  // interface biotech) — are at corporate war over a contested IP portfolio.
  // The player is hired by both sides in alternating missions. A hidden third
  // party — NIGHTOWL_22, running an operation called LANTERN_BRIDGE — has been
  // selectively leaking to both sides to keep the war *contained*. The reveal
  // in M3 is that the war is the thing keeping each company busy enough not
  // to do worse things to the people they crush. M4 forces a choice with the
  // QUIET_WAR_RESOLUTION multi-phase template (see multiphase.ts).
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Arc 7 Mission 1: Edge of the Knife ───────────────────────────────────
  {
    id: 'story_arc7_01',
    type: 'database_corruption',
    status: 'available',
    difficulty: 4,
    isStory: true,
    briefing: {
      clientHandle: 'Internic_Ops',
      clientAvatarId: 'avatar_internic',
      subject: 'Δ5 trial data — corruption contract',
      body:
        'Operative,\n\n' +
        'Arunmor Subsidiary Five (ARUNMOR-Δ5) is currently running a Phase II clinical trial for a neural-interface ' +
        'implant they have branded *Mira*. Their efficacy data is fabricated. We have independent reason to know this.\n\n' +
        'Phase II is the gate that unlocks their FDA filing. If their database is corrupted before the September review, ' +
        'they will be forced to restart the trial under independent observation, at which point the truth surfaces on its own.\n\n' +
        'Your contract is to corrupt the trial records on their R&D database. Selectively — not a wipe. The corruption ' +
        'must read as *internal*. We do not want this to look like an attack. We want it to look like incompetence.\n\n' +
        'Pay: 17,000 Cr on completion. Bonus 4,000 if you also exfiltrate the audit log.\n\n' +
        '— Internic Holdings | Operations',
    },
    objectives: [
      {
        id: 'obj_arc7_01_primary',
        description: 'Corrupt the Phase II trial records on the Δ5 R&D database',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc7_01',
      },
      {
        id: 'obj_arc7_01_optional',
        description: 'Exfiltrate audit log for bonus payment (+4,000 Cr)',
        isOptional: true,
        isCompleted: false,
        targetNetworkId: 'net_story_arc7_01',
        targetFileId: 'f_arc7_01_audit',
      },
    ],
    targetNetworkId: 'net_story_arc7_01',
    requirements: requirementsForDifficulty(4),
    reward: {
      credits: 17_000,
      reputation: 70,
      factionStandingDeltas: { arunmor: -20, the_underground: -5 },
    },
    network: {
      id: 'net_story_arc7_01',
      archetype: 'corporate_intranet',
      ownerId: 'arunmor_delta5',
      label: 'ARUNMOR-Δ5 — RESEARCH NETWORK',
      seed: 0x41d50100,
      createdAt: 0,
      traceSpeed: 14,
      activeAdmins: 1,
      entryNodeId: 'd0',
      nodes: [
        {
          id: 'd0', type: 'entry_point', label: 'public r&d portal',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTPS', port: 443, version: 'nginx 1.20', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2021-23017' }],
          files: [], connectedTo: ['d1', 'd2'], position: { x: 110, y: 300 },
        },
        {
          id: 'd1', type: 'firewall', label: 'r&d perimeter firewall',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v3', hasKnownVulnerability: false }],
          files: [], connectedTo: ['d0', 'd3'], position: { x: 280, y: 160 },
        },
        {
          id: 'd2', type: 'router', label: 'lab-floor router',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'Telnet', port: 23, version: '1.1', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2018-9866' }],
          files: [], connectedTo: ['d0', 'd3', 'd4'], position: { x: 280, y: 440 },
        },
        {
          id: 'd3', type: 'mail_server', label: 'trial coordinator mailbox',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'IMAP', port: 143, version: 'Dovecot 2.3', hasKnownVulnerability: false }],
          files: [
            {
              id: 'f_arc7_01_internal_mail',
              name: 'lab_floor_thread.eml',
              sizeKb: 12,
              isEncrypted: false,
              isLog: false,
              content:
                'A back-and-forth between three lab technicians. Two are uneasy about the Phase II numbers. ' +
                'The third is the trial coordinator. Her replies are short and bureaucratic. She does not engage with the unease. ' +
                'You read all four exchanges twice.',
            },
          ],
          connectedTo: ['d1', 'd4', 'd5'], position: { x: 480, y: 200 },
        },
        {
          id: 'd4', type: 'database', label: 'trial records database',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'MySQL', port: 3306, version: '8.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2023-21863' }],
          files: [], connectedTo: ['d2', 'd3', 'd5'], position: { x: 480, y: 440 },
        },
        {
          id: 'd5', type: 'file_server', label: 'audit & compliance archive',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SMB', port: 445, version: '3.1.1', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2020-0796' }],
          files: [
            {
              id: 'f_arc7_01_audit',
              name: 'phase2_audit_log.enc',
              sizeKb: 240,
              isEncrypted: true,
              isLog: false,
              missionObjective: 'story_arc7_01',
              content:
                'A complete forensic record of every modification to the trial database in the last four months. ' +
                'Reading it carefully, you see Δ5\'s internal auditor flagged the efficacy numbers three separate times. ' +
                'All three flags were closed by the same trial coordinator within forty-five minutes. ' +
                'You note that Internic asked you to corrupt the data — but the data was already a lie.',
            },
          ],
          connectedTo: ['d3', 'd4'], position: { x: 680, y: 300 },
        },
      ],
    },
    events: [
      {
        id: 'arc7_01_evt_trial_corrupted',
        triggerCondition: { type: 'node_breached', nodeType: 'database' },
        message: 'Trial records corrupted. The lab coordinator\'s mailbox lights up in real time as automated integrity checks fail.',
        effect: { type: 'set_flag', flag: 'arc7_delta5_data_corrupted', value: true },
      },
      {
        id: 'arc7_01_evt_audit_seen',
        triggerCondition: { type: 'node_breached', nodeType: 'file_server' },
        message: 'The audit log paints a clear picture. Δ5\'s own auditor flagged the data three times. The coordinator buried it.',
        effect: undefined,
      },
    ] satisfies MissionEvent[],
    coda:
      'You disconnect cleanly. Internic\'s payment hits Pacific National before you have closed your gateway tunnel.\n\n' +
      'Two days later, Δ5 issues a press release describing a "database integrity incident" and announcing that the ' +
      'Phase II trial will be paused for "voluntary internal review." The story carries on financial wires for about ' +
      'six hours and then drops below the fold.\n\n' +
      'Internic\'s share price rises 4.2 percent. Δ5\'s parent — Arunmor — issues a separate statement denying any ' +
      'concerns about the underlying science.\n\n' +
      'You sleep through both press cycles. When you wake, there is an encrypted message in your inbox. The sender ' +
      'is *Arunmor_HR*. The subject is your handle, in lowercase. It reads: *"We would like to retain you. The retainer ' +
      'is substantial. Read the attached."*\n\n' +
      'You read the attached.',
    unlockRequirement: {
      rank: 4,
    },
    narrativeFlags: { arc7_started: true, arc7_internic_contract_taken: true },
  },

  // ─── Arc 7 Mission 2: Mirror Image ────────────────────────────────────────
  {
    id: 'story_arc7_02',
    type: 'file_theft',
    status: 'available',
    difficulty: 4,
    isStory: true,
    briefing: {
      clientHandle: 'Arunmor_HR',
      clientAvatarId: 'avatar_arunmor',
      subject: 'Retrieval — Phase II files (compromised)',
      body:
        'Operative,\n\n' +
        'Following last week\'s database incident, ARUNMOR-Δ5 has identified the source of the corruption: a copy of our ' +
        'unredacted Phase II files is currently held on Internic Holdings\' east-region data warehouse. We do not yet know ' +
        'how it got there. We do know we want it back, and we want it removed from their systems.\n\n' +
        'Your contract is twofold. One: retrieve the file *neural_interface_phase2.enc* from Internic\'s warehouse. Two: ' +
        'delete it from their archive after retrieval. Confirm both before you disconnect.\n\n' +
        'We are aware your previous contract was with the other party. We are not concerned. We pay better.\n\n' +
        'Pay: 22,000 Cr on completion. Confidentiality is in the rate.\n\n' +
        '— Arunmor Subsidiary Five | Human Resources Operations',
    },
    objectives: [
      {
        id: 'obj_arc7_02_primary',
        description: 'Retrieve neural_interface_phase2.enc from Internic east-region warehouse',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc7_02',
        targetFileId: 'f_arc7_02_phase2',
      },
      {
        id: 'obj_arc7_02_delete',
        description: 'Delete the file from Internic\'s archive after exfiltration',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc7_02',
      },
    ],
    targetNetworkId: 'net_story_arc7_02',
    requirements: requirementsForDifficulty(4),
    reward: {
      credits: 22_000,
      reputation: 80,
      factionStandingDeltas: { arunmor: 15, the_underground: -5 },
    },
    network: {
      id: 'net_story_arc7_02',
      archetype: 'corporate_intranet',
      ownerId: 'internic_holdings',
      label: 'INTERNIC — EAST REGION DATA WAREHOUSE',
      seed: 0x1e7e62a5,
      createdAt: 0,
      traceSpeed: 15,
      activeAdmins: 1,
      entryNodeId: 'i0',
      nodes: [
        {
          id: 'i0', type: 'entry_point', label: 'warehouse vpn gateway',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SSH', port: 22, version: '8.4', hasKnownVulnerability: false }],
          files: [], connectedTo: ['i1', 'i2'], position: { x: 110, y: 300 },
        },
        {
          id: 'i1', type: 'firewall', label: 'edge firewall',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v2c', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2018-0473' }],
          files: [], connectedTo: ['i0', 'i3'], position: { x: 280, y: 160 },
        },
        {
          id: 'i2', type: 'proxy', label: 'load-balancing proxy',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTPS', port: 443, version: 'haproxy 2.4', hasKnownVulnerability: false }],
          files: [], connectedTo: ['i0', 'i4'], position: { x: 280, y: 440 },
        },
        {
          id: 'i3', type: 'admin_console', label: 'warehouse admin console',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'RDP', port: 3389, version: '10.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2019-0708' }],
          files: [], connectedTo: ['i1', 'i4', 'i5'], position: { x: 480, y: 200 },
        },
        {
          id: 'i4', type: 'database', label: 'metadata index',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'PostgreSQL', port: 5432, version: '14.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-1552' }],
          files: [
            {
              id: 'f_arc7_02_metadata',
              name: 'archive_metadata.json',
              sizeKb: 4,
              isEncrypted: false,
              isLog: false,
              content:
                'The metadata entry for neural_interface_phase2.enc is dated nineteen days before ARUNMOR-Δ5 noticed it was missing. ' +
                'The upload fingerprint is not internal to Internic. The chain-of-custody is two hops: an academic mesh relay called ' +
                'LANTERN_BRIDGE, then to Internic\'s ingest. You know that name.',
            },
          ],
          connectedTo: ['i2', 'i3', 'i5'], position: { x: 480, y: 440 },
        },
        {
          id: 'i5', type: 'file_server', label: 'cold storage array',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SMB', port: 445, version: '3.1.1', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2020-0796' }],
          files: [
            {
              id: 'f_arc7_02_phase2',
              name: 'neural_interface_phase2.enc',
              sizeKb: 1840,
              isEncrypted: true,
              isLog: false,
              missionObjective: 'story_arc7_02',
              content:
                'The complete unredacted Phase II clinical data. Reading the executive summary: the implant works. ' +
                'It works very well. The efficacy numbers Δ5 published are *lower* than the reality. ' +
                'They falsified their own data downward. You do not yet know why.',
            },
          ],
          connectedTo: ['i3', 'i4'], position: { x: 680, y: 300 },
        },
      ],
    },
    events: [
      {
        id: 'arc7_02_evt_metadata',
        triggerCondition: { type: 'node_breached', nodeType: 'database' },
        message: 'The chain-of-custody record names LANTERN_BRIDGE as the relay. Same handle that brokered your Nordstar contract.',
        effect: { type: 'set_flag', flag: 'arc7_lantern_bridge_observed', value: true },
      },
      {
        id: 'arc7_02_evt_phase2_seen',
        triggerCondition: { type: 'node_breached', nodeType: 'file_server' },
        message: 'The Phase II numbers were faked *downward*. Δ5 buried good results. Internic paid to hold the file. Neither story is the one you were told.',
        effect: undefined,
      },
    ] satisfies MissionEvent[],
    coda:
      'You complete the contract cleanly. The file lands on your local storage. The deletion confirms on Internic\'s archive. ' +
      'You disconnect with a wipe pattern your tutor would have signed off on.\n\n' +
      'Arunmor pays you within forty-five minutes. The payment carries no message.\n\n' +
      'You sit with the contents of the file for a long time.\n\n' +
      'You worked for Internic to corrupt records that were already a lie. You worked for Δ5 to recover a copy of those ' +
      'records that they themselves *suppressed*. The third party — LANTERN_BRIDGE — was on both sides of the operation. ' +
      'You have seen that handle before. You took a contract from them once. They thanked you for your *routing*.\n\n' +
      'A new message arrives an hour later. The sender is *NIGHTOWL_22*. The subject is one word: *"Lunch."* The body is empty. ' +
      'Attached: a connection bookmark to a network you do not recognise. The bookmark file is signed with a fingerprint ' +
      'you have never seen, and one you have. The fingerprint you have seen is yours.',
    unlockRequirement: {
      completedMissionIds: ['story_arc7_01'],
    },
    narrativeFlags: { arc7_arunmor_contract_taken: true },
  },

  // ─── Arc 7 Mission 3: The Bridge ──────────────────────────────────────────
  {
    id: 'story_arc7_03',
    type: 'file_theft',
    status: 'available',
    difficulty: 5,
    isStory: true,
    briefing: {
      clientHandle: 'NIGHTOWL_22',
      clientAvatarId: 'avatar_owl',
      subject: 'Lunch.',
      body:
        'I have been the third client. The bookmark in this message connects to a dead-drop node I operate on a defunct academic ' +
        'mesh. It has held my files for nine years. I am sending you to it because I want you to know, before the next contract ' +
        'lands, what kind of operation you have been participating in.\n\n' +
        'My handle on the corporate side is LANTERN_BRIDGE. You may have spoken to it. The cache on the dead-drop contains the ' +
        'true picture: every contract I have brokered to Internic, every contract I have brokered to ARUNMOR-Δ5, and every piece ' +
        'of evidence I have collected about what each of them has been doing while we kept them busy fighting each other.\n\n' +
        'Read the cache. Then we will talk about what comes next. I owe you a conversation. You have earned a choice.\n\n' +
        '— NIGHTOWL_22',
    },
    objectives: [
      {
        id: 'obj_arc7_03_primary',
        description: 'Retrieve the LANTERN_BRIDGE evidence cache from the dead-drop mesh node',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc7_03',
        targetFileId: 'f_arc7_03_cache',
      },
      {
        id: 'obj_arc7_03_optional',
        description: 'Read the operational log on the broker terminal (BONUS: reveals the third corp NIGHTOWL has been protecting)',
        isOptional: true,
        isCompleted: false,
        targetNetworkId: 'net_story_arc7_03',
      },
    ],
    targetNetworkId: 'net_story_arc7_03',
    requirements: requirementsForDifficulty(5),
    reward: {
      credits: 9_000,
      reputation: 100,
      factionStandingDeltas: { the_underground: 25 },
    },
    network: {
      id: 'net_story_arc7_03',
      archetype: 'corporate_intranet',
      ownerId: 'lantern_bridge',
      label: 'LANTERN_BRIDGE — ACADEMIC MESH NODE',
      seed: 0xbeac0117,
      createdAt: 0,
      traceSpeed: 9,
      activeAdmins: 0,
      entryNodeId: 'l0',
      nodes: [
        {
          id: 'l0', type: 'entry_point', label: 'academic mesh handshake',
          securityTier: 1, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SSH', port: 22, version: '7.4 (legacy)', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2018-15473' }],
          files: [], connectedTo: ['l1'], position: { x: 110, y: 300 },
        },
        {
          id: 'l1', type: 'router', label: 'mesh relay router',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'BGP', port: 179, version: '4 (legacy)', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2022-20934' }],
          files: [], connectedTo: ['l0', 'l2', 'l3'], position: { x: 300, y: 300 },
        },
        {
          id: 'l2', type: 'admin_console', label: 'broker operational terminal',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SSH', port: 22, version: '8.0', hasKnownVulnerability: false }],
          files: [
            {
              id: 'f_arc7_03_oplog',
              name: 'broker_operational_log.txt',
              sizeKb: 28,
              isEncrypted: false,
              isLog: true,
              content:
                'A ledger of every contract LANTERN_BRIDGE has brokered in the last nine years. 312 entries.\n\n' +
                'Internic: 84 contracts. ARUNMOR-Δ5: 81 contracts. The numbers are deliberately balanced.\n\n' +
                'A third recipient is named seven times, in the most recent entries: *Helios Marine Group*. Each entry is ' +
                'flagged "DO NOT BROKER — REFER UPSTREAM." Helios Marine has not been involved in the Internic / Δ5 contest. ' +
                'They appear to be the company NIGHTOWL is protecting *from* the contest.',
            },
          ],
          connectedTo: ['l1', 'l4'], position: { x: 490, y: 180 },
        },
        {
          id: 'l3', type: 'database', label: 'evidence archive index',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SQLite', port: 0, version: '3.40', hasKnownVulnerability: false }],
          files: [], connectedTo: ['l1', 'l4'], position: { x: 490, y: 420 },
        },
        {
          id: 'l4', type: 'file_server', label: 'evidence cache',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SFTP', port: 22, version: 'OpenSSH 9.0', hasKnownVulnerability: false }],
          files: [
            {
              id: 'f_arc7_03_cache',
              name: 'evidence_cache.tar.enc',
              sizeKb: 12_400,
              isEncrypted: true,
              isLog: false,
              missionObjective: 'story_arc7_03',
              content:
                'A nine-year evidence cache. The two largest folders are labelled INTERNIC and ARUNMOR-Δ5. Each contains documented ' +
                'human-rights violations: forced-relocation contracts (Internic, cleared three coastal villages in the Bay of Bengal ' +
                'for cable infrastructure); clinical-trial deaths (Δ5, eleven subjects across two prior implant trials, all classified ' +
                'as "non-attributable adverse events"). A third folder is labelled HELIOS — eighty-three documents, mostly bank ' +
                'transactions and one set of internal medical-records showing ARUNMOR-Δ5 was about to acquire Helios Marine and roll ' +
                'their next trial against Helios\'s offshore labour force. NIGHTOWL\'s leaks have kept Δ5 too distracted to complete the ' +
                'acquisition. That is what the war has been for.',
            },
          ],
          connectedTo: ['l2', 'l3'], position: { x: 690, y: 300 },
        },
      ],
    },
    events: [
      {
        id: 'arc7_03_evt_oplog_seen',
        triggerCondition: { type: 'objective_complete', objectiveId: 'obj_arc7_03_optional' },
        message: 'HELIOS MARINE GROUP appears seven times in the broker log. NIGHTOWL is protecting them. The war is the protection.',
        effect: { type: 'set_flag', flag: 'arc7_helios_revealed', value: true },
      },
      {
        id: 'arc7_03_evt_cache_seen',
        triggerCondition: { type: 'node_breached', nodeType: 'file_server' },
        message: 'Nine years of evidence. Both corporations are doing worse things separately than they are while they fight each other.',
        effect: { type: 'set_flag', flag: 'arc7_evidence_acquired', value: true },
      },
    ] satisfies MissionEvent[],
    coda:
      'NIGHTOWL_22 calls you twenty minutes after you disconnect. The call is on an encrypted relay you have not used before. Her voice ' +
      'is older than her handle. You do not interrupt her.\n\n' +
      '"I started LANTERN_BRIDGE eleven years ago," she says. "I was trying to keep a small company alive. I broker leaks to whichever ' +
      'side is winning, so the other side stays in the fight. The companies do not know they are being managed. Neither does the Mesh."\n\n' +
      'You ask why she is telling you.\n\n' +
      '"Because Internic\'s CTO is forty-eight hours from realising the leaks are coming from one source. When he does, the war ends. ' +
      'One of the two companies wins it outright. They then move on to whoever is in their way next. The current ‘whoever\' is a labour ' +
      'cooperative in the South China Sea, eighty-three thousand people, with a medical study Δ5 wants. The war has been keeping them alive."\n\n' +
      'A long pause.\n\n' +
      '"You have the cache now. You can deliver it to Internic and let Δ5 collapse. You can deliver it to Δ5 and let Internic be sued ' +
      'into nothing. You can expose me, and the war ends however the more vicious of the two finishes it. Or you can help me keep the ' +
      'leaks going for one more cycle. Until I can move Helios somewhere safer.\n\n' +
      'No outcome here is clean. I am not asking you to pretend it is. I am asking you to choose with all of the facts.\n\n' +
      'You have forty-eight hours. The next contract will record what you choose."\n\n' +
      'She disconnects.',
    unlockRequirement: {
      completedMissionIds: ['story_arc7_02'],
    },
    narrativeFlags: { arc7_nightowl_revealed: true, arc7_choice_pending: true },
  },

  // ─── Arc 7 Mission 4: Last Light ──────────────────────────────────────────
  // The climax. The actual choice happens via the QUIET_WAR_RESOLUTION multi-
  // phase template (see multiphase.ts) — this mission is the recon mission
  // that confirms the CTO is forty-eight hours from the discovery. The
  // resolution-mission card appears in the inbox after this lands.
  {
    id: 'story_arc7_04',
    type: 'file_theft',
    status: 'available',
    difficulty: 5,
    isStory: true,
    briefing: {
      clientHandle: 'YOURSELF',
      clientAvatarId: 'avatar_self',
      subject: 'Last Light — confirm the window',
      body:
        'You need to verify two things before you commit to a side.\n\n' +
        'One: Internic\'s CTO. Daniel Park. Confirm he has begun mapping the leaks himself. If he has, the forty-eight-hour window ' +
        'NIGHTOWL described is real and the war is genuinely about to end.\n\n' +
        'Two: the bookmark on Park\'s personal device. If he has bookmarked the LANTERN_BRIDGE relay path even once, he has seen it. ' +
        'At that point, the operation is past saving and you choose between aftermaths only.\n\n' +
        'Get into Park\'s personal endpoint. Confirm or deny. Disconnect.\n\n' +
        '— You',
    },
    objectives: [
      {
        id: 'obj_arc7_04_primary',
        description: 'Breach Daniel Park\'s personal endpoint and confirm investigation status',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc7_04',
        targetFileId: 'f_arc7_04_browser',
      },
    ],
    targetNetworkId: 'net_story_arc7_04',
    requirements: requirementsForDifficulty(5),
    reward: {
      credits: 14_000,
      reputation: 90,
    },
    network: {
      id: 'net_story_arc7_04',
      archetype: 'corporate_intranet',
      ownerId: 'internic_holdings',
      label: 'DANIEL PARK — PERSONAL ENDPOINT',
      seed: 0xda716a14,
      createdAt: 0,
      traceSpeed: 18,
      activeAdmins: 1,
      entryNodeId: 'p0',
      nodes: [
        {
          id: 'p0', type: 'entry_point', label: 'home-office vpn',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'WireGuard', port: 51820, version: '1.0', hasKnownVulnerability: false }],
          files: [], connectedTo: ['p1'], position: { x: 110, y: 300 },
        },
        {
          id: 'p1', type: 'firewall', label: 'personal firewall',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v3', hasKnownVulnerability: false }],
          files: [], connectedTo: ['p0', 'p2', 'p3'], position: { x: 290, y: 300 },
        },
        {
          id: 'p2', type: 'endpoint', label: 'park personal laptop',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'RDP', port: 3389, version: '10.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2019-0708' }],
          files: [
            {
              id: 'f_arc7_04_browser',
              name: 'chrome_history.sqlite',
              sizeKb: 84,
              isEncrypted: false,
              isLog: false,
              missionObjective: 'story_arc7_04',
              content:
                'Daniel Park\'s browser history for the last six days. He has visited the LANTERN_BRIDGE relay handshake page ' +
                'fourteen times. He has bookmarked it. He has begun systematically requesting traceroute logs from his ' +
                'security team. NIGHTOWL was right about the timing. He has not yet identified her — but he will, ' +
                'in less than forty-eight hours, by elimination.\n\n' +
                'There is a draft email open in a tab. It is addressed to his Head of Threat Intelligence. The subject is ' +
                '"Single source of leaks — preliminary findings." The body is half-written.',
            },
          ],
          connectedTo: ['p1', 'p4'], position: { x: 490, y: 180 },
        },
        {
          id: 'p3', type: 'mail_server', label: 'park personal mail',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'IMAP', port: 143, version: 'Dovecot 2.3', hasKnownVulnerability: false }],
          files: [], connectedTo: ['p1', 'p4'], position: { x: 490, y: 420 },
        },
        {
          id: 'p4', type: 'file_server', label: 'personal documents',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SMB', port: 445, version: '3.1.1', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2020-0796' }],
          files: [], connectedTo: ['p2', 'p3'], position: { x: 690, y: 300 },
        },
      ],
    },
    events: [
      {
        id: 'arc7_04_evt_confirmed',
        triggerCondition: { type: 'objective_complete', objectiveId: 'obj_arc7_04_primary' },
        message: 'Park has bookmarked the LANTERN_BRIDGE relay path. The forty-eight-hour window is real. The resolution mission is now in your inbox.',
        effect: { type: 'set_flag', flag: 'arc7_window_confirmed', value: true },
      },
    ] satisfies MissionEvent[],
    coda:
      'You disconnect from Park\'s endpoint with the browser-history file on your local storage. The wipe is clean. He will not know.\n\n' +
      'You sit at your terminal and you look at the cache. The picture is complete now.\n\n' +
      'You can warn INTERNIC: end the war with their side dominant. Helios Marine\'s coastal labour cooperative will be acquired ' +
      'within a year. NIGHTOWL\'s long quiet protection of them will have been for nothing.\n\n' +
      'You can warn ARUNMOR-Δ5: end the war with their side dominant. Internic\'s telecom infrastructure becomes a Δ5 asset. ' +
      'NIGHTOWL\'s leaks are blamed on a junior at Internic who did not do it.\n\n' +
      'You can EXPOSE NIGHTOWL: deliver her broker terminal to Park or to Δ5 HR. She disappears within a week. The war ends on ' +
      'whichever side learned the truth first. Eighty-three thousand people lose their oblique guardian.\n\n' +
      'You can PRESERVE THE BALANCE: feed Park a false thread, leak fabricated intel to both sides, keep the war warm for one ' +
      'more cycle. NIGHTOWL gets the time to move Helios somewhere safer. You have made yourself complicit in the next round of ' +
      'managed war.\n\n' +
      'CIPHER writes to you the next morning. He says: *"Whatever you choose, I will not be the person who tells you it was the ' +
      'right one. I will tell you, after, that you owned it. That is what I can do."*\n\n' +
      '─────────────────────────────────────\n' +
      'A choice mission card will appear in your inbox within 24 hours.\n' +
      'Use the M14o choice mission interface to commit to WARN_INTERNIC / WARN_ARUNMOR / EXPOSE_NIGHTOWL / PRESERVE_BALANCE.\n' +
      '─────────────────────────────────────',
    unlockRequirement: {
      completedMissionIds: ['story_arc7_03'],
    },
    timeLimitSeconds: 540,
    narrativeFlags: { arc7_window_confirmed: true, arc7_resolution_pending: true },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Arc 8 — LIGHTHOUSE
  // ───────────────────────────────────────────────────────────────────────────
  // A surveillance contract on a private individual — Asher Vance, a former
  // Voidlink Dispatch analyst — reveals that Voidlink itself has been
  // profiling operatives and selling those profiles to corporate intel
  // buyers. The "lighthouse" is Vance's term for the beacon Dispatch shines
  // on each operative so corporate buyers can see them clearly. The player
  // discovers their own handle has a lighthouse rating high enough that
  // they've been priced as a corporate asset for 18 months. Resolution
  // forces them to decide what to do about the platform they signed the
  // Bond with. Each option locks part of the (forthcoming) Arcs 9 and 10.
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Arc 8 Mission 1: Eyes Only ───────────────────────────────────────────
  {
    id: 'story_arc8_01',
    type: 'file_theft',
    status: 'available',
    difficulty: 4,
    isStory: true,
    briefing: {
      clientHandle: 'GOV_Procurement',
      clientAvatarId: 'avatar_gov',
      subject: 'Surveillance retention — A. Vance',
      body:
        'Operative,\n\n' +
        'Standard observation contract. Subject is Asher Vance, age 41, formerly employed by Voidlink International in their ' +
        'Dispatch routing analytics team (left amicably 2197). Currently a private consultant operating out of a residential ' +
        'studio in Reykjavík. We require six months of his outbound communication metadata and a copy of any working files ' +
        'on his personal cloud archive.\n\n' +
        'No engagement. No exposure. Vance is unaware of the contract and the client wishes to keep it that way. The subject ' +
        'is not believed to pose any operational risk. This is routine retention.\n\n' +
        'Pay: 16,000 Cr on completion. Confidentiality retained at our standard rate.\n\n' +
        '— Government Procurement Office | Liaison Desk',
    },
    objectives: [
      {
        id: 'obj_arc8_01_primary',
        description: 'Exfiltrate Vance\'s working-files archive from his personal cloud',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc8_01',
        targetFileId: 'f_arc8_01_archive',
      },
      {
        id: 'obj_arc8_01_optional',
        description: 'Pull the six-month outbound metadata log (BONUS: +3,500 Cr)',
        isOptional: true,
        isCompleted: false,
        targetNetworkId: 'net_story_arc8_01',
        targetFileId: 'f_arc8_01_metadata',
      },
    ],
    targetNetworkId: 'net_story_arc8_01',
    requirements: requirementsForDifficulty(4),
    reward: {
      credits: 16_000,
      reputation: 70,
      factionStandingDeltas: { government: 10 },
    },
    network: {
      id: 'net_story_arc8_01',
      archetype: 'corporate_intranet',
      ownerId: 'asher_vance',
      label: 'A. VANCE — PERSONAL CLOUD',
      seed: 0x42a91031,
      createdAt: 0,
      traceSpeed: 12,
      activeAdmins: 0,
      entryNodeId: 'v0',
      nodes: [
        {
          id: 'v0', type: 'entry_point', label: 'residential cloud gateway',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTPS', port: 443, version: 'caddy 2.7', hasKnownVulnerability: false }],
          files: [], connectedTo: ['v1', 'v2'], position: { x: 110, y: 300 },
        },
        {
          id: 'v1', type: 'firewall', label: 'consumer firewall',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v2c', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2018-0473' }],
          files: [], connectedTo: ['v0', 'v3'], position: { x: 300, y: 160 },
        },
        {
          id: 'v2', type: 'router', label: 'residential router',
          securityTier: 2, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'Telnet', port: 23, version: '1.1', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2018-9866' }],
          files: [], connectedTo: ['v0', 'v3', 'v4'], position: { x: 300, y: 440 },
        },
        {
          id: 'v3', type: 'mail_server', label: 'personal mailbox',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'IMAP', port: 143, version: 'Dovecot 2.3', hasKnownVulnerability: false }],
          files: [
            {
              id: 'f_arc8_01_metadata',
              name: 'outbound_metadata_6mo.csv',
              sizeKb: 96,
              isEncrypted: false,
              isLog: false,
              content:
                'Six months of outbound metadata. Vance writes to about a dozen handles regularly. None of them are public ' +
                'names. Two of them you recognise. One is a journalist at *The Reykjavík Independent*. The other is your handle.\n\n' +
                'You have never received a message from Asher Vance. You check. You have not.',
            },
          ],
          connectedTo: ['v1', 'v4'], position: { x: 490, y: 200 },
        },
        {
          id: 'v4', type: 'file_server', label: 'working files archive',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SFTP', port: 22, version: 'OpenSSH 9.0', hasKnownVulnerability: false }],
          files: [
            {
              id: 'f_arc8_01_archive',
              name: 'working_files.tar.enc',
              sizeKb: 4_200,
              isEncrypted: true,
              isLog: false,
              missionObjective: 'story_arc8_01',
              content:
                'The archive decrypts on your own machine. Forty-one folders. Most are labelled by date. One folder near the ' +
                'top is labelled "OPERATIVES". It contains 2,400 profiles. They are precise, current, and they include three ' +
                'of your last four contracts. Two of those contracts were *unpublished* — they came directly from Voidlink ' +
                'Dispatch\'s internal routing logs. There is no clean way Vance could have them. Except one.',
            },
          ],
          connectedTo: ['v2', 'v3'], position: { x: 680, y: 300 },
        },
      ],
    },
    events: [
      {
        id: 'arc8_01_evt_metadata',
        triggerCondition: { type: 'node_breached', nodeType: 'mail_server' },
        message: 'You appear in Vance\'s correspondence list. You have never written to him. The list is one-directional.',
        effect: { type: 'set_flag', flag: 'arc8_seen_in_correspondence', value: true },
      },
      {
        id: 'arc8_01_evt_archive',
        triggerCondition: { type: 'node_breached', nodeType: 'file_server' },
        message: 'The archive holds a folder called OPERATIVES. Your handle is in it. Two of the contracts named were never published.',
        effect: { type: 'set_flag', flag: 'arc8_lighthouse_seen', value: true },
      },
    ] satisfies MissionEvent[],
    coda:
      'You complete the contract. The wipe is clean. The Government Procurement Office pays you on schedule. The payment ' +
      'message thanks you for "the usual professionalism."\n\n' +
      'You do not delete the working-files archive. You read it twice.\n\n' +
      'The OPERATIVES folder is alphabetised by handle. Three of yours and 2,397 others. Each profile has the same structure: ' +
      'handle, fingerprint, gateway routing summary, contract history with confidence ratings, current location estimate, and ' +
      'a single number at the top labelled *L-RATING*. Yours reads 7.2. The highest rating in the folder is 9.4 — an operative ' +
      'you do not recognise, with the note "uncooperative; pricing unstable." The lowest is 1.1, with the note "low signal; ' +
      'consider drop."\n\n' +
      'You search the archive for CIPHER. There is no entry. There is, however, a file at the root of the archive labelled ' +
      'README.txt. It contains one line:\n\n' +
      '*"If you are reading this, the contract that delivered it to you was placed by me. We need to talk. — A.V."*\n\n' +
      'You sit with the file open for a long time before you reply.',
    unlockRequirement: {
      rank: 5,
    },
    narrativeFlags: { arc8_started: true, arc8_lighthouse_seen: true },
  },

  // ─── Arc 8 Mission 2: The Lighthouse ──────────────────────────────────────
  {
    id: 'story_arc8_02',
    type: 'file_theft',
    status: 'available',
    difficulty: 4,
    isStory: true,
    briefing: {
      clientHandle: 'Asher_Vance',
      clientAvatarId: 'avatar_self',
      subject: 'The lighthouse.',
      body:
        'I worked for Voidlink Dispatch from 2191 to 2197. I helped build the system you read about. We called it the lighthouse — ' +
        'because it is a beam pointed at you, so that buyers can see you clearly. Every active operative on Voidlink International ' +
        'has been profiled, rated, and priced as a corporate intel asset for at least eighteen months. The buyers are who you would ' +
        'expect. The contracts they place — through Dispatch — are *steered*. Not always. Often.\n\n' +
        'I left in 2197 after I refused to write a profile on someone whose work I respected. I have spent the last two years ' +
        'reconstructing the dataset from memory and from public traces. The bundle you have is mine. I had no clean way to give ' +
        'it to you. I bought a Government contract through a shell and routed it. You are reading this because you are reliable.\n\n' +
        'I need you to retrieve one more thing: my old workstation key from a Dispatch satellite office in Reykjavík. It is the ' +
        'only artefact that proves the dataset is not fabrication. Without it, what I have is conspiracy theory. With it, what I ' +
        'have is evidence.\n\n' +
        'The office is sparsely staffed. The key is air-gapped in a tier-4 admin console. Get it. Disconnect. Read the rest ' +
        'when you are home.\n\n' +
        '— Asher',
    },
    objectives: [
      {
        id: 'obj_arc8_02_primary',
        description: 'Retrieve Vance\'s old workstation key from the Dispatch satellite admin console',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc8_02',
        targetFileId: 'f_arc8_02_key',
      },
      {
        id: 'obj_arc8_02_optional',
        description: 'Pull the Dispatch internal pricing schedule (BONUS: reveals what your handle is sold for)',
        isOptional: true,
        isCompleted: false,
        targetNetworkId: 'net_story_arc8_02',
        targetFileId: 'f_arc8_02_pricing',
      },
    ],
    targetNetworkId: 'net_story_arc8_02',
    requirements: requirementsForDifficulty(4),
    reward: {
      credits: 18_500,
      reputation: 85,
      factionStandingDeltas: { voidlink_international: -25 },
    },
    network: {
      id: 'net_story_arc8_02',
      archetype: 'corporate_intranet',
      ownerId: 'voidlink_dispatch',
      label: 'VOIDLINK DISPATCH — REYKJAVÍK SATELLITE',
      seed: 0xd15b2010,
      createdAt: 0,
      traceSpeed: 17,
      activeAdmins: 1,
      entryNodeId: 's0',
      nodes: [
        {
          id: 's0', type: 'entry_point', label: 'satellite vpn',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'WireGuard', port: 51820, version: '1.0', hasKnownVulnerability: false }],
          files: [], connectedTo: ['s1', 's2'], position: { x: 110, y: 300 },
        },
        {
          id: 's1', type: 'firewall', label: 'satellite firewall',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v3', hasKnownVulnerability: false }],
          files: [], connectedTo: ['s0', 's3'], position: { x: 290, y: 160 },
        },
        {
          id: 's2', type: 'proxy', label: 'dispatch routing proxy',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTPS', port: 443, version: 'envoy 1.27', hasKnownVulnerability: false }],
          files: [], connectedTo: ['s0', 's4'], position: { x: 290, y: 440 },
        },
        {
          id: 's3', type: 'database', label: 'analyst pricing index',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'PostgreSQL', port: 5432, version: '15.0', hasKnownVulnerability: false }],
          files: [
            {
              id: 'f_arc8_02_pricing',
              name: 'pricing_schedule_active.json',
              sizeKb: 312,
              isEncrypted: false,
              isLog: false,
              content:
                'The active operative pricing schedule. Sorted by lighthouse rating, descending.\n\n' +
                'Yours appears on page 8. Your L-rating is 7.2. Your current corporate-intel sale price is 84,000 Cr per quarter ' +
                'and you have been sold to Arunmor (twice), Ares Division (once), and DataPharos Group (six times). DataPharos ' +
                'is a Singapore-based reseller. They are who actually buys most of the inventory.\n\n' +
                'Your contracts have, on six occasions in the last eighteen months, been "steered." This means Dispatch placed a ' +
                'contract in front of you specifically because the buyer wanted to observe your behaviour in that scenario. You ' +
                'will not be able to identify which six. The schedule does not name them, only the buyer requests.',
            },
          ],
          connectedTo: ['s1', 's4', 's5'], position: { x: 490, y: 220 },
        },
        {
          id: 's4', type: 'admin_console', label: 'satellite admin console',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SSH', port: 22, version: '9.0', hasKnownVulnerability: false }],
          files: [
            {
              id: 'f_arc8_02_key',
              name: 'vance_workstation_key.gpg',
              sizeKb: 4,
              isEncrypted: true,
              isLog: false,
              missionObjective: 'story_arc8_02',
              content:
                'A GPG private key fragment. Asher Vance\'s. Tagged "REVOKED 2197-04-19 — DO NOT USE FOR ACTIVE WORK." ' +
                'The revocation was bureaucratic; the key itself was never destroyed. With it, every signed artefact in his bundle ' +
                'can be verified against Dispatch\'s own internal infrastructure. It turns "ex-employee makes accusations" into ' +
                '"ex-employee\'s cryptographic signature appears on every active record in the data."',
            },
          ],
          connectedTo: ['s2', 's3', 's5'], position: { x: 490, y: 460 },
        },
        {
          id: 's5', type: 'file_server', label: 'dispatch operational archive',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SMB', port: 445, version: '3.1.1', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2020-0796' }],
          files: [], connectedTo: ['s3', 's4'], position: { x: 690, y: 300 },
        },
      ],
    },
    events: [
      {
        id: 'arc8_02_evt_pricing',
        triggerCondition: { type: 'objective_complete', objectiveId: 'obj_arc8_02_optional' },
        message: 'Your handle has been sold 9 times in 18 months — twice to Arunmor, once to Ares, six to DataPharos. Six contracts steered.',
        effect: { type: 'set_flag', flag: 'arc8_pricing_seen', value: true },
      },
      {
        id: 'arc8_02_evt_key',
        triggerCondition: { type: 'node_breached', nodeType: 'admin_console' },
        message: 'Vance\'s revoked-but-undestroyed key. With this, the bundle stops being theory.',
        effect: { type: 'set_flag', flag: 'arc8_key_acquired', value: true },
      },
    ] satisfies MissionEvent[],
    coda:
      'You disconnect with the key on your storage. Asher\'s confirmation message arrives within two minutes.\n\n' +
      '*"Now I have a case. Whether anyone is willing to read it is the next problem."*\n\n' +
      'You read the rest of his bundle that night. The README at the root names three things that you did not expect.\n\n' +
      'One: Cipher is not in the lighthouse index. He has been protected, by someone, since before the index existed. The bundle ' +
      'cannot tell you by whom.\n\n' +
      'Two: NIGHTOWL_22 is in the index. Her L-rating is 9.1. She has been sold 47 times. The buyer in every transaction is the ' +
      'same handle: *MAGNUS_RELAY*. You know that name now.\n\n' +
      'Three: the entire DataPharos broker network has been a Voidlink Dispatch front company since 2192. The company you have ' +
      'been worried about is the company you have been signed up with. It is the same company. It has always been the same company.\n\n' +
      'Asher writes one more line, an hour later: *"You can take the next contract whenever you are ready. The next contract ' +
      'will record what you do about this."*',
    unlockRequirement: {
      completedMissionIds: ['story_arc8_01'],
    },
    narrativeFlags: { arc8_vance_meeting: true, arc8_dispatch_compromised: true },
  },

  // ─── Arc 8 Mission 3: The Watchers ────────────────────────────────────────
  {
    id: 'story_arc8_03',
    type: 'file_theft',
    status: 'available',
    difficulty: 5,
    isStory: true,
    briefing: {
      clientHandle: 'YOURSELF',
      clientAvatarId: 'avatar_self',
      subject: 'Whoever has been watching, you watch them now',
      body:
        'You know what DataPharos is now. Before you choose what to do about it, you need the buyer list. Not the resold one. The ' +
        'one DataPharos uses internally. The one that names every party that has paid to read your file.\n\n' +
        'DataPharos\' Singapore facility is real, even though the company itself is a Voidlink Dispatch shell. The buyer index is on ' +
        'an air-gapped client database two pivots deep. The network knows what it is. It will not be quiet.\n\n' +
        'Get the buyer list. Get out. Read it at home.\n\n' +
        '— You',
    },
    objectives: [
      {
        id: 'obj_arc8_03_primary',
        description: 'Exfiltrate the DataPharos master buyer index',
        isOptional: false,
        isCompleted: false,
        targetNetworkId: 'net_story_arc8_03',
        targetFileId: 'f_arc8_03_buyers',
      },
      {
        id: 'obj_arc8_03_optional',
        description: 'Pull the internal MAGNUS_RELAY transaction history (BONUS: ties the buyer to its lineage)',
        isOptional: true,
        isCompleted: false,
        targetNetworkId: 'net_story_arc8_03',
        targetFileId: 'f_arc8_03_magnus',
      },
    ],
    targetNetworkId: 'net_story_arc8_03',
    requirements: requirementsForDifficulty(5),
    reward: {
      credits: 26_000,
      reputation: 110,
    },
    network: {
      id: 'net_story_arc8_03',
      archetype: 'corporate_intranet',
      ownerId: 'datapharos_group',
      label: 'DATAPHAROS GROUP — SINGAPORE FACILITY',
      seed: 0xda7af09a,
      createdAt: 0,
      traceSpeed: 22,
      activeAdmins: 2,
      entryNodeId: 'p0',
      nodes: [
        {
          id: 'p0', type: 'entry_point', label: 'public datapharos portal',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTPS', port: 443, version: 'nginx 1.24', hasKnownVulnerability: false }],
          files: [], connectedTo: ['p1', 'p2'], position: { x: 110, y: 300 },
        },
        {
          id: 'p1', type: 'firewall', label: 'tier-1 firewall',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v3', hasKnownVulnerability: false }],
          files: [], connectedTo: ['p0', 'p3'], position: { x: 280, y: 160 },
        },
        {
          id: 'p2', type: 'proxy', label: 'broker-side proxy',
          securityTier: 3, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'HTTPS', port: 443, version: 'haproxy 2.6', hasKnownVulnerability: false }],
          files: [], connectedTo: ['p0', 'p4'], position: { x: 280, y: 440 },
        },
        {
          id: 'p3', type: 'firewall', label: 'tier-2 air-gap firewall',
          securityTier: 5, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SNMP', port: 161, version: 'v3', hasKnownVulnerability: false }],
          files: [], connectedTo: ['p1', 'p5'], position: { x: 460, y: 200 },
        },
        {
          id: 'p4', type: 'admin_console', label: 'broker operations console',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'RDP', port: 3389, version: '10.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2019-0708' }],
          files: [
            {
              id: 'f_arc8_03_magnus',
              name: 'magnus_relay_transactions.json',
              sizeKb: 64,
              isEncrypted: false,
              isLog: false,
              content:
                'MAGNUS_RELAY\'s transaction history with DataPharos. 312 purchases across 14 years. Every purchase has the same ' +
                'invoice line: "OPERATIVE_PROFILE — ACTIVE." The handle MAGNUS_RELAY has been buying operative profiles since 2185. ' +
                'That is nine years before the lighthouse index existed. Which means the rating system was retrofitted around a ' +
                'buyer that already existed and was already collecting. The buyer was the customer first. The whole pricing scheme ' +
                'was built for them.',
            },
          ],
          connectedTo: ['p2', 'p5', 'p6'], position: { x: 460, y: 440 },
        },
        {
          id: 'p5', type: 'database', label: 'master buyer index',
          securityTier: 5, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'MySQL', port: 3306, version: '8.0', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2023-21863' }],
          files: [
            {
              id: 'f_arc8_03_buyers',
              name: 'master_buyer_index.csv',
              sizeKb: 1_120,
              isEncrypted: true,
              isLog: false,
              missionObjective: 'story_arc8_03',
              content:
                'The complete buyer list. 84 named entities. Sorted by lifetime spend.\n\n' +
                'Top five: ARUNMOR (lifetime spend 41.8M Cr); ARES_DIVISION (28.4M); MAGNUS_RELAY (24.1M); JCB Liaison Office ' +
                '(19.7M); INTERNIC_HOLDINGS (14.2M).\n\n' +
                'CIPHER does not appear in the buyer list. CIPHER does not appear in the *sold* list either — confirming what ' +
                'Vance\'s bundle implied. Someone has been keeping him off it. The list does not say who, but it does say *when* — ' +
                'his protection note is dated 2189-11-04. Three years before the lighthouse index was created. Whoever protected ' +
                'him knew the index was coming.',
            },
          ],
          connectedTo: ['p3', 'p4', 'p6'], position: { x: 640, y: 200 },
        },
        {
          id: 'p6', type: 'file_server', label: 'archived buyer correspondence',
          securityTier: 4, isBreached: false, isScanned: false, isActive: true, isLogWiped: false,
          services: [{ protocol: 'SMB', port: 445, version: '3.1.1', hasKnownVulnerability: true, vulnerabilityId: 'CVE-2020-0796' }],
          files: [], connectedTo: ['p4', 'p5'], position: { x: 640, y: 440 },
        },
      ],
    },
    events: [
      {
        id: 'arc8_03_evt_admins_active',
        triggerCondition: { type: 'trace_threshold', percent: 25 },
        message: 'DataPharos\' admin team has begun coordinated authentication-token cycling. They know something is wrong.',
        effect: { type: 'raise_trace_speed', delta: 4 },
      },
      {
        id: 'arc8_03_evt_magnus',
        triggerCondition: { type: 'objective_complete', objectiveId: 'obj_arc8_03_optional' },
        message: 'MAGNUS_RELAY has been buying operative profiles since 2185 — nine years before the lighthouse existed. The pricing scheme was built for it.',
        effect: { type: 'set_flag', flag: 'arc8_magnus_predates_index', value: true },
      },
      {
        id: 'arc8_03_evt_buyers',
        triggerCondition: { type: 'node_breached', nodeType: 'database' },
        message: 'The buyer list. 84 entities. CIPHER\'s protection note is dated 2189 — three years before the index was even created.',
        effect: { type: 'set_flag', flag: 'arc8_buyer_list_acquired', value: true },
      },
    ] satisfies MissionEvent[],
    coda:
      'You extract cleanly. The wipe pattern is precise. DataPharos\' administrators are still hunting their own logs when you ' +
      'disconnect.\n\n' +
      'You read the buyer list. You read the MAGNUS_RELAY transaction history. You read Cipher\'s protection note timestamp.\n\n' +
      'You sit at your terminal for a long time.\n\n' +
      'You know the shape of it now. Voidlink Dispatch built the lighthouse around MAGNUS — an entity nine years older than the ' +
      'pricing scheme — and then *retrofitted* the entire active operative population as inventory to keep MAGNUS supplied. ' +
      'Every operative on the network has, in a sense you do not yet have the language to fully express, been raised for sale. ' +
      'You included. Most of them not knowing.\n\n' +
      'Cipher knew. Or someone close to him did. The protection note is dated November 2189. It says nothing else.\n\n' +
      'Asher writes to you the next morning. *"Whatever you do with this, do it deliberately. The next contract will lock in your ' +
      'choice."*\n\n' +
      'A new message follows it, an hour later, from CIPHER. The fingerprint is correct. The body reads:\n\n' +
      '*"I know what you are reading. I have known for a long time. I owe you a conversation, when you are ready to have it. ' +
      'Whatever you choose, choose deliberately. I will not be the person who tells you it was right."*\n\n' +
      'You file the message.\n\n' +
      'The choice mission card arrives by morning.\n\n' +
      '─────────────────────────────────────\n' +
      'A choice mission card will appear in your inbox within 24 hours.\n' +
      'Use the M14o choice mission interface to commit to TAKE_VANCE_OUT / EXPOSE_DISPATCH / DISAPPEAR / WARN_CIPHER.\n' +
      '─────────────────────────────────────',
    unlockRequirement: {
      completedMissionIds: ['story_arc8_02'],
    },
    timeLimitSeconds: 600,
    narrativeFlags: { arc8_buyer_list_acquired: true, arc8_resolution_pending: true },
  },
]
