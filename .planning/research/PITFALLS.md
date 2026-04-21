# Domain Pitfalls

**Domain:** Personal developer portfolio — vanilla HTML/CSS/JS, "carta invecchiata" aesthetic, GitHub Pages
**Audience:** Recruiters and collaborators
**Researched:** 2026-04-21

---

## Critical Pitfalls

Mistakes that cause rewrites, invisible failures, or immediate credibility loss.

---

### Pitfall 1: SVG feTurbulence Texture on the Compositor Thread

**What goes wrong:** Using an SVG `feTurbulence` filter to produce the paper grain effect — applied as a full-viewport pseudo-element or background — forces continuous repaint on scroll. Because `feTurbulence` cannot be promoted to its own GPU compositor layer the way `transform` and `opacity` can, every scroll event or animation triggers a CPU repaint of the entire textured area. On mid-range mobile devices this kills frame rate instantly.

**Why it happens:** Developers discover `feTurbulence` as the "CSS-native" way to simulate paper grain (no external image needed), then apply it at full page scale without considering paint cost. SVG filters are documented as "very heavy" for large areas, especially in WebKit and Firefox.

**Consequences:** Janky scrolling on mobile, fan noise on desktop, poor Lighthouse performance score. The site's own aesthetic becomes the reason it underperforms.

**Prevention:**
- Use a pre-rendered, losslessly compressed WebP or PNG noise tile (~200x200px) tiled via `background-repeat: repeat` instead of a live SVG filter for the base grain. This is a one-time paint cost, not per-frame.
- If `feTurbulence` is used at all, scope it to a fixed, small-area decorative element only (e.g., a card corner accent), never to the full background.
- Set the texture pseudo-element to `position: fixed` and `will-change: transform` to isolate it; verify with Chrome DevTools Layers panel that it has its own composited layer.
- Test on an actual mid-range Android device, not just Chrome DevTools emulation.

**Warning signs:** Chrome DevTools Performance panel shows green "Paint" rectangles covering the full viewport on every scroll tick. Lighthouse flags "Avoid large layout shifts" or LCP > 2.5s.

**Phase:** Foundation / visual design phase. Decide the texture implementation technique before writing any other CSS — changing it later requires refactoring every component that assumes the background layer.

---

### Pitfall 2: Google Fonts Blocking Render and Causing FOIT

**What goes wrong:** Linking Google Fonts via a `<link>` tag in `<head>` without `font-display: swap` blocks rendering. The browser fetches the CSS from `fonts.googleapis.com`, parses it, then fetches the font files from `fonts.gstatic.com` — two cross-origin round trips before text is painted. Visitors see blank text (FOIT) or a jarring swap (FOUT without control).

**Why it happens:** The default Google Fonts embed snippet does not include `font-display` in the URL query string. Developers copy-paste the embed without auditing it.

**Consequences:** Text is invisible for 1-3 seconds on slow connections. LCP is directly worsened because the hero headline — the first thing a recruiter reads — is the last thing that renders. Google Fonts also introduces a privacy concern (request logged by Google) that contradicts the handcrafted, personal nature of the site.

**Prevention:**
- Self-host fonts using `fontsource` packages or by downloading directly via `google-webfonts-helper`. Place `.woff2` files in `/assets/fonts/` and declare `@font-face` with `font-display: swap`.
- Preload the single most critical font weight: `<link rel="preload" as="font" href="/assets/fonts/[name].woff2" crossorigin>`. Limit preload to 1-2 files maximum.
- Subset fonts to Latin characters only using the `unicode-range` descriptor or a tool like `pyftsubset`, cutting file size by 60-80%.
- If Google Fonts is kept for convenience, append `&display=swap` to the URL query string at minimum.

**Warning signs:** Lighthouse "Eliminate render-blocking resources" flags a Google Fonts URL. WebPageTest waterfall shows font requests starting after 800ms+.

**Phase:** Foundation / asset setup phase. Font hosting strategy must be decided before any component work, as it affects the `@font-face` declarations all components depend on.

