# Phase 3: Polish & Ship — Research

**Researched:** 2026-04-22
**Domain:** CSS scroll-reveal animations, CSS hover transitions, Lighthouse performance auditing (vanilla HTML/CSS/JS static site)
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ANIM-01 | Content sections animate in on scroll (opacity + translateY), fire only once per element; OS reduced-motion removes all motion | IntersectionObserver + `data-reveal` attribute + `unobserve()` after fire; `@media (prefers-reduced-motion: reduce)` overrides in `@layer animations` |
| ANIM-02 | Hovering project cards and interactive links produces a subtle CSS transition — no JS, no layout shift | CSS-only `transition` on `transform` and `box-shadow` in `.project-card:hover`; existing `.btn:hover` already present in components.css — verify and extend |
| ANIM-03 | Lighthouse on live URL scores Performance ≥ 90, LCP < 1.5s, CLS = 0, TBT = 0; fully readable at 375px | Font preloads already in `<head>`; `font-display: swap` already set; PNG texture already `fixed` (no CLS); JS is ES modules (deferred); audit live URL in Chrome DevTools |

</phase_requirements>

---

## Summary

Phase 3 adds the final layer — scroll-reveal animations, hover state polish, and a Lighthouse verification pass — to a site whose static foundation is already solid. The codebase is well-positioned: `css/animations.css` has an empty `@layer animations` block with a `prefers-reduced-motion` placeholder; `js/nav.js` already demonstrates the exact IntersectionObserver pattern needed for scroll reveal; and all performance-critical decisions (WOFF2 self-hosting with `font-display: swap`, PNG texture as `fixed` background, no render-blocking scripts) were made correctly in Phase 1.

The scroll-reveal implementation is `~20 lines of vanilla JS` in a new `js/reveal.js` ES module, using `data-reveal` attributes on target elements and an IntersectionObserver that adds an `is-visible` class then calls `unobserve()`. CSS in `@layer animations` handles the actual opacity+translateY transition — the separation of concerns is clean. The `prefers-reduced-motion: reduce` block in `animations.css` sets the initial state to visible (removing the hidden state entirely), which is safer and more correct than setting `transition: none` alone.

Hover transitions for project cards are CSS-only: `transform: translateY(-2px)` and a box-shadow on `.project-card:hover`, both already constrained to `opacity` and `transform` by project rules. Button hover states (`.btn--primary:hover`, `.btn--outline:hover`) already exist in `components.css` and just need a reduced-motion guard verification.

Lighthouse on this stack — static HTML, self-hosted WOFF2, no JS framework, no render-blocking resources — should achieve Performance ≥ 90 with minimal effort. The most likely failure modes are: (1) `font-display: swap` causing a CLS event if the fallback font metrics differ from Space Grotesk/Inter, and (2) the H1 text block being the LCP element and arriving late due to font swap. Both are addressed by the existing `<link rel="preload">` tags already in `<head>`. The LCP target of < 1.5s is ambitious (the standard "good" threshold is < 2.5s); GitHub Pages CDN typically delivers sub-100ms TTFB globally, so this is achievable.

**Primary recommendation:** Implement scroll reveal in `js/reveal.js` using the IntersectionObserver + `data-reveal` + `unobserve()` pattern from nav.js; write all animation CSS into `css/animations.css` `@layer animations`; verify the live URL with Chrome DevTools Lighthouse in incognito mode (throttled to "Mobile" preset for worst-case).

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Scroll reveal state toggle | Browser / Client (vanilla JS ES module) | — | IntersectionObserver lives in the browser; no server involvement |
| Scroll reveal CSS transition | Browser / Client (CSS `@layer animations`) | — | `opacity` + `transform` transitions are GPU-composited — pure CSS |
| Hover transitions (cards, buttons) | Browser / Client (CSS `@layer components` / `@layer animations`) | — | CSS-only per project rules; no JS, no layout shift |
| Reduced-motion override | Browser / Client (CSS media query) | — | `@media (prefers-reduced-motion: reduce)` is a browser-level preference |
| Lighthouse audit | External tool (Chrome DevTools / PageSpeed Insights) | GitHub Pages CDN | Runs against the live deployed URL |
| Mobile 375px verification | Browser / Client (DevTools Device Mode or physical device) | — | Manual verification step |

---

## Standard Stack

### Core (all already in place — no new installs)

