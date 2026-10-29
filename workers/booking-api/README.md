# Booking API (Cloudflare Worker)

Custom scheduling backend for `https://calvindaniel.com/book/`.

## One-time Google setup

1. Open [Google Cloud Console](https://console.cloud.google.com/) → create or select a project.
2. Enable **Google Calendar API**.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**.
   - Application type: **Desktop app** (or Web with redirect `http://127.0.0.1:53682/`).
   - Copy Client ID and Client Secret.
4. Configure OAuth consent screen (External or Internal). Add yourself as a test user if the app is in Testing.
5. From this folder:

```bash
cd workers/booking-api
npm install
set GOOGLE_CLIENT_ID=your-client-id
set GOOGLE_CLIENT_SECRET=your-client-secret
npm run auth
```

On macOS/Linux use `export` instead of `set`. The script prints a refresh token.

6. Put secrets on the Worker:

```bash
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put GOOGLE_REFRESH_TOKEN
npx wrangler secret put BOOKING_CALENDAR_ID
npx wrangler secret put BOOKING_REVIEW_SECRET
```

Use `primary` for `BOOKING_CALENDAR_ID`, or a calendar ID from Google Calendar → Settings → Integrate calendar.

`BOOKING_REVIEW_SECRET` signs review links for pending bookings (approval-hold flow). Generate a long random string; set locally in `.dev.vars` and on the Worker via `wrangler secret put`.

## Deploy

```bash
npm run deploy
```

In the Cloudflare dashboard, attach custom domain **api.calvindaniel.com** to this Worker (DNS CNAME to workers.dev or use Workers Routes).

## Local dev

```bash
npm run dev
```

Point the book page at `http://127.0.0.1:8787` via `localStorage.setItem('bookingApiBase', 'http://127.0.0.1:8787')` or the query `?api=http://127.0.0.1:8787`.

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/availability` | Open slots (ISO start times) |
| POST | `/api/book` | Body: `{ start, name, email, website?, note? }` |
| GET | `/api/health` | Liveness |

After a successful book: a tentative Calendar hold is created; Gmail emails the host at `HOST_EMAIL` (default `info@calvindaniel.com`) with Approve/Decline links; Formspree archives a copy. The guest gets a Calendar invite only after you approve.

## Product config

Edit `[vars]` in `wrangler.toml` (hours, duration, buffer, daily cap, timezone, hold window, public API base, review page URL).

| Var | Purpose |
|-----|---------|
| `HOLD_HOURS` | Hours a pending booking is held before expiry (default `48`) |
| `PUBLIC_API_BASE` | Public Worker URL (no trailing slash) for review links |
| `REVIEW_PAGE_URL` | Site page where clients approve or decline a hold |
| `FORMSPREE_ENDPOINT` | Formspree form for host notifications |

KV binding `BOOKINGS` stores pending booking records. An hourly cron (`0 * * * *`) sweeps expired holds.

## Ops checklist (approval-hold flow)

- [ ] Enable **Gmail API** in the same Google Cloud project (decline/expiry emails to guests are sent via Gmail).
- [ ] Re-run `npm run auth` (scopes must include Gmail send) and `npx wrangler secret put GOOGLE_REFRESH_TOKEN` with the new token.
- [ ] `npx wrangler secret put BOOKING_REVIEW_SECRET` (also in `.dev.vars` for local dev).
- [ ] `npm run deploy` -> `https://booking-api.calvindaniel.workers.dev`.
- [ ] Smoke: `curl -4 .../api/health` and `.../api/availability`.
- [ ] E2E: POST `/api/book` with a real slot and a test email -> `"status":"pending"`, tentative calendar event, host email with Approve/Decline/Review links.
- [ ] Open Approve link -> "Approved", event confirmed, guest invited.
- [ ] Second booking -> Decline link -> event removed, guest emailed, slot free again.
- [ ] Review page: `https://calvindaniel.com/book/review/?key=SECRET` (after the site deploy).
