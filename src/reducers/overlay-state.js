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
      return state;
  }
}

module.exports = overlayState;
