'use strict';

const {
  SHOW_OVERLAY,
  HIDE_OVERLAY
} = require('../constants/action-types');

const initial = '';

function overlayState(state = initial, { type, payload }){
  switch(type){
    case SHOW_OVERLAY:
      return payload.state;
    case HIDE_OVERLAY:
      return payload.state;
    default:
      // We only want overlay to flash once, so if any action is
      // dispatched that isn't an action we are watching, reset
      // to initial
      return initial;
  }
}

module.exports = overlayState;
