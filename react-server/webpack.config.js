const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname),
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './public/build'),
  },
  module: {
    loaders: [
       {
          test: /\.jsx?$/, // search for js files
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015', 'react'] // use es2015 and react
          }
        }
     ]
  }
};
