'use strict';

const path = require('path');

const alt = require('../alt');

const { hideSave } = require('../actions/overlay');

const { loadFile } = require('../actions/file');

class FileStore {
  constructor() {

    this.bindListeners({
      onLoadFile: loadFile,
      onCancelSave: hideSave
    });

    this.state = {
      fileName: '',
      isNewFile: false
    };

    this.loadQueue = [];
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
      workspace.updateFilename(filename);
      workspace.updateContent(doc.getValue());
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
