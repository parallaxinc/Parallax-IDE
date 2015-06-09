'use strict';

const alt = require('../alt');

class ConsoleActions {
  clearOutput() {
    this.dispatch();
  }

  output(terminalMsg) {
    this.dispatch(terminalMsg);
  }

}

module.exports = alt.createActions(ConsoleActions);
