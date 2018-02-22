import React from 'react';
import querystring from 'querystring';
import { DateTime } from 'luxon';
import { Layout, Pagination } from 'antd';
import { Link, Router } from '../routes';
import BlogHeader from '../components/BlogHeader';
import HttpClient from '../services/http_client';


const { Content } = Layout;

export default class extends React.Component {
  static async getInitialProps({ query }) {
    const { offset, limit } = query;
    return await HttpClient.requestRestAPI(`http://localhost:3001/v1/blog/posts?${querystring.stringify({
      offset,
      limit
    })}`);
  }

  render() {
    const { results: posts, pagination: { limit, offset, total } } = this.props;
    const onChange = (page) => {
      Router.pushRoute('index', { offset: (page - 1) * limit, limit });
    };

    return (
      <Layout>
        <BlogHeader title={`AVNPC - ${offset} to ${offset + limit} of ${total}`}/>
        <Layout style={{ marginLeft: 200 }}>
          <Content>
            <div id="page" className="page">
              <div className="page-inner">
                {posts.map(post =>
                  <div className="item">
                    <div className="item-inline item-title">
                      <h2>
                        <Link
                          key={`post-${post.id}`}
                          route="page"
                          params={{ slug: post.slug }}>
                          <a href="#">{post.title}</a>
                        </Link>
                      </h2>
                      <p className="info">发布时间：
                        <time
                          dateTime={DateTime.fromMillis(post.createdAt * 1000).toISOTime()}
                          className="agotime">{DateTime.fromMillis(post.createdAt * 1000).toLocaleString()}</time>
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <Pagination
                defaultCurrent={Math.floor(offset / limit) + 1}
                pageSize={limit}
                total={total}
                onChange={onChange}
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

