# Social Media Presence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Launch the social media service on calvindaniel.com and stand up Instagram, Facebook, and TikTok accounts that send leads to it.

**Architecture:** A new static page, `social/index.html`, cloned from `contact/index.html`, sells three packages and captures leads through the existing Formspree form handler in `js/home.js`. The homepage, `pricing.md`, `llms.txt`, and `sitemap.xml` announce the service. After the accounts exist, every footer and the `sameAs` schema arrays link to them. Tasks marked **(Calvin, manual)** are account and content work done in the platforms' own apps.

**Tech Stack:** Static HTML, precompiled Tailwind v3 (`css/styles.css`), BEM component CSS (`css/contact-form.css`, `css/page-strip.css`), Formspree, GitHub Pages (deploys on push to `master`), Playwright MCP for verification.

**Spec:** `docs/superpowers/specs/2026-10-28-social-media-presence-design.md`

## Global Constraints

- Tailwind is precompiled and there is no Tailwind build in the repo. Only use utility classes that already appear in `css/styles.css`; copy class strings from existing pages. Verify any new class with `Select-String -Path css/styles.css -Pattern '<escaped class>' -Quiet`.
- Mobile-first; BEM for any new component class; no inline styles; no new typefaces; no new third-party JS.
- Do not touch the off-canvas nav structure, hamburger animation, theme toggle mechanism, CSS custom property names, or the hero street-map animation.
- Primary email: `info@calvindaniel.com`.
- Images: WebP with `width` and `height` attributes.
- Contact forms post to Formspree `https://formspree.io/f/xojgvdjq`; `js/home.js` upgrades any `#contact-form` to submit without page reload.
- Handle: `@calvindaniel06` on Instagram, Facebook, TikTok. URLs: `https://www.instagram.com/calvindaniel06/`, `https://www.facebook.com/calvindaniel06`, `https://www.tiktok.com/@calvindaniel06`.
- Prices: Profile Makeover from $495; Website + Social Bundle from $1,995; Content & Posting "Quoted after your free review".
- Social post copy: no em dashes, no broetry, no engagement bait, no "it's not X, it's Y" reveals.
- Testing checklist before every website commit: 375px viewport, dark and light mode, anchor links resolve, homepage hero counters animate, contact form submits without page reload.

## Local preview (used by every website task)

Run from the repo root and leave running:

```powershell
python -m http.server 8080
```

Pages are then at `http://localhost:8080/`.

---

### Task 1: `/social/` service page

**Files:**
- Create: `social/index.html` (copy of `contact/index.html`, then edited)

**Interfaces:**
- Consumes: `js/main.js` (header, nav, theme), `js/home.js` (`#contact-form`, `#cf-message`, `#cf-count`, `#cf-status`, `#cf-submit`), `css/contact-form.css`, `css/page-strip.css`.
- Produces: page at `https://calvindaniel.com/social/` with anchors `#packages`, `#how-it-works`, `#contact`. Later tasks link to `/social/` and `/social/#contact`.

- [ ] **Step 1: Copy the contact page**

```powershell
New-Item -ItemType Directory -Force social | Out-Null
Copy-Item contact/index.html social/index.html
```

- [ ] **Step 2: Replace the head metadata and schema**

In `social/index.html`, replace everything from `<title>Contact &ndash; Calvin Daniel</title>` through the closing `</script>` of the JSON-LD block with:

```html
  <title>Social Media for Small Business &ndash; Calvin Daniel</title>
  <meta name="description" content="Profile makeovers, monthly content, and posting for small business Instagram, Facebook, and TikTok accounts. Book a free 20-minute profile review." />
  <link rel="canonical" href="https://calvindaniel.com/social/" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Calvin Daniel" />
  <meta property="og:title" content="Social Media for Small Business – Calvin Daniel" />
  <meta property="og:description" content="Profile makeovers, monthly content, and posting for small business Instagram, Facebook, and TikTok accounts. Book a free 20-minute profile review." />
  <meta property="og:url" content="https://calvindaniel.com/social/" />
  <meta property="og:image" content="https://calvindaniel.com/images/favicon-social-logo.png" />
  <meta property="og:image:width" content="195" />
  <meta property="og:image:height" content="178" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Social Media for Small Business – Calvin Daniel" />
  <meta name="twitter:description" content="Profile makeovers, monthly content, and posting for small business Instagram, Facebook, and TikTok accounts. Book a free 20-minute profile review." />
  <meta name="twitter:image" content="https://calvindaniel.com/images/favicon-social-logo.png" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://calvindaniel.com/social/#service",
    "url": "https://calvindaniel.com/social/",
    "name": "Social media for small business",
    "serviceType": "Social media management",
    "description": "Profile makeovers, monthly content creation, and scheduling and posting for small business Instagram, Facebook, and TikTok accounts.",
    "provider": { "@id": "https://calvindaniel.com/#business" },
    "areaServed": "United States",
    "offers": [
      {
        "@type": "Offer",
        "name": "Profile Makeover",
        "priceCurrency": "USD",
        "price": "495",
        "description": "One-time setup or refresh of Instagram, Facebook, and TikTok profiles.",
        "url": "https://calvindaniel.com/social/#packages"
      },
      {
        "@type": "Offer",
        "name": "Website + Social Bundle",
        "priceCurrency": "USD",
        "price": "1995",
        "description": "Site That Books plus a Profile Makeover with matching branding.",
        "url": "https://calvindaniel.com/social/#packages"
      }
    ]
  }
  </script>
```

