# Phase 2: Core Content — Research

**Researched:** 2026-04-21
**Domain:** Vanilla HTML/CSS/JS content authoring against an existing design token foundation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Hero Section**
- D-01: H1 is "Riccardo Corsi" (full name only, no role inline in the headline).
- D-02: Subtitle beneath H1: "Software Developer" — plain, no punctuation.
- D-03: Tagline direction: technical + outcome — final copy is Claude's.
- D-04: CTA: single button/link "View my work ↓" anchoring to `#projects`.
- D-05: Layout: pure text, centered. No decorative elements.

**Projects Section**
- D-06: Feature 3 projects. All are game-system tools targeting Unreal Engine and/or Unity.
- D-07: Card copy: short — problem statement (1 sentence) + technical highlight (1 sentence) + outcome (1 sentence).
- D-08: Marketplace link schema: each card has an optional array of marketplace links. 1 link → single CTA button. 2 links → two side-by-side buttons.
- D-09: Data source: `data/projects.json` — start with placeholder data; real content added manually before ship.
- D-10: Tech tags rendered as inline pills per card (no interactivity).

**About Section**
- D-11: Prose: 2-3 sentences, short and direct. Final copy is Claude's.
- D-12: Stack grouped tags by category: Languages, Engines, Tools. Definition-list style. No progress bars.

**Timeline Section**
- D-13: Vertical timeline with dot-and-line. Accent line runs down left.
- D-14: 2-3 outcome bullets per role. Outcomes, not duty lists.
- D-15: Data: hardcoded HTML (not JSON-driven). Reverse-chronological.

**Contact Section**
- D-16: Two CTAs: email link + LinkedIn link. Not icon rows.
- D-17: No contact form.

### Claude's Discretion
- Final hero tagline wording (brief: technical + outcome, game systems + backend tools)
- Final about prose (brief: 2-3 sentences, professional focus)
- Contact section surrounding copy (if any)
- Footer content
- JS projects.js implementation details (fetch + DOM injection pattern)
- Placeholder project data in projects.json

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HERO-01 | Prominent hero section with name, professional title, and tagline | HTML content for empty `#hero` section; CSS `.hero__subtitle`, `.hero__tagline`, `.btn`, `.btn--primary` classes in components.css |
| HERO-02 | Single clear CTA linking to projects section | `<a href="#projects" class="btn btn--primary">` anchored to existing `#projects` section |
| PROJ-01 | Projects section with cards; text + tech tags + marketplace link | HTML card structure + `.projects__grid`, `.project-card`, `.pill`, `.btn--outline` CSS; `data/` directory creation |
| PROJ-02 | Each card contains problem statement, technical highlight, and outcome | JSON schema + JS DOM injection; copywriting contract in UI-SPEC |
| PROJ-03 | Project data stored in `data/projects.json`, loaded via `fetch()` | `js/projects.js` ES module; GitHub Pages same-origin fetch works with relative paths |
| ABOUT-01 | Professional about section covering stack, role, what Riccardo builds — no progress bars | HTML for `#about`; `.about__prose`, `.about__stack`, `.about__stack-group`, `.pill` CSS classes |
| TIME-01 | Work experience timeline, compact, inline on page | HTML for `#timeline`; `.timeline`, `.timeline__entry` CSS; hardcoded HTML per D-15 |
| CONTACT-01 | Contact section with email (`mailto:`) and LinkedIn — styled as clear CTAs | HTML for `#contact`; reuses `.btn`, `.btn--primary`, `.btn--outline`; `.contact__actions` CSS |
</phase_requirements>

---

## Summary

Phase 2 fills five empty `<section>` elements in an already-complete HTML shell. Every section contains only an HTML comment placeholder — there is zero content in any of them. The Phase 1 foundation is thorough: all design tokens are in `css/tokens.css`, layout rules are in `css/layout.css`, and the `@layer` architecture is established in `css/tokens.css` line 1. The reset, base, and component layers are all active with no naming conflicts against any Phase 2 class names listed in the UI-SPEC.

The implementation is pure content authoring: write HTML into existing sections, add CSS component classes to `css/components.css` inside the existing `@layer components` block, create `data/projects.json`, and write `js/projects.js`. No structural changes to index.html, no new CSS files, no new layers. The approved UI-SPEC (02-UI-SPEC.md) provides exact pixel specs, token names, and class names for every component — the planner's job is to translate that spec into tasks, not re-derive design decisions.

The only technically interesting piece is `js/projects.js` with its `fetch()` call. On GitHub Pages, fetching a same-origin relative URL (`data/projects.json`) does not trigger CORS — the file is served from the same `*.github.io` origin. The only path risk is the relative path resolution, addressed in detail below.

