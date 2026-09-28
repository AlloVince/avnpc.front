import Link from 'next/link';
import { dateLabel } from '../lib/date';
import { renderMarkdown } from '../lib/markdown';
import MarkdownContent from './MarkdownContent';
import GitalkComments from './GitalkComments';

export default function Post({ post }) {
  const source = post.body || '';
  return <article className="article">
    <header className="article-header"><h1>{post.title}</h1><p className="info"><time dateTime={new Date(post.createdAt * 1000).toISOString()}>{dateLabel(post.createdAt)}</time></p></header>
    <p className="license">日志未经声明，均为 <Link href="/about/">AlloVince</Link> 原创。本作品采用 <a rel="license" href="https://creativecommons.org/licenses/by-nc/4.0/">知识共享署名-非商业性使用 4.0 国际许可协议</a> 进行许可。</p>
    {source ? <MarkdownContent html={renderMarkdown(source)}/> : <p role="status">这篇文章暂时没有正文。</p>}
    {(post.tags?.length > 0 || post.categories?.length > 0) && <div className="tags">Tags：{[...post.categories, ...post.tags].map(tag => <Link key={tag} href={`/thinking/?tag=${encodeURIComponent(tag)}`}>{tag}</Link>)}</div>}
    {(post.prev || post.next) && <nav className="post-nav" aria-label="相邻文章">
      {post.prev && <Link href={`/pages/${encodeURIComponent(post.prev.slug)}/`} title={post.prev.title}>‹ 上一篇</Link>}
      <time dateTime={new Date(post.createdAt * 1000).toISOString()}>{dateLabel(post.createdAt)}</time>
      {post.next && <Link href={`/pages/${encodeURIComponent(post.next.slug)}/`} title={post.next.title}>下一篇 ›</Link>}
    </nav>}
    {post.commentStatus === 'open' && <GitalkComments post={post}/>}
  </article>;
}
