'use strict';

const alt = require('../alt');

const { clearName, updateName } = require('../actions/file');

class FileStore {
  constructor() {

    this.bindListeners({
      onClearName: clearName,
      onUpdateName: updateName
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
