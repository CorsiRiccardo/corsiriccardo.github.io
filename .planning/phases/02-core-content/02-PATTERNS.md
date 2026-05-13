# Phase 2: Core Content — Pattern Map

**Mapped:** 2026-04-21
**Files analyzed:** 4 (index.html, css/components.css, data/projects.json, js/projects.js)
**Analogs found:** 3 / 4 (data/projects.json has no analog — first of its kind)

---

## File Classification

| New/Modified File      | Role            | Data Flow        | Closest Analog         | Match Quality |
|------------------------|-----------------|------------------|------------------------|---------------|
| `index.html`           | static content  | request-response | `index.html` (Phase 1) | exact — fill existing placeholder sections |
| `css/components.css`   | style component | request-response | `css/components.css` (Phase 1 nav block) | exact — append inside existing `@layer components` |
| `data/projects.json`   | data file       | batch            | none                   | no analog     |
| `js/projects.js`       | JS module       | request-response | `js/nav.js`            | role-match    |

---

## Pattern Assignments

### `index.html` — 5 sections + footer (static content, request-response)

**Analog:** `index.html` lines 57–87 (Phase 1 shell — existing section structure)

**Section placeholder pattern** (lines 58–76):
```html
<section id="hero" aria-label="Introduction">
  <!-- Phase 2 content: hero name, title, tagline, CTA -->
</section>

<section id="projects" aria-label="Projects">
  <!-- Phase 2 content: project cards loaded from data/projects.json -->
</section>
```

**Pattern to replicate — hero fill:**
- Replace the HTML comment inside `#hero` with: `<h1>`, `<p class="hero__subtitle">`, `<p class="hero__tagline">`, `<a class="btn btn--primary">`.
- Do NOT restructure the `<section>` tag itself — the `id`, `aria-label`, and tag are already correct.
- `<a href="#projects" class="btn btn--primary">View my work ↓</a>` is a plain anchor, not a `<button>`.

**Pattern to replicate — projects scaffold:**
```html
<section id="projects" aria-label="Projects">
  <h2>Projects</h2>
  <div class="projects__grid">
    <!-- js/projects.js injects .project-card elements here -->
  </div>
</section>
```
Key: JS targets `.projects__grid`, NOT `#projects`. Heading is static; grid div is the injection point.

**Pattern to replicate — about fill:**
```html
<section id="about" aria-label="About">
  <h2>About</h2>
  <div class="about__content">
    <p class="about__prose">...</p>
    <dl class="about__stack">
      <div class="about__stack-group">
        <dt>Languages</dt>
        <dd><ul class="about__pills">
          <li><span class="pill">C++</span></li>
          ...
        </ul></dd>
      </div>
    </dl>
  </div>
</section>
```

**Pattern to replicate — timeline fill (hardcoded HTML per D-15):**
```html
<section id="timeline" aria-label="Work experience">
  <h2>Experience</h2>
  <ol class="timeline">
    <li class="timeline__entry">
      <div class="timeline__meta">
        <span class="timeline__year">2024 – present</span>
        <span class="timeline__company">Company Name</span>
        <span class="timeline__role">Job Title</span>
      </div>
      <ul class="timeline__bullets">
        <li>Shipped X that Y — outcome framed, not duty listed.</li>
      </ul>
    </li>
  </ol>
</section>
```
Note: Reverse-chronological. Newest entry first. 2-3 bullets per role. Entries are placeholder copy — user replaces before ship.

**Pattern to replicate — contact fill:**
```html
<section id="contact" aria-label="Contact">
  <h2>Contact</h2>
  <p>Available for freelance projects and full-time roles. Reach out directly.</p>
  <div class="contact__actions">
    <a href="mailto:riccardocorsi.developer@gmail.com" class="btn btn--primary">Email</a>
    <a href="https://linkedin.com/in/riccardocorsi" class="btn btn--outline"
       target="_blank" rel="noopener noreferrer">LinkedIn</a>
  </div>
</section>
```

**Pattern to replicate — footer fill:**
```html
<footer>
  <p class="footer__copy">© 2026 Riccardo Corsi</p>
</footer>
```

**Pattern to replicate — script tag (add at bottom of `<body>`, after existing nav.js line):**
```html
<script type="module" src="js/projects.js"></script>
```
Do NOT add `defer` — `type="module"` is already deferred by default.

**What NOT to do:**
- Do not restructure or re-order the `<section>` elements — their IDs match nav links in the existing `<nav>`.
- Do not change the `id`, `aria-label`, or outer tag of any section.
- Do not add `<script defer>` — redundant on type="module".

---

### `css/components.css` — Phase 2 component styles (style component, request-response)

**Analog:** `css/components.css` lines 1–125 (Phase 1 nav block — entire file)

**`@layer components` open/close pattern** (lines 1 and 125):
```css
@layer components {
  /* ... all rules ... */
}   /* ← single closing brace on line 125 */
```
All Phase 2 rules are APPENDED before this closing brace. There is exactly one `@layer components` block.

