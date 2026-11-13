export function createRendererSafely(createRenderer) {
  if (typeof createRenderer !== 'function') {
    throw new TypeError('createRenderer must be a function.');
  }

  try {
    return {
      renderer: createRenderer(),
      error: null,
    };
  } catch (error) {
    return {
      renderer: null,
      error,
    };
  }
}
