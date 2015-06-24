'use strict';

const alt = require('../alt');

const { findNext, findPrevious } = require('../actions/find');
const { handleInput, undo } = require('../actions/editor');
const { moveByScrollUpLine, moveByScrollDownLine } = require('../actions/editor-move');
const { dedent, indent } = require('../actions/text-move');
const { print } = require('../actions/system');

class EditorStore {
  constructor() {

    this.bindListeners({
      onFindNext: findNext,
      onFindPrevious: findPrevious,
      onHandleInput: handleInput,
      onMoveByScrollUpLine: moveByScrollUpLine,
      onMoveByScrollDownLine: moveByScrollDownLine,
      onDedent: dedent,
      onIndent: indent,
      onPrint: print,
      onUndo: undo
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
  onUndo() {
    console.log('UNDOING');
    const { cm } = this.getInstance();
    const doc = cm.getDoc();
    //doc.undo();
    cm.execCommand('undo');
  }

}

EditorStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(EditorStore);
