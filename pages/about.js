import Page from './page';
import HttpClient from '../services/http_client';

export default class extends Page {
  static async getInitialProps({ query }) {
    return { post: await HttpClient.requestRestAPI(`http://localhost:3001/v1/blog/posts/about`), query };
  }
}