- [ ] **Step 3: Remove the "current page" styling from the Contact links**

This page is not Contact, so the three Contact links get the normal styles. Replace:

```html
      <a href="../contact/" aria-current="page" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-orange border-b-2 border-orange pb-0.5">Contact</a>
```

with:

```html
      <a href="../contact/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors">Contact</a>
```

Replace:

```html
    <li><a href="../contact/" aria-current="page" class="font-display text-[2rem] text-orange tracking-wide">Contact</a></li>
```

with:

```html
    <li><a href="../contact/" class="font-display text-[2rem] text-navy-bg/50 dark:text-offwhite/60 tracking-wide hover:text-navy-bg dark:hover:text-offwhite transition-colors">Contact</a></li>
```

Replace:

```html
          <a href="../contact/" aria-current="page" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-orange transition-colors">Contact</a>
```

with:

```html
          <a href="../contact/" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/60 dark:text-offwhite/60 hover:text-orange transition-colors">Contact</a>
```

- [ ] **Step 4: Replace the page body**

Replace everything between `<main>` and `</main>` with:

```html

  <section class="page-strip bg-warm-section dark:bg-navy-section border-b border-navy-bg/10 dark:border-offwhite/10">
    <div class="page-strip__map" aria-hidden="true"></div>
    <svg class="page-strip__route" aria-hidden="true">
      <path class="page-strip__line page-strip__line--first" d="M407 111 H259 V185" />
      <path class="page-strip__line page-strip__line--second" d="M111 185 H259" />
      <circle class="page-strip__ring" cx="259" cy="185" r="13" />
      <circle class="page-strip__home" cx="259" cy="185" r="11" />
      <circle class="page-strip__pin page-strip__pin--first" cx="407" cy="111" r="7" />
      <circle class="page-strip__pin page-strip__pin--second" cx="111" cy="185" r="7" />
      <g class="page-strip__tag"><rect x="376" y="81" width="62" height="22" rx="2" /><text x="407" y="96" text-anchor="middle">BOOKED</text></g>
    </svg>
    <div data-reveal class="relative z-10 w-[90%] max-w-[1240px] mx-auto text-center">
      <h1 class="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-[0.01em]">Profiles that get booked</h1>
      <p class="font-body text-[1.05rem] leading-[1.7] text-navy-bg/60 dark:text-offwhite/60 mt-3 max-w-[520px] mx-auto">Instagram, Facebook, and TikTok profiles that tell people what you do, where you do it, and how to book you. Then content that keeps them coming back.</p>
    </div>
  </section>

  <section id="packages" class="relative bg-warm-bg dark:bg-navy-bg py-24 scroll-mt-[70px]">
    <div class="w-[90%] max-w-[1240px] mx-auto">
      <div data-reveal class="text-center mb-16">
        <p class="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-orange mb-2">Social packages</p>
        <h2 class="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-[0.01em]">What I do for your profiles</h2>
        <p class="text-navy-bg/60 dark:text-offwhite/60 text-[1.05rem] mt-4 max-w-[520px] mx-auto leading-[1.7]">Starting prices in USD. Final quotes confirmed after a free 20-minute profile review.</p>
      </div>
      <div class="grid gap-6 md:grid-cols-3">
        <div data-reveal class="flex flex-col bg-warm-section dark:bg-navy-dark/30 border-t border-orange rounded-sm p-8">
          <h3 class="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-wide mb-2">Profile Makeover</h3>
          <p class="font-mono text-[0.85rem] tracking-[0.08em] uppercase text-orange mb-6">From $495</p>
          <dl class="flex flex-col gap-4 flex-1">
            <div>
              <dt class="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-orange mb-1">Who it is for</dt>
              <dd class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]">Businesses whose profiles get views but not inquiries</dd>
            </div>
            <div>
              <dt class="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-orange mb-1">What you get</dt>
              <dd class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]">Name, bio, profile photo, highlight covers, pinned posts, and a booking link set up across Instagram, Facebook, and TikTok</dd>
            </div>
            <div>
              <dt class="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-orange mb-1">Type</dt>
              <dd class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]">One-time project</dd>
            </div>
          </dl>
        </div>
        <div data-reveal class="flex flex-col bg-warm-section dark:bg-navy-dark/30 border-t border-orange rounded-sm p-8">
          <h3 class="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-wide mb-2">Content &amp; Posting</h3>
          <p class="font-mono text-[0.85rem] tracking-[0.08em] uppercase text-orange mb-6">Quoted after your free review</p>
          <dl class="flex flex-col gap-4 flex-1">
            <div>
              <dt class="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-orange mb-1">Who it is for</dt>
              <dd class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]">Owners who want to show up every week without doing the posting</dd>
            </div>
            <div>
              <dt class="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-orange mb-1">What you get</dt>
              <dd class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]">Monthly graphics, carousels, and short videos edited from your footage, scheduled and posted for you</dd>
            </div>
            <div>
              <dt class="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-orange mb-1">Type</dt>
              <dd class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]">Monthly retainer</dd>
            </div>
          </dl>
        </div>
        <div data-reveal class="flex flex-col bg-warm-section dark:bg-navy-dark/30 border-t border-orange rounded-sm p-8">
          <h3 class="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-wide mb-2">Website + Social</h3>
          <p class="font-mono text-[0.85rem] tracking-[0.08em] uppercase text-orange mb-6">From $1,995</p>
          <dl class="flex flex-col gap-4 flex-1">
            <div>
              <dt class="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-orange mb-1">Who it is for</dt>
              <dd class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]">Businesses running on a Facebook page with no website</dd>
            </div>
            <div>
              <dt class="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-orange mb-1">What you get</dt>
              <dd class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]">Site That Books plus a Profile Makeover, with matching branding so customers recognize you everywhere</dd>
            </div>
            <div>
              <dt class="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-orange mb-1">Timeline</dt>
              <dd class="text-navy-bg/70 dark:text-offwhite/70 text-[0.95rem] leading-[1.7]">Typically 3 to 4 weeks</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </section>

  <section id="how-it-works" class="bg-warm-section dark:bg-navy-section py-24 scroll-mt-[70px]">
    <div class="w-[90%] max-w-[1240px] mx-auto">
      <div data-reveal class="text-center mb-16">
        <p class="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-orange mb-2">How it works</p>
        <h2 class="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-[0.01em]">Three steps to a profile that books</h2>
      </div>
      <div class="grid gap-6 md:grid-cols-3">
        <div data-reveal>
          <p class="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-orange mb-2">01</p>
          <h3 class="font-display text-[1.4rem] text-navy-bg dark:text-offwhite tracking-wide mb-3">Send your profile</h3>
          <p class="text-navy-bg/60 dark:text-offwhite/60 text-[0.95rem] leading-[1.7]">Fill out the form below or DM &ldquo;MAKEOVER&rdquo; to @calvindaniel06 on Instagram, Facebook, or TikTok.</p>
        </div>
        <div data-reveal>
          <p class="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-orange mb-2">02</p>
          <h3 class="font-display text-[1.4rem] text-navy-bg dark:text-offwhite tracking-wide mb-3">Free 20-minute review</h3>
          <p class="text-navy-bg/60 dark:text-offwhite/60 text-[0.95rem] leading-[1.7]">I walk through your profiles, show you where people drop off, and quote the fix.</p>
        </div>
        <div data-reveal>
          <p class="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-orange mb-2">03</p>
          <h3 class="font-display text-[1.4rem] text-navy-bg dark:text-offwhite tracking-wide mb-3">Makeover and handoff</h3>
          <p class="text-navy-bg/60 dark:text-offwhite/60 text-[0.95rem] leading-[1.7]">I rebuild your profiles, hand back the logins and templates, and keep posting for you if you want.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="relative bg-warm-bg dark:bg-navy-bg py-24 overflow-hidden scroll-mt-[70px]">
    <div class="w-[90%] max-w-[1240px] mx-auto">
      <div data-reveal class="relative z-10 text-center max-w-[640px] mx-auto">
        <p class="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-orange mb-2">Free profile review</p>
        <h2 class="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-[0.01em]">Show me your profiles.</h2>
        <p class="text-navy-bg/60 dark:text-offwhite/60 text-[1.05rem] mt-4 mb-16 leading-[1.75]">Tell me what you sell and link your busiest profile. I will reply with what I would change first.</p>
        <form class="contact-form" id="contact-form" action="https://formspree.io/f/xojgvdjq" method="POST" novalidate>
          <input type="hidden" name="_subject" value="Social media inquiry" />
          <div class="contact-form__row">
            <div class="contact-form__field">
              <label class="contact-form__label" for="cf-name">Name</label>
              <input class="contact-form__input" id="cf-name" name="name" type="text" required autocomplete="name" />
            </div>
            <div class="contact-form__field">
              <label class="contact-form__label" for="cf-email">Email</label>
              <input class="contact-form__input" id="cf-email" name="email" type="email" required autocomplete="email" />
            </div>
          </div>
          <div class="contact-form__row">
            <div class="contact-form__field">
              <label class="contact-form__label" for="cf-type">Project Type</label>
              <select class="contact-form__select" id="cf-type" name="project_type" required>
                <option value="" disabled selected>Select&hellip;</option>
                <option>Profile Makeover</option>
                <option>Content &amp; Posting</option>
                <option>Website + Social</option>
                <option>Not sure yet</option>
              </select>
            </div>
            <div class="contact-form__field">
              <label class="contact-form__label" for="cf-budget">Estimated Budget</label>
              <select class="contact-form__select" id="cf-budget" name="budget" required>
                <option value="" disabled selected>Select&hellip;</option>
                <option>Under $1K</option>
                <option>$1K&ndash;$3K</option>
                <option>$3K&ndash;$10K</option>
                <option>Let's Talk</option>
              </select>
            </div>
          </div>
          <div class="contact-form__row">
            <div class="contact-form__field">
              <label class="contact-form__label" for="cf-timeline">Timeline</label>
              <select class="contact-form__select" id="cf-timeline" name="timeline" required>
                <option value="" disabled selected>Select&hellip;</option>
                <option>ASAP</option>
                <option>1&ndash;2 months</option>
                <option>3+ months</option>
                <option>Just Exploring</option>
              </select>
            </div>
            <div class="contact-form__field">
              <label class="contact-form__label" for="cf-source">How did you find me?</label>
              <select class="contact-form__select" id="cf-source" name="source" required>
                <option value="" disabled selected>Select&hellip;</option>
                <option>Instagram</option>
                <option>Facebook</option>
                <option>TikTok</option>
                <option>Google</option>
                <option>Referral</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div class="contact-form__field">
            <label class="contact-form__label" for="cf-profile">Link to your profile <span class="contact-form__optional">(optional)</span></label>
            <input class="contact-form__input" id="cf-profile" name="profile_url" type="url" placeholder="https://instagram.com/yourbusiness" />
          </div>
          <div class="contact-form__field">
            <label class="contact-form__label" for="cf-message">Project Description</label>
            <textarea class="contact-form__textarea" id="cf-message" name="message" maxlength="500" rows="5" placeholder="What do you sell, and where do customers find you today?"></textarea>
            <span class="contact-form__counter"><span id="cf-count">0</span>/500</span>
          </div>
          <button type="submit" class="contact-form__submit" id="cf-submit">Send Message</button>
          <p class="contact-form__status" id="cf-status" role="status" aria-live="polite"></p>
        </form>
        <p class="font-mono text-[0.7rem] tracking-[0.1em] text-navy-bg/50 dark:text-offwhite/50 mt-8">Or email <a href="mailto:info@calvindaniel.com" class="text-orange hover:opacity-80 transition-opacity">info@calvindaniel.com</a></p>
        <p class="font-mono text-[0.65rem] tracking-[0.1em] text-navy-bg/40 dark:text-offwhite/40 mt-4"><a href="../privacy/" class="hover:text-orange transition-colors">Privacy</a></p>
      </div>
    </div>
  </section>

```

