import Link from 'next/link';
import './globals.css';
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css';

export const metadata = {
  title: { default: 'Just Fine — Story of AlloVince', template: '%s | Just Fine' },
  description: 'AlloVince 的个人博客。记录技术、阅读与生活。',
  alternates: { types: { 'application/atom+xml': '/rss' } },
};

export default function RootLayout({ children }) {
  return <html lang="zh-CN"><body>
    <a className="skip-link" href="#main">跳到正文</a>
    <header className="site-header">
      <Link className="brand" href="/">Just Fine<span>Story of AlloVince</span></Link>
      <nav aria-label="主导航">
        <Link href="/thinking">Thinking</Link><Link href="/reading">Reading</Link><Link href="/about">About</Link><a href="/rss">RSS ↗</a>
      </nav>
      <form action="/search" className="search-form" role="search"><label className="sr-only" htmlFor="site-search">搜索博客</label><input id="site-search" name="q" type="search" placeholder="搜索文章…" maxLength={200}/><button type="submit">搜索</button></form>
    </header>
    <main id="main">{children}</main>
    <footer className="site-footer"><span>Just Fine · AlloVince</span><span>记录思考，保持好奇。</span><a href="/rss">订阅 Atom</a></footer>
  </body></html>;
}
