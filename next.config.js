module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules.push(
      {
        test: /\.ico$/,
        loader: 'file-loader'
      },
      {
        test: /\.css$/,
        use: ['raw-loader']
      },
      {
        test: /\.styl$/,
        use: ['babel-loader', 'raw-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: ['babel-loader', 'raw-loader', 'less-loader']
      }
    );
    return config;
  }
};

