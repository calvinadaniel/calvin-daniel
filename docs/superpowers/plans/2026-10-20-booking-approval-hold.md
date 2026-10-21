# Booking Approval Hold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change `/book/` so guest submissions create a 48-hour tentative Calendar hold; the host approves or declines via signed email links and a private review page before the guest gets a calendar invite.

**Architecture:** Cloudflare Worker creates tentative Google Calendar events (no attendees), stores pending records in Workers KV, and exposes signed approve/decline endpoints plus a host-only pending list. Formspree notifies the host with action links; Gmail API emails the guest on decline/expiry; Calendar `sendUpdates=all` invites the guest only on approve. Static `/book/review/` lists pendings; `/book/` success copy becomes “request received.”

**Tech Stack:** Cloudflare Workers + KV + Cron Triggers, Wrangler, Google Calendar API, Gmail API (`gmail.send`), Formspree, vanilla HTML/CSS/JS on Hostinger.

**Spec:** `docs/superpowers/specs/2026-10-20-booking-approval-hold-design.md`

## Global Constraints

- Do not replace off-canvas nav, `[data-theme]` mechanism, or hero-town animation.
- Primary email remains `info@calvindaniel.com`; Formspree form stays `https://formspree.io/f/xojgvdjq`.
- No new third-party JS libraries on the static site; Worker stays plain JS modules (no GSAP).
- Hold default is 48 hours (`HOLD_HOURS=48`).
- Guest must not receive a Calendar invite until approve.
- Commit only when the user explicitly asks (plan commit steps are optional checkpoints).
- Deploy Worker with `CLOUDFLARE_API_TOKEN`; Hostinger static deploy only ships git HEAD.

---

## File structure

| Path | Responsibility |
|------|----------------|
| `workers/booking-api/wrangler.toml` | KV binding, cron, `HOLD_HOURS`, `PUBLIC_API_BASE`, `REVIEW_PAGE_URL` |
| `workers/booking-api/src/tokens.js` | HMAC sign/verify for approve/decline |
| `workers/booking-api/src/pending.js` | KV CRUD + list + expire helpers |
| `workers/booking-api/src/google.js` | Calendar create/patch/delete; Gmail send |
| `workers/booking-api/src/notify.js` | Host Formspree with approve/decline URLs |
| `workers/booking-api/src/status-html.js` | Tiny HTML responses for email-link clicks |
| `workers/booking-api/src/config.js` | Parse new vars |
| `workers/booking-api/src/index.js` | Routes: book (pending), pending list, approve, decline, cron |
| `workers/booking-api/scripts/auth.mjs` | Add `gmail.send` scope |
| `workers/booking-api/src/tokens.test.js` | Node tests for HMAC |
| `workers/booking-api/.dev.vars.example` | Document `BOOKING_REVIEW_SECRET` |
| `book/index.html` + `js/booking.js` | Pending success copy / button label |
| `book/review/index.html` + `js/booking-review.js` | Host review UI |
| `css/booking.css` | Minimal review-list styles if needed |
| `privacy/index.html` | Pending-hold wording |
| `workers/booking-api/README.md` | Ops: KV, secret, re-auth, review URL |

---

### Task 1: KV, cron, and config wiring

**Files:**
- Modify: `workers/booking-api/wrangler.toml`
- Modify: `workers/booking-api/src/config.js`
- Modify: `workers/booking-api/.dev.vars.example`
- Modify: `workers/booking-api/README.md`

**Interfaces:**
- Produces: `parseConfig(env)` includes `holdHours: number`, `publicApiBase: string`, `reviewPageUrl: string`, `formspreeEndpoint: string` (existing). Env binding `env.BOOKINGS` (KV). Secret `BOOKING_REVIEW_SECRET` (not in `[vars]`).

- [ ] **Step 1: Create the KV namespace**

```bash
cd workers/booking-api
npx wrangler kv namespace create BOOKINGS
```

Expected: JSON with `id`. Copy that id into `wrangler.toml`.

- [ ] **Step 2: Update `wrangler.toml`**

Add (use the real KV id from Step 1):

