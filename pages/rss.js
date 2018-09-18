import React from 'react';
import { DateTime } from 'luxon';
import xmlbuilder from 'xmlbuilder';
import HttpClient from '../services/http_client';

export default class extends React.Component {
  static async getInitialProps({ res }) {
    const posts = await HttpClient.requestRestAPI({
      pathname: '/v1/blog/posts',
      query: {
        withText: 1,
        limit: 10
      }
    });

    const feed = xmlbuilder.create('feed', { encoding: 'utf-8' })
      .att('xmlns', 'http://www.w3.org/2005/Atom')
      .ele('title', { type: 'text' }, 'Just Fine - Story of AlloVince').up()
      .ele('updated', DateTime.fromMillis(posts.results[0].createdAt * 1000).toISO()).up()
      .ele('id', 'https://avnpc.com/').up()
      .ele('link', {
        rel: 'alternate', type: 'text/html', hreflang: 'en', href: 'https://avnpc.com/'
      }).up()
      .ele('rights', 'Copyright (c) 2005-2018, AlloVince').up()
      .ele('link', { href: 'https://avnpc.com/rss', rel: 'self', type: 'application/rss+xml' }).up();

    posts.results.forEach((post) => {
      feed
        .ele('entry')
        .ele('id', `https://avnpc.com/p/${post.id}`).up()
        .ele('title', post.title).up()
        .ele('link', {
          rel: 'alternate',
          type: 'text/html',
          href: `https://avnpc.com/pages/${post.slug}`
        }).up()
        .ele('updated', DateTime.fromMillis(post.updatedAt * 1000).toISO()).up()
        .ele('published', DateTime.fromMillis(post.createdAt * 1000).toISO()).up()
        .ele('author')
        .ele('name', 'AlloVince').up()
        .ele('uri', 'https://avnpc.com/about').up()
        .ele('email', 'allo.vince@gmail.com').up()
        .up()
        .ele('content', { type: 'text' }).cdata(post.text.content).up()
        .up();
    });

    res.write(feed.end({ pretty: true }));
    res.end();
  }
}
