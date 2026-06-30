#!/usr/bin/env node

import {
  cp,
  lstat,
  mkdir,
  readFile,
  realpath,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const EASTBASE_SKILLS = Object.freeze([
  { name: 'eastbase-premium-ui' },
  { name: 'eastbase-review-pr' },
  { name: 'eastbase-launch-check' },
]);

const SKILLS_ROOT = path.join('plugins', 'eastbase', 'skills');
const COPY_MARKER = '.codex-skill-source';

export function validateSkillFrontmatter(markdown, expectedName) {
  const errors = [];
  const normalized = markdown.replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');

  if (lines[0] !== '---') {
    errors.push('missing standalone opening ---');
  }

  const closingIndex = lines.findIndex((line, index) => index > 0 && line === '---');

  if (closingIndex === -1) {
    errors.push('missing standalone closing ---');
  }

  const frontmatter = closingIndex === -1 ? '' : lines.slice(1, closingIndex).join('\n');
  const name = readFrontmatterValue(frontmatter, 'name');
  const description = readFrontmatterValue(frontmatter, 'description');

  if (!name) {
    errors.push('missing name');
  }

  if (!description) {
    errors.push('missing description');
  }

  if (expectedName && name && name !== expectedName) {
    errors.push(`name "${name}" does not match folder "${expectedName}"`);
  }

  return { ok: errors.length === 0, errors };
}

export async function findRepoRoot(startDir = path.dirname(fileURLToPath(import.meta.url))) {
  let current = path.resolve(startDir);

  while (true) {
    const hasMarketplace = await pathExists(path.join(current, '.claude-plugin', 'marketplace.json'));
    const hasEastbaseSkills = await pathExists(path.join(current, SKILLS_ROOT));

    if (hasMarketplace && hasEastbaseSkills) {
      return current;
    }

    const parent = path.dirname(current);

    if (parent === current) {
      throw new Error(`Could not locate repo root from ${startDir}`);
    }

    current = parent;
  }
}

export function getUserCodexSkillsDir() {
  return path.join(homedir(), '.agents', 'skills');
}

export async function installSkills({
  repoRoot,
  destination,
  copy = false,
  logger = console,
} = {}) {
  const root = path.resolve(repoRoot ?? await findRepoRoot());
  const skillsDir = path.resolve(destination ?? getUserCodexSkillsDir());
  const summary = {
    installed: [],
    current: [],
    skipped: [],
    failed: [],
  };

  await mkdir(skillsDir, { recursive: true });

  for (const skill of EASTBASE_SKILLS) {
    const source = path.join(root, SKILLS_ROOT, skill.name);
    const target = path.join(skillsDir, skill.name);

    try {
      await validateCanonicalSkill(source, skill.name);

      const existing = await inspectExistingInstall(target, source);

      if (existing.exists) {
        if (existing.matches) {
          summary.current.push({ name: skill.name, path: target, target: source });
          logger.info(`= ${skill.name} already points to ${source}`);
          continue;
        }

        summary.skipped.push({
          name: skill.name,
          path: target,
          target: source,
          reason: existing.reason,
        });
        logger.warn(`! ${skill.name} skipped: ${existing.reason}`);
        continue;
      }

      if (copy) {
        await copySkill(source, target);
      } else {
        await linkSkill(source, target);
      }

      summary.installed.push({
        name: skill.name,
        path: target,
        target: source,
        mode: copy ? 'copy' : 'symlink',
      });
      logger.info(`+ ${skill.name} installed at ${target}`);
    } catch (error) {
      summary.failed.push({
        name: skill.name,
        path: target,
        target: source,
        error,
      });
      logger.error(`x ${skill.name} failed: ${error.message}`);

      if (!copy) {
        logger.error('  If this environment cannot create links, rerun with --copy.');
      }
    }
  }

  return summary;
}

function readFrontmatterValue(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim() : '';
}

async function validateCanonicalSkill(skillRoot, skillName) {
  const skillFile = path.join(skillRoot, 'SKILL.md');
  const markdown = await readFile(skillFile, 'utf8');
  const result = validateSkillFrontmatter(markdown, skillName);

  if (!result.ok) {
    throw new Error(`${skillFile} has invalid frontmatter: ${result.errors.join(', ')}`);
  }
}

async function pathExists(filePath) {
  try {
    await lstat(filePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }

    throw error;
  }
}

async function inspectExistingInstall(target, source) {
  const targetStats = await safeLstat(target);

  if (!targetStats) {
    return { exists: false, matches: false, reason: '' };
  }

  const sourceRealPath = await realpath(source);
  const targetRealPath = await safeRealpath(target);

  if (targetRealPath === sourceRealPath) {
    return { exists: true, matches: true, reason: '' };
  }

  if (targetStats.isDirectory()) {
    const marker = await readCopyMarker(target);

    if (marker?.sourceRealPath === sourceRealPath) {
      return { exists: true, matches: true, reason: '' };
    }
  }

  return {
    exists: true,
    matches: false,
    reason: `${target} already exists and is not an Eastbase install for ${source}`,
  };
}

async function safeLstat(filePath) {
  try {
    return await lstat(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }

    throw error;
  }
}

async function safeRealpath(filePath) {
  try {
    return await realpath(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }

    throw error;
  }
}

async function readCopyMarker(target) {
  try {
    const marker = await readFile(path.join(target, COPY_MARKER), 'utf8');
    const values = Object.fromEntries(
      marker
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => {
          const separator = line.indexOf('=');
          return separator === -1
            ? [line, '']
            : [line.slice(0, separator), line.slice(separator + 1)];
        }),
    );

    return values.sourceRealPath ? values : null;
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') {
      return null;
    }

    throw error;
  }
}

