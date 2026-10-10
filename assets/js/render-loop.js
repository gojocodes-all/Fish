const MAX_DELTA_SECONDS = 0.1;

export function createRenderLoop({
  cancelFrame,
  onFrame,
  requestFrame,
  shouldRun,
}) {
  if (
    typeof cancelFrame !== "function" ||
    typeof onFrame !== "function" ||
    typeof requestFrame !== "function" ||
    typeof shouldRun !== "function"
  ) {
    throw new TypeError("createRenderLoop requires function dependencies");
  }

  let frameId = null;
  let previousTimestamp = null;

  function runFrame(timestamp) {
    frameId = null;

    if (!shouldRun()) {
      previousTimestamp = null;
      return;
    }

    const deltaSeconds = previousTimestamp === null
      ? 0
      : Math.min((timestamp - previousTimestamp) / 1000, MAX_DELTA_SECONDS);

    previousTimestamp = timestamp;
    onFrame({ deltaSeconds, timestamp });

    if (shouldRun()) {
      frameId = requestFrame(runFrame);
    } else {
      previousTimestamp = null;
    }
  }

  return {
    isRunning() {
      return frameId !== null;
    },

    start() {
      if (frameId !== null || !shouldRun()) return false;

      previousTimestamp = null;
      frameId = requestFrame(runFrame);
      return true;
    },

    stop() {
      previousTimestamp = null;
      if (frameId === null) return false;

      cancelFrame(frameId);
      frameId = null;
      return true;
    },
  };
}
