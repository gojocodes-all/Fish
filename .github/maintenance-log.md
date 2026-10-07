# Maintenance log

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
