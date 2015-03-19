'use strict';

var Irken = require('irken');

var app = new Irken();

var plugins = [
  {
    register: require('bs2-serial')
  },
  {
    register: require('frylord')
  },
  {
    register: require('snacks')
  },
  {
    register: require('holovisor')
  },
  {
    register: require('skrim')
  },
  {
    register: require('./plugins/appbar'),
    options: {
      title: 'Parallax Chrome IDE'
    }
  },
  {
    register: require('./plugins/sidebar'),
    options: {
      defaultProject: 'new-project'
    }
  },
  {
    register: require('./plugins/editor'),
    options: {
      initial: ''
    }
  }
];

app.register(plugins, function(err){
  console.log('registered', err, app);
  app.render(function(err){
    console.log('rendered', err);
  });
});

// for debugging purposes
window.app = app;
