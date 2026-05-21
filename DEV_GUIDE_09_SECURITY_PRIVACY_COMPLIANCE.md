# 9. Security, Privacy & Compliance – Step-by-Step Guide

## Progress
| Section | Status | Notes |
|---------|--------|-------|
| 9.1 Application Security | ⬜ Not started | No backend yet; frontend has no auth, no API |
| 9.2 Anti-Cheat | ⬜ Not started | Single-player only right now |
| 9.3 Mod Security | ⬜ Not started | No mod system yet |
| 9.4 Privacy-First Design | 🚧 Partial | localStorage only; no analytics, no tracking |
| 9.5 GDPR/CCPA Compliance | ⬜ Not started | No server-side data processing |
| 9.6 Platform Certification | ⬜ Not started | Pre-alpha; not submitting to stores yet |
| 9.7 Infrastructure Security | ⬜ Not started | No cloud infrastructure yet |

**Note:** Most of this guide applies once the backend server (Guide 05 prerequisite) is built.

---

This guide covers application security, multiplayer anti-cheat, privacy-first data practices, GDPR/CCPA compliance, and platform certification requirements.

---

## 9.1. Application Security

### 9.1.1. Secure Development Lifecycle (SDL)
- Threat modelling at the design phase for every major system (use STRIDE framework)
- Security requirements documented alongside functional requirements
- Mandatory security review for PRs touching: auth, payment, data storage, networking, and modding API
- Static analysis (SAST): `ESLint security plugin`, `Semgrep`, and `Snyk` integrated into CI — blocks merge on high/critical findings
- Dependency scanning: Dependabot + `npm audit` on every PR; no known high/critical CVEs in dependencies at ship time
- Penetration test by external firm before every major release and annually in post-launch

### 9.1.2. Authentication & Authorisation
- Auth: OAuth 2.0 + OpenID Connect for third-party login (Steam, Epic, Apple, Google); custom email/password with PKCE
- Passwords: hashed with Argon2id (minimum cost parameters per OWASP recommendations); never stored in plaintext or logged
- Sessions: short-lived JWT access tokens (15 min) + long-lived rotating refresh tokens (30 days) stored in HttpOnly, Secure, SameSite=Strict cookies
- MFA: TOTP (Google Authenticator compatible) and WebAuthn/passkeys supported and encouraged
- Authorisation: RBAC (player, moderator, admin) with least-privilege principle; all API endpoints verify role server-side
- Rate limiting: all auth endpoints rate-limited per IP and per account; exponential backoff on repeated failures

### 9.1.3. Transport Security
- TLS 1.3 only (TLS 1.2 as fallback for older clients); enforce HSTS with long max-age + preload
- Certificate pinning in the Electron desktop client for critical API endpoints
- WebSocket connections over WSS only; same origin validation + CSRF tokens for sensitive operations
- All API responses include: `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`

### 9.1.4. Input Validation & Injection Prevention
- All user input validated and sanitised server-side (never trust client)
- ORM (Prisma/Drizzle) used throughout — no raw SQL string concatenation
- NoSQL injection: all MongoDB/Redis operations use parameterised queries/commands
- Output encoding: React's JSX escaping for HTML; `DOMPurify` for any cases where HTML must be rendered
- File uploads: type validation, size limits, content scanning (ClamAV), and storage in isolated CDN (no execution possible)

### 9.1.5. Secrets Management
- No secrets in source code, environment variable files committed to git, or CI/CD logs
- Secrets stored in HashiCorp Vault (production) or a secrets manager (AWS Secrets Manager/GCP Secret Manager)
- Short-lived dynamic credentials for database access (Vault dynamic secrets)
- Secret scanning: `git-secrets` pre-commit hook; GitHub secret scanning enabled on the repo

---

## 9.2. Anti-Cheat & Leaderboard Integrity

### 9.2.1. Threat Model for Multiplayer Cheating
- Client-side manipulation: modified game state, memory editing, speed hacks
- Replay/stat injection: fabricated match results, inflated stats
- Botting: automated scripted play for farming credits or rank
- Collusion: players working together to manipulate leaderboards
- Account trading/boosting: high-rank accounts sold or boosted by others

### 9.2.2. Server-Authoritative Architecture
- All game-critical state lives on the server: no client-side authoritative values for score, credits, rank, or mission outcomes
- Mission results validated server-side: the server replays the player's action log and verifies the outcome is possible
- Time-based cheats: server timestamps all events; client-reported timings within ±200ms are accepted, outliers flagged

### 9.2.3. Behavioural Anti-Cheat
- Statistical anomaly detection: flag accounts whose performance metrics (speed, accuracy, tool efficiency) exceed human-possible thresholds by more than 3σ
- Action log analysis: pattern recognition for bot-like action sequences (perfect timing, no human variance)
- ML model: trained on known-clean and known-cheat play-styles; flags suspicious sessions for human review
- Shadow banning: suspected cheaters are silently isolated to play-with-each-other pools while investigation occurs (reduces false positive pain)

### 9.2.4. Leaderboard Integrity
- All leaderboard submissions go through a validation pipeline before being committed
- Top-100 scores reviewed manually before a season ends
- Leaderboard score decay: scores older than 90 days decay 1% per day (prevents inactive squatting)
- Appeal system: banned players can appeal via support ticket with evidence

---

## 9.3. Mod Security

