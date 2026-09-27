import Link from 'next/link';
import { dateLabel } from '../lib/date';

export default function StaticPostList({ posts, pathname = '/thinking', heading }) {
  const limit = 10;
  const pages = Math.ceil(posts.length / limit);
  return <>
    {heading && <h1>{heading}</h1>}
    <div className="post-list">{posts.slice(0, limit).map(post => <article className="post-item" key={post.slug}>
      <h2><Link href={`/pages/${encodeURIComponent(post.slug)}/`}>{post.title}</Link></h2>
      <p className="info">发布时间：<time dateTime={new Date(post.createdAt * 1000).toISOString()}>{dateLabel(post.createdAt)}</time></p>
    </article>)}</div>
    {pages > 1 && <nav className="pagination" aria-label="分页">
      <span aria-disabled="true" aria-label="上一页">‹</span>
      {Array.from({ length: pages }, (_, index) => index + 1).map(page => <span className="page-number" key={page}>
        <Link aria-label={`第 ${page} 页`} aria-current={page === 1 ? 'page' : undefined} href={page === 1 ? pathname : `${pathname}?offset=${(page - 1) * limit}&limit=${limit}`}>{page}</Link>
      </span>)}
      <Link rel="next" aria-label="下一页" href={`${pathname}?offset=${limit}&limit=${limit}`}>›</Link>
    </nav>}
  </>;
}