| Technology | Version/Spec | Purpose | Status |
|------------|-------------|---------|--------|
| `IntersectionObserver` API | Baseline 2017 — all modern browsers | Detect when elements enter viewport for scroll reveal | Used in `js/nav.js` — reuse exact pattern |
| CSS `@layer animations` | Baseline 2022 | Contain all Phase 3 animation and transition rules | Empty block already in `css/animations.css` |
| CSS `@media (prefers-reduced-motion)` | Baseline 2020 | Strip motion for users who prefer reduced motion | Placeholder already in `animations.css` |
| CSS `transform` + `opacity` | Baseline universally | Scroll reveal and hover transitions — GPU-composited, no reflow | Already used in `.btn--primary:hover` |
| Chrome DevTools Lighthouse | Built into Chrome 88+ | Performance audit against live URL | External tool — no install needed |

**No new packages, no npm installs.** This phase is zero-dependency.

### New files this phase

| File | Role | Why new |
|------|------|---------|
| `js/reveal.js` | ES module — IntersectionObserver scroll reveal | Clean separation from nav.js; both modules stay focused |
| `css/animations.css` | Receives all Phase 3 CSS | Already exists — currently 7 lines; Phase 3 fills it |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom IntersectionObserver in `js/reveal.js` | CSS Scroll-Driven Animations (`animation-timeline: view()`) | CSS-only is more elegant; however Firefox support still requires flags as of early 2026 — IntersectionObserver has universal baseline 2017 support. Stick with IO. [VERIFIED: MDN, WebKit blog 2024] |
| `is-visible` class toggle | Inline `style` attribute toggle | Class toggle is cleaner: CSS controls all animation values; JS only manages state. Standard pattern. |
| `font-display: swap` (current) | `font-display: optional` | `optional` eliminates font-swap CLS entirely but skips the web font on slow connections. `swap` + preload is the correct choice when fonts are already preloaded in `<head>`. [CITED: web.dev/articles/font-best-practices] |

---

## Architecture Patterns

### System Architecture Diagram

```
Browser Load (corsiriccardo.github.io)
     │
     ├── index.html parsed
     │       │
     │       ├── CSS cascade: @layer tokens → reset → base → layout → components → animations
     │       │   animations.css Phase 3 rules: [data-reveal] initial state + .is-visible transition
     │       │
     │       ├── Static HTML sections rendered (hero, projects, about, timeline, contact)
     │       │   [data-reveal] attributes mark scroll-reveal targets
     │       │
     │       └── <script type="module" src="js/reveal.js"> deferred (module semantics)
     │
     ├── js/nav.js executes (existing — no changes)
     │
     ├── js/projects.js executes (existing — no changes)
     │       └── cards injected into .projects__grid
     │           cards need [data-reveal] or reveal picks them up after injection
     │
     └── js/reveal.js executes
               │
               ├── prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
               │         └── if true → return early (CSS already shows elements; no IO needed)
               │
               ├── IntersectionObserver created
               │   rootMargin: '0px 0px -60px 0px'  ← fires 60px before bottom viewport edge
               │   threshold: 0.1                    ← 10% visible triggers
               │
               ├── document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el))
               │
               └── On intersection (isIntersecting):
                         ├── entry.target.classList.add('is-visible')
                         └── observer.unobserve(entry.target)  ← fires once only

CSS animations.css:
     [data-reveal]    → opacity: 0; transform: translateY(24px); transition: opacity 500ms ease, transform 500ms ease
     [data-reveal].is-visible → opacity: 1; transform: translateY(0)
     @media (prefers-reduced-motion: reduce):
          [data-reveal] → opacity: 1; transform: none  ← element starts visible; reveal.js returns early
```

### Recommended Project Structure (additions)

```
(existing)
├── index.html           — add [data-reveal] attributes to section child elements
├── css/
│   ├── animations.css   — FILL: [data-reveal] initial state, .is-visible transition,
│   │                             .project-card:hover, reduced-motion overrides
│   └── components.css   — verify .btn reduced-motion guards (already present)
js/
├── nav.js               — no changes
├── projects.js          — no changes (cards need [data-reveal] consideration — see Pitfall 3)
└── reveal.js            — CREATE NEW FILE, ES module, ~20 lines
```

### Pattern 1: Scroll Reveal — IntersectionObserver + data-reveal + unobserve

**What:** An IntersectionObserver watches all `[data-reveal]` elements. When one enters the viewport (10% visible, 60px before the bottom edge fires), it gets `.is-visible` added and is immediately unobserved. This means the animation fires exactly once per element, in one direction.

**When to use:** All scroll-reveal targets in `index.html`.

