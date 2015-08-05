'use strict';

const {
  HIDE_OVERLAY
} = require('../constants/action-types');

const {
  NO_OVERLAY
} = require('../constants/overlay-states');

function hideOverlay(){
  return {
    type: HIDE_OVERLAY,
    payload: {
      state: NO_OVERLAY
    }
  };
}

module.exports = hideOverlay;
