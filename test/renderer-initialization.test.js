import assert from 'node:assert/strict';
import test from 'node:test';

import { createRendererSafely } from '../assets/js/renderer-initialization.js';

test('returns the renderer when WebGL initialization succeeds', () => {
  const renderer = { domElement: {} };

  assert.deepEqual(createRendererSafely(() => renderer), {
    renderer,
    error: null,
  });
});

test('captures renderer initialization failures for the accessible fallback', () => {
  const failure = new Error('WebGL is unavailable');

  assert.deepEqual(createRendererSafely(() => {
    throw failure;
  }), {
    renderer: null,
    error: failure,
  });
});

test('rejects a missing renderer factory', () => {
  assert.throws(
    () => createRendererSafely(null),
    /createRenderer must be a function/,
  );
});
