/** Google OAuth + Calendar helpers for Cloudflare Workers. */

export const getAccessToken = async (env) => {
  const body = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    refresh_token: env.GOOGLE_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  });

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Failed to refresh Google token');
  }
  return data.access_token;
};

export const fetchFreeBusy = async (accessToken, calendarId, timeMin, timeMax) => {
  const res = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      items: [{ id: calendarId }],
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'freeBusy failed');
  }

  const cal = data.calendars?.[calendarId];
  return Array.isArray(cal?.busy) ? cal.busy : [];
};

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

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || 'events.insert failed');
  }
  return data;
};

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
