'use strict';

const alt = require('../alt');

const { findNext, findPrevious, replace } = require('../actions/find');
const { handleInput } = require('../actions/editor');
const { moveByScrollUpLine, moveByScrollDownLine } = require('../actions/editor-move');
const { dedent, indent } = require('../actions/text-move');
const { print } = require('../actions/system');

class EditorStore {
  constructor() {

    this.bindListeners({
      onDedent: dedent,
      onFindNext: findNext,
      onFindPrevious: findPrevious,
      onHandleInput: handleInput,
      onIndent: indent,
      onMoveByScrollUpLine: moveByScrollUpLine,
      onMoveByScrollDownLine: moveByScrollDownLine,
      onPrint: print,
      onReplace: replace
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

    cm.execCommand('indentMore');
  }
  onDedent() {
    const { cm } = this.getInstance();

    cm.execCommand('indentLess');
  }
  onPrint() {
    window.print();
  }
  onReplace() {
    const { cm } = this.getInstance();

    cm.execCommand('replace');
  }

}

EditorStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(EditorStore);
