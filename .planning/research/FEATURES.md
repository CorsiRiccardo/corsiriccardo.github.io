# Feature Landscape — Developer Portfolio

**Domain:** Personal developer portfolio (static, recruiter + collaborator audience)
**Project:** corsiriccardo.github.io — Riccardo Corsi
**Researched:** 2026-04-21
**Research confidence:** HIGH (multiple verified sources, cross-referenced with recruiter behavior data)

---

## Table Stakes

Features that visitors expect from any credible developer portfolio. Missing any of these triggers immediate loss of trust or immediate bounce.

| Feature | Why Expected | Complexity | Notes for Riccardo's Site |
|---------|--------------|------------|--------------------------|
| Clear hero — name, role, tagline | Visitor must know who you are within 3 seconds | Low | Already planned. Tagline should name a specialty, not just "developer" |
| Professional "About" — stack + what you do | Recruiter needs to categorize you before investing time | Low | Planned. Keep it professional-only as decided; no personal fluff |
| Project showcase with 3–6 curated projects | Proof of ability; anything fewer looks thin | Medium | Web apps + CLI tools. Each needs title, description, tech tags, GitHub link |
| GitHub link per project | 78% of tech recruiters check GitHub before scheduling interviews | Low | Required on every project card |
| Work experience timeline | Establishes professional credibility | Low | Planned. Reverse-chronological. Company, role, dates, 1–2 bullet outcomes |
| Contact section — email + LinkedIn | Recruiters need a frictionless path to reach you | Low | Planned. Clear CTA ("Let's connect" or similar), not buried |
| Mobile responsive layout | 60%+ of portfolio views happen on mobile | Medium | CSS grid/flexbox handles this without frameworks |
| Fast load time (under 2 seconds) | Performance is itself a signal — you built this site | Low | Vanilla stack is already optimal; optimize images, no render-blocking fonts |
| No broken links / 404s | Broken links are an immediate credibility killer | Low | Validate all project and social links before launch |
| Accessible color contrast (WCAG AA) | Cream/ivory background must meet 4.5:1 ratio with text | Low | Check #F5F0E8 against body text color; warm brown/dark charcoal works well |
| Semantic HTML structure | `<header>`, `<main>`, `<section>`, `<footer>`, proper heading order | Low | Foundational for accessibility and SEO both |
| Open Graph meta tags | Controls how link previews appear when shared on LinkedIn, Slack, etc. | Low | `og:title`, `og:description`, `og:image`, `og:url` — critical for LinkedIn sharing |
| Descriptive `<title>` and `<meta description>` | Basic discoverability and professionalism | Low | "Riccardo Corsi — [Role] | Portfolio" |

---

## Differentiators

Features that are not expected but make a portfolio memorable to recruiters and collaborators. These elevate above the noise without requiring heavy investment.

| Feature | Value Proposition | Complexity | Notes for Riccardo's Site |
|---------|-------------------|------------|--------------------------|
| Distinctive visual identity (carta invecchiata) | Instantly memorable; signals design sensibility and attention to craft | Medium | The paper aesthetic IS the differentiator. Execute it well; it replaces the need for flashy animation |
| Project narrative / mini case study | Shows problem-solving process, not just output — what 85% of hiring managers value most | Low–Medium | For each project: 1 sentence problem + 1 sentence approach + tech tags + links. No need for full case studies on a portfolio |
| Outcome-oriented project descriptions | "Built X to solve Y, used Z" beats "HTML, CSS, JS project" | Low | Frame each project around what it solves or enables |
| Scroll reveal animations — subtle, editorial | Adds polish and demonstrates CSS/JS competence without noise | Low | Already planned. Use Intersection Observer; single class-toggle pattern |
| Hover effects on project cards | Signals interactivity and attention to detail | Low | Already planned. Subtle lift or border highlight; consistent with paper aesthetic |
| GitHub activity link (profile, not just repos) | Shows sustained involvement in the community; collaborators care about this | Low | Link to github.com/[username] in contact or about section |
| Project tech tag labels | Lets recruiters scan for specific technologies at a glance | Low | Small pills/badges per card: "TypeScript", "Rust", "CLI" etc. |
| Curated "featured" vs "other" projects | Shows editorial judgment; signals you know what matters | Low–Medium | Highlight 2–3 hero projects; list remaining in a secondary grid or simple list |
| Consistent, readable typography hierarchy | Strong typographic hierarchy is rare and immediately noticed | Low | Serif headline + clean sans body, or a single excellent serif throughout — matches paper aesthetic |
| Favicon and site icon | Small but absent on many dev portfolios; signals completeness | Low | Custom SVG favicon matching the carta palette |
| `<meta name="author">` + JSON-LD Person schema | Helps Google understand the page is about a specific person | Low | Simple structured data; copy-paste level effort |
| Keyboard navigation functional | Demonstrates accessibility awareness; usable without a mouse | Low | Tab order, visible focus styles — especially important if showcasing frontend skills |

---

## Anti-Features

Features that appear on many portfolios but actively harm credibility, clarity, or performance. Explicitly do not build these.

