'use strict'

var React = require('react');
var AppBar = require('react-material/components/AppBar');

function appbar(app, opts, cb){
  app.view('appbar', function(el, cb){
    console.log('appbar render');
    React.render(<AppBar title={opts.title} />, el, cb);
  });

  cb();
}

module.exports = appbar;
