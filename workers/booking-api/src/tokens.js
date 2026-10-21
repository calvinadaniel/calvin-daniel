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
