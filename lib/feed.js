const xml = value => String(value ?? '').replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]);
const iso = seconds => new Date(Number(seconds || 0) * 1000).toISOString();
export function createFeed(posts, origin) {
  const base = new URL(origin).origin;
  return `<?xml version="1.0" encoding="utf-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom"><title>Just Fine - Story of AlloVince</title><id>${xml(base)}/</id><updated>${iso(Math.max(0, ...posts.map(post => post.updatedAt || post.createdAt || 0)))}</updated><link href="${xml(base)}/rss" rel="self" type="application/atom+xml"/><link href="${xml(base)}/"/><author><name>AlloVince</name></author>${posts.map(post => `<entry><id>${xml(base)}/pages/${xml(encodeURIComponent(post.slug))}</id><title>${xml(post.title)}</title><link href="${xml(base)}/pages/${xml(encodeURIComponent(post.slug))}/"/><updated>${iso(post.updatedAt || post.createdAt)}</updated><published>${iso(post.createdAt)}</published><content type="text">${xml(post.body || '')}</content></entry>`).join('')}</feed>`;
}
