import React from 'react';
import Header from '../components/Header';
import BlogPost from '../components/BlogPost';

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
      <div>
        <Header/>
        <BlogPost post={post}/>
      </div>
    );
  }
}

