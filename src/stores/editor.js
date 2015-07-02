'use strict';

const alt = require('../alt');
const styles = require('../../plugins/sidebar/styles');

const { findNext, findPrevious, replace } = require('../actions/find');
const { handleError, handleSuccess } = require('../actions/file');
const { handleInput, highlight, syntaxCheck } = require('../actions/editor');
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
      onHighlight: highlight,
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
      this.handleError(result.error);
    }else{
      this.handleSuccess('Tokenization successful!');
    }
  }
  onHighlight(opts) {
    const { cm } = this.getInstance();
    const doc = cm.getDoc();

    const anchor = doc.posFromIndex(opts.position);
    const head = doc.posFromIndex(opts.position + opts.length);

    doc.setSelection(anchor, head);
  }


  //duplicated from file store due to dispatch->dispatch invariant
  handleError(err){
    // leaving this in for better debugging of errors
    console.log(err);
    const { toast } = this.getInstance();

    toast.show(err.message, { style: styles.errorToast });
    if(err && err.errorLength){
      this.onHighlight({ position: err.errorPosition, length: err.errorLength });
    }
  }

  //duplicated from file store due to dispatch->dispatch invariant
  handleSuccess(msg){
    const { toast } = this.getInstance();

    toast.show(msg, { style: styles.successToast, timeout: 5000 });
  }
}

EditorStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(EditorStore);
