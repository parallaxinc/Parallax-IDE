'use strict';

const React = require('react');
const ListItem = require('react-material/components/ListItem');

const Sidebar = require('./sidebar');
const FileList = require('./file-list');
const File = require('./file');
const FileOperations = require('./file-operations');
const ProjectOperations = require('./project-operations');

const NewFileOverlay = require('./overlays/new-file');

const deviceStore = require('../../src/stores/device');
const editorStore = require('../../src/stores/editor');
const fileStore = require('../../src/stores/file');

const { processCreate, processNoCreate, processSave, newFile, loadFile } = require('../../src/actions/file');
function noop(){}

function sidebar(app, opts, done){

  const space = app.workspace;
  const toast = app.toast;
  const overlay = app.overlay;
  const userConfig = app.userConfig;
  const irken = app;
  const getBoard = app.getBoard.bind(irken);
  const scanBoards = app.scanBoards.bind(irken);

  function refreshDirectory(){
    // TODO: expose a method to refresh directory without changing it
    space.changeDir(space.cwd.deref());
  }

  // TODO: move into frylord?
  chrome.syncFileSystem.onFileStatusChanged.addListener(function(detail){
    if(detail.direction === 'remote_to_local'){
      refreshDirectory();
    }
  });
  chrome.syncFileSystem.onServiceStatusChanged.addListener(refreshDirectory);

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

  // Internal Helpers

  function _onChangeFileStore() {
    const { showSaveOverlay } = fileStore.getState();
    if (showSaveOverlay) {
      _showCreateOverlay();
    } else {
      overlay.hide();
    }
  }

  function _renderOverlay(component){
    function renderer(el){
      React.render(component, el);
    }

    overlay.render(renderer, { backdrop: true });
  }

  function _showCreateOverlay(){
    const component = (
      <NewFileOverlay
        onAccept={processCreate}
        onCancel={processNoCreate} />
    );

    _renderOverlay(component);
  }

  // Store bindings
  deviceStore.workspace = space;
  deviceStore.toast = toast;
  deviceStore.overlay = overlay;
  deviceStore.getBoard = getBoard;
  deviceStore.scanBoards = scanBoards;

  editorStore.workspace = space;

  fileStore.workspace = space;
  fileStore.userConfig = userConfig;

  fileStore.toast = toast;

  // Set up listeners
  fileStore.listen(_onChangeFileStore);

  // Finish Loading Plugin
  const cwd = userConfig.get('cwd') || opts.defaultProject;
  const lastFile = userConfig.get('last-file');
  console.log(lastFile);
  space.changeDir(cwd, () => {
    loadFile(lastFile);
    done();
  });

}

module.exports = sidebar;
