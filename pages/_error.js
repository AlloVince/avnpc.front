import React from 'react';
import { Layout } from 'antd';
import BlogHeader from '../components/BlogHeader';
import Exception from '../components/Exception';

const { Content } = Layout;

export default class extends React.Component {
  static getInitialProps({ res, xhr }) {
    let statusCode = null;
    if (res) {
      ({ statusCode } = res);
    } else {
      statusCode = (xhr ? xhr.status : null);
    }
    return { statusCode };
  }

  render() {
    const { statusCode } = this.props;
    return (
      <Layout style={{ height: '100%' }}>
        <BlogHeader/>
        <Layout id="main" style={{ height: '100%', minHeight: '100vh' }}>
          <Content>
            <Exception type={statusCode}/>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
