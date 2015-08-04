'use strict';

const React = require('react');

const deviceStore = require('../stores/device');
const transmissionStore = require('../stores/transmission');

const SidebarView = require('../views/sidebar');

function sidebar(app, opts, done){

  const { workspace, handlers } = app;
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

  app.view('sidebar', function(el, cb){
    console.log('sidebar render');

    React.render(<SidebarView workspace={workspace} handlers={handlers} />, el, cb);
  });

  // Store bindings
  deviceStore.workspace = workspace;
  deviceStore.getBoard = getBoard;
  deviceStore.scanBoards = scanBoards;

  transmissionStore.getBoard = getBoard;

  done();
}

module.exports = sidebar;
