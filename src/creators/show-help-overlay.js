'use strict';

const {
  SHOW_OVERLAY
} = require('../constants/action-types');

const {
  HELP_OVERLAY
} = require('../constants/overlay-states');

function showHelpOverlay(){
  return {
    type: SHOW_OVERLAY,
    payload: {
      state: HELP_OVERLAY
    }
  };
}

module.exports = showHelpOverlay;
