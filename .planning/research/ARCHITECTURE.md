# Architecture Patterns

**Domain:** Personal developer portfolio — static, vanilla HTML/CSS/JS, GitHub Pages
**Researched:** 2026-04-21
**Confidence:** HIGH (all patterns verified against current browser APIs and community practice)

---

## Recommended Architecture

Single-page application in the classical sense: one `index.html`, sections stacked vertically, smooth-scroll navigation. All sections live in the same document. No routing, no SPA framework needed.

**Verdict on single-page vs multi-page:** Single page. Rationale below.

---

## File Structure (Recommended Directory Tree)

```
corsiriccardo.github.io/
├── index.html                  # Entry point — all sections, no inline CSS/JS
├── assets/
│   ├── fonts/                  # Self-hosted WOFF2 (privacy, no Google Fonts latency)
│   ├── images/
│   │   ├── headshot.jpg
│   │   └── projects/           # One image per project card
│   └── icons/                  # Inline SVG preferred; fallback PNGs here
├── css/
│   ├── tokens.css              # CSS custom properties: colors, spacing, typography scale
│   ├── reset.css               # Minimal modern reset (box-sizing, margin-0, etc.)
│   ├── base.css                # Body, typography defaults, paper texture pseudo-element
│   ├── layout.css              # Section wrappers, grid, max-width containers
│   ├── components/
│   │   ├── nav.css
│   │   ├── hero.css
│   │   ├── about.css
│   │   ├── projects.css        # Card grid, hover states
│   │   ├── timeline.css        # Work experience timeline
│   │   └── contact.css
│   └── animations.css          # .reveal class, @keyframes, scroll-reveal states
├── js/
│   ├── main.js                 # type="module" entry — imports and initializes everything
│   ├── scroll-reveal.js        # IntersectionObserver wiring for .reveal elements
│   ├── nav.js                  # Active link highlighting, mobile hamburger (if needed)
│   └── projects.js             # Fetch data/projects.json and render cards (optional)
├── data/
│   └── projects.json           # Project metadata: title, description, tags, links, image
└── .planning/                  # (already exists — not shipped)
```

**Why this layout over a single-file monolith:**
- CSS split by responsibility makes it trivial to iterate on one section without touching others
- JS modules stay under 100 lines each and have a single clear job
- `data/projects.json` decouples content from markup; updating a project means touching one JSON file, not hunting through HTML
- GitHub Pages serves static files natively — no build step, no `gh-pages` branch tricks required

---

## Single-Page vs Multi-Page: Decision and Rationale

**Use single-page (`index.html` only).**

| Criterion | Single-Page | Multi-Page |
|-----------|-------------|------------|
| GitHub Pages deployment | Zero config — root `index.html` served automatically | Needs correct `<a href>` paths; 404 handling can be tricky |
| Navigation UX | Smooth scroll, instant — no page reload | Page loads on each nav click |
| Content volume | Portfolio has 5–6 sections, ~1–2 KB of text total | Worth it at 10+ discrete pages |
| SEO | One URL ranks for "Riccardo Corsi developer" — sufficient for a portfolio | Marginally better per-section, unnecessary here |
| Maintenance | Add a section by appending an `<section>` tag | Requires new HTML file + nav updates everywhere |
| Anchor deep links | `/#projects` works on GitHub Pages | Works but slower (full load) |

Multi-page would add real value only if a blog or case-study section existed. Neither is in scope.

---

## Component Boundaries

Each JS module owns one concern. Modules never touch each other's DOM regions.

| Module | File | Responsibility | Communicates With |
|--------|------|---------------|-------------------|
| Bootstrap | `main.js` | Imports all modules, fires `DOMContentLoaded` init | All modules (one-way call) |
| Scroll Reveal | `scroll-reveal.js` | Registers `IntersectionObserver` on `.reveal` elements, toggles `.visible` class | None — pure DOM manipulation |
| Navigation | `nav.js` | Highlights active nav link via `IntersectionObserver` on sections; optional mobile menu toggle | None — pure DOM manipulation |
| Projects Loader | `projects.js` | `fetch('/data/projects.json')`, builds card HTML, injects into `#projects-grid` | None — reads JSON, writes DOM |

