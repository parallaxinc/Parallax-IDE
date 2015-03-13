'use strict';

const path = require('path');

const gulp = require('gulp');
const chalk = require('chalk');
const gutil = require('gulp-util');
const webpack = require('webpack');

const shouldWatch = (process.argv.indexOf('--watch') !== -1);

const webpackConfig = {
  entry: './client.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test:/\.html$/,
        loader: 'html-loader'
      },
      {
        test:/\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader?optional=runtime'
        ]
      }
    ]
  },
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
      memdown: 'level-js'
    }
  },
  bail: true,
  watch: shouldWatch
};

function js(cb){
  webpack(webpackConfig, function(err){
    gutil.log(chalk.green('Webpack - JS Rebuilt'));
    cb(err);
  });
}

gulp.task('default', gulp.parallel(js));
