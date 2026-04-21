# corsiriccardo.github.io — Portfolio Revamp

## What This Is

Personal professional portfolio for Riccardo Corsi, a programmer, hosted on GitHub Pages.
The site replaces the existing one from scratch with a cleaner identity: a paper-inspired design
that communicates competence and character without noise. Audience is recruiters and collaborators.

## Core Value

A visitor should understand who Riccardo is as a developer and what he's built within 10 seconds of landing.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Hero section with professional intro (name, title, brief tagline)
- [ ] About section: professional focus only — stack, what he does, no personal fluff
- [ ] Projects section showcasing web apps and CLI tools/libraries with GitHub links
- [ ] Work experience timeline, clean and readable
- [ ] Contact section with email and LinkedIn
- [ ] "Carta invecchiata" visual style — warm cream/ivory tones, subtle paper texture, strong typography hierarchy
- [ ] Scroll reveal animations (elements appear gently on scroll)
- [ ] Hover effects on cards and interactive elements — always subtle
- [ ] Fully static site, no backend, deployable directly on GitHub Pages
- [ ] English language throughout

### Out of Scope

- Contact form — no backend available; email link is sufficient
- Italian/bilingual toggle — English only for international reach
- Blog or writing section — not mentioned, adds complexity
- Dark mode — conflicts with the paper aesthetic
- Framework (React/Vue/Astro) — vanilla HTML/CSS/JS is sufficient and simpler to deploy

## Context

- Repo: `corsiriccardo.github.io` (GitHub Pages, auto-deployed from master)
- Existing site: vanilla HTML/CSS/JS with Poppins font, FontAwesome icons — all to be replaced
- The "carta invecchiata" aesthetic means: cream/ivory background (#F5F0E8 range), warm shadows,
  possibly a subtle paper-grain texture via CSS or SVG filter, serif or mixed serif/sans typography
- Animations should feel editorial, not flashy — CSS transitions and Intersection Observer for scroll reveal
- Projects to feature: web apps (with screenshots/demo links) and CLI tools/libraries (GitHub links, brief description)

## Constraints

- **Deployment**: GitHub Pages static only — no server-side code, no Node at runtime
- **Performance**: No heavy frameworks; CSS animations preferred over JS libraries
- **Stack**: Vanilla HTML5, CSS3 (custom properties, grid, flexbox), vanilla JS (ES modules)
- **Assets**: Fonts via Google Fonts (or self-hosted for privacy), no icon library dependency if avoidable

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vanilla HTML/CSS/JS | No build step, GitHub Pages compatible, sufficient for static portfolio | — Pending |
| Carta invecchiata style | User requested: warm tones, artisanal feel, paper texture | — Pending |
| English only | Broader audience, recruiter-friendly | — Pending |
| No contact form | Static site constraint; email link achieves same goal | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-21 after initialization*
