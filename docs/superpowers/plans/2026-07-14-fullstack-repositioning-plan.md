# Full-Stack Repositioning + Running Page Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition the homepage around a single full-stack (web + data) discipline, move the running journey to its own page and nav item, and update the three hero buttons.

**Architecture:** Static multi-page HTML site (no build step, no test framework). Each page duplicates its own header/nav/footer markup. Changes are direct HTML edits plus one new page (`running/index.html`) that follows the existing `/clients/`-page pattern. Verification is done via `grep` checks for stale references and a manual browser pass against the existing CLAUDE.md testing checklist (no automated test suite exists in this repo).

**Tech Stack:** Plain HTML/CSS (Tailwind utility classes)/vanilla JS. Shared `css/styles.css`, `css/nav-dropdown.css`, `js/main.js` (nav toggle, theme toggle, `data-reveal` IntersectionObserver — shared across all pages). `js/home.js` is homepage-only (hero typewriter/counters, contact form) and does not reference any of the section IDs being changed.

## Global Constraints

- Mobile-first CSS; base styles for small screens, media queries scale up.
- Off-canvas nav structure and hamburger animation must not be replaced or restructured — only the link content inside it changes.
- BEM-style class naming for any new custom CSS classes (none are needed for this plan; only Tailwind utility classes and existing classes are reused).
- No inline styles unless required for JS-driven dynamic values (not applicable here).
- Dark/light mode is driven by `[data-theme]`/`.dark` — do not change this mechanism.
- Images: WebP where possible; always include width/height where the source markup already has them (preserve existing `width`/`height` attributes when moving markup).
- Do not add third-party JS libraries.
- Do not touch: off-canvas nav open/close animation, dark/light mode toggle mechanism, existing CSS custom property names, the hero particle canvas (`#hero-canvas`), the hero counter/PR JS logic in `js/home.js`.
- Primary email is `info@calvindaniel.com` — not touched by this plan (no email content changes here).
- Testing checklist before any commit (from CLAUDE.md): test on mobile (375px viewport minimum), test dark mode and light mode, validate all anchor links resolve correctly, confirm hero counters still animate on load, confirm contact form still submits without page reload.

---

## File Structure

- **Create:** `running/index.html` — new page, follows the `clients/index.html` pattern (own header/nav/off-canvas nav/footer, `js/main.js` only, no `js/home.js`). Contains the page-header block (breadcrumb + H1 + intro) and the full running content (Last Race, stat grid, PRs/goals/photo, Abbott Majors) moved verbatim from the current `#running` section.
- **Modify:** `index.html` — nav (header dropdown → plain link + new Running link, off-canvas nav, footer nav), page `<head>` metadata, hero headline/subcopy/buttons, About section copy, merge `#web-dev` + `#analyst` into one `#full-stack` section, delete the old `#running` section.
- **Modify:** `projects/index.html`, `clients/index.html`, `projects/elitehitter/index.html`, `projects/running-analysis-app/index.html` — nav only (header dropdown → plain link + new Running link, off-canvas nav, footer nav). No other content on these pages changes.

No new CSS or JS files are needed — every change reuses existing utility classes and the existing `data-reveal` / nav-toggle / theme-toggle behavior in `js/main.js`.

---

### Task 1: Create the new `running/index.html` page

**Files:**
- Create: `running/index.html`

**Interfaces:**
- Produces: the canonical "current-page active" nav link classes reused in later tasks:
  - Desktop active: `class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-orange border-b-2 border-orange pb-0.5"`
  - Desktop inactive: `class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors"`
  - Mobile active: `class="font-display text-[2rem] text-orange tracking-wide"`
  - Mobile inactive: `class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors"`

- [ ] **Step 1: Create the directory and file**

Run: `mkdir -p running` (from repo root)

- [ ] **Step 2: Write the complete file**

Create `running/index.html` with this exact content:

