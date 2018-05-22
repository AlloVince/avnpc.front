import Head from 'next/head';
import Router, { withRouter } from 'next/router';
import { Layout, Menu, Icon, Input } from 'antd';
import React from 'react';
import NProgress from 'nprogress';
import { Link } from '../routes';
import ActiveLink from './ActiveLink';
// import BlogCss from '../styls/blog.styl';

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

const { Sider } = Layout;

class BlogHeader extends React.Component {
  static defaultProps = {
    router: {},
    title: 'Just Fine'
  };

  static getDefaultSelectedKeys(router) {
    const { asPath } = router;
    const [urlPath] = asPath.split('?');
    if (urlPath === '/' || urlPath.startsWith('/pages')) {
      return ['/thinking'];
    }

    return [urlPath.split('/').slice(0, 2).join('/')];
  }

  render() {
    return (
      <Sider
        onCollapse={this.onCollapse}
        breakpoint="lg"
        collapsedWidth="0"
        style={{ minHeight: '100vh', position: 'fixed' }}
      >
        <Head>
          <title>{this.props.title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta charSet="utf-8"/>
          <link href="/static/favicon.ico" type="image/x-icon" rel="icon"/>
          <link rel="alternate" type="application/rss+xml" title="Just Fine - Story of AlloVince" href="/rss"/>
          <link href="/static/vendor.css" media="screen" rel="stylesheet" type="text/css" />
          {/*<style key="mainCss">{BlogCss}</style>*/}
        </Head>
        <div id="logo" className="logo">
          <h1><Link route="index"><a href="/">Just Fine</a></Link></h1>
          <p>— Story of AlloVince</p>
        </div>
        <div className="main-menu">
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={this.constructor.getDefaultSelectedKeys(this.props.router)}
          >
            <Menu.Item key="/thinking">
              <ActiveLink href="/thinking" icon="code-o">Thinking</ActiveLink>
            </Menu.Item>
            <Menu.Item key="/reading">
              <ActiveLink href="/reading" icon="book">Reading</ActiveLink>
            </Menu.Item>
            <Menu.Item key="/about">
              <ActiveLink href="/about" icon="user">About</ActiveLink>
            </Menu.Item>
            <Menu.Item key="/search">
              <form action="/search">
                <Input
                  name="q"
                  suffix={<Icon type="search" className="certain-category-icon"/>}
                  className="search"
                  defaultValue={this.props.router.pathname === '/search' ? this.props.router.query.q : ''}
                />
              </form>
            </Menu.Item>
          </Menu>
        </div>
      </Sider>
    );
  }
}

export default withRouter(BlogHeader);