**Example (js/reveal.js):**
```javascript
// js/reveal.js
// ES module — scroll reveal via IntersectionObserver
// Targets elements with [data-reveal] attribute.
// Adds .is-visible once; calls unobserve() to fire exactly once per element.
// Returns early if user prefers reduced motion (CSS already shows all elements).

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1,
    }
  );

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    revealObserver.observe(el);
  });
}
```

**Source: MDN Intersection Observer API [VERIFIED: MDN Web Docs]; nav.js pattern in this codebase [VERIFIED: js/nav.js]**

### Pattern 2: CSS Reveal Transition in @layer animations

**What:** `[data-reveal]` sets the hidden initial state. `[data-reveal].is-visible` sets the revealed state. `@media (prefers-reduced-motion: reduce)` overrides `[data-reveal]` to start visible so users never see hidden content.

**When to use:** `css/animations.css` — inside the existing `@layer animations` block.

**Example:**
```css
/* Source: css/animations.css — fill the existing @layer animations block */
@layer animations {

  /* === Scroll reveal: initial hidden state === */
  [data-reveal] {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 500ms ease, transform 500ms ease;
  }

  /* === Scroll reveal: revealed state (added by reveal.js) === */
  [data-reveal].is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* === Project card hover: editorial lift === */
  .project-card {
    transition: transform 200ms ease, box-shadow 200ms ease;
  }

  .project-card:hover {
    transform: translateY(-2px);
    /* warm-tinted shadow matching the palette */
    box-shadow: 0 4px 16px rgba(44, 36, 22, 0.12);
  }

  /* === Reduced-motion: start all [data-reveal] elements visible === */
  /* CRITICAL: this must appear AFTER [data-reveal] above so it wins */
  @media (prefers-reduced-motion: reduce) {
    [data-reveal] {
      opacity: 1;
      transform: none;
      transition: none;
    }

    .project-card {
      transition: none;
    }

    .project-card:hover {
      transform: none;
    }
  }
}
```

**Note on ordering within the layer:** The `@media (prefers-reduced-motion: reduce)` block must come AFTER the `[data-reveal]` rules in the file so it wins in specificity order within the same layer. [VERIFIED: CSS cascade specification]

### Pattern 3: [data-reveal] Placement on index.html

**What:** `[data-reveal]` is placed on section-level child containers, not on the `<section>` tag itself. This avoids interfering with layout (section has `padding-block` applied) and gives a visually pleasing stagger-per-section effect.

**Target elements (exhaustive):**

| Element | HTML target |
|---------|-------------|
| Hero block | `#hero` (the section itself is fine — it is the first viewport element; consider whether hero should reveal at all — see Pitfall 4) |
| Projects heading | `#projects h2` |
| Projects grid | `.projects__grid` (reveals after cards are injected) |
| About heading | `#about h2` |
| About content | `.about__content` |
| Timeline heading | `#timeline h2` |
| Timeline | `.timeline` |
| Contact section | `#contact` |

**Example (index.html):**
```html
<section id="projects" aria-label="Projects">
  <h2 data-reveal>Projects</h2>
  <div class="projects__grid" data-reveal>
    <!-- js/projects.js injects cards here -->
  </div>
</section>
```

**Note:** `data-reveal` is a boolean attribute — no value needed.

### Pattern 4: Project Card Hover Transition (CSS-only)

**What:** `.project-card` gets a subtle `translateY(-2px)` lift on hover. This is `@layer animations` (not `@layer components`) because it is an animation behavior, not a structural style.

**Rationale for box-shadow:** A box-shadow on hover adds depth without causing layout shift (box-shadow does not trigger reflow). The shadow uses `rgba(44, 36, 22, 0.12)` — matching `--color-text-primary` at 12% — consistent with the warm palette.

**What not to do:** Do not animate `margin`, `padding`, `height`, `width`, or `border-width` — these cause layout reflow. Only `transform` and `opacity` (and `box-shadow` as a special case) are safe per project rules.

### Anti-Patterns to Avoid

