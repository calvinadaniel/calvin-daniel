# Projects Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `projects/index.html` into a resume-level landing page (hero, skills, work experience, real project cards) and add Statcast Rank to the nav dropdown site-wide.

**Architecture:** Pure HTML edits to 4 existing static files — no new files, no new JavaScript. All new sections follow the existing Tailwind class conventions, dark mode support, and `data-reveal` scroll animation pattern already in place.

**Tech Stack:** HTML, Tailwind CSS (utility classes inlined), vanilla JS already loaded via `../js/main.js` and `../js/projects.js`

---

## File Map

| File | Change |
|---|---|
| `projects/index.html` | Full redesign — replace page header with hero, add skills + experience sections, replace 4 placeholder cards with 3 real cards, remove Tool filter pill |
| `index.html` | Nav dropdown: add Statcast Rank link (desktop + mobile) |
| `clients/index.html` | Nav dropdown: add Statcast Rank link (desktop + mobile) |
| `projects/running-analysis-app/index.html` | Nav dropdown: add Statcast Rank link (desktop + mobile) |

---

### Task 1: Add Statcast Rank to nav dropdown — `index.html` (root)

**Files:**
- Modify: `index.html`

The root `index.html` nav dropdown currently has one sub-link for Running Analysis. Add Statcast Rank below it in both desktop dropdown and mobile sub-nav.

- [ ] **Step 1: Add Statcast Rank to desktop dropdown in `index.html`**

Find this block in the desktop `<nav>`:
```html
<div class="nav-dropdown" role="menu" aria-label="Projects submenu">
  <a href="./projects/running-analysis-app/" class="nav-dropdown-link" role="menuitem">Running Analysis</a>
</div>
```

Replace with:
```html
<div class="nav-dropdown" role="menu" aria-label="Projects submenu">
  <a href="./projects/running-analysis-app/" class="nav-dropdown-link" role="menuitem">Running Analysis</a>
  <a href="https://statcast-rank-app.vercel.app/" class="nav-dropdown-link" role="menuitem" target="_blank" rel="noopener noreferrer">Statcast Rank</a>
</div>
```

- [ ] **Step 2: Add Statcast Rank to mobile sub-nav in `index.html`**

Find this block in the mobile off-canvas nav:
```html
<div class="mobile-sub-nav">
  <a href="./projects/running-analysis-app/">Running Analysis</a>
</div>
```

Replace with:
```html
<div class="mobile-sub-nav">
  <a href="./projects/running-analysis-app/">Running Analysis</a>
  <a href="https://statcast-rank-app.vercel.app/" target="_blank" rel="noopener noreferrer">Statcast Rank</a>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Statcast Rank to nav dropdown on root page"
```

---

### Task 2: Add Statcast Rank to nav dropdown — `clients/index.html`

**Files:**
- Modify: `clients/index.html`

- [ ] **Step 1: Add Statcast Rank to desktop dropdown in `clients/index.html`**

Find:
```html
<div class="nav-dropdown" role="menu" aria-label="Projects submenu">
  <a href="../projects/running-analysis-app/" class="nav-dropdown-link" role="menuitem">Running Analysis</a>
</div>
```

Replace with:
```html
<div class="nav-dropdown" role="menu" aria-label="Projects submenu">
  <a href="../projects/running-analysis-app/" class="nav-dropdown-link" role="menuitem">Running Analysis</a>
  <a href="https://statcast-rank-app.vercel.app/" class="nav-dropdown-link" role="menuitem" target="_blank" rel="noopener noreferrer">Statcast Rank</a>
</div>
```

- [ ] **Step 2: Add Statcast Rank to mobile sub-nav in `clients/index.html`**

Find:
```html
<div class="mobile-sub-nav">
  <a href="../projects/running-analysis-app/">Running Analysis</a>
</div>
```

Replace with:
```html
<div class="mobile-sub-nav">
  <a href="../projects/running-analysis-app/">Running Analysis</a>
  <a href="https://statcast-rank-app.vercel.app/" target="_blank" rel="noopener noreferrer">Statcast Rank</a>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add clients/index.html
git commit -m "feat: add Statcast Rank to nav dropdown on clients page"
```

---

### Task 3: Add Statcast Rank to nav dropdown — `projects/running-analysis-app/index.html`

**Files:**
- Modify: `projects/running-analysis-app/index.html`

Note: paths in this file use `../../` to reach root-level assets.

- [ ] **Step 1: Add Statcast Rank to desktop dropdown**

