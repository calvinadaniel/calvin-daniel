# Projects Page Redesign — Design Spec
**Date:** 2026-05-21  
**Status:** Approved

---

## Overview

Redesign `projects/index.html` from a plain project grid into a resume-level landing page. Add Statcast Rank App as a real project link. Update the nav dropdown site-wide to include both live project sub-links.

---

## Scope of Changes

### Files modified
- `projects/index.html` — full page redesign
- `index.html` (root) — nav dropdown: add Statcast Rank
- `clients/index.html` — nav dropdown: add Statcast Rank
- `projects/running-analysis-app/index.html` — nav dropdown: add Statcast Rank

---

## Page Structure (top to bottom)

### 1. Profile Hero
Replaces the current plain page header section.

- `← Home` back link (same mono uppercase style, links to `../`)
- H1: `Calvin Daniel` (font-display, large)
- Subtitle line: `Production Operations · Data Analysis · Web Development`
- Two-sentence summary: *"Operations professional with 17+ years at John Wiley & Sons. Experienced in cross-functional process improvement, Power BI dashboards, financial analysis, and web development."*
- Two CTA buttons (same style as existing "Let's Connect" border button):
  - `GitHub ↗` → `https://github.com/calvinadaniel/` (opens in new tab)
  - `LinkedIn ↗` → `https://www.linkedin.com/in/calvin-daniel-6229054/` (opens in new tab)

### 2. Skills / Core Competencies
Section label: `Core Competencies` (mono uppercase tracking, same as existing section labels)

Two rows of pills using existing orange tag styling (`bg-orange/10 text-orange border border-orange/20`):

- **Row 1 — Focus Areas:** `Web Development` `Content Strategy` `Data Reporting` `CMS Integration`
- **Row 2 — Languages & Tools:** `HTML/CSS` `JavaScript` `Python` `SQL` `Power BI` `BigQuery` `DAX` `Excel`

### 3. Work Experience
Section label: `Experience`

Vertical timeline: thin left border line connecting 5 entries. Each entry has:
- Role title (font-display, ~1.1rem)
- Company + location (body text, muted)
- Date range (mono font, orange-tinted)
- 1–2 bullet points (the strongest line from the resume)

**Entries:**

1. **Commercial Operations Senior Specialist** — John Wiley & Sons | Remote · Feb 2020–Present
   - Built a Power BI dashboard consolidating 15 data sources into a unified operational reporting platform for executive leadership.
   - Lead cross-functional process improvement initiatives, conducting financial and variance analysis supporting executive-level planning.

2. **Associate Product Manager** — John Wiley & Sons | Hoboken, NJ · Jun 2018–Feb 2020
   - Owned product roadmap for WileyPLUS, coordinating simultaneous workstreams across design, engineering, and marketing.

3. **Web Specialist / Technical Lead & Prototyper** — John Wiley & Sons | Hoboken, NJ · Oct 2014–Jun 2018
   - Served as technical project lead for digital product initiatives, establishing code governance and QA frameworks.

4. **Digital Delivery Consultant** — John Wiley & Sons | Hoboken, NJ · May 2008–Oct 2014
   - Supported deployment and integration of learning management systems across global education product lines.

5. **Freelance Web Developer** — Self-Employed | Remote · Sep 2014–Present
   - Manage end-to-end client project delivery — requirements, design, development, and post-launch support.

### 4. Projects Grid
Section label: `Projects`

Keep existing filter pills (All / Web Dev / Data / Analytics / Tool) and 3-column grid layout. **Remove the two placeholder cards** (Operations Dashboard, Small Business Site). Replace with 3 real project cards:

**Card 1 — Statcast Rank App**
- Category filter tags: `Web Dev`, `Data / Analytics`
- Image: Unsplash baseball/sports photo (placeholder OK)
- Description: *"MLB batter leaderboard ranking players by HardContact+ (Hard Hit% − Whiff%). Built with React, Tailwind, and the Baseball Savant Statcast API."*
- Tags: `React` `Tailwind` `Node.js` `Baseball Savant`
- View Live → `https://statcast-rank-app.vercel.app/` (new tab)
- View Code → `https://github.com/calvinadaniel/` (new tab)

**Card 2 — Running Analysis App**
- Category filter tag: `Data / Analytics`, `Tool`
- Image: Unsplash running/marathon photo (reuse existing or new)
- Description: *"Personal Strava running dashboard with weekly mileage charts and Boston Marathon qualifying time projection."*
- Tags: `Python` `Chart.js` `Strava API`
- View Live → `../projects/running-analysis-app/`
- View Code → `https://github.com/calvinadaniel/` (new tab)

**Card 3 — Portfolio Website**
- Category filter tag: `Web Dev`
- Image: Unsplash code/desk photo (placeholder OK)
- Description: *"Personal portfolio built with HTML, CSS, and vanilla JS. Features dark/light mode, particle canvas, and scroll animations."*
- Tags: `HTML` `CSS` `JavaScript`
- View Live → `../` 
- View Code → `https://github.com/calvinadaniel/` (new tab)

---

## Nav Dropdown Changes (all 4 pages)

The Projects nav dropdown currently has one sub-link: `Running Analysis → ../projects/running-analysis-app/`.

Add a second sub-link below it:
- Desktop dropdown: `Statcast Rank → https://statcast-rank-app.vercel.app/` (new tab, `rel="noopener noreferrer"`)
- Mobile sub-nav: same link below Running Analysis

**Path variations by file:**
| File | Running Analysis href | Statcast Rank href |
|---|---|---|
| `index.html` | `./projects/running-analysis-app/` | `https://statcast-rank-app.vercel.app/` |
| `projects/index.html` | `../projects/running-analysis-app/` | `https://statcast-rank-app.vercel.app/` |
| `clients/index.html` | `../projects/running-analysis-app/` | `https://statcast-rank-app.vercel.app/` |
| `projects/running-analysis-app/index.html` | `./` (or omit — already on page) | `https://statcast-rank-app.vercel.app/` |

---

## Design Constraints

- Follow existing Tailwind class conventions (font-display, font-mono, font-body, orange/navy palette)
- No new JavaScript — all sections are static HTML
- Dark mode support on all new elements (`dark:` variants)
- `data-reveal` scroll animation attribute on all new section wrappers
- Relative paths for internal links, absolute for external (GitHub, LinkedIn, Vercel)
