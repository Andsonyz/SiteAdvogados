import test from 'node:test'
import assert from 'node:assert/strict'
import { buildRuntimeEnv, assessMemory } from '../scripts/runtime.mjs'

test('native compiler pools are bounded before Vite starts without changing the parent environment', () => {
  const original = { PATH: 'test-path' }
  const env = buildRuntimeEnv(original)
  assert.equal(env.ROLLDOWN_WORKER_THREADS, '2')
  assert.equal(env.RAYON_NUM_THREADS, '2')
  assert.deepEqual(original, { PATH: 'test-path' })
  assert.equal(env.PATH, original.PATH)
})

test('explicit positive thread limits are preserved', () => {
  const env = buildRuntimeEnv({ ROLLDOWN_WORKER_THREADS: '1', RAYON_NUM_THREADS: '1' })
  assert.equal(env.ROLLDOWN_WORKER_THREADS, '1')
  assert.equal(env.RAYON_NUM_THREADS, '1')
})

test('critical Windows commit shortage is reported even with physical RAM available', () => {
  const result = assessMemory({ physicalFreeMB: 900, commitFreeMB: 120 })
  assert.equal(result.status, 'critical')
  assert.match(result.message, /paginação|comprometimento/i)
})

test('low memory warns while an unavailable commit reading is never reported as healthy', () => {
  assert.equal(assessMemory({ physicalFreeMB: 900, commitFreeMB: 800 }).status, 'warning')
  assert.equal(assessMemory({ physicalFreeMB: 900, commitFreeMB: null }).status, 'unknown')
  assert.equal(assessMemory({ physicalFreeMB: 3000, commitFreeMB: 5000 }).status, 'ok')
})