---

### Pitfall 3: Unoptimized Project Screenshots Bloating Page Weight

**What goes wrong:** Developers take full-resolution screenshots of their apps (1920×1080, exported as PNG) and drop them directly into the projects section. A typical PNG screenshot of a web app is 800KB–3MB. With 4-6 projects, the page easily exceeds 10MB of images — loaded all at once.

**Why it happens:** Screenshots feel like "real" assets, so developers treat them with care for quality and little care for size. PNG is chosen for sharpness. No conversion step is added.

**Consequences:** Page load time measured in seconds on mobile. Recruiter on a phone with LTE gives up. Lighthouse score under 50. The portfolio becomes ironic: a slow, heavy site built by someone applying to build fast, efficient software.

**Prevention:**
- Convert all project screenshots to WebP at 80% quality. Tool: `cwebp` or Squoosh. Target < 100KB per image.
- Serve images at the display size, not the source size. A card thumbnail displayed at 600px wide does not need a 1920px source. Use `width` and `height` attributes to prevent layout shift.
- Add `loading="lazy"` to all project images (below the fold). Do NOT apply lazy loading to the hero image or any above-the-fold image — it delays LCP.
- Add `fetchpriority="high"` to the first visible above-fold image.
- Use `<picture>` with WebP source and JPEG fallback for maximum compatibility.

**Warning signs:** Any image file > 200KB in the assets directory. Lighthouse "Serve images in next-gen formats" or "Properly size images" flags.

**Phase:** Projects content phase. Establish an image pipeline (Squoosh or a simple shell alias) before adding any project screenshots.

---

### Pitfall 4: Vague Project Descriptions That Say Nothing

**What goes wrong:** Project cards read like commit messages: "A web app built with React and a REST API." A recruiter reading this learns nothing about complexity, problem-solving, scale, or outcome. They move on.

**Why it happens:** Developers describe what they built (the technology list) rather than why it matters and what was hard. They mistake naming tools for communicating competence.

**Consequences:** The portfolio fails its core purpose. Recruiters cannot differentiate this developer from any other who has touched React. Collaborators cannot assess fit. The 10-second rule from the PROJECT.md is violated: the visitor understands neither who Riccardo is nor what he has actually built.

**Prevention:** Each project description must answer four questions:
1. What problem does this solve, and for whom?
2. What was the technically interesting or difficult part?
3. What is one measurable or concrete outcome (users, performance metric, time saved)?
4. What is the current state (live, archived, maintained)?

Format: 2-3 sentences maximum — dense, specific, honest. Example of before/after:

- WRONG: "CLI tool built in Rust for file processing."
- RIGHT: "Processes 50K-row CSV files in under 200ms by streaming records instead of loading to memory. Used in my own workflow daily to automate report generation that previously took 20 minutes of manual work."

**Warning signs:** Any description containing only a technology list without a verb describing impact. Descriptions longer than 4 sentences (too much detail kills scannability).

**Phase:** Content phase. Write descriptions before building the card UI, so the design can be validated against real content length, not lorem ipsum.

---

## Moderate Pitfalls

---

### Pitfall 5: Too Many Typefaces Undermining the Editorial Feel

**What goes wrong:** The carta invecchiata aesthetic invites experimentation with "vintage" typography — a display serif for headings, a different serif for body, a monospace for code snippets, and perhaps a decorative script for accent labels. Three or more distinct typefaces fracture visual coherence. The result reads as cluttered rather than editorial.

**Why it happens:** Each font choice feels justified in isolation ("the monospace feels technical," "the script adds warmth"), but the combination is never audited holistically.

**Consequences:** Slower load (more font files), inconsistent rhythm, and a design that fights itself rather than framing the content.

**Prevention:**
- Use a maximum of two typefaces: one serif (headings and display) and one sans-serif or the same serif at a different weight (body). A single well-chosen variable-weight serif can handle both roles.
- Monospace for code is acceptable as a third face only if it appears in a very constrained context (inline code or a brief snippet block) and uses a system monospace stack before loading a custom file.
- Establish a type scale in CSS custom properties early (`--font-heading`, `--font-body`, `--size-xs` through `--size-2xl`) and never deviate from it.

