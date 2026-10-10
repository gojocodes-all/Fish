import assert from 'node:assert/strict';
import test from 'node:test';

import { createRenderLoop } from '../assets/js/render-loop.js';

function createFrameScheduler() {
  let nextId = 1;
  const callbacks = new Map();

  return {
    cancelFrame(id) {
      callbacks.delete(id);
    },
    flush(timestamp) {
      const [[id, callback] = []] = callbacks;
      assert.ok(callback, 'expected a pending animation frame');
      callbacks.delete(id);
      callback(timestamp);
    },
    get pendingCount() {
      return callbacks.size;
    },
    requestFrame(callback) {
      const id = nextId;
      nextId += 1;
      callbacks.set(id, callback);
      return id;
    },
  };
}

test('starts once, advances with capped deltas, and cancels cleanly', () => {
  const scheduler = createFrameScheduler();
  const deltas = [];
  const loop = createRenderLoop({
    cancelFrame: scheduler.cancelFrame,
    onFrame: ({ deltaSeconds }) => deltas.push(deltaSeconds),
    requestFrame: scheduler.requestFrame,
    shouldRun: () => true,
  });

  assert.equal(loop.start(), true);
  assert.equal(loop.start(), false);
  assert.equal(loop.isRunning(), true);
  assert.equal(scheduler.pendingCount, 1);

  scheduler.flush(1_000);
  scheduler.flush(1_050);
  scheduler.flush(2_000);

  assert.deepEqual(deltas, [0, 0.05, 0.1]);
  assert.equal(scheduler.pendingCount, 1);
  assert.equal(loop.stop(), true);
  assert.equal(loop.stop(), false);
  assert.equal(loop.isRunning(), false);
  assert.equal(scheduler.pendingCount, 0);
});

test('does not start while paused and resets elapsed time after a restart', () => {
  const scheduler = createFrameScheduler();
  const deltas = [];
  let runnable = false;
  const loop = createRenderLoop({
    cancelFrame: scheduler.cancelFrame,
    onFrame: ({ deltaSeconds }) => deltas.push(deltaSeconds),
    requestFrame: scheduler.requestFrame,
    shouldRun: () => runnable,
  });

  assert.equal(loop.start(), false);
  assert.equal(scheduler.pendingCount, 0);

  runnable = true;
  loop.start();
  scheduler.flush(1_000);
  scheduler.flush(1_040);
  loop.stop();

  loop.start();
  scheduler.flush(10_000);

  assert.deepEqual(deltas, [0, 0.04, 0]);
});

test('drops a queued frame when the run condition changes', () => {
  const scheduler = createFrameScheduler();
  let frameCount = 0;
  let runnable = true;
  const loop = createRenderLoop({
    cancelFrame: scheduler.cancelFrame,
    onFrame: () => {
      frameCount += 1;
    },
    requestFrame: scheduler.requestFrame,
    shouldRun: () => runnable,
  });

  loop.start();
  runnable = false;
  scheduler.flush(1_000);

  assert.equal(frameCount, 0);
  assert.equal(loop.isRunning(), false);
  assert.equal(scheduler.pendingCount, 0);
});
