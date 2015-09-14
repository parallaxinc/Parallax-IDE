'use strict';

const {
  SHOW_OVERLAY
} = require('../constants/action-types');

const {
  OVERWRITE_OVERLAY
} = require('../constants/overlay-states');

function showOverwriteOverlay(){
  return {
    type: SHOW_OVERLAY,
    payload: {
      state: OVERWRITE_OVERLAY
    }
  };
}

module.exports = showOverwriteOverlay;
