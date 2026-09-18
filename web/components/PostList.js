import Link from 'next/link';
import { dateLabel } from '../lib/api';

export function paginationHref(pathname, query, offset, limit) {
  const params = new URLSearchParams();
  for (const key of ['tag', 'q']) if (query[key]) params.set(key, query[key]);
  params.set('offset', String(offset));
  params.set('limit', String(limit));
  return `${pathname}?${params}`;
}

export default function PostList({ data, query = {}, pathname = '/thinking', kind = 'blog' }) {
  const { results, pagination } = data;
  const { total, offset, limit } = pagination;
  const page = Math.floor(offset / limit) + 1;
  const pages = Math.ceil(total / limit);
  const pageNumbers = Array.from({ length: pages }, (_, index) => index + 1)
    .filter(number => number === 1 || number === pages || Math.abs(number - page) <= 2);
  return <>
    {query.tag && <p className="filter-label">标签：{query.tag} · <Link href={pathname}>清除筛选</Link></p>}
    {results.length === 0 ? <p className="notice">没有找到符合条件的内容。<Link href={pathname}>清除筛选</Link></p> :
      <div className="post-list">{results.map(post => <article className="post-item" key={post.id || post.url}>
        <h2><Link href={kind === 'search' ? safeResultUrl(post.url) : `${kind === 'reading' ? '/reading' : '/pages'}/${encodeURIComponent(post.slug)}`}>{post.title}</Link></h2>
        {post.createdAt && <p className="info">发布时间：<time dateTime={new Date(post.createdAt * 1000).toISOString()}>{dateLabel(post.createdAt)}</time></p>}
        {kind === 'search' && post.summary && <p>{post.summary.replace(/<[^>]*>/g, '')}</p>}
      </article>)}</div>}
    {total > limit && <nav className="pagination" aria-label="分页">
      {offset > 0 ? <Link rel="prev" aria-label="上一页" href={paginationHref(pathname, query, Math.max(0, offset - limit), limit)}>‹</Link> : <span aria-disabled="true" aria-label="上一页">‹</span>}
      {pageNumbers.map((number, index) => <span className="page-number" key={number}>
        {index > 0 && number - pageNumbers[index - 1] > 1 && <span className="page-gap">…</span>}
        <Link aria-label={`第 ${number} 页`} aria-current={number === page ? 'page' : undefined} href={paginationHref(pathname, query, (number - 1) * limit, limit)}>{number}</Link>
      </span>)}
      {offset + limit < total ? <Link rel="next" aria-label="下一页" href={paginationHref(pathname, query, offset + limit, limit)}>›</Link> : <span aria-disabled="true" aria-label="下一页">›</span>}
    </nav>}
  </>;
}

function safeResultUrl(value) {
  try {
    const url = new URL(value, 'https://avnpc.com');
    if (!['https:', 'http:'].includes(url.protocol)) return '#';
    return url.hostname === 'avnpc.com' ? `${url.pathname}${url.search}` : url.href;
  } catch { return '#'; }
}
