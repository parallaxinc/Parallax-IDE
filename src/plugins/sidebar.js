'use strict';

const React = require('react');

const SidebarView = require('../views/sidebar');

function sidebar(app, opts, done){

  const { workspace, handlers } = app;

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

  done();
}

module.exports = sidebar;
