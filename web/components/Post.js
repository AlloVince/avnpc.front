import Link from 'next/link';
import { dateLabel } from '../lib/api';
import { renderMarkdown } from '../lib/markdown';

export default function Post({ post }) {
  const source = post.text?.content || post.text?.markedContent || '';
  return <article className="article">
    <header className="article-header"><Link className="eyebrow" href="/thinking">← THINKING / 技术与生活</Link><h1>{post.title}</h1><p className="meta"><time dateTime={new Date(post.createdAt * 1000).toISOString()}>{dateLabel(post.createdAt)}</time><span>AlloVince</span></p></header>
    {source ? <div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(source) }}/> : <p role="status">这篇文章暂时没有正文。</p>}
    <div className="tags">{(post.tags || []).map(tag => <Link key={tag.id} href={`/thinking?tag=${encodeURIComponent(tag.tagName)}`}># {tag.tagName}</Link>)}</div>
    <p className="license">除特别声明外，文章由 <Link href="/about">AlloVince</Link> 原创，采用 <a href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</a> 许可。</p>
    <nav className="post-nav" aria-label="相邻文章">{post.prev && <Link href={`/pages/${encodeURIComponent(post.prev.slug)}`}><small>← 上一篇</small>{post.prev.title}</Link>}{post.next && <Link href={`/pages/${encodeURIComponent(post.next.slug)}`}><small>下一篇 →</small>{post.next.title}</Link>}</nav>
    {post.commentStatus === 'open' && <p className="service-note">评论服务尚未配置。<a href="https://github.com/AlloVince/avnpc.content/issues">可在 GitHub 反馈或勘误 ↗</a></p>}
  </article>;
}
