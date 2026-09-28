'use client';
import Link from 'next/link';
export default function ErrorPage({ reset }) {
  return <section className="empty"><p className="eyebrow">SERVICE UNAVAILABLE</p><h1>内容暂时无法加载</h1><p>后端或外部服务暂时不可用，请稍后重试。</p><button onClick={reset}>重新加载</button><Link href="/">返回首页</Link></section>;
}
