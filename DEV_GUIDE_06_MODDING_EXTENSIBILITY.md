# 6. Modding & Extensibility – Step-by-Step Guide

## Progress
| Section | Status | Notes |
|---------|--------|-------|
| 6.1 Design Philosophy | ⬜ Not started | Architecture planned but not built |
| 6.2 Scripting API (Lua) | ⬜ Not started | — |
| 6.3 Content Packaging (.uplinkmod) | ⬜ Not started | — |
| 6.4 UI Skin System | ⬜ Not started | CSS vars exist; no skin loader |
| 6.5 Mod Distribution | ⬜ Not started | — |
| 6.6 Mod Management & Safety | ⬜ Not started | — |
| 6.7 Developer Tooling | ⬜ Not started | — |

**Prerequisite:** Core gameplay fully stable + content system complete before modding API is locked.

---

This guide covers the full modding pipeline: scripting API, content packaging, distribution, UI customisation, and the in-game mod browser.

---

## 6.1. Design Philosophy

- Mods are first-class citizens — the internal mission and tool system is the same API modders use
- The base game ships with all its content packaged as "official mods" internally, proving the API is capable of everything
- Security is paramount: mods run in a sandboxed scripting environment with no filesystem or network access outside defined APIs
- Versioning and compatibility are enforced: mods declare a minimum game version and are automatically disabled on breaking updates

---

## 6.2. Scripting API

### 6.2.1. Language Choice
- **Lua 5.4** (via LuaJIT for performance) as the primary modding language
  - Lightweight, embeddable, widely used in games (WoW, LOVE2D, Roblox)
  - Easy to learn for non-programmers; powerful enough for complex mods
- **TypeScript definitions** auto-generated from the Lua API for IDE support in VS Code
- Expose a stable, versioned API — never break existing mods without a major version bump and migration guide

### 6.2.2. Core API Modules

#### `game.missions`
```lua
-- Register a new mission type
game.missions.register({
  id = "my_mod.infiltrate_arc",
  title = "Infiltrate ARC Research",
  description = "Steal the Revelation source code from ARC's internal network.",
  difficulty = 4,        -- 1–10
  reward = { credits = 50000, reputation = 200 },
  on_start = function(ctx)
    ctx.target = game.world.spawn_network("arc_research_lab", { security = "high" })
  end,
  on_complete = function(ctx)
    game.world.news.post("ARC Research division suffers catastrophic breach.")
  end,
  on_fail = function(ctx)
    ctx.player.trace_level = ctx.player.trace_level + 30
  end,
})
```

#### `game.tools`
```lua
-- Add a new hacking tool
game.tools.register({
  id = "my_mod.quantum_cracker",
  name = "Quantum Cracker",
  description = "Uses quantum annealing to break 4096-bit RSA in seconds.",
  category = "password",
  upgrade_slots = 3,
  on_use = function(ctx, target)
    local time = 120 / (ctx.tool.level * ctx.hw.cpu_speed)
    return game.crack.schedule(target, time)
  end,
})
```

#### `game.networks`
```lua
-- Define a custom network archetype
game.networks.register_archetype({
  id = "my_mod.quantum_vault",
  nodes = {
    { type = "firewall", tier = 5 },
    { type = "file_server", contents = { "classified_data" } },
    { type = "intrusion_detector", sensitivity = "paranoid" },
  },
  on_breach = function(ctx)
    game.world.alerts.raise("QUANTUM_VAULT_BREACH", ctx.player)
  end,
})
```

#### `game.world`
- `game.world.news.post(headline)` — add a story to the in-game news feed
- `game.world.corporations.get(id)` — read corporation state
- `game.world.factions.modify_standing(faction_id, player_id, delta)` — adjust reputation
- `game.world.events.schedule(event_id, delay_ticks)` — trigger a world event

#### `game.ui`
- `game.ui.window.open(spec)` — spawn a new window in the player's desktop
- `game.ui.notification.push(text, icon)` — push a HUD notification
- `game.ui.terminal.print(text, style)` — write to the in-game terminal

### 6.2.3. Sandboxing & Security
- Mods run in a Lua sandbox with no access to `os`, `io`, `require`, or `debug` modules
- All file I/O goes through `game.storage` (mod-scoped key-value store, max 10 MB per mod)
- Network calls are not permitted from Lua; only game API calls are available
- CPU budget per tick: mods collectively receive a max % of frame time; misbehaving mods are throttled and flagged
- All mod code is scanned for known malicious patterns on install and on game launch

---

## 6.3. Content Types & Packaging

### 6.3.1. Supported Content Types
| Type | Description |
|------|-------------|
| `mission` | New contracts, story arcs, and mission types |
| `tool` | New hacking software and hardware |
| `network_archetype` | New network layouts and node types |
| `faction` | New factions with their own standing and missions |
| `ui_skin` | Full UI theme: colours, fonts, icons, animations |
| `soundtrack` | Replacement or additive music tracks |
| `locale` | New language translations |
| `tutorial` | Extended or replacement tutorials |
| `world_event` | New world events that trigger in the simulation |

