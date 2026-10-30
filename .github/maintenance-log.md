# Maintenance log

## 2026-10-30 — Pause automatic rotation during direct orbiting

### Rationale

The render loop tried to detect active OrbitControls input through an undocumented `controls.state` property. That property is absent from the public control instance, so the falsy-value check always allowed cursor-follow rotation to continue while a visitor dragged to orbit the camera. The two interactions could therefore compete even though the loop clearly intended to pause automatic model rotation during direct manipulation.

### Files changed

- `interactive-3d-shoe-4.html` — track OrbitControls' supported `start` and `end` events and suspend cursor-follow interpolation while an orbit interaction is active.
- `test/import-map.test.js` — prevent regression to the unavailable state property and verify the public interaction lifecycle controls automatic rotation.
- `README.md` — document how cursor-follow and direct orbit input are coordinated.
- `.github/maintenance-log.md` — record this change.

### Validation

- Ran the complete dependency-free test suite with `npm test`.
- Syntax-checked both local JavaScript modules and the page's inline ES module with Node.js.
- Served the repository locally and confirmed the page and both local modules return HTTP 200.
- Ran `git diff --check` and reviewed the complete diff for correctness, security, accessibility, mobile behavior, reduced motion, backward compatibility, and repository conventions.

### Risk

Low. Camera controls, scene geometry, dependencies, zoom behavior, and reduced-motion behavior are unchanged. The change only pauses existing cursor-follow interpolation between OrbitControls' documented interaction lifecycle events.

### Rollback

Revert this pull request's squash commit to restore the previous state check and simultaneous cursor-follow interpolation during direct orbiting.

## 2026-10-24 — Disable zoom controls at camera limits

### Rationale

The Zoom In and Zoom Out buttons remained enabled after the camera reached its configured minimum or maximum distance. Repeated activation then produced no visual change while still announcing a successful zoom, creating misleading feedback for keyboard, switch-device, mouse, and touch users.

### Files changed

- `assets/js/view-state.js` — derive zoom-button availability from the current camera distance and configured OrbitControls limits.
- `interactive-3d-shoe-4.html` — keep native disabled states synchronized after button, drag, wheel, pinch, reset, reduced-motion, and visibility-driven updates, with a distinct disabled appearance.
- `test/view-state.test.js` — cover minimum, intermediate, and maximum camera distances.
- `test/import-map.test.js` — verify the page imports and applies the zoom availability state.
- `README.md` — document the boundary behavior and new module and test.
- `.github/maintenance-log.md` — record this change.

### Validation

- Ran all 10 tests with `npm test` on Node.js 24.
- Syntax-checked the local JavaScript modules and the page's inline ES module with Node.js.
- Served the repository locally and verified the page and both local modules return HTTP 200.
- Ran `git diff --check` and reviewed the complete diff for accessibility, mobile behavior, reduced motion, security, compatibility, and repository conventions.

### Risk

Low. Camera positions, zoom limits, scene geometry, dependencies, and pointer/touch behavior are unchanged. The change only exposes the existing limits through native button state and styling.

### Rollback

Revert this pull request's squash commit to restore the previous always-enabled zoom buttons and remove their state helper and tests.

## 2026-10-18 — Add keyboard-operable 3D viewer controls

### Rationale

The sneaker could only be rotated or zoomed with pointer, touch, or wheel input. Keyboard and switch-device users could read the page but could not operate its primary interactive experience.

### Files changed

- `interactive-3d-shoe-4.html` — add responsive Rotate, Zoom, and Reset buttons, a labelled canvas, visible focus treatment, 44-pixel targets, and polite screen-reader feedback while preserving drag, pointer-follow, scroll, pinch, and reduced-motion behavior.
- `test/import-map.test.js` — verify every viewer action remains a native button and that the labelled control group, live feedback, canvas semantics, click wiring, and zoom bounds remain present.
- `README.md` — document keyboard and switch-device operation and the responsive control layout.
- `.github/maintenance-log.md` — record this change.

### Validation

- Run `npm test`.
- Syntax-check the page's inline ES module with Node.js.
- Serve the repository locally and verify the demo and local render-loop module load over HTTP.
- Review the complete diff for accessibility, mobile layout, reduced motion, security, compatibility, and repository conventions.

### Risk

Low. Scene geometry, Three.js dependencies, pointer/touch controls, animation lifecycle, and zoom limits are unchanged. The added buttons call the same model, camera, and OrbitControls state already used by the demo.

### Rollback

