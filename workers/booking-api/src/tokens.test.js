import { test } from 'node:test';
import assert from 'node:assert/strict';
import { signAction, verifyAction } from './tokens.js';

const secret = 'test-review-secret-32chars-minimum!!';

test('signAction is stable for same inputs', async () => {
  const a = await signAction(secret, 'approve', 'abc');
  const b = await signAction(secret, 'approve', 'abc');
  assert.equal(a, b);
  assert.match(a, /^[0-9a-f]+$/);
});

test('verifyAction accepts valid signature', async () => {
  const sig = await signAction(secret, 'decline', 'xyz');
  assert.equal(await verifyAction(secret, 'decline', 'xyz', sig), true);
});

test('verifyAction rejects wrong action or id', async () => {
  const sig = await signAction(secret, 'approve', 'id1');
  assert.equal(await verifyAction(secret, 'decline', 'id1', sig), false);
  assert.equal(await verifyAction(secret, 'approve', 'id2', sig), false);
  assert.equal(await verifyAction(secret, 'approve', 'id1', 'deadbeef'), false);
});