```html
﻿<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Running — Calvin Daniel</title>
  <meta name="description" content="Calvin Daniel's marathon running journey — race results, personal records, and the chase for the Abbott World Marathon Majors 6-Star medal." />
  <link rel="canonical" href="https://calvindaniel.com/running/" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Calvin Daniel" />
  <meta property="og:title" content="Running — Calvin Daniel" />
  <meta property="og:description" content="Calvin Daniel's marathon running journey — race results, personal records, and the chase for the Abbott World Marathon Majors 6-Star medal." />
  <meta property="og:url" content="https://calvindaniel.com/running/" />
  <meta property="og:image" content="https://calvindaniel.com/images/favicon-social-logo.png" />
  <meta property="og:image:width" content="195" />
  <meta property="og:image:height" content="178" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Running — Calvin Daniel" />
  <meta name="twitter:description" content="Calvin Daniel's marathon running journey — race results, personal records, and the chase for the Abbott World Marathon Majors 6-Star medal." />
  <meta name="twitter:image" content="https://calvindaniel.com/images/favicon-social-logo.png" />
  <script>(function(){if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark');}());</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Dancing+Script:wght@700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../css/styles.css" />
  <link rel="stylesheet" href="../css/nav-dropdown.css" />
  <link rel="icon" type="image/png" href="../images/favicon-social-logo.png" />
</head>
<body class="font-body bg-warm-bg dark:bg-navy-bg text-navy-bg dark:text-offwhite overflow-x-hidden">

<!-- ── HEADER ─────────────────────────────────────────────── -->
<header id="site-header" class="fixed top-0 left-0 right-0 z-[100] h-[70px]">
  <div class="flex items-center justify-between h-full px-[5%] max-w-[1240px] mx-auto">
    <a href="../" aria-label="Calvin Daniel Home" class="hover:opacity-90 transition-opacity">
      <img src="../images/primary-logo.png"  alt="Calvin Daniel" class="logo-light h-10 w-auto" />
      <img src="../images/dark-mode-logo.png" alt="Calvin Daniel" class="logo-dark  h-10 w-auto" />
    </a>
    <nav class="hidden lg:flex gap-6 items-center" aria-label="Main navigation">
      <a href="../" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors">Home</a>
      <a href="../running/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-orange border-b-2 border-orange pb-0.5">Running</a>
      <div class="nav-projects">
        <a href="../projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors flex items-center gap-1">
          Projects
          <svg class="nav-projects-chevron" width="10" height="7" viewBox="0 0 10 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="1,1 5,6 9,1"/></svg>
        </a>
        <div class="nav-dropdown" role="menu" aria-label="Projects submenu">
          <a href="../projects/running-analysis-app/" class="nav-dropdown-link" role="menuitem">Running Analysis</a>
          <a href="../projects/elitehitter/" class="nav-dropdown-link" role="menuitem">EliteHitter+</a>
          <a href="https://tbg-invitational-league.vercel.app/" target="_blank" rel="noopener noreferrer" class="nav-dropdown-link" role="menuitem">TBG Invitational</a>
        </div>
      </div>
      <a href="../clients/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors">Clients</a>
      <button id="theme-toggle" aria-label="Switch to light mode" class="text-navy-bg/50 dark:text-offwhite/60 hover:text-orange dark:hover:text-orange transition-colors p-1">
        <svg id="icon-sun" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        <svg id="icon-moon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
      <a href="../#contact" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-orange border border-orange px-4 py-[0.4rem] rounded-sm hover:bg-orange hover:text-offwhite transition-all">Let's Connect</a>
    </nav>
    <button id="menu-open" class="lg:hidden flex flex-col justify-center gap-[5px] w-9 h-9 p-1" aria-label="Open navigation menu" aria-expanded="false" aria-controls="off-canvas-nav">
      <span class="block w-full h-[2px] bg-navy-bg dark:bg-offwhite rounded-sm"></span>
      <span class="block w-full h-[2px] bg-navy-bg dark:bg-offwhite rounded-sm"></span>
      <span class="block w-full h-[2px] bg-navy-bg dark:bg-offwhite rounded-sm"></span>
    </button>
  </div>
</header>

<div id="menu-overlay" class="fixed inset-0 bg-black/65 z-[200] opacity-0 pointer-events-none transition-opacity duration-300" aria-hidden="true"></div>
<nav id="off-canvas-nav" aria-label="Mobile navigation" class="fixed top-0 right-0 h-full w-[min(320px,85vw)] bg-warm-section dark:bg-navy-dark z-[300] flex flex-col px-8 pt-16 pb-8 border-l border-navy-bg/10 dark:border-offwhite/10 translate-x-full transition-transform duration-500">
  <button id="menu-close" class="absolute top-5 right-5 text-navy-bg/40 dark:text-offwhite/60 text-xl hover:text-navy-bg dark:hover:text-offwhite transition-colors" aria-label="Close navigation menu">&#10005;</button>
  <button id="mobile-theme-toggle" class="absolute top-5 left-8 flex items-center gap-2 font-mono text-[0.65rem] tracking-widest uppercase text-navy-bg/50 dark:text-offwhite/50 hover:text-orange transition-colors">
    <svg id="m-icon-sun" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    <svg id="m-icon-moon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    <span id="mobile-toggle-label">Light</span>
  </button>
  <ul class="flex flex-col gap-8 mt-4">
    <li><a href="../" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Home</a></li>
    <li><a href="../running/" class="font-display text-[2rem] text-orange tracking-wide">Running</a></li>
    <li>
      <a href="../projects/" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Projects</a>
      <div class="mobile-sub-nav">
        <a href="../projects/running-analysis-app/">Running Analysis</a>
        <a href="../projects/elitehitter/">EliteHitter+</a>
        <a href="https://tbg-invitational-league.vercel.app/" target="_blank" rel="noopener noreferrer">TBG Invitational</a>
      </div>
    </li>
    <li><a href="../clients/" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Clients</a></li>
    <li><a href="../#contact" class="font-display text-[2rem] text-orange tracking-wide hover:text-orange/80 transition-colors">Let's Connect</a></li>
  </ul>
</nav>

<main>

  <!-- Page header -->
  <section class="bg-warm-bg dark:bg-navy-bg pt-[100px] pb-14 border-b border-navy-bg/10 dark:border-offwhite/10">
    <div class="w-[90%] max-w-[1240px] mx-auto">
      <div data-reveal>
        <a href="../" class="inline-flex items-center gap-1 font-mono text-[0.65rem] tracking-[0.15em] uppercase text-navy-bg/45 dark:text-offwhite/45 hover:text-orange transition-colors mb-6">&larr; Home</a>
        <p class="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-orange mb-2">Mile After Mile</p>
        <h1 class="font-display text-[clamp(3rem,8vw,6rem)] leading-none text-navy-bg dark:text-offwhite">Marathon Runner</h1>
        <p class="max-w-[600px] mt-4 text-navy-bg/60 dark:text-offwhite/60 text-[1.05rem] leading-relaxed">Three years in. Nine races finished. The same discipline that builds great software and clean dashboards is what gets you to mile 20 when your legs are begging you to stop.</p>
      </div>
    </div>
  </section>

  <!-- ── RUNNING CONTENT ───────────────────────────────────── -->
  <section class="relative bg-warm-bg dark:bg-navy-bg py-16 overflow-hidden">
    <span aria-hidden="true" class="absolute -right-[0.05em] -bottom-[0.1em] font-display text-[clamp(10rem,28vw,22rem)] text-transparent leading-none pointer-events-none select-none" style="-webkit-text-stroke:1px rgba(255,89,16,0.08)">RUN</span>
    <div class="w-[90%] max-w-[1240px] mx-auto">
      <!-- Last Race -->
      <div data-reveal class="mb-12">
        <div class="border-l-4 border-orange bg-warm-section dark:bg-navy-dark/50 rounded-sm p-6 md:p-8">
          <p class="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-orange mb-4">Last Race</p>
          <div class="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h3 class="font-display text-[clamp(1.8rem,4vw,2.8rem)] text-navy-bg dark:text-offwhite leading-tight">Delaware Running Festival Marathon</h3>
              <p class="font-mono text-[0.75rem] text-navy-bg/60 dark:text-offwhite/60 mt-1">April 19, 2026 · Delaware</p>
            </div>
            <div class="flex flex-col items-center justify-center bg-orange/10 border border-orange/30 px-6 py-4 rounded-sm flex-shrink-0">
              <span class="font-display text-[clamp(1.4rem,3vw,2rem)] text-orange leading-tight tracking-wide text-center">NEW PERSONAL RECORD!</span>
            </div>
          </div>
          <div class="mt-4"><span class="inline-flex items-center gap-2 bg-orange/10 border border-orange/20 px-3 py-1 rounded-full font-mono text-[0.65rem] tracking-widest uppercase text-orange">26.2 mi</span></div>
        </div>
      </div>
      <!-- Stat grid -->
      <div data-reveal class="grid grid-cols-2 md:grid-cols-4 gap-px bg-navy-bg/10 dark:bg-offwhite/10 border border-navy-bg/10 dark:border-offwhite/10 rounded-sm overflow-hidden mb-12">
        <div class="bg-warm-section dark:bg-[rgba(0,30,80,0.4)] hover:bg-warm-bg dark:hover:bg-[rgba(0,45,114,0.6)] py-6 px-4 text-center transition-colors"><span class="block font-display text-[clamp(3rem,8vw,5rem)] leading-none text-navy-bg dark:text-offwhite">4</span><span class="block font-mono text-[0.65rem] tracking-[0.12em] uppercase text-navy-bg/60 dark:text-offwhite/60 mt-1">Marathons</span></div>
        <div class="bg-orange/12 hover:bg-orange/[.20] py-6 px-4 text-center transition-colors"><span class="block font-display text-[clamp(3rem,8vw,5rem)] leading-none text-orange">3×</span><span class="block font-mono text-[0.65rem] tracking-[0.12em] uppercase text-navy-bg/60 dark:text-offwhite/60 mt-1">NYC Marathon</span></div>
        <div class="bg-warm-section dark:bg-[rgba(0,30,80,0.4)] hover:bg-warm-bg dark:hover:bg-[rgba(0,45,114,0.6)] py-6 px-4 text-center transition-colors"><span class="block font-display text-[clamp(3rem,8vw,5rem)] leading-none text-navy-bg dark:text-offwhite">5</span><span class="block font-mono text-[0.65rem] tracking-[0.12em] uppercase text-navy-bg/60 dark:text-offwhite/60 mt-1">Half Marathons</span></div>
        <div class="bg-warm-section dark:bg-[rgba(0,30,80,0.4)] hover:bg-warm-bg dark:hover:bg-[rgba(0,45,114,0.6)] py-6 px-4 text-center transition-colors"><span class="block font-display text-[clamp(3rem,8vw,5rem)] leading-none text-navy-bg dark:text-offwhite">3</span><span class="block font-mono text-[0.65rem] tracking-[0.12em] uppercase text-navy-bg/60 dark:text-offwhite/60 mt-1">Years Running</span></div>
      </div>
      <!-- PRs + Goals + Photo -->
      <div class="grid gap-10 lg:grid-cols-2 lg:items-start mb-12">
        <div class="flex flex-col gap-6">
          <div>
            <h3 class="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-navy-bg/60 dark:text-offwhite/60 mb-5">Personal Records</h3>
            <div class="grid gap-4 sm:grid-cols-2">
              <div data-reveal class="bg-warm-section dark:bg-[rgba(0,30,80,0.4)] border border-navy-bg/10 dark:border-offwhite/10 rounded-sm p-6 hover:border-navy-bg/25 dark:hover:border-offwhite/25 hover:-translate-y-0.5 transition-all duration-300">
                <div class="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-navy-bg/60 dark:text-offwhite/60 mb-2">Half Marathon</div>
                <div class="font-display text-[clamp(2.5rem,8vw,4rem)] text-navy-bg dark:text-offwhite leading-none">1:43<span class="text-[0.5em] opacity-60">:45</span></div>
                <div class="font-mono text-[0.65rem] tracking-widest text-navy-bg/60 dark:text-offwhite/60 mt-2">~7:55 / mile</div>
              </div>
              <div data-reveal class="relative bg-orange/10 border border-orange/40 rounded-sm p-6 hover:border-orange hover:-translate-y-0.5 transition-all duration-300">
                <span class="absolute top-4 right-4 text-orange text-[1.2rem]">★</span>
                <div class="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-navy-bg/60 dark:text-offwhite/60 mb-2">Full Marathon</div>
                <div class="font-display text-[clamp(2.5rem,8vw,4rem)] text-orange leading-none">3:54<span class="text-[0.5em] opacity-60">:23</span></div>
                <div class="font-mono text-[0.65rem] tracking-widest text-navy-bg/60 dark:text-offwhite/60 mt-2">~8:57 / mile</div>
                <div class="mt-3 inline-flex items-center gap-1.5 bg-orange text-offwhite px-3 py-1 rounded-full font-mono text-[0.6rem] tracking-widest uppercase"><span>✓</span> Sub-4 Achieved</div>
              </div>
            </div>
          </div>
          <div data-reveal>
            <h3 class="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-navy-bg/60 dark:text-offwhite/60 mb-4">Current Goals</h3>
            <div class="flex flex-wrap gap-3">
              <span class="inline-flex items-center gap-2 border border-orange bg-orange text-offwhite px-4 py-2 rounded-full font-mono text-[0.7rem] tracking-[0.05em]"><span>✓</span> Sub-4:00 Marathon</span>
              <span class="inline-flex items-center gap-2 border border-orange/40 text-orange bg-orange/8 px-4 py-2 rounded-full font-mono text-[0.7rem] tracking-[0.05em]"><span aria-hidden="true">▶</span> Run Boston Marathon</span>
              <span class="inline-flex items-center gap-2 border border-orange/40 text-orange bg-orange/8 px-4 py-2 rounded-full font-mono text-[0.7rem] tracking-[0.05em]"><span aria-hidden="true">▶</span> Complete Chicago Major</span>
              <span class="inline-flex items-center gap-2 border border-orange/40 text-orange bg-orange/8 px-4 py-2 rounded-full font-mono text-[0.7rem] tracking-[0.05em]"><span aria-hidden="true">▶</span> 1,000 miles in 2026</span>
            </div>
          </div>
        </div>
        <div class="hidden lg:block relative overflow-hidden rounded-sm aspect-[4/5] group">
          <img src="../images/IMG_1547.jpg" alt="Calvin Daniel running a marathon" loading="lazy" class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]" />
          <div class="absolute inset-0 bg-gradient-to-t from-warm-section/30 dark:from-navy-dark/50 to-transparent"></div>
        </div>
      </div>
      <!-- Abbott Majors -->
      <div data-reveal class="border border-navy-bg/10 dark:border-offwhite/10 rounded-sm p-8 bg-warm-section/60 dark:bg-[rgba(0,15,50,0.4)]">
        <div class="mb-8">
          <h3 class="font-display text-[clamp(1.5rem,4vw,2.5rem)] text-navy-bg dark:text-offwhite tracking-wide mb-2">Abbott World Marathon Majors</h3>
          <p class="text-navy-bg/60 dark:text-offwhite/60 text-[0.95rem]">Six of the world's most prestigious marathons. One 6-Star medal for those who conquer them all. The hunt is on.</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div class="flex flex-col gap-1 p-4 rounded-sm border bg-orange/12 border-orange/40 hover:border-orange transition-all duration-300 hover:-translate-y-0.5"><span class="text-orange text-[1rem]">★</span><span class="font-display text-[1.1rem] text-navy-bg dark:text-offwhite tracking-wide">New York City</span><span class="font-mono text-[0.6rem] tracking-widest uppercase text-orange">3× Finisher</span></div>
          <div class="flex flex-col gap-1 p-4 rounded-sm border border-navy-bg/10 dark:border-offwhite/10 hover:border-navy-bg/20 dark:hover:border-offwhite/20 transition-all duration-300 hover:-translate-y-0.5"><span class="text-orange text-[1rem]">○</span><span class="font-display text-[1.1rem] text-navy-bg dark:text-offwhite tracking-wide">Chicago</span><span class="font-mono text-[0.6rem] tracking-widest uppercase text-navy-bg/60 dark:text-offwhite/60">Next Target</span></div>
          <div class="flex flex-col gap-1 p-4 rounded-sm border border-navy-bg/10 dark:border-offwhite/10 hover:border-navy-bg/20 dark:hover:border-offwhite/20 transition-all duration-300 hover:-translate-y-0.5"><span class="text-navy-bg/40 dark:text-offwhite/40 text-[1rem]">○</span><span class="font-display text-[1.1rem] text-navy-bg dark:text-offwhite tracking-wide">Boston</span><span class="font-mono text-[0.6rem] tracking-widest uppercase text-navy-bg/60 dark:text-offwhite/60">Next Target</span></div>
          <div class="flex flex-col gap-1 p-4 rounded-sm border border-navy-bg/10 dark:border-offwhite/10 hover:border-navy-bg/20 dark:hover:border-offwhite/20 transition-all duration-300 hover:-translate-y-0.5"><span class="text-navy-bg/40 dark:text-offwhite/40 text-[1rem]">○</span><span class="font-display text-[1.1rem] text-navy-bg dark:text-offwhite tracking-wide">London</span><span class="font-mono text-[0.6rem] tracking-widest uppercase text-navy-bg/60 dark:text-offwhite/60">On the list</span></div>
          <div class="flex flex-col gap-1 p-4 rounded-sm border border-navy-bg/10 dark:border-offwhite/10 hover:border-navy-bg/20 dark:hover:border-offwhite/20 transition-all duration-300 hover:-translate-y-0.5"><span class="text-navy-bg/40 dark:text-offwhite/40 text-[1rem]">○</span><span class="font-display text-[1.1rem] text-navy-bg dark:text-offwhite tracking-wide">Berlin</span><span class="font-mono text-[0.6rem] tracking-widest uppercase text-navy-bg/60 dark:text-offwhite/60">On the list</span></div>
          <div class="flex flex-col gap-1 p-4 rounded-sm border border-navy-bg/10 dark:border-offwhite/10 hover:border-navy-bg/20 dark:hover:border-offwhite/20 transition-all duration-300 hover:-translate-y-0.5"><span class="text-navy-bg/40 dark:text-offwhite/40 text-[1rem]">○</span><span class="font-display text-[1.1rem] text-navy-bg dark:text-offwhite tracking-wide">Tokyo</span><span class="font-mono text-[0.6rem] tracking-widest uppercase text-navy-bg/60 dark:text-offwhite/60">On the list</span></div>
        </div>
        <p class="mt-8 font-mono text-[0.7rem] tracking-[0.15em] uppercase text-orange text-center">1 star earned. 5 to go. The 6-Star medal awaits.</p>
      </div>
    </div>
  </section>

</main>

<!-- ── FOOTER ─────────────────────────────────────────────── -->
<footer class="bg-warm-section dark:bg-navy-dark border-t border-navy-bg/10 dark:border-offwhite/10 py-8">
  <div class="w-[90%] max-w-[1240px] mx-auto">
    <div class="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:items-center">
      <a href="../" aria-label="Calvin Daniel Home" class="hover:opacity-80 transition-opacity flex-shrink-0">
        <img src="../images/primary-logo.png"  alt="Calvin Daniel" class="logo-light h-12 w-auto" />
        <img src="../images/dark-mode-logo.png" alt="Calvin Daniel" class="logo-dark  h-12 w-auto" />
      </a>
      <div class="flex flex-col items-center gap-3">
        <nav class="flex flex-wrap justify-center gap-6" aria-label="Footer navigation">
        <a href="../"          class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Home</a>
        <a href="../running/"  class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Running</a>
        <a href="../projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Projects</a>
        <a href="../clients/"  class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Clients</a>
        </nav>
        <div class="flex flex-wrap justify-center gap-6">
          <a href="https://github.com/calvinadaniel/" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="text-navy-bg/40 dark:text-offwhite/40 hover:text-orange transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          </a>
          <a href="https://www.linkedin.com/in/calvin-daniel-6229054/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="text-navy-bg/40 dark:text-offwhite/40 hover:text-orange transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="https://www.tiktok.com/@calvindaniel06" target="_blank" rel="noopener noreferrer" aria-label="TikTok" class="text-navy-bg/40 dark:text-offwhite/40 hover:text-orange transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
          </a>
        </div>
      </div>
      <div class="flex flex-col items-center md:items-end gap-3 flex-shrink-0">
        <a href="../#contact" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-orange border border-orange px-4 py-[0.4rem] rounded-sm hover:bg-orange hover:text-offwhite transition-all">Let's Connect</a>
        <span class="font-mono text-[0.65rem] tracking-[0.1em] text-navy-bg/60 dark:text-offwhite/60">&copy; 2026 Calvin Daniel</span>
      </div>
    </div>
  </div>
</footer>

<script src="../js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Verify the file was created and is well-formed**

Run: `grep -c "</section>" "running/index.html"` — expect `3` (page-header section, running-content section, and none other; footer/header are not `<section>` tags).
Run: `grep -c "id=\"running\"" "running/index.html"` — expect `0` (the old anchor ID is intentionally not reused; the page itself is the destination now).

- [ ] **Step 4: Commit**

```bash
git add running/index.html
git commit -m "feat: add standalone running page"
```

---

### Task 2: Update `index.html` navigation (header, off-canvas, footer)

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: the active/inactive nav link classes produced in Task 1.

- [ ] **Step 1: Replace the header nav block**

In `index.html`, find this block (inside `<header id="site-header">`, right after `<nav class="hidden lg:flex gap-6 items-center" aria-label="Main navigation">`):

```html
      <div class="nav-projects">
        <a href="/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors flex items-center gap-1">
          Home
          <svg class="nav-projects-chevron" width="10" height="7" viewBox="0 0 10 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="1,1 5,6 9,1"/></svg>
        </a>
        <div class="nav-dropdown" role="menu" aria-label="Home sections">
          <a href="#about"   class="nav-dropdown-link" role="menuitem">About</a>
          <a href="#web-dev" class="nav-dropdown-link" role="menuitem">Developer</a>
          <a href="#analyst" class="nav-dropdown-link" role="menuitem">Analyst</a>
          <a href="#running" class="nav-dropdown-link" role="menuitem">Runner</a>
        </div>
      </div>
      <div class="nav-projects">
