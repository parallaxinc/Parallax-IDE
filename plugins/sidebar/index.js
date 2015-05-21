'use strict';

const React = require('react');
const ListItem = require('react-material/components/ListItem');

const Sidebar = require('./sidebar');
const FileList = require('./file-list');
const File = require('./file');
const FileOperations = require('./file-operations');
const ProjectOperations = require('./project-operations');

function noop(){}

function sidebar(app, opts, done){

  const space = app.workspace;
  const toast = app.toast;
  const overlay = app.overlay;
  const userConfig = app.userConfig;
  const logger = app.logger;
  const irken = app;

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
        <FileOperations workspace={space} overlay={overlay} toast={toast} irken={irken} logger={logger} loadFile={loadFile} />
      </Sidebar>
    );

    React.render(Component, el, cb);
  });

  const cwd = userConfig.get('cwd') || opts.defaultProject;
  const lastFile = userConfig.get('last-file');

  space.changeDir(cwd, () => loadFile(lastFile, done));
}

module.exports = sidebar;
