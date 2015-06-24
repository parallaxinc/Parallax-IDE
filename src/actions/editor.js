'use strict';

const alt = require('../alt');

class EditorActions {
  handleInput(inst) {
    this.dispatch(inst);
  }

  undo() {
    this.dispatch();
  }
}

module.exports = alt.createActions(EditorActions);