**Primary recommendation:** Decompose into three parallel waves. Wave 0 creates data/projects.json and js/projects.js (the fetch infra). Wave 1 writes HTML + CSS for hero, about, contact, and footer in parallel (pure static content, zero dependencies). Wave 2 writes HTML + CSS for timeline (hardcoded HTML, independent) and wires the projects section to the JS output.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Hero HTML content | Browser / Client (static HTML) | — | Pure static markup in `index.html` |
| Projects card rendering | Browser / Client (vanilla JS ES module) | Static JSON file | JS reads JSON, injects DOM; no server |
| About, timeline, contact HTML | Browser / Client (static HTML) | — | Hardcoded markup per D-11, D-13, D-15 |
| CSS component styles | Browser / Client (CSS `@layer components`) | — | Extends existing components.css |
| projects.json data file | CDN / Static (GitHub Pages) | — | Served as a static file, no processing |
| Error state for projects | Browser / Client (vanilla JS fallback) | — | Inline error message rendered by projects.js |

---

## Codebase Snapshot

### What exists (Phase 1 complete)

**`index.html`** — 87 lines. Full HTML shell with:
- `<head>`: all `<meta>`, OG tags, font preloads, all 6 CSS `<link>` tags, favicons.
- `<body>`: skip link, `<header>` with nav (including hamburger), `<main id="main-content">` with 5 empty `<section>` elements, empty `<footer>`, and one `<script type="module" src="js/nav.js">`.
- **All 5 sections contain only an HTML comment.** Nothing is filled in.

**`css/tokens.css`** — 53 lines. Full token system: colors, spacing (8-pt grid), typography (sizes, weights, line-heights), layout (max-width, nav-height), z-index. The `@layer` declaration order is here (line 1).

**`css/reset.css`** — 27 lines. Box-sizing, margin/padding reset, list-style reset, img/svg display:block, button reset.

**`css/base.css`** — 88 lines. `@font-face` for Space Grotesk 400 and Inter 400, scroll-padding-top for nav, smooth scroll media query, paper texture on `body::before`, body defaults, `a` and `a:hover`, heading rules (h1–h6 all inherit display font; h1 gets display size; h2 gets heading size + semibold weight).

**`css/layout.css`** — 42 lines. `body` overflow-x:hidden, `main` max-width + padding-inline (32px mobile → 48px tablet+), `section` padding-block (48px mobile → 64px desktop) + min-height 200px placeholder, `footer` background + padding.

**`css/components.css`** — 125 lines. Only nav-related classes: `.skip-link`, `header`, `nav`, `nav ul`, `.nav-link`, `.nav-link--active`, `.nav__hamburger`, and the mobile `@media (max-width: 639px)` block. **No Phase 2 component classes exist yet.**

**`css/animations.css`** — 7 lines. Empty `@layer animations` block with reduced-motion media query placeholder. Phase 3 only.

**`js/nav.js`** — 49 lines. IntersectionObserver for active nav link, hamburger toggle. Uses `document.querySelectorAll('main section[id]')` — this correctly picks up all 5 sections.

**`assets/`**:
- `fonts/`: space-grotesk-400.woff2, inter-400.woff2 (and leftover Phase 1 files: cormorant-garamond-400.woff2, cormorant-garamond-600.woff2, lora-400.woff2 — these are unused but harmless)
- `textures/paper-grain.png` — the PNG noise tile
- `favicon.ico`, `favicon.svg`, `og-image.png`

**`data/` directory** — does NOT exist yet. Must be created.

**`js/projects.js`** — does NOT exist yet. Must be created.

### What is placeholder / needs Phase 2 work

| Location | Current State | Phase 2 Action |
|----------|---------------|----------------|
| `#hero` section | Empty HTML comment | Add H1, subtitle, tagline, CTA button |
| `#projects` section | Empty HTML comment | Add `<h2>`, `.projects__grid` wrapper (JS fills cards) |
| `#about` section | Empty HTML comment | Add `<h2>`, prose, stack groups |
| `#timeline` section | Empty HTML comment | Add `<h2>`, full timeline HTML |
| `#contact` section | Empty HTML comment | Add `<h2>`, surrounding copy, CTA buttons |
| `<footer>` | Empty HTML comment | Add copyright paragraph |
| `css/components.css` | Nav styles only | Append all Phase 2 component classes inside `@layer components` |
| `data/projects.json` | Does not exist | Create with 3 placeholder entries |
| `js/projects.js` | Does not exist | Create ES module |
| `index.html` body end | Only nav.js script | Add `<script type="module" src="js/projects.js">` |

---

## Standard Stack

### Core (all already in place — no new installs)

| Technology | Version/Spec | Purpose | Status |
|------------|-------------|---------|--------|
| HTML5 | Living standard | Content markup | In use |
| CSS3 with `@layer` | Baseline 2022 | Component styles | In use |
| Vanilla JS ES modules | ES2020 | Data loading (projects.js) | Pattern established in nav.js |
| `fetch()` API | Baseline 2017 | JSON data loading | Standard browser API |
| `DocumentFragment` | Baseline 2015 | Batch DOM injection | Standard browser API |

**No new packages, no npm installs.** This phase is zero-dependency.

