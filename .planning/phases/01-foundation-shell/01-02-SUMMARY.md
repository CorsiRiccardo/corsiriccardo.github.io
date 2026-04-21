---
phase: 01-foundation-shell
plan: 02
subsystem: ui
tags: [woff2, fonts, png, favicon, og-image, pureimage, nodejs]

requires: []

provides:
  - Three self-hosted WOFF2 font files (Cormorant Garamond 400/600, Lora 400) at assets/fonts/
  - 200x200px warm noise PNG tile at assets/textures/paper-grain.png for CSS body::before texture
  - 1200x630px warm cream OG social preview image at assets/og-image.png
  - SVG favicon with RC initials (cream bg, dark text) at assets/favicon.svg
  - Multi-resolution ICO favicon at assets/favicon.ico
  - Node.js generation scripts at scripts/ (download-fonts.js, generate-texture.js, generate-og-image.js)

affects:
  - 01-03 (CSS base.css needs @font-face pointing to these WOFF2 files)
  - 01-03 (CSS base.css body::before needs assets/textures/paper-grain.png)
  - 01-04 (index.html needs og-image.png absolute URL and favicon links)

tech-stack:
  added:
    - pureimage 0.4.18 (dev-only, OG image generation, pure JS canvas)
    - svg-to-ico via npx (dev-only, favicon ICO conversion)
  patterns:
    - Pure Node.js PNG generation (zlib + Buffer, no native deps) for noise texture
    - pureimage with system font registration for canvas-based image generation
    - Direct Google Fonts CDN download for pre-subsetted Latin WOFF2 files

key-files:
  created:
    - assets/fonts/cormorant-garamond-400.woff2
    - assets/fonts/cormorant-garamond-600.woff2
    - assets/fonts/lora-400.woff2
    - assets/textures/paper-grain.png
    - assets/og-image.png
    - assets/favicon.svg
    - assets/favicon.ico
    - scripts/download-fonts.js
    - scripts/generate-texture.js
    - scripts/generate-og-image.js
    - .gitignore
    - package.json
  modified: []

key-decisions:
  - "pureimage requires explicit async font.load() before drawing — registerFont alone does not load the font"
  - "Used Windows system Arial Bold (C:/Windows/Fonts/arialbd.ttf) as OG image display font since Cormorant Garamond is WOFF2-only with no TTF available locally"
  - "Added .gitignore to exclude node_modules/ — pureimage is dev-only and must not be deployed"

patterns-established:
  - "Script pattern: Node built-in only (https, zlib, fs) for font download and texture generation — zero npm deps"
  - "Script pattern: pureimage with system font registration for canvas PNG generation"

requirements-completed:
  - FOUND-02
  - FOUND-03
  - LAYOUT-04

duration: 4min
completed: 2026-04-21
---

# Phase 01 Plan 02: Binary Asset Generation Summary

**Three WOFF2 fonts downloaded from Google Fonts CDN, 200x200px warm noise tile generated via raw PNG bytes, 1200x630px OG image rendered via pureimage with system font, RC initials SVG+ICO favicon created — all assets lowercase and validated**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-21T20:21:18Z
- **Completed:** 2026-04-21T20:25:45Z
- **Tasks:** 2 (checkpoint pending human verify)
- **Files created:** 12

## Accomplishments

