'use strict';

const alt = require('../alt');

const { findNext, findPrevious, moveByScrollUpLine,
        moveByScrollDownLine, tab, print } = require('../actions/keys');

class KeyStore {
  constructor() {

    this.bindListeners({
      onFindNext: findNext,
      onFindPrevious: findPrevious,
      onMoveByScrollUpLine: moveByScrollUpLine,
      onMoveByScrollDownLine: moveByScrollDownLine,
      onTab: tab,
      onPrint: print
    });

    this.state = {
    };

  }

  onFindNext(evt) {
    const { cm } = this.getInstance();

    evt.preventDefault();
    cm.execCommand('findNext');
  }
  onFindPrevious(evt) {
    const { cm } = this.getInstance();

    evt.preventDefault();
    cm.execCommand('findPrev');
  }
  onMoveByScrollUpLine(evt) {
    const { cm } = this.getInstance();

    evt.preventDefault();
    const scrollbox = cm.getScrollInfo();
    cm.scrollTo(null, scrollbox.top - cm.defaultTextHeight());
  }
  onMoveByScrollDownLine(evt) {
    const { cm } = this.getInstance();

    evt.preventDefault();
    const scrollbox = cm.getScrollInfo();
    cm.scrollTo(null, scrollbox.top + cm.defaultTextHeight());
  }
  onTab(evt) {
    console.log('tab');
    const { cm } = this.getInstance();

    evt.preventDefault();
    cm.execCommand('insertSoftTab');
  }
  onPrint(evt) {
    evt.preventDefault();
    window.print();
  }

}

KeyStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(KeyStore);