**Token-only value pattern** (lines 6–9, 51–57 from components.css):
```css
/* CORRECT: tokens only */
background-color: var(--color-bg-secondary);
color: var(--color-text-primary);
padding: var(--space-sm) var(--space-md);
font-family: var(--font-family-body);
font-size: var(--font-size-label);
```
No hex values, no raw px values. Only exceptions documented in RESEARCH.md Risk 5: timeline dot (12px) and its positioning (10px for line, 4px offset).

**color-mix() with fallback pattern** (lines 31–32 and 39 from components.css):
```css
/* Fallback first, then color-mix() on next line */
background-color: rgba(237, 232, 223, 0.95);
background-color: color-mix(in srgb, var(--color-bg-secondary) 95%, transparent);
```
```css
border-bottom: 1px solid color-mix(in srgb, var(--color-text-primary) 10%, transparent);
```
Apply same fallback pattern to: card border, pill background, pill border, btn--outline hover background.

**Touch target min-height pattern** (lines 59–61 from components.css):
```css
min-height: 44px;
display: flex;
align-items: center;
```
Apply to: `.btn`, `.btn--primary`, `.btn--outline`.

**Transition pattern** (line 57 from components.css):
```css
transition: border-color 200ms ease, color 200ms ease;
```
Apply same duration + easing to: `.btn` hover (opacity + transform), `.btn--outline` hover (background), `.nav-link` hover (already present).

**Section delimiter comment pattern** — use the same comment style as the Phase 1 nav block:
```css
/* ===== Phase 2: Hero ===== */
/* ===== Phase 2: Buttons ===== */
/* ===== Phase 2: Project Cards ===== */
/* ===== Phase 2: About ===== */
/* ===== Phase 2: Timeline ===== */
/* ===== Phase 2: Contact ===== */
/* ===== Phase 2: Footer ===== */
```

**Hero section ID override pattern** — use ID selector to beat layout.css type selector across layer boundary:
```css
/* In @layer components — wins over @layer layout section { min-height: 200px } */
#hero {
  min-height: calc(100vh - var(--nav-height));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0; /* individual margins handle stack gaps */
}
```

**What NOT to do:**
- Do not open a second `@layer components { }` block — append inside the existing one (line 125 is the only closing brace).
- Do not use `min-height: 200px` on `#hero` — layout.css already sets this on `section`; hero needs the viewport calc override.
- Do not hardcode any hex values. The only numeric exceptions are the three timeline geometry values (12px dot, 10px line left, 4px offset).
- Do not apply `font-weight: 600` to any Inter text — only Space Grotesk uses semibold in this project.
- Do not redeclare h2 styles — base.css already handles `font-size: var(--font-size-heading); font-weight: var(--font-weight-semibold)` on all h2 elements.

---

### `js/projects.js` — ES module, fetch + DOM injection (JS module, request-response)

**Analog:** `js/nav.js` lines 1–50 (entire file — sole existing JS module)

**Module header comment pattern** (lines 1–4 from nav.js):
```javascript
// js/projects.js
// ES module — fetch data/projects.json, build .project-card elements, inject into .projects__grid
```

**DOM query + null guard pattern** (lines 9–9 from nav.js):
```javascript
const hamburger = document.querySelector('.nav__hamburger');
const nav = document.querySelector('nav');
// ... later:
if (hamburger && nav) { ... }
```
Apply same null guard to projects.js:
```javascript
const grid = document.querySelector('.projects__grid');
if (!grid) {
  console.warn('projects.js: .projects__grid not found');
  return;
}
```

**No `export` keyword pattern** (nav.js uses no imports or exports):
```javascript
// nav.js is a self-contained module — no import/export
// projects.js follows the same pattern — one file, no exports needed
```

**Core DocumentFragment injection pattern** (from RESEARCH.md Pattern 2):
```javascript
async function loadProjects() {
  const grid = document.querySelector('.projects__grid');
  if (!grid) return;
  try {
    const res = await fetch('data/projects.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const projects = await res.json();
    const fragment = document.createDocumentFragment();
    projects.forEach((project) => {
      const card = buildCard(project);
      fragment.appendChild(card);
    });
    grid.appendChild(fragment);
  } catch {
    grid.innerHTML =
      '<p class="projects__error">Projects currently unavailable. ' +
      '<a href="https://github.com/corsiriccardo">View my work on GitHub</a>.</p>';
  }
}
loadProjects();
```

**Conditional marketplace buttons pattern** (from CONTEXT.md D-08):
```javascript
function buildActions(links) {
  const actions = document.createElement('div');
  actions.className = 'project-card__actions';
  links.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.url;
    a.textContent = link.label;
    a.className = 'btn btn--outline';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    actions.appendChild(a);
  });
  return actions;
}
```
When `links.length === 2`, the `project-card__actions` div uses `display: flex; gap: --space-sm` in CSS, and each `.btn--outline` gets `flex: 1` — both buttons equal width.

