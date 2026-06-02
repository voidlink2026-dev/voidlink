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
]
