'use strict';

const alt = require('../alt');

const fileActions = require('../actions/FileActions.js');

class FileStore {
  constructor() {

    this.bindListeners({
      onClearName: fileActions.clearName,
      onUpdateName: fileActions.updateName
    });

    this.state = {
      fileName: ''
    };

  }

  onClearName() {
    this.setState({
      fileName: ''
    });
  }

  onUpdateName(value) {
    this.setState({
      fileName: value
    });
  }

}

FileStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(FileStore);
