var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'www');
var APP_DIR = path.resolve(__dirname, 'app');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [{
  entry: [
    APP_DIR + '/index.jsx',
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel'
      }
    ]
  }
},
{
  entry: [
    APP_DIR + '/styles/application.sass',
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.css'
  },
  module: {
    loaders: [
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
        loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract('css!sass')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('bundle.css', {
      allChunks: true
    })
  ]
}];