- **Animating layout properties:** `height`, `width`, `margin`, `padding` cause reflow. Use only `opacity`, `transform`, `box-shadow`. [VERIFIED: project CLAUDE.md constraint]
- **Missing `prefers-reduced-motion`:** Every `transition` or animation must have a reduced-motion override. [VERIFIED: project CLAUDE.md constraint]
- **Observer on `<section>` for hero:** The hero is above the fold — it fires immediately without scrolling. Consider not applying `data-reveal` to `#hero`, or using `threshold: 0` with no rootMargin (so it fires immediately on load, giving a page-load fade-in rather than a scroll-triggered reveal).
- **Not calling `unobserve()`:** Without `unobserve()`, the observer keeps watching and re-fires if the user scrolls back past the element. For a one-time reveal, always call `unobserve()`.
- **Observing `.projects__grid` before cards inject:** `projects.js` injects cards asynchronously. If `reveal.js` runs first, `.projects__grid` gets `data-reveal` but the cards inside it don't. The grid as a whole reveals fine. Individual card stagger is a scope extension (Phase 3 may add per-card `data-reveal` attributes in `js/projects.js`'s `buildCard()` function — see Open Questions).
- **Adding `defer` to `<script type="module">`:** ES modules are deferred by default. Adding `defer` is redundant.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll detection | `window.addEventListener('scroll', ...)` + `getBoundingClientRect()` | `IntersectionObserver` | Scroll listeners call `getBoundingClientRect()` on every scroll tick — causes forced reflows and kills performance. IO is async and off the main thread. [CITED: web.dev/intersectionobserver] |
| Animation timing library | Custom `requestAnimationFrame` loop | CSS `transition` on `opacity` + `transform` | CSS transitions run on the GPU compositor — no main thread cost. |
| Scroll reveal library (AOS, ScrollReveal.js) | npm package | 20-line vanilla IO module | Library adds JS parse/execute cost, no build step on this project, adds dependency drift. Not needed. |
| Lighthouse runner | CI setup, npm packages | Chrome DevTools Lighthouse (built-in) or PageSpeed Insights | For a single verification pass, the browser tool is sufficient. No configuration needed. |

---

## Codebase Snapshot: What Exists in Phase 3 Context

### `css/animations.css` (current — 7 lines)
```css
@layer animations {
  /* Phase 3 — scroll reveal and hover transitions go here */

  @media (prefers-reduced-motion: reduce) {
    /* All animation overrides go here in Phase 3 */
  }
}
```
Status: Ready to fill. The layer is declared. The reduced-motion placeholder is waiting.

### `js/nav.js` (current — 49 lines)
The IntersectionObserver in nav.js uses:
```javascript
rootMargin: `-${NAV_HEIGHT}px 0px -66% 0px`
threshold: 0
```
The nav observer uses a very negative bottom margin (-66%) to track which section is active in the upper viewport. The **reveal observer** needs a different config: `rootMargin: '0px 0px -60px 0px'` and `threshold: 0.1` — fires when 10% of an element is visible, 60px before it would touch the bottom edge.

### `css/components.css` — existing hover states (Phase 2)
```css
/* Already in components.css — do NOT duplicate in animations.css */
.btn--primary:hover { opacity: 0.85; transform: translateY(-1px); }
.btn--outline:hover { background-color: color-mix(...); }

/* Reduced-motion guard already present: */
@media (prefers-reduced-motion: reduce) {
  .btn { transition: none; }
  .btn--primary:hover { transform: none; }
}
```
The button hover reduced-motion guard is already implemented correctly. Phase 3 does NOT need to touch `components.css` for buttons. Only add `.project-card` hover state in `animations.css`.

### `index.html` (current — 162 lines, fully populated)
All 5 sections have real content. No `data-reveal` attributes yet — Phase 3 adds them.

---

## Common Pitfalls

### Pitfall 1: Hero section [data-reveal] fires immediately (expected behavior, not a bug)

**What goes wrong:** Developer adds `data-reveal` to `#hero`. The hero is visible on page load, so the IntersectionObserver fires immediately during setup. The element transitions from opacity:0 to opacity:1 on page load — this looks like a fade-in, not a scroll reveal.

**Why it happens:** The IO fires for all currently-visible elements during the initial observation call. This is documented behavior.

**How to handle (two valid choices):**
1. Do NOT add `data-reveal` to `#hero` — let it render immediately with full opacity. The hero is the landing viewport; hiding it on load is a bad experience.
2. Add `data-reveal` to `#hero` and treat the page-load fade-in as intentional. Keep the transition duration short (300ms) so it reads as a "page loaded" signal rather than missing content.

**Recommendation:** Option 1 — skip hero reveal. Apply `data-reveal` to sections that are below the fold.

### Pitfall 2: Project cards injected after reveal.js observes

**What goes wrong:** `reveal.js` calls `document.querySelectorAll('[data-reveal]')` at module load time. If `projects.js` hasn't injected the cards yet, only the `.projects__grid` container (with `data-reveal`) gets observed — not the individual cards.