**What NOT to do:**
- Do not `fetch('/data/projects.json')` with a leading slash — use `'data/projects.json'` (relative, no leading slash) so it works both locally (with a dev server) and on GitHub Pages.
- Do not add `defer` attribute on the `<script>` tag — `type="module"` is deferred automatically.
- Do not query `'#projects'` as the injection target — query `'.projects__grid'` so cards inject after the static `<h2>`.
- Do not inject innerHTML for card content — use `createElement` + `textContent` / `appendChild` to avoid any XSS risk from JSON data.

---

### `data/projects.json` — data file (no analog)

No existing analog. The `data/` directory does not yet exist. This is the first data file in the project.

**JSON schema** (from CONTEXT.md D-07, D-08, D-10):
```json
[
  {
    "title": "Project Title",
    "description": "Problem statement in one sentence. Technical highlight in one sentence. Outcome in one sentence.",
    "tech": ["C++", "Unreal Engine", "Blueprint"],
    "links": [
      { "label": "Fab", "url": "https://fab.com/placeholder" }
    ]
  },
  {
    "title": "Cross-Engine Tool",
    "description": "Problem statement. Technical highlight. Outcome.",
    "tech": ["C++", "C#", "Unreal Engine", "Unity"],
    "links": [
      { "label": "Fab", "url": "https://fab.com/placeholder" },
      { "label": "Unity Marketplace", "url": "https://assetstore.unity.com/placeholder" }
    ]
  }
]
```

**Rules derived from CONTEXT.md and RESEARCH.md:**
- `links` is an array with 1 or 2 entries — never 0 (every project has at least one marketplace link).
- 3 total entries in the file (D-06).
- All values are placeholder text — user replaces real content before ship.
- All asset filenames and paths must be lowercase (from CLAUDE.md critical rules).

---

## Shared Patterns

### Token-only styling
**Source:** `css/components.css` throughout (lines 6–125), `css/tokens.css` lines 3–52
**Apply to:** All Phase 2 CSS rules in css/components.css

```css
/* Every color, spacing, typography, and z-index value must reference a token */
color: var(--color-text-primary);
padding: var(--space-lg);
font-family: var(--font-family-body);
font-size: var(--font-size-label);
```
The only documented exceptions are the three timeline geometry values (12px dot diameter, 10px line left, 4px dot offset) which are intentionally off the 8pt grid per RESEARCH.md Risk 5.

### color-mix() with CSS fallback
**Source:** `css/components.css` lines 31–32
**Apply to:** card border, pill background, pill border, btn--outline hover

```css
/* Always write the rgba fallback first, then color-mix() overrides it */
border: 1px solid rgba(44, 36, 22, 0.12);
border: 1px solid color-mix(in srgb, var(--color-text-primary) 12%, transparent);
```

### External link security
**Source:** `index.html` nav pattern + RESEARCH.md Security Domain
**Apply to:** All marketplace links in project cards, LinkedIn CTA, GitHub error state link

```html
target="_blank" rel="noopener noreferrer"
```
Every `<a>` that opens an external URL must include both attributes. No exceptions.

### Reduced-motion guard
**Source:** `css/base.css` lines 31–35 (scroll-behavior pattern)
**Apply to:** Any `transition` or `transform` property added in components.css

```css
@media (prefers-reduced-motion: reduce) {
  /* override any transform/transition to instant */
  .btn { transition: none; transform: none; }
}
```
From CLAUDE.md critical rules: "Always include `@media (prefers-reduced-motion: reduce)` on any animation."

### `content: ''` on pseudo-elements
**Source:** `css/base.css` line 39 (`body::before { content: ''; }`)
**Apply to:** `.timeline::before` (accent line), `.timeline__entry::before` (dot)

```css
.timeline::before {
  content: '';          /* required — pseudo-element won't render without this */
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--color-accent);
}
```

### Null guard before DOM operations
**Source:** `js/nav.js` lines 35–41 (`if (hamburger && nav) { ... }`)
**Apply to:** `js/projects.js` before fetch, before grid injection

```javascript
const grid = document.querySelector('.projects__grid');
if (!grid) {
  console.warn('projects.js: .projects__grid not found in DOM');
  return;
}
```

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `data/projects.json` | data file | batch | No JSON data files exist in the project yet; `data/` directory must be created |

---

## Metadata

**Analog search scope:** `E:/Projects/corsiriccardo.github.io/` — all existing source files
**Files read:** index.html, css/tokens.css, css/reset.css (skipped — not relevant), css/base.css, css/layout.css, css/components.css, js/nav.js, .planning/phases/02-core-content/02-CONTEXT.md, .planning/phases/02-core-content/02-RESEARCH.md, .planning/phases/02-core-content/02-UI-SPEC.md
**Pattern extraction date:** 2026-04-21
