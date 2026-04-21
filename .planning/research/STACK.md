# Technology Stack

**Project:** corsiriccardo.github.io — Personal Portfolio
**Researched:** 2026-04-21
**Confidence:** HIGH (all key claims verified against MDN, Google Fonts, caniuse, and official docs)

---

## Recommended Stack

### Deployment Platform

| Technology | Purpose | Notes |
|------------|---------|-------|
| GitHub Pages | Static hosting | Auto-deploys from `master` branch root; `index.html` at repo root is the entry point |

The repo is already named `corsiriccardo.github.io`, which means it is a user-level Pages site. It deploys from the root of the `master` branch automatically — no GitHub Actions workflow needed. The built URL is `https://corsiriccardo.github.io`. If a custom domain is ever added, place a `CNAME` file in the repo root with the bare domain (e.g., `riccardocorsi.dev`).

No build step, no CI config, no `gh-pages` branch needed. Push to `master`, site updates within seconds.

---

### Core Language Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Markup | HTML5 semantic elements | `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>` — screen-reader friendly, zero overhead |
| Styles | CSS3 with custom properties | No preprocessor; custom properties handle all theming natively in 2025 |
| Scripting | Vanilla ES Modules (`type="module"`) | Native browser support, clean imports, no bundler needed |

No build tool, no `package.json`, no Node runtime. Source files are the deployed files.

---

### CSS Architecture

**Approach: Custom Properties + Lightweight BEM, with `@layer` for order control**

This is the right amount of structure for a 5-section single-page site without going over-engineered.

#### File Layout

```
css/
├── tokens.css        /* All custom properties: colors, spacing, type scale, easing */
├── base.css          /* Reset, body, typography defaults */
├── layout.css        /* Section scaffolding, grid, max-width containers */
├── components.css    /* Cards, timeline items, nav, buttons */
├── animations.css    /* Transition definitions, scroll-reveal classes */
└── main.css          /* @import hub + @layer declaration order */
```

#### `@layer` Declaration (in `main.css`)

```css
@layer tokens, base, layout, components, animations;
```

`@layer` is supported by all modern browsers (Chrome 99+, Firefox 97+, Safari 15.4+) — effectively universal in 2025. It eliminates specificity conflicts without relying on selector weight hacks.

#### Design Tokens (`tokens.css`)

These custom properties are the foundation of the entire aesthetic. Every color, spacing, and easing value is defined here:

```css
:root {
  /* Palette — carta invecchiata */
  --color-paper:       #F5F0E8;   /* main background, aged parchment */
  --color-paper-dark:  #EDE5D4;   /* section alternation, card backgrounds */
  --color-ink:         #2C2416;   /* body text, deep warm black */
  --color-ink-muted:   #6B5D4F;   /* secondary text, timestamps */
  --color-accent:      #8B6348;   /* links, hover states, timeline dots — warm sienna */
  --color-accent-hover:#6B4C38;   /* darker on hover */
  --color-border:      rgba(44, 36, 22, 0.12); /* subtle dividers */
  --color-shadow:      rgba(44, 36, 22, 0.10); /* card shadows */

  /* Typography scale — Major Third (1.25) */
  --text-xs:   0.64rem;
  --text-sm:   0.8rem;
  --text-base: 1rem;
  --text-md:   1.25rem;
  --text-lg:   1.5625rem;
  --text-xl:   1.953rem;
  --text-2xl:  2.441rem;
  --text-3xl:  3.052rem;

  /* Spacing — 4px base unit */
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;

  /* Easing */
  --ease-out:       cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out:    cubic-bezier(0.45, 0, 0.55, 1);
  --duration-fast:  200ms;
  --duration-base:  400ms;
  --duration-slow:  700ms;

  /* Paper grain overlay opacity */
  --grain-opacity: 0.045;
}
```

#### Naming Convention: Light BEM

Use BEM for components only — not for layout or utility classes. A portfolio this size does not need full OOCSS discipline.

```css
/* Block */
.project-card { ... }
/* Element */
.project-card__title { ... }
.project-card__tags { ... }
/* Modifier */
.project-card--featured { ... }
```

Layout and section scaffolding can use simple semantic selectors (`.hero`, `.about`, `.projects`). No utility classes — custom properties + composition cover all variation needs.

---

### Paper Texture Technique

**Method: SVG `feTurbulence` grain overlay via `::before` pseudo-element**

This is the highest-fidelity technique with zero HTTP requests. It renders Perlin fractal noise natively in the browser. The grain sits above everything via a `pointer-events: none` pseudo-element so it never blocks interaction.

**In HTML (place once, before closing `</body>`):**

```html
<svg aria-hidden="true" width="0" height="0" style="position:absolute">
  <filter id="grain" color-interpolation-filters="sRGB" x="0" y="0" width="1" height="1">
    <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
</svg>
```

