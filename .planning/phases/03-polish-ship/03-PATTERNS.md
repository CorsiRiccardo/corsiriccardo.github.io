# Phase 3: Polish & Ship — Pattern Map

**Mapped:** 2026-04-22
**Files analyzed:** 3 (js/reveal.js new, css/animations.css modify, index.html modify)
**Analogs found:** 3 / 3

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `js/reveal.js` | utility (ES module) | event-driven (IO callback) | `js/nav.js` | exact — same IO setup, same unobserve pattern, same module conventions |
| `css/animations.css` | config (CSS layer fill) | transform (state class toggle) | `css/components.css` lines 197–235 | role-match — hover transitions + reduced-motion guards already there |
| `index.html` | config (HTML attribute addition) | — | `index.html` itself (lines 65–150) | exact — boolean data-* attribute pattern, same section structure |

---

## Pattern Assignments

### `js/reveal.js` (utility, event-driven)

**Analog:** `js/nav.js`

**Module header comment pattern** (`js/nav.js` lines 1–3):
```javascript
// js/nav.js
// ES module — active-link via Intersection Observer + hamburger toggle
// Matches section IDs: hero, projects, about, timeline, contact
```
Copy this exactly: one-line filename, one-line role description, one-line scope note. No JSDoc, no `export`.

**IntersectionObserver constructor pattern** (`js/nav.js` lines 14–28):
```javascript
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      // ... act on entry.target ...
    });
  },
  {
    rootMargin: `-${NAV_HEIGHT}px 0px -66% 0px`,
    threshold: 0,
  }
);
```
The reveal observer uses the same constructor shape but different config values:
- `rootMargin: '0px 0px -60px 0px'` (fire 60px before bottom edge — not section-tracking)
- `threshold: 0.1` (10% visibility trigger — not 0)
- Callback receives both `(entries, observer)` — observer ref needed for `unobserve()`

**querySelectorAll + observe loop pattern** (`js/nav.js` line 30–32):
```javascript
document.querySelectorAll('main section[id]').forEach((section) => {
  sectionObserver.observe(section);
});
```
Reveal version targets `[data-reveal]` attribute selector instead of `main section[id]`.

**Self-contained module convention** (`js/projects.js` lines 1–5):
```javascript
// js/projects.js
// ES module — fetch data/projects.json, build .project-card elements, inject into .projects__grid
// No import/export — self-contained module (same convention as js/nav.js)
```
`reveal.js` follows the same no-export, no-import convention. The entire module is an IIFE-style guard block.

**reduced-motion early-return pattern** (new to this codebase — no analog):
```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) {
  // all IO setup inside this block
}
```
CSS handles visibility for reduced-motion users (`opacity: 1; transform: none`). JS simply does nothing when the preference is set.

**Complete `js/reveal.js` implementation:**
```javascript
// js/reveal.js
// ES module — scroll reveal via IntersectionObserver
// Targets [data-reveal] elements. Adds .is-visible once, then unobserves.
// Returns early if prefers-reduced-motion: CSS already shows all elements at opacity:1.

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

**`<script>` tag pattern** (`index.html` lines 159–160):
```html
<script type="module" src="js/nav.js"></script>
<script type="module" src="js/projects.js"></script>
```
Add `reveal.js` as a third `type="module"` tag after `projects.js`. No `defer` attribute — ES modules are deferred by spec.

---

### `css/animations.css` (CSS layer fill, transform/opacity)

**Analog:** `css/components.css` (hover transitions + reduced-motion guards)

**`@layer` block structure** (`css/animations.css` lines 1–7 — the file to modify):
```css
@layer animations {
  /* Phase 3 — scroll reveal and hover transitions go here */

  @media (prefers-reduced-motion: reduce) {
    /* All animation overrides go here in Phase 3 */
  }
}
```
The outer `@layer animations { }` wrapper already exists. All Phase 3 CSS goes inside it. Do not add another layer declaration.

**Transition property pattern** (`css/components.css` lines 197, 208–210):
```css
/* .btn base: transition on opacity + transform only */
transition: opacity 200ms ease, transform 200ms ease, background-color 200ms ease;

/* .btn--primary hover: */
.btn--primary:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}
```
Reveal transition follows same `opacity Xms ease, transform Xms ease` shorthand. Card hover uses `transform 200ms ease, box-shadow 200ms ease` — matching the 200ms editorial timing already established.

**Reduced-motion guard pattern** (`css/components.css` lines 227–235):
```css
@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }

  .btn--primary:hover {
    transform: none;
  }
}
```
Copy this exact structure for `[data-reveal]` and `.project-card` overrides. Critical: reduced-motion block must restore `opacity: 1` and `transform: none` on `[data-reveal]` — not just set `transition: none`. If `transition: none` only, and `reveal.js` returns early, elements stay at `opacity: 0` and become invisible forever.

**Color token usage for box-shadow** (`css/components.css` lines 519–521):
```css
border: 1px solid rgba(44, 36, 22, 0.12);
border: 1px solid color-mix(in srgb, var(--color-text-primary) 12%, transparent);
```
Box-shadow on `.project-card:hover` uses the same `rgba(44, 36, 22, 0.12)` pattern — warm tint from `--color-text-primary` (#2C2416) at 12% opacity. No `color-mix()` needed for box-shadow (a single rgba() is sufficient here).

**Complete `css/animations.css` fill:**
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
  /* box-shadow is NOT a layout property — does not cause reflow */
  .project-card {
    transition: transform 200ms ease, box-shadow 200ms ease;
  }

  .project-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(44, 36, 22, 0.12);
  }

  /* === Reduced-motion overrides — MUST appear after rules above to win cascade === */
  /* Start [data-reveal] visible: content is never inaccessible if reveal.js skips. */
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

---

### `index.html` (HTML attribute addition)

**Analog:** `index.html` itself — existing boolean data-* attribute and section structure

**Boolean attribute convention** (HTML spec — no value needed):
```html
<h2 data-reveal>Projects</h2>
```
Not `data-reveal="true"` or `data-reveal=""` — bare boolean attribute is the project convention (consistent with `aria-hidden="true"` used on SVG icons at lines 48–53, and the HTML spec for boolean attributes).

**Section structure** (`index.html` lines 65–150 — read-only reference):
```html
<section id="projects" aria-label="Projects">
  <h2>Projects</h2>
  <div class="projects__grid">...</div>
