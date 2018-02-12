import Head from 'next/head';
import { Link, Router } from '../routes';
import ActiveLink from './ActiveLink';
import stylesheet from '../styles/global.less';

export default ({ title }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <meta charSet="utf-8"/>
      <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
    </Head>
    <header id="header" className="header">
      <h1><Link route="index"><a>Just Fine</a></Link></h1>
      <p>— Story of AlloVince</p>
      <nav id="menu">
        <ul className="submenu">
          <li><ActiveLink href="/">Thinking</ActiveLink></li>
          <li><Link route="blog" params={{ slug: 'about' }}><a>Projects</a></Link></li>
          <li><ActiveLink href="/about">About</ActiveLink></li>
          <li><a href="/feed"><i className="icon-rss"></i></a></li>
        </ul>
      </nav>
    </header>
  </div>
);
