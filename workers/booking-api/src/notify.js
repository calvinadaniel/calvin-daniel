/**
 * Email the host when a booking is created.
 * Primary: Gmail API → HOST_EMAIL (info@).
 * Fallback: Formspree (same form as contact) if Gmail is unavailable.
 * Guest confirmation still comes from Google Calendar invite on approve.
 */

import { sendMail } from './google.js';

const buildBody = (payload) => {
  const label = payload.label || payload.start;
  return [
    `Booking request via calvindaniel.com/book`,
    ``,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.website ? `Website: ${payload.website}` : null,
    `When: ${label}`,
    `Start (UTC): ${payload.start}`,
    payload.note ? `Note: ${payload.note}` : null,
    payload.htmlLink ? `Calendar: ${payload.htmlLink}` : null,
    ``,
    `Approve: ${payload.approveUrl}`,
    `Decline: ${payload.declineUrl}`,
    `Review queue: ${payload.reviewUrl}`,
  ]
    .filter((line) => line !== null)
    .join('\n');
};

const sendViaFormspree = async (env, payload, body) => {
  const endpoint = env.FORMSPREE_ENDPOINT;
  if (!endpoint) throw new Error('FORMSPREE_ENDPOINT not set');

  const label = payload.label || payload.start;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _subject: `Booking request: ${payload.name} — ${label}`,
      _replyto: payload.email,
      email: payload.email,
      name: payload.name,
      website: payload.website || '',
      note: payload.note || '',
      start: payload.start,
      message: body,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Formspree notify failed (${res.status}): ${text.slice(0, 200)}`);
  }
  return { sent: true, via: 'formspree' };
};

export const notifyHost = async (env, accessToken, payload) => {
  const hostEmail = env.HOST_EMAIL || 'info@calvindaniel.com';
  const label = payload.label || payload.start;
  const body = buildBody(payload);

  if (accessToken) {
    try {
      await sendMail(accessToken, {
        to: hostEmail,
        subject: `Booking request: ${payload.name} — ${label}`,
        body,
      });
      return { sent: true, via: 'gmail', to: hostEmail };
    } catch (err) {
      console.error('Gmail host notify failed, falling back to Formspree:', err?.message || err);
    }
  }

  const result = await sendViaFormspree(env, payload, body);
  return { ...result, to: hostEmail };
};
