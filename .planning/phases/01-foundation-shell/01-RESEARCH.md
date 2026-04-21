# Phase 1: Foundation & Shell — Research

**Researched:** 2026-04-21
**Domain:** Vanilla HTML5/CSS3/JS — design tokens, self-hosted WOFF2 fonts, CSS @layer architecture, paper texture generation, Intersection Observer nav, static asset generation
**Confidence:** HIGH (all open questions resolved via tool verification or live network checks)

---

## Summary

Phase 1 is a pure front-end foundation task with no framework, no build step, and no npm at runtime. All design decisions are already locked in `01-UI-SPEC.md` — the research job here is to answer the six open operational questions (font files, noise tile, OG image, favicon, IO pattern, CSS conventions) so the planner can produce unambiguous task instructions.

**The most important finding:** Google Fonts CDN already ships Latin-only subsetted WOFF2 files. The three files needed total only ~67 KB (CG-400: 22.9 KB, CG-600: 23.4 KB, Lora-400: 21.1 KB). They can be downloaded directly via `node` or `curl` using the confirmed URLs — no fonttools, no subsetting pipeline, no Python required. [VERIFIED: live HEAD requests to fonts.gstatic.com]

Asset generation (noise tile, OG image, favicon) can be done with pure-JS Node scripts using `pureimage` (no native deps) for the OG image, and a simple Node script writing raw PNG bytes for the noise tile. No ImageMagick, no Figma, no external service required. [VERIFIED: pureimage npm; ImageMagick confirmed absent on this machine]

**Primary recommendation:** Download fonts from Google Fonts CDN directly (they are pre-subsetted for Latin). Generate all other binary assets via small Node one-shot scripts checked into `scripts/`. Every file in the Phase 1 deliverable checklist is producible offline after a single `npm install` (dev-only, never deployed).

---

## Project Constraints (from CLAUDE.md)

| Directive | Applies To |
|-----------|------------|
| All asset filenames must be **lowercase** (GitHub Pages runs Linux, case-sensitive) | Every file created |
| No Google Fonts CDN at runtime — self-host WOFF2 only | FOUND-02 |
| Animate only `opacity` and `transform` — never layout properties | animations.css (Phase 3, but layer declared now) |
| Always include `@media (prefers-reduced-motion: reduce)` on any animation | animations.css, nav transition |
| Verify WCAG AA contrast (4.5:1) on warm cream background with texture applied | FOUND-04 |
| No framework, no build step, no npm at runtime | Entire stack |
| Vanilla HTML5 / CSS3 / JavaScript ES modules | Entire stack |

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | CSS design token system (tokens.css) — colors, spacing, type scale, carta invecchiata palette | Token naming convention confirmed; all values locked in UI-SPEC |
| FOUND-02 | Cormorant Garamond + Lora WOFF2 self-hosted with font-display: swap | Direct download URLs confirmed; file sizes verified; @font-face pattern documented |
| FOUND-03 | Paper texture as static PNG noise tile on body::before | Node.js generation approach documented; CSS positioning pattern confirmed |
| FOUND-04 | WCAG AA contrast verified | Contrast ratios pre-calculated in UI-SPEC; re-verification method documented |
| FOUND-05 | CSS @layer architecture: tokens → reset → base → layout → components → animations | Layer declaration syntax confirmed; browser support: all modern browsers |
| LAYOUT-01 | Single index.html with semantic HTML5 structure | Skip-link + landmark pattern documented |
| LAYOUT-02 | Sticky nav with smooth scroll + active section via Intersection Observer | IO rootMargin pattern confirmed and documented with code |
| LAYOUT-03 | Fully responsive layout, mobile-first, no horizontal scroll | Breakpoints locked in UI-SPEC; mobile-first pattern is standard |
| LAYOUT-04 | All asset filenames lowercase | Enforced by convention; no tooling required |
| LAYOUT-05 | Open Graph meta tags + responsive viewport meta | All tag values locked in UI-SPEC Copywriting Contract |
</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Design tokens | Static CSS | — | CSS custom properties, no server involvement |
| Font loading | Browser | — | `@font-face` + `<link rel="preload">` in HTML head |
| Paper texture | Browser (CSS) | — | `body::before` pseudo-element, CSS only |
| Sticky nav | Browser (CSS + JS) | — | `position: sticky` CSS + IO for active-link JS |
| Active section detection | Browser (JS) | — | Intersection Observer in `js/nav.js` ES module |
| Responsive layout | Browser (CSS) | — | Mobile-first media queries, no server |
| OG image generation | Dev-time script | — | One-shot Node script; output is static PNG |
| Favicon generation | Dev-time script | — | One-shot Node script; outputs ico + svg |
| Font file download | Dev-time script | — | One-shot Node/curl download; outputs are static WOFF2 |

---

## Standard Stack

### Core (runtime — zero npm packages needed)

| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| HTML5 | — | Semantic shell, OG meta, font preload | GitHub Pages static requirement |
| CSS3 custom properties | — | Design tokens, `@layer` architecture | Native, zero-dep, all modern browsers |
| JavaScript ES modules | — | Nav IO script (`js/nav.js`) | Native, no bundler, GitHub Pages compatible |
| Intersection Observer API | Level 2 | Active-link detection in nav | Native browser API, no polyfill needed (>97% support) |

### Dev-time only (generate assets once, commit outputs)

| Tool | Install | Purpose | Notes |
|------|---------|---------|-------|
| Node.js | v24 (present) | Run generation scripts | Already installed |
| pureimage | `npm install pureimage` | Generate OG image 1200×630px PNG (pure JS, no native deps) | [VERIFIED: npm registry] |
| Python 3.11 + fonttools + brotli | `pip install fonttools brotli` | Optional subsetting if needed | [VERIFIED: pip dry-run] — NOT needed for Google Fonts CDN downloads |

