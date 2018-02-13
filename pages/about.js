import Page from './page';

export default class extends Page {
  static async getInitialProps({ query }) {
    const response = await fetch(`http://localhost:3001/v1/blog/posts/about`);
    const json = await response.json();
    return { post: json };
  }
}
