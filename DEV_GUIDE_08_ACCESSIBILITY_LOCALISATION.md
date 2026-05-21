# 8. Accessibility & Localisation – Step-by-Step Guide

## Progress
| Section | Status | Notes |
|---------|--------|-------|
| 8.1 Philosophy | 🚧 Partial | Principle followed; not formally documented or audited |
| 8.2 Visual Accessibility | 🚧 Partial | `prefers-reduced-motion` respected; no colour theme switcher; no text scaling |
| 8.3 Auditory Accessibility | ⬜ Not started | No audio system yet; visual-only alerts do exist |
| 8.4 Motor Accessibility | 🚧 Partial | Basic keyboard nav, focus-visible styles, 44px targets on buttons; no remapping |
| 8.5 Cognitive Accessibility | ⬜ Not started | No hint system, codex, or difficulty options |
| 8.6 Screen Reader Support | 🚧 Partial | ARIA roles and labels on key elements; no dedicated screen reader mode |
| 8.7 Localisation Pipeline | ⬜ Not started | All strings hardcoded in components; no i18n framework |
| 8.8 Accessibility Testing | ⬜ Not started | No axe-core, no automated a11y tests |

---

This guide covers full accessibility compliance, assistive technology integration, and the complete localisation pipeline for Uplink Next Generation.

---

## 8.1. Accessibility Philosophy

- Accessibility is not a post-launch bolt-on — it is designed in from day one
- Target: WCAG 2.2 Level AA as a minimum; aim for AAA where feasible
- Follow the four WCAG principles: **Perceivable, Operable, Understandable, Robust** (POUR)
- Test with real users who have disabilities, not just automated tools
- All accessibility features are discoverable in-game without external documentation

---

## 8.2. Visual Accessibility

### 8.2.1. Colour & Contrast
- All text elements meet 4.5:1 contrast ratio minimum (AA); 7:1 for body text (AAA)
- No information conveyed by colour alone: always pair colour with shape, icon, or text label
- Built-in colour themes:
  - **Default**: Cyberpunk dark (high contrast by design)
  - **High Contrast**: WCAG AAA compliant, maximum legibility
  - **Deuteranopia**: optimised for red-green colour blindness
  - **Protanopia**: optimised for red deficiency
  - **Tritanopia**: optimised for blue-yellow colour blindness
  - **Monochrome**: full greyscale for maximum compatibility

### 8.2.2. Text & Typography
- All text is selectable and scalable (no text baked into images)
- Font size: UI baseline 16px; scalable from 80% to 200% without layout breaks
- Line spacing: minimum 1.5× line-height for body text
- Dyslexia-friendly font option: **OpenDyslexic** available as an alternative typeface
- Text spacing: user-adjustable letter spacing, word spacing, and paragraph spacing

### 8.2.3. Motion & Animation
- Respect `prefers-reduced-motion` OS setting: all non-essential animations disabled automatically
- In-game toggle: "Reduced Motion" in Accessibility settings — disables scanlines, glitch effects, parallax, and screen shake
- No content is conveyed solely through animation; static fallbacks always exist
- Flashing content: no content flashes more than 3 times per second (photosensitivity safe)

### 8.2.4. Zoom & UI Scaling
- Full UI scale slider: 75% – 200% in 5% increments
- Individual element scaling: override specific UI regions (e.g., larger network map, smaller chat)
- Support for OS-level zoom (no clipping or overflow at 200% browser/OS zoom)

---

## 8.3. Auditory Accessibility

### 8.3.1. Subtitles & Captions
- All voiced dialogue: subtitles on by default (auto-on if system has no audio output)
- Captions: include non-speech sounds (e.g., "[ALERT KLAXON]", "[KEYBOARD CLICKING]")
- Caption settings: font size, background opacity, position (top/bottom/custom), text colour
- Subtitle sync: < 100ms delay from audio playback

### 8.3.2. Visual Alerts for Audio Cues
- Trace alert: visual pulse on the entire screen edge + trace meter animation (not just audio alarm)
- Incoming message: animated envelope icon + taskbar flash (not just sound)
- All audio cues have a visual equivalent — the game is fully playable with audio off

### 8.3.3. Volume Controls
- Separate sliders: Master, Music, SFX, Ambient, Voice, UI
- Mute toggles for each channel
- Mono audio option (combines left/right channels — useful for single-ear hearing loss)

---

## 8.4. Motor Accessibility

### 8.4.1. Full Keyboard Navigation
- Every UI element is reachable and operable via keyboard alone
- Tab order follows visual layout top-to-bottom, left-to-right
- Focus indicators: high-visibility glowing outlines (not just browser default)
- Skip-navigation: `Tab` from any window header jumps to its first interactive element

### 8.4.2. Remappable Controls
- Every keybinding is remappable via Settings → Controls
- Support for single-switch scanning navigation
- Gamepad: full controller support with button remapping
- Mouse: left/right click roles swappable; scroll direction reversible

### 8.4.3. Input Assistance
- Click/tap target minimum size: 44×44px for all interactive elements
- Drag tolerances: drag operations have a configurable dead-zone to prevent accidental moves
- Sticky keys / toggle keys: modifier keys can be made sticky (hold vs. repeated press)
- Auto-repeat rate: configurable delay and repeat rate for held keys
- Slow/switch input modes: for players who need single-switch or dwell-click navigation

### 8.4.4. Timed Events
- All timed missions have an "Accessibility Mode" option to pause the timer while reading
- Configurable time multipliers: 0.5×, 0.75×, 1×, 1.5×, 2× for mission timers
- No game-over screens for timed failures by default (configurable); instead, contextual consequences