**Why it happens:** ES modules are deferred and run in order. Both `nav.js` and `projects.js` are listed before `reveal.js` (or in the same order as `<script>` tags), but `projects.js` uses `async fetch()` — the cards arrive after the initial IO setup.

**How to avoid (two approaches):**
1. **Simple (recommended):** Only the `.projects__grid` gets `data-reveal`. The entire grid reveals as a unit. Simpler, no JS changes to `projects.js`.
2. **Staggered (optional):** In `projects.js`'s `buildCard()`, add `card.dataset.reveal = ''` (sets `data-reveal` attribute) to each card. After `grid.appendChild(fragment)`, call a `revealPending()` function exported from `reveal.js` that re-queries and observes new `[data-reveal]` elements. This requires `reveal.js` to export a function — breaks the no-export convention.

**For Phase 3, use approach 1.** Staggered card reveal is a nice-to-have, not required by ANIM-01.

### Pitfall 3: `prefers-reduced-motion` applied only to `transition` — not to initial `opacity: 0`

**What goes wrong:**
```css
/* BAD: only disables transition — element still starts invisible */
@media (prefers-reduced-motion: reduce) {
  [data-reveal] { transition: none; }
}
```
If `reveal.js` still runs its IO and adds `.is-visible`, the element snaps from `opacity:0` to `opacity:1` instantly (which is fine visually), but if `reveal.js` returns early (because `prefersReducedMotion` is true), the element stays at `opacity:0` forever — invisible, inaccessible content.

**How to avoid:**
```css
/* CORRECT: start fully visible under reduced-motion */
@media (prefers-reduced-motion: reduce) {
  [data-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```
And in `reveal.js`, return early when `prefersReducedMotion` is true. The CSS handles visibility; JS handles nothing.

**Warning sign:** Screen reader users or keyboard users report content is not accessible — the element is invisible and has no `visibility: hidden` override, so it renders as blank space.

### Pitfall 4: box-shadow on `.project-card:hover` causes CLS

**What goes wrong:** Developer adds `box-shadow` that changes the layout box (e.g., `box-shadow: 0 0 0 2px var(--color-accent)` as a focus ring). Inset box-shadow with spread is fine; outset box-shadow does NOT cause layout shift because it does not affect flow. But an outset shadow that shifts sibling elements (e.g., margin change) would.

**How to avoid:** Use `box-shadow` (outset, no layout impact) or `transform` only. Never add `border` on hover (changes element size → layout shift). Never change `margin` or `padding` on hover. [VERIFIED: CSS box model — box-shadow is not part of the box model and does not affect layout]

### Pitfall 5: Lighthouse audit run in non-incognito mode or with browser extensions

**What goes wrong:** Extensions (ad blockers, password managers, React DevTools) interfere with Lighthouse measurements. A score of 95 in incognito may appear as 82 in a normal window.

**How to avoid:** Always run Lighthouse in Chrome incognito mode with extensions disabled. Use the "Mobile" preset for worst-case (network throttled to Moto G4 4G, CPU 4x slowdown). The "Desktop" preset will always score higher.

### Pitfall 6: LCP element changes after font-display: swap

**What goes wrong:** LCP is measured as the H1 "Riccardo Corsi" text block. With `font-display: swap`, the H1 first renders in the system font fallback (`system-ui, sans-serif`), then re-renders in Space Grotesk. If the fallback and web font have different metrics, this second render causes both a CLS event (element shifts) and extends the LCP (LCP updates to the final render time).

**Why it won't be severe here:** Both font preloads are in `<head>` before the CSS links:
```html
<link rel="preload" href="assets/fonts/space-grotesk-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin>
```
With preload, fonts are fetched at high priority in parallel with CSS. On GitHub Pages CDN, the font files (~22KB each) typically load within 100-200ms. The swap is likely to happen before the first frame renders, eliminating the CLS event. [CITED: web.dev/articles/font-best-practices]

**Mitigation if CLS still appears in audit:** Add `size-adjust` to `@font-face` fallback descriptors in `base.css`. This aligns the fallback font metrics with the web font so the swap causes no visual shift. [CITED: web.dev/css-size-adjust]

### Pitfall 7: Lighthouse run against `localhost` or `file://` instead of live URL

**What goes wrong:** The task spec requires auditing the live `corsiriccardo.github.io` URL, not localhost. GitHub Pages serves files from a global CDN. Localhost Lighthouse scores are measured differently (no CDN latency, different TTFB).

