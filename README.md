# Interactive 3D Sneaker

A single-page Three.js product demo that builds a stylized sneaker entirely from procedural geometry. The page supports orbit, zoom, pointer-follow motion, responsive presentation, soft shadows, and a floating animation without requiring a build step.

## Requirements

- A modern browser with WebGL, JavaScript modules, and import map support
- An internet connection when loading the demo, because Three.js `0.160.0` and `OrbitControls` are fetched from jsDelivr
- Node.js 20 or newer to run the regression tests

## Run locally

Serve the repository over HTTP from its root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/interactive-3d-shoe-4.html>.

No package installation or build step is required. Opening the file directly with a `file://` URL is not recommended because browser module and origin rules vary.

## Controls

- Move the mouse or trackpad pointer to gently turn the sneaker.
- Drag to orbit the camera around the model.
- Scroll to zoom within the configured distance limits.
- On a touch screen, drag with one finger to orbit.

Panning is disabled so the product remains centered.

## Validation

Run the dependency-free Node.js test suite:

```bash
npm test
```

The tests verify that the page includes an import map, that core Three.js and its addons use the same pinned release, and that `OrbitControls` loads through the mapped addon path. GitHub Actions runs the same command for pull requests and pushes to `main`.

## Project structure

| Path | Purpose |
| --- | --- |
| `interactive-3d-shoe-4.html` | Complete demo markup, styles, scene construction, lighting, controls, and animation loop |
| `test/import-map.test.js` | Regression coverage for browser module resolution |
| `package.json` | Node.js requirement and test command; the project has no npm dependencies |
| `.github/workflows/ci.yml` | Read-only hosted test workflow |
| `.github/maintenance-log.md` | Maintenance decisions, validation, risk, and rollback notes |

## Deployment

Deploy the repository as a static site with its root as the publish directory. The host must preserve `interactive-3d-shoe-4.html` as a directly addressable page; there is no generated output directory or server runtime.

The current page depends on jsDelivr at runtime. For an offline or self-contained deployment, vendor both pinned Three.js module paths and update the import map together. Keep the core and addon versions aligned.

## Contributing

Keep the demo dependency-free unless a change clearly requires otherwise. Before opening a pull request:

1. Run `npm test`.
2. Serve the page locally and verify orbit, zoom, pointer-follow motion, touch interaction, and resizing in a WebGL-capable browser.
3. If changing Three.js, update both import-map URLs to the same release and adjust the regression expectations.
4. Record maintenance changes in `.github/maintenance-log.md`.

