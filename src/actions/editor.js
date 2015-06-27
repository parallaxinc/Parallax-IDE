'use strict';

const alt = require('../alt');

class EditorActions {
  handleInput(inst) {
    this.dispatch(inst);
  }
}

module.exports = alt.createActions(EditorActions);