- Downloaded and verified 3 WOFF2 font files: cormorant-garamond-400.woff2 (22,876 B), cormorant-garamond-600.woff2 (23,396 B), lora-400.woff2 (21,148 B) — all valid WOFF2 magic bytes confirmed
- Generated 200x200px warm noise PNG tile (52,577 B) using pure Node.js with zlib — no external tools required
- Generated 1200x630px OG image (12,226 B) via pureimage with Windows Arial Bold system font registered and loaded asynchronously
- Created favicon.svg (32x32, RC initials, cream #F5F0E8 bg, dark #2C2416 text) and converted to favicon.ico (19,660 B) via npx svg-to-ico
- All filenames confirmed lowercase; no uppercase characters in assets/

## Task Commits

Each task was committed atomically:

1. **Task 1: Download fonts + generate texture** — `3a25e12` (feat)
2. **Task 2: Generate OG image + favicon** — `930c7ca` (feat)

**Plan metadata:** pending (to be committed with this SUMMARY)

## Files Created/Modified

- `assets/fonts/cormorant-garamond-400.woff2` — Cormorant Garamond 400 Latin subset (22,876 B)
- `assets/fonts/cormorant-garamond-600.woff2` — Cormorant Garamond 600 Latin subset (23,396 B)
- `assets/fonts/lora-400.woff2` — Lora 400 Latin subset (21,148 B)
- `assets/textures/paper-grain.png` — 200x200px warm noise tile for body::before CSS overlay
- `assets/og-image.png` — 1200x630px warm cream OG social preview image
- `assets/favicon.svg` — 32x32 RC letter-mark, cream bg, dark text, Georgia serif
- `assets/favicon.ico` — Multi-resolution ICO (19,660 B) from svg-to-ico
- `scripts/download-fonts.js` — Node https download script, zero npm deps
- `scripts/generate-texture.js` — Pure Node PNG encoder using zlib, zero npm deps
- `scripts/generate-og-image.js` — pureimage canvas script with async system font registration
- `.gitignore` — Excludes node_modules/ from commits
- `package.json` / `package-lock.json` — pureimage dev dependency

## Decisions Made

- **pureimage font loading is async**: `registerFont()` returns a font object; `await font.load()` must be called before drawing text, otherwise pureimage silently skips text rendering. This is not documented clearly in the pureimage README.
- **System font fallback for OG image**: Cormorant Garamond is only available as WOFF2 (not TTF/OTF locally). Used Windows Arial Bold as OG display font — acceptable since OG images are compressed by social platforms anyway.
- **Added .gitignore**: No .gitignore existed; added to exclude node_modules/ from deployment artifacts.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] pureimage registerFont requires await font.load() before drawing**
- **Found during:** Task 2 (OG image generation)
- **Issue:** First run produced a 4,143 B PNG with only the cream background — text was silently skipped because the font was registered but not awaited before ctx.font was set. File was below the 5,000 B acceptance threshold.
- **Fix:** Updated generate-og-image.js to `await font.load()` immediately after registerFont(), and used the registered font family name in all ctx.font assignments. Result: 12,226 B PNG with visible text.
- **Files modified:** scripts/generate-og-image.js
- **Verification:** File size increased from 4,143 B to 12,226 B; no "Font missing" warnings in output
- **Committed in:** 930c7ca (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — bug in pureimage font loading)
**Impact on plan:** Fix was necessary to meet the 5,000 B acceptance criterion and produce a usable OG image. No scope creep.

## Issues Encountered

- `res.on('end')` in the font download script fires before the write stream closes, so sizes printed during download appeared smaller than actual. Final file sizes verified correct via `fs.statSync()` — all three WOFF2 files match expected CDN sizes exactly.
- pureimage does not ship bundled fonts and requires a TTF/OTF file path — documented in key-decisions.

## User Setup Required

None — all assets were generated automatically. No external services required.

The checkpoint (Task 3) is a human visual verification step:
1. Open `assets/og-image.png` — should show 1200x630 warm cream background with "Riccardo Corsi" and "Software Developer" text and a gold accent line
2. Open `assets/favicon.svg` in a browser — should show a cream square with "RC" in dark text
3. Confirm `assets/favicon.ico` is non-empty (19,660 B)
4. Verify no uppercase filenames under assets/

## Next Phase Readiness

- assets/fonts/ is populated with valid WOFF2 files — Plan 03 can wire @font-face in css/base.css
- assets/textures/paper-grain.png exists — Plan 03 can add body::before CSS rule
- assets/og-image.png and favicons exist — Plan 04 can reference them in index.html head
- All filenames lowercase — LAYOUT-04 requirement satisfied

## Self-Check

Verifying all claimed artifacts exist:

- [x] assets/fonts/cormorant-garamond-400.woff2 — 22,876 B, WOFF2 magic confirmed
- [x] assets/fonts/cormorant-garamond-600.woff2 — 23,396 B, WOFF2 magic confirmed
- [x] assets/fonts/lora-400.woff2 — 21,148 B, WOFF2 magic confirmed
- [x] assets/textures/paper-grain.png — 52,577 B
- [x] assets/og-image.png — 12,226 B (> 5,000 B threshold)
- [x] assets/favicon.svg — contains "RC", fill="#F5F0E8", fill="#2C2416"
- [x] assets/favicon.ico — 19,660 B
- [x] scripts/download-fonts.js — exists
- [x] scripts/generate-texture.js — exists
- [x] scripts/generate-og-image.js — exists
- [x] Commits 3a25e12 and 930c7ca exist in git log

## Self-Check: PASSED

---
*Phase: 01-foundation-shell*
*Completed: 2026-04-21*
