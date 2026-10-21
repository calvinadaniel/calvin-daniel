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
