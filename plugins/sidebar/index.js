'use strict';

const React = require('react');
const { createContainer } = require('sovereign');

const deviceStore = require('../../src/stores/device');
const fileStore = require('../../src/stores/file');
const transmissionStore = require('../../src/stores/transmission');

const SidebarView = require('../../src/views/sidebar');

function sidebar(app, opts, done){

  const { workspace, userConfig } = app;
  const getBoard = app.getBoard.bind(app);
  const scanBoards = app.scanBoards.bind(app);

  // TODO: move into frylord?
  if(typeof chrome !== 'undefined' && typeof chrome.syncFileSystem !== 'undefined'){
    chrome.syncFileSystem.onFileStatusChanged.addListener(function(detail){
      if(detail.direction === 'remote_to_local'){
        workspace.refreshDirectory();
      }
    });
    chrome.syncFileSystem.onServiceStatusChanged.addListener(function(){
      workspace.refreshDirectory();
    });
  }

  const View = createContainer(SidebarView, {
    getStores(){
      return {
        workspace
      };
    },

    listen(store, onChange){
      return store.subscribe(onChange);
    },

    unlisten(store, onChange, unsubscribe){
      unsubscribe();
    },

    getPropsFromStores(){
      const { cwd, directory } = workspace.getState();

      return {
        cwd,
        directory
      };
    }
  });

  app.view('sidebar', function(el, cb){
    console.log('sidebar render');

    React.render(<View />, el, cb);
  });

  // Store bindings
  deviceStore.workspace = workspace;
  deviceStore.getBoard = getBoard;
  deviceStore.scanBoards = scanBoards;

  fileStore.workspace = workspace;
  fileStore.userConfig = userConfig;

  transmissionStore.getBoard = getBoard;

  done();
}

module.exports = sidebar;
