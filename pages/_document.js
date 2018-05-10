import Document_, { Head, Main, NextScript } from 'next/document';
import htmlescape from 'htmlescape';

const { env: { NODE_ENV } } = process;

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
            dangerouslySetInnerHTML={{ __html: `__ENV__ = ${htmlescape({ NODE_ENV })}` }}
          />
          <NextScript />
        </body>
      </html>
    );
  }
}
