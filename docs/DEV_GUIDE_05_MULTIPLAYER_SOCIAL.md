# 5. Multiplayer & Social Features – Step-by-Step Guide

## Progress
| Section | Status | Notes |
|---------|--------|-------|
| 5.1 Architecture Overview | ⬜ Not started | No backend server yet |
| 5.2 Player Profiles & Accounts | ⬜ Not started | Local profiles only; no online accounts |
| 5.3 Persistent World | ⬜ Not started | — |
| 5.4 PvP Contracts | ⬜ Not started | — |
| 5.5 Co-op Missions | ⬜ Not started | — |
| 5.6 Matchmaking & Lobbies | ⬜ Not started | — |
| 5.7 Leaderboards & Tournaments | ⬜ Not started | — |
| 5.8 In-Game Chat & Social | ⬜ Not started | — |
| 5.9 Community Content Browser | ⬜ Not started | — |
| 5.10 Mentorship & Onboarding | ⬜ Not started | — |

**Next prerequisite:** Backend server (`/apps/server`) — Node.js + WebSocket + PostgreSQL + Redis.

---

This guide covers all real-time and asynchronous multiplayer systems, social features, competitive infrastructure, and community tools for Voidlink.

---

## 5.1. Architecture Overview

### 5.1.1. Backend Infrastructure
- Use a microservices architecture: separate services for matchmaking, game sessions, leaderboards, chat, and player profiles
- Deploy on Kubernetes (GKE/EKS/AKS) for horizontal scalability and zero-downtime deploys
- Use WebSockets (via Socket.io or raw ws) for real-time game communication
- Use gRPC for internal service-to-service communication
- Message queue (Redis Streams or Kafka) for async event processing (mission completions, world events, notifications)
- PostgreSQL for persistent player/world data; Redis for ephemeral session and leaderboard data

### 5.1.2. Session Model
- Uplink's multiplayer is primarily asynchronous: players affect a shared persistent world rather than playing in real-time together
- Real-time modes (PvP contracts, co-op missions) use dedicated room servers spun up on demand
- All multiplayer actions feed into the persistent world simulation engine (see Guide 04)

---

## 5.2. Player Profiles & Accounts

### 5.2.1. Profile System
- Username, avatar (custom or generated cyberpunk profile), handle/alias, bio
- Publicly visible stats: missions completed, rank, rep level, faction affiliations, specialization badges
- Private stats: total earnings, breach count, trace escapes, preferred tools
- Profile privacy controls: public / friends-only / private per stat category

### 5.2.2. Reputation & Ranking
- Global rank (Elo-based, recalculated after each competitive event)
- Specialization ranks: Ghost (stealth), Brute (brute-force), Social (social engineering), Architect (network building)
- Faction standing: standing with Voidlink International, Arunmor, Revelation, and player-founded factions
- Seasonal rank resets with carry-over bonuses for top performers

### 5.2.3. Friend System
- Send/accept/decline/block friend requests
- Friends list with online status, current activity (if visible), and quick-invite
- Aliases: nickname friends within the game ("Partner", "Rival", etc.)

---

## 5.3. Persistent World (Shared World State)

### 5.3.1. How the World Works
- All players operate within a single persistent world simulation (sharded by region for latency, merged for world state)
- Corporate assets, bank accounts, research files, and network defences are real and shared: a player who steals a file removes it from the world
- Dynamic news feed aggregates player actions into in-world headlines ("ARC Corporation suffers third breach this week")
- World events (government crackdowns, black market surges, AI uprisings) triggered by accumulated player activity thresholds

### 5.3.2. World Sharding
- Divide the world into geographic shards (NA, EU, APAC, etc.) for latency, but world state is globally synced every tick (configurable, default 5s)
- Critical shared resources (e.g., unique zero-day exploits) exist once per shard to prevent over-saturation

### 5.3.3. Player-vs-World Contracts
- Corporations post bounties on their own networks — players can take defensive contracts (harden a target) or offensive ones (breach it)
- Completed actions persist: a hardened network stays hard until someone breaks it; a stolen file stays gone

---

## 5.4. PvP Contracts

### 5.4.1. Direct PvP
- Challenge another player directly: "I will breach your personal gateway before you breach mine"
- Wager credits, reputation, or items
- Both players agree to terms, then a timer starts — first to complete wins
- Spectator mode: friends and public can watch (with delay to prevent stream-sniping)

### 5.4.2. Bounty System
- Post a bounty on a target player's gateway: any player can attempt it for a reward
- Bounty target is notified (adds tension, triggers paranoia — force them to spend time hardening)
- Multiple hunters can be active simultaneously; first successful breach collects the full bounty

### 5.4.3. Faction Wars
- Factions can declare war on each other, unlocking a window of sanctioned PvP
- During war, faction members can attack each other's infrastructure, intercept contracts, and steal assets
- War results affect faction standing, territory, and access to shared resources

---

## 5.5. Co-op Missions