Find:
```html
<div class="nav-dropdown" role="menu" aria-label="Projects submenu">
  <a href="../../projects/running-analysis-app/" class="nav-dropdown-link" role="menuitem">Running Analysis</a>
</div>
```

Replace with:
```html
<div class="nav-dropdown" role="menu" aria-label="Projects submenu">
  <a href="../../projects/running-analysis-app/" class="nav-dropdown-link" role="menuitem">Running Analysis</a>
  <a href="https://statcast-rank-app.vercel.app/" class="nav-dropdown-link" role="menuitem" target="_blank" rel="noopener noreferrer">Statcast Rank</a>
</div>
```

> **Note:** If the running-analysis-app page uses `./` (self-referencing) instead of `../../projects/running-analysis-app/` for the Running Analysis link, match whatever the existing href is — only add the Statcast Rank line below it.

- [ ] **Step 2: Add Statcast Rank to mobile sub-nav**

Find:
```html
<div class="mobile-sub-nav">
  <a href="../../projects/running-analysis-app/">Running Analysis</a>
</div>
```

Replace with:
```html
<div class="mobile-sub-nav">
  <a href="../../projects/running-analysis-app/">Running Analysis</a>
  <a href="https://statcast-rank-app.vercel.app/" target="_blank" rel="noopener noreferrer">Statcast Rank</a>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add projects/running-analysis-app/index.html
git commit -m "feat: add Statcast Rank to nav dropdown on running analysis page"
```

---

### Task 4: Profile Hero — `projects/index.html`

**Files:**
- Modify: `projects/index.html`

Replace the current plain page header section with a full profile hero.

- [ ] **Step 1: Replace the page header section**

Find and replace this entire section:
```html
  <!-- Page header -->
  <section class="bg-warm-bg dark:bg-navy-bg pt-[100px] pb-14 border-b border-navy-bg/10 dark:border-offwhite/10">
    <div class="w-[90%] max-w-[1240px] mx-auto">
      <div data-reveal>
        <a href="../" class="inline-flex items-center gap-1 font-mono text-[0.65rem] tracking-[0.15em] uppercase text-navy-bg/45 dark:text-offwhite/45 hover:text-orange transition-colors mb-6">← Home</a>
        <h1 class="font-display text-[clamp(3rem,8vw,6rem)] leading-none text-navy-bg dark:text-offwhite">Projects</h1>
        <p class="font-body text-[1.05rem] text-navy-bg/60 dark:text-offwhite/60 mt-3">Personal builds, experiments, and tools</p>
      </div>
    </div>
  </section>
```

With:
```html
  <!-- Profile Hero -->
  <section class="bg-warm-bg dark:bg-navy-bg pt-[100px] pb-16 border-b border-navy-bg/10 dark:border-offwhite/10">
    <div class="w-[90%] max-w-[1240px] mx-auto">
      <div data-reveal>
        <a href="../" class="inline-flex items-center gap-1 font-mono text-[0.65rem] tracking-[0.15em] uppercase text-navy-bg/45 dark:text-offwhite/45 hover:text-orange transition-colors mb-6">← Home</a>
        <h1 class="font-display text-[clamp(3rem,8vw,6rem)] leading-none text-navy-bg dark:text-offwhite mb-3">Calvin Daniel</h1>
        <p class="font-mono text-[0.8rem] tracking-[0.12em] uppercase text-orange/80 mb-5">Production Operations · Data Analysis · Web Development</p>
        <p class="font-body text-[1.05rem] text-navy-bg/60 dark:text-offwhite/60 max-w-[640px] mb-8">Operations professional with 17+ years at John Wiley &amp; Sons. Experienced in cross-functional process improvement, Power BI dashboards, financial analysis, and web development.</p>
        <div class="flex gap-4 flex-wrap">
          <a href="https://github.com/calvinadaniel/" target="_blank" rel="noopener noreferrer" class="font-mono text-[0.7rem] tracking-[0.1em] uppercase px-5 py-[0.5rem] border border-orange text-orange rounded-sm hover:bg-orange hover:text-offwhite transition-all">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/calvin-daniel-6229054/" target="_blank" rel="noopener noreferrer" class="font-mono text-[0.7rem] tracking-[0.1em] uppercase px-5 py-[0.5rem] border border-navy-bg/30 dark:border-offwhite/30 text-navy-bg/70 dark:text-offwhite/70 rounded-sm hover:border-orange hover:text-orange transition-all">LinkedIn ↗</a>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Commit**

```bash
git add projects/index.html
git commit -m "feat: replace projects page header with profile hero"
```

---

### Task 5: Skills Section — `projects/index.html`

**Files:**
- Modify: `projects/index.html`

Add the Core Competencies section immediately after the profile hero section and before the `<div class="w-[90%] max-w-[1240px] mx-auto py-16">` project grid wrapper.

- [ ] **Step 1: Insert skills section**

Find the line:
```html
  <div class="w-[90%] max-w-[1240px] mx-auto py-16">
