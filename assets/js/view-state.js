const ZOOM_BOUNDARY_EPSILON = 0.001;

export function getZoomAvailability(distance, minDistance, maxDistance) {
  if (![distance, minDistance, maxDistance].every(Number.isFinite)) {
    throw new TypeError('Zoom distances must be finite numbers.');
  }

  if (minDistance > maxDistance) {
    throw new RangeError('Minimum zoom distance cannot exceed maximum distance.');
  }

  return {
    canZoomIn: distance > minDistance + ZOOM_BOUNDARY_EPSILON,
    canZoomOut: distance < maxDistance - ZOOM_BOUNDARY_EPSILON,
  };
}