---

## Architecture Patterns

### System Architecture — Data Flow Diagram

```
Browser Load
     │
     ├─── index.html parsed
     │         │
     │         ├─── CSS cascade: tokens → reset → base → layout → components → animations
     │         │    (all 6 files already linked; Phase 2 adds rules inside @layer components)
     │         │
     │         ├─── Static HTML sections rendered (hero, about, timeline, contact, footer)
     │         │    (all markup hardcoded in index.html)
     │         │
     │         └─── <script type="module" src="js/projects.js"> deferred
     │
     ├─── js/nav.js executes (existing)
     │    └─── IntersectionObserver on all 5 sections (no change needed)
     │
     └─── js/projects.js executes
               │
               ├─── fetch('data/projects.json')  ← same-origin, no CORS issue
               │         │
               │         ├─ SUCCESS → parse JSON array
               │         │           → build DocumentFragment with .project-card elements
               │         │           → append to #projects
               │         │
               │         └─ FAILURE → inject error state <p> into #projects
               │                      "Projects currently unavailable. View my work on GitHub."
               │
               └─── DOM output: 3 .project-card elements inside #projects
```

### Recommended Project Structure (additions only)

```
(existing)
├── index.html           — add content to 5 sections + footer
├── css/
│   └── components.css   — append Phase 2 component classes (same file, @layer components)
data/                    — CREATE NEW DIRECTORY
└── projects.json        — 3 placeholder project entries
js/
├── nav.js               — no changes
└── projects.js          — CREATE NEW FILE, ES module
```

### Pattern 1: Appending to `@layer components`

**What:** All new CSS goes inside the existing `@layer components` block in `css/components.css`. Do not open a new `@layer` block.

**When to use:** Every Phase 2 component style.

**Example:**
```css
/* Source: css/components.css — append after existing nav styles */
@layer components {
  /* ... existing nav styles ... */

  /* ===== Phase 2: Hero ===== */
  .hero__subtitle { ... }
  .hero__tagline  { ... }

  /* ===== Phase 2: Buttons ===== */
  .btn { ... }
  .btn--primary { ... }
  .btn--outline { ... }
}
```

**Important:** The `@layer components` block appears once in components.css wrapping all rules. Do not add a second `@layer components { }` block — cascade layers merge all blocks with the same name, but it is cleaner to have one.

### Pattern 2: JS DocumentFragment injection

**What:** Build all card DOM nodes into a `DocumentFragment`, then append once to `#projects`. Avoids repeated reflows.

**When to use:** `js/projects.js` only.

**Example:**
```javascript
// Source: MDN Web Docs — DocumentFragment pattern
async function loadProjects() {
  const container = document.querySelector('#projects');
  try {
    const res = await fetch('data/projects.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const projects = await res.json();
    const fragment = document.createDocumentFragment();
    projects.forEach(project => {
      const card = buildCard(project);
      fragment.appendChild(card);
    });
    container.appendChild(fragment);
  } catch {
    container.innerHTML =
      '<p class="projects__error">Projects currently unavailable. ' +
      '<a href="https://github.com/corsiriccardo">View my work on GitHub</a>.</p>';
  }
}
loadProjects();
```

### Pattern 3: Hero section flex layout

**What:** Hero uses `display:flex; flex-direction:column; align-items:center; justify-content:center` with `min-height: calc(100vh - var(--nav-height))` to fill the first viewport. All centering is CSS — no JS required.

**When to use:** `#hero` section styling in components.css.

### Pattern 4: Timeline accent line via pseudo-element

**What:** `.timeline::before` creates the absolute-positioned vertical amber line. Each `.timeline__entry::before` creates the dot. Both use `--color-accent`. The dot gets `border: 2px solid var(--color-bg-dominant)` for a knockout halo.

**When to use:** `.timeline` component in components.css.

### Anti-Patterns to Avoid

- **Opening a second `@layer components` block:** Creates visual confusion even though cascade merges them. Add to the existing block.
- **Using `min-height: 200px` on `#hero`:** layout.css already sets `section { min-height: 200px }` as a Phase 1 placeholder. The hero override needs `min-height: calc(100vh - var(--nav-height))` as a more specific rule in components.css — or use the ID selector `#hero { min-height: ... }` which wins over the `section` type selector in the same layer.
- **Hardcoding color values:** All colors must use `--color-*` tokens. No hex values in components.css.
- **Hardcoding spacing values:** All spacing must use `--space-*` tokens. The only exceptions are the timeline dot (12px) and its gutter offset — both are noted in the UI-SPEC as intentional off-grid decorative values.
- **Using `<script defer>` for projects.js:** It is `type="module"` — ES modules are deferred by default. Do not add a `defer` attribute; it is redundant and signals misunderstanding to future readers.
- **Absolute URL in fetch():** `fetch('/data/projects.json')` will fail during local `file://` development. Use `fetch('data/projects.json')` (no leading slash) — this is a relative path that resolves correctly both locally (with a dev server) and on GitHub Pages.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS variable fallbacks | Custom JS polyfill | Native CSS custom properties — already in tokens.css | All target browsers support CSS variables; polyfill is dead weight |
| Smooth scroll | JS scroll library | `html { scroll-behavior: smooth }` — already in base.css | Native, already implemented |
| Icon rendering | Icon font library (FontAwesome CDN) | Inline SVG | Confirmed out of scope; nav.js hamburger already uses inline SVG as the pattern |
| Touch targets | JS resize observer | CSS `min-height: 44px` with padding | Already established in nav component; same pattern for buttons |
| DOM batching | Virtual DOM / diff library | `DocumentFragment` | Native, zero-dependency, sufficient for 3 cards |

