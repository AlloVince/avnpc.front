import Head from 'next/head';
import { Layout, Menu, Icon } from 'antd';
import React from 'react';
// import AntdCss from '../antd-custom/index.css';
import AntdCss from '../styls/antd.less';
import { Link } from '../routes';
import ActiveLink from './ActiveLink';
import BlogCss from '../styls/blog.styl';
// import favicon from '../static/favicon.ico';

const { Sider } = Layout;

export default class extends React.Component {
  onCollapse = (collapsed, type) => {
    this.setState({ collapsed });
  };

  props = {
    title: 'Just Fine'
  };


  render() {
    return (
      <Sider
        onCollapse={this.onCollapse}
        breakpoint="lg"
        collapsedWidth="0"
        // style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}
        style={{ minHeight: '100vh', position: 'fixed' }}
      >
        <Head>
          <title>{this.props.title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta charSet="utf-8"/>
          <link href="/static/favicon.ico" type="image/x-icon" rel="icon"/>
          {/*<link href={favicon} type="image/x-icon" rel="shortcut icon"/>*/}
          <style key="antdCss">{AntdCss}</style>
          {/*<style dangerouslySetInnerHTML={{ __html: AntdProCss }}/>*/}
          <style key="blogCss">{BlogCss}</style>
        </Head>
        <div id="logo" className="logo">
          <h1><Link route="index"><a>Just Fine</a></Link></h1>
          <p>— Story of AlloVince</p>
        </div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1">
            <Icon type="book"/>
            <ActiveLink href="/">Thinking</ActiveLink>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="verticle-right"/>
            <ActiveLink href="/pages">Projects</ActiveLink>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="minus-square-o"/>
            <ActiveLink href="/about">About</ActiveLink>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}
