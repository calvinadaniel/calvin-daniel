import { parseConfig } from './config.js';
import {
  getAccessToken,
  fetchFreeBusy,
  createEvent,
  updateEvent,
  deleteEvent,
  sendMail,
} from './google.js';
import { notifyHost } from './notify.js';
import { buildOpenSlots, isSlotStillFree } from './slots.js';
import { signAction, verifyAction } from './tokens.js';
import {
  createPendingId,
  putPending,
  getPending,
  listPending,
  listExpiredPending,
  setPendingStatus,
} from './pending.js';
import { statusPage } from './status-html.js';

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });

const corsHeaders = (origin, allowed) => {
  const ok = origin && allowed.includes(origin);
  // Only echo an allowed Origin — never send a mismatched ACAO (breaks www vs apex).
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (ok) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
};

/** Tiny in-memory rate limit (per isolate). Good enough against casual spam. */
const hits = new Map();
const rateLimit = (ip, limit = 30, windowMs = 60_000) => {
  const now = Date.now();
  const entry = hits.get(ip) || { count: 0, reset: now + windowMs };
  if (now > entry.reset) {
    entry.count = 0;
    entry.reset = now + windowMs;
  }
  entry.count += 1;
  hits.set(ip, entry);
  return entry.count <= limit;
};

const requireSecrets = (env) => {
  const missing = [];
  for (const k of [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REFRESH_TOKEN',
    'BOOKING_CALENDAR_ID',
  ]) {
    if (!env[k]) missing.push(k);
  }
  return missing;
};

/** Pending-approval flow needs the KV binding and the review secret. */
const requireApprovalStore = (env) => {
  const missing = [];
  if (!env.BOOKINGS) missing.push('BOOKINGS');
  if (!env.BOOKING_REVIEW_SECRET) missing.push('BOOKING_REVIEW_SECRET');
  return missing;
};

const apiBase = (config, request) =>
  config.publicApiBase || new URL(request.url).origin;

const formatLabel = (start, timeZone) =>
  new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(start);

const buildActionUrls = async (secret, base, id) => {
  const [approveSig, declineSig] = await Promise.all([
    signAction(secret, 'approve', id),
    signAction(secret, 'decline', id),
  ]);
  const q = encodeURIComponent(id);
  return {
    approveUrl: `${base}/api/booking/approve?id=${q}&sig=${approveSig}`,
    declineUrl: `${base}/api/booking/decline?id=${q}&sig=${declineSig}`,
  };
};

const windowBounds = (config, now = new Date()) => {
  const timeMin = now.toISOString();
  const timeMax = new Date(
    now.getTime() + config.windowDays * 24 * 60 * 60 * 1000
  ).toISOString();
  return { timeMin, timeMax };
};

const handleAvailability = async (env, config) => {
  const missing = requireSecrets(env);
  if (missing.length) {
    return json({ error: 'Booking API not configured', missing }, 503);
  }

  const token = await getAccessToken(env);
  const { timeMin, timeMax } = windowBounds(config);
  const busy = await fetchFreeBusy(token, config.calendarId, timeMin, timeMax);
  const slots = buildOpenSlots(config, busy);

  // Group by day for the UI
  const byDay = Object.create(null);
  for (const s of slots) {
    if (!byDay[s.dayKey]) byDay[s.dayKey] = [];
    byDay[s.dayKey].push({ start: s.start, end: s.end, label: s.label });
  }

  return json({
    eventTitle: config.eventTitle,
    durationMinutes: config.durationMinutes,
    timezone: config.timezone,
    days: Object.keys(byDay)
      .sort()
      .map((dayKey) => ({
        dayKey,
        label: formatDayLabel(dayKey, config.timezone),
        slots: byDay[dayKey],
      })),
  });
};

const formatDayLabel = (dayKey, timeZone) => {
  const [y, m, d] = dayKey.split('-').map(Number);
  // Noon UTC-ish display via a Date at local noon
  const approx = new Date(Date.UTC(y, m - 1, d, 16, 0, 0));
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(approx);
};

