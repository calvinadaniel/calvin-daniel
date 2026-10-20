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
```

Use `primary` for `BOOKING_CALENDAR_ID`, or a calendar ID from Google Calendar → Settings → Integrate calendar.

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

## Product config

Edit `[vars]` in `wrangler.toml` (hours, duration, buffer, daily cap, timezone).
