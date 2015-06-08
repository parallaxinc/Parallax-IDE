'use strict';

const alt = require('../alt');

class KeyActions {
  findNext(evt) {
    this.dispatch(evt);
  }
  findPrevious(evt) {
    this.dispatch(evt);
  }
  moveByScrollUpLine(evt) {
    this.dispatch(evt);
  }
  moveByScrollDownLine(evt) {
    this.dispatch(evt);
  }
  tab(evt) {
    this.dispatch(evt);
  }
  print(evt) {
    this.dispatch(evt);
  }

}

module.exports = alt.createActions(KeyActions);
