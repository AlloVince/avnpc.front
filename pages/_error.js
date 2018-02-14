import React from 'react';
import { Layout } from 'antd';
// import Exception from 'ant-design-pro/lib/Exception';
import BlogHeader from '../components/BlogHeader';

const { Content } = Layout;

export default class extends React.Component {
  static getInitialProps({ res, xhr }) {
    const statusCode = res ? res.statusCode : (xhr ? xhr.status : null);
    console.log(statusCode)
    return { statusCode };
  }

  render() {
    return (
      <Layout>
        <BlogHeader/>
        <Layout>
          <Content>
            {/*<Exception type="404"/>*/}
          </Content>
        </Layout>
      </Layout>
    );
  }
}
