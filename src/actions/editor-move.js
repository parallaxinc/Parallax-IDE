'use strict';

const alt = require('../alt');

class EditorMoveActions {

  moveByScrollUpLine() {
    this.dispatch();
  }
  moveByScrollDownLine() {
    this.dispatch();
  }

}

module.exports = alt.createActions(EditorMoveActions);