### 5.5.1. Mission Design for Co-op
- Missions designed with parallel sub-objectives requiring simultaneous action (one player cracks the firewall while the other intercepts the countermeasure response)
- Role assignment: Infiltrator (network penetration), Support (trace suppression and log cleaning), Analyst (intelligence gathering)
- Shared trace meter: any player getting traced increases pressure for the whole team

### 5.5.2. Lobby & Party System
- Party size: 2–4 players
- Party leader selects mission and difficulty
- Private parties (invite only) and public parties (open matchmaking)
- Voice and text chat within the party during missions

### 5.5.3. Co-op Rewards
- Rewards split fairly by role contribution (tracked by a contribution scoring system)
- Bonus rewards for perfect runs (no traces, no detections, within time limit)
- Exclusive co-op cosmetics, titles, and faction perks

---

## 5.6. Matchmaking & Lobbies

### 5.6.1. Matchmaking Algorithm
- Skill-based matchmaking (SBMM) using Elo + hidden MMR
- Separate queues: Ranked (affects standing), Casual (no rank change), Custom (player-configured rules)
- Anti-smurf measures: progression gates on ranked entry, account age requirements
- Regional matchmaking with cross-region fallback after configurable timeout

### 5.6.2. Lobby System
- Pre-match lobby: player list, role selection, mission briefing
- Ready check, vote-to-cancel, and host migration
- Spectator slots per lobby (configurable by host)
- Lobby chat and emoji reactions

### 5.6.3. Match History
- Full log of every competitive match: participants, result, duration, key actions
- Replay system: download and review any match as an interactive replay
- Share replays directly to social/streaming platforms

---

## 5.7. Leaderboards & Tournaments

### 5.7.1. Leaderboard Types
- Global: overall rank by composite score
- Specialization boards: per hacking style
- Faction boards: ranking within each faction
- Weekly/Monthly/All-time views
- Friend leaderboard: rank among friends only

### 5.7.2. Tournament Infrastructure
- Recurring official tournaments: weekly qualifiers, monthly championships, annual Grand Hack
- Community-run tournaments: any player can create a tournament with custom rules and prize pool (in-game currency)
- Tournament brackets: single elimination, double elimination, round-robin
- Live bracket viewer and auto-broadcast to in-game spectators

### 5.7.3. Prizes & Incentives
- Top ranked players earn exclusive cosmetics, titles, and in-game credits
- Tournament winners receive permanent "Hall of Hackers" entries on the main menu
- Prize pool contributions via in-game currency donations

---

## 5.8. In-Game Chat & Social

### 5.8.1. Chat Channels
- Global (world chat, can be muted)
- Faction channel
- Party/team chat
- Direct messages (DM)
- Anonymous "dark net" channel: untraced, no history, for in-world role-play

### 5.8.2. Moderation
- Auto-mod: profanity filter, spam detection, link blocking (configurable by player)
- Report system: flag messages, players, and content — feeds to moderation queue
- Moderator dashboard: tools for mute, ban, warn, and appeal review
- Community moderators (volunteer, trusted-player program with clear guidelines and powers)
- Zero-tolerance policy on harassment; escalation path to permanent ban

### 5.8.3. Social Features
- Player status: Online, Hacking (in mission), Idle, Invisible
- Reaction system: react to messages with hacker-themed emoji
- In-game mail: async messages between players, persists in inbox
- "Brag board": post notable mission completions or screenshots to a public feed

---

## 5.9. Community Content Browser

### 5.9.1. Browse & Discovery
- In-game browser listing community-created missions, mods, UI skins, and challenges
- Filter by type, rating, popularity, recency, and compatibility version
- Curated "Staff Picks" and "Community Favourites" sections
- Preview pane: screenshots, description, ratings, and compatibility info before installing

### 5.9.2. Publishing & Curation
- Players submit content through the in-game creator tools or the web portal
- Submission review: automated safety scan + community flag system + moderator review
- Versioning: authors can push updates; subscribers notified of updates

### 5.9.3. Ratings & Feedback
- 5-star rating with written review
- Upvote/downvote specific reviews for helpfulness
- Creator responds to reviews publicly

---

## 5.10. Mentorship & Onboarding

### 5.10.1. Mentor Programme
- Veteran players (rank 50+) can opt in as mentors
- New players matched with available mentors in their region and language
- Mentors earn a Mentor Badge, bonus XP, and cosmetics for each mentee milestone completed
- Guided co-op missions specifically designed for mentor/mentee pairs

### 5.10.2. New Player Onboarding Flow
- Intro cinematic and tutorial sequence on first login
- Guided first mission: step-by-step with mentor AI (if no live mentor available)
- Escalating complexity: first 10 missions are curated, then open world
- New player protection: no PvP bounties can be placed on accounts under 10 hours playtime

---

This guide ensures a deep, fair, and addictive social ecosystem. Next: Modding & Extensibility — or request any section for immediate expansion.