const handleBook = async (request, env, config) => {
  const missing = [...requireSecrets(env), ...requireApprovalStore(env)];
  if (missing.length) {
    return json({ error: 'Booking API not configured', missing }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const website = String(body.website || '').trim();
  const note = String(body.note || '').trim().slice(0, 500);
  const startIso = String(body.start || '').trim();

  if (!name || name.length > 120) return json({ error: 'Name is required' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Valid email is required' }, 400);
  }
  if (!startIso || Number.isNaN(new Date(startIso).getTime())) {
    return json({ error: 'Valid start time is required' }, 400);
  }

  const start = new Date(startIso);
  const end = new Date(start.getTime() + config.durationMinutes * 60 * 1000);

  // Ensure start is one of our generated slots (same rules)
  const token = await getAccessToken(env);
  const { timeMin, timeMax } = windowBounds(config);
  const busy = await fetchFreeBusy(token, config.calendarId, timeMin, timeMax);
  const open = buildOpenSlots(config, busy);
  const allowed = open.some((s) => s.start === start.toISOString());
  if (!allowed || !isSlotStillFree(start.toISOString(), config, busy)) {
    return json({ error: 'That time is no longer available. Pick another slot.' }, 409);
  }

  const descriptionParts = [
    'Booked via calvindaniel.com/book',
    website ? `Website: ${website}` : null,
    note ? `Note: ${note}` : null,
  ].filter(Boolean);

  const label = formatLabel(start, config.timezone);

  // Tentative hold: blocks the slot (freeBusy) but sends no invite until approved.
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
  try {
    await putPending(env.BOOKINGS, record, config.holdHours);
  } catch (err) {
    await deleteEvent(token, config.calendarId, event.id).catch((e) =>
      console.error('Orphan event cleanup failed:', event.id, e?.message || e)
    );
    throw err;
  }
  // Host inbox alert with one-click approve/decline links
  try {
    const secret = env.BOOKING_REVIEW_SECRET;
    const { approveUrl, declineUrl } = await buildActionUrls(
      secret,
      apiBase(config, request),
      id
    );
    const reviewUrl = `${config.reviewPageUrl}?key=${encodeURIComponent(secret)}`;
    await notifyHost(env, token, {
      name,
      email,
      website,
      note,
      start: record.start,
      label,
      htmlLink: event.htmlLink || null,
      approveUrl,
      declineUrl,
      reviewUrl,
    });
  } catch (err) {
    console.error('Host email notify failed:', err?.message || err);
  }

  return json({
    ok: true,
    status: 'pending',
    id,
    label,
    expiresAt: record.expiresAt,
    start: record.start,
  });
};

const handlePending = async (request, env, config) => {
  const missing = requireApprovalStore(env);
  if (missing.length) {
    return json({ error: 'Booking API not configured', missing }, 503);
  }
  const url = new URL(request.url);
  if (url.searchParams.get('key') !== env.BOOKING_REVIEW_SECRET) {
    return json({ error: 'Unauthorized' }, 401);
  }
  const base = apiBase(config, request);
  const rows = await listPending(env.BOOKINGS);
  const pending = await Promise.all(
    rows.map(async (rec) => ({
      ...rec,
      label: formatLabel(new Date(rec.start), config.timezone),
      ...(await buildActionUrls(env.BOOKING_REVIEW_SECRET, base, rec.id)),
    }))
  );
  return json({ pending });
};

/**
 * Claim a still-pending record by flipping its status (re-read first), so a
 * concurrent sweep/click sees it as handled. KV is not atomic; this narrows the race.
 */
const claimPending = async (kv, id, status) => {
  const fresh = await getPending(kv, id);
  if (!fresh || fresh.status !== 'pending') return null;
  await setPendingStatus(kv, id, status);
  return fresh;
};

const expireOne = async (env, config, token, rec) => {
  const fresh = await claimPending(env.BOOKINGS, rec.id, 'expired');
  if (!fresh) return false; // already handled elsewhere: skip delete + mail
  try {
    await deleteEvent(token, config.calendarId, fresh.eventId);
  } catch (err) {
    await setPendingStatus(env.BOOKINGS, fresh.id, 'pending').catch(() => {});
    throw err;
  }
  rec = fresh;
  try {
    const label = formatLabel(new Date(rec.start), config.timezone);
    await sendMail(token, {
      to: rec.email,
      subject: 'Your site review request expired',
      body: `Hi ${rec.name},\n\nI was not able to confirm the time you requested (${label}) in time, so the hold has been released.\n\nPick another slot: https://calvindaniel.com/book/\n\n— Calvin`,
    });
  } catch (err) {
    console.error('Expiry email failed:', rec.id, err?.message || err);
  }
  return true;
};

const SWEEP_INTERVAL_MS = 5 * 60 * 1000;
let lastSweep = 0;

/** Cheap KV-only check first; only fetch a Google token when something expired. */
const expirePendings = async (env, { throttle = false } = {}) => {
  if (requireSecrets(env).length || requireApprovalStore(env).length) return;
  if (throttle) {
    if (Date.now() - lastSweep < SWEEP_INTERVAL_MS) return;
    lastSweep = Date.now();
  }
  const config = parseConfig(env);
  const expired = await listExpiredPending(env.BOOKINGS);
  if (!expired.length) return;
  const token = await getAccessToken(env);
  for (const rec of expired) {
    try {
      await expireOne(env, config, token, rec);
    } catch (e) {
      console.error('expire failed', rec.id, e);
    }
  }
};

const htmlStatus = (title, message, status = 200) => {
  const res = statusPage({ title, message });
  return status === 200 ? res : new Response(res.body, { status, headers: res.headers });
};

/** Shared guard for approve/decline: verify signature, load pending record. */
const loadActionTarget = async (action, request, env, config) => {
  const missing = [...requireSecrets(env), ...requireApprovalStore(env)];
  if (missing.length) {
    return { res: htmlStatus('Not configured', 'Booking API is not configured.', 503) };
  }
  const url = new URL(request.url);
  const id = url.searchParams.get('id') || '';
  const sig = url.searchParams.get('sig') || '';
  if (!id || !(await verifyAction(env.BOOKING_REVIEW_SECRET, action, id, sig))) {
    return { res: htmlStatus('Invalid link', 'This link is invalid or has been tampered with.', 401) };
  }
  const rec = await getPending(env.BOOKINGS, id);
  if (!rec) {
    return { res: htmlStatus('Not found', 'This booking request no longer exists.', 404) };
  }
  if (rec.status !== 'pending') {
    return { res: htmlStatus('Already handled', `This request was already ${rec.status}.`) };
  }
  const token = await getAccessToken(env);
  if (new Date(rec.expiresAt).getTime() <= Date.now()) {
    await expireOne(env, config, token, rec);
    return {
      res: htmlStatus('Expired', 'The hold expired; the slot was released and the guest emailed.', 410),
    };
  }
  return { rec, token, id };
};

const handleApprove = async (request, env, config) => {
  const target = await loadActionTarget('approve', request, env, config);
  if (target.res) return target.res;
  const { rec, token, id } = target;
  await updateEvent(
    token,
    config.calendarId,
    rec.eventId,
    {
      status: 'confirmed',
      summary: `${config.eventTitle} — ${rec.name}`,
      attendees: [{ email: rec.email, displayName: rec.name }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    },
    { sendUpdates: 'all' }
  );
  await setPendingStatus(env.BOOKINGS, id, 'approved');
  return htmlStatus(
    'Approved',
    `Invite sent to ${rec.email} for ${formatLabel(new Date(rec.start), config.timezone)}.`
  );
};

const handleDecline = async (request, env, config) => {
  const target = await loadActionTarget('decline', request, env, config);
  if (target.res) return target.res;
  const { rec, token, id } = target;
  const label = formatLabel(new Date(rec.start), config.timezone);
  const fresh = await claimPending(env.BOOKINGS, id, 'declined');
  if (!fresh) return htmlStatus('Already handled', 'This request was already handled.');
  try {
    await deleteEvent(token, config.calendarId, rec.eventId);
  } catch (err) {
    await setPendingStatus(env.BOOKINGS, id, 'pending').catch(() => {});
    throw err;
  }
  let emailed = true;
  try {
    await sendMail(token, {
      to: rec.email,
      subject: 'Could not confirm your site review time',
      body: `Hi ${rec.name},\n\nI could not confirm the time you requested (${label}).\n\nPick another slot: https://calvindaniel.com/book/\n\n— Calvin`,
    });
  } catch (err) {
    emailed = false;
    console.error('Decline email failed:', id, err?.message || err);
  }
  return htmlStatus(
    'Declined',
    emailed ? 'Hold released and guest emailed.' : 'Hold released, but the guest email failed to send.'
  );
};

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(expirePendings(env));
  },

  async fetch(request, env, ctx) {
    const config = parseConfig(env);
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, config.allowedOrigins);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const ip =
      request.headers.get('CF-Connecting-IP') ||
      request.headers.get('X-Forwarded-For') ||
      'unknown';
    if (!rateLimit(ip)) {
      return json({ error: 'Too many requests. Try again shortly.' }, 429, cors);
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '') || '/';

    try {
      if (request.method === 'GET' && (path === '/api/health' || path === '/health')) {
        return json({ ok: true }, 200, cors);
      }
      if (request.method === 'GET' && path === '/api/booking/pending') {
        const res = await handlePending(request, env, config);
        const headers = new Headers(res.headers);
        Object.entries(cors).forEach(([k, v]) => headers.set(k, v));
        return new Response(res.body, { status: res.status, headers });
      }
      if (request.method === 'GET' && path === '/api/booking/approve') {
        return await handleApprove(request, env, config);
      }
      if (request.method === 'GET' && path === '/api/booking/decline') {
        return await handleDecline(request, env, config);
      }
      if (request.method === 'GET' && path === '/api/availability') {
        // Opportunistic sweep of expired holds, off the request path
        ctx?.waitUntil?.(expirePendings(env, { throttle: true }).catch((e) => console.error('sweep failed', e)));
        const res = await handleAvailability(env, config);
        const headers = new Headers(res.headers);
        Object.entries(cors).forEach(([k, v]) => headers.set(k, v));
        return new Response(res.body, { status: res.status, headers });
      }
      if (request.method === 'POST' && path === '/api/book') {
        const res = await handleBook(request, env, config);
        const headers = new Headers(res.headers);
        Object.entries(cors).forEach(([k, v]) => headers.set(k, v));
        return new Response(res.body, { status: res.status, headers });
      }
      return json({ error: 'Not found' }, 404, cors);
    } catch (err) {
      console.error(err);
      return json({ error: err.message || 'Server error' }, 500, cors);
    }
  },
};
