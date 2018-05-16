import React from 'react';
import { Layout } from 'antd';
import BlogHeader from '../components/BlogHeader';
import Exception from '../components/Exception';

const { Content } = Layout;

export default class extends React.Component {
  static getInitialProps({ res, xhr }) {
    const statusCode = res ? res.statusCode : (xhr ? xhr.status : null);
    return { statusCode };
  }

  render() {
    return (
      <Layout style={{ height: '100%' }}>
        <BlogHeader/>
        <Layout id="main" style={{ height: '100%', 'min-height': '100vh' }}>
          <Content>
            <Exception type={this.props.statusCode}/>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
