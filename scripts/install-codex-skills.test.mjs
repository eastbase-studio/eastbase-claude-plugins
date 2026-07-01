import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, realpath, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

import {
  EASTBASE_SKILLS,
  installSkills,
  validateSkillFrontmatter,
} from './install-codex-skills.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXPECTED_EASTBASE_SKILLS = [
  'eastbase-premium-ui',
  'eastbase-review-pr',
  'eastbase-launch-check',
  'eastbase-blog-post',
];

async function withTempDir(callback) {
  const dir = await mkdtemp(path.join(tmpdir(), 'eastbase-codex-skills-'));

  try {
    return await callback(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

function silentLogger() {
  return {
    info() {},
    warn() {},
    error() {},
  };
}

test('installer includes every canonical Eastbase skill folder', () => {
  assert.deepEqual(
    EASTBASE_SKILLS.map((skill) => skill.name),
    EXPECTED_EASTBASE_SKILLS,
  );
});

test('canonical Eastbase skills have Codex-compatible frontmatter', async () => {
  for (const skill of EASTBASE_SKILLS) {
    const skillMarkdown = await readFile(
      path.join(repoRoot, 'plugins', 'eastbase', 'skills', skill.name, 'SKILL.md'),
      'utf8',
    );

    const result = validateSkillFrontmatter(skillMarkdown);

    assert.equal(result.ok, true, `${skill.name}: ${result.errors.join(', ')}`);
  }
});

test('installs symlinks to the canonical skill folders and is repeatable', async () => {
  await withTempDir(async (dir) => {
    const destination = path.join(dir, '.agents', 'skills');
    const firstRun = await installSkills({
      repoRoot,
      destination,
      copy: false,
      logger: silentLogger(),
    });

    assert.equal(firstRun.installed.length, EASTBASE_SKILLS.length);
    assert.equal(firstRun.skipped.length, 0);
    assert.equal(firstRun.failed.length, 0);

    for (const skill of EASTBASE_SKILLS) {
      const installedPath = path.join(destination, skill.name);
      const canonicalPath = path.join(repoRoot, 'plugins', 'eastbase', 'skills', skill.name);

      assert.equal(await realpath(installedPath), await realpath(canonicalPath));
    }

    const secondRun = await installSkills({
      repoRoot,
      destination,
      copy: false,
      logger: silentLogger(),
    });

    assert.equal(secondRun.installed.length, 0);
    assert.equal(secondRun.current.length, EASTBASE_SKILLS.length);
    assert.equal(secondRun.skipped.length, 0);
    assert.equal(secondRun.failed.length, 0);
  });
});

test('skips unrelated existing folders without overwriting them', async () => {
  await withTempDir(async (dir) => {
    const destination = path.join(dir, '.agents', 'skills');
    const conflictPath = path.join(destination, 'eastbase-premium-ui');
    const markerPath = path.join(conflictPath, 'KEEP.txt');

    await mkdir(conflictPath, { recursive: true });
    await writeFile(markerPath, 'user-owned folder\n', 'utf8');

    const summary = await installSkills({
      repoRoot,
      destination,
      copy: false,
      logger: silentLogger(),
    });

    assert.equal(await readFile(markerPath, 'utf8'), 'user-owned folder\n');
    assert.equal(summary.installed.length, EASTBASE_SKILLS.length - 1);
    assert.equal(summary.skipped.length, 1);
    assert.equal(summary.skipped[0].name, 'eastbase-premium-ui');
  });
});

test('supports explicit copy mode for environments that cannot create links', async () => {
  await withTempDir(async (dir) => {
    const destination = path.join(dir, '.agents', 'skills');
    const summary = await installSkills({
      repoRoot,
      destination,
      copy: true,
      logger: silentLogger(),
    });

    assert.equal(summary.installed.length, EASTBASE_SKILLS.length);

    for (const skill of EASTBASE_SKILLS) {
      const installedPath = path.join(destination, skill.name);
      const canonicalPath = path.join(repoRoot, 'plugins', 'eastbase', 'skills', skill.name);
      const installedSkill = await readFile(path.join(installedPath, 'SKILL.md'), 'utf8');
      const canonicalSkill = await readFile(path.join(canonicalPath, 'SKILL.md'), 'utf8');

      assert.notEqual(await realpath(installedPath), await realpath(canonicalPath));
      assert.equal(installedSkill, canonicalSkill);
      assert.equal((await stat(path.join(installedPath, '.codex-skill-source'))).isFile(), true);
    }
  });
});
