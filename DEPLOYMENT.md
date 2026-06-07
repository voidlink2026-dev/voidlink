# Voidlink — Deployment

Infrastructure track that runs parallel to the gameplay sprints. See [Roadmap.md §Phase 5b](docs/Roadmap.md#phase-5b--infrastructure-live-now-scales-with-the-game) for the long-term plan.

---

## Phase A — Static Hosting (live as of 2026-06)

Railway hosts the built Vite static bundle. No backend, no DB. Players load the URL, saves stay in their browser. ~£5/month.

### How it works

1. Railway watches `main` on the GitHub repo.
2. On push, it runs the two-stage Dockerfile (`./Dockerfile`):
   - **Builder stage**: `node:20-alpine`, `pnpm install --frozen-lockfile`, then `pnpm --filter @voidlink/web build`. Produces `apps/web/dist/`.
   - **Runtime stage**: `node:20-alpine`, installs `serve@14`, copies the `dist/` from the builder, runs `serve -s dist -l $PORT`.
3. Railway routes incoming traffic to whatever port `serve` binds to.
4. The default Railway subdomain is `<project>.up.railway.app`. Custom domain wiring is one click.

### Files involved

| File | Purpose |
|------|---------|
| `Dockerfile` | Two-stage build (builder → runtime) |
| `railway.toml` | Railway service config (builder type, healthcheck, restart policy) |
| `.dockerignore` | Excludes `node_modules`, `dist`, `.git`, etc. from the build context |

### Local verification

```bash
# Build the Docker image locally (sanity check before pushing)
docker build -t voidlink:latest .

# Run it on port 8080
docker run -p 8080:8080 -e PORT=8080 voidlink:latest

# Visit http://localhost:8080
```

### What is NOT yet possible

- ❌ Saves do not sync across devices. Each browser is a separate save store.
- ❌ No accounts. No auth.
- ❌ No multiplayer. No shared world.

These are Phase B / Phase C.

---

## Phase B — Cloud Saves (planned: pre-EA, sprint S4)

Adds an `apps/server` Node/Hono API + Postgres + magic-link auth on Railway. Replaces (or supplements) Steam Cloud as the cross-device sync target.

### Architecture

```
                  ┌──────────────────┐
                  │ Browser (web app)│
                  │  apps/web        │
                  └────────┬─────────┘
                           │ HTTPS
                           │
                    ┌──────▼──────┐         ┌────────────┐
                    │ apps/server │◀───────▶│  Postgres  │
                    │ Hono + JWT  │         │  (Railway) │
                    └──────┬──────┘         └────────────┘
                           │
                           │ magic-link email
                    ┌──────▼──────┐
                    │   Resend    │
                    │   (email)   │
                    └─────────────┘
```

### Endpoints (planned)

```
POST  /auth/magiclink            — start magic-link login flow
GET   /auth/verify?token=…       — complete login, returns JWT
GET   /saves                      — list saves for the authed user
GET   /saves/:handle              — fetch one save
PUT   /saves/:handle              — upsert (with version + updatedAt for conflict detection)
DELETE /saves/:handle             — delete one save
GET   /me                         — current user record
DELETE /me                        — GDPR right-to-erasure
```

### Schema (planned, Postgres via Prisma)

```sql
CREATE TABLE users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text UNIQUE NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_seen_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE magic_link_tokens (
  token         text PRIMARY KEY,
  user_id       uuid REFERENCES users(id) ON DELETE CASCADE,
  expires_at    timestamptz NOT NULL,
  used_at       timestamptz
);

CREATE TABLE saves (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  handle        text NOT NULL,
  blob          jsonb NOT NULL,              -- the full SaveData JSON
  schema_version int NOT NULL,                -- matches persistence.ts SAVE_VERSION
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, handle)
);

CREATE INDEX idx_saves_user ON saves (user_id);
```

The `blob` column is the same JSON shape produced today by `persistence.ts` — Phase B is purely an additional save target. Local saves continue working unchanged; cloud sync is opt-in.

### Conflict resolution

When the client sends a `PUT /saves/:handle`, it includes `updatedAt` of the local save. Server compares to `saves.updated_at`:
- If equal or local is newer → accept upsert, return new `updatedAt`.
- If server is newer → respond `409 Conflict` with the server's blob. UI shows side-by-side choice (already prototyped in the pre-launch L4 sprint plan).

### Cost

| Item | Monthly |
|------|---------|
| Railway services (web + server) | ~£10 |
| Railway Postgres (starter) | ~£5 |
| Resend (magic-link emails, ≤3000/mo) | Free |
| **Total** | **~£15** |

### Why this lands before EA, not after

Cross-device sync is a real player expectation in 2026. Steam Cloud handles it for Steam buyers; Railway-Postgres handles it for the web build (and for press / streamers who want to demo from multiple machines). Both run in parallel; the player's authoritative save is the newer one.

---

## Phase C — Multiplayer Backend (post-1.0, post-EA-S3 — earliest 2028)

Per the **multiplayer LAST** mandate captured throughout the project canon, this does not begin before the existing single-player content matures across EA seasons. Designing the data model now (Phase B) so the eventual port is mechanical, not architectural.

### What it adds

- **WebSocket layer** for real-time co-op + rival-hacker mutual visibility
- **Redis** for ephemeral session state + leaderboards
- **Authoritative world simulation** running server-side (the current client-side world simulation becomes a presentation layer over server state for online operatives; offline operatives continue to run their own world sim, with the same VST anchor so both stay coherent)
- **Contract competition**, **bounty network**, **co-op missions**, **persistent corp territory** — all the items from [Full_Plan §15 Multiplayer Vision](docs/Full_Plan.md#15-multiplayer-vision-last)

### Architecture (sketch only)

```
                       ┌─────────────────────────┐
                       │  Browser / Electron     │
                       └──────────┬──────────────┘
                                  │
                  HTTPS + WebSocket (Socket.IO over TLS)
                                  │
                       ┌──────────▼──────────────┐
                       │  apps/server (Hono +    │
                       │  Socket.IO)             │
                       │  - auth (Phase B)       │
                       │  - saves (Phase B)      │
                       │  - mission rooms (new)  │
                       │  - leaderboards (new)   │
                       │  - world sim tick (new) │
                       └────┬──────────────┬─────┘
                            │              │
                  ┌─────────▼────┐  ┌─────▼──────┐
                  │   Postgres   │  │   Redis    │
                  │   (Phase B   │  │  (sessions │
                  │    + ext)    │  │   ephemeral│
                  └──────────────┘  └────────────┘
```

### Cost (estimated)

~£200+/month at active-launch scale. Real numbers depend entirely on concurrent operative count.

### Anti-Destiny rules (already in Full_Plan)

Server-authoritative economy. Action signatures with nonces. Rate limiting per IP + per account. Statistical outlier detection for rep/credit/mission-duration. No in-game-currency-to-real-money. Cosmetic monetisation only, same as single-player.

---

## What I always need before adding new infrastructure

A checklist for me/you/future-Claude when extending this:

- [ ] Does this violate the **multiplayer LAST** mandate?
- [ ] Does this introduce a pay-to-win path?
- [ ] Does this break the existing client-only save model for offline players?
- [ ] Is the schema designed for the Phase after this one?
- [ ] Is the cost documented?

If any answer is uncomfortable, slow down and revisit Full_Plan.md before shipping.