```

Insert this block immediately before it:
```html
  <!-- Skills -->
  <section class="bg-warm-section dark:bg-navy-dark/50 border-b border-navy-bg/10 dark:border-offwhite/10 py-14">
    <div class="w-[90%] max-w-[1240px] mx-auto">
      <div data-reveal>
        <h2 class="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-navy-bg/45 dark:text-offwhite/45 mb-6">Core Competencies</h2>
        <div class="flex flex-wrap gap-3 mb-4">
          <span class="font-mono text-[0.65rem] tracking-widest uppercase px-3 py-1.5 bg-orange/10 text-orange border border-orange/20 rounded-sm">Web Development</span>
          <span class="font-mono text-[0.65rem] tracking-widest uppercase px-3 py-1.5 bg-orange/10 text-orange border border-orange/20 rounded-sm">Content Strategy</span>
          <span class="font-mono text-[0.65rem] tracking-widest uppercase px-3 py-1.5 bg-orange/10 text-orange border border-orange/20 rounded-sm">Data Reporting</span>
          <span class="font-mono text-[0.65rem] tracking-widest uppercase px-3 py-1.5 bg-orange/10 text-orange border border-orange/20 rounded-sm">CMS Integration</span>
        </div>
        <div class="flex flex-wrap gap-3">
          <span class="font-mono text-[0.65rem] tracking-widest uppercase px-3 py-1.5 bg-navy-bg/5 dark:bg-offwhite/5 text-navy-bg/70 dark:text-offwhite/70 border border-navy-bg/15 dark:border-offwhite/15 rounded-sm">HTML/CSS</span>
          <span class="font-mono text-[0.65rem] tracking-widest uppercase px-3 py-1.5 bg-navy-bg/5 dark:bg-offwhite/5 text-navy-bg/70 dark:text-offwhite/70 border border-navy-bg/15 dark:border-offwhite/15 rounded-sm">JavaScript</span>
          <span class="font-mono text-[0.65rem] tracking-widest uppercase px-3 py-1.5 bg-navy-bg/5 dark:bg-offwhite/5 text-navy-bg/70 dark:text-offwhite/70 border border-navy-bg/15 dark:border-offwhite/15 rounded-sm">Python</span>
          <span class="font-mono text-[0.65rem] tracking-widest uppercase px-3 py-1.5 bg-navy-bg/5 dark:bg-offwhite/5 text-navy-bg/70 dark:text-offwhite/70 border border-navy-bg/15 dark:border-offwhite/15 rounded-sm">SQL</span>
          <span class="font-mono text-[0.65rem] tracking-widest uppercase px-3 py-1.5 bg-navy-bg/5 dark:bg-offwhite/5 text-navy-bg/70 dark:text-offwhite/70 border border-navy-bg/15 dark:border-offwhite/15 rounded-sm">Power BI</span>
          <span class="font-mono text-[0.65rem] tracking-widest uppercase px-3 py-1.5 bg-navy-bg/5 dark:bg-offwhite/5 text-navy-bg/70 dark:text-offwhite/70 border border-navy-bg/15 dark:border-offwhite/15 rounded-sm">BigQuery</span>
          <span class="font-mono text-[0.65rem] tracking-widest uppercase px-3 py-1.5 bg-navy-bg/5 dark:bg-offwhite/5 text-navy-bg/70 dark:text-offwhite/70 border border-navy-bg/15 dark:border-offwhite/15 rounded-sm">DAX</span>
          <span class="font-mono text-[0.65rem] tracking-widest uppercase px-3 py-1.5 bg-navy-bg/5 dark:bg-offwhite/5 text-navy-bg/70 dark:text-offwhite/70 border border-navy-bg/15 dark:border-offwhite/15 rounded-sm">Excel</span>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Commit**

```bash
git add projects/index.html
git commit -m "feat: add core competencies skills section to projects page"
```

---

### Task 6: Work Experience Section — `projects/index.html`

**Files:**
- Modify: `projects/index.html`