- [ ] **Step 5: Confirm every class on the page is already used on a live page**

The compiled Tailwind only contains classes that existing pages use, so any class not found on another page will render unstyled.

```powershell
$classesIn = { param($files) (Select-String -Path $files -Pattern 'class="([^"]+)"' -AllMatches).Matches | ForEach-Object { $_.Groups[1].Value -split '\s+' } | Where-Object { $_ } | Sort-Object -Unique }
$known = & $classesIn @('index.html', 'contact/index.html', 'about/index.html', 'work/index.html', 'privacy/index.html', 'running/index.html')
$new = & $classesIn @('social/index.html')
$new | Where-Object { $known -notcontains $_ }
```

Expected: no output. If a class prints, replace it with an equivalent class from the `$known` list.

- [ ] **Step 6: Verify the form submits without page reload**

With the local preview running, run this through the Playwright MCP `browser_run_code_unsafe` tool:

```js
async (page) => {
  await page.route('https://formspree.io/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
  await page.goto('http://localhost:8080/social/');
  const start = page.url();
  await page.fill('#cf-name', 'Test Owner');
  await page.fill('#cf-email', 'test@example.com');
  await page.selectOption('#cf-type', 'Profile Makeover');
  await page.selectOption('#cf-budget', 'Under $1K');
  await page.selectOption('#cf-timeline', 'ASAP');
  await page.selectOption('#cf-source', 'Instagram');
  await page.fill('#cf-message', 'Lawn care, mostly Facebook.');
  await page.click('#cf-submit');
  await page.waitForSelector('.contact-form__status--ok');
  return { sameUrl: page.url() === start, status: await page.textContent('#cf-status') };
}
```

