# 10. Testing, QA & Launch – Step-by-Step Guide

## Progress
| Section | Status | Notes |
|---------|--------|-------|
| 10.1 Testing Philosophy | ✅ Done | Pure functions in libs/core tested in isolation |
| 10.2 Automated Testing | 🚧 Partial | 60 Vitest unit tests covering trace engine, crack engine (including M13 protocol multipliers), network generator, and contract generator. 100% passing. No integration or E2E tests yet. |
| 10.3 Manual & Exploratory Testing | 🚧 Partial | Manual browser testing during development. No formal test matrix. |
| 10.4 Community Testing | ⬜ Not started | Pre-alpha — not ready |
| 10.5 Launch Checklist | ⬜ Not started | — |
| 10.6 Bug Severity & Triage | 🚧 Partial | Known bugs catalogued in GAME_DESIGN_MASTER.md §14.2 |
| 10.7 Post-Launch Support | ⬜ Not started | — |
| 10.8 Analytics & Success Metrics | ⬜ Not started | — |

**Current test coverage:** `libs/core` engine logic is well-tested. `apps/web` components have zero automated tests — no component tests, no E2E.

**Next testing priorities:**
- Integration tests for `gameStore.ts` actions (acceptMission, breachNode, disconnect)
- Component tests for MissionBoard, HackingInterface (when mission event wiring is complete)
- Playwright E2E: full session from login → accept mission → breach → disconnect → reward

---

This guide covers the complete testing strategy, QA process, community testing programme, launch checklist, and post-launch support model for Voidlink.

---

## 10.1. Testing Philosophy

- "Test in production" is not a strategy — every defect caught in QA is a defect that doesn't hit players
- Tests are part of the codebase: written with the same care as production code, reviewed in PRs
- Testing pyramid: many unit tests, fewer integration tests, few E2E tests — not the reverse
- Shift left: testing begins at design, not after implementation
- No release without a signed-off test plan and all P0/P1 bugs resolved

---

## 10.2. Automated Testing

### 10.2.1. Unit Tests
- Framework: **Vitest** (fast, Vite-native) for frontend; **Jest** for backend services
- Target coverage: 80% line coverage for `/libs/core` and `/libs/ui`; 70% for `/apps/*`
- Every bug fix must include a regression test that would have caught the bug
- Mock strategy: mock at the boundary (API calls, filesystem, DB); don't mock internal logic
- Run time target: full unit suite under 60 seconds in CI

### 10.2.2. Integration Tests
- Framework: **Supertest** for API integration; **Testing Library** for React component integration
- Test real database interactions using a test PostgreSQL/Redis instance in Docker
- Each service has integration tests covering its public API contracts
- Game logic integration: test full hacking sequences (scan → crack → transfer → trace escape) as end-to-end game logic flows

### 10.2.3. End-to-End (E2E) Tests
- Framework: **Playwright** (supports Chromium, Firefox, WebKit — covers all desktop targets)
- Critical user journeys covered:
  - New player registration and onboarding
  - Complete a mission from contract board to reward collection
  - Buy and install a hardware upgrade
  - Complete a PvP contract (mocked opponent)
  - Create and publish a community mod
  - Account deletion (GDPR flow)
- E2E tests run nightly on the staging environment; blocking on release branches

### 10.2.4. Performance Tests
- **k6** for load testing API endpoints: ramp up to 10,000 concurrent users, verify <200ms p95 latency
- **Lighthouse CI** on every PR: must pass scores of ≥90 Performance, ≥95 Accessibility, ≥90 Best Practices
- Memory leak detection: automated heap snapshot comparison in CI for the Electron client
- Frame rate testing: automated script that plays through key UI animations, captures FPS via Puppeteer; must maintain 60fps on reference hardware

### 10.2.5. Accessibility Tests
- `axe-playwright` runs on every E2E test: zero WCAG AA violations permitted to merge
- Keyboard navigation test: automated Tab/Enter navigation through all critical paths
- Screen reader output: `jest-axe` snapshot tests to catch role/label regressions

