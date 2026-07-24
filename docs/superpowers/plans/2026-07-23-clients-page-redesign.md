# Clients Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 5-card feature grid on `/clients/` with 5 case-studies-style alternating narrative sections framed around each client's need, approach, and result, plus a matching bottom CTA block.

**Architecture:** Single static HTML file edit (`clients/index.html`), no build step, no JS changes. One new screenshot asset captured via Playwright for the one client (MLJ Signature Contracting) that doesn't already have one. Structure and Tailwind utility classes are copied verbatim from the existing pattern in `projects/index.html` so the two pages read as one system.

**Tech Stack:** Static HTML + pre-compiled Tailwind (`css/styles.css`), no npm/build tooling in this repo.

## Global Constraints

- Off-canvas nav, hamburger animation, and dark/light toggle mechanism (`[data-theme]`... actually this site uses `.dark` class on `<html>` via `localStorage.getItem('theme')`) must not be touched.
- No inline styles except where already present in the codebase (client card images use `style="background:#001A4D;"` — not touched by this plan since card images are being removed).
- No new dependencies, no third-party JS libraries.
- Images: WebP preferred where possible, but existing client screenshots are `.png`/`.jpg` — match sibling files, don't convert (no conversion tooling in repo; converting would be new tooling for no requested benefit).
- Every `<img>` must have `width`/`height` attributes to prevent CLS.
- Primary email / brand rules unaffected by this plan (no email shown on this page).
- Before any commit: test on mobile (375px), test dark and light mode, validate anchor links resolve, per CLAUDE.md's testing checklist.

---

### Task 1: Capture the missing MLJ Signature Contracting screenshot

**Files:**
- Create: `images/client-mlj-signature-screenshot.png`

**Interfaces:**
- Produces: `images/client-mlj-signature-screenshot.png`, a 1920×953 PNG, consumed by Task 2's `<img>` tag for the MLJ section.

- [ ] **Step 1: Resize the browser to match the other client screenshots**

Call the Playwright MCP tool:

```
mcp__plugin_playwright_playwright__browser_resize
  width: 1920
  height: 953
```

- [ ] **Step 2: Navigate to the live MLJ site**

```
mcp__plugin_playwright_playwright__browser_navigate
  url: "https://mljsignature.com/"
```

- [ ] **Step 3: Take a viewport screenshot (not full-page, to match the other 4 client screenshots which are all viewport captures, not scrolling captures)**

```
mcp__plugin_playwright_playwright__browser_take_screenshot
  filename: "client-mlj-signature-screenshot.png"
  type: "png"
  scale: "css"
  fullPage: false
```

