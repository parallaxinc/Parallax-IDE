'use strict';

const alt = require('../alt');

class FindActions {

  findNext() {
    this.dispatch();
  }
  findPrevious() {
    this.dispatch();
  }

}

module.exports = alt.createActions(FindActions);