**How to avoid:** Run Lighthouse in Chrome DevTools → Lighthouse tab → URL: `https://corsiriccardo.github.io` → Mobile preset → Generate report.

---

## Lighthouse Performance Analysis for This Stack

### Expected LCP element

The H1 text block ("Riccardo Corsi", 3rem Space Grotesk) is the largest content element in the initial viewport on a text-only page. It is the LCP candidate. [CITED: web.dev/articles/lcp — "text blocks are qualifying LCP elements"]

**LCP timing estimate for this stack:**
- GitHub Pages TTFB: typically 50-150ms (CDN-served)
- HTML parse: ~5ms (162 lines, minimal HTML)
- Font preload: fetched in parallel at high priority — ~100-200ms for 22KB WOFF2 from GitHub CDN
- H1 first render: occurs when font arrives (font-display: swap with preload means fallback renders first, then web font swaps in)
- Estimated LCP: 200-400ms in optimal conditions

**The 1.5s LCP target is well within reach for this stack.** [ASSUMED: GitHub Pages CDN latency from Europe — preload time is network-dependent]

### Lighthouse metric weights (Lighthouse 10, current in Chrome DevTools 2026)

| Metric | Weight | Target | Notes |
|--------|--------|--------|-------|
| First Contentful Paint (FCP) | 10% | < 1.8s | System font renders immediately via font-display: swap |
| Speed Index | 10% | < 3.4s | Low on simple static page |
| Largest Contentful Paint (LCP) | 25% | < 2.5s (good); we target < 1.5s | H1 text block — font preload critical |
| Total Blocking Time (TBT) | 30% | < 200ms (good); we target 0ms | No synchronous scripts in `<head>`; all JS is ES modules (deferred) |
| Cumulative Layout Shift (CLS) | 25% | < 0.1 (good); we target 0 | Font preload + fixed texture overlay + no dynamic layout injection |

[CITED: Chrome Developers docs — Lighthouse performance scoring; VERIFIED: weights from WebFetch of lighthouse scoring page]

### Why TBT = 0 is achievable

TBT measures main thread blocking from long tasks (> 50ms) during page load. This site has:
- No render-blocking `<script>` in `<head>`
- No `<script defer>` (all scripts are ES modules — deferred by spec)
- No synchronous CSS imports
- No third-party scripts (no Google Fonts CDN, no FontAwesome, no analytics)

The only JS is `nav.js`, `projects.js`, and `reveal.js` — all small, deferred ES modules with no expensive synchronous operations. TBT = 0 is the expected result.

### Why CLS = 0 is achievable

Layout shift sources have been eliminated:
- Paper texture is `position: fixed` — does not affect document flow
- Fonts are preloaded — swap likely happens before first frame
- No images without explicit dimensions
- No dynamically inserted content above existing content (projects.js injects into an existing `<div>`)
- Scroll reveal uses `opacity` + `transform: translateY()` — `transform` does not affect layout flow

**The only CLS risk is the font-display: swap fallback-to-webfont swap.** With preloads in `<head>`, this risk is low. If the audit shows CLS > 0 due to font swap, add `size-adjust` to the `@font-face` fallback.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `window.scroll` event + `getBoundingClientRect()` | `IntersectionObserver` | 2019 (Baseline) | Async, off-thread — no reflow cost |
| JS animation libraries (GSAP, AOS) | CSS transitions + IO | 2020+ | Zero dependency, GPU-composited |
| `font-display: block` (FOIT) | `font-display: swap` + `preload` | 2018-2020 | Eliminates invisible text flash; preload prevents late swap |
| CSS Scroll-Driven Animations (`animation-timeline: view()`) | IntersectionObserver (for this project) | Chrome 115+ (2023), Firefox partial 2025, Safari 26 (2025) | Pure CSS is cleaner but lacks Firefox full support — IO is universally supported |

**Deprecated/outdated:**
- `ScrollReveal.js` library: No longer needed — vanilla IO achieves the same result in ~20 lines
- `requestAnimationFrame` scroll listeners: Replaced by IntersectionObserver for intersection detection
- `font-display: fallback` for portfolios: `swap` + preload is the recommended pattern for sites where brand typography matters

---

## Runtime State Inventory

Step 2.5 SKIPPED — this is an animation/polishing phase, not a rename/refactor/migration phase. No runtime state is affected.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Chrome (any modern) | Lighthouse audit, DevTools | ✓ | All modern versions | Firefox + PageSpeed Insights web tool |
| GitHub Pages (live URL) | ANIM-03 Lighthouse audit | ✓ | — | — |
| Internet connection | Lighthouse audit of live URL | ✓ | — | — |
| Local HTTP server | Local dev testing of `fetch()` | ✓ | `python3 -m http.server 8000` | `npx serve .` |

