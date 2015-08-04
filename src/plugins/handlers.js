'use strict';

const path = require('path');

const _ = require('lodash');

const store = require('../store');
const creators = require('../creators');

function handlers(app, opts, done){

  const { workspace, userConfig } = app;

  function newFile(){
    const { cwd, directory } = workspace.getState();

    // TODO: utility function
    const untitledNums = _.reduce(directory, function(untitled, dirfile) {
      if(dirfile.name.match(/untitled/)) {
        const getnum = dirfile.name.match(/\d+/);
        if (getnum) {
          untitled.push(_.parseInt(getnum[0]));
        }
      }
      return untitled;
    }, [0]);

    const untitledLast = _.max(untitledNums);

    const builtName = `untitled${untitledLast + 1}`;

    workspace.newFile(builtName, '');

    userConfig.set('last-file', builtName);

    // documents.create(path.join(cwd, builtName), '');
  }

  function saveFile(){
    const { filename, content, isNew } = workspace.getState();

    if(isNew){
      showSaveOverlay();
    } else {
      workspace.saveFile(filename, content);
    }
  }

  function saveFileAs(filename){
    if(!filename){
      return;
    }

    const { content } = workspace.getState();

    workspace.updateFilename(filename);
    workspace.saveFile(filename, content);
      // .tap(() => {
      //   this.setState({ isNewFile: false });
      //   if(this.loadQueue.length){
      //     this.onLoadFile(this.loadQueue.shift());
      //   }
      // });
  }

  function deleteFile(filename){
    if(!filename){
      return;
    }

    // TODO: switch userConfig last-file
    workspace.deleteFile(filename)
      .then(newFile);
  }

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

  function showDeleteFileOverlay(){
    store.dispatch(creators.showDeleteFileOverlay());
  }

  function hideOverlay(){
    store.dispatch(creators.hideOverlay());
  }

  function showSaveOverlay(){
    store.dispatch(creators.showSaveOverlay());
  }

  app.expose('handlers', {
    // file methods
    newFile,
    saveFile,
    saveFileAs,
    deleteFile,
    // project methods
    changeProject,
    deleteProject,
    deleteProjectConfirm,
    // overlay methods
    showSaveOverlay,
    showProjectsOverlay,
    showDeleteFileOverlay,
    hideOverlay
  });

  done();
}

module.exports = handlers;
