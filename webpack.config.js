'use strict';

var path = require('path');

var webpack = require('webpack');

var shouldWatch = (process.argv.indexOf('--watch') !== -1);

module.exports = {
  devtool: 'source-map',
  entry: './client.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    noParse: [
      /pbasic/i
    ],
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        exclude: [
          /node_modules/,
          /pbasic/i
        ],
        loaders: [
          'babel-loader?optional=runtime'
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin()
  ],
  resolveLoader: {
    // this is a workaround for loaders being applied
    // to linked modules
    root: path.join(__dirname, 'node_modules')
  },
  resolve: {
    // this is a workaround for aliasing a top level dependency
    // inside a symlinked subdependency
    root: path.join(__dirname, 'node_modules'),
    alias: {
      // replacing `fs` with a browser-compatible version
      fs: 'browserify-fs',
      'graceful-fs': 'browserify-fs',
      memdown: 'level-js',
      serialport: 'browser-serialport'
    }
  },
  bail: true,
  watch: shouldWatch
};