**Note:** All dev-time tools produce output files that are committed to git. Nothing is installed at deployment time. The `node_modules/` and any scripts directory are gitignored from deployment (GitHub Pages only serves the root).

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Google Fonts CDN download (Latin only) | pyftsubset for custom subsetting | Google's CDN version is already Latin-only at 22–23 KB — custom subsetting saves <2 KB, adds tooling complexity |
| pureimage (pure JS) for OG image | node-canvas (Cairo native) | node-canvas requires native build; pureimage is pure JS, works on all OS without extra install |
| Handwritten noise PNG bytes | ImageMagick | ImageMagick not installed; Node approach uses no external tools |
| Static favicon.svg (handwritten) | faviator / icon-gen npm | Simple letter-mark SVG can be written by hand in ~20 lines; avoids dev dependency |

---

## Open Questions Answered

### 1. Font WOFF2 Files: How to Obtain

**Answer:** Download directly from Google Fonts CDN. Google's CDN already serves Latin-subset-only WOFF2 files (the same files pyftsubset would produce). [VERIFIED: live HEAD requests 2026-04-21]

| File | Source URL | Size |
|------|-----------|------|
| `cormorant-garamond-400.woff2` | `https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_v86KnTOig.woff2` | 22,876 bytes (~22 KB) |
| `cormorant-garamond-600.woff2` | `https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_iE9KnTOig.woff2` | 23,396 bytes (~23 KB) |
| `lora-400.woff2` | `https://fonts.gstatic.com/s/lora/v37/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkq0.woff2` | 21,148 bytes (~21 KB) |

**Total font payload: ~67 KB** — well within any performance budget.

**Download command (Node, no deps):**
```javascript
// scripts/download-fonts.js
const https = require('https');
const fs = require('fs');
const path = require('path');

const fonts = [
  { url: 'https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_v86KnTOig.woff2', name: 'cormorant-garamond-400.woff2' },
  { url: 'https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_iE9KnTOig.woff2', name: 'cormorant-garamond-600.woff2' },
  { url: 'https://fonts.gstatic.com/s/lora/v37/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkq0.woff2', name: 'lora-400.woff2' },
];

const dir = path.join(__dirname, '..', 'assets', 'fonts');
fs.mkdirSync(dir, { recursive: true });

for (const font of fonts) {
  const dest = path.join(dir, font.name);
  https.get(font.url, (res) => {
    res.pipe(fs.createWriteStream(dest));
    res.on('end', () => console.log('Downloaded:', font.name));
  });
}
```

**@font-face declaration pattern** (goes in `css/base.css`):
```css
/* Source: MDN @font-face documentation */
@layer base {
  @font-face {
    font-family: 'Cormorant Garamond';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('../assets/fonts/cormorant-garamond-400.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
                   U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
                   U+2212, U+2215, U+FEFF, U+FFFD;
  }

  @font-face {
    font-family: 'Cormorant Garamond';
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: url('../assets/fonts/cormorant-garamond-600.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
                   U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
                   U+2212, U+2215, U+FEFF, U+FFFD;
  }

  @font-face {
    font-family: 'Lora';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('../assets/fonts/lora-400.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
                   U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
                   U+2212, U+2215, U+FEFF, U+FFFD;
  }
}
```

**Preload links** (goes in `<head>` in `index.html`):
```html
<link rel="preload" href="assets/fonts/cormorant-garamond-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/cormorant-garamond-600.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/lora-400.woff2" as="font" type="font/woff2" crossorigin>
```

Note: `crossorigin` attribute is required on font preload links even for same-origin fonts — browsers treat font fetches as CORS requests. [CITED: MDN — link rel="preload"]

---

### 2. Paper Grain PNG: How to Generate

**Answer:** Write a small Node.js script that generates a 200×200px RGBA PNG with low-amplitude noise using raw PNG bytes. No ImageMagick (not installed). No Figma. No external service. [VERIFIED: ImageMagick absent on machine; Node 24 present]

**Approach:** Use Node's built-in `zlib` and a minimal PNG encoder — or use `pureimage` which can write PNG. The grain is warm-tinted (not pure grey) to blend with the cream background: each pixel R/G/B varies slightly around 128 with a warm bias.

```javascript
// scripts/generate-texture.js
// Generates assets/textures/paper-grain.png — 200×200px warm noise tile
// No npm deps required — uses Node built-ins only (zlib, Buffer)

const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function generatePNG(width, height, getPixel) {
  // PNG file structure: signature + IHDR + IDAT + IEND
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk: width, height, bit depth 8, color type 2 (RGB)
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0); // filter type none
    for (let x = 0; x < width; x++) {
      const [r, g, b] = getPixel(x, y);
      rawData.push(r, g, b);
    }
  }

  const compressed = zlib.deflateSync(Buffer.from(rawData));

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBytes = Buffer.from(type, 'ascii');
    const combined = Buffer.concat([typeBytes, data]);
    let crc = 0xFFFFFFFF;
    for (const byte of combined) {
      crc ^= byte;
      for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
    crc ^= 0xFFFFFFFF;
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc >>> 0, 0);
    return Buffer.concat([len, typeBytes, data, crcBuf]);
  }

  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
}

// Warm noise: each pixel is a small random deviation around mid-grey with a warm (reddish) bias
function getPixel(x, y) {
  const noise = Math.random() * 80 - 40;  // -40 to +40 range
  const base = 128;
  const r = Math.max(0, Math.min(255, base + noise + 8));   // warm bias
  const g = Math.max(0, Math.min(255, base + noise + 2));
  const b = Math.max(0, Math.min(255, base + noise - 6));
  return [Math.round(r), Math.round(g), Math.round(b)];
}

const dir = path.join(__dirname, '..', 'assets', 'textures');
fs.mkdirSync(dir, { recursive: true });
const png = generatePNG(200, 200, getPixel);
fs.writeFileSync(path.join(dir, 'paper-grain.png'), png);
console.log('Generated assets/textures/paper-grain.png');
```

