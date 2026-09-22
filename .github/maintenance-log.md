# Maintenance log

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
