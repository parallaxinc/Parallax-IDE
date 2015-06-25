'use strict';

const alt = require('../alt');

class SystemActions {

  print() {
    this.dispatch();
  }

  identify() {
    this.dispatch();
  }

}

module.exports = alt.createActions(SystemActions);