```toml
workers_dev = true

[[kv_namespaces]]
binding = "BOOKINGS"
id = "<PASTE_KV_ID>"

[triggers]
crons = ["0 * * * *"]

[vars]
# ... existing vars ...
HOLD_HOURS = "48"
PUBLIC_API_BASE = "https://booking-api.calvindaniel.workers.dev"
REVIEW_PAGE_URL = "https://calvindaniel.com/book/review/"
FORMSPREE_ENDPOINT = "https://formspree.io/f/xojgvdjq"
```

- [ ] **Step 3: Extend `parseConfig`**

In `workers/booking-api/src/config.js`, add to the returned object:

```js
holdHours: Number(env.HOLD_HOURS || 48),
publicApiBase: String(env.PUBLIC_API_BASE || '').replace(/\/$/, ''),
reviewPageUrl: String(env.REVIEW_PAGE_URL || 'https://calvindaniel.com/book/review/'),
formspreeEndpoint: env.FORMSPREE_ENDPOINT || '',
```

- [ ] **Step 4: Document secrets in `.dev.vars.example`**

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
BOOKING_CALENDAR_ID=primary
BOOKING_REVIEW_SECRET=
```

- [ ] **Step 5: Smoke-check config parse locally**

```bash
node -e "import { parseConfig } from './src/config.js'; console.log(parseConfig({ HOLD_HOURS: '48', PUBLIC_API_BASE: 'https://booking-api.calvindaniel.workers.dev/', FORMSPREE_ENDPOINT: 'https://formspree.io/f/xojgvdjq' }))"
```

Expected: `holdHours: 48`, `publicApiBase` without trailing slash.

---

### Task 2: HMAC token helpers

**Files:**
- Create: `workers/booking-api/src/tokens.js`
- Create: `workers/booking-api/src/tokens.test.js`
- Modify: `workers/booking-api/package.json` (add `"test": "node --test src/tokens.test.js"`)

**Interfaces:**
- Produces:
  - `signAction(secret: string, action: 'approve'|'decline', id: string): Promise<string>`
  - `verifyAction(secret: string, action: 'approve'|'decline', id: string, sig: string): Promise<boolean>`
- Consumes: Web Crypto (`crypto.subtle`) — available in Workers and Node 20+.

- [ ] **Step 1: Write failing tests**

Create `workers/booking-api/src/tokens.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { signAction, verifyAction } from './tokens.js';

const secret = 'test-review-secret-32chars-minimum!!';

test('signAction is stable for same inputs', async () => {
  const a = await signAction(secret, 'approve', 'abc');
  const b = await signAction(secret, 'approve', 'abc');
  assert.equal(a, b);
  assert.match(a, /^[0-9a-f]+$/);
});

test('verifyAction accepts valid signature', async () => {
  const sig = await signAction(secret, 'decline', 'xyz');
  assert.equal(await verifyAction(secret, 'decline', 'xyz', sig), true);
});

