'use strict';

const _ = require('lodash');
const Irken = require('irken');
const React = require('react');
const { Router, Route, History, Link} = require('react-router');
const memoryHistory = require('./src/lib/history');

const Layout = require('./src/views/layout');
const HelpOverlay = require('./src/views/help-overlay');
const SaveOverlay = require('./src/views/save-overlay');
const NewVersionOverlay = require('./src/views/new-version-overlay');
const ProjectOverlay = require('./src/views/project-overlay');
const DownloadOverlay = require('./src/views/download-overlay');
const OverwriteOverlay = require('./src/views/overwrite-overlay');
const DeleteFileOverlay = require('./src/views/delete-file-overlay');
const DeleteProjectOverlay = require('./src/views/delete-project-overlay');

const store = require('./src/store');


const app = new Irken();

const examples = _.reduce(EXAMPLES_LIST, function(result, name){
  result[name] = require(`./examples/${name}`);
  return result;
}, {});

const exampleFolder = 'examples';

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
    register: require('skrim')
  },
  {
    register: require('iggins')
  },
  {
    register: require('./src/plugins/handlers')
  },
  {
    register: require('./src/plugins/examples'),
    options: {
      examples,
      folder: exampleFolder
    }
  },
  {
    register: require('./src/plugins/keyboard-shortcuts')
  },
  {
    register: require('./src/plugins/notifications')
  },
  {
    register: require('./src/plugins/overlays')
  }
];

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
  const cwd = config.cwd || exampleFolder;
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
  const addMountpoint = app.addMountpoint.bind(app);
  const removeMountpoint = app.removeMountpoint.bind(app);
  const {workspace, handlers} = app;

  if(err){
    return;
  }

  const RouterLayout = React.createClass({
    render() {
      console.log('render layout', this.props);
      return (<Layout addMountpoint={addMountpoint} removeMountpoint={removeMountpoint} app={app}>
        {this.props.children && React.cloneElement(this.props.children, {handlers, workspace, store})}
        </Layout>
      );
    }
  });

  const Component = (
    <Router history={memoryHistory}>
      <Route path="/" component={RouterLayout}>
        <Route path="overlay/help" component={HelpOverlay} />
        <Route path="overlay/save" component={SaveOverlay} />
        <Route path="overlay/newversion" component={NewVersionOverlay} />
        <Route path="overlay/project" component={ProjectOverlay} />
        <Route path="overlay/overwrite" component={OverwriteOverlay} />
        <Route path="overlay/deletefile" component={DeleteFileOverlay} />
        <Route path="overlay/deleteproject" component={DeleteProjectOverlay} />
      </Route>
    </Router>
  );


  React.render(Component, document.body.firstChild, onRender);

}

app.register(plugins, onRegister);

// for debugging purposes
window.app = app;
window.memoryHistory = memoryHistory;