No new tooling dependencies. Zero npm packages needed for Phase 3.

---

## Validation Architecture

`workflow.nyquist_validation` is explicitly `false` in `.planning/config.json` — this section is omitted per the skip condition.

---

## Security Domain

Phase 3 introduces no new authentication, user input, server-side code, or secrets. The only additions are:
- `js/reveal.js` — reads DOM attributes, no network requests, no user data
- CSS animation rules — purely presentational

No new ASVS categories apply. The `rel="noopener noreferrer"` pattern already in place on all external links is unchanged.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | GitHub Pages CDN delivers WOFF2 fonts fast enough that font preload eliminates the swap CLS event | Pitfall 6, Lighthouse Analysis | CLS > 0 in audit — mitigate with `size-adjust` on `@font-face` fallback |
| A2 | The H1 "Riccardo Corsi" text block is the LCP element on the live page | Lighthouse Analysis | A different element (e.g., og-image.png if shown) could be LCP — verify in DevTools LCP tab |
| A3 | GitHub Pages TTFB is 50-150ms globally — LCP < 1.5s is achievable | Lighthouse Analysis | If TTFB is higher from the user's location, LCP may be 1.5-2.5s (still "good" by CWV standards) |
| A4 | `rootMargin: '0px 0px -60px 0px'` and `threshold: 0.1` give a natural reveal feeling for editorial content | Architecture Patterns | Reveals may feel too early or too late — adjust based on visual QA |
| A5 | The scroll reveal translateY offset of 24px is appropriate for the editorial aesthetic (not too dramatic) | Code Examples | May need tuning — 16px is more subtle, 32px is more dramatic. 24px is a starting recommendation [ASSUMED] |

---

## Open Questions

1. **Hero section reveal: fade-in on load vs. no animation**
   - What we know: The hero is visible on page load; an IO fires immediately for in-viewport elements
   - What's unclear: Whether a subtle page-load fade-in (opacity 0→1 in 300ms) enhances the "carta invecchiata" editorial feel or feels like a loading glitch
   - Recommendation: Skip `data-reveal` on `#hero` for simplicity. If the user wants a page-load fade-in, add it directly in `animations.css` with `@keyframes` (not IO-based).

2. **Per-card stagger animation for project cards**
   - What we know: Cards are injected by `projects.js` asynchronously; revealing `.projects__grid` as a unit satisfies ANIM-01
   - What's unclear: Whether per-card stagger (each card reveals 100ms after the previous) is in scope for Phase 3
   - Recommendation: Out of scope for Phase 3. Implement `.projects__grid` grid-level reveal. Stagger is a Phase 4/enhancement.

3. **`size-adjust` for font fallback (CLS mitigation)**
   - What we know: `size-adjust`, `ascent-override`, `descent-override` can align fallback font metrics to prevent CLS on swap [CITED: web.dev/css-size-adjust]
   - What's unclear: Whether the font swap causes measurable CLS on this site — unknown until Lighthouse runs on the live URL
   - Recommendation: Do NOT pre-emptively add `size-adjust` (it requires calculating exact values per font). Instead, run Lighthouse first. If CLS > 0 from font swap, add `size-adjust` as a targeted fix in the verification task.

---

## Code Examples

### Full `js/reveal.js` implementation (~20 lines)

```javascript
// js/reveal.js
// ES module — scroll reveal via IntersectionObserver
// Targets [data-reveal] elements. Adds .is-visible once, then unobserves.
// Returns early if prefers-reduced-motion: CSS already shows all elements at opacity:1.
// Source: MDN Intersection Observer API + js/nav.js pattern (this codebase)

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1,
    }
  );

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    revealObserver.observe(el);
  });
}
```

### `css/animations.css` — complete Phase 3 fill

```css
@layer animations {

  /* === Scroll reveal: initial hidden state === */
  [data-reveal] {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 500ms ease, transform 500ms ease;
  }

  /* === Scroll reveal: visible state (class added by js/reveal.js) === */
  [data-reveal].is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* === Project card hover: editorial lift without layout shift === */
  /* box-shadow is NOT a layout property — safe to animate (no reflow) */
  .project-card {
    transition: transform 200ms ease, box-shadow 200ms ease;
  }

  .project-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(44, 36, 22, 0.12);
  }

  /* === Reduced-motion overrides — MUST appear after the rules above === */
  /* Start [data-reveal] visible so content is never inaccessible.       */
  /* reveal.js returns early under reduced-motion; CSS handles display.   */
  @media (prefers-reduced-motion: reduce) {
    [data-reveal] {
      opacity: 1;
      transform: none;
      transition: none;
    }

    .project-card {
      transition: none;
    }

    .project-card:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
```

