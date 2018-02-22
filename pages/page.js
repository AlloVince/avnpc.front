import React from 'react';
import Head from 'next/head';
import { Layout } from 'antd';
import hljs from 'highlight.js/lib/index';
import hljsCss from 'highlight.js/styles/dark.css';
import BlogHeader from '../components/BlogHeader';
import BlogPost from '../components/BlogPost';
import HttpClient from '../services/http_client';

const { Content } = Layout;

export default class extends React.Component {
  static async getInitialProps({ query }) {
    return { post: await HttpClient.requestRestAPI(`http://localhost:3001/v1/blog/posts/${query.slug}`), query };
  }

  componentDidMount() {
    hljs.initHighlightingOnLoad();
  }

  render() {
    const { post, query } = this.props;
    if (!post) {
      throw new Error(`No post found for ${query.slug}`);
    }
    return (
      <Layout>
        <Head>
          <style jsx>{`
            .hljs {
              display: block;
              overflow-x: auto;
              padding: 0.5em;
              background: #444;
            }

            .hljs-keyword,
            .hljs-selector-tag,
            .hljs-literal,
            .hljs-section,
            .hljs-link {
              color: white;
            }

            .hljs,
            .hljs-subst {
              color: #ddd;
            }

            .hljs-string,
            .hljs-title,
            .hljs-name,
            .hljs-type,
            .hljs-attribute,
            .hljs-symbol,
            .hljs-bullet,
            .hljs-built_in,
            .hljs-addition,
            .hljs-variable,
            .hljs-template-tag,
            .hljs-template-variable {
              color: #d88;
            }

            .hljs-comment,
            .hljs-quote,
            .hljs-deletion,
            .hljs-meta {
              color: #777;
            }

            .hljs-keyword,
            .hljs-selector-tag,
            .hljs-literal,
            .hljs-title,
            .hljs-section,
            .hljs-doctag,
            .hljs-type,
            .hljs-name,
            .hljs-strong {
              font-weight: bold;
            }

            .hljs-emphasis {
              font-style: italic;
            }
            `}</style>
          {/*<style dangerouslySetInnerHTML={{ __html: hljsCss }}/>*/}
        </Head>
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

