'use strict';

const {
  SHOW_OVERLAY
} = require('../constants/action-types');

const {
  NEW_VERSION_OVERLAY
} = require('../constants/overlay-states');

function showHelpOverlay(){
  return {
    type: SHOW_OVERLAY,
    payload: {
      state: NEW_VERSION_OVERLAY
    }
  };
}

module.exports = showHelpOverlay;