`main.js` wires everything:

```js
// js/main.js  (type="module")
import { initScrollReveal } from './scroll-reveal.js';
import { initNav }          from './nav.js';
import { loadProjects }     from './projects.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNav();
  loadProjects();   // remove if projects are hardcoded in HTML
});
```

All imports use explicit `.js` extensions — required by the browser's native ES module resolver without a bundler.

---

## CSS Architecture

**Use CSS custom properties (tokens) as the single source of truth.** Everything else references tokens, never raw values.

```css
/* css/tokens.css */
:root {
  /* Color palette */
  --color-paper:   #F5F0E8;
  --color-ink:     #2C2416;
  --color-accent:  #8B6914;
  --color-subtle:  #BFB49A;

  /* Typography */
  --font-serif:    'Playfair Display', Georgia, serif;
  --font-sans:     'Inter', system-ui, sans-serif;
  --text-base:     1rem;
  --text-lg:       1.25rem;
  --text-xl:       2rem;
  --text-hero:     clamp(2.5rem, 6vw, 5rem);

  /* Spacing */
  --space-xs:  0.5rem;
  --space-sm:  1rem;
  --space-md:  2rem;
  --space-lg:  4rem;
  --space-xl:  8rem;

  /* Elevation / shadow */
  --shadow-card:   2px 4px 16px rgba(44, 36, 22, 0.12);
  --shadow-hover:  4px 8px 24px rgba(44, 36, 22, 0.20);

  /* Transition */
  --transition-base: 200ms ease;
}
```

**CSS file load order in `<head>`:**
```html
<link rel="stylesheet" href="css/reset.css">
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/components/nav.css">
<link rel="stylesheet" href="css/components/hero.css">
<link rel="stylesheet" href="css/components/about.css">
<link rel="stylesheet" href="css/components/projects.css">
<link rel="stylesheet" href="css/components/timeline.css">
<link rel="stylesheet" href="css/components/contact.css">
<link rel="stylesheet" href="css/animations.css">
```

This order ensures tokens are available to everything, and `animations.css` loads last so it can override base states without specificity fights.

---

## Data Flow for Dynamic Parts

### Option A: Hardcoded HTML (recommended for initial build)

Project cards live directly in `index.html`. No JS required for rendering. Fast, zero-latency, perfectly indexed by search engines (if ever crawled). Simpler to build first.

**When to use:** Always start here. Add JSON loading only if the project count grows beyond ~8 and updating HTML feels tedious.

### Option B: JSON-driven cards (recommended once stable)

```
data/projects.json → fetch() in projects.js → DOM injection into #projects-grid
```

`fetch()` works on GitHub Pages for same-origin files as long as the page is served over HTTP/HTTPS (not `file://`). GitHub Pages always serves over HTTPS.

```js
// js/projects.js
export async function loadProjects() {
  const res  = await fetch('/data/projects.json');
  const list = await res.json();
  const grid = document.getElementById('projects-grid');

  grid.innerHTML = list.map(p => `
    <article class="project-card reveal">
      <img src="${p.image}" alt="${p.title}" loading="lazy">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
      <a href="${p.url}" target="_blank" rel="noopener">View →</a>
    </article>
  `).join('');

  // Re-run observer after DOM injection
  initScrollReveal();
}
```

**Note:** When cards are injected dynamically, `initScrollReveal()` must be called again after injection, because the `IntersectionObserver` is registered on elements that exist at call time. Alternatively, use `MutationObserver` to watch `#projects-grid` — but that adds complexity. Calling `initScrollReveal()` twice is simpler and has no side effect (just re-observes already-visible elements, which fire immediately).

---

## "Carta Invecchiata" Paper Texture: Recommended Approach

**Use an inline SVG filter applied via a `::before` pseudo-element on `body`.** This is the lightest technique: no external image, no HTTP request, pure CSS, renders server-side (no JS).

