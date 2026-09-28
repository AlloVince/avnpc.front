import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import yaml from 'js-yaml';
import { fileURLToPath } from 'node:url';

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(webRoot, '..');
const localContentRoot = path.resolve(repoRoot, '..', 'avnpc.content', 'source');
let cachedPosts;

function readFrontMatter(filename) {
  const source = fs.readFileSync(filename, 'utf8').replace(/^\uFEFF/, '');
  const match = source.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  if (!match) throw new Error(`Missing YAML front matter: ${filename}`);
  let attributes;
  try {
    attributes = yaml.load(match[1]);
  } catch (error) {
    throw new Error(`Invalid YAML front matter in ${filename}: ${error.message}`);
  }
  if (!attributes || typeof attributes !== 'object' || Array.isArray(attributes)) {
    throw new Error(`Expected a YAML mapping in ${filename}`);
  }
  return { attributes, body: source.slice(match[0].length).trimStart() };
}

function filesUnder(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(filename) : entry.isFile() && entry.name.endsWith('.md') ? [filename] : [];
  });
}

function asArray(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (value === undefined || value === null || value === '') return [];
  return [String(value)];
}

function dateSeconds(value, filename) {
  const date = value instanceof Date ? value : new Date(value);
  const seconds = Math.floor(date.getTime() / 1000);
  if (!Number.isFinite(seconds)) throw new Error(`Invalid or missing date in ${filename}`);
  return seconds;
}

export function getAllPosts() {
  if (cachedPosts) return cachedPosts;
  const sourceRoot = process.env.CONTENT_ROOT || localContentRoot;
  const postsDir = path.join(sourceRoot, '_posts');
  if (!fs.existsSync(postsDir)) throw new Error(`Content posts directory not found: ${postsDir}`);

  const mappingFile = path.join(sourceRoot, '_data', 'legacy-gitalk.json');
  const legacyIssues = fs.existsSync(mappingFile) ? JSON.parse(fs.readFileSync(mappingFile, 'utf8')) : {};
  const slugs = new Set();
  const posts = filesUnder(postsDir).map(filename => {
    const { attributes, body } = readFrontMatter(filename);
    const slug = String(attributes.slug || attributes.s || path.basename(filename, '.md')).trim();
    if (!slug || slug.includes('/') || slug === '.' || slug === '..') throw new Error(`Invalid slug in ${filename}`);
    if (slugs.has(slug)) throw new Error(`Duplicate slug "${slug}" in content repository`);
    slugs.add(slug);
    if (!attributes.title) throw new Error(`Missing title in ${filename}`);

    const published = attributes.published !== false;
    const legacyId = attributes.legacy_id ?? attributes.legacyId ?? null;
    const legacyGitalkId = legacyIssues[slug] || (legacyId !== null ? `POST_${legacyId}` : null);
    const commentId = legacyGitalkId || (slug.length < 50
      ? slug
      : `slug-${createHash('sha256').update(slug).digest('hex').slice(0, 40)}`);
    return {
      slug,
      title: String(attributes.title),
      body,
      createdAt: dateSeconds(attributes.date, filename),
      updatedAt: attributes.updated ? dateSeconds(attributes.updated, filename) : undefined,
      published,
      listed: attributes.listed !== false,
      tags: asArray(attributes.tags),
      categories: asArray(attributes.categories || attributes.category),
      commentStatus: attributes.comment_status === 'open' || attributes.comments === true || Boolean(legacyIssues[slug]) ? 'open' : 'closed',
      legacyGitalkId,
      commentId,
    };
  });

  cachedPosts = posts.sort((left, right) => right.createdAt - left.createdAt || left.slug.localeCompare(right.slug));
  return cachedPosts;
}

export function getPublishedPosts() {
  return getAllPosts().filter(post => post.published);
}

export function getListedPosts() {
  return getPublishedPosts().filter(post => post.listed);
}

export function getPost(slug) {
  return getPublishedPosts().find(post => post.slug === slug) || null;
}

export function getPostSummaries() {
  return getListedPosts().map(({ slug, title, createdAt, updatedAt, tags, categories }) => ({
    slug, title, createdAt, updatedAt, tags, categories,
  }));
}
