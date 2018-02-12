import React from 'react';
import Router from 'next/router';

export default class extends React.Component {
  static async getInitialProps({ query, res }) {
    const response = await fetch(`http://localhost:3001/v1/blog/posts/${query.id}`);
    if (res) {
      const json = await response.json();
      res.writeHead(302, {
        Location: 'http://localhost:3000/pages/' + json.slug
      });
      res.end();
      res.finished = true;
    } else {
      Router.replace('http://example.com');
    }
    return {};
  }
}

