'use strict';

const alt = require('../alt');

class EditorActions {
  handleInput(inst) {
    this.dispatch(inst);
  }

  syntaxCheck(){
    this.dispatch();
  }
}

module.exports = alt.createActions(EditorActions);
