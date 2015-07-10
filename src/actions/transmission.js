'use strict';

const alt = require('../alt');

class TransmissionActions {
  rx() {
    this.dispatch();
  }

  tx() {
    this.dispatch();
  }
}

module.exports = alt.createActions(TransmissionActions);
