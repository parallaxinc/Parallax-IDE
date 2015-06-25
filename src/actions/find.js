'use strict';

const alt = require('../alt');

class FindActions {

  findNext() {
    this.dispatch();
  }

  findPrevious() {
    this.dispatch();
  }

  replace() {
    this.dispatch();
  }

}

module.exports = alt.createActions(FindActions);
