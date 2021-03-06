import React from 'react';
import { DateTime } from 'luxon';
import { Layout, Pagination } from 'antd';
import { Link, Router } from '../routes';
import BlogHeader from '../components/BlogHeader';
import HttpClient from '../services/http_client';


const { Content } = Layout;

export default class extends React.Component {
  static defaultProps = {
    posts: {},
    query: {}
  };

  static async getInitialProps({ query }) {
    const { offset, limit = 10, tag } = query;
    return {
      query,
      posts: await HttpClient.requestRestAPI({
        pathname: '/v1/blog/posts',
        query: {
          offset,
          limit,
          tag
        }
      })
    };
  }

  render() {
    const { posts: { results: posts, pagination: { limit, offset, total } } } = this.props;
    const { query: { tag } } = this.props;
    const onChange = (page) => {
      Router.pushRoute('thinking', { offset: (page - 1) * limit, limit });
    };

    return (
      <Layout>
        <BlogHeader
          title={`Story of AlloVince | Thinking ${tag ? `about ${tag}` : ''}- ${offset} to ${offset + limit} of ${total}`}
        />
        <Layout id="main">
          <Content>
            <div id="page" className="page">
              <div className="page-inner">
                {posts.map(post =>
                  <div className="item" key={`post-${post.id}`}>
                    <div className="item-inline item-title">
                      <h2>
                        <Link
                          route="page"
                          params={{ slug: post.slug }}
                        >
                          <a href={`/pages/${post.slug}`}>{post.title}</a>
                        </Link>
                      </h2>
                      <p className="info">
                        发布时间：
                        <time
                          dateTime={DateTime.fromMillis(post.createdAt * 1000).toISOTime()}
                          className="agotime"
                        >
                          {DateTime.fromMillis(post.createdAt * 1000).toLocaleString()}
                        </time>
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {total > limit &&
              <Pagination
                defaultCurrent={Math.floor(offset / limit) + 1}
                pageSize={limit}
                total={total}
                size="small"
                onChange={onChange}
              />
              }
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
