'use strict';

const alt = require('../alt');

const { moveByScrollUpLine, moveByScrollDownLine } = require('../actions/editor-move');

class EditorMoveStore {
  constructor() {

    this.bindListeners({
      onMoveByScrollUpLine: moveByScrollUpLine,
      onMoveByScrollDownLine: moveByScrollDownLine
    });

  }

  onMoveByScrollUpLine() {
    const { cm } = this.getInstance();

    const scrollbox = cm.getScrollInfo();
    cm.scrollTo(null, scrollbox.top - cm.defaultTextHeight());
  }
  onMoveByScrollDownLine() {
    const { cm } = this.getInstance();

    const scrollbox = cm.getScrollInfo();
    cm.scrollTo(null, scrollbox.top + cm.defaultTextHeight());
  }

}

EditorMoveStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(EditorMoveStore);
