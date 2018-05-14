import Document_, { Head, Main, NextScript } from 'next/document';
import htmlescape from 'htmlescape';
import config from '../universal.config';

export default class Document extends Document_ {
  static async getInitialProps (ctx) {
    const props = await Document_.getInitialProps(ctx);
    return props;
  }

  render () {
    return (
      <html lang="en">
        <Head />
        <body>
          <Main />
          <script
            dangerouslySetInnerHTML={{ __html: `process = {}; window.__ENV__ = process.env = ${htmlescape(config)}` }}
          />
          <NextScript />
        </body>
      </html>
    );
  }
}
