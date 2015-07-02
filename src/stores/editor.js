'use strict';

const alt = require('../alt');

const { findNext, findPrevious, replace } = require('../actions/find');
const { handleInput, syntaxCheck } = require('../actions/editor');
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
      onReplace: replace,
      onSyntaxCheck: syntaxCheck
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
    const { cm, workspace } = this.getInstance();

    const { title } = document;
    document.title = workspace.filename.deref();
    cm.setOption('viewportMargin', Infinity);
    window.print();
    document.title = title;
    cm.setOption('viewportMargin', 10);
  }
  onReplace() {
    const { cm } = this.getInstance();

    cm.execCommand('replace');
  }
  onSyntaxCheck() {
    const { workspace, compile } = this.getInstance();
    const result = compile({
      type: 'bs2',
      source: workspace.current.deref()
    });
    if(result.error){
      this._handleError(result.error);
    } else {
      this._handleClear();
      this._handleSuccess('Tokenization successful!');
    }
  }

  _handleClear(){
    const { toasts } = this.getInstance();

    toasts.clear();
  }

  _handleError(err){
    const { toasts } = this.getInstance();

    toasts.error(err);
  }

  _handleSuccess(msg){
    const { toasts } = this.getInstance();

    toasts.success(msg);
  }
}

EditorStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(EditorStore);
