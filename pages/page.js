import React from 'react';
import { Layout } from 'antd';
import BlogHeader from '../components/BlogHeader';
import BlogPost from '../components/BlogPost';

const { Content } = Layout;

export default class extends React.Component {
  static async getInitialProps({ query }) {
    const response = await fetch(`http://localhost:3001/v1/blog/posts/${query.slug}`);
    const json = await response.json();
    return { post: json };
  }

  render() {
    const { post } = this.props;
    if (!post) {
      throw new Error();
    }
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <BlogHeader title={post.title}/>
        <Layout style={{ backgroundColor: '#FFF' }}>
          <Content style={{ margin: '150px 20px 20px 50px', maxWidth: '900px' }}>
            <BlogPost post={post}/>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