### 10.2.6. Security Tests
- SAST: `Semgrep` + `ESLint security plugin` on every PR
- Dependency audit: `npm audit --audit-level=high` blocks merge on high/critical CVEs
- Secret scanning: `git-secrets` pre-commit + GitHub secret scanning
- DAST: **OWASP ZAP** automated scan run weekly against the staging environment

---

## 10.3. Manual & Exploratory Testing

### 10.3.1. Structured Manual Test Plans
- For each milestone release, QA produces a test plan covering: new features, regression areas, and platform-specific checks
- Test cases written in a format: **Given / When / Then** with expected and actual result columns
- Platform matrix tested before each release:

| Platform | Minimum Spec | Target Spec |
|----------|-------------|-------------|
| Windows 10/11 | Intel i5-6th gen, 8GB RAM, integrated GPU | Ryzen 5 5600X, 16GB RAM, RTX 3060 |
| macOS 13+ | Apple M1, 8GB RAM | Apple M3 Pro, 18GB RAM |
| Ubuntu 22.04 LTS | Same as Windows minimum | Same as Windows target |
| Steam Deck | Default Steam Deck hardware | N/A |
| Web (Chrome/Firefox/Safari) | Intel i5, 8GB RAM, integrated GPU | Same |

### 10.3.2. Exploratory Testing Sessions
- Weekly 2-hour exploratory sessions by the QA team: no scripts, find the unexpected
- Focus areas rotate: one week UI/UX, one week gameplay systems, one week edge cases (low credits, max trace, full inventory)
- Bug bash events: entire team plays for 2 hours with bug report quota; incentivised with prizes

### 10.3.3. Regression Testing
- Full regression suite runs before every release candidate build
- Automated regression where possible; manual for UI/visual regressions (using **Percy** for visual snapshot diffing)
- Regression sign-off required from QA lead before release is approved

---

## 10.4. Community Testing Programme

### 10.4.1. Closed Alpha
- Invite ~500 community members (Discord server sign-ups, content creators, accessibility community)
- NDA required; feedback via dedicated Discord channels and GitHub Issues
- Focus: core gameplay loop, network simulation, UI/UX feel
- Duration: 4 weeks, two weekly builds
- Fixed criteria for exiting alpha: all P0/P1 bugs resolved, core loop rated ≥4/5 by ≥80% of testers

### 10.4.2. Open Beta
- Open to all pre-registered players; target 10,000–50,000 participants
- Platforms: Windows, macOS, Linux (web/browser for broadest access)
- Automated telemetry (opt-in) to collect crash data, performance metrics, and mission completion rates
- Beta feedback hub: in-game button to report bugs with automatic screenshot + system info attachment
- Weekly dev diary: communicate what was fixed based on beta feedback (builds trust and engagement)
- Exit criteria: all P0/P1 resolved; P2 resolved or documented; performance targets met

### 10.4.3. Streamer/Creator Preview
- Embargoed press build sent to content creators 2 weeks before launch
- Embargo lifts launch day morning
- Creator kit: key art, trailers, fact sheet, and asset pack delivered with the build

---

## 10.5. Launch Checklist

### 10.5.1. Technical Readiness
- [ ] All P0 and P1 bugs resolved and verified
- [ ] Performance targets met on all platform/spec combinations
- [ ] Automated test suite passing: unit, integration, E2E, accessibility
- [ ] Security penetration test completed and findings resolved
- [ ] Privacy policy, terms of service, and cookie policy reviewed by legal
- [ ] GDPR/CCPA compliance audit completed
- [ ] Platform certifications obtained (Steam, EGS, macOS notarization)
- [ ] CDN and server load test: simulated launch-day traffic spike (10× expected concurrent users)
- [ ] Rollback plan documented and tested: can revert to previous version in <30 minutes
- [ ] On-call rota active from T-24h through T+72h post-launch

### 10.5.2. Content Readiness
- [ ] All story missions reviewed and signed off by narrative lead
- [ ] All in-game text spell-checked and proofread in all launch languages
- [ ] Voice acting complete, synced, and reviewed
- [ ] All audio (music, SFX, ambient) mastered and levels balanced
- [ ] Age ratings obtained for all required territories (PEGI, ESRB, CERO, etc.)
- [ ] Launch trailer, screenshots, and press kit finalised

