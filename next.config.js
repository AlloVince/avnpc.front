const path = require('path');

module.exports = {
  webpack: (config, { dev }) => {
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
      // {
      //   test: /\.less$/,
      //   use: [
      //     { loader: 'raw-loader' },
      //     { loader: 'css-loader' },
      // { loader: 'less-loader' },
      // ],
      // include: [
      //   path.resolve(__dirname, 'pages'),
      //   path.resolve(__dirname, '/node_modules/antd'),
      // ]
      // },
      {
        test: /\.ico$/,
        loader: 'file-loader'
      },
    );

    // console.log('Next.js webpack module rules config:');
    // config.module.rules.forEach(rule => console.dir(rule));
    return config;
  }
};

