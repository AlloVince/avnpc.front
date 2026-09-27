'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { dateLabel } from '../lib/date';

export function paginationHref(pathname, params, offset, limit) {
  const query = new URLSearchParams();
  for (const key of ['tag', 'q']) if (params.get(key)) query.set(key, params.get(key));
  query.set('offset', String(offset));
  query.set('limit', String(limit));
  return `${pathname}?${query}`;
}

export default function PostList({ posts, pathname = '/thinking', heading }) {
  const searchParams = useSearchParams();
  const tag = searchParams.get('tag')?.trim() || '';
  const query = searchParams.get('q')?.trim() || '';
  const [searchIndex, setSearchIndex] = useState(null);
  const [searchError, setSearchError] = useState(false);
  useEffect(() => {
    if (!query || searchIndex) return undefined;
    let active = true;
    fetch('/search-index.json').then(response => {
      if (!response.ok) throw new Error('Search index unavailable');
      return response.json();
    }).then(index => {
      if (active) setSearchIndex(new Map(index.map(entry => [entry.slug, entry.text.toLocaleLowerCase()])));
    }).catch(() => { if (active) setSearchError(true); });
    return () => { active = false; };
  }, [query, searchIndex]);
  const requestedOffset = Number(searchParams.get('offset')) || 0;
  const requestedLimit = Number(searchParams.get('limit')) || 10;
  const limit = Math.min(Math.max(1, requestedLimit), 50);
  const matched = posts.filter(post => {
    if (tag && ![...post.tags, ...post.categories].some(value => value.toLocaleLowerCase() === tag.toLocaleLowerCase())) return false;
    if (query) {
      const haystack = [post.title, ...post.tags, ...post.categories].join(' ').toLocaleLowerCase();
      if (!haystack.includes(query.toLocaleLowerCase()) && !(searchIndex?.get(post.slug)?.includes(query.toLocaleLowerCase()))) return false;
    }
    return true;
  });
  const pages = Math.ceil(matched.length / limit);
  const offset = Math.min(Math.max(0, requestedOffset), Math.max(0, (pages - 1) * limit));
  const visible = matched.slice(offset, offset + limit);
  const page = Math.floor(offset / limit) + 1;
  const pageNumbers = Array.from({ length: pages }, (_, index) => index + 1)
    .filter(number => number === 1 || number === pages || Math.abs(number - page) <= 2);

  return <>
    {heading && <h1>{heading}</h1>}
    {tag && <p className="filter-label">标签：{tag} · <Link href={pathname}>清除筛选</Link></p>}
    {query && <p className="filter-label">搜索：{query} · <Link href="/search/">清除搜索</Link></p>}
    {query && !searchIndex && !searchError && <p role="status">正在搜索文章…</p>}
    {searchError && <p role="status" className="notice">搜索索引暂时不可用，请稍后重试。</p>}
    {visible.length === 0 ? <p className="notice">没有找到符合条件的内容。</p> :
      <div className="post-list">{visible.map(post => <article className="post-item" key={post.slug}>
        <h2><Link href={`/pages/${encodeURIComponent(post.slug)}/`}>{post.title}</Link></h2>
        <p className="info">发布时间：<time dateTime={new Date(post.createdAt * 1000).toISOString()}>{dateLabel(post.createdAt)}</time></p>
      </article>)}</div>}
    {matched.length > limit && <nav className="pagination" aria-label="分页">
      {offset > 0 ? <Link rel="prev" aria-label="上一页" href={paginationHref(pathname, searchParams, Math.max(0, offset - limit), limit)}>‹</Link> : <span aria-disabled="true" aria-label="上一页">‹</span>}
      {pageNumbers.map((number, index) => <span className="page-number" key={number}>
        {index > 0 && number - pageNumbers[index - 1] > 1 && <span className="page-gap">…</span>}
        <Link aria-label={`第 ${number} 页`} aria-current={number === page ? 'page' : undefined} href={paginationHref(pathname, searchParams, (number - 1) * limit, limit)}>{number}</Link>
      </span>)}
      {offset + limit < matched.length ? <Link rel="next" aria-label="下一页" href={paginationHref(pathname, searchParams, offset + limit, limit)}>›</Link> : <span aria-disabled="true" aria-label="下一页">›</span>}
    </nav>}
  </>;
}
