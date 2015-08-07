'use strict';

const {
  SHOW_OVERLAY
} = require('../constants/action-types');

const {
  DELETE_PROJECT_OVERLAY
} = require('../constants/overlay-states');

function showDeleteProjectOverlay(){
  return {
    type: SHOW_OVERLAY,
    payload: {
      state: DELETE_PROJECT_OVERLAY
    }
  };
}

module.exports = showDeleteProjectOverlay;
