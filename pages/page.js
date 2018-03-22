import React from 'react';
import { Layout } from 'antd';
import hljsCss from '../styls/dark.css';
import BlogHeader from '../components/BlogHeader';
import BlogPost from '../components/BlogPost';
import HttpClient from '../services/http_client';

const { Content } = Layout;

export default class extends React.Component {
  static async getInitialProps({ query }) {
    return { post: await HttpClient.requestRestAPI(`http://localhost:3001/v1/blog/posts/${query.slug}`), query };
  }

  componentDidMount() {
    // console.log('After render');
    // hljs.initHighlighting.called = false;
    // hljs.initHighlighting();
  }

  render() {
    const { post, query } = this.props;
    if (!post) {
      throw new Error(`No post found for ${query.slug}`);
    }
    return (
      <Layout>
        <style dangerouslySetInnerHTML={{ __html: hljsCss.toString() }}/>
        <BlogHeader title={post.title}/>
        <Layout style={{ marginLeft: 200 }}>
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

