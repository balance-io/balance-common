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
    rules: [
      { test: /\.(js)$/, use: 'babel-loader' },
      {
        test: /\.js?$/,
        include: [
          path.join(__dirname, 'node_modules/react-native-storage')
        ],
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: ['@babel/plugin-transform-runtime']
        }
      }
    ]
  }
}