```

Replace it with:

```html
      <a href="/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-orange border-b-2 border-orange pb-0.5">Home</a>
      <a href="running/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors">Running</a>
      <div class="nav-projects">
```

(This removes the Home dropdown entirely, adds a plain active "Home" link and a plain "Running" link, and leaves the following `Projects` dropdown `<div class="nav-projects">` block completely untouched.)

- [ ] **Step 2: Replace the off-canvas nav "Home" list item**

Find:

```html
    <li>
      <a href="/" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Home</a>
      <div class="mobile-sub-nav">
        <a href="#about">About</a>
        <a href="#web-dev">Developer</a>
        <a href="#analyst">Analyst</a>
        <a href="#running">Runner</a>
      </div>
    </li>
    <li>
      <a href="projects/" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Projects</a>
```

Replace with:

```html
    <li><a href="/" class="font-display text-[2rem] text-orange tracking-wide">Home</a></li>
    <li><a href="running/" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Running</a></li>
    <li>
      <a href="projects/" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Projects</a>
```

- [ ] **Step 3: Add "Running" to the footer nav**

Find:

```html
        <a href="/"         class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Home</a>
        <a href="projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Projects</a>
```

Replace with:

```html
        <a href="/"         class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Home</a>
        <a href="running/"  class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Running</a>
        <a href="projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Projects</a>
