'use strict';

const Irken = require('irken');

const app = new Irken();

const plugins = [
  {
    register: require('bs2-serial'),
    options: {
      programmer: require('bs2-programmer'),
      protocol: require('bs2-serial-protocol'),
      //TODO break chrome transport into separate project?
      transport: require('bs2-serial-protocol/transport'),
      tokenizer: require('pbasic-tokenizer')
    }
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
    register: require('./src/plugins/editor')
  },
  {
    register: require('./src/plugins/terminal')
  },
  {
    register: require('./src/plugins/rxtx')
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
    showNewVersionOverlay,
    changeFile,
    changeProject
  } = handlers;

  // Finish Loading Plugin
  // TODO: encapsulate into a startup handler?
  const config = userConfig.getState();
  const cwd = config.cwd || defaultProject;
  const lastFile = config['last-file'];
  console.log(cwd, lastFile);
  changeProject(cwd)
    .then(() => {
      if(lastFile){
        changeFile(lastFile);
      } else {
        newFile();
      }
      showNewVersionOverlay();
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