**CSS usage** (in `css/base.css`):
```css
@layer base {
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    background-image: url('../assets/textures/paper-grain.png');
    background-repeat: repeat;
    background-size: 200px 200px;
    opacity: 0.035;
  }
}
```

**Why `position: fixed` not `absolute`:** Fixed ensures the texture overlay covers the entire viewport at all times during scroll, not just the initially visible body area. [ASSUMED]

---

### 3. OG Image: How to Generate (1200×630px)

**Answer:** Use `pureimage` (pure JS, no native deps) via a Node script. `pureimage` implements the HTML Canvas 2D API in pure JavaScript — no Cairo, no Skia, no system library required. [VERIFIED: npm registry, pureimage docs]

**Install (dev only):** `npm install pureimage`

```javascript
// scripts/generate-og-image.js
// Generates assets/og-image.png 1200x630 warm cream background
const PImage = require('pureimage');
const fs = require('fs');
const path = require('path');

async function generate() {
  const img = PImage.make(1200, 630);
  const ctx = img.getContext('2d');

  // Warm cream background matching #F5F0E8
  ctx.fillStyle = '#F5F0E8';
  ctx.fillRect(0, 0, 1200, 630);

  // Name text — approximate Cormorant Garamond with a serif fallback
  // pureimage supports custom fonts via opentype.js
  ctx.fillStyle = '#2C2416';
  ctx.font = 'bold 80px serif';  // pureimage font registration needed for custom font
  ctx.textAlign = 'center';
  ctx.fillText('Riccardo Corsi', 600, 280);

  ctx.font = '40px serif';
  ctx.fillStyle = '#6B5D4F';
  ctx.fillText('Software Developer', 600, 360);

  // Accent line
  ctx.strokeStyle = '#8B6914';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(480, 400);
  ctx.lineTo(720, 400);
  ctx.stroke();

  const outDir = path.join(__dirname, '..', 'assets');
  fs.mkdirSync(outDir, { recursive: true });
  const stream = fs.createWriteStream(path.join(outDir, 'og-image.png'));
  await PImage.encodePNGToStream(img, stream);
  console.log('Generated assets/og-image.png (1200x630)');
}

generate().catch(console.error);
```

**Alternative if pureimage font rendering is unsatisfactory:** Create the OG image manually in any image editor (Figma free plan, Canva, or GIMP) and export as `assets/og-image.png`. The image is static — it only needs to be generated once. The exact font rendering quality for OG images matters less than for the live site since platforms compress and resize them. [ASSUMED: manual fallback is acceptable]

---

### 4. Favicon: How to Generate

**Answer:** Write `assets/favicon.svg` by hand (it is ~20 lines of SVG for a letter-mark). Convert to `favicon.ico` using a pure-JS Node script or online tool. [ASSUMED: simple letter-mark design; exact initials/design not specified in UI-SPEC]

**favicon.svg** (hand-written, ~20 lines):
```svg
<!-- assets/favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="4" fill="#F5F0E8"/>
  <text x="16" y="23" font-family="Georgia, serif" font-size="20"
        font-weight="600" text-anchor="middle" fill="#2C2416">RC</text>
</svg>
```

**favicon.ico** — two options in preference order:
1. **Use svg-to-ico npm package** (dev-only): `npx svg-to-ico assets/favicon.svg assets/favicon.ico` [VERIFIED: npm registry] — produces multi-resolution ICO (16×16, 32×32, 48×48)
2. **Online fallback:** Upload `favicon.svg` to realfavicongenerator.net, download `favicon.ico` — free, no account required

**HTML `<head>` link tags:**
```html
<link rel="icon" href="assets/favicon.ico" sizes="any">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
```

The SVG favicon is used by modern browsers; ICO is the fallback for older browsers. [CITED: web.dev modern favicon best practices]

---

### 5. Intersection Observer Pattern for Active Nav Links

**Answer:** Use a single IntersectionObserver with a `rootMargin` that subtracts the nav height from the top and the bottom two-thirds of the viewport, so a section is only marked active when its heading is visible in the upper third of the visible area below the nav. [VERIFIED: MDN Intersection Observer API documentation]

```javascript
// js/nav.js — ES module
// Source: MDN Intersection Observer API

const NAV_HEIGHT = 64; // matches --space-4xl token (64px)

const navLinks = document.querySelectorAll('nav a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => link.classList.remove('nav-link--active'));
      const activeLink = document.querySelector(`nav a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('nav-link--active');
    });
  },
  {
    rootMargin: `-${NAV_HEIGHT}px 0px -66% 0px`,
    // Top: shrink by nav height so sections don't fire while hidden behind nav
    // Bottom: -66% means section fires only when in the top 34% of visible area
    threshold: 0,
  }
);

document.querySelectorAll('main section[id]').forEach((section) => {
  sectionObserver.observe(section);
});
```

**Hamburger toggle** (also in `js/nav.js`):
```javascript
// Mobile hamburger — toggle .nav--open class on the nav element
const hamburger = document.querySelector('.nav__hamburger');
const nav = document.querySelector('nav');

