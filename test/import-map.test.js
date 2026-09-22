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
