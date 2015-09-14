'use strict';

const {
  SHOW_OVERLAY
} = require('../constants/action-types');

const {
  SAVE_ON_CHANGE_OVERLAY
} = require('../constants/overlay-states');

function showSaveOnChangeOverlay(){
  return {
    type: SHOW_OVERLAY,
    payload: {
      state: SAVE_ON_CHANGE_OVERLAY
    }
  };
}

module.exports = showSaveOnChangeOverlay;
