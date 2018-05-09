import React from 'react';
import Router from 'next/router';

export default class extends React.Component {
  static async getInitialProps({ query, res }) {
    const response = await fetch(`${process.env.BACKEND_URL}/v1/blog/posts/${query.id}`);
    if (res) {
      const json = await response.json();
      res.writeHead(302, {
        Location: `${process.env.FRONTEND_URL}/pages/${json.slug}`
      });
      res.end();
      res.finished = true;
    } else {
      Router.replace(process.env.FRONTEND_URL);
    }
    return {};
  }
}