---

## GitHub Pages `fetch()` Behavior

**Verdict: safe with relative path.** [VERIFIED: GitHub Community discussions]

**How it works:**
- `corsiriccardo.github.io` serves all files from a single origin: `https://corsiriccardo.github.io`.
- `fetch('data/projects.json')` resolves relative to the page URL: `https://corsiriccardo.github.io/data/projects.json`.
- This is a same-origin request. CORS does not apply to same-origin requests.
- GitHub Pages serves JSON files with `Content-Type: application/json` (inferred from extension). No server-side configuration needed.

**The leading-slash trap:**
- `fetch('/data/projects.json')` also works on GitHub Pages if the repo is at root (user/org pages at `username.github.io` are always at the root path). This project is `corsiriccardo.github.io` — a user Pages site at root — so both `/data/projects.json` and `data/projects.json` resolve identically.
- However, `'data/projects.json'` (no leading slash) is safer: it works in local `file://` (if running a local server at root) and is resilient if the site were ever served from a subdirectory. Use the relative form.

**Local dev note:** `fetch()` from `file://` protocol fails with a CORS error in most browsers because browsers treat `file://` as an opaque origin. Use a local HTTP server (`python3 -m http.server 8000` or `npx serve .`) during development. This is worth noting in implementation plans.

**Error handling requirement:** Per UI-SPEC and CONTEXT.md D-09, `js/projects.js` must catch fetch failures gracefully and render the inline error message. This covers: HTTP 404 (wrong path), network failure, and JSON parse error.

---

## Existing CSS Token Inventory (Phase 2 relevant)

All tokens confirmed [VERIFIED: reading css/tokens.css]:

### Colors
| Token | Value | Phase 2 Usage |
|-------|-------|---------------|
| `--color-bg-dominant` | `#F5F0E8` | Hero, about, timeline, contact section backgrounds (inherited from body) |
| `--color-bg-secondary` | `#EDE8DF` | Project card backgrounds, footer background (already set in layout.css) |
| `--color-text-primary` | `#2C2416` | All headings, card copy, body prose, timeline bullets |
| `--color-text-secondary` | `#6B5D4F` | Hero subtitle, timeline meta, about group labels, footer copyright, pill text |
| `--color-accent` | `#8B6914` | CTA buttons (fill + border), timeline line + dots, pill border on hover |

### Spacing
| Token | Value | Key Phase 2 Usage |
|-------|-------|-------------------|
| `--space-xs` | 4px | Pill padding vertical, gap between pills, timeline bullet gap |
| `--space-sm` | 8px | Gap between pills, card inner vertical gap, marketplace button padding-block |
| `--space-md` | 16px | Card internal padding, about label/tag gap, marketplace button padding-inline |
| `--space-lg` | 24px | Card padding all sides, gap between dual CTA buttons, contact heading margin-bottom |
| `--space-xl` | 32px | Gap between project cards, hero element stack gap, timeline padding-left |
| `--space-2xl` | 48px | Section padding-block mobile (layout.css — already applied to all sections) |
| `--space-3xl` | 64px | Section padding-block desktop (layout.css — already applied to all sections) |

### Typography
| Token | Value | Phase 2 Role |
|-------|-------|-------------|
| `--font-family-display` | `'Space Grotesk', system-ui, sans-serif` | H1, H2, H3, hero subtitle |
| `--font-family-body` | `'Inter', system-ui, sans-serif` | All prose, pills, labels, buttons |
| `--font-size-label` | `0.875rem` | Pills, timeline meta, about group labels, footer |
| `--font-size-body` | `1rem` | Card copy, about prose, timeline bullets, button text |
| `--font-size-heading` | `1.5rem` | Section h2, card h3, hero subtitle |
| `--font-size-display` | `3rem` | Hero H1 only |
| `--font-weight-regular` | `400` | All prose, hero H1, hero subtitle |
| `--font-weight-semibold` | `600` | h2 section headings, card h3, timeline company name |
| `--line-height-tight` | `1.1` | Hero H1 |
| `--line-height-heading` | `1.3` | Hero subtitle, section headings |
| `--line-height-body` | `1.6` | All prose, timeline bullets |
| `--line-height-label` | `1.4` | Pills, labels, footer |

