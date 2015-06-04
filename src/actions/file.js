'use strict';

const alt = require('../alt');

class FileActions {
  clearName() {
    this.dispatch();
  }

  updateName(value) {
    this.dispatch(value);
  }
}

module.exports = alt.createActions(FileActions);
