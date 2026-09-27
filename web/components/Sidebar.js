'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = pathname === '/' || pathname.startsWith('/pages/') || pathname.startsWith('/thinking') ? '/thinking' : `/${pathname.split('/')[1]}`;
  const close = () => setOpen(false);

  return <div className="site-navigation" onKeyDown={event => {
    if (event.key === 'Escape' && open) {
      close();
      event.currentTarget.querySelector('button').focus();
    }
  }}>
    <button className={`menu-toggle${open ? ' is-open' : ''}`} type="button" aria-controls="site-sidebar" aria-expanded={open} aria-label={open ? '关闭导航' : '打开导航'} onClick={() => setOpen(!open)}>☰</button>
    <header id="site-sidebar" className={`site-sidebar${open ? ' is-open' : ''}`}>
      <div className="logo"><h1><Link href="/" onClick={close}>Just Fine</Link></h1><p>— Story of AlloVince</p></div>
      <nav aria-label="主导航">
        <Link href="/thinking/" aria-current={active === '/thinking' ? 'page' : undefined} onClick={close}><span className="nav-icon" aria-hidden="true">&lt;/&gt;</span>Thinking</Link>
        <Link href="/reading/" aria-current={active === '/reading' ? 'page' : undefined} onClick={close}><svg className="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><path d="M2 2h9a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V2Zm0 9h11M5 2v9"/></svg>Reading</Link>
        <Link href="/about/" aria-current={active === '/about' ? 'page' : undefined} onClick={close}>About</Link>
      </nav>
      <form action="/search/" className="search-form" role="search">
        <label className="sr-only" htmlFor="site-search">搜索博客</label>
        <input id="site-search" name="q" type="search" maxLength={200}/>
        <button type="submit" aria-label="搜索"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="6.5" cy="6.5" r="4.5"/><path d="m10 10 4 4"/></svg></button>
      </form>
    </header>
  </div>;
}
