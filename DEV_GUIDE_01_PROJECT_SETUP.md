# 1. Project Setup & Tooling – Step-by-Step Guide

## Progress
| Section | Status | Notes |
|---------|--------|-------|
| 1.1 Environment & Prerequisites | ✅ Done | Node.js, pnpm, Git installed locally |
| 1.2 Repository Structure | ✅ Done | `/apps/web`, `/apps/desktop`, `/libs/ui`, `/libs/core` live; server/mobile not yet needed |
| 1.3 Version Control & Branching | ⬜ Not started | Not a git repo yet; no CI branch protection |
| 1.4 Coding Standards & Linting | ✅ Done | ESLint, Prettier, Husky, lint-staged, TypeScript strict |
| 1.5 CI/CD Pipeline | ⬜ Not started | No GitHub Actions yet |
| 1.6 Issue Tracking | ⬜ Not started | No project tracker set up |
| 1.7 Documentation & Onboarding | 🚧 Partial | 10 dev guides written; no hosted docs site |
| 1.8 Security & Compliance | ⬜ Not started | No Dependabot, secret scanning, or security policy |
| 1.9 Sustainability & Inclusion | ⬜ Not started | — |

---

This guide ensures a world-class, future-proof foundation for Uplink Next Generation. Every step is detailed for maximum quality, scalability, and developer experience.

---

## 1.1. Environment & Prerequisites
- Install Node.js (LTS), npm, and nvm for version management
- Install Git and configure SSH keys for repository access
- Install VS Code (recommended) with extensions: ESLint, Prettier, EditorConfig, GitLens, Docker, etc.
- Install Docker (for backend/microservices)
- Install pnpm or yarn (for monorepo support)
- (Optional) Install Godot/Unity if advanced 3D/VR is planned

## 1.2. Repository Structure
- Create a monorepo (e.g., with pnpm workspaces or Nx)
- Structure:
  - /apps/web (React/TypeScript frontend)
  - /apps/desktop (Electron wrapper)
  - /apps/mobile (Capacitor wrapper)
  - /apps/server (Node.js/Go/Python backend)
  - /libs/ui (shared UI components)
  - /libs/core (game logic, shared types)
  - /libs/assets (art, sound, localization)
  - /tools (scripts, CI/CD helpers)
  - /docs (documentation)

## 1.3. Version Control & Branching
- Initialize Git repository
- Set up .gitignore for all platforms
- Adopt trunk-based or GitHub Flow branching model
- Protect main branch, require PR reviews and CI checks
- Use semantic commit messages (Conventional Commits)

## 1.4. Coding Standards & Linting
- ESLint with Airbnb or custom ruleset
- Prettier for code formatting
- EditorConfig for consistent editor settings
- Husky + lint-staged for pre-commit hooks
- TypeScript strict mode everywhere

## 1.5. CI/CD Pipeline
- Use GitHub Actions, GitLab CI, or similar
- Steps:
  - Install dependencies
  - Lint, type-check, and test
  - Build for all targets (web, desktop, mobile)
  - Run e2e and integration tests
  - Deploy to preview/staging environments
  - (Optional) Docker build and push for backend
- Use Dependabot or Renovate for dependency updates

## 1.6. Issue Tracking & Project Management
- Use GitHub Projects, Linear, or Jira
- Define epics, milestones, and sprints
- Use labels for priority, type, and status
- Link PRs to issues for traceability
- Enable Discussions for community input

## 1.7. Documentation & Onboarding
- Use Markdown for all docs, store in /docs
- Set up Docusaurus or similar for a documentation site
- Write onboarding guides for new contributors
- Document architecture, coding standards, and workflows
- Add codebase diagrams (e.g., Mermaid, PlantUML)

## 1.8. Security & Compliance
- Enable branch protection and required reviews
- Set up secret scanning and Dependabot alerts
- Add a security policy and responsible disclosure process
- Ensure all dependencies are license-compliant

## 1.9. Sustainability & Inclusion
- Document green hosting and low-power options
- Add a code of conduct and diversity statement
- Ensure accessibility in all developer tools and docs

---

This foundation ensures a world-class, scalable, and maintainable codebase. Next: UI/UX Foundation, or request any section for immediate expansion!