Add the experience timeline section immediately after the skills section and before the project grid wrapper.

- [ ] **Step 1: Insert experience section**

Find the line (same anchor as Task 5 — now it follows the skills section):
```html
  <div class="w-[90%] max-w-[1240px] mx-auto py-16">
```

Insert this block immediately before it:
```html
  <!-- Work Experience -->
  <section class="bg-warm-bg dark:bg-navy-bg border-b border-navy-bg/10 dark:border-offwhite/10 py-16">
    <div class="w-[90%] max-w-[1240px] mx-auto">
      <div data-reveal>
        <h2 class="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-navy-bg/45 dark:text-offwhite/45 mb-10">Experience</h2>
        <div class="relative border-l-2 border-orange/20 pl-8 flex flex-col gap-10">

          <div data-reveal class="relative">
            <span class="absolute -left-[2.6rem] top-1 w-3 h-3 rounded-full bg-orange/40 border-2 border-orange/20"></span>
            <p class="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-orange/80 mb-1">Feb 2020 – Present</p>
            <h3 class="font-display text-[1.15rem] text-navy-bg dark:text-offwhite tracking-wide">Commercial Operations Senior Specialist</h3>
            <p class="text-navy-bg/50 dark:text-offwhite/50 text-[0.85rem] mb-3">John Wiley &amp; Sons · Remote</p>
            <ul class="list-none flex flex-col gap-1.5">
              <li class="text-navy-bg/70 dark:text-offwhite/70 text-[0.9rem] leading-[1.65] pl-3 border-l border-navy-bg/15 dark:border-offwhite/15">Built a Power BI dashboard consolidating 15 data sources into a unified operational reporting platform for executive leadership.</li>
              <li class="text-navy-bg/70 dark:text-offwhite/70 text-[0.9rem] leading-[1.65] pl-3 border-l border-navy-bg/15 dark:border-offwhite/15">Lead cross-functional process improvement initiatives, conducting financial and variance analysis supporting executive-level planning.</li>
            </ul>
          </div>

          <div data-reveal class="relative">
            <span class="absolute -left-[2.6rem] top-1 w-3 h-3 rounded-full bg-orange/40 border-2 border-orange/20"></span>
            <p class="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-orange/80 mb-1">Jun 2018 – Feb 2020</p>
            <h3 class="font-display text-[1.15rem] text-navy-bg dark:text-offwhite tracking-wide">Associate Product Manager</h3>
            <p class="text-navy-bg/50 dark:text-offwhite/50 text-[0.85rem] mb-3">John Wiley &amp; Sons · Hoboken, NJ</p>
            <ul class="list-none flex flex-col gap-1.5">
              <li class="text-navy-bg/70 dark:text-offwhite/70 text-[0.9rem] leading-[1.65] pl-3 border-l border-navy-bg/15 dark:border-offwhite/15">Owned product roadmap for WileyPLUS, coordinating simultaneous workstreams across design, engineering, and marketing.</li>
            </ul>
          </div>

          <div data-reveal class="relative">
            <span class="absolute -left-[2.6rem] top-1 w-3 h-3 rounded-full bg-orange/40 border-2 border-orange/20"></span>
            <p class="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-orange/80 mb-1">Oct 2014 – Jun 2018</p>
            <h3 class="font-display text-[1.15rem] text-navy-bg dark:text-offwhite tracking-wide">Web Specialist / Technical Lead &amp; Prototyper</h3>
            <p class="text-navy-bg/50 dark:text-offwhite/50 text-[0.85rem] mb-3">John Wiley &amp; Sons · Hoboken, NJ</p>
            <ul class="list-none flex flex-col gap-1.5">
              <li class="text-navy-bg/70 dark:text-offwhite/70 text-[0.9rem] leading-[1.65] pl-3 border-l border-navy-bg/15 dark:border-offwhite/15">Served as technical project lead for digital product initiatives, establishing code governance and QA frameworks.</li>
            </ul>
          </div>

          <div data-reveal class="relative">
            <span class="absolute -left-[2.6rem] top-1 w-3 h-3 rounded-full bg-orange/40 border-2 border-orange/20"></span>
            <p class="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-orange/80 mb-1">May 2008 – Oct 2014</p>
            <h3 class="font-display text-[1.15rem] text-navy-bg dark:text-offwhite tracking-wide">Digital Delivery Consultant</h3>
            <p class="text-navy-bg/50 dark:text-offwhite/50 text-[0.85rem] mb-3">John Wiley &amp; Sons · Hoboken, NJ</p>
            <ul class="list-none flex flex-col gap-1.5">
              <li class="text-navy-bg/70 dark:text-offwhite/70 text-[0.9rem] leading-[1.65] pl-3 border-l border-navy-bg/15 dark:border-offwhite/15">Supported deployment and integration of learning management systems across global education product lines.</li>
            </ul>
          </div>

          <div data-reveal class="relative">
            <span class="absolute -left-[2.6rem] top-1 w-3 h-3 rounded-full bg-orange/40 border-2 border-orange/20"></span>
            <p class="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-orange/80 mb-1">Sep 2014 – Present</p>
            <h3 class="font-display text-[1.15rem] text-navy-bg dark:text-offwhite tracking-wide">Freelance Web Developer</h3>
            <p class="text-navy-bg/50 dark:text-offwhite/50 text-[0.85rem] mb-3">Self-Employed · Remote</p>
            <ul class="list-none flex flex-col gap-1.5">
              <li class="text-navy-bg/70 dark:text-offwhite/70 text-[0.9rem] leading-[1.65] pl-3 border-l border-navy-bg/15 dark:border-offwhite/15">Manage end-to-end client project delivery — requirements, design, development, and post-launch support.</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Commit**

```bash
git add projects/index.html
git commit -m "feat: add work experience timeline to projects page"
```

---

### Task 7: Real Project Cards — `projects/index.html`

**Files:**
- Modify: `projects/index.html`

Replace the entire `<div class="w-[90%] max-w-[1240px] mx-auto py-16">` block (which contains filter pills and the 4 placeholder cards) with 3 real project cards. Remove the "Tool" filter pill.

- [ ] **Step 1: Replace project grid block**

Find and replace the entire block from:
```html
  <div class="w-[90%] max-w-[1240px] mx-auto py-16">
