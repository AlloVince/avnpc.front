import React from 'react';
import { Layout } from 'antd';
import BlogHeader from '../components/BlogHeader';

const { Content } = Layout;

export default class extends React.Component {
  static getInitialProps({ res, xhr }) {
    const statusCode = res ? res.statusCode : (xhr ? xhr.status : null);
    return { statusCode };
  }

  render() {
    return (
      <Layout>
        <BlogHeader/>
        <Layout id="main">
          <Content>
            {this.props.statusCode}
          </Content>
        </Layout>
      </Layout>
    );
  }
}