### Layout
| Token | Value | Phase 2 Usage |
|-------|-------|---------------|
| `--max-width` | `1200px` | Already applied to `main` in layout.css — no Phase 2 action |
| `--nav-height` | `64px` | Hero `min-height: calc(100vh - var(--nav-height))` |
| `--z-texture` | `9999` | No Phase 2 action — body::before is already set |
| `--z-nav` | `100` | No Phase 2 action |

### Existing component classes (do not collide with these)
| Class | Current Use | Collision risk with Phase 2 |
|-------|------------|------------------------------|
| `.skip-link` | Keyboard accessibility | None — different prefix |
| `.nav-link` | Nav anchor | None — different prefix |
| `.nav-link--active` | Active nav state | None — different prefix |
| `.nav__hamburger` | Mobile menu button | None — different prefix |
| `.nav--open` | Mobile menu open state | None — different prefix |

**h2 collision note:** `base.css` already styles `h2 { font-size: var(--font-size-heading); font-weight: var(--font-weight-semibold); }`. Phase 2 does NOT need to re-declare these rules on section h2 elements — they inherit automatically. The planner should NOT write redundant h2 CSS rules.

**h3 note:** `base.css` styles `h1–h6` with display font and heading line-height, but does NOT set a specific size or weight for h3 (only h1 and h2 have explicit rules). Project card h3 elements need explicit size/weight rules in components.css: `font-size: var(--font-size-heading); font-weight: var(--font-weight-semibold)`.

---

## Implementation Order & Wave Decomposition

### Rationale

Phase 2 has two dependency chains:
1. **HTML content sections** — all independent of each other; any can be written in any order.
2. **JS data layer** — `data/projects.json` must exist before `js/projects.js` can be tested; `#projects` section HTML needs a `<h2>` and grid wrapper before JS injects cards.

The right decomposition is three waves:

### Wave 0 — Data layer and JS module (prerequisite for projects section testing)

Estimated complexity: medium (JS module with error handling)

| Task | File(s) | Notes |
|------|---------|-------|
| Create `data/projects.json` | `data/projects.json` | 3 placeholder entries per UI-SPEC schema |
| Create `js/projects.js` | `js/projects.js` | fetch → parse → build fragment → inject |
| Add `<script type="module" src="js/projects.js">` | `index.html` | One line, bottom of `<body>` |

### Wave 1 — Static HTML sections + CSS (fully parallelizable)

All four tasks are independent. Can be done by a single implementer sequentially, or by parallel workers.

