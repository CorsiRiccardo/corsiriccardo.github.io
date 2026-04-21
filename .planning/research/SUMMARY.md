# Research Summary — corsiriccardo.github.io Portfolio Revamp

**Synthesized:** 2026-04-21
**Source files:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md
**Overall confidence:** HIGH

---

## Executive Summary

This is a static personal portfolio hosted on GitHub Pages, targeting recruiters and collaborators. The design concept — "carta invecchiata" (aged paper) — is the primary differentiator: warm cream tones, strong serif typography, and restrained editorial animation set it apart from generic developer portfolios without requiring heavy engineering. The implementation is deliberately minimal: vanilla HTML5, CSS3 with custom properties, and ES modules. No build step, no framework, no package.json.

The recommended approach prioritizes visual identity and content quality over feature breadth. A well-executed carta aesthetic with three to four strong project descriptions will outperform a feature-rich but generic site. The risk profile is low — the primary failure modes are content-level (vague project descriptions, broken links) rather than technical.

One resolved technical conflict: STACK.md recommends SVG feTurbulence for paper grain texture; PITFALLS.md identifies this as a per-frame CPU repaint trap on scroll that destroys frame rate on mid-range mobile. **Resolved in favor of PITFALLS.md: use a pre-rendered static PNG/WebP noise tile tiled via background-repeat.** This decision must be made before any other CSS is written.

---

## Key Stack Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Typography (display) | Cormorant Garamond 400/600 | Best match for carta aesthetic; distinctive vs overused Playfair |
| Typography (body) | Lora 400/500/600 | Calligraphic curves; optimized for screen readability |
| Font delivery | Self-host WOFF2 | Eliminates render-blocking Google Fonts cross-origin requests and tracking |
| Paper texture | Static PNG/WebP noise tile (~200×200px) | One-time paint; no per-frame repaint — NOT SVG feTurbulence |
| Scroll reveal | Intersection Observer ~20 lines vanilla JS | No library needed; CSS animates, JS only toggles a class |
| Icons | Inline SVG (Heroicons/Feather) | Removes FontAwesome CDN dependency |
| Animation library | None | 20-line vanilla pattern is sufficient at this scale |
| CSS structure | tokens.css + component files + @layer | Split by responsibility; @layer eliminates specificity conflicts |
| Project cards | Text + tech tags + GitHub links only | No screenshots at launch per project decision |
| Data | Hardcoded HTML first, migrate to projects.json later | Avoids observer re-registration complexity until actually needed |

---

## Table Stakes Features (ship at launch)

1. Hero: name, role, concrete specialty tagline, single CTA (not multiple competing CTAs)
2. About: professional only — stack as plain tags, 3–4 sentences max, no personal fluff
3. Projects: 3–4 curated entries — title, 1-sentence problem framing, tech tags, GitHub link
4. Work experience timeline: reverse-chronological, outcomes over duties
5. Contact: email + LinkedIn + GitHub profile, CTA visible in nav (not only at page bottom)
6. Foundation: semantic HTML, WCAG AA contrast (~9:1 body text on #F5F0E8), OG tags, responsive, favicon

**Defer without regret:** JSON-LD schema, featured/other split, screenshots, testimonials.

**Anti-features to exclude:** skills bars, blog with no posts, dark mode, loading screen, tutorial projects, multiple hero CTAs.

---

## Top 5 Pitfalls to Avoid

| # | Pitfall | Prevention |
|---|---------|------------|
| 1 | SVG feTurbulence as full-page texture — per-frame CPU repaint | Static PNG/WebP tile via background-repeat; never feTurbulence at viewport scale |
| 2 | Google Fonts CDN blocks render, causes FOIT | Self-host WOFF2 with font-display: swap; preload 1–2 critical weights |
| 3 | Vague project descriptions (tech list, no outcome) | Write descriptions before building card UI: problem + approach + result in 2–3 sentences |
| 4 | Warm palette + grain layer drops below WCAG 4.5:1 | Run contrast checker on every color pair with texture applied; target ~9:1 body text |
| 5 | Scroll reveal animating layout properties (margin, height) | Animate only transform + opacity; include prefers-reduced-motion media query |

Operational note: GitHub Pages runs on Linux — file paths are case-sensitive. All filenames must be lowercase with hyphens. Verify live URL in a fresh private tab after every deploy.

---

## Recommended Build Order

**Phase 1 — Foundation**
tokens.css + reset.css + base.css (paper background via PNG tile, not feTurbulence), self-hosted WOFF2 fonts, WCAG contrast verification on all color pairs. Every later phase depends on this being correct.
- Research flag: NONE (well-documented patterns)

**Phase 2 — HTML Shell and Layout**
index.html skeleton (all five sections with IDs), layout.css (responsive grid, vertical rhythm), sticky nav with Intersection Observer active-link, OG meta tags + favicon, lowercase filename convention locked in.
- Research flag: NONE

**Phase 3 — Hero and Projects (highest-value sections first)**
Write all project descriptions before building card UI. Hero section (name, role, concrete tagline, single CTA). Projects section (text + tech tags + GitHub links, hardcoded HTML). Validate card design against real content length.
- Research flag: NONE

**Phase 4 — About, Timeline, Contact**
About (professional only, plain tech tags), work experience timeline (CSS-only with ::before border trick, outcomes over duties), contact section, ensure contact link appears in nav.
- Research flag: NONE

**Phase 5 — Animations and Polish**
Scroll reveal (transform + opacity only, prefers-reduced-motion respected), hover states (card lift, nav underline draw), mobile QA on actual device, Lighthouse audit (target LCP < 1.5s, CLS = 0, TBT = 0), GitHub Pages case-sensitivity check.
- Research flag: NONE

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified against MDN, caniuse, Google Fonts, GitHub Pages docs |
| Features | MEDIUM-HIGH | Recruiter behavior data from community sources; no first-party study |
| Architecture | HIGH | Standard patterns for this scale; all browser APIs verified |
| Pitfalls | HIGH | Cross-referenced STACK.md vs PITFALLS.md; texture conflict resolved |

**Gaps to resolve before/during Phase 1:**
- Exact WOFF2 subset size after Latin-only subsetting (estimate 40–80KB total; confirm with actual files)
- PNG noise tile generation method (Figma export, magick command, or pre-made tile — decide in Phase 1)
- Confirm project count: PROJECT.md says 1–3, FEATURES.md recommends minimum 3–4 for credibility; resolve before Phase 3 content writing

---

## Sources (aggregated)

MDN Web Docs (feTurbulence, Intersection Observer, ES Modules) · caniuse.com (animation-timeline scroll: 84.7% April 2026) · Google Fonts (Cormorant Garamond, Lora) · Typewolf editorial font recommendations · Frontend Masters Blog: Grainy Gradients · Smashing Magazine: CSS Cascade Layers 2025 · DebugBear: font and image performance · GitHub Pages Docs · DEV Community: recruiter behavior 2025 · motion.dev: animation performance tier list · Codrops: SVG feTurbulence effects
