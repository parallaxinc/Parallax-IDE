'use strict';

const React = require('react');
const ListItem = require('react-material/components/ListItem');

const Sidebar = require('./sidebar');
const FileList = require('./file-list');
const File = require('./file');
const FileOperations = require('./file-operations');
const ProjectOperations = require('./project-operations');

const deviceStore = require('../../src/stores/device');

function noop(){}

function sidebar(app, opts, done){

  const space = app.workspace;
  const toast = app.toast;
  const overlay = app.overlay;
  const userConfig = app.userConfig;
  const irken = app;
  const getBoard = app.getBoard.bind(irken);
  const scanBoards = app.scanBoards.bind(irken);

  deviceStore.workspace = space;
  deviceStore.toast = toast;
  deviceStore.overlay = overlay;
  deviceStore.getBoard = getBoard;
  deviceStore.scanBoards = scanBoards;

  function loadFile(filename, cb = noop){
    if(filename){
      space.loadFile(filename, (err) => {
        if(err){
          cb(err);
          return;
        }

        userConfig.set('last-file', filename);

        cb();
      });
    } else {
      cb();
    }
  }

  app.view('sidebar', function(el, cb){
    console.log('sidebar render');
    const directory = space.directory;

    const Component = (
      <Sidebar>
        <ProjectOperations workspace={space} overlay={overlay} config={userConfig} />
        <FileList workspace={space} loadFile={loadFile}>
          <ListItem icon="folder" disableRipple>{space.cwd.deref()}</ListItem>
          {directory.map((file) => <File key={file.get('name')} filename={file.get('name')} temp={file.get('temp')} loadFile={loadFile} />)}
        </FileList>
        <FileOperations workspace={space} overlay={overlay} toast={toast} irken={irken} loadFile={loadFile} />
      </Sidebar>
    );

    React.render(Component, el, cb);
  });

  const cwd = userConfig.get('cwd') || opts.defaultProject;
  const lastFile = userConfig.get('last-file');

  space.changeDir(cwd, () => loadFile(lastFile, done));
}

module.exports = sidebar;
