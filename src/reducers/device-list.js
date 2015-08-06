'use strict';

const {
  RELOAD_DEVICES,
  UPDATE_DEVICES
} = require('../constants/action-types');

const initial = [];

function deviceList(state = initial, { type, payload }){
  switch(type){
    case RELOAD_DEVICES:
      return initial;
    case UPDATE_DEVICES:
      return payload.devices;
    default:
      return state;
  }
}

module.exports = deviceList;
