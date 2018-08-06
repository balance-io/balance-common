var path = require('path');

module.exports = {
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'balance-common',
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        include: [
          path.join(__dirname, 'node_modules/react-native-storage')
        ],
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'stage-1', 'react'],
          plugins: ['transform-runtime']
        }
      }
    ],
    rules: [
      { test: /\.(js)$/, use: 'babel-loader' },
    ]
  }
}
