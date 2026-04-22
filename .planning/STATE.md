# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-21)

**Core value:** A visitor understands who Riccardo is as a developer and what he has built within 10 seconds of landing.
**Current focus:** Project complete — all 3 phases shipped

## Current Position

Phase: 3 of 3 (Polish & Ship) — COMPLETE
Plan: 2 of 2
Status: All phases complete — project shipped
Last activity: 2026-04-22 — Phase 3 complete (scroll reveal, hover transitions, Lighthouse 97, LCP 1.4s, CLS 0, TBT 0)

Progress: [██████████] 100%

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: —
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**
- Last 5 plans: —
- Trend: —

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Init: PNG/WebP noise tile chosen over SVG feTurbulence (per-frame repaint trap on mobile)
- Init: Fonts self-hosted as WOFF2 (eliminates Google Fonts render-blocking and tracking)
- Init: Vanilla HTML/CSS/JS — no build step, no framework, GitHub Pages compatible

### Pending Todos

None yet.

### Blockers/Concerns

- Project count to feature: PROJECT.md says 1-3; research recommends minimum 3-4 for credibility — resolve before Phase 2 content writing

### Resolved (Phase 1 Research)

- WOFF2 subset size: ~67KB total (CG-400 ≈22.9KB, CG-600 ≈23.4KB, Lora-400 ≈21.1KB) — Latin-only subset from Google Fonts gstatic CDN, committed to assets/fonts/
- PNG noise tile: generated via pure Node.js script (no ImageMagick needed) — raw PNG encoder, 200×200px grayscale noise, tileable

## Deferred Items

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| *(none)* | | | |

## Session Continuity

Last session: 2026-04-22
Stopped at: Project complete — all 3 phases shipped to https://corsiriccardo.github.io
Resume file: n/a