test('verifyAction rejects wrong action or id', async () => {
  const sig = await signAction(secret, 'approve', 'id1');
  assert.equal(await verifyAction(secret, 'decline', 'id1', sig), false);
  assert.equal(await verifyAction(secret, 'approve', 'id2', sig), false);
  assert.equal(await verifyAction(secret, 'approve', 'id1', 'deadbeef'), false);
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd workers/booking-api
node --test src/tokens.test.js
```

Expected: FAIL — cannot find module `./tokens.js`.

- [ ] **Step 3: Implement `tokens.js`**

```js
const enc = new TextEncoder();

const hmacHex = async (secret, message) => {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const signAction = async (secret, action, id) => {
  if (!secret) throw new Error('BOOKING_REVIEW_SECRET missing');
  return hmacHex(secret, `${action}:${id}`);
};

export const verifyAction = async (secret, action, id, sig) => {
  if (!secret || !sig) return false;
  const expected = await signAction(secret, action, id);
  if (expected.length !== sig.length) return false;
  let ok = 0;
  for (let i = 0; i < expected.length; i++) {
    ok |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return ok === 0;
};
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
node --test src/tokens.test.js
```

Expected: 3 passing.

- [ ] **Step 5: Add npm test script**

In `package.json` scripts: `"test": "node --test src/tokens.test.js"`.

---

### Task 3: Pending KV store

**Files:**
- Create: `workers/booking-api/src/pending.js`

**Interfaces:**
- Consumes: `env.BOOKINGS` (KVNamespace), `holdHours` from config.
- Produces:
  - `createPendingId(): string` — `crypto.randomUUID()`
  - `putPending(kv, record): Promise<void>` — key `pending:{id}`, expirationTtl = holdHours*3600 + 86400
  - `getPending(kv, id): Promise<object|null>`
  - `listPending(kv): Promise<object[]>` — status === `pending` and `expiresAt` > now
  - `setPendingStatus(kv, id, status): Promise<object|null>` — status one of `approved|declined|expired`

Record shape:

```js
{
  id, status: 'pending', start, end, name, email, website, note,
  eventId, createdAt, expiresAt
}
```

- [ ] **Step 1: Implement `pending.js`**

```js
export const createPendingId = () => crypto.randomUUID();

const keyFor = (id) => `pending:${id}`;

export const putPending = async (kv, record, holdHours) => {
  const ttl = Math.max(3600, Math.floor(holdHours * 3600) + 86400);
  await kv.put(keyFor(record.id), JSON.stringify(record), { expirationTtl: ttl });
};

export const getPending = async (kv, id) => {
  const raw = await kv.get(keyFor(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setPendingStatus = async (kv, id, status) => {
  const rec = await getPending(kv, id);
  if (!rec) return null;
  rec.status = status;
  await kv.put(keyFor(id), JSON.stringify(rec), { expirationTtl: 60 * 60 * 24 * 30 });
  return rec;
};

export const listPending = async (kv) => {
  const out = [];
  let cursor;
  do {
    const page = await kv.list({ prefix: 'pending:', cursor });
    for (const key of page.keys) {
      const rec = await getPending(kv, key.name.replace(/^pending:/, ''));
      if (!rec || rec.status !== 'pending') continue;
      if (new Date(rec.expiresAt).getTime() <= Date.now()) continue;
      out.push(rec);
    }
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);
  out.sort((a, b) => a.start.localeCompare(b.start));
  return out;
};

export const listExpiredPending = async (kv) => {
  const out = [];
  let cursor;
  do {
    const page = await kv.list({ prefix: 'pending:', cursor });
    for (const key of page.keys) {
      const rec = await getPending(kv, key.name.replace(/^pending:/, ''));
      if (!rec || rec.status !== 'pending') continue;
      if (new Date(rec.expiresAt).getTime() > Date.now()) continue;
      out.push(rec);
    }
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);
  return out;
};
```

- [ ] **Step 2: Manual sanity check (optional local)**

No CF KV in plain Node — verify exports load:

```bash
node -e "import * as p from './src/pending.js'; console.log(Object.keys(p))"
```

Expected: keys include `putPending`, `listPending`, `listExpiredPending`.

---

### Task 4: Google Calendar + Gmail helpers

**Files:**
- Modify: `workers/booking-api/src/google.js`
- Modify: `workers/booking-api/scripts/auth.mjs`

**Interfaces:**
- Produces:
  - `createEvent(accessToken, calendarId, event, { sendUpdates })` — default `'none'` for holds
  - `updateEvent(accessToken, calendarId, eventId, patch, { sendUpdates })`
  - `deleteEvent(accessToken, calendarId, eventId)`
  - `sendMail(accessToken, { to, subject, body })` — Gmail API raw RFC822

- [ ] **Step 1: Change `createEvent` to accept sendUpdates option**

Replace `createEvent` so callers pass updates mode:

```js
export const createEvent = async (
  accessToken,
  calendarId,
  event,
  { sendUpdates = 'none' } = {}
) => {
  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`
  );
  url.searchParams.set('sendUpdates', sendUpdates);
  // ... existing fetch body JSON.stringify(event)
};
```

- [ ] **Step 2: Add `updateEvent` and `deleteEvent`**

```js
export const updateEvent = async (
  accessToken,
  calendarId,
  eventId,
  patch,
  { sendUpdates = 'all' } = {}
) => {
  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`
  );
  url.searchParams.set('sendUpdates', sendUpdates);
  const res = await fetch(url.toString(), {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patch),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'events.patch failed');
  return data;
};

export const deleteEvent = async (accessToken, calendarId, eventId) => {
  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`
  );
  url.searchParams.set('sendUpdates', 'none');
  const res = await fetch(url.toString(), {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok && res.status !== 404) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error?.message || 'events.delete failed');
  }
};
```

- [ ] **Step 3: Add `sendMail` (Gmail API)**

```js
export const sendMail = async (accessToken, { to, subject, body }) => {
  const from = 'me';
  const raw = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    body,
  ].join('\r\n');
  const encoded = btoa(unescape(encodeURIComponent(raw)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/${from}/messages/send`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encoded }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'gmail.send failed');
  return data;
};
```

- [ ] **Step 4: Add Gmail scope to `auth.mjs`**

```js
const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.freebusy',
  'https://www.googleapis.com/auth/gmail.send',
].join(' ');
```

- [ ] **Step 5: Re-auth and update secrets (manual, needs browser)**

```powershell
cd workers/booking-api
# load .dev.vars into env, then:
npm run auth
# copy GOOGLE_REFRESH_TOKEN into .dev.vars
npx wrangler secret put GOOGLE_REFRESH_TOKEN
```

Enable **Gmail API** in Google Cloud Console for the same project before auth.

---

### Task 5: Status HTML + host notify with action links

**Files:**
- Create: `workers/booking-api/src/status-html.js`
- Modify: `workers/booking-api/src/notify.js`

**Interfaces:**
- Produces: `statusPage({ title, message }): Response` — `text/html`
- Produces: `notifyHost(env, payload)` where payload also includes `approveUrl`, `declineUrl`, `reviewUrl`

- [ ] **Step 1: Implement `status-html.js`**

```js
export const statusPage = ({ title, message }) => {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${escapeHtml(title)}</title>
<style>body{font-family:system-ui,sans-serif;max-width:32rem;margin:3rem auto;padding:0 1rem;line-height:1.5;color:#1a1a1a}h1{font-size:1.35rem}</style></head>
<body><h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p>
<p><a href="https://calvindaniel.com/book/review/">Review queue</a> · <a href="https://calvindaniel.com/book/">Booking page</a></p></body></html>`;
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
```

- [ ] **Step 2: Update `notifyHost` message body**

Include in `lines` / Formspree fields:

```
Approve: ${payload.approveUrl}
Decline: ${payload.declineUrl}
Review queue: ${payload.reviewUrl}
```

Keep `_subject` as `Booking request: ${name} — ${label}` (pending, not “New booking” confirmed).

---

### Task 6: Book → pending hold + approve/decline/list/cron routes

**Files:**
- Modify: `workers/booking-api/src/index.js`

**Interfaces:**
- Consumes: tokens, pending, google, notify, status-html, config
- Produces HTTP:
  - `POST /api/book` → `{ ok, status: 'pending', label, expiresAt, id }`
  - `GET /api/booking/pending?key=` → `{ pending: [...] }` if key matches `BOOKING_REVIEW_SECRET`
  - `GET /api/booking/approve?id=&sig=` → HTML status
  - `GET /api/booking/decline?id=&sig=` → HTML status
  - `scheduled(event, env, ctx)` → expire sweep

- [ ] **Step 1: Rewrite `handleBook` to create tentative hold**

Core behavior:

```js
// after slot validation...
const id = createPendingId();
const createdAt = new Date();
const expiresAt = new Date(createdAt.getTime() + config.holdHours * 3600 * 1000);
const event = await createEvent(
  token,
  config.calendarId,
  {
    summary: `Pending: ${config.eventTitle} — ${name}`,
    description: descriptionParts.join('\n'),
    start: { dateTime: start.toISOString() },
    end: { dateTime: end.toISOString() },
    status: 'tentative',
    reminders: { useDefault: false, overrides: [] },
  },
  { sendUpdates: 'none' }
);
const record = {
  id,
  status: 'pending',
  start: start.toISOString(),
  end: end.toISOString(),
  name,
  email,
  website,
  note,
  eventId: event.id,
  createdAt: createdAt.toISOString(),
  expiresAt: expiresAt.toISOString(),
};
await putPending(env.BOOKINGS, record, config.holdHours);

const secret = env.BOOKING_REVIEW_SECRET;
const approveSig = await signAction(secret, 'approve', id);
const declineSig = await signAction(secret, 'decline', id);
const approveUrl = `${config.publicApiBase}/api/booking/approve?id=${encodeURIComponent(id)}&sig=${approveSig}`;
const declineUrl = `${config.publicApiBase}/api/booking/decline?id=${encodeURIComponent(id)}&sig=${declineSig}`;
const reviewUrl = `${config.reviewPageUrl}?key=${encodeURIComponent(secret)}`;

await notifyHost(env, { name, email, website, note, start: record.start, label, htmlLink: event.htmlLink, approveUrl, declineUrl, reviewUrl });

return json({ ok: true, status: 'pending', id, label, expiresAt: record.expiresAt, start: record.start });
```

Require `env.BOOKINGS` and `env.BOOKING_REVIEW_SECRET` in `requireSecrets` (or separate check returning 503).

- [ ] **Step 2: Implement approve handler**

```js
// verify sig; load pending; if not pending → statusPage already handled
// if expired → treat as expired path
await updateEvent(token, calendarId, rec.eventId, {
  status: 'confirmed',
  summary: `${config.eventTitle} — ${rec.name}`,
  attendees: [{ email: rec.email, displayName: rec.name }],
}, { sendUpdates: 'all' });
await setPendingStatus(kv, id, 'approved');
return statusPage({ title: 'Approved', message: `Invite sent to ${rec.email} for ${rec.start}.` });
```

- [ ] **Step 3: Implement decline handler**

```js
await deleteEvent(token, calendarId, rec.eventId);
await sendMail(token, {
  to: rec.email,
  subject: 'Could not confirm your site review time',
  body: `Hi ${rec.name},\n\nI could not confirm the time you requested (${label}).\n\nPick another slot: https://calvindaniel.com/book/\n\n— Calvin`,
});
await setPendingStatus(kv, id, 'declined');
return statusPage({ title: 'Declined', message: 'Hold released and guest emailed.' });
```

- [ ] **Step 4: Implement `GET /api/booking/pending`**

If `url.searchParams.get('key') !== env.BOOKING_REVIEW_SECRET` → 401 JSON.  
Else return `{ pending: await listPending(env.BOOKINGS) }`.

- [ ] **Step 5: Export `scheduled` for cron + shared `expirePendings(env)`**

```js
export default {
  async fetch(request, env, ctx) { /* ... */ },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(expirePendings(env));
  },
};

async function expirePendings(env) {
  const config = parseConfig(env);
  const token = await getAccessToken(env);
  const expired = await listExpiredPending(env.BOOKINGS);
  for (const rec of expired) {
    try {
      await deleteEvent(token, config.calendarId, rec.eventId);
      await sendMail(token, { to: rec.email, subject: '...', body: '...' });
      await setPendingStatus(env.BOOKINGS, rec.id, 'expired');
    } catch (e) {
      console.error('expire failed', rec.id, e);
    }
  }
}
```

Also call `expirePendings` opportunistically at the start of `handleAvailability` via `ctx.waitUntil` if `ctx` is threaded through (or await briefly). Prefer `ctx.waitUntil` from `fetch`.

- [ ] **Step 6: Wire routes in `fetch`**

```js
if (method === 'GET' && path === '/api/booking/pending') { ... }
if (method === 'GET' && path === '/api/booking/approve') { ... }
if (method === 'GET' && path === '/api/booking/decline') { ... }
```

Approve/decline return HTML (CORS less critical); still attach CORS on JSON routes.

- [ ] **Step 7: Local/dev smoke**

```bash
# ensure BOOKING_REVIEW_SECRET in .dev.vars
npm run dev
# in another shell:
curl -4 -s http://127.0.0.1:8787/api/health
```

Expected: `{"ok":true}`. Full book test against Google in Task 9.

---

### Task 7: Guest UI — pending success copy

**Files:**
- Modify: `book/index.html` (done step copy + submit button)
- Modify: `js/booking.js`

- [ ] **Step 1: Update done-step markup in `book/index.html`**

Replace success block with:

```html
<div class="booking__step" data-step="done">
  <div class="booking__success">
    <h2>Request received.</h2>
    <p class="booking__success-time" data-done-time></p>
    <p>I&rsquo;ll email a calendar invite once I confirm (usually within 48 hours). No invite means it is not confirmed yet.</p>
    <p class="mt-6"><a href="../" class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-orange hover:opacity-80 transition-opacity">Back to home</a></p>
  </div>
</div>
```

Change submit button label to `Request this time`.

- [ ] **Step 2: Update `booking.js` submit button restore text**

```js
submitBtn.textContent = 'Request this time';
```

(both initial HTML and `.finally` restore).

- [ ] **Step 3: Manual UI check**

Open `book/index.html` locally (or live after deploy). Confirm copy reads pending, not “You’re booked.”

---

### Task 8: Host review page

**Files:**
- Create: `book/review/index.html`
- Create: `js/booking-review.js`
- Modify: `css/booking.css` (add `.booking-review*` rules)
- Modify: `privacy/index.html` (one sentence on pending holds)

**Interfaces:**
- Consumes: `GET {api}/api/booking/pending?key=`
- Approve/Decline: navigate to Worker signed URLs returned in each pending row **or** build URLs client-side only if API returns `approveUrl`/`declineUrl`.

Prefer API list response includes pre-signed URLs so the review page never embeds the HMAC logic:

```js
// in pending list handler, map each record:
{
  ...rec,
  approveUrl: `${publicApiBase}/api/booking/approve?id=...&sig=...`,
  declineUrl: `${publicApiBase}/api/booking/decline?id=...&sig=...`,
}
```

Do **not** return the raw `BOOKING_REVIEW_SECRET` in JSON.

- [ ] **Step 1: Extend pending list JSON with signed URLs** (in `index.js` from Task 6)

- [ ] **Step 2: Create `book/review/index.html`**

Clone chrome from `book/index.html` (header/footer/theme). Main content:

```html
<section class="...">
  <h1>Booking requests</h1>
  <p class="booking__status" data-review-status></p>
  <ul class="booking-review__list" data-review-list></ul>
</section>
<script src="../../js/booking-review.js" defer></script>
```

No public nav link to this page.

- [ ] **Step 3: Implement `js/booking-review.js`**

```js
document.addEventListener('DOMContentLoaded', function () {
  var params = new URLSearchParams(location.search);
  var key = params.get('key') || '';
  var apiBase =
    params.get('api') ||
    localStorage.getItem('bookingApiBase') ||
    'https://booking-api.calvindaniel.workers.dev';
  var statusEl = document.querySelector('[data-review-status]');
  var listEl = document.querySelector('[data-review-list]');
  if (!key) {
    statusEl.textContent = 'Add ?key=… (your review secret) to open this queue.';
    return;
  }
  fetch(apiBase.replace(/\/$/, '') + '/api/booking/pending?key=' + encodeURIComponent(key))
    .then(function (r) { return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || 'Unauthorized'); return d; }); })
    .then(function (data) {
      var rows = data.pending || [];
      if (!rows.length) { statusEl.textContent = 'No pending requests.'; listEl.innerHTML = ''; return; }
      statusEl.textContent = rows.length + ' pending';
      listEl.innerHTML = rows.map(function (p) {
        return (
          '<li class="booking-review__item">' +
          '<p><strong>' + escapeHtml(p.name) + '</strong> · ' + escapeHtml(p.email) + '</p>' +
          '<p>' + escapeHtml(p.start) + '</p>' +
          (p.note ? '<p>' + escapeHtml(p.note) + '</p>' : '') +
          '<p><a class="booking-review__approve" href="' + p.approveUrl + '">Approve</a> · ' +
          '<a class="booking-review__decline" href="' + p.declineUrl + '">Decline</a></p>' +
          '</li>'
        );
      }).join('');
    })
    .catch(function (e) { statusEl.textContent = e.message || 'Could not load.'; });
  function escapeHtml(s) { /* same as status-html */ }
});
```

- [ ] **Step 4: Add minimal CSS** for `.booking-review__list`, `__item`, approve (orange) / decline (muted).

- [ ] **Step 5: Privacy sentence**

In `privacy/index.html`, note that booking requests are held pending confirmation for up to 48 hours before a calendar invite is sent.

---

### Task 9: Deploy, secrets, end-to-end test

**Files:**
- Modify: `workers/booking-api/README.md` (final ops checklist)

- [ ] **Step 1: Put `BOOKING_REVIEW_SECRET`**

```powershell
# generate
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
npx wrangler secret put BOOKING_REVIEW_SECRET
# also add to .dev.vars
```

- [ ] **Step 2: Confirm Gmail API enabled + refresh token updated** (Task 4 Step 5)

- [ ] **Step 3: Deploy Worker**

```bash
cd workers/booking-api
npm run deploy
```

Expected: `https://booking-api.calvindaniel.workers.dev`

