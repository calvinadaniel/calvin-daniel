# Booking approval hold — design

**Date:** 2026-10-20  
**Status:** Ready for review  
**Scope:** Change `/book/` from instant confirm to host-approved requests with a 48-hour slot hold.

### Spec self-review

- Review page locked to static `/book/review/` (not Worker-served HTML).
- Approve/decline action URLs point at the Worker (`*.workers.dev`); review UI is on the site.
- No open placeholders; guest decline/expiry mail path is Gmail API (requires re-auth).

## Problem

Today, submit creates a confirmed Google Calendar event, invites the guest immediately, and emails the host via Formspree. There is no chance to approve or decline before the customer is told they are booked.

## Goals

- Hold the selected slot so others cannot take it while the host decides.
- Host can approve or decline via email links and a private review page.
- Guest only receives a calendar invite after approve.
- Unanswered requests auto-release after 48 hours.
- Guest is told clearly that the request is pending, not confirmed.

## Non-goals

- Full auth / multi-user admin.
- Reschedule UI for guests.
- Payment or deposits.
- Moving DNS to `api.calvindaniel.com` (can stay on `*.workers.dev` for this work).

## Decisions (approved)

| Topic | Choice |
|-------|--------|
| Slot while pending | Hold (tentative busy) |
| Host actions | Email links **and** private review page |
| Hold TTL | 48 hours |
| Implementation shape | Tentative Calendar event + Worker KV + signed tokens |

## Customer experience

1. Guest picks day/slot and submits name, email, optional website/note (unchanged fields).
2. Success UI says the request is **received**, not confirmed. Copy direction: “Request received. I’ll email a calendar invite once I confirm (usually within 48 hours).”
3. No Google Calendar invite until the host approves.
4. On decline or 48h expiry: guest gets a short email that the time could not be confirmed and they can book again.

## Host experience

1. **Email (Formspree):** On each new request, host receives name, email, time, note/website, calendar link to the tentative event, plus **Approve** and **Decline** URLs (HMAC-signed; valid until the hold expires or the request is settled).
2. **Review page:** Static `https://calvindaniel.com/book/review/` lists pending requests (fetches Worker API) with Approve / Decline. Protected by `BOOKING_REVIEW_SECRET` in the query string (`?key=`) — shared secret, not a full login system.
3. **Approve:** Tentative event → confirmed; guest added as attendee; `sendUpdates=all` so Google emails the invite; KV status → `approved`; host Formspree optional “approved” note not required.
4. **Decline:** Delete tentative event; free the slot; email guest “couldn’t confirm”; KV → `declined`.
5. Stale links show a simple status (“Already approved”, “Already declined”, “Expired”).

## Data and Calendar behavior

### On submit (`POST /api/book`)

1. Validate slot against current open slots (freeBusy + rules), same as today.
2. Create Google Calendar event:
   - `status: "tentative"`
   - **No attendees** (avoids premature invite)
   - Summary: `Pending: {EVENT_TITLE} — {name}`
   - Description: source URL, website, note
3. Write KV record, e.g. key `pending:{id}`:

```json
{
  "id": "…",
  "status": "pending",
  "start": "ISO",
  "end": "ISO",
  "name": "…",
  "email": "…",
  "website": "…",
  "note": "…",
  "eventId": "google-event-id",
  "createdAt": "ISO",
  "expiresAt": "ISO"
}
```

4. Email host via Formspree with approve/decline links.
5. Return `{ ok: true, status: "pending", … }` so the UI can show the pending success state.

### Availability

No special-case list of holds required: tentative events already appear as busy in freeBusy, so the slot stays held.

### Approve (`GET` or `POST /api/booking/approve?id=&sig=`)

1. Verify HMAC signature and that record is `pending` and not past `expiresAt`.
2. Patch/update Calendar event: `status: "confirmed"`, add attendee, `sendUpdates=all`.
3. Mark KV `approved`.
4. Return a small HTML status page suitable for email-link clicks.

### Decline (`…/decline`)

1. Verify signature and pending status.
2. Delete Calendar event (or cancel).
3. Send guest decline email (see Email).
4. Mark KV `declined`.
5. Status HTML page.

### Expiry

- Cloudflare Cron Trigger (e.g. hourly) on the Worker.
- Also opportunistic cleanup when serving availability: any `pending` past `expiresAt` → same as decline path without host action (status `expired`, guest expiry email).
- TTL on KV keys can match or slightly exceed 48h as a safety net.

## Email

| Event | Channel | Recipient |
|-------|---------|-----------|
| New pending request | Formspree (existing form) | Host (`info@` via Formspree) |
| Approved | Google Calendar invite (`sendUpdates=all`) | Guest |
| Declined | Gmail API send | Guest |
| Expired | Gmail API send | Guest |

Gmail send uses the same OAuth client with an added `gmail.send` scope. One-time re-run of `npm run auth` and update of `GOOGLE_REFRESH_TOKEN` secret.

Decline/expiry body: short plain text — time couldn’t be confirmed; link back to `/book/`.

## Review page

- Route: `/book/review/` on the static site (Hostinger), matching existing book page chrome.
- Guest opens with `?key={BOOKING_REVIEW_SECRET}` (stored in bookmark; also pasted into Formspree email as the review URL).
- Loads `GET /api/booking/pending?key=…` from the Worker.
- Lists pending rows; Approve / Decline hit the signed Worker endpoints (same as email links).
- Not linked from public nav.

## Secrets / config

| Name | Purpose |
|------|---------|
| Existing Google + Formspree secrets/vars | Unchanged roles |
| `BOOKING_REVIEW_SECRET` | Review page + HMAC for action links |
| `HOLD_HOURS` (var, default `48`) | Hold duration |
| KV namespace binding `BOOKINGS` | Pending records |

## API sketch

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/book` | Creates pending hold (behavior change) |
| GET | `/api/booking/pending` | Host-only list |
| GET/POST | `/api/booking/approve` | Signed |
| GET/POST | `/api/booking/decline` | Signed |
| Scheduled | cron | Expiry sweep |

## UI changes

- `book/index.html` + `booking.js`: pending success copy; do not imply confirmed.
- New `book/review/` (minimal, matches site chrome, gated by secret).
- Privacy copy: mention pending review / hold if needed.

## Testing

- Book a slot → appears tentative on Calendar; guest has no invite; host Formspree has links.
- Second visitor cannot take the same slot.
- Approve link → confirmed event + guest invite; review list empty for that id.
- Decline link → event gone; guest email; slot open again.
- Fake clock / short `HOLD_HOURS` in staging → expiry path.
- Invalid/reuse signature → status page, no double-apply.

## Out of scope follow-ups

- Custom domain `api.calvindaniel.com`.
- Guest-facing “check request status” page.
- SMS / Slack host alerts.
