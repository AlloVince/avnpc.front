import React from 'react';
import querystring from 'querystring';
import { Link } from '../routes';
import Header from '../components/Header';
import Pagination from '../components/Pagination';

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
    const { results: posts, pagination } = this.props;
    return (
      <div>
        <Header/>
        <div className="page-content">
          <div class="vlist posts">
            {posts.map((post, index) => {
              return (
                <div class="item">
                  <div class="item-inline item-title">
                    <h3>
                      <Link key={`k${index}`} route="page" params={{ slug: post.slug }}><a>{post.title}</a></Link>
                    </h3>
                    <p class="info">发布时间： <time datetime="<?=$this->datetime()->isoTime($item['createTime'])?>"
                                                data-jstime="<?=$this->datetime()->jsTime($item['createTime'])?>"
                                                class="agotime">{post.createdAt}</time></p>
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination pagination={pagination} route="thinking"/>
        </div>
      </div>
    );
  }
}
