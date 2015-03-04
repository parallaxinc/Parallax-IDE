'use strict';

var Irken = require('irken');

var app = new Irken();

var plugins = [
  {
    register: require('holovisor')
  },
  {
    register: require('./plugins/appbar'),
    options: {
      title: 'Parallax Chrome IDE'
    }
  },
  {
    register: require('./plugins/sidebar')
  },
  {
    register: require('./plugins/editor'),
    options: {
      initial: `function helloWorld(hello){\n  hello = 'world';\n}`
    }
  }
];

app.register(plugins, function(err){
  console.log('registered', err, app);
  app.render(function(err){
    console.log('rendered', err);
  });
});
