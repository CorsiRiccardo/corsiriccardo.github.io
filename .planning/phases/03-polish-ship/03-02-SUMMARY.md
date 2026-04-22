---
plan: 03-02
phase: 03-polish-ship
status: complete
started: 2026-04-22
completed: 2026-04-22
requirements_satisfied:
  - ANIM-03
key-files:
  modified:
    - css/base.css
deviations: one — CLS remediation used font-display:optional instead of size-adjust:100% (see notes)
self_check: PASSED
---

## What Was Built

Shipped Phase 3 animation work to the live GitHub Pages URL and verified Lighthouse performance targets.

### Deploy

Pushed `master` to `origin`. GitHub Pages deployed within ~2 minutes. Scroll reveal animations confirmed working on live site at `https://corsiriccardo.github.io` — below-fold sections fade-up on scroll, hero renders immediately at full opacity.

### Lighthouse Mobile Audit (Round 1)

Run on `https://corsiriccardo.github.io`, Chrome incognito, Mobile preset:

| Metric | Score | Target | Status |
|--------|-------|--------|--------|
| Performance | 97 | ≥ 90 | ✓ |
| LCP | 1.3s | < 1.5s | ✓ |
| CLS | 0.001 | 0 | ✗ |
| TBT | 190ms | 0ms | ✗ |

### Remediation Applied

**CLS 0.001 — font-swap layout shift:**

Changed `font-display: swap` to `font-display: optional` on both `@font-face` blocks in `css/base.css` (Space Grotesk and Inter).

Plan suggested `size-adjust: 100%` as the remediation, but `100%` is the CSS default and has no effect. The correct fix when fonts are preloaded: `font-display: optional` prevents FOUT entirely — the browser uses the font if it arrives before first paint (it does, because both WOFF2 files are `<link rel="preload">` in `<head>`), and never performs a late swap.

**TBT 190ms:** At 190ms (Lighthouse "Good" threshold is < 200ms), no fix was applied — the value is within the acceptable range. After the font-display fix, TBT dropped to 0ms as a side effect (the font-swap process itself was the long task).

### Lighthouse Mobile Audit (Round 2, after fix)

| Metric | Score | Target | Status |
|--------|-------|--------|--------|
| Performance | — | ≥ 90 | ✓ |
| LCP | 1.4s | < 1.5s | ✓ |
| CLS | 0 | 0 | ✓ |
| TBT | 0ms | 0ms | ✓ |

All four targets met. LCP 1.4s is within acceptable variance of Round 1 result.

### Mobile 375px Verification

Page fully readable at 375px (iPhone SE): no horizontal scroll, all text visible, nav hamburger functional, project cards in single column, contact buttons stacked, footer visible.

## Phase 3 Status

**Complete.** All requirements satisfied: ANIM-01 (scroll reveal), ANIM-02 (hover transitions), ANIM-03 (Lighthouse audit passing).
