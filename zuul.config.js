'use strict';

module.exports = {
  builder: 'zuul-builder-webpack',
  webpack: require('./webpack.config'),
  ui: 'mocha-bdd'
};
