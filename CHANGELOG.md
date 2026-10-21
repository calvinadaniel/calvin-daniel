# Changelog

Updates to [calvindaniel.com](https://calvindaniel.com), newest first.

## 2026-10-21

### Booking (approve-before-confirm)

- Guests request a time on `/book/`; they see **Request received**, not an instant confirm.
- Worker creates a **tentative** Google Calendar hold (slot blocked for 48 hours).
- Host is emailed via Formspree with **Approve** / **Decline** links, plus a private review queue at `/book/review/`.
- **Approve** confirms the event and sends the guest a calendar invite.
- **Decline** or **48h expiry** releases the hold and emails the guest that the time could not be confirmed.
- Availability window extended from 14 to **30 days** (still Tue–Thu business hours).
- Worker live at `https://booking-api.calvindaniel.workers.dev` (KV holds, hourly expiry cron, Gmail send for decline/expiry).

### Booking foundation (earlier in this push)

- Custom `/book/` flow with Cloudflare Worker + Google Calendar freeBusy / events (replaced mailto-only scheduling).
- Documented local Worker secrets via `.dev.vars.example`.

### Site & content

- FAQ accordion with constrained desktop width.
- Bachata Bakery work-page screenshot updated.
- **Contact** added to main navigation across pages.
- AI SEO discovery: robots/sitemap/llms files, schema, contact & privacy pages, Search Console–ready homepage structure.

### Deploy note

- Hostinger is serving commit `4941e5f` (booking approval UI).
- This changelog entry covers commits from `805c96f` through `4941e5f` relative to `origin/master` at push time.
