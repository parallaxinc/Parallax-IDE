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

const { processCreate, processSave } = require('../../src/actions/file');
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

  // TODO: move to file store
  function loadFile(filename, cb = noop){
    const previousFile = space.filename.deref();
    let unsaved = false;
    if(previousFile) {
      unsaved = _checkUnsaved(previousFile);
    }

    if(filename && !unsaved){
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

  // Internal Helpers
  function _checkUnsaved(file) {
    const unnamed = space.directory.every(function(x) {
      if(x.get('name') === file) {
        return false;
      }
      else {
        return true;
      }
    });
    if(unnamed) {
      processSave();
      return true;
    }
  }

  function _onChangeFileStore() {
    const { showSaveOverlay } = fileStore.getState();
    if (showSaveOverlay) {
      _showCreateOverlay();
    }
  }

  function _hideOverlay() {
    overlay.hide();
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
        onCancel={_hideOverlay} />
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
  fileStore.loadFile = loadFile;
  fileStore.overlay = overlay;

  // Set up listeners
  fileStore.listen(_onChangeFileStore);

  // Finish Loading Plugin
  const cwd = userConfig.get('cwd') || opts.defaultProject;
  const lastFile = userConfig.get('last-file');
  space.changeDir(cwd, () => loadFile(lastFile, done));

}

module.exports = sidebar;
