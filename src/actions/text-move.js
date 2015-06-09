'use strict';

const alt = require('../alt');

class TextMoveActions {

  indent() {
    this.dispatch();
  }

}

module.exports = alt.createActions(TextMoveActions);
