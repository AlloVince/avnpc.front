const path = require('path');
// const withLess = require('@zeit/next-less');
// const withCSS = require('@zeit/next-css');


module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules.push(
      // {
      //   test: /\.(js|jsx)$/,
      //   use: [
      //     {
      //       loader: 'babel-loader'
      //     }
      //   ],
      //   exclude: /node_modules/
      // },
      {
        test: /\.css$/,
        use: ['raw-loader']
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
        test: /\.styl$/,
        use: ['raw-loader', 'postcss-loader'],
      },
      {
        test: /\.ico$/,
        loader: 'file-loader'
      },
    );

    console.log('Next.js webpack module rules config:');
    config.module.rules.forEach(rule => console.dir(rule));
    return config;
  }
};