Expected: `{ sameUrl: true, status: "Thanks — your message is on its way. I'll be in touch soon." }`

- [ ] **Step 7: Visual check at 375px and desktop, both themes**

Using Playwright MCP: `browser_resize` to 375×812, `browser_navigate` to `http://localhost:8080/social/`, `browser_take_screenshot` (full page). Click `#mobile-theme-toggle` after opening `#menu-open`, screenshot again. Repeat at 1280×800 using `#theme-toggle`.
Expected: no horizontal scroll at 375px (`browser_evaluate` → `document.documentElement.scrollWidth <= 375` returns `true`); the three package cards stack on mobile and sit in one row at 1280px; text readable in both themes.

- [ ] **Step 8: Verify anchors**

`browser_evaluate` on the page:

```js
() => ['#packages', '#how-it-works', '#contact'].map(id => [id, !!document.querySelector(id)])
```

Expected: all three `true`.

- [ ] **Step 9: Commit**

```powershell
git add social/index.html
git commit -m "Add social media service page"
```

---

### Task 2: Announce the service on the homepage and machine-readable files

**Files:**
- Modify: `index.html` (OfferCatalog in JSON-LD near lines 84–143; `knowsAbout` near line 69; packages section near lines 449–459)
- Modify: `pricing.md`
- Modify: `llms.txt`
- Modify: `sitemap.xml`

**Interfaces:**
- Consumes: `/social/`, `/social/#packages`, `/social/#contact` from Task 1.
- Produces: nothing used by later tasks.