```css
/* css/base.css */
body {
  background-color: var(--color-paper);
  position: relative;
}

body::before {
  content: "";
  position: fixed;         /* fixed so texture doesn't scroll with content */
  inset: 0;
  pointer-events: none;    /* never blocks clicks */
  z-index: 9999;           /* above all content */
  opacity: 0.035;          /* extremely subtle — barely perceptible */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/feTurbulence%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 200px 200px;
}
```

**Parameter tuning:**
| Parameter | Value | Effect |
|-----------|-------|--------|
| `baseFrequency` | 0.65 | Fine grain (higher = finer, lower = coarser) |
| `numOctaves` | 3 | Detail level; 4 costs noticeably more GPU |
| `opacity` | 0.03–0.06 | Start at 0.035; increase if imperceptible on target display |
| `background-size` | 200px | Tile size; larger = less visible repeat seam |
| `position: fixed` | — | Texture stays put while content scrolls, which looks more natural |

**Why not alternatives:**
- CSS `filter: blur()` on a `<div>` — applies to children, not the texture itself
- External PNG/JPEG texture — HTTP request + large file, no benefit over inline SVG
- `backdrop-filter` — only works when there is something behind the element to filter, not useful here
- CSS `background-image: url(noise.svg)` from file — fine, but inline data URI means zero requests

---

## Intersection Observer: Scroll Reveal Pattern

**One observer, many targets.** Register all `.reveal` elements with a single `IntersectionObserver` instance. Disconnect each entry after it fires to avoid redundant callbacks.

```js
// js/scroll-reveal.js
export function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);   // fire once only
      });
    },
    {
      threshold: 0.12,     // 12% visible triggers animation
      rootMargin: '0px 0px -40px 0px',   // offset from viewport bottom
    }
  );

  elements.forEach(el => observer.observe(el));
}
```

```css
/* css/animations.css */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 500ms ease,
    transform 500ms ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Respect user preference — no motion */
@media (prefers-reduced-motion: reduce) {
  .reveal,
  .reveal.visible {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

**Why `unobserve` after trigger:** Animate-once is the correct behaviour for a portfolio. Repeated re-animation (every time user scrolls past) is distracting for a "carta invecchiata" editorial feel.

**Why `threshold: 0.12` not `0.5`:** At 0.5, tall cards (project images) don't reveal until they're half in view, which on mobile often means they never trigger. 12% is the sweet spot: reveals early enough to feel responsive, late enough that it's not just pre-loading off-screen.

**Active nav link highlighting** (separate observer in `nav.js`):

```js
// js/nav.js
export function initNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`nav a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      });
    },
    { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
  );

  sections.forEach(s => obs.observe(s));
}
```

`rootMargin: '-40% 0px -40% 0px'` creates a "hot zone" in the middle 20% of the viewport, so only the section most visibly centered triggers its nav link.

---

## Suggested Build Order (Fastest Feedback Loop)

Build in this sequence so each phase is visually testable:

1. **`css/tokens.css` + `css/reset.css` + `css/base.css`** — Establish the paper background and typography. Open `index.html` in browser. You immediately see the aesthetic.

2. **`index.html` skeleton** — All sections present, no content yet. Semantic `<section>`, `<nav>`, `<main>`, `<footer>` with IDs. Scroll works.

3. **`css/layout.css`** — Max-width containers, section vertical rhythm. The page proportions are correct.

4. **Hero section** (`hero.css` + content in HTML) — Most critical section; recruiter lands here. Get name, title, tagline right visually.

5. **Nav** (`nav.css` + `js/nav.js`) — Sticky nav with smooth scroll. Test on mobile.

6. **Projects section** (`projects.css`) — Hardcode 2–3 cards in HTML first. Get the card design right. Convert to JSON-driven later.

7. **About + Timeline** (`about.css` + `timeline.css`) — Professional identity sections. CSS-only timeline with `::before` border trick.

8. **Contact section** + **Footer** — Minimal, just email and LinkedIn.

9. **`css/animations.css` + `js/scroll-reveal.js`** — Layer on scroll reveal last. It's progressive enhancement — the site must work without it.

10. **Polish pass** — Hover states, texture opacity tuning, font sizing on mobile, Lighthouse audit.

