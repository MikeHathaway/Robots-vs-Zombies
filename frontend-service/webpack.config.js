const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    game: './game/game.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(`${__dirname}/public`, 'build'),
    publicPath: '/',
  },
  module: {
    loaders: [
       {
          test: /\.jsx?$/, // search for js files
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015'] // use es2015
          }
        },
        {
          test: /\.css$/,
          loader: "style-loader!css-loader"
        },
        {
          test: /\.png$/,
          loader: "file-loader"
        },
        {
          test: /\.json$/,
          loader: "file-loader"
        },
     ]
  }
};
