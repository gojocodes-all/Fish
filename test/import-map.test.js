import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../interactive-3d-shoe-4.html', import.meta.url), 'utf8');

test('maps Three.js and its addons to the same pinned release', () => {
  const importMapSource = html.match(
    /<script\s+type=["']importmap["']>([\s\S]*?)<\/script>/i,
  )?.[1];

  assert.ok(importMapSource, 'expected an import map');

  const importMap = JSON.parse(importMapSource);
  assert.equal(
    importMap.imports.three,
    'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js',
  );
  assert.equal(
    importMap.imports['three/addons/'],
    'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/',
  );
});

test('loads OrbitControls through the mapped addon path', () => {
  assert.match(html, /import \* as THREE from ["']three["']/);
  assert.match(
    html,
    /import \{ OrbitControls \} from ["']three\/addons\/controls\/OrbitControls\.js["']/,
  );
});

test('wires rendering to reduced-motion and page-visibility state', () => {
  assert.match(
    html,
    /import \{ createRenderLoop \} from ["']\.\/assets\/js\/render-loop\.js["']/,
  );
  assert.match(html, /matchMedia\(["']\(prefers-reduced-motion: reduce\)["']\)/);
  assert.match(html, /document\.addEventListener\(["']visibilitychange["']/);
  assert.match(
    html,
    /shouldRun:\s*\(\) => !document\.hidden && !reducedMotion\.matches/,
  );
  assert.match(html, /controls\.enableDamping = !reducedMotion\.matches/);
});


test('provides keyboard-operable viewer controls and feedback', () => {
  for (const action of [
    'rotate-left',
    'rotate-right',
    'zoom-in',
    'zoom-out',
    'reset',
  ]) {
    assert.match(
      html,
      new RegExp(
        `<button[^>]+type=["']button["'][^>]+data-view-action=["']${action}["']`,
      ),
    );
  }

  assert.match(
    html,
    /class=["']viewer-controls["'][^>]+aria-label=["']3D sneaker viewer controls["']/,
  );
  assert.match(
    html,
    /id=["']viewer-status["'][^>]+aria-live=["']polite["']/,
  );
  assert.match(html, /renderer\.domElement\.setAttribute\(["']role["'], ["']img["']\)/);
  assert.match(html, /viewControls\.addEventListener\(["']click["']/);
  assert.match(html, /controls\.minDistance/);
  assert.match(html, /controls\.maxDistance/);
});