async function linkSkill(source, target) {
  const parent = path.dirname(target);
  const linkTarget = process.platform === 'win32' ? source : path.relative(parent, source) || '.';
  const linkType = process.platform === 'win32' ? 'junction' : 'dir';

  await mkdir(parent, { recursive: true });
  await symlink(linkTarget, target, linkType);
}

async function copySkill(source, target) {
  const sourceRealPath = await realpath(source);

  await cp(source, target, {
    recursive: true,
    force: false,
    errorOnExist: true,
    dereference: false,
  });
  await writeFile(
    path.join(target, COPY_MARKER),
    `sourceRealPath=${sourceRealPath}\ninstalledBy=scripts/install-codex-skills.mjs\n`,
    { flag: 'wx' },
  );
}

function parseArgs(args) {
  const options = {
    copy: false,
    repo: false,
    help: false,
  };

  for (const arg of args) {
    if (arg === '--copy') {
      options.copy = true;
    } else if (arg === '--repo') {
      options.repo = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Usage: node scripts/install-codex-skills.mjs [--copy] [--repo]

Installs Eastbase skills for Codex from the canonical folders in plugins/eastbase/skills.

Options:
  --copy   Copy skill folders instead of creating links. Use only when links are unavailable.
  --repo   Install links into this repo's .agents/skills instead of $HOME/.agents/skills.
  -h, --help
`);
}

function printSummary(summary) {
  console.log('');
  console.log('Summary');
  console.log(`  Installed: ${summary.installed.length}`);
  console.log(`  Current:   ${summary.current.length}`);
  console.log(`  Skipped:   ${summary.skipped.length}`);
  console.log(`  Failed:    ${summary.failed.length}`);

  if (summary.skipped.length > 0) {
    console.log('');
    console.log('Skipped skills');

    for (const item of summary.skipped) {
      console.log(`  - ${item.name}: ${item.reason}`);
    }
  }

  if (summary.failed.length > 0) {
    console.log('');
    console.log('Failed skills');

    for (const item of summary.failed) {
      console.log(`  - ${item.name}: ${item.error.message}`);
    }
  }
}

async function runCli() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  const repoRoot = await findRepoRoot();

  if (options.repo && options.copy) {
    throw new Error('Refusing to copy skill content into repo-level .agents/skills. Use --repo without --copy.');
  }

  const destination = options.repo
    ? path.join(repoRoot, '.agents', 'skills')
    : getUserCodexSkillsDir();

  console.log('Eastbase Codex skill installer');
  console.log(`Repo:        ${repoRoot}`);
  console.log(`Destination: ${destination}`);
  console.log(`Mode:        ${options.copy ? 'copy' : 'symlink'}`);
  console.log('');

  const summary = await installSkills({
    repoRoot,
    destination,
    copy: options.copy,
  });

  printSummary(summary);

  if (summary.failed.length > 0) {
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCli().catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  });
}
