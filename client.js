'use strict';

const Irken = require('irken');

const app = new Irken();

const plugins = [
  {
    register: require('bs2-serial')
  },
  {
    register: require('frylord'),
    options: {
      useTempFiles: true
    }
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
    register: require('iggins')
  },
  {
    register: require('./src/plugins/handlers')
  },
  {
    register: require('./src/plugins/keyboard-shortcuts')
  },
  {
    register: require('./src/plugins/appbar')
  },
  {
    register: require('./src/plugins/notifications')
  },
  {
    register: require('./plugins/editor')
  },
  {
    register: require('./src/plugins/sidebar')
  },
  {
    register: require('./src/plugins/overlays')
  }
];

const defaultProject = 'new-project';

function onRender(err){
  console.log('rendered', err);

  if(err){
    return;
  }

  const {
    userConfig,
    handlers
  } = app;

  const {
    newFile,
    changeFile,
    changeProject
  } = handlers;

  // Finish Loading Plugin
  // TODO: encapsulate into a startup handler?
  const cwd = userConfig.get('cwd') || defaultProject;
  const lastFile = userConfig.get('last-file');
  console.log(cwd, lastFile);
  changeProject(cwd)
    .then(() => {
      if(lastFile){
        changeFile(lastFile);
      } else {
        newFile();
      }
    })
    .catch(console.error.bind(console));
}

function onRegister(err){
  console.log('registered', err, app);

  if(err){
    return;
  }

  app.render(onRender);
}

app.register(plugins, onRegister);

// for debugging purposes
window.app = app;
