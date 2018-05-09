import Page from './page';
import HttpClient from '../services/http_client';

export default class extends Page {
  static async getInitialProps({ query }) {
    return { post: await HttpClient.requestRestAPI(`${process.env.BACKEND_URL}/v1/blog/posts/about`), query };
  }
}
