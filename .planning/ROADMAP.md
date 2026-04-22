# Roadmap: corsiriccardo.github.io Portfolio Revamp

## Overview

Three phases turn a blank repo into a deployed carta-invecchiata portfolio: first lock the design
system and HTML shell so every subsequent pixel has a consistent foundation; then build all visible
content sections so the site communicates Riccardo's identity in full; finally layer in animations,
run quality checks, and verify the live GitHub Pages deployment.

## Phases

- [x] **Phase 1: Foundation & Shell** - Establish design tokens, typography, paper texture, and the semantic HTML skeleton before any content is written
- [x] **Phase 2: Core Content** - Build every visible section (hero, projects, about, timeline, contact) against the validated foundation
- [ ] **Phase 3: Polish & Ship** - Add scroll reveal and hover animations, audit performance, and verify the live deployment

## Phase Details

### Phase 1: Foundation & Shell
**Goal**: The design system and HTML structure are in place so that every content section in Phase 2 has correct tokens, fonts, and layout to render into.
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, LAYOUT-01, LAYOUT-02, LAYOUT-03, LAYOUT-04, LAYOUT-05
**Success Criteria** (what must be TRUE):
  1. Opening `index.html` in a browser shows the warm cream (#F5F0E8 range) background with visible paper grain and Cormorant Garamond/Lora fonts loaded — no system fonts, no white flash
  2. Sticky navigation renders at all viewport widths with no horizontal scrollbar; scrolling to any section highlights the corresponding nav link
  3. Sharing the page URL on a Slack/LinkedIn preview renders the correct OG title, description, and image
  4. All asset filenames are lowercase; the site loads without 404s on a case-sensitive server (GitHub Pages)
**Plans**: 4 plans
Plans:
- [x] 01-01-PLAN.md — CSS design system (tokens, reset, base, layout, components, animations)
- [x] 01-02-PLAN.md — Asset generation (fonts WOFF2, paper texture, OG image, favicons)
- [x] 01-03-PLAN.md — index.html semantic shell + js/nav.js Intersection Observer
- [x] 01-04-PLAN.md — Browser verification and requirement sign-off
**UI hint**: yes

### Phase 2: Core Content
**Goal**: All five content sections are visible, populated with real copy, and readable on any device.
**Depends on**: Phase 1
**Requirements**: HERO-01, HERO-02, PROJ-01, PROJ-02, PROJ-03, ABOUT-01, TIME-01, CONTACT-01
**Success Criteria** (what must be TRUE):
  1. A visitor landing on the page can read Riccardo's name, title, tagline, and a single clear CTA within the first viewport — no scrolling required
  2. The projects section shows 1–3 cards each containing a problem statement, technical highlight, outcome, tech tags, and a working GitHub link; card data loads from `data/projects.json`
  3. The about section conveys Riccardo's stack and role in plain text with no progress bars; the timeline lists work experience in reverse-chronological order with outcomes, not duty lists
  4. The contact section presents email and LinkedIn as clear CTAs (not icon rows) and both links open the correct destination
**Plans**: TBD
**UI hint**: yes

### Phase 3: Polish & Ship
**Goal**: Animations enhance the editorial feel without harming performance or accessibility, and the site passes a Lighthouse audit on the live GitHub Pages URL.
**Depends on**: Phase 2
**Requirements**: ANIM-01, ANIM-02, ANIM-03
**Success Criteria** (what must be TRUE):
  1. Content sections animate in on scroll (opacity + translateY) and the animation fires only once per element; disabling animations in OS accessibility settings removes all motion
  2. Hovering project cards and interactive links produces a subtle CSS transition (no JS, no layout shift)
  3. Lighthouse on the live `corsiriccardo.github.io` URL scores Performance >= 90 with LCP < 1.5 s, CLS = 0, and TBT = 0; the page is fully readable on a physical mobile device at 375 px width
**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Shell | 4/4 | Complete | 2026-04-21 |
| 2. Core Content | 5/5 | Complete | 2026-04-22 |
| 3. Polish & Ship | 0/? | Not started | - |
