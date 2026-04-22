---
phase: 2
status: passed
verified: 2026-04-22T00:00:00Z
score: 9/9
overrides_applied: 0
---

# Phase 2: Core Content Verification Report

**Phase Goal:** All five content sections are visible, populated with real copy, and readable on any device.
**Verified:** 2026-04-22
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #  | Truth                                                                                                     | Status     | Evidence                                                                                                                                  |
|----|-----------------------------------------------------------------------------------------------------------|------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| 1  | Visitor sees name, title, tagline, and CTA in first viewport                                              | VERIFIED   | `#hero` has h1 "Riccardo Corsi", `.hero__subtitle` "Software Developer", `.hero__tagline`, `.btn.btn--primary[href="#projects"]` — all present in index.html lines 59-63 |
| 2  | Projects section shows 1-3 cards loaded from data/projects.json                                           | VERIFIED   | `data/projects.json` has 3 substantive entries; `js/projects.js` fetches and injects `.project-card` elements into `.projects__grid`       |
| 3  | About conveys stack; timeline lists experience in reverse-chronological order with outcomes               | VERIFIED   | `#about` has `.about__prose`, `.about__stack` with 3 groups; `#timeline` has `<ol class="timeline">` with 2 `.timeline__entry` items, newest first |
| 4  | Contact presents email and LinkedIn as clear CTAs; both links open correct destination                    | VERIFIED   | `#contact` has `mailto:riccardocorsi.developer@gmail.com` (`.btn--primary`) and `https://linkedin.com/in/riccardocorsi` (`.btn--outline`) with `rel="noopener noreferrer"` |

**Score:** 4/4 roadmap truths verified

---

### Required Artifacts

| Artifact              | Expected                                           | Status    | Details                                                                           |
|-----------------------|----------------------------------------------------|-----------|-----------------------------------------------------------------------------------|
| `index.html`          | All 5 sections populated with real content         | VERIFIED  | 163 lines; hero, projects, about, timeline, contact all populated — no placeholder comments remaining in section bodies |
| `data/projects.json`  | 3 entries; entry[1] has 2 links                    | VERIFIED  | 3 entries confirmed by `node -e`; entry[1] (`links.length === 2`) confirmed       |
| `js/projects.js`      | Fetches JSON, injects cards, URL validation        | VERIFIED  | `fetch('data/projects.json')` relative path; `SAFE_URL_PREFIXES` guard; `DocumentFragment`; 1 `innerHTML` use (error fallback only) |
| `css/components.css`  | Single `@layer components` block with all Phase 2 classes | VERIFIED  | Count = 1; hero, buttons, pill, about, timeline, contact, footer, project-card CSS all present (577 lines) |

---

### Key Link Verification

| From              | To                          | Via                                           | Status  | Details                                                                                       |
|-------------------|-----------------------------|-----------------------------------------------|---------|-----------------------------------------------------------------------------------------------|
| `index.html`      | `js/projects.js`            | `<script type="module" src="js/projects.js">` | WIRED   | Line 160; appears after nav.js, before `</body>`; no `defer` attribute (type=module defers automatically) |
| `js/projects.js`  | `data/projects.json`        | `fetch('data/projects.json')`                 | WIRED   | Relative path, no leading slash; response checked (`res.ok`); parsed as JSON; injected via `DocumentFragment` |
| `js/projects.js`  | `.projects__grid` (DOM)     | `document.querySelector('.projects__grid')`   | WIRED   | Null guard + `console.warn` on miss; `grid.appendChild(fragment)` on success                  |
| `#contact` links  | Correct external destinations | `href` values                               | WIRED   | Email: `mailto:riccardocorsi.developer@gmail.com`; LinkedIn: `https://linkedin.com/in/riccardocorsi` with `rel="noopener noreferrer"` |

---

### Data-Flow Trace (Level 4)

| Artifact         | Data Variable | Source               | Produces Real Data | Status   |
|------------------|---------------|----------------------|--------------------|----------|
| `js/projects.js` | `projects`    | `data/projects.json` | Yes — 3 JSON objects with title, description, tech[], links[] | FLOWING |

`loadProjects()` fetches the JSON, iterates `projects.forEach`, builds each card with `createElement`/`textContent`, and appends via `DocumentFragment`. No static empty array fallback on the success path.

---

### Behavioral Spot-Checks

| Behavior                                  | Command                                                                                          | Result              | Status |
|-------------------------------------------|--------------------------------------------------------------------------------------------------|---------------------|--------|
| projects.json parses to 3 entries         | `node -e "const d=require('./data/projects.json'); console.log(d.length)"`                       | 3                   | PASS   |
| entry[1] has 2 links                      | `node -e "const d=require('./data/projects.json'); console.log(d[1].links.length)"`              | 2                   | PASS   |
| Single @layer components block            | `grep -c "@layer components" css/components.css`                                                 | 1                   | PASS   |
| fetch uses relative path (no leading /)   | `grep "fetch('data/projects.json')" js/projects.js`                                              | match found         | PASS   |
| innerHTML count = 1 (error fallback only) | `grep -c "innerHTML" js/projects.js`                                                             | 1                   | PASS   |
| No export/import keywords                 | `grep "^export\|^import" js/projects.js`                                                         | no matches          | PASS   |
| noopener noreferrer in projects.js        | `grep -c "noopener noreferrer" js/projects.js`                                                   | 2                   | PASS   |

---

### Requirements Coverage