---

## 8.5. Cognitive Accessibility

### 8.5.1. Onboarding & Tutorials
- Skippable at any point; resumable from Settings → Tutorials
- Step-by-step tutorials with visual highlights, animated arrows, and dismissible tooltips
- "What should I do?" always-available hint system (press `H` at any time)
- Simplified language mode: shorter sentences, simpler vocabulary in all UI text

### 8.5.2. Difficulty & Pacing
- Narrative-only mode: no combat or time pressure — experience the story without fail states
- Auto-save every action (configurable — some players prefer checkpoints only)
- Mission retry: always available without penalty in Story mode
- Information persistence: anything mentioned in a mission brief is saved to the in-game codex

### 8.5.3. Memory & Orientation Aids
- In-game codex: searchable database of all discovered lore, contacts, corporations, and missions
- Mission tracker: always-visible sidebar with current objectives and progress
- Network breadcrumbs: always shows the path taken through a network with back-navigation
- Progress indicators: clear before/after states for all objectives

---

## 8.6. Screen Reader Support

### 8.6.1. ARIA & Semantic HTML
- All custom components use correct ARIA roles (`dialog`, `listbox`, `tree`, `grid`, `status`, etc.)
- `aria-live` regions for dynamic content: trace meter, in-game notifications, chat messages
- `aria-label` on all icon-only buttons; `aria-describedby` for complex UI elements
- Focus management: modal dialogs trap focus; focus returns to trigger element on close

### 8.6.2. Screen Reader Testing Matrix
- Windows: NVDA + Firefox, JAWS + Chrome
- macOS/iOS: VoiceOver + Safari
- Android: TalkBack + Chrome
- Test every new UI component in all four environments before merge

### 8.6.3. Screen Reader Game Mode
- Dedicated "Screen Reader Mode" in Accessibility settings that:
  - Enables verbose announcements for all game state changes
  - Provides text descriptions of network map topology and node states
  - Converts hacking mini-games from visual to text/audio-based interaction
  - Reads out mission progress and trace level on a configurable interval

---

## 8.7. Localisation Pipeline

### 8.7.1. Internationalisation (i18n) Architecture
- All user-facing strings externalised to JSON locale files — zero hard-coded strings in components
- Framework: `react-i18next` + `i18next` for React components; custom Lua binding for mod scripts
- Locale identifiers: BCP 47 tags (e.g., `en-GB`, `fr-FR`, `zh-Hans`, `pt-BR`)
- Plural rules: `i18next` handles all plural forms per locale (including complex rules for Polish, Arabic, etc.)
- Date/time/number formatting: `Intl` API throughout — no manual formatting

### 8.7.2. Locale File Structure
```
/libs/assets/locales/
├── en/
│   ├── common.json      # Shared UI labels, buttons, generic text
│   ├── missions.json    # Mission titles, briefings, outcomes
│   ├── tools.json       # Tool names, descriptions
│   ├── narrative.json   # Story text, dialogue, email content
│   └── tutorial.json    # Tutorial text
├── fr/
│   └── ...
└── zh-Hans/
    └── ...
```

### 8.7.3. Translation Workflow
1. Developers write English strings with a unique key; never use raw string as key
2. Pre-commit hook flags new/missing keys in the English locale file
3. Translation files exported to Lokalise (or similar TMS) on each release branch
4. Professional translators work in the TMS; screenshots provided as context
5. Translated strings imported back and validated by bilingual QA testers
6. Machine translation (DeepL) used for initial drafts and community languages to reduce cost

### 8.7.4. Languages at Launch
| Language | Code | Status |
|----------|------|--------|
| English (UK) | en-GB | Master |
| English (US) | en-US | Variant |
| French | fr-FR | Professional |
| German | de-DE | Professional |
| Spanish (Spain) | es-ES | Professional |
| Brazilian Portuguese | pt-BR | Professional |
| Simplified Chinese | zh-Hans | Professional |
| Japanese | ja-JP | Professional |

### 8.7.5. Right-to-Left (RTL) Support
- Full RTL layout support for Arabic and Hebrew (future languages)
- CSS logical properties (`margin-inline-start` not `margin-left`) throughout
- RTL tested from day one even before RTL languages are added — prevents costly retrofitting

### 8.7.6. Cultural Localisation
- Text expansion: German and French strings are ~30–40% longer than English — all UI layouts tested with longest locale
- Currency: all prices shown in contextual currency (in-game credits are universal; real-money IAP uses device locale)
- Avoided culturally ambiguous symbols or idioms in master strings
- Character names: pool of culturally varied names for procedurally generated NPCs per locale

---

## 8.8. Accessibility Testing Protocol

### 8.8.1. Automated Testing
- `axe-core` integrated into the CI test suite: every UI component fails build if it introduces WCAG violations
- Colour contrast: `jest-color` checks all theme variables against WCAG thresholds
- Keyboard traps: automated test simulates Tab navigation through every screen

### 8.8.2. Manual & User Testing
- Quarterly accessibility audit by a specialist firm (e.g., Level Access, TPGi)
- Ongoing user research panel including players with visual, motor, auditory, and cognitive disabilities
- Bug reports tagged with `accessibility` label; P1 priority for any regression that removes previous access

### 8.8.3. Certification
- Target: IAAP CPWA certification for the accessibility programme
- Platform compliance: Sony, Microsoft, Nintendo, and Valve all have accessibility certification programmes — target all for console/Steam versions

---

This guide ensures the game is accessible and welcoming to all players worldwide. Next: Security, Privacy & Compliance — or request any section for immediate expansion.
