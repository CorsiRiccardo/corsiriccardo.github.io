# corsiriccardo.github.io — Project Guide

## Project Context

Personal professional portfolio for Riccardo Corsi, hosted on GitHub Pages.
Full revamp to a carta invecchiata (warm paper) aesthetic — vanilla HTML/CSS/JS, no build step.

See `.planning/PROJECT.md` for full context and requirements.
See `.planning/ROADMAP.md` for phase structure and success criteria.
See `.planning/STATE.md` for current progress.

## GSD Workflow

This project uses the GSD (Get Shit Done) planning system.

**Current phase:** Phase 1 — Foundation & Shell

**Commands:**
- `/gsd-plan-phase 1` — Plan Phase 1 tasks
- `/gsd-progress` — Show current status
- `/gsd-discuss-phase 1` — Discuss approach before planning

**Never skip phases.** Each phase's success criteria must pass before starting the next.

## Stack

- Vanilla HTML5 / CSS3 / JavaScript ES modules
- No build step, no framework, no bundler
- Deployed to GitHub Pages (master branch → auto-deploy)

## Key Technical Decisions

- **Typography**: Cormorant Garamond (headings) + Lora (body) — self-hosted WOFF2, not Google Fonts CDN
- **Paper texture**: Static PNG noise tile on `body::before` — NOT live SVG feTurbulence (performance trap)
- **Scroll reveal**: Native Intersection Observer, ~20 lines JS — no library
- **CSS architecture**: `@layer` (tokens → reset → base → layout → components → animations)
- **File structure**: Split CSS by section, single `index.html`, data in `data/projects.json`

## Critical Rules

- All asset filenames **must be lowercase** — GitHub Pages runs Linux (case-sensitive)
- No Google Fonts CDN — self-host WOFF2 only
- Animate only `opacity` and `transform` — never layout properties (causes reflow)
- Always include `@media (prefers-reduced-motion: reduce)` on any animation
- Verify WCAG AA contrast (4.5:1) on the warm cream background with texture overlay applied