**Rationale for this order:** Hero and Projects are what recruiters read. Building them first means every code review session is against the two highest-value sections. Animations are last because they're enhancement — discovering a layout problem after implementing reveal animations means fighting two concerns at once.

---

## Scalability Considerations

| Concern | Now (greenfield) | If projects grow to 15+ |
|---------|------------------|------------------------|
| Project data | Hardcode in HTML | Move to `data/projects.json` + fetch |
| CSS bundle size | Split files, 0 cost at this scale | Already split, no action needed |
| Images | Unoptimized OK for MVP | Use `loading="lazy"` + WebP conversion |
| Font loading | Google Fonts CDN | Self-host WOFF2 for privacy + eliminate render-blocking |
| Build step | None — ship raw files | Add simple `npm run build` with esbuild only if perf demands it |

No build step is needed for this project's current or foreseeable scope. GitHub Pages serves raw files with HTTP/2 multiplexing; 8–10 CSS files load in parallel with negligible overhead.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Single Monolithic CSS File
**What:** All CSS in one `styles.css`, as in the current site.
**Why bad:** On this project, `styles.css` is already 3.9 KB with almost no content. A full redesign will reach 600–900 lines. Hunting the "projects card hover state" across 800 lines of sequential CSS is slow and error-prone.
**Instead:** Split by section from day one as shown in the file structure above.

### Anti-Pattern 2: Scroll Event Listener for Reveal
**What:** `window.addEventListener('scroll', checkVisibility)` polling element positions.
**Why bad:** Fires on every scroll tick (60fps), forces layout recalculation (getBoundingClientRect), janky on mobile.
**Instead:** `IntersectionObserver` — browser-native, off-main-thread, no scroll listener needed.

### Anti-Pattern 3: External Icon Library (FontAwesome CDN)
**What:** The current site loads FontAwesome via CDN kit script.
**Why bad:** External request, render-blocking potential, adds ~30KB for a handful of icons.
**Instead:** Inline SVG icons directly in HTML. For a portfolio with 4–6 social icons, copy the SVG paths once and be done. Already demonstrated in the current `index.html` for LinkedIn and GitHub — apply this pattern everywhere.

### Anti-Pattern 4: Google Fonts CDN (if privacy matters)
**What:** `<link href="https://fonts.googleapis.com">` — the current site uses it.
**Why bad:** Third-party request logged by Google; EU privacy concerns; adds 200–400ms on cold load.
**Instead:** Download WOFF2 files, self-host in `assets/fonts/`, declare with `@font-face`. Eliminates external dependency entirely.

### Anti-Pattern 5: Animating Layout Properties
**What:** CSS transitions on `height`, `width`, `top`, `left`, `margin`.
**Why bad:** Forces full layout reflow on every frame. Visible jank on mid-range phones.
**Instead:** Animate only `opacity` and `transform` (GPU-composited, no reflow).

---

## Sources

- [Grainy Gradients — CSS-Tricks](https://css-tricks.com/grainy-gradients/)
- [Creating Grainy CSS Backgrounds — ibelick.com](https://ibelick.com/blog/create-grainy-backgrounds-with-css)
- [SVG Filter feTurbulence — Codrops](https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/)
- [JavaScript Modules in 2025 — ESM, Import Maps — Medium](https://siddsr0015.medium.com/javascript-modules-in-2025-esm-import-maps-best-practices-7b6996fa8ea3)
- [Writing Modern JS Without a Bundler — Playful Programming](https://playfulprogramming.com/posts/modern-js-bundleless/)
- [JavaScript Modules — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Vanilla JS Scroll Events & Animations with IntersectionObserver — Chee Web Development](https://cheewebdevelopment.com/vanilla-js-scroll-events-animations-with-intersectionobserver-api/)
- [How to Host a Lightweight Portfolio on GitHub Pages — Resumly](https://www.resumly.ai/blog/how-to-host-a-lightweight-portfolio-on-github-pages)
- [Single or Multi-Page Dev Portfolio — DEV Community](https://dev.to/lornasw93/dev-portfolio-site-single-page-or-multi-5ek5)