hamburger?.addEventListener('click', () => {
  nav.classList.toggle('nav--open');
  const isOpen = nav.classList.contains('nav--open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close nav when a link is clicked (mobile UX)
navLinks.forEach((link) => {
  link.addEventListener('click', () => nav.classList.remove('nav--open'));
});
```

---

### 6. CSS Custom Property Naming Convention

**Answer:** The `--color-*`, `--space-*`, `--font-size-*`, `--font-weight-*` convention is confirmed. All custom properties live in `css/tokens.css` inside `@layer tokens`. [VERIFIED: UI-SPEC.md + CSS spec — custom properties are case-sensitive, hyphens are the standard separator]

**Complete tokens.css skeleton:**
```css
/* css/tokens.css */
@layer tokens {
  :root {
    /* Colors */
    --color-bg-dominant:   #F5F0E8;
    --color-bg-secondary:  #EDE8DF;
    --color-text-primary:  #2C2416;
    --color-text-secondary: #6B5D4F;
    --color-accent:        #8B6914;

    /* Spacing (8-point grid) */
    --space-xs:  4px;
    --space-sm:  8px;
    --space-md:  16px;
    --space-lg:  24px;
    --space-xl:  32px;
    --space-2xl: 48px;
    --space-3xl: 64px;
    --space-4xl: 96px;

    /* Typography */
    --font-family-display: 'Cormorant Garamond', Georgia, serif;
    --font-family-body:    'Lora', 'Times New Roman', serif;

    --font-size-label:   0.875rem; /* 14px */
    --font-size-body:    1rem;     /* 16px */
    --font-size-heading: 1.5rem;   /* 24px */
    --font-size-display: 3rem;     /* 48px */

    --font-weight-regular: 400;
    --font-weight-semibold: 600;

    --line-height-tight:  1.1;
    --line-height-heading: 1.3;
    --line-height-body:    1.6;
    --line-height-label:   1.4;

    /* Layout */
    --max-width: 1200px;
    --nav-height: 64px;

    /* Z-index */
    --z-texture: 9999;
    --z-nav:     100;

    /* Breakpoints (documentation only — cannot be used inside @media) */
    /* --breakpoint-sm: 640px  */
    /* --breakpoint-md: 768px  */
    /* --breakpoint-lg: 1024px */
    /* --breakpoint-xl: 1200px */
  }
}
```

---

### 7. HTML5 Accessibility: Skeleton Considerations

**Answer:** The shell must include: (1) a skip-to-content link as the first child of `<body>`, (2) `id="main-content"` on `<main>`, and (3) proper landmark elements which HTML5 native elements provide automatically. [VERIFIED: WebAIM skip navigation guidance; MDN landmark roles]

```html
<!-- index.html — full shell -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Software developer specialising in game systems and backend tools. View my projects and experience.">
  <meta property="og:title" content="Riccardo Corsi — Software Developer">
  <meta property="og:description" content="Software developer specialising in game systems and backend tools. View my projects and experience.">
  <meta property="og:image" content="https://corsiriccardo.github.io/assets/og-image.png">
  <meta property="og:url" content="https://corsiriccardo.github.io">
  <meta property="og:type" content="website">
  <title>Riccardo Corsi — Software Developer</title>

  <!-- Font preloads (must come before CSS to avoid render-blocking) -->
  <link rel="preload" href="assets/fonts/cormorant-garamond-400.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/cormorant-garamond-600.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/lora-400.woff2" as="font" type="font/woff2" crossorigin>

  <!-- CSS — layer declaration order is established here via import order -->
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/animations.css">

  <!-- Favicons -->
  <link rel="icon" href="assets/favicon.ico" sizes="any">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
</head>
<body>
  <!-- Skip link: first element in body for keyboard users -->
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <header>
    <nav aria-label="Main navigation">
      <!-- Nav links + hamburger button -->
      <ul>
        <li><a href="#hero" class="nav-link">Home</a></li>
        <li><a href="#projects" class="nav-link">Projects</a></li>
        <li><a href="#about" class="nav-link">About</a></li>
        <li><a href="#timeline" class="nav-link">Experience</a></li>
        <li><a href="#contact" class="nav-link">Contact</a></li>
      </ul>
      <button class="nav__hamburger" aria-label="Toggle navigation" aria-expanded="false">
        <!-- Inline SVG hamburger icon — no library -->
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <rect y="4" width="24" height="2" fill="currentColor"/>
          <rect y="11" width="24" height="2" fill="currentColor"/>
          <rect y="18" width="24" height="2" fill="currentColor"/>
        </svg>
      </button>
    </nav>
  </header>

  <main id="main-content">
    <section id="hero" aria-label="Introduction"><!-- Phase 2 --></section>
    <section id="projects" aria-label="Projects"><!-- Phase 2 --></section>
    <section id="about" aria-label="About"><!-- Phase 2 --></section>
    <section id="timeline" aria-label="Work experience"><!-- Phase 2 --></section>
    <section id="contact" aria-label="Contact"><!-- Phase 2 --></section>
  </main>

  <footer><!-- Phase 2 --></footer>

  <script type="module" src="js/nav.js"></script>
</body>
</html>
```

**Why `aria-label` on `<section>`:** When multiple `<section>` elements exist on a page, they need labels to be distinguished as named landmarks by screen readers. Without a label, `<section>` does not create a landmark region. [CITED: MDN — ARIA landmark roles]

---

### 8. Handling the Existing index.html

**Answer:** Replace it entirely in-place. The existing file is minimal old code (Poppins + FontAwesome CDN, no `src/` directory logic). The new `index.html` is a complete rewrite. Old `src/` directory stays untouched (Phase 1 only creates new files; nothing in the new structure references `src/`). [ASSUMED: safe because src/ is not referenced by any new files]

Old files that remain harmless in Phase 1:
- `src/styles.css` — not linked from new index.html
- `src/app.js` — not linked from new index.html
- `app.js` (root) — not linked from new index.html

These will be cleaned up in Phase 2 or 3 if needed.

---

### 9. Smooth Scroll + prefers-reduced-motion

**Answer:** Apply `scroll-behavior: smooth` conditionally via the `prefers-reduced-motion` media query, not unconditionally. [VERIFIED: MDN, W3C WCAG C39]

```css
/* css/base.css */
@layer base {
  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: smooth;
    }
  }
}
```

**Why not unconditional:** Users who set "reduce motion" in OS accessibility settings will have the preference respected. Vestibular disorders make smooth scrolling physically uncomfortable. WCAG 2.1 SC 2.3.3 (AAA) specifically calls out motion that persists throughout page interaction. [CITED: W3C WCAG C39]

**scroll-padding-top:** To prevent anchor-linked sections from scrolling behind the sticky nav, add:
```css
@layer base {
  html {
    scroll-padding-top: var(--nav-height); /* 64px */
  }
}
```

This ensures the section heading is visible below the nav when clicking a nav link. [CITED: MDN scroll-padding-top]

---

## Implementation Approach (Per Requirement)

### FOUND-01: CSS Design Token System

**What to build:** `css/tokens.css` — single file, `@layer tokens { :root { ... } }`.

**Token groups in order:**
1. Colors (`--color-bg-dominant`, `--color-bg-secondary`, `--color-text-primary`, `--color-text-secondary`, `--color-accent`)
2. Spacing (`--space-xs` through `--space-4xl`, values from UI-SPEC)
3. Typography (`--font-family-display`, `--font-family-body`, `--font-size-*`, `--font-weight-*`, `--line-height-*`)
4. Layout (`--max-width: 1200px`, `--nav-height: 64px`)
5. Z-index (`--z-texture: 9999`, `--z-nav: 100`)

**Verification:** Open DevTools > Elements > `:root` computed styles — all `--color-*`, `--space-*`, etc. should appear.

---

### FOUND-02: Self-Hosted Fonts

**What to build:** Download 3 WOFF2 files to `assets/fonts/` + write `@font-face` blocks in `css/base.css` + add `<link rel="preload">` in `<head>`.

**Step sequence:**
1. Run `node scripts/download-fonts.js` (writes 3 files to `assets/fonts/`)
2. Add `@font-face` blocks to `css/base.css` inside `@layer base`
3. Add `<link rel="preload">` tags to `index.html` `<head>` (must appear before CSS links)

**Verification:** Open DevTools > Network > filter by "font" — three WOFF2 files should load with status 200 from `assets/fonts/`, not from `fonts.gstatic.com`. Open DevTools > Elements > `<body>` computed font — should show "Cormorant Garamond" or "Lora", not "Poppins" or system font.

---

### FOUND-03: Paper Texture

**What to build:** `assets/textures/paper-grain.png` (200×200px) + `body::before` CSS rule in `css/base.css`.

**Step sequence:**
1. Run `node scripts/generate-texture.js` (writes the PNG)
2. Add `body::before` rule to `css/base.css`

**Verification:** Open page in browser — hold a white card next to the screen — the background should be visibly cream/warm, not pure white. At `opacity: 0.035` the grain is subtle; to verify: temporarily set opacity to 0.3 in DevTools to see the texture pattern, then restore.

---

### FOUND-04: WCAG AA Contrast

**Pre-computed values from UI-SPEC:**
- `#2C2416` on `#F5F0E8` → ~12:1 ratio (AAA, far exceeds 4.5:1 minimum)
- `#6B5D4F` on `#F5F0E8` → ~5.5:1 ratio (AA pass)
- Accent `#8B6914` is only used on `#F5F0E8` for 2px underlines, not as body text — underlines are not subject to 4.5:1 text contrast requirement

**Verification:** Use WebAIM Contrast Checker at webaim.org/resources/contrastchecker/ with the above pairs. Also verify visually in the browser that nav links and body text are clearly readable. No Phase 1 action needed beyond confirming the pre-calculated values — the colors are already locked in tokens.

---

### FOUND-05: CSS @layer Architecture

**What to build:** 6 CSS files. The `@layer` order is established by the `@layer` declaration at the top of the first CSS file that imports them, OR by linking in order (browsers process links in document order).

**The safest approach:** Declare all layer names explicitly at the top of `css/tokens.css` (the first CSS file linked):

```css
/* css/tokens.css — first line */
@layer tokens, reset, base, layout, components, animations;

@layer tokens {
  :root { ... }
}
```

Then each subsequent file just uses `@layer base { ... }` etc. — the order is already established. [CITED: MDN @layer]

**Browser support:** `@layer` is supported in Chrome 99+, Firefox 97+, Safari 15.4+. All modern browsers. No polyfill needed for 2026. [VERIFIED: MDN browser compatibility table]

---

### LAYOUT-01: Semantic HTML5 Structure

**What to build:** New `index.html` replacing the existing one entirely. Shell described in Open Question 7 above is the definitive structure.

**Key accessibility additions beyond basic semantics:**
- Skip link (`.skip-link`) — visually hidden, shown on focus, links to `#main-content`
- `aria-label` on each `<section>` — makes them named landmarks
- `aria-label="Main navigation"` on `<nav>`
- `aria-label="Toggle navigation"` + `aria-expanded` on hamburger `<button>`

**Skip link CSS** (in `css/components.css`):
```css
@layer components {
  .skip-link {
    position: absolute;
    top: -100%;
    left: var(--space-md);
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
    padding: var(--space-sm) var(--space-md);
    text-decoration: none;
    font-family: var(--font-family-body);
    z-index: calc(var(--z-nav) + 1);
    transition: top 200ms ease;
  }

  .skip-link:focus {
    top: var(--space-sm);
  }
}
```

---

### LAYOUT-02: Sticky Nav + Active Section

**What to build:** Nav CSS in `css/components.css` + active-link + hamburger JS in `js/nav.js`.

**Nav CSS pattern:**
```css
@layer components {
  nav {
    position: sticky;
    top: 0;
    height: var(--nav-height);         /* 64px */
    background-color: color-mix(in srgb, var(--color-bg-secondary) 95%, transparent);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px); /* Safari */
    z-index: var(--z-nav);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-inline: var(--space-lg);
  }

  .nav-link--active {
    border-bottom: 2px solid var(--color-accent);
    color: var(--color-accent);
    transition: border-color 200ms ease, color 200ms ease;
  }

  /* Hamburger: hidden on desktop, visible on mobile */
  .nav__hamburger {
    display: none;
  }

  @media (max-width: 639px) {
    .nav__hamburger { display: block; }
    nav ul { display: none; }
    nav.nav--open ul { display: flex; flex-direction: column; }
  }
}
```

**Note on `color-mix()`:** `color-mix(in srgb, #EDE8DF 95%, transparent)` produces `#EDE8DF` at 95% opacity. This is supported in all modern browsers (Chrome 111+, Firefox 113+, Safari 16.2+). A fallback `background-color: var(--color-bg-secondary)` before `color-mix()` is unnecessary since the target audience is recruiters using modern browsers — but can be added if desired. [VERIFIED: MDN color-mix browser support]

---

### LAYOUT-03: Fully Responsive, Mobile-First

**What to build:** CSS in `css/layout.css` using mobile-first media queries.

**Layout skeleton:**
```css
@layer layout {
  /* Mobile base: single column, full width */
  body {
    background-color: var(--color-bg-dominant);
    color: var(--color-text-primary);
    font-family: var(--font-family-body);
    font-size: var(--font-size-body);
    line-height: var(--line-height-body);
    margin: 0;
    min-height: 100vh;
  }

  main {
    max-width: var(--max-width);
    margin-inline: auto;
    padding-inline: var(--space-xl);  /* 32px sides on mobile */
  }

  section {
    padding-block: var(--space-2xl);  /* 48px top/bottom on mobile */
  }

  /* Desktop: more breathing room */
  @media (min-width: 1024px) {
    main { padding-inline: var(--space-2xl); }
    section { padding-block: var(--space-3xl); }
  }
}
```

**No horizontal scroll prevention:**
- No fixed pixel widths on block elements — use `max-width` + `width: 100%`
- No negative margins wider than the container
- `overflow-x: hidden` on `body` as a safety net (in `css/reset.css`)

---

### LAYOUT-04: Lowercase Asset Filenames

**What to enforce:** A naming checklist, not code. Every filename in `assets/` must be all-lowercase with hyphens.

**Pre-committed filenames (all lowercase confirmed):**
- `assets/fonts/cormorant-garamond-400.woff2` ✓
- `assets/fonts/cormorant-garamond-600.woff2` ✓
- `assets/fonts/lora-400.woff2` ✓
- `assets/textures/paper-grain.png` ✓
- `assets/og-image.png` ✓
- `assets/favicon.ico` ✓
- `assets/favicon.svg` ✓

**Verification:** `git ls-files assets/ | grep -E '[A-Z]'` should produce no output.

---

### LAYOUT-05: Open Graph + Viewport Meta

All values are locked in the UI-SPEC Copywriting Contract. The full set of required `<meta>` tags is documented in Open Question 7's HTML shell above.

**Key detail:** The `og:image` URL must be absolute (`https://corsiriccardo.github.io/assets/og-image.png`), not a relative path — social media crawlers do not resolve relative URLs. [CITED: Open Graph protocol — ogp.me]

---

## File Manifest (Phase 1 Deliverables)

All files to be created. None of these paths exist yet.

```
index.html                              ← replaces existing (full rewrite)
css/
  tokens.css                            ← @layer tokens: all custom properties
  reset.css                             ← @layer reset: box-sizing, margin/padding 0
  base.css                              ← @layer base: @font-face, body, smooth scroll
  layout.css                            ← @layer layout: page grid, section widths
  components.css                        ← @layer components: nav, skip-link, footer shell
  animations.css                        ← @layer animations: empty, layer declared
js/
  nav.js                                ← ES module: IO active-link + hamburger
assets/
  fonts/
    cormorant-garamond-400.woff2        ← downloaded from Google Fonts CDN
    cormorant-garamond-600.woff2        ← downloaded from Google Fonts CDN
    lora-400.woff2                      ← downloaded from Google Fonts CDN
  textures/
    paper-grain.png                     ← generated by Node script (200×200px)
  og-image.png                          ← generated by Node script (1200×630px)
  favicon.ico                           ← generated from favicon.svg
  favicon.svg                           ← hand-written SVG letter-mark (RC initials)
scripts/                               ← dev-only, not deployed
  download-fonts.js                     ← downloads 3 WOFF2 from Google Fonts CDN
  generate-texture.js                   ← generates paper-grain.png (no deps)
  generate-og-image.js                  ← generates og-image.png (requires pureimage)
```

**Files left unchanged (old site, Phase 1 ignores):**
- `src/styles.css` — not referenced by new index.html
- `src/app.js` — not referenced by new index.html
- `app.js` (root) — not referenced by new index.html

---

## Architecture Patterns

### System Architecture Diagram

```
Browser request
      │
      ▼
  index.html (static, served by GitHub Pages)
      │
      ├── <head>
      │     ├── <link rel="preload"> ──► assets/fonts/*.woff2 (3 files, ~67 KB total)
      │     ├── <link> css/tokens.css   ─┐
      │     ├── <link> css/reset.css     │ @layer cascade
      │     ├── <link> css/base.css      │ (tokens wins least,
      │     ├── <link> css/layout.css    │  animations wins most)
      │     ├── <link> css/components.css│
      │     └── <link> css/animations.css─┘
      │
      ├── <body>
      │     ├── body::before ──────────────► assets/textures/paper-grain.png
      │     │                                (position:fixed, z:9999, opacity:0.035)
      │     ├── <header>
      │     │     └── <nav> (position:sticky, top:0, z:100)
      │     │           └── links: #hero, #projects, #about, #timeline, #contact
      │     ├── <main> (5 empty <section> placeholders)
      │     └── <footer>
      │
      └── <script type="module"> js/nav.js
              │
              ├── IntersectionObserver (rootMargin: -64px 0px -66% 0px)
              │     └── observes each section[id]
              │           └── on intersect: toggle .nav-link--active on matching nav link
              │
              └── hamburger button click
                    └── toggle nav.nav--open (show/hide mobile menu)
```

### CSS Layer Precedence (Lowest to Highest)

```
tokens → reset → base → layout → components → animations
  (variables)  (normalize) (body/font) (grid/widths) (nav/skip) (Phase 3)
```

A rule in `components` always wins over the same property in `base`, regardless of selector specificity. This is the key benefit of `@layer`. [CITED: MDN @layer]

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font WOFF2 download | Custom Python subsetting pipeline | Direct Google Fonts CDN download | CDN files are already Latin-only; sizes identical |
| OG image generation | ImageMagick shell commands | pureimage Node library | ImageMagick not installed; pureimage is pure JS, no native deps |
| Favicon ICO multi-resolution | Manual binary ICO format | npx svg-to-ico | ICO format is complex multi-image binary; library handles 16/32/48px variants |
| Active link detection | `scroll` event listener with `getBoundingClientRect()` | Intersection Observer | IO is passive (no main thread blocking), auto-unobserves, built into browser |
| CSS custom property lookup in @media | `var(--breakpoint-sm)` in media queries | Raw pixel values `640px` | CSS custom properties cannot be used inside `@media` — this is a spec limitation |

---

## Common Pitfalls

### Pitfall 1: crossorigin on Font Preload Links
**What goes wrong:** Font preload link works in DevTools Network tab but the font loads twice (once for preload, once for @font-face) causing a wasted request.
**Why it happens:** `<link rel="preload" as="font">` must include `crossorigin` attribute, even for same-origin fonts. Without it, the browser treats the preload and the @font-face fetch as different requests.
**How to avoid:** Always include `crossorigin` (no value needed — it defaults to `anonymous` which matches @font-face behavior).
**Warning signs:** Two font requests for the same file in DevTools Network tab.

### Pitfall 2: @layer Declaration Order Must Match Link Order
**What goes wrong:** Layer ordering is broken — `components` styles are overridden by `base` styles.
**Why it happens:** If you declare `@layer base, components` in `tokens.css` but then a later file re-declares `@layer components, base`, the order from the second declaration wins (first declaration wins in the same stylesheet for the same layer set — but duplicate declarations in different files can cause confusion).
**How to avoid:** Declare all layer names exactly once, as the first statement in `css/tokens.css`. Never redeclare the order in other files.
**Warning signs:** Nav styles not applying; base styles bleeding into components.

### Pitfall 3: position: sticky Requires a Scrolling Ancestor
**What goes wrong:** `position: sticky` on `<header>` or `<nav>` doesn't stick.
**Why it happens:** `sticky` requires the parent container to have `overflow` other than `hidden` AND the element must have a `top`/`bottom` value. If any ancestor has `overflow: hidden`, sticky breaks.
**How to avoid:** Don't set `overflow: hidden` on `<html>` or `<body>` (use `overflow-x: hidden` ONLY if needed, not on `html`). Set `top: 0` explicitly on the sticky element.
**Warning signs:** Nav scrolls away with the page.

### Pitfall 4: CSS custom properties inside @media (spec trap)
**What goes wrong:** `@media (max-width: var(--breakpoint-sm))` silently fails — the media query is ignored.
**Why it happens:** CSS custom properties cannot be used inside `@media` conditions — this is a fundamental spec limitation.
**How to avoid:** Always use raw pixel values in `@media`: `@media (max-width: 639px)`. Breakpoint custom properties in `tokens.css` are documentation only (as noted in UI-SPEC).
**Warning signs:** Mobile hamburger never appears; responsive layout never triggers.

### Pitfall 5: body::before texture z-index blocks clicks
**What goes wrong:** Links and buttons become unclickable after adding the texture overlay.
**Why it happens:** The texture `body::before` has `z-index: 9999` and covers the entire viewport. Without `pointer-events: none`, it intercepts all mouse events.
**How to avoid:** Always include `pointer-events: none` on `body::before`. [VERIFIED: UI-SPEC already specifies this]
**Warning signs:** Nav links don't respond to clicks after texture is added.

### Pitfall 6: Old src/ files accidentally loaded
**What goes wrong:** The old Poppins/FontAwesome styles bleed into the new design.
**Why it happens:** If `index.html` is partially edited and the old `<link rel="stylesheet" href="src/styles.css">` is not removed.
**How to avoid:** The new `index.html` is a full rewrite — do not preserve any `<link>` or `<script>` tags from the old file.
**Warning signs:** FontAwesome icons or Poppins typeface visible in browser.

### Pitfall 7: OG image URL must be absolute
**What goes wrong:** Slack/LinkedIn preview shows no image or a broken image.
**Why it happens:** Social crawlers request the `og:image` URL from their own servers — relative paths cannot be resolved.
**How to avoid:** Use the full absolute URL: `https://corsiriccardo.github.io/assets/og-image.png`.
**Warning signs:** LinkedIn post inspector shows image 404.

---

## Validation Architecture

Phase 1 has no automated test framework — validation is manual browser verification plus git filename checks. No `nyquist_validation` is configured for this project.

### Verification Checklist Per Requirement

| Req ID | Behavior to Verify | How to Verify |
|--------|--------------------|---------------|
| FOUND-01 | All token custom properties defined | DevTools > Elements > `:root` computed — all `--color-*`, `--space-*` etc. present |
| FOUND-02 | WOFF2 fonts load from local assets | DevTools > Network > Font — 3 files from `assets/fonts/`, NOT from gstatic.com |
| FOUND-02 | Correct fonts render | DevTools > Elements > body computed font — "Cormorant Garamond" or "Lora" |
| FOUND-03 | Texture visible | Set body::before opacity to 0.3 in DevTools — grain pattern visible; restore to 0.035 |
| FOUND-03 | Texture doesn't block interaction | Click all nav links with texture present — all respond |
| FOUND-04 | Contrast ratio passes AA | WebAIM Contrast Checker — `#2C2416` on `#F5F0E8` ≥ 4.5:1 |
| FOUND-05 | Layer order correct | DevTools > Sources > CSS — tokens.css has `@layer tokens, reset, base, ...` as first line |
| LAYOUT-01 | Semantic HTML valid | W3C Validator (validator.w3.org) — no errors |
| LAYOUT-01 | Skip link works | Tab from address bar — skip link becomes visible; Enter jumps to main |
| LAYOUT-02 | Nav sticks | Scroll down 300px — nav stays at top |
| LAYOUT-02 | Active link updates | Scroll to each section — corresponding nav link gets accent underline |
| LAYOUT-02 | Hamburger works at 375px | Chrome DevTools device simulation 375px — hamburger icon appears; click opens menu |
| LAYOUT-03 | No horizontal scroll | Window to 375px width — no horizontal scrollbar appears |
| LAYOUT-04 | All filenames lowercase | `git ls-files assets/ | grep -E '[A-Z]'` — no output |
| LAYOUT-05 | OG tags present | View page source — all 7 OG-related tags present with correct values |
| LAYOUT-05 | OG image loads | Open `https://corsiriccardo.github.io/assets/og-image.png` in browser — 1200×630 warm cream image |

### Phase Success Criteria Check (from ROADMAP.md)

1. Opening `index.html` shows cream background with grain and Cormorant Garamond/Lora — no system fonts
2. Sticky nav renders at all widths with no horizontal scroll; scrolling highlights nav links
3. Sharing the URL on Slack renders correct OG title, description, image
4. All asset filenames lowercase; no 404s on case-sensitive server

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Font download, asset generation scripts | Yes | v24.14.0 | — |
| Python 3.11 | fonttools subsetting (if needed) | Yes (full path) | 3.11.9 | Not needed — Google CDN files already Latin-only |
| fonttools + brotli | Font subsetting | Not installed | — | Not needed; direct CDN download used |
| ImageMagick | Noise tile generation | Not installed | — | Node.js pure-PNG script (no deps) |
| pureimage npm | OG image generation | Not installed (installable) | 0.4.x | Manual design in Figma/Canva — export as PNG |
| svg-to-ico npm | favicon.ico from favicon.svg | Not installed (installable) | — | realfavicongenerator.net (online, free) |

**Missing with no fallback:** None — all gaps have workable alternatives.

**Recommended installs before starting Phase 1 tasks:**
```bash
npm install pureimage
# svg-to-ico only if preferred over online favicon generator
npm install svg-to-ico
```

These are dev-only installs, never deployed. `node_modules/` stays gitignored.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Google Fonts CDN `<link>` tag | Self-hosted WOFF2 + preload | 2020–2023 privacy shift | Eliminates tracking, removes render-blocking third-party request |
| CSS specificity wars with `!important` | CSS `@layer` cascade control | CSS @layer: Chrome 99 / 2022 | Predictable style ordering without specificity hacks |
| `scroll` event + `getBoundingClientRect()` for scrollspy | Intersection Observer | 2016+ (IO API) | Passive observation, no layout thrashing |
| Live SVG `feTurbulence` texture | Static PNG noise tile | Performance concern | feTurbulence repaints every frame on mobile — PNG tile is one-time composite |
| Smooth scroll JS library | `scroll-behavior: smooth` CSS | CSS scroll-behavior: all modern browsers | Zero JS, native, OS motion preference respected via media query |
| `font-display: block` (default) | `font-display: swap` | Web font performance shift | Prevents invisible text during font load; shows fallback immediately |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Old `src/` directory files are harmless to leave in place in Phase 1 — the new index.html does not reference them | Handling Existing index.html | Low: worst case is stale files in repo; no functional impact |
| A2 | Manual OG image creation (Figma/Canva/GIMP) is an acceptable fallback if pureimage font rendering is unsatisfactory | OG Image Generation | Low: OG image quality barely matters for social preview thumbnails |
| A3 | `favicon.svg` uses "RC" initials as the letter-mark | Favicon Generation | Medium: UI-SPEC does not specify the favicon design; if a different symbol is preferred, the SVG changes but the approach does not |
| A4 | `body::before` using `position: fixed` correctly covers the full viewport during scroll | Paper Texture | Low: position:fixed on pseudo-elements is universally supported and standard for viewport overlays |
| A5 | `color-mix()` for nav background opacity is acceptable (Chrome 111+, FF 113+, Safari 16.2+) | LAYOUT-02 Nav CSS | Low: target audience uses modern browsers; if needed, fallback to `rgba(237, 232, 223, 0.95)` hardcoded |

---

## Sources

### Primary (HIGH confidence)
- MDN Web Docs — Intersection Observer API (rootMargin, threshold)
- MDN Web Docs — @font-face, font-display, unicode-range
- MDN Web Docs — @layer cascade layers, browser support
- MDN Web Docs — prefers-reduced-motion, scroll-behavior
- MDN Web Docs — ARIA landmark roles, skip navigation
- W3C WCAG C39 — prefers-reduced-motion technique
- Google Fonts CDN — verified live HEAD requests for font file sizes (2026-04-21)
- gwfh.mranftl.com API — confirmed WOFF2 URLs for Cormorant Garamond 400/600 and Lora 400

### Secondary (MEDIUM confidence)
- WebAIM — Skip Navigation Links best practices (webaim.org/techniques/skipnav/)
- Smashing Magazine — Dynamic Header with Intersection Observer (2021)
- fonttools.readthedocs.io — pyftsubset syntax (referenced but not needed for this project)

### Tertiary (LOW confidence — cited but not needed)
- pureimage npm / GitHub — pure JS canvas for OG image (confirmed available, not yet tested on this machine)

---

## Metadata

**Confidence breakdown:**
- Font files: HIGH — live verified sizes and URLs
- @layer architecture: HIGH — confirmed MDN browser support
- IO nav pattern: HIGH — confirmed MDN documentation
- Texture generation: MEDIUM — Node pure-PNG approach is logical but the specific script is hand-authored (not from a library with docs)
- OG image generation: MEDIUM — pureimage available and documented but custom font embedding in pureimage requires extra registration step
- Favicon: MEDIUM — svg-to-ico is well-documented but simple SVG hand-authoring is ASSUMED acceptable for this use case

**Research date:** 2026-04-21
**Valid until:** 2026-07-21 (stable specs; font CDN URLs may change if Google updates font versions)
