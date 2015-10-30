'use strict';

var fs = require('fs');
var path = require('path');

var webpack = require('webpack');

var shouldWatch = (process.argv.indexOf('--watch') !== -1);

var examplesDir = './examples';
var examples = fs.readdirSync(examplesDir);

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
        test: /\.bs2$/,
        loader: 'raw-loader'
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
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      EXAMPLES_LIST: JSON.stringify(examples)
    })
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
      memdown: 'level-js'
    }
  },
  bail: true,
  watch: shouldWatch
};
