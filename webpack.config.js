'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');

module.exports = {
  context: __dirname + '/dev',
  entry: {
    table:  "./table"
  },

  output: {
    path:     __dirname + '/public',
    filename: "[name].js",
    library:  "[name]"
  },

  watch: NODE_ENV == 'development',

  watchOptions: {
    aggregateTimeout: 100
  },

  devtool: NODE_ENV == 'development' ? "cheap-inline-module-source-map" : null,

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "common"
    })
  ],

  module: {
    loaders: [{
      test:   /\.js$/,
      loader: 'babel?presets[]=es2015'
    }]

  }
};