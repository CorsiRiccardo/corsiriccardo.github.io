---
status: issues
reviewer: claude-sonnet-4-6
date: 2026-04-22
phase: 02-core-content
---

# Phase 2 Code Review

## Scope

Files reviewed:
- - - - 
Supporting files read for context:
- , , , - 
---

## Findings

### [HIGH] Three color-mix() calls lack the required rgba() fallback

File: 
The project rule states every color-mix() call must be preceded on the immediately preceding line by an rgba() fallback. Three occurrences violate this:

Line 39 — nav border-bottom has no rgba() fallback preceding it.
Line 103 — mobile nav border-bottom (inside the 639px media query) has no rgba() fallback preceding it.
Line 121 — mobile .nav-link--active background has no rgba() fallback preceding it.

All three are Phase 1 nav rules, not Phase 2 additions, but they live inside the single @layer components block. The constraint applies to the whole file.

Fix for line 39:
  border-bottom: 1px solid rgba(44, 36, 22, 0.10);
  border-bottom: 1px solid color-mix(in srgb, var(--color-text-primary) 10%, transparent);

Fix for line 103 (same computed values):
  border-bottom: 1px solid rgba(44, 36, 22, 0.10);
  border-bottom: 1px solid color-mix(in srgb, var(--color-text-primary) 10%, transparent);

Fix for line 121 (--color-accent = #8B6914):
  background-color: rgba(139, 105, 20, 0.08);
  background-color: color-mix(in srgb, var(--color-accent) 8%, transparent);

---

### [HIGH] Transitions on .skip-link and .nav-link have no prefers-reduced-motion guard

File: , lines 15 and 57

The project rule requires a prefers-reduced-motion: reduce guard on every transition or transform. The .btn block is correctly guarded (lines 213-220). The .skip-link case is the more serious violation because it animates a positional jump (top: -100% to top: var(--space-sm)) that vestibular-disorder users opt out of via the OS setting.

Fix — add to the existing reduced-motion block or create a new one:
  @media (prefers-reduced-motion: reduce) {
    .skip-link { transition: none; }
    .nav-link  { transition: none; }
  }

---

### [MEDIUM] Placeholder URLs are live and will 404 in production

File: , lines 7, 15, 16, 24

All three projects use placeholder URLs (fab.com/placeholder-*, assetstore.unity.com/placeholder-*, github.com/corsiriccardo/placeholder-*). These are rendered as clickable anchors. Any visitor on the deployed site who clicks a project link will land on a 404, damaging credibility on a professional portfolio.

Fix: Replace with real URLs before merging to master, or temporarily remove the links arrays. The buildCard function already handles empty/absent links arrays correctly — the actions row is omitted.

---

### [MEDIUM] link.url assigned to a.href without protocol validation

File: , lines 18-19

    const a = document.createElement('a');
    a.href = link.url;

Any string is accepted by a.href, including javascript: URIs. The JSON is fetched at runtime, so a CDN compromise or future data error could inject an executable URI.

Fix:
    const url = link.url;
    if (url && (url.startsWith('https://') || url.startsWith('http://') || url.startsWith('mailto:'))) {
      a.href = url;
    } else {
      a.removeAttribute('href');
    }

---

### [LOW] NAV_HEIGHT constant in nav.js will silently drift if the CSS token changes

File: , line 5

The comment is present and makes it auditable. Accepted trade-off in vanilla JS. Flag for the Phase 3 checklist if --nav-height ever changes.

---

### [LOW] Error fallback uses innerHTML — confirmed acceptable

File: , lines 72-76

The innerHTML assignment contains no user-controlled data and no variables — it is a compile-time string. The project rule explicitly permits innerHTML for this static fallback. Noted for completeness; no action required.

---

## Constraint Checklist

| Constraint | Result |
|---|---|
| No innerHTML for card content | PASS |
| innerHTML only in static error fallback | PASS |
| External links: target=_blank rel=noopener noreferrer | PASS |
| fetch() uses relative path (no leading slash) | PASS |
| CSS tokens only, allowed exceptions present | PASS |
| Single @layer components block | PASS |
| color-mix() with rgba() fallback on preceding line | FAIL — lines 39, 103, 121 |
| prefers-reduced-motion guard on all transitions/transforms | FAIL — lines 15, 57 |
| All five sections present in index.html | PASS |
| about uses dl/dt/dd structure | PASS |
| timeline uses ol > li structure | PASS |
| contact email address correct | PASS |
| Scripts loaded as type=module | PASS |
| Font preloads before CSS links | PASS |

---

## Review Summary

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 0     | pass   |
| HIGH     | 2     | warn   |
| MEDIUM   | 2     | info   |
| LOW      | 2     | note   |

Verdict: WARNING — 2 HIGH issues must be resolved before merge. Both are in Phase 1 nav rules that were not audited against the Phase 2 constraints. The missing color-mix fallbacks are a rendering regression risk on older Safari (pre-16). The missing reduced-motion guards are an accessibility violation.

The Phase 2 additions themselves (hero, buttons, pill, about, timeline, contact, footer, project cards) are clean: correct token usage, no XSS vectors in card building, correct rel attributes on all external links, and all color-mix() calls within the Phase 2 CSS additions have their rgba() fallbacks in place.
