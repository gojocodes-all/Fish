import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(
  new URL('../interactive-3d-shoe-4.html', import.meta.url),
  'utf8',
);

test('parses every inline browser module as JavaScript', () => {
  const moduleSources = [...html.matchAll(
    /<script\b(?=[^>]*\btype=["']module["'])[^>]*>([\s\S]*?)<\/script>/gi,
  )].map((match) => match[1]);

  assert.ok(moduleSources.length > 0, 'expected at least one inline module');

  moduleSources.forEach((source, index) => {
    const result = spawnSync(
      process.execPath,
      ['--input-type=module', '--check'],
      { encoding: 'utf8', input: source },
    );

    assert.ifError(result.error);
    assert.equal(
      result.status,
      0,
      `inline module ${index + 1} must parse as JavaScript\n${result.stderr}`,
    );
  });
});