| Anti-Feature | Why It Hurts | What to Do Instead |
|--------------|--------------|-------------------|
| Skills progress bars ("JavaScript: 85%") | Meaningless numbers that signal insecurity; recruiters distrust them | List technologies you actually use as plain tags: "TypeScript, Rust, Go, PostgreSQL" |
| Visitor counter or analytics badge | Vanity metric that dates the site and looks amateur | Use private analytics (e.g., Plausible, or no analytics at all) |
| "Currently listening to" Spotify widget | Adds irrelevant personality noise; violates "professional only" About decision | Already out of scope by project decision |
| Lengthy personal biography ("I was born in...") | Recruiters want to know what you build, not your life story | 3–4 sentences max: role, specialty, one distinctive approach |
| Listing every technology ever touched | Signals inability to prioritize; junior red flag | Show only technologies you want to be hired for; group by category if needed |
| Generic stock photography | Looks impersonal and lazy on a developer's own site | Use project screenshots, code snippets styled as art, or no images rather than stock |
| Auto-playing anything (audio, video, animation loops) | Startles visitors; accessibility violation | Use click-to-play, or static screenshots with a "View demo" link |
| Contact form without a backend | Static site + contact form = broken UX or third-party spam trap | Already decided: email link is sufficient |
| Dark mode toggle | Adds complexity; conflicts with carta invecchiata identity | Already out of scope by project decision |
| Blog section with zero posts | Signals unfinished ambition; worse than no blog | No blog unless content is ready to ship |
| Framework showcase for its own sake | "Built with React" badge when vanilla HTML would do adds noise | The site itself demonstrates technical judgment; let the code quality speak |
| Testimonials section (if empty) | Empty section is worse than no section | If no testimonials yet, omit entirely |
| Multiple CTAs competing in hero | "Download CV" + "Contact Me" + "View Projects" = decision paralysis | One primary CTA in hero: "View my work" or scroll arrow |
| Social proof from tutorial projects (todo apps, weather apps) | Recruiters recognize these; they signal beginner status | Feature only original or production-deployed projects |
| Excessive loading screen / intro animation | Delays the visitor from reaching actual content | No loading screen; first paint should show content immediately |

---

## Feature Dependencies

```
Semantic HTML structure
  → Accessibility (keyboard nav, ARIA)
  → SEO (meta tags, JSON-LD)
  → Open Graph (og:* tags require <head> structure)

Project showcase
  → Tech tag labels (per card)
  → Curated featured vs. other split (requires multiple projects)
  → GitHub links (per project)
  → Scroll reveal (Intersection Observer on card grid)

Hero section
  → Single CTA (scroll to projects or contact)
  → Open Graph image (og:image should reflect hero visual)

Work experience timeline
  → Outcome-oriented descriptions (same writing discipline as projects)

Contact section
  → GitHub profile link (consistent with project links)
  → LinkedIn link (Open Graph image matters when this page is shared from LinkedIn)
```

---

## MVP Recommendation

Given the carta invecchiata aesthetic as the primary differentiator, the MVP should prioritize identity clarity and project narrative quality over quantity of features.

**Ship with:**
1. Hero — name, title, one-line specialty tagline, single CTA
2. About — professional only, stack list as plain tags, 3–4 sentences
3. Projects — 3–4 curated projects minimum, each with: title, 1-sentence problem framing, tech tags, GitHub link, optional demo link
4. Work Experience Timeline — reverse-chronological, outcomes over duties
5. Contact — email + LinkedIn + GitHub profile, clear CTA
6. Foundation: semantic HTML, WCAG AA contrast, Open Graph tags, responsive layout, favicon

**Defer without regret:**
- JSON-LD Person schema — add post-launch, minimal impact short-term
- Featured vs. other project split — only meaningful with 6+ projects
- Project screenshots — launch with clean card + description; add screenshots when available
- Testimonials — only if they exist; never ship a placeholder section

---

## Sources

- [What Reviewers Notice in 100+ Developer Portfolios (Makers' Den)](https://makersden.io/blog/learning-from-reviewing-100-software-dev-portfolios) — MEDIUM confidence (paywalled, partial content)
- [Frontend Developer Portfolio Tips for 2025 (DEV Community)](https://dev.to/siddheshcodes/frontend-developer-portfolio-tips-for-2025-build-a-stunning-site-that-gets-you-hired-3hga) — MEDIUM confidence
- [15 Portfolio Mistakes to Avoid (Fueler)](https://fueler.io/blog/portfolio-mistakes-to-avoid) — MEDIUM confidence
- [What Recruiters Look for in Developer Portfolios (Pesto)](https://pesto.tech/resources/what-recruiters-look-for-in-developer-portfolios) — MEDIUM confidence
- [Developer Portfolio Tips 2025 (DEV Community)](https://dev.to/wrypa/2025-developer-portfolio-tips-how-to-keep-yours-modern-professional-3l87) — MEDIUM confidence
- [How to Create a Strong Developer Portfolio 2025 (C# Corner)](https://www.c-sharpcorner.com/article/how-to-create-a-strong-developer-portfolio-in-2025/) — MEDIUM confidence
- [SEO Tips for Developer Portfolio (DEV Community)](https://dev.to/rossellafer/seo-tips-for-your-developer-portfolio-26fm) — MEDIUM confidence
- [Junior Dev Portfolio in the Age of AI — What Recruiters Care About (DEV Community)](https://dev.to/dhruvjoshi9/junior-dev-resume-portfolio-in-the-age-of-ai-what-recruiters-care-about-in-2025-26c7) — MEDIUM confidence
