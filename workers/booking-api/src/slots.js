/**
 * Slot generation in America/New_York (or configured IANA zone).
 * Uses Intl + iterative day walking — no external date libs.
 */

const pad = (n) => String(n).padStart(2, '0');

/** Parts of an Instant in a given time zone. */
export const zonedParts = (date, timeZone) => {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    weekday: 'short',
  });
  const map = {};
  for (const { type, value } of fmt.formatToParts(date)) {
    if (type !== 'literal') map[type] = value;
  }
  const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
    weekday: weekdayMap[map.weekday],
  };
};

/**
 * Convert a civil datetime in `timeZone` to a UTC Date.
 * Iteratively corrects UTC guess against zoned parts.
 */
export const zonedTimeToUtc = (y, m, d, hour, minute, timeZone) => {
  let utc = new Date(Date.UTC(y, m - 1, d, hour, minute, 0));
  for (let i = 0; i < 3; i++) {
    const p = zonedParts(utc, timeZone);
    const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    const want = Date.UTC(y, m - 1, d, hour, minute, 0);
    utc = new Date(utc.getTime() + (want - asUtc));
  }
  return utc;
};

const overlaps = (startMs, endMs, busy) => {
  for (const b of busy) {
    const bs = new Date(b.start).getTime();
    const be = new Date(b.end).getTime();
    if (startMs < be && endMs > bs) return true;
  }
  return false;
};

const dayKey = (parts) =>
  `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;

/**
 * Build open slot start times (ISO UTC strings).
 */
export const buildOpenSlots = (config, busy, now = new Date()) => {
  const {
    durationMinutes,
    bufferMinutes,
    windowDays,
    dailyCap,
    timezone,
    availability,
  } = config;

  const slotMs = durationMinutes * 60 * 1000;
  const blockMs = (durationMinutes + bufferMinutes) * 60 * 1000;
  const allowedDays = new Set(availability.days || [2, 3, 4]);
  const startHour = availability.startHour ?? 10;
  const endHour = availability.endHour ?? 16;

  const slots = [];
  const perDay = Object.create(null);

  const startParts = zonedParts(now, timezone);
  // Walk calendar days in the target zone
  for (let dayOffset = 0; dayOffset < windowDays; dayOffset++) {
    const noonUtc = zonedTimeToUtc(
      startParts.year,
      startParts.month,
      startParts.day,
      12,
      0,
      timezone
    );
    const dayUtc = new Date(noonUtc.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    const dp = zonedParts(dayUtc, timezone);
    if (!allowedDays.has(dp.weekday)) continue;

    const key = dayKey(dp);
    perDay[key] = perDay[key] || 0;

    // Candidate starts every `durationMinutes` within [startHour, endHour)
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += durationMinutes) {
        const slotEndHour = hour + Math.floor((minute + durationMinutes) / 60);
        const slotEndMin = (minute + durationMinutes) % 60;
        // Must finish by endHour
        if (slotEndHour > endHour || (slotEndHour === endHour && slotEndMin > 0)) {
          continue;
        }

        const start = zonedTimeToUtc(dp.year, dp.month, dp.day, hour, minute, timezone);
        const end = new Date(start.getTime() + slotMs);
        const blockEnd = new Date(start.getTime() + blockMs);

        if (start.getTime() <= now.getTime() + 60 * 60 * 1000) continue; // ≥1h notice
        if (overlaps(start.getTime(), blockEnd.getTime(), busy)) continue;
        if (perDay[key] >= dailyCap) continue;

        slots.push({
          start: start.toISOString(),
          end: end.toISOString(),
          label: formatSlotLabel(start, timezone),
          dayKey: key,
        });
        perDay[key] += 1;
      }
    }
  }

  return slots;
};

const formatSlotLabel = (date, timeZone) => {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

export const isSlotStillFree = (startIso, config, busy) => {
  const start = new Date(startIso);
  const blockEnd = new Date(
    start.getTime() + (config.durationMinutes + config.bufferMinutes) * 60 * 1000
  );
  if (Number.isNaN(start.getTime())) return false;
  return !overlaps(start.getTime(), blockEnd.getTime(), busy);
};
