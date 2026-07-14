# Homepage Repositioning: Full-Stack Engineer + Running as Its Own Page

## Goal

Reposition the homepage around Calvin as a **full-stack engineer** — one discipline
combining web development and data analytics — rather than three equally-weighted
identities (Developer / Analyst / Runner). The running journey becomes its own
page and its own top-level nav item instead of a homepage section.

## Current state (for reference)

- Nav: "Home" is a dropdown (About / Developer / Analyst / Runner anchors into
  homepage sections), "Projects" is a dropdown (external project pages), plus
  Clients, theme toggle, Let's Connect. This exact nav markup is duplicated
  across 5 pages: `index.html`, `projects/index.html`, `clients/index.html`,
  `projects/elitehitter/index.html`, `projects/running-analysis-app/index.html`.
- Homepage sections in order: `#hero`, `#about`, `#web-dev`, `#analyst`,
  `#running`, `#pricing`, `#process`, `#contact`.
- Hero headline: three stacked lines "Developer." / "Analyst." / "Runner.",
  the third line (`#runner-line`) uses an outline/stroke-only text style
  (`-webkit-text-stroke`, transparent fill) — a purely visual effect unrelated
  to the JS animation, which only fades in `.hero-headline` as one block.
- Hero buttons: "See My Work" → `#web-dev` (a skills grid, not real project
  screenshots), "Get In Touch" → `#contact`.
- `#web-dev` and `#analyst` are separate sections with separate headers
  ("What I Build" / "What I Measure").
- `#running` contains: intro, "Last Race" callout, a 4-stat grid, PRs + goals
  + photo, and an Abbott World Marathon Majors tracker. All content is static
  markup with `data-reveal` fade-in only — no counters or JS-driven values in
  this section (the hero PR/counter JS lives elsewhere, in `#about` and
  `#hero`, and is out of scope here).
- `js/home.js` is homepage-only (typewriter eyebrow, hero headline fade,
  contact form plan pre-fill). `js/main.js` is shared across all pages and
  drives the `data-reveal` IntersectionObserver, nav toggle, and theme toggle.
  `clients/index.html` and `projects/index.html` load only `main.js`.

## Changes

### 1. New page: `running/index.html`

Follows the existing `/clients/` and `/projects/` page pattern exactly:
- Full header/nav/off-canvas-nav markup (relative-path adjusted, one level
  deep — same as `clients/index.html`).
- Page-header block: `← Home` breadcrumb link, H1 (e.g. "Marathon Runner"),
  intro paragraph (adapted from the current `#running` intro copy).
- Body: the "Last Race" callout, 4-stat grid, PRs/goals/photo block, and
  Abbott World Marathon Majors tracker — moved verbatim from the current
  `#running` section in `index.html`.
- Scripts: `../js/main.js` only (matches `clients/index.html`; no `home.js`
  needed since nothing here is homepage-specific).
- New `<title>`, meta description, canonical URL, OG/Twitter tags following
  the same pattern as `clients/index.html` (swap in running-specific copy).
- The `#running` section is deleted from `index.html` entirely.

### 2. Homepage: merge `#web-dev` + `#analyst` into `#full-stack`

One section, one intro (eyebrow + H2 + paragraph) reframing web + data as a
single full-stack discipline. Layout: the existing 6-card skills grid (HTML/
CSS/JS, Responsive Design, WordPress, Custom Frameworks, SEO & Performance,
CMS Integration) followed by the existing skill bars (Power BI, SQL, Data
Modeling, Python) with their intro paragraphs condensed into the merged
section's copy. The closing pull-quote from `#web-dev` is kept. No skill
content is removed — only re-framed and combined.

### 3. Hero (`#hero`)

- Headline keeps its existing 3-stacked-line structure and CSS/JS (lowest
  risk — the fade-in animation targets the block, not individual lines):
  **"Full-Stack" / "Engineer." / "Runner."** — third line keeps its current
  outline-stroke treatment unchanged, which already visually reads as
  secondary/personal vs. the two solid-filled lines above it.
- Subcopy rewritten to lead with the full-stack positioning, with a brief
  nod to running rather than three-way equal billing.
- Buttons (three, same styling as today, added to the existing flex row):
  - "See My Work" → `/projects/` (real screenshots live there, not in the
    on-page skills grid)
  - "Get In Touch" → `#contact`
  - "Pricing" (new) → `#pricing`

### 4. About (`#about`)

Rewrite "Three disciplines. One relentless pursuit." copy to describe one
professional discipline (full-stack: web + data) with running as personal
context, including a short text link to `/running/` (e.g. "training for my
next marathon — see the running log →") so it stays discoverable from the
homepage narrative. The marathon-finishes photo badge stays as-is (personal
flavor, not a claim of professional discipline).

### 5. Nav — updated identically on all 5 existing pages, plus the new page

Desktop:
- **Home** — plain link to `/` (dropdown markup removed)
- **Running** — new plain link to `/running/`
- **Projects** — unchanged dropdown (Running Analysis / EliteHitter+ / TBG
  Invitational)
- **Clients** — unchanged
- theme toggle — unchanged
- **Let's Connect** — unchanged, → `#contact` (homepage) or `../#contact`
  (sub-pages)

Mobile off-canvas: same shape — Home with no sub-nav, new Running item, Projects
keeps its sub-nav, Clients, Let's Connect.

Footer nav (currently Projects, Clients) gets a Running link added for
consistency, on every page that has the shared footer.

### Out of scope

Pricing section content/tiers, Process section, contact form/Formspree
integration, dark/light mode mechanism, off-canvas nav open/close animation,
hero particle canvas, hero counter/PR JS logic itself (only the button
destinations and headline text change).