- [ ] **Step 1: Add the two priced offers to the homepage OfferCatalog**

In `index.html`, find the Reporting Automation offer, which ends:

```json
                "name": "Reporting Automation",
                "description": "Audit a manual weekly or monthly reporting process, then build dashboards and scheduled data refresh on the tools the client already uses.",
                "url": "https://calvindaniel.com/#packages"
              }
            }
```

Replace it with:

```json
                "name": "Reporting Automation",
                "description": "Audit a manual weekly or monthly reporting process, then build dashboards and scheduled data refresh on the tools the client already uses.",
                "url": "https://calvindaniel.com/#packages"
              }
            },
            {
              "@type": "Offer",
              "priceCurrency": "USD",
              "price": "495",
              "priceSpecification": {
                "@type": "PriceSpecification",
                "priceCurrency": "USD",
                "minPrice": "495",
                "description": "Starting price; final quote after free profile review"
              },
              "url": "https://calvindaniel.com/social/#packages",
              "itemOffered": {
                "@type": "Service",
                "name": "Profile Makeover",
                "description": "One-time setup or refresh of Instagram, Facebook, and TikTok profiles: name, bio, profile photo, highlight covers, pinned posts, and booking link.",
                "url": "https://calvindaniel.com/social/"
              }
            },
            {
              "@type": "Offer",
              "priceCurrency": "USD",
              "price": "1995",
              "priceSpecification": {
                "@type": "PriceSpecification",
                "priceCurrency": "USD",
                "minPrice": "1995",
                "description": "Starting price; final quote after free site review"
              },
              "url": "https://calvindaniel.com/social/#packages",
              "itemOffered": {
                "@type": "Service",
                "name": "Website + Social Bundle",
                "description": "Site That Books plus a Profile Makeover with matching branding.",
                "url": "https://calvindaniel.com/social/"
              }
            }
```

- [ ] **Step 2: Add the topic to `knowsAbout`**

Replace:

```json
          "reporting automation",
          "Power BI"
        ],
```

with:

```json
          "reporting automation",
          "Power BI",
          "social media management"
        ],
```

- [ ] **Step 3: Add the social block to the packages section**

In `index.html`, find the end of the "Also offered" Reporting Automation block:

```html
        <a href="#contact" class="inline-flex items-center gap-2 font-mono text-[0.75rem] tracking-[0.1em] uppercase text-orange hover:opacity-80 transition-colors">Ask about reporting automation &rarr;</a>
      </div>
    </div>
```

Replace with:

```html
        <a href="#contact" class="inline-flex items-center gap-2 font-mono text-[0.75rem] tracking-[0.1em] uppercase text-orange hover:opacity-80 transition-colors">Ask about reporting automation &rarr;</a>
      </div>
    </div>
    <div data-reveal class="mt-16 max-w-[640px] mx-auto text-center">
      <p class="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-orange mb-2">New</p>
      <h3 class="font-display text-[1.4rem] text-navy-bg dark:text-offwhite tracking-wide mb-2">Social Media Profiles</h3>
      <p class="font-mono text-[0.75rem] tracking-[0.08em] uppercase text-orange mb-3">Makeover from $495 &middot; Website + Social from $1,995</p>
      <p class="text-navy-bg/60 dark:text-offwhite/60 text-[0.95rem] leading-[1.7]">Instagram, Facebook, and TikTok profiles that tell people what you do and how to book you, plus monthly content and posting if you want it.</p>
      <div class="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
        <a href="/social/" class="inline-flex items-center gap-2 font-mono text-[0.75rem] tracking-[0.1em] uppercase text-orange hover:opacity-80 transition-colors">See social packages &rarr;</a>
      </div>
    </div>
```

- [ ] **Step 4: Add the social section to `pricing.md`**

Insert immediately before the `## Free site review` heading:

```markdown
## Profile Makeover

- Price: from $495 (one-time)
- Best for: Small businesses whose Instagram, Facebook, or TikTok gets views but not inquiries
- Includes:
  - Name, bio, and profile photo across Instagram, Facebook, and TikTok
  - Highlight covers and pinned posts
  - Booking or inquiry link
- Details: https://calvindaniel.com/social/

## Content & Posting

- Price: monthly retainer, quoted after a free 20-minute profile review
- Includes:
  - Monthly graphics, carousels, and short videos edited from client footage
  - Scheduling and posting on Instagram, Facebook, and TikTok

## Website + Social Bundle

- Price: from $1,995 (one-time)
- Timeline: typically 3 to 4 weeks
- Includes:
  - Everything in Site That Books
  - Profile Makeover with matching branding

```

Also change the `Last updated:` line to the commit date in `YYYY-MM-DD` form.

- [ ] **Step 5: Add the service to `llms.txt`**

After the Reporting Automation bullet in `## Packages and pricing`, add:

```markdown
- [Profile Makeover](https://calvindaniel.com/social/): from $495. One-time setup or refresh of Instagram, Facebook, and TikTok profiles.
- [Content & Posting](https://calvindaniel.com/social/): monthly retainer quoted after a free profile review. Content creation plus scheduling and posting.
- [Website + Social Bundle](https://calvindaniel.com/social/): from $1,995. Site That Books plus a Profile Makeover.
```

