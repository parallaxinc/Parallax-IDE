'use strict';

const React = require('react');

const AppbarView = require('../views/appbar');

function appbar(app, opts, done){

  app.view('appbar', function(el, cb){
    console.log('appbar render');

    React.render(<AppbarView />, el, cb);
  });

  done();
}

module.exports = appbar;
