import { getAllPosts } from '../lib/content.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const posts = getAllPosts();
const published = posts.filter(post => post.published);
const listed = published.filter(post => post.listed);
const hidden = published.filter(post => !post.listed);
const openComments = published.filter(post => post.commentStatus === 'open');
const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(webRoot, 'public');
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'search-index.json'), JSON.stringify(
  listed.map(({ slug, body }) => ({ slug, text: body })),
));

console.log(`Content ready: ${posts.length} posts, ${published.length} published, ${listed.length} listed, ${hidden.length} unlisted, ${openComments.length} with open comments.`);
