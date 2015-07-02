'use strict';

const alt = require('../alt');

class EditorActions {
  handleInput(inst) {
    this.dispatch(inst);
  }
  highlight(position, len) {
    this.dispatch({
      position: position,
      length: len
    });
  }
  syntaxCheck(){
    this.dispatch();
  }
}

module.exports = alt.createActions(EditorActions);
