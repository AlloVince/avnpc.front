const path = require('path');
// const webpack = require('webpack');

module.exports = {
  webpack: (config, { dev = process.env.NODE_ENV !== 'production' }) => {
    config.module.rules.push(
      {
        test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
        loader: 'url-loader'
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.styl$/,
        use: ['raw-loader', 'postcss-loader'],
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'css-loader' },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.ico$/,
        loader: 'file-loader'
      },
    );

    // config.plugins.push(
      // new webpack.DllReferencePlugin({
      //   context: __dirname,
      //   manifest: require('./static/vendor-manifest.json'),
      // })
    // );

    // console.log('Next.js webpack module rules config:');
    // config.module.rules.forEach(rule => console.dir(rule));
    return config;
  }
};

