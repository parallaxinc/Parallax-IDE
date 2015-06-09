'use strict';

const alt = require('../alt');

const { findNext, findPrevious } = require('../actions/find');

class FindStore {
  constructor() {

    this.bindListeners({
      onFindNext: findNext,
      onFindPrevious: findPrevious
    });

  }

  onFindNext() {
    const { cm } = this.getInstance();

    cm.execCommand('findNext');
  }
  onFindPrevious() {
    const { cm } = this.getInstance();

    cm.execCommand('findPrev');
  }

}

FindStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(FindStore);
