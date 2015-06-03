'use strict';

const alt = require('../alt');

const FileActions = require('../actions/FileActions.js');

class FileStore {
  constructor() {

    this.bindActions(FileActions);

    this.state = {
      fileName: ''
    };

  }

  onClearName() {
    this.setState({
      fileName: ''
    });
  }

  onUpdateName(evt) {
    this.setState({
      fileName: evt.target.value
    });
  }

}

FileStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(FileStore);
