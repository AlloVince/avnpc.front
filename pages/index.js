import React from 'react';
import querystring from 'querystring';
import { Layout, Pagination } from 'antd';
import { Link, Router } from '../routes';
import BlogHeader from '../components/BlogHeader';

const { Content } = Layout;

export default class extends React.Component {
  static async getInitialProps({ query }) {
    const { offset, limit } = query;
    const response = await fetch(`http://localhost:3001/v1/blog/posts?${querystring.stringify({
      offset,
      limit
    })}`);
    const json = await response.json();
    return json;
  }

  render() {
    const { results: posts, pagination: { limit, offset, total } } = this.props;
    const onChange = (page) => {
      Router.pushRoute('index', { offset: (page - 1) * limit, limit });
    };

    return (
      <Layout>
        <BlogHeader/>
        <Layout>
          <Content>
            <div id="#page">
              <div className="vlist posts">
                {posts.map(post =>
                  <div className="item">
                    <div className="item-inline item-title">
                      <h2>
                        <Link
                          key={`p${post.id}`}
                          route="page"
                          params={{ slug: post.slug }}>
                          <a href="#">{post.title}</a>
                        </Link>
                      </h2>
                      <p className="info">发布时间：
                        <time
                          dateTime="<?=$this->datetime()->isoTime($item['createTime'])?>"
                          className="agotime">{post.createdAt}</time>
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

