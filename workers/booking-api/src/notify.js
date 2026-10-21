/**
 * Email the host when a booking is created.
 * Uses the same Formspree form as the site contact form (inbox: info@).
 * Guest confirmation still comes from Google Calendar invite (sendUpdates=all).
 */

export const notifyHost = async (env, payload) => {
  const endpoint = env.FORMSPREE_ENDPOINT;
  if (!endpoint) return { sent: false, reason: 'FORMSPREE_ENDPOINT not set' };

  const label = payload.label || payload.start;
  const lines = [
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
  ].filter((line) => line !== null);

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
      message: lines.join('\n'),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Formspree notify failed (${res.status}): ${text.slice(0, 200)}`);
  }

  return { sent: true };
};