### 9.3.1. Mod Sandboxing (see also Guide 06)
- Lua sandbox: no OS, IO, or network access
- Resource budgets: CPU, memory, and storage limits enforced per mod
- Malware scanning: all uploaded mods scanned with ClamAV + custom signature rules before publishing
- Human review: top-downloaded and newly published mods reviewed by mod team weekly

### 9.3.2. Mod Code Signing
- Official mods (shipped with the game): signed with a game certificate; game verifies signature on load
- Community mods: not signed, but a clear visual indicator distinguishes official from community content
- Future: optional code signing for community mod authors via a trust programme

---

## 9.4. Privacy-First Design

### 9.4.1. Data Minimisation
- Collect only what is necessary for the game to function
- No advertising SDKs, no third-party tracking pixels, no data broker integrations
- Analytics (opt-in): gameplay telemetry (session length, mission completion rates, crash reports) — no PII attached
- Crash reports: stack traces + anonymised hardware info only; opt-in, clearly explained at first launch

### 9.4.2. Data Inventory
| Data Type | Purpose | Retention | Shareable |
|-----------|---------|-----------|-----------|
| Account email | Auth, communication | Until deletion | No |
| Hashed password | Auth | Until deletion | No |
| Username, avatar | Profile display | Until deletion | Yes (public) |
| Game progress | Save/sync | Until deletion | No |
| Gameplay telemetry | Analytics | 12 months rolling | Aggregate only |
| Crash reports | Bug fixing | 90 days | No |
| Chat messages | Social | 30 days | No |
| Purchase records | Financial compliance | 7 years | No |

### 9.4.3. Privacy Controls for Players
- Privacy dashboard: in-game and on the web — see all data held, download it, delete it
- Granular consent: separate toggles for analytics, crash reports, and marketing emails
- Profile visibility: per-field public/private controls
- Right to be forgotten: account deletion deletes all PII within 30 days; anonymised aggregate stats are retained

---

## 9.5. GDPR & CCPA Compliance

### 9.5.1. GDPR (EU/UK)
- Lawful basis documented for every data processing activity
- Privacy policy written in plain language; accessible from every page/screen
- Data subject rights implemented:
  - **Access**: export all personal data as JSON within 30 days
  - **Rectification**: edit profile data in-game
  - **Erasure**: full account deletion within 30 days
  - **Portability**: structured data export (game saves, stats, chat history)
  - **Objection**: opt out of any non-essential processing
- Data Processing Agreements (DPAs) in place with all processors (hosting, analytics, payment)
- DPO (Data Protection Officer) appointed or external DPO service engaged
- Data breach notification: documented process to notify supervisory authority within 72 hours

### 9.5.2. CCPA (California)
- "Do Not Sell or Share My Personal Information" link in footer and settings
- Privacy notice updated to include CCPA-specific disclosures
- Opt-out mechanism honoured globally (not just for California residents — simpler, more ethical)

### 9.5.3. COPPA (Children's Online Privacy Protection)
- Age gate at registration: date of birth required
- Players under 13 (US) / under 16 (EU) directed to a parental consent flow
- COPPA-compliant accounts: no social features, no chat, no user-generated content exposure
- No behavioural advertising to any user under 18

### 9.5.4. Parental Controls
- PIN-protected parental control panel accessible in settings
- Controls: chat on/off, social features on/off, spending limits, playtime limits, content rating filter
- Parental control bypass protection: not bypassable from the child account

---

## 9.6. Platform Certification Requirements

### 9.6.1. Steam (Valve)
- Age rating submission via IARC
- Steam achievements API integrated
- Steam Cloud saves integrated
- Steamworks SDK integrated (matchmaking, leaderboards, Workshop)
- Technical requirements checklist: [Steamworks Technical Requirements](https://partner.steamgames.com/doc/store/review_process)

### 9.6.2. Epic Games Store
- Epic Online Services (EOS) SDK for auth and social (optional; prefer own systems as primary)
- Age rating via IARC

### 9.6.3. macOS (Apple Notarization)
- App signed with Apple Developer ID and notarized via `xcrun altool`
- Hardened runtime enabled; no deprecated entitlements
- Privacy usage descriptions in Info.plist for all accessed capabilities

### 9.6.4. Microsoft (Windows / Xbox)
- Microsoft Store: MSIX packaging, age rating via IARC
- Xbox certification checklist if console port is planned

---

## 9.7. Infrastructure Security

### 9.7.1. Cloud Hardening
- All services run in private VPC; only load balancers are internet-facing
- IAM: principle of least privilege; no wildcard permissions; service accounts, not user credentials
- Logging: all API calls, admin actions, and auth events logged to an append-only audit log (CloudTrail / Stackdriver)
- Monitoring: anomaly alerts for unusual API volumes, failed auth spikes, and data exfiltration indicators

### 9.7.2. Database Security
- Encryption at rest (AES-256) for all databases
- Database credentials rotated automatically via Vault dynamic secrets
- Regular automated backups with tested restore procedures
- No direct database access from the internet; only via application layer

### 9.7.3. Incident Response Plan
- Documented runbook for: data breach, DDoS, compromised credentials, critical vulnerability disclosure
- War-game exercises: tabletop incident response simulation twice per year
- Bug bounty programme (HackerOne or similar): responsible disclosure with defined scope and payout tiers
- On-call rota for security incidents: 24/7 coverage with escalation path

---

This guide ensures the game is secure, private, and compliant from day one. Next: Testing, QA & Launch — the final guide.
