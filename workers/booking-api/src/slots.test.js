/** Quick sanity check: node src/slots.test.js */
import { buildOpenSlots, zonedTimeToUtc, zonedParts } from './slots.js';

const config = {
  durationMinutes: 20,
  bufferMinutes: 10,
  windowDays: 14,
  dailyCap: 4,
  timezone: 'America/New_York',
  availability: { days: [2, 3, 4], startHour: 10, endHour: 16 },
};

// Fixed "now": Monday 2026-10-19 12:00 UTC
const now = new Date('2026-10-19T12:00:00.000Z');
const slots = buildOpenSlots(config, [], now);

if (!slots.length) {
  console.error('FAIL: expected open slots');
  process.exit(1);
}

const first = slots[0];
const p = zonedParts(new Date(first.start), config.timezone);
if (![2, 3, 4].includes(p.weekday)) {
  console.error('FAIL: slot on wrong weekday', p);
  process.exit(1);
}
if (p.hour < 10 || p.hour >= 16) {
  console.error('FAIL: slot outside hours', p);
  process.exit(1);
}

const utc = zonedTimeToUtc(2026, 10, 21, 10, 0, 'America/New_York');
const back = zonedParts(utc, 'America/New_York');
if (back.hour !== 10 || back.day !== 21) {
  console.error('FAIL: zonedTimeToUtc roundtrip', back, utc.toISOString());
  process.exit(1);
}

console.log('OK', slots.length, 'slots; first=', first.label);
