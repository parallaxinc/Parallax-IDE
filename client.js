'use strict';

const Irken = require('irken');

const { loadFile, newFile } = require('./src/actions/file');

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
    register: require('./plugins/appbar')
  },
  {
    register: require('./plugins/notifications')
  },
  {
    register: require('./plugins/editor'),
    options: {
      initial: ''
    }
  },
  {
    register: require('./plugins/sidebar')
  },
  {
    register: require('./plugins/overlays')
  }
];

const defaultProject = 'new-project';

function onRender(err){
  console.log('rendered', err);

  if(err){
    return;
  }

  const { userConfig, workspace } = app;

  // Finish Loading Plugin
  const cwd = userConfig.get('cwd') || defaultProject;
  const lastFile = userConfig.get('last-file');
  console.log(cwd, lastFile);
  workspace.changeDirectory(cwd)
    .then(() => {
      console.log(workspace.getState());
      if(lastFile){
        loadFile(lastFile);
      } else {
        newFile();
      }

      console.log('file loaded');
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