In `## Key pages`, after the Contact bullet, add:

```markdown
- [Social](https://calvindaniel.com/social/): Social media profile makeovers, content, and posting for small businesses
```

- [ ] **Step 6: Add the page to `sitemap.xml`**

After the `/contact/` `<url>` block, add (use the commit date for `lastmod`):

```xml
  <url>
    <loc>https://calvindaniel.com/social/</loc>
    <lastmod>2026-10-28</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
```

- [ ] **Step 7: Validate the JSON-LD still parses**

Playwright MCP, `browser_navigate` to `http://localhost:8080/`, then `browser_evaluate`:

```js
() => [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { JSON.parse(s.textContent); return 'ok'; } catch (e) { return e.message; } })
```

Expected: every entry is `"ok"`. Run the same on `http://localhost:8080/social/`.

- [ ] **Step 8: Homepage checklist**

At 375px and 1280px, in both themes: screenshot the `#packages` section and confirm the new block renders under Reporting Automation. Reload the homepage and confirm the hero counters animate from 0 to their final values. Click "See social packages" and confirm it lands on `/social/`.

- [ ] **Step 9: Commit**

```powershell
git add index.html pricing.md llms.txt sitemap.xml
git commit -m "Announce social media service on homepage, pricing, llms.txt, and sitemap"
```

---

### Task 3: Create and brand the three accounts (Calvin, manual)

**Interfaces:**
- Consumes: live `https://calvindaniel.com/social/` (Tasks 1–2 pushed to `master`).
- Produces: live profiles at the three URLs in Global Constraints. Task 4 depends on these resolving.

- [ ] **Step 1: Push Tasks 1–2 so the bio link works**

```powershell
git push origin master
```

Wait for the GitHub Pages deploy, then open `https://calvindaniel.com/social/` on your phone.

- [ ] **Step 2: Facebook Page**

Create a Page (from your personal profile: Pages → Create). Name: `Calvin Daniel | Social & Websites for Small Biz`. Category: Marketing Agency. Username: `calvindaniel06`. Bio:

> I make small business profiles that get booked. Social content, profile makeovers, and websites. DM "MAKEOVER" for a free profile review.

Website: `https://calvindaniel.com/social/`. Email: `info@calvindaniel.com`. Action button: Send Message. Profile photo: `images/about-headshot-calvin-daniel.webp`.

- [ ] **Step 3: Instagram**

Create `@calvindaniel06` (or rename an existing account), switch to Professional → Business. Name field and bio: same text as the Facebook Page. Link: `https://calvindaniel.com/social/`. Same profile photo. Connect it to the Facebook Page in Meta Business Suite (Settings → Accounts → Instagram accounts).

- [ ] **Step 4: TikTok**

On `@calvindaniel06`: Settings → Account → Switch to Business Account. Name: `Calvin Daniel | Social + Web`. Bio:

> Profile makeovers + websites for small biz. DM MAKEOVER for a free review

Website: `https://calvindaniel.com/social/`. Archive or set to private any existing videos that don't fit the business.

- [ ] **Step 5: Templates**

In Canva, create two templates with the site colors (navy `#001A4D`, off-white `#F5F7FA`, warm background `#FAF8F5`, orange `#FF5910`) and the site's fonts (Bebas Neue for titles, DM Sans for body text):
- Reel and TikTok cover, 1080×1920, with a title slot.
- Instagram highlight cover, 1080×1920, one each for Makeovers, Services, Process, Results, About.

Add the highlight covers to Instagram once each highlight has at least one Story.

- [ ] **Step 6: Verify**

Open each URL in a logged-out browser window: `https://www.instagram.com/calvindaniel06/`, `https://www.facebook.com/calvindaniel06`, `https://www.tiktok.com/@calvindaniel06`. Each shows the new name, bio, and the `/social/` link, and tapping the link opens the page.

---

### Task 4: Link the new accounts from every page

**Files:**
- Modify (footer social icons): `index.html`, `about/index.html`, `contact/index.html`, `privacy/index.html`, `work/index.html`, `running/index.html`, `projects/elitehitter/index.html`, `projects/running-analysis-app/index.html`, `social/index.html`
- Modify (`sameAs` arrays): `index.html` (Person and ProfessionalService), `about/index.html`

**Interfaces:**
- Consumes: the three live profile URLs from Task 3.

- [ ] **Step 1: Add Instagram and Facebook icons to every footer**

In each footer file listed above, find the line that starts with `<a href="https://www.tiktok.com/@calvindaniel06"` inside the footer's social icon row, and insert immediately before it (matching that line's indentation):

```html
<a href="https://www.instagram.com/calvindaniel06/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="text-navy-bg/40 dark:text-offwhite/40 hover:text-orange transition-colors">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
</a>
<a href="https://www.facebook.com/calvindaniel06" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="text-navy-bg/40 dark:text-offwhite/40 hover:text-orange transition-colors">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
</a>
```

`about/index.html` and `index.html` also mention the TikTok URL inside JSON-LD; only edit the footer `<a>` in this step.

- [ ] **Step 2: Add the profiles to `sameAs`**

In `index.html` (both arrays) and `about/index.html`, replace:

```json
          "https://www.tiktok.com/@calvindaniel06",
```

