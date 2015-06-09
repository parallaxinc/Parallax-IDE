'use strict';

const alt = require('../alt');

const { indent } = require('../actions/text-move');

class TextMoveStore {
  constructor() {

    this.bindListeners({
      onIndent: indent
    });

  }

  onIndent() {
    const { cm } = this.getInstance();

    cm.execCommand('insertSoftTab');
  }

}

TextMoveStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(TextMoveStore);
