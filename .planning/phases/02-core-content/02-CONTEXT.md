# Phase 2: Core Content — Context

**Gathered:** 2026-04-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Build all five content sections (hero, projects, about, timeline, contact) with real copy and working data loading against the validated Phase 1 design foundation. All sections already exist as semantic HTML placeholders in `index.html` — Phase 2 fills them.

</domain>

<decisions>
## Implementation Decisions

### Hero Section
- **D-01:** H1 is "Riccardo Corsi" (full name only, no role inline in the headline).
- **D-02:** Subtitle beneath H1: "Software Developer" — plain, no punctuation.
- **D-03:** Tagline direction: technical + outcome — e.g. "Building game systems and backend tools that perform under pressure." Final copy is Claude's to write to this brief.
- **D-04:** CTA: single button/link "View my work ↓" anchoring to `#projects`.
- **D-05:** Layout: pure text, centered. No decorative elements. The paper texture and typography carry the aesthetic.

### Projects Section
- **D-06:** Feature 3 projects. All are game-system tools targeting Unreal Engine and/or Unity.
- **D-07:** Card copy: short — problem statement (1 sentence) + technical highlight (1 sentence) + outcome (1 sentence). Scannable, no paragraphs.
- **D-08:** Marketplace link schema: each card has an optional array of marketplace links. Most cards have 1 link (Fab.com). One cross-engine tool has 2 links (Fab + Unity Marketplace). If a card has 1 link: single CTA button. If 2: two side-by-side buttons.
- **D-09:** Data source: `data/projects.json` — start with placeholder data (realistic structure); real content added manually before ship. A `js/projects.js` ES module fetches the JSON and injects cards into `#projects`.
- **D-10:** Tech tags rendered as inline pills per card (no interactivity).

### About Section
- **D-11:** Prose: 2-3 sentences — short and direct. Tone: "I build X. I care about Y. Currently Z." Final copy is Claude's to write; professional focus only — no personal fluff.
- **D-12:** Stack: grouped tags by category. Three groups: **Languages** (C++, C#, Python, JavaScript), **Engines** (Unreal Engine, Unity), **Tools** (Git, Rider, VS Code). Rendered as a definition-list-style layout: label left, tag row right. No progress bars.

### Timeline Section
- **D-13:** Style: vertical timeline with dot-and-line — accent line runs down the left; each role has a dot, company name, title, and 2-3 outcome bullets.
- **D-14:** Detail: 2-3 outcome bullets per role. Outcomes, not duty lists — "shipped X" not "responsible for X".
- **D-15:** Data: hardcoded HTML (not JSON-driven). Reverse-chronological order.

### Contact Section
- **D-16:** Two clear CTAs: email link + LinkedIn link. Not icon rows — labeled text links or buttons.
- **D-17:** No contact form (confirmed out of scope — static site constraint).

### Footer
- **Claude's Discretion:** Minimal copyright line — "© 2026 Riccardo Corsi". No additional copy needed.

### Claude's Discretion
- Final hero tagline wording (brief: technical + outcome, game systems + backend tools)
- Final about prose (brief: 2-3 sentences, professional focus, stack mentioned)
- Contact section surrounding copy (if any)
- Footer content
- JS projects.js implementation details (fetch + DOM injection pattern)
- Placeholder project data in projects.json

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Scope
- `.planning/PROJECT.md` — active requirements, out-of-scope items, constraints
- `.planning/ROADMAP.md` §Phase 2 — success criteria (HERO-01/02, PROJ-01/02/03, ABOUT-01, TIME-01, CONTACT-01)

### Design Foundation (Phase 1 output — must be respected)
- `css/tokens.css` — all CSS custom properties (colors, spacing, typography, z-index)
- `css/layout.css` — max-width container, section padding, responsive breakpoints
- `css/components.css` — existing nav patterns; new components added here
- `css/base.css` — font-face declarations, h1/h2 styles, body defaults
- `index.html` — section placeholders to fill; do not restructure the shell

### Phase 1 Context
- `.planning/phases/01-foundation-shell/` — Phase 1 decisions (typography, texture, nav)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `css/tokens.css`: all spacing, color, and typography tokens — use these throughout; no hardcoded values
- `css/components.css`: add project card, timeline entry, about stack, contact CTA component styles here
- `js/nav.js`: Intersection Observer pattern for active nav link — same pattern can be adapted for scroll-reveal in Phase 3

### Established Patterns
- CSS `@layer` order: tokens → reset → base → layout → components → animations. New component CSS goes in `@layer components`.
- ES modules: `js/nav.js` is `type="module"`. New `js/projects.js` follows the same pattern — add a `<script type="module" src="js/projects.js"></script>` at end of `<body>`.
- Spacing: 8-point grid via `--space-*` tokens only.
- Typography: headings use `--font-family-display` (Space Grotesk); body/labels use `--font-family-body` (Inter).
- Accent color `#8B6914` for interactive states, CTA buttons, and timeline dots.

### Integration Points
- `#hero`, `#projects`, `#about`, `#timeline`, `#contact` — all exist in `index.html` as empty sections
- `data/projects.json` — must be created; `js/projects.js` fetches it and injects cards into `#projects`
- No `data/` directory yet — create it

</code_context>

<specifics>
## Specific Ideas

- Hero preview accepted by user: Name → "Software Developer" → tagline → "View my work ↓" button, all centered
- Project card preview accepted: title / 2-3 sentences / tech pills / marketplace button(s)
- Timeline preview accepted: vertical dot-and-line, year left, company+role+bullets right
- About preview accepted: short prose paragraph + definition-list-style grouped stack (Languages / Engines / Tools)
- One project is cross-engine (Unreal + Unity) → two marketplace link buttons on that card
- Fab.com links used for Unreal projects; Unity Asset Store / Unity Marketplace for Unity projects

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-core-content*
*Context gathered: 2026-04-21*
