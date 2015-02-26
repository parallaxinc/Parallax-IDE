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
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader?optional=runtime'
        ]
      }
    ]
  },
  watch: shouldWatch
};

function js(cb){
  webpack(webpackConfig, function(err){
    gutil.log(chalk.green('Webpack - JS Rebuilt'));
    cb(err);
  });
}

gulp.task('default', gulp.parallel(js));
