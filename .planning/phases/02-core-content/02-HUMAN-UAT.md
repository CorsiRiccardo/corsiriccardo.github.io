---
status: partial
phase: 02-core-content
source: [02-VERIFICATION.md]
started: 2026-04-22
updated: 2026-04-22
---

## Current Test

[awaiting human testing]

## Tests

### 1. Hero viewport fit
expected: h1 "Riccardo Corsi" and the "View my work ↓" CTA are both visible without scrolling at 1080p desktop and 375px mobile width
result: [pending]

### 2. Project card injection at runtime
expected: Serving the site with `python3 -m http.server 8000` or `npx serve .` shows 3 project cards rendered in .projects__grid (fetch requires HTTP — file:// will fail)
result: [pending]

### 3. Contact CTAs open correct destinations
expected: "Email" button opens the mail client with riccardocorsi.developer@gmail.com; "LinkedIn" opens linkedin.com/in/riccardocorsi in a new tab
result: [pending]

### 4. WCAG AA contrast
expected: Body text and heading text on the warm cream (#EDE8DF) background with texture overlay meet 4.5:1 contrast ratio
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps
