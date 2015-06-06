'use strict';

const alt = require('../alt');

const { } = require('../actions/editor');

class EditorStore {
  constructor() {

    this.bindListeners({

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

EditorStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(EditorStore);