**Warning signs:** More than two `@font-face` families declared. Any element using a font family not in the defined scale. A Figma mockup (or browser inspection) revealing three or more distinct typeface names.

**Phase:** Visual design / foundation phase.

---

### Pitfall 6: Paper Texture Destroying Text Contrast on Warm Backgrounds

**What goes wrong:** A cream/ivory background (#F5F0E8 or similar) combined with warm-toned body text (a slightly desaturated dark brown instead of pure black) can drop below the WCAG 4.5:1 contrast ratio. Adding a semi-transparent grain layer on top reduces contrast further. The result looks beautiful in a design tool at 100% zoom on a calibrated display, and fails in a recruiter's browser tab at 80% zoom on a Windows laptop.

**Why it happens:** Designers eyeball contrast on their own high-quality displays. The warm palette feels readable because the designer sees the aesthetic intent, not the accessibility gap.

**Consequences:** Body text difficult to read, especially for users with mild visual impairment. Reduced reading speed for all users. Potential legal accessibility concern given the European Accessibility Act (EAA) enforcement from June 2025 onward.

**Prevention:**
- Verify all text/background color pairs using a contrast checker (e.g., the WebAIM contrast checker or browser DevTools accessibility panel) before finalizing the palette.
- The grain/noise texture overlay must be applied at low enough opacity that it does not measurably change the perceived contrast. Keep the pseudo-element opacity at 0.04–0.08 maximum and verify contrast after applying it.
- Use near-black on cream for body text: `#2C2420` on `#F5F0E8` produces ~9:1 contrast ratio. Do not try to "warm" the text color beyond a very slight tint.
- For secondary text (labels, dates, captions) maintain at least 4.5:1 even on the textured background.

**Warning signs:** Any CSS color pair that a contrast tool rates below 5:1 (leave margin above the 4.5:1 requirement to account for the texture). Body text set in a color with hue in the 20-40° warm range and lightness above 40.

**Phase:** Visual design / foundation phase, before any component is built.

---

### Pitfall 7: Scroll Reveal Animations Animating Layout Properties

**What goes wrong:** Scroll reveal effects that animate `height`, `margin-top`, `padding`, or `top` trigger layout recalculation on every animation frame. On slower devices this produces jank. Worse, if `prefers-reduced-motion` is not respected, the animations play for users who have explicitly opted out — a known cause of motion sickness.

**Why it happens:** Developers see a "slide up and fade" effect and implement it by animating `margin-top: 40px` to `margin-top: 0` alongside `opacity`. The opacity part is GPU-composited; the margin part is not.

**Consequences:** Dropped frames on mid-range mobile. Accessibility violation if `prefers-reduced-motion` is ignored. Elements that "jump" on load because the initial hidden state (opacity: 0; transform: translateY(20px)) causes content reflow before JS initializes.

**Prevention:**
- Animate only `transform` and `opacity`. Translate `translateY(20px)` to `translateY(0)` instead of moving margins.
- Wrap all animation declarations in a `@media (prefers-reduced-motion: no-preference)` block, so the base state has no animation and it is added only for users who prefer motion.
- Use Intersection Observer (not scroll event listeners) to trigger class additions. Disconnect the observer after elements have animated — do not keep it active for the lifetime of the page.
- Add the initial hidden class via JS, not CSS, so that if JS fails or is slow, content is visible by default (progressive enhancement).

**Warning signs:** DevTools Performance panel shows "Layout" (purple) in the animation flame chart, not just "Paint" and "Composite". Any `transition` or `@keyframes` block targeting `top`, `bottom`, `left`, `right`, `width`, `height`, `margin`, or `padding`.

**Phase:** Interactivity / animation phase.

---

### Pitfall 8: GitHub Pages Path and Case-Sensitivity Failures

**What goes wrong:** Assets load locally but 404 on GitHub Pages because:
1. An asset path uses a different case than the filename: `images/Hero.jpg` referenced as `images/hero.jpg` works on macOS (case-insensitive filesystem) but fails on the Linux server that serves GitHub Pages.
2. Absolute paths beginning with `/` work for the apex domain (`corsiriccardo.github.io`) but would break for project-page repos served at `/repo-name/` subpaths. For this repo specifically (the user org page), the root is `/` — but referencing this explicitly matters if the site is ever mirrored or cloned.
3. A CNAME file is accidentally deleted or overwritten by a deploy process, causing the custom domain to stop resolving and triggering GitHub to revert to the default URL, which then breaks any hardcoded absolute URLs.

**Why it happens:** macOS and Windows local dev environments are case-insensitive. The bug is invisible until the first push to GitHub Pages' Linux environment. CNAME files are text files that look unimportant and get deleted by accident or by workflows that do a clean deploy.

**Consequences:** The live site has broken images or CSS, but the developer's local version looks fine. Hours of debugging without an obvious cause. If a custom domain is used, a deleted CNAME causes a complete outage.

**Prevention:**
- Establish a naming convention: all filenames and directories use lowercase with hyphens only. Enforce this before committing any assets.
- Use only root-relative paths (`/assets/style.css`) for a user org page (not a project-page repo). Verify this works by checking which URL pattern GitHub Pages serves the repo from: `username.github.io` vs `username.github.io/repo`.
- If a CNAME is used: commit it to the repository root, treat it as a source file, and never delete it manually. Verify it survives each deploy by checking `git log --all -- CNAME`.
- After every deploy, verify the live URL with a fresh private browser tab (no cache) and check at least one asset URL in the browser network panel.

**Warning signs:** Assets working locally but broken after push. A 404 on an asset URL that differs only in letter case from the actual filename. The CNAME file disappearing from the repository root between commits.

**Phase:** Deployment / foundation phase. Set path conventions before creating any asset files.

---

## Minor Pitfalls

---

### Pitfall 9: No Visible Contact Path Above the Fold

**What goes wrong:** The contact section is at the bottom of a long single-page layout. A recruiter who lands on the hero section and wants to reach out has no visible way to do so without scrolling the entire page. If the nav link to the contact section is also subtle (low contrast, small target), the visitor may leave.

**Prevention:** Include the primary contact action (email link or LinkedIn) in the site header/navigation, always visible, in addition to the dedicated contact section at the bottom.

**Phase:** Layout / content phase.

---

### Pitfall 10: Hero Section That Speaks to Everyone and Nobody

**What goes wrong:** The headline says "Full Stack Developer | Passionate about code | Let's build something together." It is technically accurate and completely forgettable. A recruiter reads 20 portfolios a day. Generic positioning means zero recall.

**Prevention:** The hero headline should state a concrete claim: what kind of work, in what domain, with what result. "I build web tools that save time — CLIs, dashboards, utilities" is more memorable than a job title. The tagline should be written for the recruiter's mental model, not the developer's resume.

**Phase:** Content phase, before any visual design is applied to the hero.

---

### Pitfall 11: Outdated or Broken Live Demo Links

**What goes wrong:** Project cards link to a live demo hosted on a free-tier service (Heroku, Railway, Render) that spins down after inactivity. A recruiter clicks the link 6 months after deploy and sees a "service unavailable" or 30-second cold-start spinner. This is worse than no demo link at all — it signals neglect.

**Prevention:**
- For projects with a GitHub link and no live demo, use the GitHub repo link only. Do not link to dead or sleeping demos.
- If a demo is linked, note its status clearly (e.g., "Live demo — may take 10s to wake up on free tier"). Honest framing is better than a silent failure.
- Prefer GitHub Pages, Netlify, or Vercel for static demos — they do not sleep.

**Phase:** Content phase. Audit all project links before publishing.

---

### Pitfall 12: No `<meta>` Description or OG Tags

**What goes wrong:** When a recruiter shares the portfolio URL in Slack or LinkedIn, it unfurls as a blank card with just the URL. The first impression is made before the page loads.

**Prevention:** Add a `<meta name="description">` and `<meta property="og:title">`, `og:description`, `og:image` in the `<head>`. The OG image can be a simple 1200×630px screenshot of the hero section. This takes 15 minutes and applies to every future share.

**Phase:** Foundation / HTML shell phase.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|---|---|---|
| Visual foundation / CSS setup | Grain texture performance (feTurbulence repaint) | Use a static PNG tile, not a live SVG filter |
| Visual foundation / CSS setup | Text contrast destroyed by warm palette + grain | Run contrast checker on every color pair with texture applied |
| Asset pipeline | Unoptimized project screenshots | Convert to WebP < 100KB before any image is referenced in HTML |
| Font loading | FOIT / render blocking from Google Fonts CDN | Self-host fonts with `font-display: swap` and preload |
| Typography system | Too many typefaces fragmenting the editorial aesthetic | Lock to two families in CSS custom properties; never deviate |
| Animation implementation | Scroll reveal animating layout properties | Animate only `transform` + `opacity`; respect `prefers-reduced-motion` |
| GitHub Pages deploy | Case-sensitive paths breaking on Linux server | All filenames lowercase; test with fresh browser tab post-deploy |
| GitHub Pages deploy | CNAME file disappearing | Commit CNAME to repo; verify it survives every deploy |
| Project content | Vague descriptions listing tools not outcomes | Write descriptions first, before building card UI |
| Hero / about content | Generic positioning | Write concrete claim, not job title + buzzwords |
| Project links | Broken or sleeping live demo links | Audit all links; remove or annotate sleeping services |
| HTML head | Missing OG tags and meta description | Add before first publish; use a 1200x630 OG image |

---

## Sources

- [5 Mistakes Developers Make in Their Portfolio Websites — Dev Portfolio Templates](https://www.devportfoliotemplates.com/blog/5-mistakes-developers-make-in-their-portfolio-websites)
- [7 Deadly Sins of Developer Portfolios — Pesto Tech](https://pesto.tech/resources/7-deadly-sins-of-developer-portfolios-and-how-to-avoid-them)
- [Grainy Gradients — CSS-Tricks](https://css-tricks.com/grainy-gradients/)
- [Grainy Gradients — Frontend Masters Blog](https://frontendmasters.com/blog/grainy-gradients/)
- [SVG Filter Effects: Creating Texture with feTurbulence — Codrops](https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/)
- [Self Host Google Fonts for Better Core Web Vitals — corewebvitals.io](https://www.corewebvitals.io/pagespeed/self-host-google-fonts)
- [The Ultimate Guide to Font Performance Optimization — DebugBear](https://www.debugbear.com/blog/website-font-performance)
- [Optimizing Web Fonts: FOIT vs FOUT — Talent500](https://talent500.com/blog/optimizing-fonts-foit-fout-font-display-strategies/)
- [Optimizing Images for Web Performance — DebugBear](https://www.debugbear.com/blog/image-optimization-web-performance)
- [Image Optimization: High Performance Images — Request Metrics](https://requestmetrics.com/web-performance/high-performance-images/)
- [Introduction to Scroll Animations with Intersection Observer — DEV Community](https://dev.to/ljcdev/introduction-to-scroll-animations-with-intersection-observer-d05)
- [The Web Animation Performance Tier List — Motion.dev](https://motion.dev/magazine/web-animation-performance-tier-list)
- [Troubleshooting 404 Errors for GitHub Pages — GitHub Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites)
- [How to Fix Common GitHub Pages URL and 404 Errors — iifx.dev](https://iifx.dev/en/articles/457751100/how-to-fix-common-github-pages-url-and-404-errors)
- [Readability vs. Legibility — 99designs](https://99designs.com/blog/tips/readability-vs-legibility/)
- [Top Portfolio Projects to Impress Recruiters 2025 — NareshIT](https://nareshit.com/blogs/portfolio-projects-to-impress-recruiters-guide-nareshit)