### 6.3.2. Mod Package Format
- Mods are distributed as `.uplinkmod` files (a renamed ZIP with a manifest)
- Package structure:
  ```
  my_mod/
  ├── manifest.json        # Metadata, versioning, dependencies
  ├── init.lua             # Entry point (always loaded first)
  ├── missions/            # Mission definition Lua files
  ├── tools/               # Tool definition Lua files
  ├── assets/
  │   ├── icons/           # PNG icons (max 512×512)
  │   ├── sounds/          # OGG audio files
  │   └── ui/              # CSS overrides or skin assets
  └── locales/             # JSON locale files
  ```

### 6.3.3. manifest.json Specification
```json
{
  "id": "author_name.mod_name",
  "version": "1.2.0",
  "game_version_min": "1.0.0",
  "game_version_max": "2.0.0",
  "name": "My Awesome Mod",
  "description": "Adds 20 new missions and a new faction.",
  "author": "Your Name",
  "tags": ["missions", "faction", "story"],
  "dependencies": ["other_author.dependency_mod@^1.0.0"],
  "content_types": ["mission", "faction"],
  "entry": "init.lua"
}
```

---

## 6.4. UI Skin System

### 6.4.1. Theming Architecture
- The game UI uses CSS Custom Properties (variables) throughout — no hard-coded colours or sizes
- A skin is a JSON file mapping variable names to values, plus optional asset overrides

### 6.4.2. Skin Definition
```json
{
  "id": "author.matrix_green",
  "name": "Matrix Green",
  "variables": {
    "--color-primary": "#00ff41",
    "--color-bg": "#0d0d0d",
    "--color-text": "#c8ffc8",
    "--font-mono": "\"Courier Prime\", monospace",
    "--glow-intensity": "12px"
  },
  "assets": {
    "window-chrome": "assets/ui/window_matrix.svg",
    "cursor": "assets/ui/cursor_matrix.png"
  }
}
```

### 6.4.3. Animation Overrides
- Skins can override animation keyframes via CSS files placed in `assets/ui/*.css`
- Game wraps all animations in CSS classes that skin CSS can override safely

---

## 6.5. Mod Distribution

### 6.5.1. In-Game Mod Browser
- Accessible from the main menu under "Community" → "Mods"
- Connects to the Uplink Next Gen Mod Portal API
- Browse, search, filter, install, uninstall, update, and rate mods — all without leaving the game
- Install queue: download in background, apply on next session start or immediately (for non-runtime mods)

### 6.5.2. Mod Portal (Web)
- Web companion at mod.uplinkng.com (or equivalent)
- Upload, manage, and update mods via web dashboard
- Analytics for mod authors: installs, active users, ratings, crash reports
- Revenue sharing programme: optional paid mods with 70/30 split (author/platform)

### 6.5.3. Steam Workshop
- Full Steam Workshop integration for the Steam release
- Mods auto-sync between Workshop and in-game browser
- Workshop collections for curated mod packs

### 6.5.4. Manual Installation
- Drop `.uplinkmod` file into `%AppData%/UplinkNG/mods/` (Windows) or `~/.uplinkng/mods/` (Linux/Mac)
- Game detects and loads on next launch with a "new mod detected" prompt

---

## 6.6. Mod Management & Safety

### 6.6.1. In-Game Mod Manager
- Enable/disable mods without uninstalling
- Load order control (drag to reorder; later mods override earlier ones on conflicts)
- Conflict detection: warns when two mods modify the same data
- Per-mod settings UI: if a mod registers settings via the API, they appear here

### 6.6.2. Compatibility & Updates
- Game checks mod compatibility on every launch; incompatible mods auto-disabled with a clear message
- Mod authors notified via the portal when a game update breaks their mod
- Grace period: mods work in a compatibility shim for one minor version after a breaking change

### 6.6.3. Crash Reporting for Mods
- If a mod causes a crash or error, the crash report includes the mod ID, version, and Lua stack trace
- Crash reports (opt-in) forwarded to the mod author via the portal
- If a mod causes crashes repeatedly, the game offers to auto-disable it

---

## 6.7. Developer Tooling

### 6.7.1. Modding SDK
- Download the full SDK: VS Code extension with Lua LSP, autocomplete, and type definitions for all APIs
- Local dev server: `uplink-ng devmod ./my_mod/` — loads the mod into a running game instance with hot-reload
- CLI tool: `uplink-ng pack`, `uplink-ng validate`, `uplink-ng publish`

### 6.7.2. Documentation
- Full API reference auto-generated from source annotations and published at docs.uplinkng.com
- Tutorials: "Your first mission mod", "Building a new hacking tool", "Creating a full UI skin"
- Example mods: 3–5 reference mods shipped with the game demonstrating each content type
- Community Discord channel: #modding with a dedicated helper bot (answers API questions)

### 6.7.3. Testing & Validation
- `uplink-ng validate ./my_mod/` runs: manifest lint, Lua syntax check, asset format verification, sandbox safety scan
- Automated test runner: write Lua test scripts using `game.test.*` API, run with `uplink-ng test`

---

This guide ensures a thriving, safe, and extensible modding ecosystem. Next: Content Creation — or request any section for immediate expansion.
