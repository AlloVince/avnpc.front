import Link from 'next/link';
export default function NotFound() {
  return <section className="empty"><p className="eyebrow">404 / NOT FOUND</p><h1>这页故事不在这里</h1><p>链接可能已变更，试试搜索或返回文章列表。</p><Link href="/">返回首页 →</Link></section>;
}
