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
    const { offset, q } = query;
    return {
      query,
      posts: await HttpClient.requestRestAPI({
        pathname: '/v1/search',
        query: {
          offset,
          q
        }
      })
    };
  }

  render() {
    const { results: posts, pagination: { limit, offset, total } } = this.props.posts;
    const { q } = this.props.query;
    const onChange = (page) => {
      Router.pushRoute('thinking', { offset: (page - 1) * limit, limit });
    };

    return (
      <Layout>
        <BlogHeader title={`Searching ${q ? `about ${q}` : ''} - ${offset} to ${offset + limit} of ${total}`}/>
        <Layout id="main">
          <Content>
            <div id="page" className="page">
              <div className="page-inner">
                {posts.map(post =>
                  <div className="item" key={`post-${post.id}`}>
                    <div className="item-inline item-title">
                      <h2>
                        <a href={post.url}>{post.title}</a>
                      </h2>
                      <p className="info">{post.summary}
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

