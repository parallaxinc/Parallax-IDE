'use strict';

const React = require('react');
const ListItem = require('react-material/components/ListItem');

const Sidebar = require('./sidebar');
const FileList = require('./file-list');
const File = require('./file');
const FileOperations = require('./file-operations');
const ProjectOperations = require('./project-operations');

function sidebar(app, opts, done){

  const space = app.workspace;
  const overlay = app.overlay;
  const userConfig = app.userConfig;
  const programmer = app.bs2serial;

  app.view('sidebar', function(el, cb){
    console.log('sidebar render');
    const directory = space.directory;

    const Component = (
      <Sidebar>
        <ProjectOperations workspace={space} overlay={overlay} config={userConfig} />
        <FileList>
          <ListItem icon="folder" disableRipple>{space.cwd.deref()}</ListItem>
          {directory.map((file) => <File key={file.get('name')} workspace={space} filename={file.get('name')} temp={file.get('temp')} />)}
        </FileList>
        <FileOperations workspace={space} overlay={overlay} programmer={programmer} />
      </Sidebar>
    );

    React.render(Component, el, cb);
  });

  const cwd = userConfig.get('cwd') || opts.defaultProject;

  space.changeDir(cwd, done);
}

module.exports = sidebar;