### Lighthouse audit steps (Chrome DevTools)

```
1. Open https://corsiriccardo.github.io in Chrome
2. Open DevTools (F12) → Lighthouse tab
3. Select: Mobile (not Desktop)
4. Categories: Performance only (uncheck Accessibility/SEO for speed)
5. Click "Analyze page load"
6. Note: LCP element, LCP value, CLS value, TBT value, overall Performance score
7. If any metric fails: use the "Opportunities" section for targeted fixes
```

### [data-reveal] attribute placement in index.html

```html
<!-- Hero: NO data-reveal (above fold, fires immediately) -->
<section id="hero" aria-label="Introduction">
  <h1>Riccardo Corsi</h1>
  ...
</section>

<!-- Projects: reveal heading and grid separately -->
<section id="projects" aria-label="Projects">
  <h2 data-reveal>Projects</h2>
  <div class="projects__grid" data-reveal>...</div>
</section>

<!-- About: reveal the content block -->
<section id="about" aria-label="About">
  <h2 data-reveal>About</h2>
  <div class="about__content" data-reveal>...</div>
</section>

<!-- Timeline: reveal as a unit -->
<section id="timeline" aria-label="Work experience">
  <h2 data-reveal>Experience</h2>
  <ol class="timeline" data-reveal>...</ol>
</section>

<!-- Contact: reveal entire section content -->
<section id="contact" aria-label="Contact">
  <h2 data-reveal>Contact</h2>
  <p data-reveal>Available for...</p>
  <div class="contact__actions" data-reveal>...</div>
</section>
```

---

## Sources

### Primary (HIGH confidence)
- `E:\Projects\corsiriccardo.github.io\js\nav.js` — IntersectionObserver pattern verified by direct read
- `E:\Projects\corsiriccardo.github.io\css\animations.css` — existing layer structure verified by direct read
- `E:\Projects\corsiriccardo.github.io\css\components.css` — existing hover states and reduced-motion guards verified by direct read
- `E:\Projects\corsiriccardo.github.io\index.html` — DOM structure and preload tags verified by direct read
- `E:\Projects\corsiriccardo.github.io\css\base.css` — `@font-face` declarations and `font-display: swap` verified by direct read
- [MDN Web Docs — Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) — `unobserve()` pattern, threshold/rootMargin options
- [MDN Web Docs — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) — recommended pattern: simplify, not remove

### Secondary (MEDIUM confidence)
- [web.dev — Font Best Practices](https://web.dev/articles/font-best-practices) — `font-display: swap` vs `optional`; preload rules; `size-adjust` mention
- [web.dev — Optimize LCP](https://web.dev/articles/optimize-lcp) — H1 text block as LCP element; font-display impact on LCP
- [Chrome Developers — Lighthouse Performance Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring) — Lighthouse 10 metric weights (FCP 10%, Speed Index 10%, LCP 25%, TBT 30%, CLS 25%)
- [web.dev — Core Web Vitals Thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds) — LCP < 2.5s good, CLS < 0.1 good
- [WebKit Blog — Guide to Scroll-Driven Animations](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/) — CSS scroll-driven animations + browser support landscape

### Tertiary (LOW confidence)
- WebSearch results on GitHub Pages performance characteristics — GitHub Pages CDN TTFB estimates are based on multiple community reports, not benchmarked in this session [ASSUMED: 50-150ms]
- `translateY(24px)` as the scroll reveal offset — reasonable default based on convention, not officially specified [ASSUMED: may need visual adjustment]

---

## Metadata

**Confidence breakdown:**
- Scroll reveal implementation: HIGH — exact pattern from nav.js; MDN verified
- CSS animations layer: HIGH — existing file structure verified; code examples derived from spec
- Lighthouse analysis: MEDIUM — metric weights verified; LCP/CLS estimates assume GitHub Pages CDN performance [ASSUMED for specific timing]
- prefers-reduced-motion: HIGH — MDN verified; pattern confirmed against existing components.css guards

**Research date:** 2026-04-22
**Valid until:** 2026-05-22 (stable APIs; IntersectionObserver and Lighthouse metrics are stable)
