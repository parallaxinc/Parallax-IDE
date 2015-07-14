'use strict';

const alt = require('../alt');
const contextTypes = require('../context-types');
// Actions
const { loadFile, saveFile } = require('../actions/file');
const { showSave } = require('../actions/overlay');
// Stores
const overlayStore = require('./overlay');

const {
  SAVE_AS_OVERLAY
} = contextTypes;

class ContextStore {
  constructor(){
    this.bindListeners({
      onShowSaveAsOverlay: [loadFile, saveFile, showSave]
    });

    this.state = {
      type: null
    };
  }

  onShowSaveAsOverlay(){
    // ugh anti-pattern
    this.waitFor(overlayStore);

    const { showSaveOverlay } = overlayStore.getState();

    if(showSaveOverlay){
      this.setState({ type: SAVE_AS_OVERLAY });
    }
  }

}

ContextStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(ContextStore);
