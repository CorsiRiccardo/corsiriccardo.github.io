# Phase 2: Core Content — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-21
**Phase:** 02-core-content
**Areas discussed:** Hero copy & CTA, Project selection, Timeline format, About structure

---

## Hero copy & CTA

| Option | Description | Selected |
|--------|-------------|----------|
| Full name only | "Riccardo Corsi" — clean, confident. Title and tagline handle the rest. | ✓ |
| Name + short role inline | "Riccardo Corsi — Software Developer" in the H1 | |
| First name only | "Riccardo" — more personal/informal | |

| Option | Description | Selected |
|--------|-------------|----------|
| Scroll to Projects | Anchors to #projects — keeps visitor moving through work | ✓ |
| GitHub profile | Opens GitHub in new tab | |
| Scroll to Contact | Anchors to #contact | |

| Option | Description | Selected |
|--------|-------------|----------|
| Technical + outcome | "Building game systems and backend tools that perform under pressure." | ✓ |
| Problem-solver framing | "I turn complex problems into clean, maintainable code." | |
| I'll write it myself | User supplies exact copy | |

| Option | Description | Selected |
|--------|-------------|----------|
| Pure text, centered | Name + title + tagline + CTA, all centered | ✓ |
| Left-aligned text block | Editorial feel, asymmetric layout | |
| Text + thin decorative rule | Horizontal line beneath the name | |

**Notes:** User accepted the centered layout preview exactly as shown.

---

## Project selection

| Option | Description | Selected |
|--------|-------------|----------|
| 3 projects | Minimum for credibility, odd number for visual balance | ✓ |
| 2 projects | If only 2 strong ones available | |
| 4 projects | Stronger breadth signal | |

| Option | Description | Selected |
|--------|-------------|----------|
| Web apps | Frontend or full-stack | |
| CLI tools / libraries | Backend tools, scripts, open-source | |
| Game systems | Engine components, gameplay systems, tools | ✓ |

| Option | Description | Selected |
|--------|-------------|----------|
| GitHub repo only | Standard for game dev | |
| Fab + itch.io / demo | Second link for playable builds | |
| Fab + video/GIF link | Demo clip link | |

**User's choice (free text):** "Fab links and in the future custom web links" — one project has both Fab and Unity Marketplace links; others have one.

| Option | Description | Selected |
|--------|-------------|----------|
| Short — 2-3 sentences | Problem + technical highlight + outcome | ✓ |
| Medium — short paragraph | 3-5 sentences with more context | |

| Option | Description | Selected |
|--------|-------------|----------|
| One link per card | Single "View on Fab" CTA | |
| Two optional link slots | Second slot renders only if JSON has a value | |

**User's choice (free text):** One of the tools supports both Fab and Unity Marketplace; otherwise 1 link. JSON schema uses an array of marketplace links.

| Option | Description | Selected |
|--------|-------------|----------|
| Real content now | User provides 3 project names + descriptions | |
| Placeholder data first | Planner scaffolds dummy data; user fills in manually | ✓ |

---

## Timeline format

| Option | Description | Selected |
|--------|-------------|----------|
| Vertical timeline with dot+line | Left: year. Right: company, role, bullets. Accent line connects. | ✓ |
| Compact list, no visual line | Plain, dense, scannable | |

| Option | Description | Selected |
|--------|-------------|----------|
| 1 outcome sentence per role | Forces clarity, stays readable | |
| 2-3 bullet outcomes per role | More substance — good if strong distinct wins per company | ✓ |

---

## About structure

| Option | Description | Selected |
|--------|-------------|----------|
| Grouped tags by category | Languages / Engines / Tools rows | ✓ |
| Inline prose with tech woven in | "I specialise in C++ and C# game systems…" | |
| Flat tag pills, no categories | Badge-style flat list | |

| Option | Description | Selected |
|--------|-------------|----------|
| 2-3 sentences | Short and direct | ✓ |
| Short paragraph (4-6 sentences) | More context on approach and goals | |

---

## Claude's Discretion

- Final hero tagline wording (brief given)
- Final about prose (brief given)
- Contact section surrounding copy
- Footer content (minimal copyright line)
- `js/projects.js` fetch + DOM injection implementation
- Placeholder project data in `data/projects.json`

## Deferred Ideas

None.
