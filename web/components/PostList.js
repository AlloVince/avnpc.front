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
  return <>
    <div className="section-heading"><h2>{query.tag ? `# ${query.tag}` : kind === 'reading' ? '阅读收藏' : kind === 'search' ? '搜索结果' : '全部文章'}</h2><span>{total} 篇 · 第 {page} 页</span></div>
    {results.length === 0 ? <p className="notice">没有找到符合条件的内容。<Link href={pathname}>清除筛选</Link></p> :
      <div className="post-list">{results.map(post => <article className="post-item" key={post.id || post.url}>
        {post.createdAt ? <time dateTime={new Date(post.createdAt * 1000).toISOString()}>{dateLabel(post.createdAt)}</time> : <span/>}
        <div><h2><Link href={kind === 'search' ? safeResultUrl(post.url) : `${kind === 'reading' ? '/reading' : '/pages'}/${encodeURIComponent(post.slug)}`}>{post.title}</Link></h2>{post.summary && <p>{post.summary.replace(/<[^>]*>/g, '')}</p>}</div><span className="arrow" aria-hidden="true">↗</span>
      </article>)}</div>}
    {total > limit && <nav className="pagination" aria-label="分页">
      {offset > 0 ? <Link rel="prev" href={paginationHref(pathname, query, Math.max(0, offset - limit), limit)}>← 上一页</Link> : <span>已是第一页</span>}
      <span>{page} / {Math.ceil(total / limit)}</span>
      {offset + limit < total ? <Link rel="next" href={paginationHref(pathname, query, offset + limit, limit)}>下一页 →</Link> : <span>已是最后一页</span>}
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