```

- [ ] **Step 4: Verify no dangling dropdown references remain in the nav**

Run: `grep -n "nav-dropdown\" role=\"menu\" aria-label=\"Home sections\"" index.html` — expect no output (0 matches).
Run: `grep -c "aria-label=\"Projects submenu\"" index.html` — expect `1` (the Projects dropdown must still be present, untouched).

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: flatten Home nav item and add Running nav link on homepage"
```

---

### Task 3: Remove the old `#running` section from `index.html`

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: none (the content was already copied into `running/index.html` in Task 1; this task only deletes it from `index.html`).

- [ ] **Step 1: Delete the section**

Delete everything starting at the line `<!-- ── RUNNING ─────────────────────────────────────────── -->` through the matching `</section>` immediately before the line `<!-- ── PRICING ─────────────────────────────────────────── -->`. This is the entire block that starts with:

```html
<!-- ── RUNNING ─────────────────────────────────────────── -->
<section id="running" class="relative bg-warm-bg dark:bg-navy-bg py-16 overflow-hidden scroll-mt-[70px]">
```

and ends with the `</section>` that directly precedes:

```html
<!-- ── PRICING ─────────────────────────────────────────── -->
```

Remove the whole block (comment line through closing `</section>`), leaving the `<!-- ── PRICING -->` comment and the `#pricing` section immediately following whatever section now precedes it.

- [ ] **Step 2: Verify removal**

