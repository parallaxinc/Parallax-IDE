'use strict';

const alt = require('../alt');

const { findNext, findPrevious } = require('../actions/find');
const { handleInput } = require('../actions/editor');
const { moveByScrollUpLine, moveByScrollDownLine } = require('../actions/editor-move');
const { indent } = require('../actions/text-move');
const { print } = require('../actions/system');

class EditorStore {
  constructor() {

    this.bindListeners({
      onFindNext: findNext,
      onFindPrevious: findPrevious,
      onHandleInput: handleInput,
      onMoveByScrollUpLine: moveByScrollUpLine,
      onMoveByScrollDownLine: moveByScrollDownLine,
      onIndent: indent,
      onPrint: print
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
  onHandleInput(inst) {
    const { workspace } = this.getInstance();

    workspace.updateContent(inst.getValue());
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
  onIndent() {
    const { cm } = this.getInstance();

    cm.execCommand('insertSoftTab');
  }
  onPrint() {
    const { cm, workspace } = this.getInstance();

    const { title } = document;
    document.title = workspace.filename.deref();
    cm.setOption('viewportMargin', Infinity);
    window.print();
    document.title = title;
    cm.setOption('viewportMargin', 10);
  }

}

EditorStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(EditorStore);
