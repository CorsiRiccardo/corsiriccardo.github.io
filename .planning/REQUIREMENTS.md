# Requirements — corsiriccardo.github.io Portfolio Revamp

## v1 Requirements

### Foundation (FOUND)

- [ ] **FOUND-01**: CSS design token system established as custom properties (`tokens.css`) — colors, spacing, type scale, carta invecchiata palette (cream/ivory #F5F0E8 range)
- [ ] **FOUND-02**: Cormorant Garamond (display/headings) + Lora (body) fonts self-hosted as WOFF2 with `font-display: swap` — eliminates Google Fonts render-blocking and tracking
- [ ] **FOUND-03**: Paper texture implemented as a static pre-rendered PNG noise tile on `body::before` (`position: fixed`, `z-index: 9999`, `pointer-events: none`, `opacity ~0.035`) — not live SVG feTurbulence
- [ ] **FOUND-04**: WCAG AA contrast (4.5:1 minimum) verified for all body text on the warm cream + texture background
- [ ] **FOUND-05**: CSS `@layer` architecture: `tokens → reset → base → layout → components → animations`

### Layout & Shell (LAYOUT)

- [ ] **LAYOUT-01**: Single `index.html` with semantic HTML5 structure (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`)
- [ ] **LAYOUT-02**: Sticky top navigation with smooth scroll to all page sections; active section highlighted via second Intersection Observer
- [ ] **LAYOUT-03**: Fully responsive layout, mobile-first, no horizontal scroll at any viewport width
- [ ] **LAYOUT-04**: All asset filenames lowercase (GitHub Pages runs Linux — case mismatch causes 404 in production)
- [ ] **LAYOUT-05**: Open Graph meta tags (`og:title`, `og:description`, `og:image`, `og:url`) and responsive viewport meta

### Hero (HERO)

- [ ] **HERO-01**: Prominent hero section with name (Riccardo Corsi), professional title, and a brief tagline that communicates value
- [ ] **HERO-02**: Single clear CTA linking to the projects section or contact section — not multiple competing buttons

### Projects (PROJ)

- [ ] **PROJ-01**: Projects section with 1–3 project cards; layout: text + tech stack tags + GitHub link (no images at launch)
- [ ] **PROJ-02**: Each project card contains a problem statement, what was technically interesting, and outcome — not just a tech list
- [ ] **PROJ-03**: Project data stored in `data/projects.json`, loaded via `fetch()` — decouples content from HTML

### About (ABOUT)

- [ ] **ABOUT-01**: Professional about section covering stack, role, and what Riccardo builds — no personal anecdotes, no skills progress bars

### Timeline (TIME)

- [ ] **TIME-01**: Work experience timeline extracted from CV, compact and readable — displayed inline on the page (not a downloadable file)

### Contact (CONTACT)

- [ ] **CONTACT-01**: Contact section with email link (`mailto:`) and LinkedIn URL — styled as a clear CTA, not an icon row

### Animations (ANIM)

- [ ] **ANIM-01**: Scroll reveal via Intersection Observer — elements animate in with `opacity` + `translateY` transition; observer unregistered after first trigger
- [ ] **ANIM-02**: Hover effects on project cards and interactive links — CSS transitions only (`transform`, `opacity`, `border-color`)
- [ ] **ANIM-03**: `@media (prefers-reduced-motion: reduce)` — all animations stripped for users who need it

---

## v2 Requirements (Deferred)

- Lightbox for project screenshots — no images at launch, add later when assets are ready
- Downloadable CV PDF — user sends separately; may add in future
- Filter/sort for projects by category — not needed with 1–3 projects
- Dark mode — conflicts with carta invecchiata aesthetic; reconsidered only if user changes direction
- Blog / writing section — out of stated scope

---

## Out of Scope

- Contact form — no backend; static site constraint; email link achieves same goal
- Italian/bilingual toggle — English only for international reach
- Framework (React/Vue/Astro) — vanilla HTML/CSS/JS is sufficient; no build step needed
- Skills progress bars — universally recognized as meaningless; replaced by plain tech tags
- Icon libraries (FontAwesome CDN) — replaced with inline SVG for the few icons needed
- Live SVG `feTurbulence` texture — performance trap on mobile; PNG tile used instead

---

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| FOUND-05 | Phase 1 | Pending |
| LAYOUT-01 | Phase 1 | Pending |
| LAYOUT-02 | Phase 1 | Pending |
| LAYOUT-03 | Phase 1 | Pending |
| LAYOUT-04 | Phase 1 | Pending |
| LAYOUT-05 | Phase 1 | Pending |
| HERO-01 | Phase 2 | Pending |
| HERO-02 | Phase 2 | Pending |
| PROJ-01 | Phase 2 | Pending |
| PROJ-02 | Phase 2 | Pending |
| PROJ-03 | Phase 2 | Pending |
| ABOUT-01 | Phase 2 | Pending |
| TIME-01 | Phase 2 | Pending |
| CONTACT-01 | Phase 2 | Pending |
| ANIM-01 | Phase 3 | Pending |
| ANIM-02 | Phase 3 | Pending |
| ANIM-03 | Phase 3 | Pending |