Run: `grep -c "id=\"running\"" index.html` — expect `0`.
Run: `grep -c "Abbott World Marathon Majors" index.html` — expect `0` (confirms the moved content isn't duplicated on the homepage).
Run: `grep -c "id=\"pricing\"" index.html` — expect `1` (pricing section still intact).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: remove running section from homepage (moved to /running/)"
```

---

### Task 4: Update `index.html` page metadata and hero

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: none.

- [ ] **Step 1: Update `<head>` metadata**

Find:

```html
  <title>Calvin Daniel — Developer. Analyst. Runner.</title>
  <meta name="description" content="Calvin Daniel — developer, analyst, and runner. Portfolio of web development projects, client work, and technical builds." />
  <link rel="canonical" href="https://calvindaniel.com/" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Calvin Daniel" />
  <meta property="og:title" content="Calvin Daniel — Developer. Analyst. Runner." />
  <meta property="og:description" content="Calvin Daniel — developer, analyst, and runner. Portfolio of web development projects, client work, and technical builds." />
  <meta property="og:url" content="https://calvindaniel.com/" />
  <meta property="og:image" content="https://calvindaniel.com/images/favicon-social-logo.png" />
  <meta property="og:image:width" content="195" />
  <meta property="og:image:height" content="178" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Calvin Daniel — Developer. Analyst. Runner." />
  <meta name="twitter:description" content="Calvin Daniel — developer, analyst, and runner. Portfolio of web development projects, client work, and technical builds." />
  <meta name="twitter:image" content="https://calvindaniel.com/images/favicon-social-logo.png" />
```

Replace with:

```html
  <title>Calvin Daniel — Full-Stack Engineer</title>
  <meta name="description" content="Calvin Daniel — full-stack engineer combining web development and data analytics. Portfolio of client work, technical builds, and a marathon running journey." />
  <link rel="canonical" href="https://calvindaniel.com/" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Calvin Daniel" />
  <meta property="og:title" content="Calvin Daniel — Full-Stack Engineer" />
  <meta property="og:description" content="Calvin Daniel — full-stack engineer combining web development and data analytics. Portfolio of client work, technical builds, and a marathon running journey." />
  <meta property="og:url" content="https://calvindaniel.com/" />
  <meta property="og:image" content="https://calvindaniel.com/images/favicon-social-logo.png" />
  <meta property="og:image:width" content="195" />
  <meta property="og:image:height" content="178" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Calvin Daniel — Full-Stack Engineer" />
  <meta name="twitter:description" content="Calvin Daniel — full-stack engineer combining web development and data analytics. Portfolio of client work, technical builds, and a marathon running journey." />
  <meta name="twitter:image" content="https://calvindaniel.com/images/favicon-social-logo.png" />
```

- [ ] **Step 2: Update the hero headline, subcopy, and buttons**

Find:

```html
    <h1 class="hero-headline font-display leading-[0.92] mb-8">
      <span class="block text-[clamp(3.5rem,13vw,9rem)] text-navy-bg dark:text-offwhite">Developer.</span>
      <span class="block text-[clamp(3.5rem,13vw,9rem)] text-orange">Analyst.</span>
      <span id="runner-line" class="block text-[clamp(3.5rem,13vw,9rem)] text-transparent">Runner.</span>
    </h1>

    <p class="text-[clamp(0.95rem,2.5vw,1.15rem)] text-navy-bg/60 dark:text-offwhite/60 max-w-[520px] mb-8 leading-[1.7]">
      I build web experiences, translate data into decisions,<br />
      and chase finish lines — all at full stride.
    </p>

    <div class="flex flex-wrap gap-4">
      <a href="#web-dev" class="inline-flex items-center px-7 py-3 bg-orange border-2 border-orange text-offwhite font-mono text-[0.8rem] tracking-[0.1em] uppercase rounded-sm transition-all duration-300 hover:bg-orange-dim hover:border-orange-dim hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(255,89,16,0.4)]">See My Work</a>
      <a href="#contact" class="inline-flex items-center px-7 py-3 bg-transparent border-2 border-navy-bg/30 dark:border-offwhite/35 text-navy-bg dark:text-offwhite font-mono text-[0.8rem] tracking-[0.1em] uppercase rounded-sm transition-all duration-300 hover:border-navy-bg dark:hover:border-offwhite hover:-translate-y-0.5">Get In Touch</a>
    </div>
```

Replace with:

```html
    <h1 class="hero-headline font-display leading-[0.92] mb-8">
      <span class="block text-[clamp(3.5rem,13vw,9rem)] text-navy-bg dark:text-offwhite">Full-Stack</span>
      <span class="block text-[clamp(3.5rem,13vw,9rem)] text-orange">Engineer.</span>
      <span id="runner-line" class="block text-[clamp(3.5rem,13vw,9rem)] text-transparent">Runner.</span>
    </h1>

    <p class="text-[clamp(0.95rem,2.5vw,1.15rem)] text-navy-bg/60 dark:text-offwhite/60 max-w-[520px] mb-8 leading-[1.7]">
      I build the front end, wire up the data behind it, and ship<br />
      experiences that hold together end to end.
    </p>

    <div class="flex flex-wrap gap-4">
      <a href="projects/" class="inline-flex items-center px-7 py-3 bg-orange border-2 border-orange text-offwhite font-mono text-[0.8rem] tracking-[0.1em] uppercase rounded-sm transition-all duration-300 hover:bg-orange-dim hover:border-orange-dim hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(255,89,16,0.4)]">See My Work</a>
      <a href="#pricing" class="inline-flex items-center px-7 py-3 bg-transparent border-2 border-navy-bg/30 dark:border-offwhite/35 text-navy-bg dark:text-offwhite font-mono text-[0.8rem] tracking-[0.1em] uppercase rounded-sm transition-all duration-300 hover:border-navy-bg dark:hover:border-offwhite hover:-translate-y-0.5">Pricing</a>
      <a href="#contact" class="inline-flex items-center px-7 py-3 bg-transparent border-2 border-navy-bg/30 dark:border-offwhite/35 text-navy-bg dark:text-offwhite font-mono text-[0.8rem] tracking-[0.1em] uppercase rounded-sm transition-all duration-300 hover:border-navy-bg dark:hover:border-offwhite hover:-translate-y-0.5">Get In Touch</a>
    </div>
```

Note: `id="runner-line"` and its outline-stroke CSS (`css/styles.css` `#runner-line` rule) are untouched — only the visible text changed on the two lines above it. The hero counters (`data-countup`, the `3:54:23` PR span) below this block are untouched.

- [ ] **Step 3: Verify**

Run: `grep -c "Developer\.\|Analyst\.\|Runner\.\"" index.html` — this is just a sanity spot-check; confirm by eye that the headline `<h1>` now reads "Full-Stack" / "Engineer." / "Runner." and no leftover "Developer." or "Analyst." text remains in the hero or `<title>`/meta tags.
Run: `grep -n "href=\"#web-dev\"" index.html` — expect no output (the hero button no longer targets `#web-dev`; the id itself is removed in Task 6).
Run: `grep -c "href=\"projects/\"" index.html` — expect at least `1` (the new "See My Work" button).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: reposition hero as full-stack engineer, add pricing button"
```

---

### Task 5: Rewrite the `index.html` About section copy

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `running/` page path from Task 1 (used in the new "See the running log" link).

- [ ] **Step 1: Replace the About section text and icon row**

Find:

```html
        <div data-reveal><p class="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-orange mb-2">Who I Am</p></div>
        <div data-reveal><h2 class="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-[0.01em]">Three disciplines.<br />One relentless pursuit.</h2></div>
        <div data-reveal><p class="text-navy-bg/60 dark:text-offwhite/60 text-[1.05rem] leading-[1.8] mt-4">I'm Calvin Daniel — a Commercial Operations Specialist by day, a freelance web developer building real digital experiences for real businesses, and a long-distance runner who believes the same mindset that gets you to mile 20 gets you to the best possible solution.</p></div>
        <div data-reveal><p class="text-navy-bg/60 dark:text-offwhite/60 text-[1.05rem] leading-[1.8] mt-4">Whether I'm designing a client's brand from scratch, architecting a Power BI dashboard that cuts through noise, or training for my next World Marathon Major — I bring precision, endurance, and hunger to every endeavor.</p></div>
        <div data-reveal class="flex gap-8 mt-16 flex-wrap">
          <div class="flex flex-col items-center gap-2"><span class="text-[1.5rem] text-orange">&lt;/&gt;</span><span class="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-navy-bg/60 dark:text-offwhite/60">Web Dev</span></div>
          <div class="flex flex-col items-center gap-2"><span class="text-[1.5rem] text-orange">▲</span><span class="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-navy-bg/60 dark:text-offwhite/60">Analytics</span></div>
          <div class="flex flex-col items-center gap-2"><span class="text-[1.5rem] text-orange">●</span><span class="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-navy-bg/60 dark:text-offwhite/60">Running</span></div>
        </div>
```

Replace with:

```html
        <div data-reveal><p class="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-orange mb-2">Who I Am</p></div>
        <div data-reveal><h2 class="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-[0.01em]">One discipline.<br />Built to last the distance.</h2></div>
        <div data-reveal><p class="text-navy-bg/60 dark:text-offwhite/60 text-[1.05rem] leading-[1.8] mt-4">I'm Calvin Daniel — a full-stack engineer who builds the whole path from raw data to a finished product: the SQL and dashboards that surface what matters, and the web experiences that put it in front of real people.</p></div>
        <div data-reveal><p class="text-navy-bg/60 dark:text-offwhite/60 text-[1.05rem] leading-[1.8] mt-4">Whether I'm designing a client's brand from scratch or architecting a Power BI dashboard that cuts through noise, I bring the same precision and endurance to every build — the same mindset that gets me to mile 20 on race day. <a href="running/" class="text-orange hover:text-orange-dim underline underline-offset-4 transition-colors">See the running log &rarr;</a></p></div>
        <div data-reveal class="flex gap-8 mt-16 flex-wrap">
          <div class="flex flex-col items-center gap-2"><span class="text-[1.5rem] text-orange">&lt;/&gt;</span><span class="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-navy-bg/60 dark:text-offwhite/60">Web Dev</span></div>
          <div class="flex flex-col items-center gap-2"><span class="text-[1.5rem] text-orange">▲</span><span class="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-navy-bg/60 dark:text-offwhite/60">Analytics</span></div>
        </div>
```

(The marathon-finishes photo badge above this text block, `<div class="absolute bottom-4 right-4 ...">3 NYC Marathon Finishes</div>`, is untouched — it stays as personal flavor on the About photo.)

- [ ] **Step 2: Verify**

Run: `grep -c "Three disciplines" index.html` — expect `0`.
Run: `grep -c "href=\"running/\"" index.html` — expect `1` (the new about-section link; nav links from Task 2 use `href="running/"` too, so if Task 2 already ran this should be `3`: header nav, off-canvas nav, and this new about link — adjust expectation to `3` if Task 2 has already been completed, `1` if run standalone before Task 2).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: rewrite about section copy around full-stack positioning"
```

---

### Task 6: Merge `#web-dev` and `#analyst` into a single `#full-stack` section

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: none.
- Produces: `id="full-stack"` — the new merged section id (nothing else references the old `#web-dev`/`#analyst` ids after this task; Task 2 already removed the nav dropdown links that pointed to them).

- [ ] **Step 1: Replace both sections with one merged section**

Delete everything from the line `<!-- ── WEB DEV ─────────────────────────────────────────── -->` through the `</section>` that closes the `#analyst` section (the one immediately before `<!-- ── RUNNING -->` if Task 3 hasn't run yet, or immediately before `<!-- ── PRICING -->` if Task 3 already ran). That deleted range starts with:

```html
<!-- ── WEB DEV ─────────────────────────────────────────── -->
<section id="web-dev" class="bg-warm-bg dark:bg-navy-bg py-24 scroll-mt-[70px]">
```

and ends with the `</section>` that closes:

```html
<section id="analyst" class="bg-warm-section dark:bg-navy-section py-24 scroll-mt-[70px]">
```

Replace the entire deleted range with:

```html
<!-- ── FULL-STACK ──────────────────────────────────────── -->
<section id="full-stack" class="bg-warm-bg dark:bg-navy-bg py-24 scroll-mt-[70px]">
  <div class="w-[90%] max-w-[1240px] mx-auto">
    <div data-reveal class="text-center mb-16">
      <p class="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-orange mb-2">What I Build</p>
      <h2 class="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-[0.01em]">Full-Stack Engineer</h2>
      <p class="max-w-[600px] mx-auto mt-4 text-navy-bg/60 dark:text-offwhite/60 text-[1.05rem] leading-relaxed">From custom-coded front ends to the SQL and dashboards behind the scenes, I build the whole path from raw data to a finished product — no bloated frameworks, just clean architecture and decisions backed by real numbers.</p>
    </div>

    <h3 class="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-navy-bg/60 dark:text-offwhite/60 mb-8">Development</h3>
    <div class="grid gap-px bg-navy-bg/10 dark:bg-offwhite/10 border border-navy-bg/10 dark:border-offwhite/10 rounded-sm overflow-hidden md:grid-cols-2 lg:grid-cols-3">
      <div data-reveal class="bg-warm-section dark:bg-[rgba(0,30,80,0.5)] p-8 hover:bg-warm-bg dark:hover:bg-[rgba(0,45,114,0.7)] transition-colors h-full"><div class="font-mono text-[0.65rem] text-orange tracking-[0.1em] mb-4">01</div><h4 class="font-display text-[1.4rem] tracking-wide text-navy-bg dark:text-offwhite mb-2">HTML / CSS / JavaScript</h4><p class="text-navy-bg/60 dark:text-offwhite/60 text-[0.9rem] leading-[1.7]">Semantic, accessible markup paired with custom CSS architecture and vanilla JS — built to perform and maintain without dependencies.</p></div>
      <div data-reveal class="bg-warm-section dark:bg-[rgba(0,30,80,0.5)] p-8 hover:bg-warm-bg dark:hover:bg-[rgba(0,45,114,0.7)] transition-colors h-full"><div class="font-mono text-[0.65rem] text-orange tracking-[0.1em] mb-4">02</div><h4 class="font-display text-[1.4rem] tracking-wide text-navy-bg dark:text-offwhite mb-2">Responsive Design</h4><p class="text-navy-bg/60 dark:text-offwhite/60 text-[0.9rem] leading-[1.7]">Mobile-first layouts with CSS Grid, Flexbox, and fluid typography. Your site looks sharp and intentional on every screen.</p></div>
      <div data-reveal class="bg-warm-section dark:bg-[rgba(0,30,80,0.5)] p-8 hover:bg-warm-bg dark:hover:bg-[rgba(0,45,114,0.7)] transition-colors h-full"><div class="font-mono text-[0.65rem] text-orange tracking-[0.1em] mb-4">03</div><h4 class="font-display text-[1.4rem] tracking-wide text-navy-bg dark:text-offwhite mb-2">WordPress Builds</h4><p class="text-navy-bg/60 dark:text-offwhite/60 text-[0.9rem] leading-[1.7]">Custom WordPress development on Hostinger — lean, fast, and fully managed for small businesses that need real results.</p></div>
      <div data-reveal class="bg-warm-section dark:bg-[rgba(0,30,80,0.5)] p-8 hover:bg-warm-bg dark:hover:bg-[rgba(0,45,114,0.7)] transition-colors h-full"><div class="font-mono text-[0.65rem] text-orange tracking-[0.1em] mb-4">04</div><h4 class="font-display text-[1.4rem] tracking-wide text-navy-bg dark:text-offwhite mb-2">Custom Frameworks</h4><p class="text-navy-bg/60 dark:text-offwhite/60 text-[0.9rem] leading-[1.7]">No Bootstrap, no bloat. Bespoke component systems built to each client's brand and performance requirements.</p></div>
      <div data-reveal class="bg-warm-section dark:bg-[rgba(0,30,80,0.5)] p-8 hover:bg-warm-bg dark:hover:bg-[rgba(0,45,114,0.7)] transition-colors h-full"><div class="font-mono text-[0.65rem] text-orange tracking-[0.1em] mb-4">05</div><h4 class="font-display text-[1.4rem] tracking-wide text-navy-bg dark:text-offwhite mb-2">SEO &amp; Performance</h4><p class="text-navy-bg/60 dark:text-offwhite/60 text-[0.9rem] leading-[1.7]">Schema markup, Open Graph metadata, and page speed optimization — building for both people and search engines.</p></div>
      <div data-reveal class="bg-warm-section dark:bg-[rgba(0,30,80,0.5)] p-8 hover:bg-warm-bg dark:hover:bg-[rgba(0,45,114,0.7)] transition-colors h-full"><div class="font-mono text-[0.65rem] text-orange tracking-[0.1em] mb-4">06</div><h4 class="font-display text-[1.4rem] tracking-wide text-navy-bg dark:text-offwhite mb-2">CMS Integration</h4><p class="text-navy-bg/60 dark:text-offwhite/60 text-[0.9rem] leading-[1.7]">Squarespace, WordPress, and headless CMS setups — giving clients full control of their content without touching code.</p></div>
    </div>

    <h3 class="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-navy-bg/60 dark:text-offwhite/60 mt-16 mb-8">Data &amp; Analytics</h3>
    <div class="grid gap-16 md:grid-cols-2 md:items-start">
      <div>
        <div data-reveal><p class="text-navy-bg/60 dark:text-offwhite/60 text-[1.05rem] leading-[1.8]">As a Commercial Operations Specialist, I live in data. From SQL scripting to Power BI dashboard design, I turn raw numbers into visual stories that drive real business decisions.</p></div>
        <div data-reveal><p class="text-navy-bg/60 dark:text-offwhite/60 text-[1.05rem] leading-[1.8] mt-4">I'm actively deepening my Python expertise — building automation scripts that eliminate repetitive weekly, monthly, and quarterly tasks so teams can focus on work that actually matters.</p></div>
        <div data-reveal class="mt-16 flex flex-col gap-8">
          <div><div class="flex justify-between items-baseline mb-2"><span class="font-mono text-[0.75rem] tracking-[0.08em] uppercase text-navy-bg dark:text-offwhite">Power BI</span><span class="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-orange">Expert</span></div><div class="h-[3px] bg-navy-bg/10 dark:bg-offwhite/10 rounded-sm overflow-hidden"><div class="skill-bar-fill" data-width="92"></div></div></div>
          <div><div class="flex justify-between items-baseline mb-2"><span class="font-mono text-[0.75rem] tracking-[0.08em] uppercase text-navy-bg dark:text-offwhite">SQL</span><span class="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-orange">Advanced</span></div><div class="h-[3px] bg-navy-bg/10 dark:bg-offwhite/10 rounded-sm overflow-hidden"><div class="skill-bar-fill" data-width="88"></div></div></div>
          <div><div class="flex justify-between items-baseline mb-2"><span class="font-mono text-[0.75rem] tracking-[0.08em] uppercase text-navy-bg dark:text-offwhite">Data Modeling</span><span class="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-orange">Advanced</span></div><div class="h-[3px] bg-navy-bg/10 dark:bg-offwhite/10 rounded-sm overflow-hidden"><div class="skill-bar-fill" data-width="80"></div></div></div>
          <div><div class="flex justify-between items-baseline mb-2"><span class="font-mono text-[0.75rem] tracking-[0.08em] uppercase text-navy-bg dark:text-offwhite">Python</span><span class="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-orange">Growing</span></div><div class="h-[3px] bg-navy-bg/10 dark:bg-offwhite/10 rounded-sm overflow-hidden"><div class="skill-bar-fill" data-width="45"></div></div></div>
        </div>
      </div>
      <div data-reveal data-dir="right" class="flex flex-col gap-4">
        <div class="bg-warm-section dark:bg-[rgba(0,15,50,0.7)] border border-navy-bg/10 dark:border-offwhite/10 rounded p-6 hover:border-navy-bg/25 dark:hover:border-offwhite/25 hover:-translate-y-0.5 transition-all duration-300">
          <div class="flex justify-between items-center mb-4"><span class="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-navy-bg/60 dark:text-offwhite/60">Weekly Reports</span><span class="font-mono text-[0.6rem] tracking-widest uppercase text-navy-bg/60 dark:text-offwhite/60 border border-navy-bg/10 dark:border-offwhite/10 px-2 py-0.5 rounded-sm">SQL</span></div>
          <div class="font-display text-[2.5rem] text-navy-bg dark:text-offwhite leading-none">40<span class="text-[1.4rem] opacity-60">+</span></div>
          <div class="font-mono text-[0.65rem] tracking-widest text-navy-bg/60 dark:text-offwhite/60 mt-1">queries executed per week</div>
          <div class="flex items-end gap-1 h-9 mt-4">
            <span class="flex-1 rounded-sm bg-orange/35" style="height:55%"></span>
            <span class="flex-1 rounded-sm bg-orange/35" style="height:70%"></span>
            <span class="flex-1 rounded-sm bg-orange/35" style="height:60%"></span>
            <span class="flex-1 rounded-sm bg-orange/35" style="height:85%"></span>
            <span class="flex-1 rounded-sm bg-orange/35" style="height:75%"></span>
            <span class="flex-1 rounded-sm bg-orange/35" style="height:90%"></span>
            <span class="flex-1 rounded-sm bg-orange"    style="height:100%"></span>
          </div>
        </div>
        <div class="bg-warm-section dark:bg-[rgba(0,15,50,0.7)] border border-navy-bg/10 dark:border-offwhite/10 rounded p-6 hover:border-navy-bg/25 dark:hover:border-offwhite/25 hover:-translate-y-0.5 transition-all duration-300">
          <div class="flex justify-between items-center mb-4"><span class="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-navy-bg/60 dark:text-offwhite/60">Dashboard Platform</span><span class="font-mono text-[0.6rem] tracking-widest uppercase text-orange border border-orange px-2 py-0.5 rounded-sm">Power BI</span></div>
          <div class="relative flex flex-col items-center">
            <svg class="w-full max-w-[200px]" viewBox="0 0 120 70" fill="none">
              <path d="M15 60 A45 45 0 0 1 105 60" stroke="currentColor" class="text-navy-bg/10 dark:text-offwhite/10" stroke-width="10" stroke-linecap="round"/>
              <path d="M15 60 A45 45 0 0 1 105 60" stroke="#FF5910" stroke-width="10" stroke-linecap="round" stroke-dasharray="141" stroke-dashoffset="25" class="gauge-path"/>
            </svg>
            <span class="font-display text-[1.8rem] text-orange absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2">82%</span>
            <span class="font-mono text-[0.6rem] tracking-widest uppercase text-navy-bg/60 dark:text-offwhite/60 mt-2">efficiency gain</span>
          </div>
        </div>
        <div class="bg-warm-section dark:bg-[rgba(0,15,50,0.7)] border border-navy-bg/10 dark:border-offwhite/10 rounded p-6 hover:border-navy-bg/25 dark:hover:border-offwhite/25 hover:-translate-y-0.5 transition-all duration-300">
          <div class="flex justify-between items-center mb-4"><span class="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-navy-bg/60 dark:text-offwhite/60">Automation Goal</span><span class="font-mono text-[0.6rem] tracking-widest uppercase text-navy-bg/60 dark:text-offwhite/60 border border-navy-bg/10 dark:border-offwhite/10 px-2 py-0.5 rounded-sm">Python</span></div>
          <div class="flex flex-wrap gap-2 mb-2">
            <span class="font-mono text-[0.65rem] tracking-[0.08em] uppercase bg-orange/15 text-orange border border-orange/30 px-2.5 py-0.5 rounded-sm">Weekly</span>
            <span class="font-mono text-[0.65rem] tracking-[0.08em] uppercase bg-orange/15 text-orange border border-orange/30 px-2.5 py-0.5 rounded-sm">Monthly</span>
            <span class="font-mono text-[0.65rem] tracking-[0.08em] uppercase bg-orange/15 text-orange border border-orange/30 px-2.5 py-0.5 rounded-sm">Quarterly</span>
          </div>
          <div class="font-mono text-[0.65rem] tracking-widest text-navy-bg/60 dark:text-offwhite/60">Tasks being automated</div>
        </div>
      </div>
    </div>

    <div data-reveal class="mt-16 pt-16 border-t border-navy-bg/10 dark:border-offwhite/10">
      <h3 class="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-navy-bg/60 dark:text-offwhite/60 mb-8">Areas of Focus</h3>
      <div class="flex flex-wrap gap-2">
        <span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase border border-navy-bg/20 dark:border-offwhite/20 text-navy-bg/60 dark:text-offwhite/60 px-4 py-1.5 rounded-sm hover:border-orange hover:text-orange transition-all duration-200 cursor-default">Dashboard Design</span>
        <span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase border border-navy-bg/20 dark:border-offwhite/20 text-navy-bg/60 dark:text-offwhite/60 px-4 py-1.5 rounded-sm hover:border-orange hover:text-orange transition-all duration-200 cursor-default">Data Ingestion</span>
        <span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase border border-navy-bg/20 dark:border-offwhite/20 text-navy-bg/60 dark:text-offwhite/60 px-4 py-1.5 rounded-sm hover:border-orange hover:text-orange transition-all duration-200 cursor-default">Report Automation</span>
        <span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase border border-navy-bg/20 dark:border-offwhite/20 text-navy-bg/60 dark:text-offwhite/60 px-4 py-1.5 rounded-sm hover:border-orange hover:text-orange transition-all duration-200 cursor-default">SQL Scripting</span>
        <span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase border border-navy-bg/20 dark:border-offwhite/20 text-navy-bg/60 dark:text-offwhite/60 px-4 py-1.5 rounded-sm hover:border-orange hover:text-orange transition-all duration-200 cursor-default">KPI Frameworks</span>
        <span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase border border-navy-bg/20 dark:border-offwhite/20 text-navy-bg/60 dark:text-offwhite/60 px-4 py-1.5 rounded-sm hover:border-orange hover:text-orange transition-all duration-200 cursor-default">Business Intelligence</span>
        <span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase border border-navy-bg/20 dark:border-offwhite/20 text-navy-bg/60 dark:text-offwhite/60 px-4 py-1.5 rounded-sm hover:border-orange hover:text-orange transition-all duration-200 cursor-default">Python Automation</span>
        <span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase border border-navy-bg/20 dark:border-offwhite/20 text-navy-bg/60 dark:text-offwhite/60 px-4 py-1.5 rounded-sm hover:border-orange hover:text-orange transition-all duration-200 cursor-default">Commercial Operations</span>
      </div>
    </div>

    <div data-reveal class="mt-16 border-l-[3px] border-orange pl-8">
      <blockquote class="font-display text-[clamp(1.4rem,3.5vw,2rem)] leading-[1.3] text-navy-bg/60 dark:text-offwhite/60 tracking-wide">"The best websites are the ones no one notices — because they just work, look right, and get out of the way."</blockquote>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run: `grep -c "id=\"web-dev\"" index.html` — expect `0`.
Run: `grep -c "id=\"analyst\"" index.html` — expect `0`.
Run: `grep -c "id=\"full-stack\"" index.html` — expect `1`.
Run: `grep -c "Power BI" index.html` — expect `2` (once in the skill-bar label, once in the "Dashboard Platform" stat card — confirms the analyst content survived the merge).
Run: `grep -c "Weekly Reports\|Areas of Focus\|CMS Integration" index.html` — expect `3` (one match per term, confirms both halves' content is present).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: merge web-dev and analyst sections into full-stack section"
```

---

### Task 7: Update navigation in `projects/index.html`

**Files:**
- Modify: `projects/index.html`

**Interfaces:**
- Consumes: active/inactive nav classes from Task 1.

- [ ] **Step 1: Replace the header nav block**

Find:

```html
      <div class="nav-projects">
        <a href="../" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors flex items-center gap-1">
          Home
          <svg class="nav-projects-chevron" width="10" height="7" viewBox="0 0 10 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="1,1 5,6 9,1"/></svg>
        </a>
        <div class="nav-dropdown" role="menu" aria-label="Home sections">
          <a href="../#about"   class="nav-dropdown-link" role="menuitem">About</a>
          <a href="../#web-dev" class="nav-dropdown-link" role="menuitem">Developer</a>
          <a href="../#analyst" class="nav-dropdown-link" role="menuitem">Analyst</a>
          <a href="../#running" class="nav-dropdown-link" role="menuitem">Runner</a>
        </div>
      </div>
      <div class="nav-projects">
        <a href="../projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-orange border-b-2 border-orange pb-0.5 flex items-center gap-1">
          Projects
```

Replace with:

```html
      <a href="../" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors">Home</a>
      <a href="../running/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors">Running</a>
      <div class="nav-projects">
        <a href="../projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-orange border-b-2 border-orange pb-0.5 flex items-center gap-1">
          Projects
```

- [ ] **Step 2: Replace the off-canvas nav "Home" list item**

Find:

```html
    <li>
      <a href="../" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Home</a>
      <div class="mobile-sub-nav">
        <a href="../#about">About</a>
        <a href="../#web-dev">Developer</a>
        <a href="../#analyst">Analyst</a>
        <a href="../#running">Runner</a>
      </div>
    </li>
    <li>
      <a href="../projects/" class="font-display text-[2rem] text-orange tracking-wide">Projects</a>
```

Replace with:

```html
    <li><a href="../" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Home</a></li>
    <li><a href="../running/" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Running</a></li>
    <li>
      <a href="../projects/" class="font-display text-[2rem] text-orange tracking-wide">Projects</a>
```

- [ ] **Step 3: Add "Running" to the footer nav**

Find:

```html
        <a href="../"          class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Home</a>
        <a href="../projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Projects</a>
```

Replace with:

```html
        <a href="../"          class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Home</a>
        <a href="../running/"  class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Running</a>
        <a href="../projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Projects</a>
```

- [ ] **Step 4: Verify**

Run: `grep -c "aria-label=\"Home sections\"" projects/index.html` — expect `0`.
Run: `grep -c "aria-label=\"Projects submenu\"" projects/index.html` — expect `1`.
Run: `grep -c "href=\"../running/\"" projects/index.html` — expect `3` (header, off-canvas, footer).

- [ ] **Step 5: Commit**

```bash
git add projects/index.html
git commit -m "feat: update projects page nav for flattened Home and new Running link"
```

---

### Task 8: Update navigation in `clients/index.html`

**Files:**
- Modify: `clients/index.html`

**Interfaces:**
- Consumes: active/inactive nav classes from Task 1.

- [ ] **Step 1: Replace the header nav block**

Find:

```html
      <div class="nav-projects">
        <a href="../" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors flex items-center gap-1">
          Home
          <svg class="nav-projects-chevron" width="10" height="7" viewBox="0 0 10 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="1,1 5,6 9,1"/></svg>
        </a>
        <div class="nav-dropdown" role="menu" aria-label="Home sections">
          <a href="../#about"   class="nav-dropdown-link" role="menuitem">About</a>
          <a href="../#web-dev" class="nav-dropdown-link" role="menuitem">Developer</a>
          <a href="../#analyst" class="nav-dropdown-link" role="menuitem">Analyst</a>
          <a href="../#running" class="nav-dropdown-link" role="menuitem">Runner</a>
        </div>
      </div>
      <div class="nav-projects">
        <a href="../projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors flex items-center gap-1">
          Projects
```

Replace with:

```html
      <a href="../" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors">Home</a>
      <a href="../running/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors">Running</a>
      <div class="nav-projects">
        <a href="../projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors flex items-center gap-1">
          Projects
```

- [ ] **Step 2: Replace the off-canvas nav "Home" list item**

Find:

```html
    <li>
      <a href="../" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Home</a>
      <div class="mobile-sub-nav">
        <a href="../#about">About</a>
        <a href="../#web-dev">Developer</a>
        <a href="../#analyst">Analyst</a>
        <a href="../#running">Runner</a>
      </div>
    </li>
    <li>
      <a href="../projects/" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Projects</a>
```

Replace with:

```html
    <li><a href="../" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Home</a></li>
    <li><a href="../running/" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Running</a></li>
    <li>
      <a href="../projects/" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Projects</a>
```

- [ ] **Step 3: Add "Running" to the footer nav**

Find:

```html
        <a href="../"          class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Home</a>
        <a href="../projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Projects</a>
```

Replace with:

```html
        <a href="../"          class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Home</a>
        <a href="../running/"  class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Running</a>
        <a href="../projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Projects</a>
```

- [ ] **Step 4: Verify**

Run: `grep -c "aria-label=\"Home sections\"" clients/index.html` — expect `0`.
Run: `grep -c "href=\"../running/\"" clients/index.html` — expect `3`.

- [ ] **Step 5: Commit**

```bash
git add clients/index.html
git commit -m "feat: update clients page nav for flattened Home and new Running link"
```

---

### Task 9: Update navigation in `projects/elitehitter/index.html`

**Files:**
- Modify: `projects/elitehitter/index.html`

**Interfaces:**
- Consumes: active/inactive nav classes from Task 1.

- [ ] **Step 1: Replace the header nav block**

Find:

```html
      <div class="nav-projects">
        <a href="../../" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors flex items-center gap-1">
          Home
          <svg class="nav-projects-chevron" width="10" height="7" viewBox="0 0 10 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="1,1 5,6 9,1"/></svg>
        </a>
        <div class="nav-dropdown" role="menu" aria-label="Home sections">
          <a href="../../#about"   class="nav-dropdown-link" role="menuitem">About</a>
          <a href="../../#web-dev" class="nav-dropdown-link" role="menuitem">Developer</a>
          <a href="../../#analyst" class="nav-dropdown-link" role="menuitem">Analyst</a>
          <a href="../../#running" class="nav-dropdown-link" role="menuitem">Runner</a>
        </div>
      </div>
      <div class="nav-projects">
        <a href="../../projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-orange border-b-2 border-orange pb-0.5 flex items-center gap-1">
          Projects
```

Replace with:

```html
      <a href="../../" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors">Home</a>
      <a href="../../running/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors">Running</a>
      <div class="nav-projects">
        <a href="../../projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-orange border-b-2 border-orange pb-0.5 flex items-center gap-1">
          Projects
```

- [ ] **Step 2: Replace the off-canvas nav "Home" list item**

Find:

```html
    <li>
      <a href="../../" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Home</a>
      <div class="mobile-sub-nav">
        <a href="../../#about">About</a>
        <a href="../../#web-dev">Developer</a>
        <a href="../../#analyst">Analyst</a>
        <a href="../../#running">Runner</a>
      </div>
    </li>
    <li>
      <a href="../../projects/" class="font-display text-[2rem] text-orange tracking-wide">Projects</a>
```

Replace with:

```html
    <li><a href="../../" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Home</a></li>
    <li><a href="../../running/" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Running</a></li>
    <li>
      <a href="../../projects/" class="font-display text-[2rem] text-orange tracking-wide">Projects</a>
```

- [ ] **Step 3: Add "Running" to the footer nav**

Find:

```html
        <a href="../../"          class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Home</a>
        <a href="../../projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Projects</a>
```

Replace with:

```html
        <a href="../../"          class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Home</a>
        <a href="../../running/"  class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Running</a>
        <a href="../../projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Projects</a>
```

- [ ] **Step 4: Verify**

Run: `grep -c "aria-label=\"Home sections\"" projects/elitehitter/index.html` — expect `0`.
Run: `grep -c "href=\"../../running/\"" projects/elitehitter/index.html` — expect `3`.

- [ ] **Step 5: Commit**

```bash
git add projects/elitehitter/index.html
git commit -m "feat: update elitehitter page nav for flattened Home and new Running link"
```

---

### Task 10: Update navigation in `projects/running-analysis-app/index.html`

**Files:**
- Modify: `projects/running-analysis-app/index.html`

**Interfaces:**
- Consumes: active/inactive nav classes from Task 1.

- [ ] **Step 1: Replace the header nav block**

Find:

```html
      <div class="nav-projects">
        <a href="../../" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors flex items-center gap-1">
          Home
          <svg class="nav-projects-chevron" width="10" height="7" viewBox="0 0 10 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="1,1 5,6 9,1"/></svg>
        </a>
        <div class="nav-dropdown" role="menu" aria-label="Home sections">
          <a href="../../#about"   class="nav-dropdown-link" role="menuitem">About</a>
          <a href="../../#web-dev" class="nav-dropdown-link" role="menuitem">Developer</a>
          <a href="../../#analyst" class="nav-dropdown-link" role="menuitem">Analyst</a>
          <a href="../../#running" class="nav-dropdown-link" role="menuitem">Runner</a>
        </div>
      </div>
      <div class="nav-projects">
        <a href="../../projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors flex items-center gap-1">
          Projects
```

Replace with:

```html
      <a href="../../" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors">Home</a>
      <a href="../../running/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors">Running</a>
      <div class="nav-projects">
        <a href="../../projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors flex items-center gap-1">
          Projects
```

- [ ] **Step 2: Replace the off-canvas nav "Home" list item**

Find:

```html
    <li>
      <a href="../../" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Home</a>
      <div class="mobile-sub-nav">
        <a href="../../#about">About</a>
        <a href="../../#web-dev">Developer</a>
        <a href="../../#analyst">Analyst</a>
        <a href="../../#running">Runner</a>
      </div>
    </li>
    <li>
      <a href="../../projects/" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Projects</a>
```

Replace with:

```html
    <li><a href="../../" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Home</a></li>
    <li><a href="../../running/" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Running</a></li>
    <li>
      <a href="../../projects/" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Projects</a>
```

- [ ] **Step 3: Add "Running" to the footer nav**

Find:

```html
        <a href="../../"          class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Home</a>
        <a href="../../projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Projects</a>
```

Replace with:

```html
        <a href="../../"          class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Home</a>
        <a href="../../running/"  class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Running</a>
        <a href="../../projects/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Projects</a>
```

- [ ] **Step 4: Verify**

Run: `grep -c "aria-label=\"Home sections\"" projects/running-analysis-app/index.html` — expect `0`.
Run: `grep -c "href=\"../../running/\"" projects/running-analysis-app/index.html` — expect `3`.

- [ ] **Step 5: Commit**

```bash
git add projects/running-analysis-app/index.html
git commit -m "feat: update running-analysis-app page nav for flattened Home and new Running link"
```

---

### Task 11: Cross-site verification

**Files:**
- None modified — this task only verifies the prior 10 tasks.

**Interfaces:**
- Consumes: the finished state of all 6 HTML files touched above.

- [ ] **Step 1: Confirm no page still references the removed section ids or dropdown**

Run from repo root:

```bash
grep -rn "id=\"web-dev\"\|id=\"analyst\"\|href=\"#web-dev\"\|href=\"#analyst\"\|aria-label=\"Home sections\"" index.html projects/index.html projects/elitehitter/index.html projects/running-analysis-app/index.html clients/index.html running/index.html
```

Expected: no output (0 matches across all 6 files).

- [ ] **Step 2: Confirm every page links to `/running/` consistently**

Run:

```bash
grep -c "running/" index.html projects/index.html projects/elitehitter/index.html projects/running-analysis-app/index.html clients/index.html
```

Expected: `3` for each of the 4 sub-pages (header + off-canvas + footer), and `4` for `index.html` (header + off-canvas + footer + the About-section text link added in Task 5).

- [ ] **Step 3: Serve the site locally and spot-check links**

Run:

```bash
python -m http.server 8000
```

(leave running; open a second terminal for the next checks, or run in background and curl against it)

Run:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/running/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/projects/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/clients/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/projects/elitehitter/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/projects/running-analysis-app/
```

Expected: `200` for every line.

- [ ] **Step 4: Manual browser QA against the CLAUDE.md testing checklist**

Using a browser tool (e.g. Playwright or claude-in-chrome) against `http://localhost:8000/`, check:
- Mobile viewport (375px width): open the off-canvas nav, confirm "Home" and "Running" appear as flat links (no chevron/sub-nav) above "Projects" (which still expands), and confirm the new "Pricing" hero button is visible and tappable.
- Dark mode and light mode: toggle the theme switch and confirm the merged `#full-stack` section, rewritten hero, and About section all render correctly in both themes (no unstyled/transparent text).
- Anchor links: click "See My Work" (goes to `/projects/`), "Pricing" (scrolls to `#pricing` on the same page), "Get In Touch" (scrolls to `#contact` on the same page), and the About section's "See the running log" link (goes to `/running/`).
- Hero counters: confirm the "Races Finished", "Marathon PR" (`3:54:23`), and "NYC Marathon Finisher" counters still animate on load (unchanged from before this plan — this is a regression check).
- Contact form: confirm it still submits without a page reload (unchanged from before this plan — this is a regression check).
- On `/running/`: confirm the page loads with its own header/footer, the "Running" nav item is highlighted active, and the Last Race / stat grid / PRs / Abbott Majors content all render correctly.

- [ ] **Step 5: Stop the local server**

Run: `kill %1` (or `Ctrl+C` in the terminal running `http.server`, or find and kill the process by port if run in background).

No commit for this task — it is verification-only. If any check fails, return to the relevant task above, fix, and re-commit there.

---

## Self-Review Notes

- **Spec coverage:** Task 1 covers spec §1 (new running page). Tasks 2–3 cover spec §5 nav changes on `index.html` and §1's homepage-side removal. Task 4 covers spec §3 (hero). Task 5 covers spec §4 (About). Task 6 covers spec §2 (merge). Tasks 7–10 cover spec §5's remaining 4 pages. Task 11 covers the spec's implicit "don't break existing behavior" requirement and the CLAUDE.md testing checklist.
- **Ordering:** Task 1 (create running page) intentionally precedes Task 3 (delete `#running` from `index.html`) so the content exists at its new home before it's removed from the old one — at no point in the sequence is the running content unreachable from every page simultaneously for more than the gap between these two commits, and Task 2 (nav update, adds the `/running/` link) runs between them.
- **Type/class consistency:** the active/inactive nav class strings defined in Task 1's Interfaces block are used verbatim in Tasks 2, 7, 8, 9, 10.
