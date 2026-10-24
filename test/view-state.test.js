import assert from 'node:assert/strict';
import test from 'node:test';

import { getZoomAvailability } from '../assets/js/view-state.js';

test('disables zooming in at the minimum camera distance', () => {
  assert.deepEqual(getZoomAvailability(6, 6, 13), {
    canZoomIn: false,
    canZoomOut: true,
  });
});

test('disables zooming out at the maximum camera distance', () => {
  assert.deepEqual(getZoomAvailability(13, 6, 13), {
    canZoomIn: true,
    canZoomOut: false,
  });
});

test('keeps both zoom directions available between the bounds', () => {
  assert.deepEqual(getZoomAvailability(9.5, 6, 13), {
    canZoomIn: true,
    canZoomOut: true,
  });
});
