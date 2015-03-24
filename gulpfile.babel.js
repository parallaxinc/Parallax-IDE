'use strict';

const del = require('del');
const gulp = require('gulp');
const chalk = require('chalk');
const zip = require('gulp-zip');
const gutil = require('gulp-util');
const webpack = require('webpack');

const webpackConfig = require('./webpack.config');

const files = {
  release: [
    'manifest.json',
    'index.html',
    'bundle.js',
    'background.js',
    '_locales/**',
    'icons/**',
    'fonts/**',
    'assets/**'
  ]
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
