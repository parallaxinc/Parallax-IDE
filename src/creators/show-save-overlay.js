'use strict';

const {
  SHOW_OVERLAY
} = require('../constants/action-types');

const {
  SAVE_OVERLAY
} = require('../constants/overlay-states');

function showSaveOverlay(){
  return {
    type: SHOW_OVERLAY,
    payload: {
      state: SAVE_OVERLAY
    }
  };
}

module.exports = showSaveOverlay;
