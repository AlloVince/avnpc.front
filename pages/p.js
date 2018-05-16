import React from 'react';
import Router from 'next/router';
import HttpClient from '../services/http_client';
import config from '../universal.config';

export default class extends React.Component {
  static async getInitialProps({ query, res }) {
    const post = await HttpClient.requestRestAPI({ pathname: `/v1/blog/posts/${query.id}`, query });
    if (post && res) {
      res.writeHead(302, {
        Location: `${config.FRONTEND_URL}/pages/${post.slug}`
      });
      res.end();
    } else {
      Router.replace(config.FRONTEND_URL);
    }
    return {};
  }
}

