'use strict';

const React = require('react');
const ListItem = require('react-material/components/ListItem');

const Sidebar = require('./sidebar');
const FileList = require('./file-list');
const File = require('./file');
const FileOperations = require('./file-operations');

function sidebar(app, opts, cb){

  const space = app.workspace;

  app.view('sidebar', function(el, cb){
    console.log('sidebar render');

    const Component = (
      <Sidebar>
        <FileList>
          <ListItem icon="folder" disableRipple>{space.cwd.deref()}</ListItem>
          {space.directory.map((filename) => <File key={filename} workspace={space} filename={filename} />).toJS()}
        </FileList>
        <FileOperations workspace={space} />
      </Sidebar>
    );

    React.render(Component, el, cb);
  });

  const cwd = app.userConfig.get('cwd') || opts.defaultProject;

  space.changeDir(cwd, cb);
}

module.exports = sidebar;
