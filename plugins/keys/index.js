'use strict';

const contextTypes = require('../../src/context-types');
// Actions
const { saveFileAs } = require('../../src/actions/file');
const { hideOverlays } = require('../../src/actions/overlay');
// Stores
const contextStore = require('../../src/stores/context');

const {
  SAVE_AS_OVERLAY,
  DELETE_OVERLAY
} = contextTypes;

function keys(app, opts, done){
  const { ENTER, ESC } = app.keypress;

  app.keypress(ENTER, function(evt){
    const { type } = contextStore.getState();

    switch(type){
      case SAVE_AS_OVERLAY:
        evt.preventDefault();
        saveFileAs();
        break;
    }
  });

  app.keypress(ESC, function(evt){
    const { type } = contextStore.getState();

    switch(type){
      case SAVE_AS_OVERLAY:
      case DELETE_OVERLAY:
        evt.preventDefault();
        hideOverlays();
        break;
    }
  });

  done();
}

module.exports = keys;
