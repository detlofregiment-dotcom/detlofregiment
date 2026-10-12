import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFinalScore } from '../src/grades.js';

test('calculates internal assessment plus examination scaled to 50', () => {
  assert.equal(calculateFinalScore({sba1:8,sba2:16,projectWork:18,examination:76}),80);
});
test('rejects marks beyond each maximum', () => {
  assert.throws(() => calculateFinalScore({sba1:11,sba2:16,projectWork:18,examination:76}), /SBA 1/);
  assert.throws(() => calculateFinalScore({sba1:8,sba2:21,projectWork:18,examination:76}), /SBA 2/);
  assert.throws(() => calculateFinalScore({sba1:8,sba2:16,projectWork:21,examination:76}), /Project work/);
  assert.throws(() => calculateFinalScore({sba1:8,sba2:16,projectWork:18,examination:101}), /Examination/);
});
