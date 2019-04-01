
module.exports = {
  presets: [
    [
      'next/babel',
      // {
      //   'styled-jsx': {
      //     plugins: [
      //       'styled-jsx-plugin-postcss'
      //     ]
      //   }
      // }
    ]
  ],
  plugins: [
    // 'styled-jsx/babel',
    '@babel/plugin-syntax-dynamic-import',
    // '@babel/plugin-proposal-class-properties',
    // ['@babel/plugin-proposal-decorators', { legacy: true }]
  ]
  // sourceMaps: true
};