**In CSS (`base.css`):**

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: var(--grain-opacity);   /* ~0.04–0.06 is the sweet spot */
  filter: url(#grain);
  background: var(--color-paper);
}
```

**Tuning knobs:**
- `baseFrequency`: `0.65`–`0.85` for coarse paper; `0.9`–`1.1` for fine grain. Start at `0.75`.
- `numOctaves`: Keep at `4`. Above `4` costs performance with no visible gain.
- `--grain-opacity`: `0.03`–`0.06`. Below `0.03` is invisible; above `0.07` looks dirty.

**Fallback (section color alternation):** Even without the SVG filter, alternating between `--color-paper` and `--color-paper-dark` backgrounds gives clear visual rhythm and a paper-stack feel. Never rely solely on the grain.

---

### Typography

**Primary Pairing: Cormorant Garamond (display/headings) + Lora (body)**

This is the strongest match for the carta invecchiata aesthetic. Both are Google Fonts, free, and render beautifully on screen.

| Role | Font | Weight(s) | Style | Why |
|------|------|-----------|-------|-----|
| Display / H1–H2 | **Cormorant Garamond** | 400, 600 | Normal + Italic | High-contrast Garamond-derived serif with print-book elegance; editorial without being pretentious |
| Body / H3–H6 / UI | **Lora** | 400, 500, 600 | Normal + Italic | Soft calligraphic curves; optimized for digital readability; warm and humanist |

**Google Fonts import (place in `<head>`, after `<meta charset>`):**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
```

**Application in CSS:**

```css
:root {
  --font-display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  --font-body:    'Lora', Georgia, 'Times New Roman', serif;
}

body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.7;
  color: var(--color-ink);
}

h1, h2 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.01em;
}
```

**Sizing guidance:**
- H1 (name/hero): `clamp(2.5rem, 6vw, 4rem)` — responsive, never tiny on mobile
- H2 (section titles): `clamp(1.75rem, 4vw, 2.5rem)`
- Body: `1rem` / `16px` base, `line-height: 1.7` for comfortable reading
- Captions/tags: `var(--text-sm)` in Lora with `letter-spacing: 0.05em`

**Alternative considered and rejected:** Playfair Display — beautiful but overused; every design portfolio in 2018–2022 used it, which undermines the sense of craft. Cormorant Garamond is more distinctive and closer to true letterpress quality.

**Self-hosting alternative:** Download both fonts from Google Fonts, serve from `/fonts/`, add `font-display: swap` to `@font-face` rules. Eliminates the Google Fonts DNS lookup at the cost of a small maintenance burden. For a personal portfolio, Google Fonts CDN is acceptable.

---

### Animation Approach

**Rule: CSS does the animating; JS only toggles classes.**

Never animate with `setInterval`, GSAP, or `requestAnimationFrame` for this site. CSS `transition` and `@keyframes` run on the compositor thread and are GPU-accelerated. JS only assigns a `.is-visible` class.

#### Scroll Reveal — Intersection Observer (native, no library)

```js
// js/scroll-reveal.js (ES Module)
const THRESHOLD = 0.15; // element is 15% visible before triggering
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); // fire once only
    }
  });
}, { threshold: THRESHOLD, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
```

```css
/* animations.css */
[data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity var(--duration-slow) var(--ease-out),
    transform var(--duration-slow) var(--ease-out);
}

[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children in card grids */
[data-reveal-stagger] > * {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity var(--duration-base) var(--ease-out),
    transform var(--duration-base) var(--ease-out);
}

[data-reveal-stagger].is-visible > *:nth-child(1) { transition-delay: 0ms;   opacity: 1; transform: none; }
[data-reveal-stagger].is-visible > *:nth-child(2) { transition-delay: 80ms;  opacity: 1; transform: none; }
[data-reveal-stagger].is-visible > *:nth-child(3) { transition-delay: 160ms; opacity: 1; transform: none; }
[data-reveal-stagger].is-visible > *:nth-child(4) { transition-delay: 240ms; opacity: 1; transform: none; }
```

Mark elements in HTML with `data-reveal` or `data-reveal-stagger`. No JavaScript configuration needed per element.

**Why not CSS scroll-driven animations (`animation-timeline: scroll()`)?**
Browser support is 84.7% globally as of April 2026. Firefox does not support it by default (disabled behind a flag across versions 110–152). For a portfolio meant to impress all recruiters including Firefox users, the Intersection Observer approach with CSS transitions is the safer choice and achieves the same editorial scroll-reveal effect. Use `@supports` to layer in scroll-driven animations as progressive enhancement in a later iteration if desired.

#### Hover Effects — CSS Only

