'use strict';

const path = require('path');

const _ = require('lodash');

const cm = require('../code-mirror');
const store = require('../store');
const creators = require('../creators');

// TODO: reorg
const Documents = require('../stores/documents');

function handlers(app, opts, done){

  const documents = new Documents(cm);
  // TODO: remove
  app.expose('documents', documents);

  const {
    workspace,
    userConfig
  } = app;

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

    documents.create(path.join(cwd, builtName), '');
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

  function changeFile(filename){
    if(!filename){
      return;
    }

    const {
      isNew,
      content,
      cwd
    } = workspace.getState();

    if(isNew && content.length){
      // TODO: prompt save
      return;
    }

    const doc = documents.swap(path.join(cwd, filename));
    if(doc){
      workspace.updateFilename(filename);
      workspace.updateContent(doc.getValue());
      documents.focus();
      return;
    }

    // TODO: handle error
    workspace.changeFile(filename)
      .then(() => {
        const { content } = workspace.getState();
        userConfig.set('last-file', filename);

        documents.create(path.join(cwd, filename), content);
        documents.focus();
      });
  }

  // TODO: should return a promise
  function changeProject(projectName){
    if(!projectName){
      return;
    }

    const dirpath = path.join('/', projectName);

    return workspace.changeDirectory(dirpath)
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

  function findNext(){
    cm.execCommand('findNext');
  }

  function findPrevious(){
    cm.execCommand('findPrev');
  }

  function replace(){
    cm.execCommand('replace');
  }

  function moveByScrollUpLine(){
    const scrollbox = cm.getScrollInfo();
    cm.scrollTo(null, scrollbox.top - cm.defaultTextHeight());
  }

  function moveByScrollDownLine(){
    const scrollbox = cm.getScrollInfo();
    cm.scrollTo(null, scrollbox.top + cm.defaultTextHeight());
  }

  function indent(){
    cm.execCommand('indentMore');
  }

  function dedent(){
    cm.execCommand('indentLess');
  }

  function print(){
    const { filename } = workspace.getState();

    const { title } = document;
    document.title = filename;
    cm.setOption('viewportMargin', Infinity);
    window.print();
    document.title = title;
    cm.setOption('viewportMargin', 10);
  }

  function handleInput(){
    workspace.updateContent(cm.getValue());
  }

  app.expose('handlers', {
    // file methods
    newFile,
    saveFile,
    saveFileAs,
    deleteFile,
    changeFile,
    // project methods
    changeProject,
    deleteProject,
    deleteProjectConfirm,
    // overlay methods
    showSaveOverlay,
    showProjectsOverlay,
    showDeleteFileOverlay,
    hideOverlay,
    // editor methods
    findNext,
    findPrevious,
    replace,
    moveByScrollUpLine,
    moveByScrollDownLine,
    indent,
    dedent,
    print,
    handleInput
  });

  done();
}

module.exports = handlers;