### 10.5.3. Store & Platform Readiness
- [ ] Steam store page complete: description, screenshots, trailer, tags, system requirements
- [ ] Steam build uploaded and reviewed by Valve
- [ ] Website live with purchase links, press kit, and support page
- [ ] Support system live: help desk, knowledge base, community forum, and Discord
- [ ] Social media channels active (Twitter/X, Bluesky, Instagram, TikTok, YouTube)

### 10.5.4. Community Readiness
- [ ] Discord server: channels set up, moderation team briefed, bots configured
- [ ] Mod portal live and accepting submissions
- [ ] Launch event: in-game launch event mission or cosmetic planned
- [ ] Community manager shift rota active from T-24h

---

## 10.6. Bug Severity & Triage

| Severity | Definition | Target Resolution |
|----------|-----------|-------------------|
| P0 – Critical | Crash, data loss, security vulnerability, game unplayable | Fix before any release |
| P1 – Major | Key feature broken, significant progression blocker | Fix within current sprint |
| P2 – Moderate | Feature impaired, workaround exists, visual error on critical path | Fix before next minor release |
| P3 – Minor | Cosmetic, edge case, low-impact | Fix in backlog, prioritised by frequency |
| P4 – Enhancement | Not a bug, quality-of-life request | Added to feature backlog |

### Triage Process
1. Bug reported (automated crash, player report, internal find)
2. Triaged within 24h: assigned severity, reproducibility confirmed, assigned to engineer
3. P0/P1: immediate Slack escalation, on-call engineer notified
4. Fix reviewed, tested, and deployed via hotfix branch (P0/P1) or next sprint (P2/P3)
5. Bug reporter notified of resolution (if external)

---

## 10.7. Post-Launch Support Model

### 10.7.1. Hotfix Policy
- P0 hotfixes deployed within 24 hours of confirmation; P1 within 72 hours
- Hotfixes bypass the standard release cycle but still require: code review, automated test pass, and QA smoke test
- Hotfix communication: in-game notification, Steam news post, and social media announcement

### 10.7.2. Patch Cadence
- **Weekly patches**: bug fixes, balance adjustments, localisation corrections
- **Monthly updates**: new content (missions, tools, cosmetics), system improvements
- **Quarterly expansions**: major new systems, story arc chapters, platform additions
- **Annual "season" reset**: new narrative arc begins, leaderboards reset, major world events

### 10.7.3. Community Communication
- Changelog published with every patch (detailed, not just "bug fixes and performance improvements")
- "State of the Hack" monthly blog post: upcoming content, behind-the-scenes, community highlights
- Player council: 10 elected community representatives meet with the dev team monthly to provide direct feedback
- Roadmap: publicly maintained, updated quarterly — players know what's coming

### 10.7.4. Long-Term Support (LTS)
- Commit to minimum 2 years of active content and support post-launch
- After active development ends: maintenance mode (security patches + critical bug fixes) for a further 2 years
- End-of-life plan: game source code open-sourced under a non-commercial licence when live service ends (preserving the game for the community)

---

## 10.8. Analytics & Success Metrics

### 10.8.1. Key Performance Indicators (KPIs)
| KPI | Target |
|-----|--------|
| Day-1 retention | ≥60% |
| Day-7 retention | ≥35% |
| Day-30 retention | ≥20% |
| Session length (avg) | ≥45 min |
| Mission completion rate (tutorial) | ≥85% |
| Crash rate | <0.5% of sessions |
| Refund rate | <3% |
| Review score (Steam) | ≥"Very Positive" (≥80% positive) |
| Accessibility feature usage | Track, set no target — inform design |

### 10.8.2. Analytics Tools
- Privacy-first: **Plausible** (EU-hosted, no cookies) for web/storefront analytics
- In-game: custom event pipeline with opt-in consent; events → ClickHouse → Metabase dashboards
- Crash reporting: **Sentry** (self-hosted for data residency compliance)
- Player surveys: in-game NPS survey at Day 7 and Day 30

---

This completes the full 10-guide development documentation suite for Voidlink. The documentation foundation is now complete — the next step is scaffolding the actual codebase and beginning implementation, starting with the monorepo setup and core UI framework.
