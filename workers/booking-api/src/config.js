/** Parse Worker vars into a typed booking config. */

export const parseConfig = (env) => {
  let availability = { days: [2, 3, 4], startHour: 10, endHour: 16 };
  try {
    if (env.AVAILABILITY_JSON) {
      availability = { ...availability, ...JSON.parse(env.AVAILABILITY_JSON) };
    }
  } catch {
    /* keep defaults */
  }

  const allowedOrigins = String(env.ALLOWED_ORIGINS || 'https://calvindaniel.com')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    eventTitle: env.EVENT_TITLE || 'Free 20-minute site review',
    durationMinutes: Number(env.DURATION_MINUTES || 20),
    bufferMinutes: Number(env.BUFFER_MINUTES || 10),
    windowDays: Number(env.WINDOW_DAYS || 14),
    dailyCap: Number(env.DAILY_CAP || 4),
    timezone: env.TIMEZONE || 'America/New_York',
    calendarId: env.BOOKING_CALENDAR_ID || 'primary',
    availability,
    allowedOrigins,
  };
};
