'use strict';

const alt = require('../alt');

class ConsoleActions {
  clearOutput() {
    this.dispatch();
  }

  output(evt) {
    this.dispatch(evt);
  }

}

module.exports = alt.createActions(ConsoleActions);
