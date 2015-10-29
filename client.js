'use strict';

const _ = require('lodash');
const Irken = require('irken');

const app = new Irken();

const examples = _.map(EXAMPLES_LIST, function(name){
  return require('./examples/'+name);
});

console.log(examples);

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
    changeProject,
    deviceAdded
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

  chrome.usb.onDeviceAdded.addListener(function(){
    setTimeout(deviceAdded, 200);
  });
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
