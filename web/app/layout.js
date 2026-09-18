import localFont from 'next/font/local';
import Sidebar from '../components/Sidebar';
import 'katex/dist/katex.min.css';
import './globals.css';

const sarina = localFont({ src: '../../static/fonts/sarina-v6-latin-regular.woff2', variable: '--font-sarina', display: 'swap' });
const greatVibes = localFont({ src: '../../static/fonts/great-vibes-v5-latin-regular.woff2', variable: '--font-great-vibes', display: 'swap' });

export const metadata = {
  title: { default: 'Just Fine — Story of AlloVince', template: '%s | Just Fine' },
  description: 'AlloVince 的个人博客。记录技术、阅读与生活。',
  alternates: { types: { 'application/atom+xml': '/rss' } },
};

export default function RootLayout({ children }) {
  return <html lang="zh-CN" className={`${sarina.variable} ${greatVibes.variable}`}><body>
    <a className="skip-link" href="#main">跳到正文</a>
    <Sidebar/>
    <main id="main" tabIndex={-1}><div className="page-inner">{children}</div></main>
  </body></html>;
}