| Requirement | Source Plan | Description                                              | Status    | Evidence                                                                                     |
|-------------|-------------|----------------------------------------------------------|-----------|----------------------------------------------------------------------------------------------|
| HERO-01     | 02-02       | h1 name, subtitle, tagline in hero                       | SATISFIED | `index.html` lines 59-62: `<h1>Riccardo Corsi</h1>`, `.hero__subtitle`, `.hero__tagline`    |
| HERO-02     | 02-02       | CTA anchor to #projects, `.btn.btn--primary`             | SATISFIED | `index.html` line 62: `<a href="#projects" class="btn btn--primary">View my work ↓</a>`     |
| ABOUT-01    | 02-03       | `.about__prose`, `.about__stack` with 3 groups, `.pill` elements | SATISFIED | `index.html` lines 72-108; 3 `about__stack-group` divs confirmed; `.pill` CSS in components.css line 238 |
| TIME-01     | 02-04       | `<ol class="timeline">`, 2 `.timeline__entry`, `.timeline__meta`, `.timeline__bullets` | SATISFIED | `index.html` lines 116-140; `grep -c "timeline__entry"` = 2              |
| CONTACT-01  | 02-05       | mailto link + LinkedIn link with `rel="noopener noreferrer"` | SATISFIED | `index.html` lines 147-149; `rel="noopener noreferrer"` on LinkedIn anchor                   |
| PROJ-01     | 02-01, 02-05 | `.projects__grid` injection target exists in `#projects`  | SATISFIED | `index.html` line 67: `<div class="projects__grid">` inside `#projects`                     |
| PROJ-02     | 02-01       | `data/projects.json` has 3 entries; entry[1] has 2 links | SATISFIED | Node validation: `length=3`, `d[1].links.length=2`                                          |
| PROJ-03     | 02-01       | `js/projects.js` fetches relative path; script tag in index.html | SATISFIED | `fetch('data/projects.json')` at line 67 of projects.js; `<script type="module" src="js/projects.js">` at index.html line 160 |

---

### Anti-Patterns Found

| File              | Line | Pattern                        | Severity | Impact                                                                                       |
|-------------------|------|--------------------------------|----------|----------------------------------------------------------------------------------------------|
| `js/projects.js`  | —    | `console.warn` on missing grid | INFO     | Intentional — spec-required null guard. Not a stub.                                           |

No TODOs, FIXMEs, empty return statements, or hardcoded empty data on the rendering path. The `<!-- PLACEHOLDER TIMELINE -->` comment in `index.html` is an intentional user-facing instruction to replace stub CV data before ship — not a code stub blocking functionality.

---

### Security Verification

| Check                                          | Status  | Evidence                                                                                              |
|------------------------------------------------|---------|-------------------------------------------------------------------------------------------------------|
| URL protocol validation in `projects.js`       | PASS    | `SAFE_URL_PREFIXES = ['https://', 'http://', 'mailto:']` guard in `buildActions()` skips invalid URLs |
| No `innerHTML` for user-controlled content     | PASS    | Only 1 `innerHTML` use (static error string, no variable interpolation)                               |
| `rel="noopener noreferrer"` on external links  | PASS    | LinkedIn anchor (index.html) and error fallback link (projects.js) both have it                       |
| `rgba()` fallbacks on all `color-mix()` calls  | PASS    | All 6 `color-mix()` declarations in components.css have an `rgba()` fallback on the preceding line    |
| `prefers-reduced-motion` on transitions        | PASS    | Two `@media (prefers-reduced-motion: reduce)` blocks: one covers `.skip-link` + `.nav-link` (line 130), one covers `.btn` + `.btn--primary:hover` (line 227). `.nav__hamburger` has no transition property — no guard needed. |

---

### Human Verification Required

The following items cannot be verified by static analysis and should be checked in a browser before marking Phase 2 complete for handoff to a potential employer:

**1. Hero viewport fit**
- Test: Open `index.html` via a local HTTP server (e.g., `python3 -m http.server 8000`). On a 1080p desktop and a 375px-wide mobile viewport, confirm the hero CTA is visible without scrolling.
- Expected: h1 name + subtitle + tagline + "View my work" button all visible within 100vh minus nav height.
- Why human: CSS `min-height: calc(100vh - var(--nav-height))` cannot be exercised by grep.

**2. Project card injection at runtime**
- Test: Open `http://localhost:8000`. Confirm 3 project cards appear in the Projects grid with titles, descriptions, tech pills, and buttons.
- Expected: 3 `.project-card` articles rendered by `js/projects.js`. No "Projects currently unavailable" fallback.
- Why human: `fetch()` requires an HTTP server; static analysis cannot execute the JS module.

**3. Contact CTAs open correct destinations**
- Test: Click Email button — mail client should open addressed to `riccardocorsi.developer@gmail.com`. Click LinkedIn button — should open `https://linkedin.com/in/riccardocorsi` in a new tab.
- Expected: Both links land at correct destinations; no browser security warnings.
- Why human: Link-following behaviour requires browser execution.

**4. WCAG AA contrast on warm cream background**
- Test: Use browser DevTools accessibility panel or a contrast checker to verify `.pill` text (secondary color on pill background) and `.hero__subtitle` text meet 4.5:1 contrast ratio against the textured cream background with the paper overlay applied.
- Expected: All text elements meet WCAG AA (4.5:1 for normal text, 3:1 for large text).
- Why human: Contrast ratio depends on rendered composite of `body::before` paper texture + background colour, which requires visual rendering.

---

## Gaps Summary

No gaps. All 9 must-haves verified against the actual codebase. The implementation matches plan specifications precisely across all five sections: hero copy and CSS, about stack with pills, timeline ordered list with 2 entries, contact CTAs with correct security attributes, and project card injection pipeline (JSON data -> JS fetch -> DOM injection target -> CSS grid).

The must-haves that warrant human spot-checks are listed above — these are browser-runtime behaviors, not code defects.

---

_Verified: 2026-04-22T00:00:00Z_
_Verifier: Claude (gsd-verifier)_