Revert this pull request's squash commit to remove the viewer-control panel and its documentation and regression coverage.

## 2026-10-10 — Respect reduced motion and render only while visible

### Rationale

The WebGL scene previously ran a continuous animation loop whenever the page was open and always applied floating and cursor-follow motion. It did not honor the visitor's reduced-motion preference, and its animation lifecycle had no explicit pause or safe-resume behavior for hidden pages.

### Files changed

- `assets/js/render-loop.js` — add a small, dependency-free animation-frame lifecycle that prevents duplicate loops, cancels queued frames, and caps elapsed time after interruptions.
- `interactive-3d-shoe-4.html` — pause rendering while hidden, switch to on-demand rendering for reduced motion, keep direct orbit/zoom controls available, and resume without a large animation jump.
- `test/render-loop.test.js` — cover scheduling, cancellation, delta capping, restart behavior, and a run condition that changes after scheduling.
- `test/import-map.test.js` — verify the page wires the lifecycle to reduced-motion and visibility state.
- `README.md` — document the motion behavior, render lifecycle, and new module and tests.
- `.github/maintenance-log.md` — record this change.

### Validation

- Ran `npm test` on Node.js 24.
- Syntax-checked `assets/js/render-loop.js` and the page's inline ES module with Node.js.
- Served the repository locally and verified the page and local module return successfully over HTTP.
- Ran `git diff --check` and reviewed the complete diff for accessibility, performance, security, compatibility, and repository conventions.

### Risk

Low. The Three.js scene, geometry, dependencies, and direct orbit/zoom controls are unchanged. The new behavior only governs when automatic frames and motion run.

### Rollback

Revert the pull request's squash commit to restore the previous always-running animation loop.

## 2026-10-07 — Add repository guide

### Rationale

The repository had a working browser demo, regression tests, and CI but no README. A contributor had to inspect the HTML and workflow to discover the entry point, runtime dependency, controls, validation command, and deployment model.

### Files changed

- `README.md` — document the verified purpose, browser and Node.js requirements, local serving, controls, validation, project structure, static deployment, runtime CDN limitation, and contribution workflow.
- `.github/maintenance-log.md` — record this documentation work.

### Validation

- Ran `npm test` on Node.js 24.
- Served the repository locally and confirmed the documented page returns successfully over HTTP.
- Cross-checked every command, path, control, dependency version, and deployment statement against the HTML, package manifest, tests, workflow, and repository tree.
- Ran `git diff --check` and reviewed the complete diff.

### Risk

Low. This is documentation-only and does not change the rendered demo, dependencies, tests, or deployment configuration.

### Rollback

Revert the pull request's squash commit to remove the README and this log entry.

## 2026-09-30 — Run regression tests in CI

### Rationale

The repository has dependency-free regression tests for the Three.js import map, but they previously ran only when invoked manually. Future pull requests could therefore break browser module resolution without a hosted check reporting the regression.

### Files changed

- `.github/workflows/ci.yml` — run the test suite for pull requests and pushes to `main` with read-only permissions, pinned action commits, concurrency cancellation, and a five-minute timeout.
- `.github/maintenance-log.md` — record this maintenance work.

### Validation

- Ran `npm test` locally on Node.js 24.
- Parsed the workflow as YAML and checked its permissions, triggers, action pins, timeout, and test command.
- Ran `git diff --check` and reviewed the complete diff.

### Risk

Low. The change does not modify the demo or its dependencies; it only adds an automated check for the existing test command.

### Rollback

Revert the pull request's squash commit to remove the CI workflow and this log entry.

## 2026-09-22 — Resolve Three.js addon imports

### Rationale

The page loaded `OrbitControls` directly from Three.js's examples directory. That module imports the bare specifier `three`, which browsers cannot resolve without an import map, so the 3D demo could fail before rendering.

### Files changed

- `interactive-3d-shoe-4.html` — add a pinned import map and load Three.js modules through their mapped specifiers.
- `test/import-map.test.js` — verify the import map and module entry points stay compatible.
- `package.json` — add a dependency-free test command and document the Node.js requirement.
- `.github/maintenance-log.md` — record this maintenance work.

### Validation

- Ran `npm test`.
- Parsed the import map as JSON.
- Ran `git diff --check` and reviewed the complete diff.

### Risk

Low. The demo remains on Three.js 0.160.0 and the same jsDelivr files; only browser module resolution changes.

### Rollback

Revert the pull request's squash commit to restore the previous direct imports.
