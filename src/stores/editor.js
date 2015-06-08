'use strict';

const alt = require('../alt');

const { handleInput } = require('../actions/editor');

class EditorStore {
  constructor() {

    this.bindListeners({
      onHandleInput: handleInput
    });

  }

  onHandleInput(inst) {

    const { workspace } = this.getInstance();

    workspace.updateContent(inst.getValue());
  }

}

EditorStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(EditorStore);
