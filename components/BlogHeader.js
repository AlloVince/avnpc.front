import Head from 'next/head';
import { withRouter } from 'next/router';
import { Layout, Menu, Icon, Input } from 'antd';
import React from 'react';
import AntdCss from '../styls/antd.less';
import { Link } from '../routes';
import ActiveLink from './ActiveLink';
import BlogCss from '../styls/blog.styl';

const { Sider } = Layout;

class BlogHeader extends React.Component {
  static defaultProps = {
    title: 'Just Fine'
  };

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
          <link rel="alternate" type="application/rss+xml" title="Just Fine - Story of AlloVince" href="/rss" />
          <style key="antdCss">{AntdCss}</style>
          <style key="blogCss">{BlogCss}</style>
        </Head>
        <div id="logo" className="logo">
          <h1><Link route="index"><a>Just Fine</a></Link></h1>
          <p>— Story of AlloVince</p>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.props.router.pathname]}>
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
            <Input suffix={<Icon type="search" className="certain-category-icon"/>} className="search"/>
          </Menu.Item>
        </Menu>
        <style jsx>{`
        .search input {
          opacity:0.4;
        }
        .search input:focus {
          opacity:1;
        }
        `}</style>
      </Sider>
    );
  }
}

export default withRouter(BlogHeader);