</section>

<section id="about" aria-label="About">
  <h2>About</h2>
  <div class="about__content">...</div>
</section>

<section id="timeline" aria-label="Work experience">
  <h2>Experience</h2>
  <ol class="timeline">...</ol>
</section>

<section id="contact" aria-label="Contact">
  <h2>Contact</h2>
  <p>Available for...</p>
  <div class="contact__actions">...</div>
</section>
```

**Exact `data-reveal` placement (what changes in index.html):**

| Element | Current line | Change |
|---------|-------------|--------|
| `#hero` section | line 58 | NO data-reveal — above fold, IO fires immediately on load |
| `#projects h2` | line 66 | Add `data-reveal` |
| `.projects__grid` | line 67 | Add `data-reveal` |
| `#about h2` | line 72 | Add `data-reveal` |
| `.about__content` | line 74 | Add `data-reveal` |
| `#timeline h2` | line 111 | Add `data-reveal` |
| `.timeline` | line 116 | Add `data-reveal` |
| `#contact h2` | line 143 | Add `data-reveal` |
| `#contact > p` | line 144 | Add `data-reveal` |
| `.contact__actions` | line 146 | Add `data-reveal` |

**Result snippet for projects section:**
```html
<section id="projects" aria-label="Projects">
  <h2 data-reveal>Projects</h2>
  <div class="projects__grid" data-reveal>
    <!-- js/projects.js injects .project-card elements here at page load -->
  </div>
</section>
```

**Script tag addition** (`index.html` lines 159–160):
```html
<!-- Current: -->
<script type="module" src="js/nav.js"></script>
<script type="module" src="js/projects.js"></script>

<!-- After Phase 3: -->
<script type="module" src="js/nav.js"></script>
<script type="module" src="js/projects.js"></script>
<script type="module" src="js/reveal.js"></script>
```
Order matters: `reveal.js` must come after `projects.js` in the DOM so it is the last module to run (even though async fetch in `projects.js` means cards may not be in the grid yet — this is acceptable per the grid-as-unit reveal strategy).

---

## Shared Patterns

### ES Module Convention
**Source:** `js/nav.js` lines 1–3 and `js/projects.js` lines 1–5
**Apply to:** `js/reveal.js`
- File header: `// filename`, `// ES module — one-line description`, `// scope note`
- No `import` or `export` statements — self-contained modules
- `<script type="module">` in index.html — deferred by spec, no `defer` attribute needed

### Reduced-Motion Guard
**Source:** `css/components.css` lines 227–235
**Apply to:** `css/animations.css` (all animation rules), `js/reveal.js` (early return)
Two-layer defense:
1. CSS: `@media (prefers-reduced-motion: reduce)` restores all animated elements to visible final state
2. JS: `window.matchMedia('(prefers-reduced-motion: reduce)').matches` early return skips IO entirely
Both must be present — CSS handles elements that JS never touches (e.g., if JS fails to load).

### Transition Shorthand
**Source:** `css/components.css` line 197
**Apply to:** `css/animations.css` — `.project-card` and `[data-reveal]`
```css
transition: <property> 200ms ease, <property2> 200ms ease;
```
Always use the shorthand form with explicit duration and easing. Reveal transition uses 500ms (longer — editorial feel). Card hover uses 200ms (matching existing button timing).

### Animate Only `opacity` and `transform`
**Source:** `CLAUDE.md` critical rules + `css/components.css` lines 208–210
**Apply to:** All Phase 3 animation rules
Never animate `height`, `width`, `margin`, `padding`, or `border-width` — these cause layout reflow. `box-shadow` is safe (not part of the box model). `transform` and `opacity` are GPU-composited.

### `rgba()` Fallback Before `color-mix()`
**Source:** `css/components.css` lines 519–521, 39–40, 104–105
**Apply to:** `css/animations.css` — box-shadow color
```css
/* rgba() fallback first, color-mix() override second */
box-shadow: 0 4px 16px rgba(44, 36, 22, 0.12);
```
For `box-shadow` specifically, a single `rgba()` is sufficient — no `color-mix()` needed since box-shadow is not a standard property that falls back the same way. Use the rgba pattern from `--color-text-primary` (#2C2416 = rgb(44,36,22)).

---

## No Analog Found

None — all three files have strong analogs in the existing codebase.

---

## Metadata

**Analog search scope:** `js/`, `css/`, `index.html`
**Files read:** `js/nav.js`, `js/projects.js`, `css/animations.css`, `css/components.css`, `css/tokens.css`, `index.html`
**Pattern extraction date:** 2026-04-22