```
through the closing `</div>` that ends the grid wrapper (just before `</main>`).

Replace with:
```html
  <!-- Projects -->
  <div class="w-[90%] max-w-[1240px] mx-auto py-16">
    <div data-reveal class="mb-10">
      <h2 class="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-navy-bg/45 dark:text-offwhite/45 mb-6">Projects</h2>
      <div class="flex flex-wrap gap-3">
        <button data-filter="All"              data-active="true"  class="font-mono text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 rounded-sm border transition-all duration-200 border-navy-bg/20 dark:border-offwhite/20 text-navy-bg/60 dark:text-offwhite/60 hover:border-orange/50 hover:text-orange">All</button>
        <button data-filter="Web Dev"          data-active="false" class="font-mono text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 rounded-sm border transition-all duration-200 border-navy-bg/20 dark:border-offwhite/20 text-navy-bg/60 dark:text-offwhite/60 hover:border-orange/50 hover:text-orange">Web Dev</button>
        <button data-filter="Data / Analytics" data-active="false" class="font-mono text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 rounded-sm border transition-all duration-200 border-navy-bg/20 dark:border-offwhite/20 text-navy-bg/60 dark:text-offwhite/60 hover:border-orange/50 hover:text-orange">Data / Analytics</button>
      </div>
    </div>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

      <div data-reveal>
        <article data-category="Web Dev" class="group flex flex-col bg-warm-section dark:bg-navy-dark/50 border border-navy-bg/10 dark:border-offwhite/10 rounded-sm overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300">
          <div class="overflow-hidden aspect-video flex-shrink-0"><img src="https://images.unsplash.com/photo-1508344928928-7165b67de128?w=800&auto=format&fit=crop&q=80" alt="Statcast Rank App" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" /></div>
          <div class="flex flex-col flex-1 p-6">
            <h3 class="font-display text-[1.3rem] text-navy-bg dark:text-offwhite tracking-wide mb-2">Statcast Rank App</h3>
            <p class="text-navy-bg/60 dark:text-offwhite/60 text-[0.9rem] leading-[1.7] mb-4 flex-1">MLB batter leaderboard ranking players by HardContact+ (Hard Hit% − Whiff%). Built with React, Tailwind, and the Baseball Savant Statcast API.</p>
            <div class="flex flex-wrap gap-2 mb-5"><span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">React</span><span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Tailwind</span><span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Node.js</span><span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Baseball Savant</span></div>
            <div class="flex gap-3"><a href="https://statcast-rank-app.vercel.app/" target="_blank" rel="noopener noreferrer" class="flex-1 text-center font-mono text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 bg-orange text-offwhite hover:bg-orange-dim transition-colors rounded-sm">View Live</a><a href="https://github.com/calvinadaniel/" target="_blank" rel="noopener noreferrer" class="flex-1 text-center font-mono text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 border border-navy-bg/20 dark:border-offwhite/20 text-navy-bg/70 dark:text-offwhite/70 hover:border-orange hover:text-orange transition-colors rounded-sm">View Code</a></div>
          </div>
        </article>
      </div>

      <div data-reveal>
        <article data-category="Data / Analytics" class="group flex flex-col bg-warm-section dark:bg-navy-dark/50 border border-navy-bg/10 dark:border-offwhite/10 rounded-sm overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300">
          <div class="overflow-hidden aspect-video flex-shrink-0"><img src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80" alt="Running Analysis App" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" /></div>
          <div class="flex flex-col flex-1 p-6">
            <h3 class="font-display text-[1.3rem] text-navy-bg dark:text-offwhite tracking-wide mb-2">Running Analysis App</h3>
            <p class="text-navy-bg/60 dark:text-offwhite/60 text-[0.9rem] leading-[1.7] mb-4 flex-1">Personal Strava running dashboard with weekly mileage charts and Boston Marathon qualifying time projection.</p>
            <div class="flex flex-wrap gap-2 mb-5"><span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Python</span><span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Chart.js</span><span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Strava API</span></div>
            <div class="flex gap-3"><a href="../projects/running-analysis-app/" class="flex-1 text-center font-mono text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 bg-orange text-offwhite hover:bg-orange-dim transition-colors rounded-sm">View Live</a><a href="https://github.com/calvinadaniel/" target="_blank" rel="noopener noreferrer" class="flex-1 text-center font-mono text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 border border-navy-bg/20 dark:border-offwhite/20 text-navy-bg/70 dark:text-offwhite/70 hover:border-orange hover:text-orange transition-colors rounded-sm">View Code</a></div>
          </div>
        </article>
      </div>

      <div data-reveal>
        <article data-category="Web Dev" class="group flex flex-col bg-warm-section dark:bg-navy-dark/50 border border-navy-bg/10 dark:border-offwhite/10 rounded-sm overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300">
          <div class="overflow-hidden aspect-video flex-shrink-0"><img src="https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&auto=format&fit=crop&q=80" alt="Portfolio Website" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" /></div>
          <div class="flex flex-col flex-1 p-6">
            <h3 class="font-display text-[1.3rem] text-navy-bg dark:text-offwhite tracking-wide mb-2">Portfolio Website</h3>
            <p class="text-navy-bg/60 dark:text-offwhite/60 text-[0.9rem] leading-[1.7] mb-4 flex-1">Personal portfolio built with HTML, CSS, and vanilla JS. Features dark/light mode, particle canvas, and scroll animations.</p>
            <div class="flex flex-wrap gap-2 mb-5"><span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">HTML</span><span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">CSS</span><span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">JavaScript</span></div>
            <div class="flex gap-3"><a href="../" class="flex-1 text-center font-mono text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 bg-orange text-offwhite hover:bg-orange-dim transition-colors rounded-sm">View Live</a><a href="https://github.com/calvinadaniel/" target="_blank" rel="noopener noreferrer" class="flex-1 text-center font-mono text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 border border-navy-bg/20 dark:border-offwhite/20 text-navy-bg/70 dark:text-offwhite/70 hover:border-orange hover:text-orange transition-colors rounded-sm">View Code</a></div>
          </div>
        </article>
      </div>

    </div>
  </div>
```

- [ ] **Step 2: Commit**

```bash
git add projects/index.html
git commit -m "feat: replace placeholder cards with real project cards, add Projects section label"
```

---

## Self-Review

**Spec coverage:**
- ✅ Profile Hero (Task 4) — name, subtitle, summary, GitHub + LinkedIn buttons
- ✅ Skills section (Task 5) — Core Competencies label, two rows of pills
- ✅ Work Experience timeline (Task 6) — 5 entries with dates, bullets, left border treatment
- ✅ 3 real project cards (Task 7) — Statcast Rank, Running Analysis, Portfolio; placeholder cards removed; Tool pill removed
- ✅ Nav dropdown Statcast Rank (Tasks 1–3) — all 4 pages covered

**Placeholder scan:** No TBDs, TODOs, or vague instructions. All HTML is complete and explicit.

**Type consistency:** No shared types or function signatures — pure HTML changes. Class names are consistent with the existing codebase throughout.