```css
/* Card lift */
.project-card {
  transition:
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
}
.project-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px var(--color-shadow);
}

/* Link underline draw */
.nav__link {
  text-decoration: none;
  background-image: linear-gradient(var(--color-accent), var(--color-accent));
  background-size: 0% 1px;
  background-repeat: no-repeat;
  background-position: left bottom;
  transition: background-size var(--duration-fast) var(--ease-out);
}
.nav__link:hover {
  background-size: 100% 1px;
}
```

Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`. Only `transform` and `opacity` are compositor-safe (and `box-shadow` is acceptable for subtle effects at this scale).

---

### Micro-Library Decision

**Verdict: No animation library. Write the Intersection Observer in ~20 lines of vanilla JS.**

Libraries evaluated:

| Library | Size | Decision | Reason |
|---------|------|----------|--------|
| SAL.js | 2.8 KB minified | Rejected | Too small to justify external dependency; the IntersectionObserver code it wraps is trivial to write |
| ScrollReveal.js | ~6 KB | Rejected | Larger, no benefit over native Intersection Observer for this use case |
| AOS (Animate on Scroll) | ~13 KB + CSS | Rejected | Heavy, adds its own CSS file, overkill |
| GSAP | ~100 KB | Rejected | Explicitly out of scope; paper aesthetic requires restraint, not timeline sequencing |

**The one micro-library worth considering:** None. For a site with one scroll-reveal pattern and hover effects, a 20-line JS module is the right tool. Adding a CDN dependency to save 15 lines of code is the wrong trade-off.

**Exception:** If project cards need a lightbox for screenshots, use [GLightbox](https://biati-digital.github.io/glightbox/) (~15 KB, no dependencies, ES module compatible). Only add it if screenshots are included.

---

### Icons

**Recommendation: Inline SVG or Unicode, not a library.**

The project's existing FontAwesome dependency is being removed. For a portfolio of this size:

- Use inline SVG for the 4–6 icons needed (GitHub logo, LinkedIn logo, email, external link, maybe a chevron).
- Source icons from [Heroicons](https://heroicons.com) or [Feather Icons](https://feathericons.com) — copy the SVG markup directly into HTML.
- No `<link>` to an icon CDN. Icon fonts add 60–200 KB and a render-blocking request for a handful of icons.

---

### Performance Targets

| Metric | Target | How |
|--------|--------|-----|
| LCP | < 1.5s | No render-blocking resources; fonts with `display=swap` |
| TBT | 0 | No JavaScript frameworks, no heavy parsers |
| CLS | 0 | Fixed `font-display: swap`; explicit image `width`/`height` attributes |
| Page weight | < 150 KB uncompressed | No images larger than 50 KB; CSS grain replaces texture images |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Animation | CSS transitions + Intersection Observer | GSAP, AOS | Overkill; paper aesthetic = restraint |
| Fonts | Cormorant Garamond + Lora | Playfair Display + Source Serif | Playfair is overused; less distinctive |
| Fonts | Google Fonts CDN | Self-hosted | Acceptable for a personal site; CDN is simpler |
| Texture | SVG `feTurbulence` | Background PNG | SVG is zero-byte extra HTTP request |
| CSS structure | Custom properties + light BEM | Tailwind CSS | No build step; Tailwind requires PostCSS |
| Scroll reveal | Native Intersection Observer | CSS scroll-driven animations | Firefox support gap (not enabled by default) |

---

## Sources

- [MDN: CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- [Can I Use: animation-timeline: scroll()](https://caniuse.com/mdn-css_properties_animation-timeline_scroll) — 84.7% global support
- [Typewolf: Curated Google Fonts](https://www.typewolf.com/google-fonts) — Cormorant, Alegreya, Fraunces as editorial recommendations
- [Google Fonts: Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond)
- [Google Fonts: Lora](https://fonts.google.com/specimen/Lora)
- [Frontend Masters: Grainy Gradients via SVG feTurbulence](https://frontendmasters.com/blog/grainy-gradients/)
- [MDN: feTurbulence SVG element](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence)
- [CSS-Tricks: CSS Cascade Layers](https://css-tricks.com/css-cascade-layers/)
- [Smashing Magazine: Cascade Layers vs BEM vs Utility Classes (2025)](https://www.smashingmagazine.com/2025/06/css-cascade-layers-bem-utility-classes-specificity-control/)
- [SAL.js GitHub](https://github.com/mciastek/sal)
- [GitHub Pages Docs: Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Old Paper CSS Technique — tutorialpedia.org](https://www.tutorialpedia.org/blog/old-paper-background-texture-with-just-css/)
- [Cormorant Garamond + Lora pairing — Pixieset Blog](https://blog.pixieset.com/blog/font-combination-ideas-photography-websites/)
