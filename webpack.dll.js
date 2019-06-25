const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('[name]_[chunkhash].dll.css');
const vendors = [
  'nprogress/nprogress.css',
  './styles/antd.less',
  './styles/blog.css',

  //for page
  'katex/dist/katex.css',
  'gitalk/dist/gitalk.css',
  'highlight.js/styles/darcula.css'
];

module.exports = {
  context: __dirname,
  output: {
    path: path.join(__dirname, 'static'),
    filename: '[name]_[chunkhash].dll.js',
    library: '[name]_[chunkhash]'
  },
  entry: {
    vendor: vendors
  },
  module: {
    rules: [
      {
        test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      },
      {
        test: /\.css$/,
        use: extractCSS.extract(['css-loader', 'postcss-loader'])
      },
      {
        test: /\.styl$/,
        use: extractCSS.extract(['css-loader', 'postcss-loader'])
      },
      {
        test: /\.less$/,
        use:
          extractCSS.extract([
            { loader: 'css-loader' },
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true
              }
            }
          ])
      },
      {
        test: /\.ico$/,
        loader: 'file-loader'
      },
    ]
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'static', '[name]-manifest.json'),
      name: '[name]_[chunkhash].dll.css'
    }),
    extractCSS
  ],
  devtool: 'source-map'
};
