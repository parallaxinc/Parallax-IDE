'use strict';

const path = require('path');

const del = require('del');
const gulp = require('gulp');
const chalk = require('chalk');
const zip = require('gulp-zip');
const gutil = require('gulp-util');
const webpack = require('webpack');

const shouldWatch = (process.argv.indexOf('--watch') !== -1);

const files = {
  release: [
    'manifest.json',
    'index.html',
    'bundle.js',
    'background.js',
    '_locales/**',
    'icons/**'
  ]
};

const webpackConfig = {
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
      memdown: 'level-js',
      serialport: 'browser-serialport'
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

function release(){
  return gulp.src(files.release, { base: __dirname })
    .pipe(zip('chromeide.zip'))
    .pipe(gulp.dest('dist'));
}

function postinstall(cb){
  // .pem files cause Chrome to show a bunch of warnings
  // so we remove them on postinstall
  del('node_modules/**/*.pem', cb);
}

gulp.task(release);
gulp.task(postinstall);

gulp.task('gh-release', gulp.series(js, release));
gulp.task('default', gulp.parallel(js));
