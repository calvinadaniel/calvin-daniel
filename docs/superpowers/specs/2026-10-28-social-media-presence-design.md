# Social Media Presence: Design

**Date:** 2026-10-28
**Owner:** Calvin Daniel
**Status:** Approved design, pending implementation plan

## Goal

Launch Instagram, Facebook, and TikTok accounts that:

1. Communicate the business (websites + new social media service).
2. Generate leads that book a free 20-minute review.
3. Act as a live portfolio proving what Calvin can do for a client's social profiles.

## Decisions

| Topic | Decision |
|---|---|
| New service | Add paid social media service: profile setup, monthly content creation, scheduling/posting |
| Out of scope (for now) | Paid ads, DM/lead automation, monthly reporting (possible future upsells) |
| Identity | One personal brand under "Calvin Daniel" on all three platforms |
| Audience | Any small business, anywhere. Content is broad; proof comes from real (often local) businesses |
| Approach | Profile Makeovers as the core series, with tips mixed in |
| Capacity | One ~2-hour weekly batch session + 10–15 min/day engagement; comfortable on camera |

## 1. Account setup and positioning

**Handle:** `@calvindaniel06` on all three platforms (matches the existing TikTok linked from the site). Facebook Page username is also `calvindaniel06`.

**Name field:**
- Instagram and Facebook: `Calvin Daniel | Social & Websites for Small Biz`
- TikTok (30-character limit): `Calvin Daniel | Social + Web`

**Bio:**
- Instagram and Facebook:
  > I make small business profiles that get booked. Social content, profile makeovers, and websites. DM "MAKEOVER" for a free profile review.
- TikTok (80-character limit):
  > Profile makeovers + websites for small biz. DM MAKEOVER for a free review

**Link:** single link to a new page, `calvindaniel.com/social/`, that explains the service, shows makeover case studies, and ends in the free 20-minute review form. No Linktree.

**Platform setup:**
- **Instagram:** Professional account. Pin the 3 best makeovers. Highlights: Makeovers, Services, Process, Results, About.
- **Facebook:** Page (not personal profile) named to match, linked to Instagram via Meta Business Suite for a shared inbox and scheduler. Enable "Book Now" or "Send Message" button.
- **TikTok:** Business account with website link enabled.

**Visual identity:** existing site brand (navy / off-white / orange, existing display font). One consistent cover template for Reels and TikToks.

**Service packages (for `/social/`):**
- **Profile Makeover: $495 one-time.** Setup/refresh across Instagram, Facebook, TikTok. Seed makeover clients get it free or ~$250 in exchange for a testimonial and permission to post the before/after.
- **Content & Posting:** monthly retainer for content creation plus scheduling.
- **Website + Social Bundle: $1,995.** Site That Books ($1,750) plus Profile Makeover at a discount.

The Content & Posting price is not published: the page shows "Quoted after your free review." Market reference for quoting: Philadelphia agencies charge $750–$1,550/month; newer US freelancers $800–$2,200/month.

**Pricing research (2026-10-28):** Profile setup across 3 platforms runs $400–$650 one-time (Momentum Digital, Philadelphia: $500; Backroads Digital: $650; KizilCo: $499). Philadelphia agency retainers: LYFE Marketing $750 (images) to $1,350 (with TikTok/Reels video); Kin Creative House $750–$1,200; Momentum $1,000. Short-form video alone: $69–$120 per video locally.

## 2. Content system

**Pillars:**

| Pillar | Share | Example |
|---|---|---|
| Profile Makeovers | 50% | Tear down a real profile, show the fixed version |
| Quick fixes (tips) | 25% | "Your bio should say what you do and where. 10-second fix." |
| Behind the build | 15% | Screen-recorded timelapse designing a client's content or site |
| Proof and offers | 10% | Client results, testimonials, "2 makeover spots open this month" |

**Makeover video format (30–45 sec, 9:16, captioned):**
1. 0–3s: hook. Profile on screen with one specific flaw circled ("This bakery has 400 followers and no way to order.").
2. 3–25s: three fixes, each a quick screen recording of the edit in Canva or Figma.
3. 25–40s: after view side by side with the before.
4. Close: "DM MAKEOVER and I'll review yours."

**Weekly 2-hour batch:**
- 30 min: pick 3 profiles (outreach list, local businesses, or "MAKEOVER" DMs) and draft fixes.
- 60 min: film 3 makeover videos + 1 tip video (talking head + screen recording), caption in CapCut.
- 30 min: write captions and schedule (Meta Business Suite for Instagram/Facebook, TikTok scheduler).

**Cadence per week:**
- 4 videos, each cross-posted to TikTok, Instagram Reels, and Facebook.
- 1 Instagram carousel recutting the best makeover's before/after.
- 2–3 Stories (polls, "spots open").

**Ethics rule:** only tear down public profiles, keep critique constructive, and DM the owner the full review afterward. That DM doubles as a warm first-touch outreach message.

**Daily engagement (10–15 min):** reply to every comment and DM within 24 hours; comment on 5 posts from local business pages or small-business owner accounts.

**Copy rules:** follow the social skill's "No AI tells" list (no em dashes, no broetry, no engagement bait, no "it's not X, it's Y" reveals).

## 3. Lead pipeline, launch, and measurement

**Pipeline:**
1. Viewer watches a makeover video.
2. Viewer DMs "MAKEOVER" (or comments; Calvin follows up by DM).
3. Saved reply within 24 hours: asks business type and profile link, and links to book the free 20-minute review on `/social/`.
4. Review via Loom or live call, then a package quote.
5. Signed client's before/after becomes the next makeover post.

**Tools (free):**
- Meta Business Suite: saved replies, shared Instagram/Facebook inbox, scheduling.
- TikTok inbox and scheduler.
- Google Sheet lead tracker with columns: date, source platform, business, stage, value.
- `/social/` form via Formspree (same as the existing contact form, submits without page reload), with a "How did you find me?" field for attribution.

**First 30 days:**
- **Week 1:** create and brand all three accounts; build `/social/`; line up 2–3 free or discounted seed makeovers (Bachata Bakery plus outreach-list businesses).
- **Week 2:** publish 6–8 videos before any promotion so the grid is full; pin the best 3.
- **Week 3:** start the regular cadence; share makeovers in local Facebook groups where rules allow; DM each featured business.
- **Week 4:** first weekly review; adjust hooks and formats.

**Weekly review (15 min, during the batch):** track profile visits, "MAKEOVER" DMs, booked reviews, and clients signed.

**90-day target:** 1–2 paying social clients and 3+ case studies.

**Diagnosis rules:**
- Views but no DMs: fix the CTA or the offer.
- No views: fix hooks; test the first 3 seconds.
- DMs but no bookings: fix the reply script or the `/social/` page.

## Website changes required

- New `/social/` page following `CLAUDE.md` conventions (mobile-first, BEM, existing font stack, dark/light via `[data-theme]`, Formspree form, WebP images with width/height).
- Add Instagram and Facebook links next to the existing TikTok link in site footers and the `sameAs` schema arrays, once accounts exist.
- Add the Profile Makeover ($495) and Website + Social Bundle ($1,995) to the packages section and the `OfferCatalog` schema on `index.html`.
