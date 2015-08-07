'use strict';

const {
  SHOW_OVERLAY
} = require('../constants/action-types');

const {
  DELETE_FILE_OVERLAY
} = require('../constants/overlay-states');

function showDeleteFileOverlay(){
  return {
    type: SHOW_OVERLAY,
    payload: {
      state: DELETE_FILE_OVERLAY
    }
  };
}

module.exports = showDeleteFileOverlay;
