'use strict';

const {
  SHOW_OVERLAY
} = require('../constants/action-types');

const {
  SAVE_OVERLAY,
  SAVE_ON_CHANGE_OVERLAY
} = require('../constants/overlay-states');

function showSaveOverlay(showDontSaveButton){
  const state = showDontSaveButton ? SAVE_ON_CHANGE_OVERLAY : SAVE_OVERLAY;
  return {
    type: SHOW_OVERLAY,
    payload: {
      state
    }
  };
}

module.exports = showSaveOverlay;
