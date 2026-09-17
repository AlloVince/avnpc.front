export function listQuery(query) {
  const integer = (value, fallback, max) => /^\d+$/.test(String(value)) ? Math.min(Number(value), max) : fallback;
  return {
    offset: integer(query.offset, 0, 100000),
    limit: Math.max(1, integer(query.limit, 10, 50)),
    ...(typeof query.tag === 'string' && query.tag ? { tag: query.tag.slice(0, 100) } : {}),
    ...(typeof query.q === 'string' && query.q ? { q: query.q.trim().slice(0, 200) } : {}),
  };
}
