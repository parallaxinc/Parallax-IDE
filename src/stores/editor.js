'use strict';

const alt = require('../alt');

const { syntaxCheck } = require('../actions/editor');

class EditorStore {
  constructor() {

    this.bindListeners({
      onSyntaxCheck: syntaxCheck
    });

  }
  onSyntaxCheck() {
    const { workspace, compile } = this.getInstance();
    const { content } = workspace.getState();
    const result = compile({
      type: 'bs2',
      source: content
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