- [ ] **Step 4: E2E pending request**

```bash
curl -4 -sS -X POST https://booking-api.calvindaniel.workers.dev/api/book \
  -H "Content-Type: application/json" \
  -H "Origin: https://calvindaniel.com" \
  -d "{\"start\":\"<ISO from /api/availability>\",\"name\":\"Test Hold\",\"email\":\"YOUR_OTHER_EMAIL@...\",\"note\":\"approval e2e\"}"
```

Expected JSON: `"status":"pending"`. Calendar shows **tentative** “Pending: …”. Guest has **no** invite. Formspree email has Approve/Decline/Review links.

- [ ] **Step 5: Open Approve link**

Expected: HTML “Approved”; Calendar confirmed; guest receives invite.

- [ ] **Step 6: Second booking → Decline link**

Expected: event removed; guest gets Gmail “could not confirm”; slot free in availability.

- [ ] **Step 7: Review page**

Open `https://calvindaniel.com/book/review/?key=SECRET` (after Hostinger deploy) or local file with `?api=&key=`.

- [ ] **Step 8: Commit + Hostinger deploy when user asks**

Include: Worker sources, book UI, review page, privacy, plan/spec already on disk. Exclude `.dev.vars`.

```bash
# only when user requests commit
git add workers/booking-api book js/booking.js js/booking-review.js css/booking.css privacy/index.html docs/superpowers/specs/2026-10-20-booking-approval-hold-design.md docs/superpowers/plans/2026-10-20-booking-approval-hold.md
git commit -m "$(cat <<'EOF'
Add booking approval holds with host email and review queue.

Pending requests tentatively block the calendar for 48 hours until approve, decline, or expiry.
EOF
)"
./scripts/deploy-hostinger.ps1 -Yes
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Tentative hold, no guest invite on submit | 4, 6 |
| KV pending record + 48h | 1, 3, 6 |
| Formspree host email with Approve/Decline | 5, 6 |
| Review page with secret | 8 |
| Approve → confirm + Calendar invite | 6 |
| Decline → delete + guest email | 4, 6 |
| Expiry cron + opportunistic | 1, 6 |
| Pending success copy | 7 |
| Gmail scope re-auth | 4, 9 |
| Privacy / README | 8, 9 |

## Plan self-review

- No TBD placeholders; KV id filled at Task 1 runtime from `wrangler kv namespace create`.
- Token API names (`signAction` / `verifyAction`) consistent across Tasks 2 and 6.
- `createEvent` default `sendUpdates: 'none'` — approve path uses `updateEvent` with `'all'`.
- Guest decline/expiry uses `sendMail`; host alerts stay on Formspree.
