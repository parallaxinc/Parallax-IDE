'use strict';

const alt = require('../alt');

class EditorActions {
  syntaxCheck(){
    this.dispatch();
  }
}

module.exports = alt.createActions(EditorActions);
