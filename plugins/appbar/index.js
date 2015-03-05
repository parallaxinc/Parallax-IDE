'use strict'

const React = require('react');

const TopBar = require('./component');

function appbar(app, opts, cb){
  app.view('appbar', function(el, cb){
    console.log('appbar render');

    const Component = (
      <TopBar title={opts.title} app={app} />
    );

    React.render(Component, el, cb);
  });

  cb();
}

module.exports = appbar;
