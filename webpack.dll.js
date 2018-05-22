const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('[name].css');
const vendors = [
  'nprogress/nprogress.css',
  './styles/antd.less',
  './styles/blog.css'
];

module.exports = {
  context: __dirname,
  output: {
    path: path.join(__dirname, 'static'),
    filename: '[name].dll.js',
    library: '[name]_[hash]'
  },
  entry: {
    vendor: vendors
  },
  module: {
    rules: [
      {
        test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
        loader: 'url-loader'
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
      name: '[name]_[hash]'
    }),
    extractCSS
  ]
};