with:

```json
          "https://www.tiktok.com/@calvindaniel06",
          "https://www.instagram.com/calvindaniel06/",
          "https://www.facebook.com/calvindaniel06",
```

(Match each file's existing indentation.)

- [ ] **Step 3: Verify counts**

```powershell
Get-ChildItem index.html, about/index.html, contact/index.html, privacy/index.html, work/index.html, running/index.html, projects/elitehitter/index.html, projects/running-analysis-app/index.html, social/index.html | ForEach-Object { "{0} ig={1} fb={2}" -f $_.FullName, (Select-String -Path $_ -Pattern 'instagram.com/calvindaniel06' -AllMatches).Matches.Count, (Select-String -Path $_ -Pattern 'facebook.com/calvindaniel06' -AllMatches).Matches.Count }
```

Expected: `index.html` ig=3 fb=3; `about/index.html` ig=2 fb=2; every other file ig=1 fb=1.

- [ ] **Step 4: Visual and JSON-LD check**

At 375px and 1280px in both themes, screenshot the footer on `/` and `/social/`: five icons plus Substack in one row on desktop, wrapping cleanly on mobile, matching the GitHub and LinkedIn icon color. Re-run the JSON-LD parse check from Task 2 Step 7 on `/` and `/about/`.

- [ ] **Step 5: Commit**

```powershell
git add index.html about/index.html contact/index.html privacy/index.html work/index.html running/index.html projects/elitehitter/index.html projects/running-analysis-app/index.html social/index.html
git commit -m "Link Instagram and Facebook profiles in footers and schema"
```

---

### Task 5: Lead handling setup (Calvin, manual)

**Interfaces:**
- Consumes: the accounts from Task 3.
- Produces: the saved replies and the lead tracker used daily from Task 6 on.

- [ ] **Step 1: Saved reply for "MAKEOVER" DMs**

In Meta Business Suite → Inbox → Saved replies, create `MAKEOVER`:

> Thanks for reaching out! Two quick questions so I can look before we talk: what does your business do, and which profile gets the most attention right now? Send me the link. You can also grab a free 20-minute review here: https://calvindaniel.com/social/#contact

Paste the same text into a phone note for TikTok DMs, which don't support saved replies for all accounts.

- [ ] **Step 2: DM template for businesses featured in a makeover video**

Save this as a second saved reply, `FEATURED`:

> Hi! I used your [Instagram/Facebook/TikTok] as an example in a profile makeover video: [video link]. Everything in it is meant to help. Here's the full list of changes I'd make, free to use: [3 bullet fixes]. If you'd like me to do it for you, here's where to book a free 20-minute review: https://calvindaniel.com/social/#contact

The bracketed parts are filled in per business each time it's sent.

- [ ] **Step 3: Lead tracker**

Create a Google Sheet named `Social Leads` with columns: `Date`, `Source platform`, `Business`, `Profile link`, `Stage`, `Value`, `Notes`. Add data validation on `Stage` with the values `DM`, `Review booked`, `Review done`, `Quoted`, `Won`, `Lost`. Add a second tab, `Weekly`, with columns `Week of`, `Profile visits`, `MAKEOVER DMs`, `Reviews booked`, `Clients signed`.

- [ ] **Step 4: Verify**

DM "MAKEOVER" to your own Instagram from a second account and confirm the saved reply inserts correctly and its link opens `/social/#contact`. Submit a test inquiry on `/social/` and confirm the Formspree email arrives with subject "Social media inquiry" and a `source` field.

---

### Task 6: Seed makeovers and first content batch (Calvin, manual; launch weeks 1–2)

**Interfaces:**
- Consumes: Tasks 3 and 5.
- Produces: before and after screenshots of the Bachata Bakery makeover for Task 7; 6 to 8 published videos.

- [ ] **Step 1: Line up the seed makeovers**

Offer free or ~$250 makeovers, in exchange for a testimonial and permission to post the before and after, to Bachata Bakery and two businesses from `docs/outreach/middletown-home-services-hot-sheet-2026-10-20.md` (start with JB Power Washing LLC and Ciamaricone's Landscaping). Log each one in `Social Leads` with Stage `Quoted` and Value `0` or `250`.

- [ ] **Step 2: Capture before screenshots**

Before changing anything, take phone screenshots of each seed business's Instagram, Facebook, and TikTok profile pages. Save them to `images/social/raw/` (not committed).

- [ ] **Step 3: First batch session (2 hours)**

Film 6 to 8 makeover videos using the spec's format: a 3-second hook naming one specific flaw, three fixes shown as screen recordings, the before and after side by side, and the close "DM MAKEOVER and I'll review yours." Caption in CapCut (2 lines max, bold sans-serif). Use only public profiles; keep every critique constructive.

- [ ] **Step 4: Publish and pin**

Publish all of them before promoting the accounts anywhere. Post each video to TikTok, Instagram Reels, and Facebook. Pin the best 3 on Instagram and TikTok. Send the `FEATURED` DM to every business shown.

- [ ] **Step 5: Verify**

Each platform's grid shows at least 6 videos with matching covers, and 3 are pinned.

---

### Task 7: Add the first case study to `/social/`

**Files:**
- Create: `images/social/bachata-bakery-before.webp`, `images/social/bachata-bakery-after.webp`
- Modify: `social/index.html` (insert a section between `#how-it-works` and `#contact`; change the `#contact` background)

**Interfaces:**
- Consumes: Bachata Bakery before and after screenshots from Task 6 and Bachata Bakery's permission to publish them.
- Produces: `#makeovers` anchor on `/social/`.

- [ ] **Step 1: Convert the screenshots to WebP at 1080×1350**

```powershell
python -m pip install pillow
python -c "from PIL import Image, ImageOps; [ImageOps.fit(Image.open(s).convert('RGB'), (1080, 1350), centering=(0.5, 0.0)).save(d, 'WEBP', quality=82) for s, d in [('images/social/raw/bachata-before.png', 'images/social/bachata-bakery-before.webp'), ('images/social/raw/bachata-after.png', 'images/social/bachata-bakery-after.webp')]]"
```

Expected: both `.webp` files exist, each under 200 KB (`Get-Item images/social/*.webp | Select-Object Name, Length`).

- [ ] **Step 2: Insert the case study section**

In `social/index.html`, insert immediately before `<section id="contact"`:

```html
  <section id="makeovers" class="bg-warm-bg dark:bg-navy-bg py-24 scroll-mt-[70px]">
    <div class="w-[90%] max-w-[1240px] mx-auto">
      <div data-reveal class="text-center mb-16">
        <p class="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-orange mb-2">Recent makeover</p>
        <h2 class="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.0] text-navy-bg dark:text-offwhite tracking-[0.01em]">Bachata Bakery</h2>
        <p class="text-navy-bg/60 dark:text-offwhite/60 text-[1.05rem] mt-4 max-w-[520px] mx-auto leading-[1.7]">Name, bio, highlights, and the order link rebuilt so a new visitor knows what to order and when the presale opens.</p>
      </div>
      <div data-reveal class="grid gap-6 md:grid-cols-2">
        <figure class="flex flex-col gap-3">
          <img src="../images/social/bachata-bakery-before.webp" width="1080" height="1350" loading="lazy" alt="Bachata Bakery Instagram profile before the makeover" class="w-full h-auto rounded-sm border-t border-orange" />
          <figcaption class="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-navy-bg/60 dark:text-offwhite/60">Before</figcaption>
        </figure>
        <figure class="flex flex-col gap-3">
          <img src="../images/social/bachata-bakery-after.webp" width="1080" height="1350" loading="lazy" alt="Bachata Bakery Instagram profile after the makeover" class="w-full h-auto rounded-sm border-t border-orange" />
          <figcaption class="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-orange">After</figcaption>
        </figure>
      </div>
    </div>
  </section>

```

Then keep the backgrounds alternating (strip, packages, how-it-works, makeovers, contact) by replacing:

```html
  <section id="contact" class="relative bg-warm-bg dark:bg-navy-bg py-24 overflow-hidden scroll-mt-[70px]">
```

with:

```html
  <section id="contact" class="relative bg-warm-section dark:bg-navy-section py-24 overflow-hidden scroll-mt-[70px]">
```

- [ ] **Step 3: Verify**

Re-run the class check from Task 1 Step 5 (expected: no new missing classes). At 375px and 1280px in both themes, screenshot `#makeovers`: images stack on mobile and sit side by side on desktop, with no layout shift while they load (`browser_evaluate` → `[...document.querySelectorAll('#makeovers img')].every(i => i.width > 0 && i.getAttribute('height') === '1350')` returns `true`).

- [ ] **Step 4: Commit**

```powershell
git add images/social/bachata-bakery-before.webp images/social/bachata-bakery-after.webp social/index.html
git commit -m "Add Bachata Bakery makeover case study to social page"
```

---

### Task 8: Regular cadence and first review (Calvin, manual; launch weeks 3–4 onward)

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: Weekly batch (every week, 2 hours)**

30 min picking 3 profiles and drafting fixes; 60 min filming 3 makeover videos and 1 tip video and captioning in CapCut; 30 min writing captions and scheduling in Meta Business Suite and TikTok. Also each week: 1 Instagram carousel recutting the best makeover, and 2 or 3 Stories.

- [ ] **Step 2: Daily engagement (10–15 min)**

Reply to every comment and DM within 24 hours using the saved replies; comment on 5 posts from local business pages or small-business owner accounts. Log every "MAKEOVER" DM in `Social Leads`.

- [ ] **Step 3: Local promotion (week 3)**

Share the best makeovers in local Facebook groups whose rules allow business posts. DM each featured business with `FEATURED`.

- [ ] **Step 4: Weekly review (15 min, during the batch)**

Fill one row in the `Weekly` tab. Apply the spec's diagnosis rules:
- Views but no DMs: change the CTA or the offer.
- No views: rewrite hooks; test a different first 3 seconds.
- DMs but no bookings: rewrite the `MAKEOVER` saved reply or tighten the `/social/` page.

- [ ] **Step 5: 90-day check**

At day 90, compare against the target: 1–2 paying social clients and 3+ case studies. For each new case study with permission, repeat Task 7 with that business's slug (for example `images/social/jb-power-washing-before.webp`) and add another `#makeovers` grid below the first.
