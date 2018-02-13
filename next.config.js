// const withCSS = require('@zeit/next-css');
//
// module.exports = withCSS();
//
const path = require('path')
const glob = require('glob')

module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules.push(
      {
        test: /\.(css|scss|less)/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]'
        }
      }
      ,
      {
        test: /\.css$/,
        use: ['babel-loader', 'raw-loader', 'postcss-loader']
      }
      // ,
      // {
      //   test: /\.less$/,
      //   use: ['babel-loader', 'raw-loader', 'postcss-loader',
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         includePaths: ['styles', 'node_modules']
      //           .map((d) => path.join(__dirname, d))
      //           .map((g) => glob.sync(g))
      //           .reduce((a, c) => a.concat(c), [])
      //       }
      //     }
      //   ]
      // }
    );
    return config;
  }
};

