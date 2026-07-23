# Clients Page Redesign — Design Spec

## Goal

Reposition `/clients/` from a "web development projects" portfolio grid into a
needs-solved narrative, matching the visual and copy structure already used
on `/projects/` (case studies). Currently the page is a 2-column grid of 5
cards (logo, industry tag, feature-heavy paragraph, 4 tech tags, "Visit Site"
link). It should instead read as: what did this client actually need, what
was built, what changed.

## Structure

Replace the card grid with 5 full-width alternating sections, one per
client, following the exact pattern already in `projects/index.html`:

- Each section: `grid gap-16 md:grid-cols-2 md:items-center`, image in a
  `rounded-sm border ... bg-warm-section/bg-warm-bg` container on one side,
  copy on the other.
- Alternate image side per section: left, right, left, right, left.
- Alternate section background per section: `bg-warm-bg` /
  `bg-warm-section dark:bg-navy-dark/50`, matching case-studies exactly.
- Each section keeps 2 tags above the H2 (down from today's 4 tech-stack
  pills) — one industry tag, one build-platform tag.
- Copy block per section follows the case-studies 3-line pattern:
  `The Challenge:` / `The Approach:` / `The Result:` (case studies uses "The
  Architecture" — clients uses "The Approach" since these are simpler builds,
  not data/engineering architecture).
- CTA per section: existing "Visit Site" label and styling, linking to the
  live client URL (unchanged from today).

Page header (`<h1>Client Work</h1>`) stays. Subhead changes from "Websites
and digital products built for real clients" to "The need behind each build,
and what it took to solve it."

Meta description (title, og:description, twitter:description) updates to
match the needs-focused framing instead of "web development projects
delivered for small businesses and entrepreneurs."

Bottom of page gets a navy CTA block, matching the case-studies bottom
block's visual treatment (same classes/structure), with clients-specific
copy and a button to `../#contact`.

Nothing else on the page changes: header, off-canvas nav, footer, theme
toggle, script tags all stay exactly as-is.

## Visual assets

Reuse existing screenshots already in `/images/` — no cropping or aspect
ratio normalization (case-studies itself mixes two different aspect ratios
already, so native `width`/`height` attributes are fine, per CLAUDE.md's
CLS-prevention rule):

| Client | Image |
|---|---|
| Gurvis Miner Dispute Resolution | `images/gurvis-miner-screenshot.png` |
| Bachata Bakery | `images/place-an-order-bachata-bakery-screenshot.png` |
| Raquel Ariana | `images/raquel-ariana-homepage-screenshot.png` |
| Gregory Duane | `images/client-gregory-duane.png` |
| MLJ Signature Contracting | new capture from `https://mljsignature.com/` (only client with no existing screenshot) |

## Per-client copy

### 1. Gurvis Miner Dispute Resolution
- Tags: `Legal / Mediation`, `WordPress`
- H2: "Independent Credibility: Gurvis Miner Dispute Resolution"
- Challenge: An independent mediator needed to compete for cases against
  established firms without their staff or budget behind him.
- Approach: A WordPress build with a custom client-intake form,
  mobile-first responsive design, and optimized load times — all in on
  credibility signals up front.
- Result: A polished web presence that gives a solo practitioner the same
  digital authority as a full firm, with an intake flow that turns visitors
  into qualified leads.

### 2. Bachata Bakery
- Tags: `Food & Beverage`, `Custom Code`
- H2: "Demand Control: Bachata Bakery"
- Challenge: A one-person kitchen kept getting buried by more orders than
  it could fill, with no way to pause demand without manually turning
  customers away.
- Approach: A fully custom-coded storefront (no templates) with a presale
  window that activates and deactivates ordering on a schedule, backed by
  dynamic order forms and deep SEO work.
- Result: The kitchen controls demand instead of chasing it — orders land
  only when there's capacity to fill them.

### 3. Raquel Ariana
- Tags: `Beauty / Makeup Artist`, `Custom Code`
- H2: "Booked Appointments: Raquel Ariana"
- Challenge: A freelance makeup artist serving a four-state region was
  losing phone-browsing visitors before they ever reached out.
- Approach: A single-page site with services and pricing in a clean
  scrollable layout, integrated booking-inquiry forms, and a custom visual
  identity built to earn trust before the first message.
- Result: A mobile-first site that turns casual browsing into booked
  sessions, with a brand presence strong enough to compete for higher-end
  bridal and event work.

### 4. Gregory Duane
- Tags: `Fashion / Bridal`, `Squarespace`
- H2: "Bespoke Online, Bespoke In Person: Gregory Duane"
- Challenge: A custom suit and bridal boutique needed to sell online
  without the site feeling like a generic e-commerce template.
- Approach: A full custom design overhaul on Squarespace's commerce
  platform, layering secure checkout with appointment booking for tailored
  fittings and consultations.
- Result: An elevated, bespoke-feeling storefront that sells online and
  books consultations without diluting the boutique's handcrafted brand.

### 5. MLJ Signature Contracting
- Tags: `Construction / Contracting`, `WordPress` (correcting today's
  "Custom Code" tag, which doesn't match the existing description — this
  is a WordPress site)
- H2: "Trust Before the First Call: MLJ Signature Contracting"
- Challenge: Homeowners needed to trust a contractor before they ever
  picked up the phone, in an industry where licensing and safety
  compliance are exactly what people worry about.
- Approach: A WordPress site surfacing licensing and EPA lead-safe
  certification across three jurisdictions alongside six core service
  lines, with a service-aware inquiry form routing leads to the right team
  member.
- Result: Homeowners arrive pre-sold on credibility, and leads land with
  the right person on the first try.

## Out of scope

- No changes to `/projects/`, homepage, `/running/`, header/footer, nav,
  or theme mechanism.
- No new dependencies, no build tooling introduced.
- Existing client logos (`logo-*.png`) are no longer used on this page but
  are not deleted (may be referenced elsewhere).