The tool result will report the absolute path the screenshot was saved to (inside the session's output directory, not the project).

- [ ] **Step 4: Copy the screenshot into the project's images folder**

Replace `<TOOL_OUTPUT_PATH>` with the exact path reported in Step 3's result:

```bash
cp "<TOOL_OUTPUT_PATH>" "images/client-mlj-signature-screenshot.png"
```

- [ ] **Step 5: Verify the file landed with the right dimensions**

```bash
file images/client-mlj-signature-screenshot.png
```

Expected output contains: `PNG image data, 1920 x 953`

- [ ] **Step 6: Commit**

```bash
git add images/client-mlj-signature-screenshot.png
git commit -m "Add MLJ Signature Contracting screenshot for clients page redesign"
```

---

### Task 2: Rewrite clients/index.html — meta, header, narrative sections, bottom CTA

**Files:**
- Modify: `clients/index.html:7,12,19` (meta descriptions)
- Modify: `clients/index.html:80` (page subhead)
- Modify: `clients/index.html:85-210` (replace card grid with 5 sections + CTA)

**Interfaces:**
- Consumes: `images/client-mlj-signature-screenshot.png` from Task 1 (must exist before this task's Step 5 runs); existing images `images/gurvis-miner-screenshot.png`, `images/place-an-order-bachata-bakery-screenshot.png`, `images/raquel-ariana-homepage-screenshot.png`, `images/client-gregory-duane.png`.
- Produces: the finished `clients/index.html` page. No other file depends on this one.

- [ ] **Step 1: Update the three meta description tags**

In `clients/index.html`, the exact string `Client work and case studies by Calvin Daniel — web development projects delivered for small businesses and entrepreneurs.` appears identically three times (in `<meta name="description">`, `<meta property="og:description">`, `<meta name="twitter:description">`). Replace all three occurrences:

- Old: `Client work and case studies by Calvin Daniel — web development projects delivered for small businesses and entrepreneurs.`
- New: `Real problems solved for real clients — credibility rebuilds, demand-control systems, and booking flows built for small businesses and solo practitioners.`

Use `replace_all: true` since the string is identical in all three places.

- [ ] **Step 2: Update the page subhead**

- Old:
```html
        <p class="font-body text-[1.05rem] text-navy-bg/60 dark:text-offwhite/60 mt-3">Websites and digital products built for real clients</p>
```
- New:
```html
        <p class="font-body text-[1.05rem] text-navy-bg/60 dark:text-offwhite/60 mt-3">The need behind each build, and what it took to solve it.</p>
```

- [ ] **Step 3: Replace the entire card grid block with the 5 narrative sections + bottom CTA**

Old (everything from the `<!-- Client grid -->` comment through the grid's closing `</div></div>`, currently lines 85-210):

```html
  <!-- Client grid -->
  <div class="w-[90%] max-w-[1240px] mx-auto py-16">
    <div class="grid gap-6 md:grid-cols-2">

      <!-- Card 1: Gurvis Miner -->
      <div data-reveal class="h-full">
        <article aria-label="Gurvis Miner Dispute Resolution"
          class="h-full group flex flex-col bg-warm-section dark:bg-navy-dark/50 border border-navy-bg/10 dark:border-offwhite/10 rounded-sm overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300">
          <div class="flex items-center justify-center h-52 flex-shrink-0 overflow-hidden p-10" style="background:#001A4D;">
            <img src="../images/logo-miner-dispute.png" alt="Gurvis Miner Dispute Resolution logo"
              class="max-h-full max-w-full object-contain" loading="eager" />
          </div>
          <div class="flex flex-col flex-1 p-6">
            <span class="font-mono text-[0.6rem] tracking-widest uppercase px-3 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm inline-block w-fit mb-3">Legal / Mediation</span>
            <h3 class="font-display text-[1.3rem] text-navy-bg dark:text-offwhite tracking-wide mb-2">Gurvis Miner Dispute Resolution</h3>
            <p class="text-navy-bg/60 dark:text-offwhite/60 text-[0.9rem] leading-[1.7] mb-4 flex-1">A polished, credibility-first web presence that lets an independent mediator compete for cases against established firms. Built on WordPress with a custom client-intake form, mobile-first responsive design, and optimized load times &mdash; giving a solo practitioner the same digital authority as a full firm, without the overhead of one.</p>
            <div class="flex flex-wrap gap-2 mb-5">
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">WordPress</span>
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Custom CSS</span>
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Contact Form</span>
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">SEO</span>
            </div>
            <a href="https://minerdisputeresolution.com/" target="_blank" rel="noopener noreferrer"
              class="text-center font-mono text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 bg-orange text-offwhite hover:bg-orange-dim transition-colors rounded-sm">Visit Site</a>
          </div>
        </article>
      </div>

      <!-- Card 2: Bachata Bakery -->
      <div data-reveal class="h-full">
        <article aria-label="Bachata Bakery"
          class="h-full group flex flex-col bg-warm-section dark:bg-navy-dark/50 border border-navy-bg/10 dark:border-offwhite/10 rounded-sm overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300">
          <div class="flex items-center justify-center h-52 flex-shrink-0 overflow-hidden p-10" style="background:#001A4D;">
            <img src="../images/logo-bachata-bakery.png" alt="Bachata Bakery logo"
              class="max-h-full max-w-full object-contain" style="filter:invert(1);" loading="lazy" />
          </div>
          <div class="flex flex-col flex-1 p-6">
            <span class="font-mono text-[0.6rem] tracking-widest uppercase px-3 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm inline-block w-fit mb-3">Food &amp; Beverage</span>
            <h3 class="font-display text-[1.3rem] text-navy-bg dark:text-offwhite tracking-wide mb-2">Bachata Bakery</h3>
            <p class="text-navy-bg/60 dark:text-offwhite/60 text-[0.9rem] leading-[1.7] mb-4 flex-1">A fully custom-coded storefront that lets a bakery control demand instead of chasing it &mdash; a presale window activates and deactivates ordering on a schedule, so the kitchen never gets buried. Dynamic order forms, deep SEO optimization, and fast, mobile-first load times keep customers moving smoothly from first visit to checkout, no templates or shortcuts involved.</p>
            <div class="flex flex-wrap gap-2 mb-5">
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Custom Code</span>
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">JavaScript</span>
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Order Forms</span>
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">SEO</span>
            </div>
            <a href="https://bachatabakery.com/" target="_blank" rel="noopener noreferrer"
              class="text-center font-mono text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 bg-orange text-offwhite hover:bg-orange-dim transition-colors rounded-sm">Visit Site</a>
          </div>
        </article>
      </div>

      <!-- Card 3: Raquel Ariana -->
      <div data-reveal class="h-full">
        <article aria-label="Raquel Ariana"
          class="h-full group flex flex-col bg-warm-section dark:bg-navy-dark/50 border border-navy-bg/10 dark:border-offwhite/10 rounded-sm overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300">
          <div class="flex items-center justify-center h-52 flex-shrink-0 overflow-hidden p-10" style="background:#001A4D;">
            <img src="../images/logo-raquel-ariana.png" alt="Raquel Ariana logo"
              class="max-h-full max-w-full object-contain" loading="lazy" />
          </div>
          <div class="flex flex-col flex-1 p-6">
            <span class="font-mono text-[0.6rem] tracking-widest uppercase px-3 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm inline-block w-fit mb-3">Beauty / Makeup Artist</span>
            <h3 class="font-display text-[1.3rem] text-navy-bg dark:text-offwhite tracking-wide mb-2">Raquel Ariana</h3>
            <p class="text-navy-bg/60 dark:text-offwhite/60 text-[0.9rem] leading-[1.7] mb-4 flex-1">A single-page freelance site built to turn phone-browsing visitors into booked appointments for a makeup artist serving DE, PA, NJ, and MD. Services and pricing sit in a clean, scrollable layout with integrated booking inquiry forms, backed by a customized visual identity that reflects the brand and builds trust before the first message is sent.</p>
            <div class="flex flex-wrap gap-2 mb-5">
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Custom Code</span>
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">CSS</span>
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Contact Form</span>
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Mobile-First</span>
            </div>
            <a href="https://raquelariana.com/" target="_blank" rel="noopener noreferrer"
              class="text-center font-mono text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 bg-orange text-offwhite hover:bg-orange-dim transition-colors rounded-sm">Visit Site</a>
          </div>
        </article>
      </div>

      <!-- Card 4: Gregory Duane -->
      <div data-reveal class="h-full">
        <article aria-label="Gregory Duane"
          class="h-full group flex flex-col bg-warm-section dark:bg-navy-dark/50 border border-navy-bg/10 dark:border-offwhite/10 rounded-sm overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300">
          <div class="flex items-center justify-center h-52 flex-shrink-0 overflow-hidden p-10" style="background:#001A4D;">
            <img src="../images/logo-gregory-duane.png" alt="Gregory Duane logo"
              class="max-h-full max-w-full object-contain" loading="lazy" />
          </div>
          <div class="flex flex-col flex-1 p-6">
            <span class="font-mono text-[0.6rem] tracking-widest uppercase px-3 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm inline-block w-fit mb-3">Fashion / Bridal</span>
            <h3 class="font-display text-[1.3rem] text-navy-bg dark:text-offwhite tracking-wide mb-2">Gregory Duane</h3>
            <p class="text-navy-bg/60 dark:text-offwhite/60 text-[0.9rem] leading-[1.7] mb-4 flex-1">A full custom design overhaul that gives a custom suit and bridal boutique an elevated identity to match the premium quality of their handcrafted garments. Squarespace's commerce platform powers secure online sales and checkout alongside tailored fittings and arranged in-person consultations, letting the boutique sell online without diluting its bespoke, made-to-measure feel.</p>
            <div class="flex flex-wrap gap-2 mb-5">
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Squarespace</span>
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Custom CSS</span>
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">E-Commerce</span>
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Appointments</span>
            </div>
            <a href="https://gregoryduane.com" target="_blank" rel="noopener noreferrer"
              class="text-center font-mono text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 bg-orange text-offwhite hover:bg-orange-dim transition-colors rounded-sm">Visit Site</a>
          </div>
        </article>
      </div>

      <!-- Card 5: MLJ Signature Contracting -->
      <div data-reveal class="h-full">
        <article aria-label="MLJ Signature Contracting"
          class="h-full group flex flex-col bg-warm-section dark:bg-navy-dark/50 border border-navy-bg/10 dark:border-offwhite/10 rounded-sm overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300">
          <div class="flex items-center justify-center h-52 flex-shrink-0 overflow-hidden p-10" style="background:#001A4D;">
            <img src="../images/logo-mlj-signature.png" alt="MLJ Signature Contracting logo"
              class="max-h-full max-w-full object-contain" style="filter:invert(1);" loading="lazy" />
          </div>
          <div class="flex flex-col flex-1 p-6">
            <span class="font-mono text-[0.6rem] tracking-widest uppercase px-3 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm inline-block w-fit mb-3">Construction / Contracting</span>
            <h3 class="font-display text-[1.3rem] text-navy-bg dark:text-offwhite tracking-wide mb-2">MLJ Signature Contracting</h3>
            <p class="text-navy-bg/60 dark:text-offwhite/60 text-[0.9rem] leading-[1.7] mb-4 flex-1">A WordPress site that builds trust before the first call &mdash; licensing and EPA lead-safe certification details across three jurisdictions sit alongside six core service lines, from kitchen and bath renovations to custom millwork. A service-aware project inquiry form routes leads straight to the right team member, cutting out the back-and-forth of figuring out who handles what.</p>
            <div class="flex flex-wrap gap-2 mb-5">
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Custom Code</span>
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">CSS</span>
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Contact Form</span>
              <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Mobile-First</span>
            </div>
            <a href="https://mljsignature.com/" target="_blank" rel="noopener noreferrer"
              class="text-center font-mono text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 bg-orange text-offwhite hover:bg-orange-dim transition-colors rounded-sm">Visit Site</a>
          </div>
        </article>
      </div>

    </div>
  </div>
```

New:

```html
  <!-- Client 1: Gurvis Miner Dispute Resolution -->
  <section class="bg-warm-bg dark:bg-navy-bg py-24 border-b border-navy-bg/10 dark:border-offwhite/10">
    <div class="w-[90%] max-w-[1240px] mx-auto">
      <div class="grid gap-16 md:grid-cols-2 md:items-center">
        <div data-reveal data-dir="left" class="relative overflow-hidden rounded-sm border border-navy-bg/10 dark:border-offwhite/10 bg-warm-section dark:bg-navy-section">
          <img src="../images/gurvis-miner-screenshot.png" alt="Gurvis Miner Dispute Resolution website" width="1920" height="953" class="w-full" />
        </div>
        <div class="flex flex-col justify-center">
          <div data-reveal class="flex flex-wrap gap-2 mb-4">
            <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Legal / Mediation</span>
            <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">WordPress</span>
          </div>
          <div data-reveal><h2 class="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-[0.01em]">Independent Credibility: Gurvis Miner Dispute Resolution</h2></div>
          <div data-reveal class="mt-8 flex flex-col gap-4">
            <p class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]"><span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase text-orange">The Challenge:</span> An independent mediator needed to compete for cases against established firms without their staff or budget behind him.</p>
            <p class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]"><span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase text-orange">The Approach:</span> A WordPress build with a custom client-intake form, mobile-first responsive design, and optimized load times &mdash; all in on credibility signals up front.</p>
            <p class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]"><span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase text-orange">The Result:</span> A polished web presence that gives a solo practitioner the same digital authority as a full firm, with an intake flow that turns visitors into qualified leads.</p>
          </div>
          <div data-reveal class="mt-10">
            <a href="https://minerdisputeresolution.com/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-7 py-3 bg-transparent border-2 border-navy-bg/30 dark:border-offwhite/35 text-navy-bg dark:text-offwhite font-mono text-[0.8rem] tracking-[0.1em] uppercase rounded-sm transition-all duration-300 hover:border-navy-bg dark:hover:border-offwhite hover:-translate-y-0.5">Visit Site</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Client 2: Bachata Bakery -->
  <section class="bg-warm-section dark:bg-navy-dark/50 py-24 border-b border-navy-bg/10 dark:border-offwhite/10">
    <div class="w-[90%] max-w-[1240px] mx-auto">
      <div class="grid gap-16 md:grid-cols-2 md:items-center">
        <div class="flex flex-col justify-center">
          <div data-reveal class="flex flex-wrap gap-2 mb-4">
            <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Food &amp; Beverage</span>
            <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Custom Code</span>
          </div>
          <div data-reveal><h2 class="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-[0.01em]">Demand Control: Bachata Bakery</h2></div>
          <div data-reveal class="mt-8 flex flex-col gap-4">
            <p class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]"><span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase text-orange">The Challenge:</span> A one-person kitchen kept getting buried by more orders than it could fill, with no way to pause demand without manually turning customers away.</p>
            <p class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]"><span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase text-orange">The Approach:</span> A fully custom-coded storefront (no templates) with a presale window that activates and deactivates ordering on a schedule, backed by dynamic order forms and deep SEO work.</p>
            <p class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]"><span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase text-orange">The Result:</span> The kitchen controls demand instead of chasing it &mdash; orders land only when there's capacity to fill them.</p>
          </div>
          <div data-reveal class="mt-10">
            <a href="https://bachatabakery.com/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-7 py-3 bg-transparent border-2 border-navy-bg/30 dark:border-offwhite/35 text-navy-bg dark:text-offwhite font-mono text-[0.8rem] tracking-[0.1em] uppercase rounded-sm transition-all duration-300 hover:border-navy-bg dark:hover:border-offwhite hover:-translate-y-0.5">Visit Site</a>
          </div>
        </div>
        <div data-reveal data-dir="right" class="relative overflow-hidden rounded-sm border border-navy-bg/10 dark:border-offwhite/10 bg-warm-bg dark:bg-navy-section">
          <img src="../images/place-an-order-bachata-bakery-screenshot.png" alt="Bachata Bakery order page" width="1920" height="953" class="w-full" />
        </div>
      </div>
    </div>
  </section>

  <!-- Client 3: Raquel Ariana -->
  <section class="bg-warm-bg dark:bg-navy-bg py-24 border-b border-navy-bg/10 dark:border-offwhite/10">
    <div class="w-[90%] max-w-[1240px] mx-auto">
      <div class="grid gap-16 md:grid-cols-2 md:items-center">
        <div data-reveal data-dir="left" class="relative overflow-hidden rounded-sm border border-navy-bg/10 dark:border-offwhite/10 bg-warm-section dark:bg-navy-section">
          <img src="../images/raquel-ariana-homepage-screenshot.png" alt="Raquel Ariana website" width="1920" height="953" class="w-full" />
        </div>
        <div class="flex flex-col justify-center">
          <div data-reveal class="flex flex-wrap gap-2 mb-4">
            <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Beauty / Makeup Artist</span>
            <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Custom Code</span>
          </div>
          <div data-reveal><h2 class="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-[0.01em]">Booked Appointments: Raquel Ariana</h2></div>
          <div data-reveal class="mt-8 flex flex-col gap-4">
            <p class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]"><span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase text-orange">The Challenge:</span> A freelance makeup artist serving a four-state region was losing phone-browsing visitors before they ever reached out.</p>
            <p class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]"><span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase text-orange">The Approach:</span> A single-page site with services and pricing in a clean scrollable layout, integrated booking-inquiry forms, and a custom visual identity built to earn trust before the first message.</p>
            <p class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]"><span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase text-orange">The Result:</span> A mobile-first site that turns casual browsing into booked sessions, with a brand presence strong enough to compete for higher-end bridal and event work.</p>
          </div>
          <div data-reveal class="mt-10">
            <a href="https://raquelariana.com/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-7 py-3 bg-transparent border-2 border-navy-bg/30 dark:border-offwhite/35 text-navy-bg dark:text-offwhite font-mono text-[0.8rem] tracking-[0.1em] uppercase rounded-sm transition-all duration-300 hover:border-navy-bg dark:hover:border-offwhite hover:-translate-y-0.5">Visit Site</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Client 4: Gregory Duane -->
  <section class="bg-warm-section dark:bg-navy-dark/50 py-24 border-b border-navy-bg/10 dark:border-offwhite/10">
    <div class="w-[90%] max-w-[1240px] mx-auto">
      <div class="grid gap-16 md:grid-cols-2 md:items-center">
        <div class="flex flex-col justify-center">
          <div data-reveal class="flex flex-wrap gap-2 mb-4">
            <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Fashion / Bridal</span>
            <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Squarespace</span>
          </div>
          <div data-reveal><h2 class="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-[0.01em]">Bespoke Online, Bespoke In Person: Gregory Duane</h2></div>
          <div data-reveal class="mt-8 flex flex-col gap-4">
            <p class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]"><span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase text-orange">The Challenge:</span> A custom suit and bridal boutique needed to sell online without the site feeling like a generic e-commerce template.</p>
            <p class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]"><span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase text-orange">The Approach:</span> A full custom design overhaul on Squarespace's commerce platform, layering secure checkout with appointment booking for tailored fittings and consultations.</p>
            <p class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]"><span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase text-orange">The Result:</span> An elevated, bespoke-feeling storefront that sells online and books consultations without diluting the boutique's handcrafted brand.</p>
          </div>
          <div data-reveal class="mt-10">
            <a href="https://gregoryduane.com" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-7 py-3 bg-transparent border-2 border-navy-bg/30 dark:border-offwhite/35 text-navy-bg dark:text-offwhite font-mono text-[0.8rem] tracking-[0.1em] uppercase rounded-sm transition-all duration-300 hover:border-navy-bg dark:hover:border-offwhite hover:-translate-y-0.5">Visit Site</a>
          </div>
        </div>
        <div data-reveal data-dir="right" class="relative overflow-hidden rounded-sm border border-navy-bg/10 dark:border-offwhite/10 bg-warm-bg dark:bg-navy-section">
          <img src="../images/client-gregory-duane.png" alt="Gregory Duane website" width="1853" height="955" class="w-full" />
        </div>
      </div>
    </div>
  </section>

  <!-- Client 5: MLJ Signature Contracting -->
  <section class="bg-warm-bg dark:bg-navy-bg py-24 border-b border-navy-bg/10 dark:border-offwhite/10">
    <div class="w-[90%] max-w-[1240px] mx-auto">
      <div class="grid gap-16 md:grid-cols-2 md:items-center">
        <div data-reveal data-dir="left" class="relative overflow-hidden rounded-sm border border-navy-bg/10 dark:border-offwhite/10 bg-warm-section dark:bg-navy-section">
          <img src="../images/client-mlj-signature-screenshot.png" alt="MLJ Signature Contracting website" width="1920" height="953" class="w-full" />
        </div>
        <div class="flex flex-col justify-center">
          <div data-reveal class="flex flex-wrap gap-2 mb-4">
            <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">Construction / Contracting</span>
            <span class="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 bg-orange/10 text-orange border border-orange/20 rounded-sm">WordPress</span>
          </div>
          <div data-reveal><h2 class="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-[0.01em]">Trust Before the First Call: MLJ Signature Contracting</h2></div>
          <div data-reveal class="mt-8 flex flex-col gap-4">
            <p class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]"><span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase text-orange">The Challenge:</span> Homeowners needed to trust a contractor before they ever picked up the phone, in an industry where licensing and safety compliance are exactly what people worry about.</p>
            <p class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]"><span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase text-orange">The Approach:</span> A WordPress site surfacing licensing and EPA lead-safe certification across three jurisdictions alongside six core service lines, with a service-aware inquiry form routing leads to the right team member.</p>
            <p class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]"><span class="font-mono text-[0.7rem] tracking-[0.08em] uppercase text-orange">The Result:</span> Homeowners arrive pre-sold on credibility, and leads land with the right person on the first try.</p>
          </div>
          <div data-reveal class="mt-10">
            <a href="https://mljsignature.com/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-7 py-3 bg-transparent border-2 border-navy-bg/30 dark:border-offwhite/35 text-navy-bg dark:text-offwhite font-mono text-[0.8rem] tracking-[0.1em] uppercase rounded-sm transition-all duration-300 hover:border-navy-bg dark:hover:border-offwhite hover:-translate-y-0.5">Visit Site</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Bottom Conversion Block -->
  <section class="bg-navy-bg py-24">
    <div class="w-[90%] max-w-[1240px] mx-auto text-center">
      <div data-reveal>
        <h2 class="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-offwhite tracking-[0.01em]">Every client had a different problem. Same process solves yours.</h2>
        <p class="text-offwhite opacity-70 text-[1.05rem] leading-[1.75] max-w-[640px] mx-auto mt-4 mb-12">Whether you need a credibility-first rebuild, a demand-control system, or a booking flow that actually converts, I can architect the site your business needs.</p>
        <a href="../#contact" class="inline-flex items-center px-7 py-3 bg-orange border-2 border-orange text-offwhite font-mono text-[0.8rem] tracking-[0.1em] uppercase rounded-sm transition-all duration-300 hover:bg-orange-dim hover:border-orange-dim hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(255,89,16,0.4)]">Book an AI Workflow Audit</a>
      </div>
    </div>
  </section>
```

- [ ] **Step 4: Structural self-check via Playwright**

Serve the file locally so relative asset paths resolve. If a local server skill/task isn't already running for this project, use Python's built-in server from the repo root:

```bash
python -m http.server 8000
```

Then, with the Playwright MCP tool:

```
mcp__plugin_playwright_playwright__browser_navigate
  url: "http://localhost:8000/clients/"
```

```
mcp__plugin_playwright_playwright__browser_evaluate
  function: "() => { const sections = document.querySelectorAll('main > section'); const clientSections = Array.from(sections).slice(1, -1); const imgsOk = clientSections.every(s => { const img = s.querySelector('img'); return img && img.getAttribute('width') && img.getAttribute('height'); }); const linksOk = clientSections.every(s => s.querySelector('a[href^=\"http\"]')); return { totalSections: sections.length, clientSections: clientSections.length, imgsOk, linksOk }; }"
```

Expected result: `{ totalSections: 7, clientSections: 5, imgsOk: true, linksOk: true }` (1 page-header section + 5 client sections + 1 CTA section = 7).

- [ ] **Step 5: Visual verification — light mode, dark mode, mobile**

With the Playwright MCP tool, resize to `375x800`, navigate to `http://localhost:8000/clients/`, and take a screenshot. Then run `browser_evaluate` with `function: "() => { document.documentElement.classList.add('dark'); localStorage.setItem('theme','dark'); }"`, reload, and take another screenshot. Confirm both render correctly (no overlapping text, images load, alternating backgrounds visible) per CLAUDE.md's testing checklist. Also check anchor `../#contact` resolves by clicking the bottom CTA button and confirming it lands on the homepage contact section.

- [ ] **Step 6: Commit**

```bash
git add clients/index.html
git commit -m "Redesign clients page around client needs, matching case-studies narrative layout"
```
