'use strict';

const path = require('path');

const _ = require('lodash');

const alt = require('../alt');

const { hideOverlays, hideSave } = require('../actions/overlay');

const {
  clearName,
  updateName,
  newFile,
  loadFile,
  saveFile,
  saveFileAs,
  deleteFile } = require('../actions/file');

class FileStore {
  constructor() {

    this.bindListeners({
      onClearName: clearName,
      onDeleteFile: deleteFile,
      onHideOverlay: hideOverlays,
      onNewFile: newFile,
      onLoadFile: loadFile,
      onSaveFileAs: saveFileAs,
      onCancelSave: hideSave,
      onSaveFile: saveFile,
      onUpdateName: updateName
    });

    this.state = {
      fileName: '',
      isNewFile: false
    };

    this.loadQueue = [];
  }

  onClearName() {
    const { workspace } = this.getInstance();
    const { filename } = workspace.getState();
    this.setState({
      fileName: filename
    });
  }

  onUpdateName(value) {
    this.setState({
      fileName: value
    });
  }

  onDeleteFile(name) {
    const { workspace } = this.getInstance();
    const { filename } = workspace.getState();

    if(!name){
      return;
    }

    workspace.deleteFile(filename)
      .finally(() => this.onNewFile());
  }

  onHideOverlay() {
    this.onClearName();
  }

  onSaveFileAs(name) {
    const { workspace } = this.getInstance();
    const { content } = workspace.getState();

    if(!name){
      return;
    }

    workspace.updateFilename(name);
    workspace.saveFile(name, content)
      .tap(() => {
        this.setState({ isNewFile: false });
        if(this.loadQueue.length){
          this.onLoadFile(this.loadQueue.shift());
        }
      });
  }

  onCancelSave(status){
    if(!status.trash){
      return;
    }

    this.setState({ isNewFile: false });
    if(this.loadQueue.length){
      this.onLoadFile(this.loadQueue.shift());
    }
  }

  onSaveFile() {
    const { isNewFile } = this.state;

    if(isNewFile) {
      return;
    }

    const { workspace } = this.getInstance();
    const { filename, content } = workspace.getState();

    workspace.saveFile(filename, content);
  }

  onNewFile() {
    const { workspace, userConfig, documents } = this.getInstance();
    const { cwd, directory } = workspace.getState();

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

    workspace.updateFilename(builtName);
    workspace.updateContent('');

    userConfig.set('last-file', builtName);

    documents.create(path.join(cwd, builtName), '');

    this.setState({
      fileName: builtName,
      isNewFile: true
    });
  }

  _queueLoad(filename){
    this.loadQueue.push(filename);
  }

  onLoadFile(filename){
    if(!filename){
      return;
    }

    const { workspace, userConfig, documents } = this.getInstance();
    const { isNewFile } = this.state;
    const { cwd, content } = workspace.getState();

    if(isNewFile && content.length){
      this._queueLoad(filename);
      return;
    }

    const doc = documents.swap(path.join(cwd, filename));
    if(doc){
      this.state.fileName = filename;
      workspace.updateContent(doc.getValue());
      workspace.updateFilename(filename);
      documents.focus();
      return;
    }

    workspace.changeFile(filename)
      .then(() => {
        const { filename, content } = workspace.getState();
        userConfig.set('last-file', filename);

        documents.create(path.join(cwd, filename), content);
        documents.focus();

        this.setState({
          fileName: filename,
          isNewFile: false
        });
      });
  }
}

FileStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(FileStore);
