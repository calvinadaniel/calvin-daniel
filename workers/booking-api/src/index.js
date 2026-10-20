import { parseConfig } from './config.js';
import { getAccessToken, fetchFreeBusy, createEvent } from './google.js';
import { buildOpenSlots, isSlotStillFree, zonedParts } from './slots.js';

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });

const corsHeaders = (origin, allowed) => {
  const ok = origin && allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin : allowed[0] || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
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
  const missing = requireSecrets(env);
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

  const event = await createEvent(token, config.calendarId, {
    summary: `${config.eventTitle} — ${name}`,
    description: descriptionParts.join('\n'),
    start: { dateTime: start.toISOString() },
    end: { dateTime: end.toISOString() },
    attendees: [{ email, displayName: name }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 30 },
      ],
    },
  });

  const parts = zonedParts(start, config.timezone);

  return json({
    ok: true,
    eventId: event.id,
    htmlLink: event.htmlLink || null,
    start: start.toISOString(),
    end: end.toISOString(),
    label: new Intl.DateTimeFormat('en-US', {
      timeZone: config.timezone,
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(start),
    localDate: `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`,
  });
};

export default {
  async fetch(request, env) {
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
      if (request.method === 'GET' && path === '/api/availability') {
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
