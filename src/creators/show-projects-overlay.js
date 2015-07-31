'use strict';

const {
  SHOW_OVERLAY
} = require('../constants/action-types');

const {
  PROJECTS_OVERLAY
} = require('../constants/overlay-states');

function showProjectsOverlay(){
  return {
    type: SHOW_OVERLAY,
    payload: {
      state: PROJECTS_OVERLAY
    }
  };
}

module.exports = showProjectsOverlay;
