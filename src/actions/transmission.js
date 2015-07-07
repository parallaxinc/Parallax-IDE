'use strict';

const alt = require('../alt');

class TransmissionActions {
  rx() {
    this.dispatch();
  }

  tx() {
    this.dispatch();
  }

  transmitInput(input) {
    this.dispatch(input);
  }
}

module.exports = alt.createActions(TransmissionActions);
