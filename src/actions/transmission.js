'use strict';

const alt = require('../alt');

class TransmissionActions {

  connected() {
    this.dispatch();
  }

  disconnected() {
    this.dispatch();
  }

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
