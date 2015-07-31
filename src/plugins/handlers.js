'use strict';

const path = require('path');

const store = require('../store');
const creators = require('../creators');

function handlers(app, opts, done){

  const { workspace, userConfig } = app;

  function changeProject(projectName){
    if(!projectName){
      return;
    }

    const dirpath = path.join('/', projectName);

    workspace.changeDirectory(dirpath)
      .then(() => {
        userConfig.set('cwd', dirpath);
      });
  }

  function deleteProject(projectName){
    if(!projectName){
      return;
    }

    const dirpath = path.join('/', projectName);

    workspace.deleteDirectory(dirpath);
  }

  function deleteProjectConfirm(name){
    store.dispatch(creators.deleteProjectConfirm(name));
    store.dispatch(creators.showDeleteProjectOverlay());
  }

  function showProjectsOverlay(){
    store.dispatch(creators.showProjectsOverlay());
  }

  function hideOverlay(){
    store.dispatch(creators.hideOverlay());
  }

  app.expose('handlers', {
    changeProject,
    deleteProject,
    deleteProjectConfirm,
    // overlay methods
    showProjectsOverlay,
    hideOverlay
  });

  done();
}

module.exports = handlers;
