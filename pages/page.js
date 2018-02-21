import React from 'react';
import { Layout } from 'antd';
import BlogHeader from '../components/BlogHeader';
import BlogPost from '../components/BlogPost';
import HttpClient from '../services/http_client';

const { Content } = Layout;

export default class extends React.Component {
  static async getInitialProps({ query }) {
    return { post: await HttpClient.requestRestAPI(`http://localhost:3001/v1/blog/posts/${query.slug}`), query };
  }

  render() {
    const { post, query } = this.props;
    if (!post) {
      throw new Error(`No post found for ${query.slug}`);
    }
    return (
      <Layout>
        <BlogHeader title={post.title}/>
        <Layout>
          <Content>
            <div id="page" className="page">
              <div className="page-inner">
                <BlogPost post={post}/>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