| Task | Files | Dependencies |
|------|-------|-------------|
| Hero section HTML + CSS | `index.html` (#hero), `css/components.css` | None — self-contained |
| About section HTML + CSS | `index.html` (#about), `css/components.css` | None — self-contained |
| Contact section HTML + CSS + footer | `index.html` (#contact, footer), `css/components.css` | None — self-contained |
| Timeline section HTML + CSS | `index.html` (#timeline), `css/components.css` | None — self-contained |

**Note on CSS:** All 4 tasks add classes to `css/components.css`. With parallel execution, ensure each task appends a clearly delimited block (e.g., `/* === Hero === */`, `/* === Timeline === */`) and does not overwrite the other's additions. In sequential single-agent execution, this is handled naturally.

### Wave 2 — Projects section HTML scaffolding

| Task | Files | Dependencies |
|------|-------|-------------|
| Projects section HTML scaffold | `index.html` (#projects) | Wave 0 complete (JS injects into the scaffold) |
| Projects CSS | `css/components.css` | Wave 0 JS exists (needed for visual testing) |

**Why Wave 2, not Wave 1?** The projects section HTML is just a heading and a grid wrapper — JS injects the cards. Technically the HTML scaffold is independent. However, the section is only visually testable after Wave 0 (projects.js injects the card content). Grouping it in Wave 2 means the implementer can test it with real card output.

### Recommended execution order (single-agent sequential)

1. Wave 0: `data/projects.json` → `js/projects.js` → `index.html` script tag
2. Wave 1A: Hero HTML + CSS
3. Wave 1B: About HTML + CSS
4. Wave 1C: Timeline HTML + CSS
5. Wave 1D: Contact HTML + CSS + footer
6. Wave 2: Projects section HTML scaffold + CSS

---

## Integration Risks and Gotchas

### Risk 1: `section { min-height: 200px }` in layout.css

**What goes wrong:** `layout.css` has `section { min-height: 200px }` as a Phase 1 shell placeholder. Once sections have real content, this min-height may cause unexpected spacing on small-content sections (footer is not a section, so it is safe). The hero needs `min-height: calc(100vh - var(--nav-height))`, which overrides the 200px value.

**How to avoid:** In components.css, use the ID selector `#hero { min-height: calc(100vh - var(--nav-height)); }`. A component-layer ID selector beats a layout-layer type selector per cascade layer order (`@layer components` comes after `@layer layout`). The other sections do not need an explicit min-height override — their content will be taller than 200px.

**Warning sign:** If `#hero` looks too short at desktop, the min-height override was not applied.

### Risk 2: `@layer components` block conflict

**What goes wrong:** Implementer creates a second `@layer components { }` block in components.css instead of appending inside the existing one.

**How to avoid:** The file opens with `@layer components {` on line 1. All new Phase 2 styles must go before the closing `}` on the last line. Append, do not create a second block.

**Note:** If a second block is accidentally created, CSS cascade will still work (same-name layers merge), but it is a code quality issue that confuses future readers.

### Risk 3: `color-mix()` browser support

**What goes wrong:** The UI-SPEC uses `color-mix(in srgb, ...)` for card borders and pill backgrounds. This is a CSS Color Level 5 feature supported in all modern browsers as of 2023, but could fail in older browsers.

**How to handle:** Project stack is GitHub Pages static portfolio — no IE, no legacy browser requirement. `color-mix()` has full Baseline 2023 support in Chrome 111+, Firefox 113+, Safari 16.2+. [ASSUMED: user's audience is recruiters on modern browsers — this is consistent with the project's stated stack and constraints.] Include a fallback color for safety: write the fallback `border-color` value on the line before the `color-mix()` value.

**Example:**
```css
border: 1px solid rgba(44, 36, 22, 0.12); /* fallback */
border: 1px solid color-mix(in srgb, var(--color-text-primary) 12%, transparent);
```

### Risk 4: Projects section h2 vs. injected cards layout

**What goes wrong:** `#projects` needs both a `<h2>Projects</h2>` heading (static HTML) and a `.projects__grid` div (where JS injects cards). If the section HTML only has the heading and no grid wrapper, JS would have to inject after the heading — fragile. If the section HTML has only the grid, there is no heading.

**How to avoid:** `#projects` should contain both:
```html
<section id="projects" aria-label="Projects">
  <h2>Projects</h2>
  <div class="projects__grid">
    <!-- js/projects.js injects .project-card elements here -->
  </div>
</section>
```
`js/projects.js` queries `document.querySelector('.projects__grid')` (not `#projects`) as the injection target. This is cleaner than querying the section directly.

### Risk 5: Timeline dot positioning math

**What goes wrong:** `.timeline__entry::before` (the dot) uses `left: calc(-1 * var(--space-xl) + 4px)` to position on the line. `.timeline::before` (the line) uses `left: 10px`. `.timeline` has `padding-left: var(--space-xl)` (32px). If these values become inconsistent, the dot does not land on the line.

**How to avoid:** The UI-SPEC specifies exact values. Implement them exactly as specified:
- `.timeline { padding-left: var(--space-xl); position: relative; }`
- `.timeline::before { position: absolute; left: 10px; top: 0; bottom: 0; width: 2px; background: var(--color-accent); }`
- `.timeline__entry { position: relative; padding-bottom: var(--space-2xl); }`
- `.timeline__entry::before { position: absolute; left: calc(-1 * var(--space-xl) + 4px); top: 6px; width: 12px; height: 12px; border-radius: 50%; background: var(--color-accent); border: 2px solid var(--color-bg-dominant); }`

Math check: padding-left = 32px. Line is at 10px. Dot left = calc(-32px + 4px) = -28px from entry left edge = 32 - 28 = 4px from section left. Line center = 10px + 1px = 11px. Dot center = 4px + 6px = 10px. Close alignment — one pixel off from line center. This is the exact spec from UI-SPEC; implement as-is.

### Risk 6: `data/` directory does not exist

**What goes wrong:** Wave 0 must create the `data/` directory. On GitHub Pages, directories are implicit (no directory listing) — the file just needs to exist at the right path. But locally, the directory must exist before committing `projects.json`.

**How to avoid:** Create the directory and file together. Verify the file path is `data/projects.json` (lowercase) before committing.

### Risk 7: Inter 600 semibold weight not loaded

**What goes wrong:** The UI-SPEC specifies timeline company name as `font-weight: 600` (Space Grotesk semibold) — correct, Space Grotesk @font-face declares `font-weight: 400 500` which covers 400 and 500. Weight 600 is NOT in the Space Grotesk @font-face rule in base.css.

**Analysis:** [VERIFIED: reading css/base.css] Space Grotesk @font-face: `font-weight: 400 500`. The UI-SPEC specifies h2, h3, and timeline company name as weight 600. Since only one Space Grotesk WOFF2 file is loaded (space-grotesk-400.woff2), the browser will apply font synthesis for weight 600, making it appear slightly bold. This is a Phase 1 decision that carries into Phase 2.

**Decision:** Do not add a new WOFF2 file in Phase 2 (out of scope). Use `font-weight: var(--font-weight-semibold)` as specified — base.css already uses `--font-weight-semibold: 600` on h2, so this is consistent. Browser font synthesis is acceptable for a portfolio site. Flag this for Phase 3 if visual fidelity requires a true 600-weight file.

### Risk 8: Inter only has weight 400 loaded

**What goes wrong:** Inter @font-face in base.css declares `font-weight: 400` only. If any Phase 2 code accidentally uses `font-weight: 600` on Inter text, it will synthesize bold Inter — which looks noticeably worse than 400.

**How to avoid:** Per UI-SPEC, semibold (600) is reserved for Space Grotesk only (headings). All Inter text is weight 400. Do not apply weight 600 to any Inter element. Pill text, button text, body copy, timeline bullets — all Inter at 400.

---

## Common Pitfalls

### Pitfall 1: fetch() fails during local `file://` development

**What goes wrong:** Developer opens `index.html` directly in the browser (double-click, file:// URL). `fetch('data/projects.json')` throws a CORS error or network error because `file://` origins cannot make fetch requests to other `file://` paths in most browsers.

**Why it happens:** Browser security policy treats `file://` as an opaque origin. Fetch API requires HTTP(S).

**How to avoid:** Always develop with a local HTTP server:
- `python3 -m http.server 8000` from project root → visit `http://localhost:8000`
- `npx serve .` from project root (no install needed with npx)
- VS Code Live Server extension

**Warning signs:** Browser console shows "CORS error" or "Failed to fetch" on `data/projects.json` when opening via file://. The error state message renders instead of cards.

### Pitfall 2: Missing `content: ''` on pseudo-elements

**What goes wrong:** `.timeline::before` (accent line) and `.timeline__entry::before` (dot) are pseudo-elements. Without `content: ''`, they do not render even if all other properties are correct.

**Why it happens:** CSS pseudo-elements require the `content` property to be present (even as empty string) to generate a box.

**How to avoid:** Include `content: '';` as the first property in both pseudo-element rules.

### Pitfall 3: JS `projects.js` queries `#projects` instead of `.projects__grid`

**What goes wrong:** If `projects.js` does `document.querySelector('#projects').appendChild(fragment)`, cards are injected directly into the section — before or mixed with the h2 heading, breaking visual order.

**How to avoid:** Query the grid wrapper: `document.querySelector('.projects__grid')`. If the element is not found, log a warning and return rather than crashing.

### Pitfall 4: `margin-top: auto` on `.project-card__actions` requires flex parent

**What goes wrong:** The `margin-top: auto` trick (pushes actions to card bottom) only works when the card is a flex container. If `.project-card` is not `display: flex; flex-direction: column`, `margin-top: auto` has no effect.

**How to avoid:** Ensure `.project-card` is `display: flex; flex-direction: column; gap: var(--space-md)`.

### Pitfall 5: Timeline last entry has extra bottom padding

**What goes wrong:** `.timeline__entry` has `padding-bottom: var(--space-2xl)` (48px). The last entry does not need this — it creates visual imbalance with the section's own padding-block.

**How to avoid:** Add `.timeline__entry:last-child { padding-bottom: 0; }`.

---

## Copywriting Contract (from UI-SPEC — locked)

| Element | Copy | Source |
|---------|------|--------|
| Hero H1 | `Riccardo Corsi` | UI-SPEC approved |
| Hero subtitle | `Software Developer` | UI-SPEC approved |
| Hero tagline | `I build game systems and backend tools engineered to ship, scale, and stay fast.` | UI-SPEC approved |
| Hero CTA | `View my work ↓` | UI-SPEC approved |
| Projects heading | `Projects` | UI-SPEC approved |
| About heading | `About` | UI-SPEC approved |
| About prose | `I build tools for game developers — systems that bridge engine internals with production realities in Unreal and Unity. I care about correctness under pressure: code that performs reliably whether running in a game loop or a build pipeline. Currently focused on cross-engine tooling and backend infrastructure for game projects.` | UI-SPEC approved |
| Timeline heading | `Experience` | UI-SPEC approved |
| Contact heading | `Contact` | UI-SPEC approved |
| Contact surrounding copy | `Available for freelance projects and full-time roles. Reach out directly.` | UI-SPEC approved |
| Contact email CTA | `Email` | UI-SPEC approved |
| Contact LinkedIn CTA | `LinkedIn` | UI-SPEC approved |
| Footer | `© 2026 Riccardo Corsi` | UI-SPEC approved |
| Projects error state | `Projects currently unavailable. View my work on GitHub.` | UI-SPEC approved |

**Email address:** `riccardocorsi.developer@gmail.com` (from project CLAUDE.md env context)
**LinkedIn URL:** `https://linkedin.com/in/riccardocorsi` (from UI-SPEC contact section)
**GitHub URL:** `https://github.com/corsiriccardo` (from UI-SPEC error state)

---

## Runtime State Inventory

Step 2.5 SKIPPED — this is a content-fill phase, not a rename/refactor/migration phase. No runtime state is affected.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Browser (any modern) | All | ✓ | Baseline 2022+ | — |
| Local HTTP server | `fetch()` during dev | ✓ | python3 or npx serve | `python3 -m http.server 8000` |
| GitHub Pages | Deployment | ✓ | — | — |

No external tooling dependencies. Zero npm packages needed for Phase 2.

---

## Validation Architecture

`workflow.nyquist_validation` is explicitly `false` in `.planning/config.json` — this section is omitted per the skip condition.

---

## Security Domain

This phase introduces no authentication, no user input, no server-side processing, and no secrets. The only potential vector is the `<a target="_blank">` on marketplace and LinkedIn links.

**Mitigation already specified in UI-SPEC:** All external links must include `rel="noopener noreferrer"`. This prevents the opened page from accessing `window.opener` (tabnabbing prevention). This is the standard defense — specified and required in every external link in the UI-SPEC.

No additional ASVS categories apply to static content sections with no user input.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | User's audience uses modern browsers (Chrome 111+, Firefox 113+, Safari 16.2+) — `color-mix()` is safe without polyfill | Integration Risks, Risk 3 | Some visitors see raw fallback border colors instead of warm tinted borders — visual degradation only, no functional breakage |
| A2 | LinkedIn profile URL is `https://linkedin.com/in/riccardocorsi` — taken from UI-SPEC | Copywriting Contract | Link goes to wrong person / 404 — user must verify before ship |
| A3 | GitHub profile URL is `https://github.com/corsiriccardo` — taken from UI-SPEC | Copywriting Contract | Error state link goes to wrong profile — user must verify before ship |
| A4 | Timeline work experience entries are not in the CONTEXT.md or any planning file — Claude must write placeholder timeline entries or the task description must instruct the user to provide them | Implementation Order | Timeline section has placeholder copy rather than real CV data — acceptable for Phase 2 (real content added manually before ship, same as projects.json) |

**Note on A4:** The CONTEXT.md locks the timeline format (D-13, D-14, D-15) and the UI-SPEC specifies the HTML structure, but no actual work history is provided anywhere in the planning files. The plan should either (a) instruct the implementer to write 2-3 placeholder timeline entries matching the structure, or (b) note that the user must provide CV content. This is the only piece of content that is not already written in the Copywriting Contract.

---

## Open Questions

1. **Timeline work history content**
   - What we know: Format is locked (D-13 through D-15). Structure is specified. Copy must be outcome-framed. Reverse-chronological.
   - What's unclear: Actual company names, roles, dates, and bullet outcomes. No CV data is provided in any planning file.
   - Recommendation: Implementation plan should generate 2 placeholder timeline entries (matching the spec structure) and note clearly that the user must replace the placeholder copy with real CV data before ship — same pattern as `data/projects.json`.

2. **Space Grotesk weight 600 rendering**
   - What we know: Only space-grotesk-400.woff2 is loaded. Base.css @font-face covers weight 400–500.
   - What's unclear: Whether font synthesis for weight 600 produces an acceptable visual on all browsers.
   - Recommendation: Accept synthesis for Phase 2. Flag for Phase 3 visual QA. If unacceptable, add space-grotesk-600.woff2 in Phase 3.

---

## Sources

### Primary (HIGH confidence)
- `E:\Projects\corsiriccardo.github.io\css\tokens.css` — all token values verified by direct read
- `E:\Projects\corsiriccardo.github.io\css\components.css` — existing class names verified by direct read
- `E:\Projects\corsiriccardo.github.io\css\base.css` — @font-face declarations, h2 styles verified by direct read
- `E:\Projects\corsiriccardo.github.io\css\layout.css` — section min-height placeholder verified by direct read
- `E:\Projects\corsiriccardo.github.io\index.html` — section placeholder state verified by direct read
- `.planning/phases/02-core-content/02-UI-SPEC.md` — approved design contract, verified by direct read
- `.planning/phases/02-core-content/02-CONTEXT.md` — locked decisions, verified by direct read

### Secondary (MEDIUM confidence)
- [GitHub Community Discussion #22399](https://github.com/orgs/community/discussions/22399) — GitHub Pages same-origin fetch confirmed
- [GitHub Community Discussion #157852](https://github.com/orgs/community/discussions/157852) — GitHub Pages CORS headers and limitations
- MDN Web Docs — `DocumentFragment` API (training knowledge, consistent with current spec)

### Tertiary (LOW confidence)
- None.

---

## Metadata

**Confidence breakdown:**
- Codebase snapshot: HIGH — all files read directly
- Standard stack: HIGH — no external packages; all verified from existing codebase
- Architecture patterns: HIGH — derived from existing Phase 1 patterns
- Integration risks: HIGH — derived from direct code reading (base.css font declarations, layout.css min-height)
- GitHub Pages fetch: MEDIUM — confirmed via community discussions, consistent with browser spec
- Assumptions A2/A3 (URLs): LOW — copied from UI-SPEC, not independently verified

**Research date:** 2026-04-21
**Valid until:** 2026-05-21 (stable foundation — no external dependencies to become stale)
