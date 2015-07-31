'use strict';

const {
  HIDE_OVERLAY
} = require('../constants/action-types');

function hideOverlay(){
  return {
    type: HIDE_OVERLAY,
    payload: {}
  };
}

module.exports = hideOverlay;
