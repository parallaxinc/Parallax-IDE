'use strict';

const {
  RELOAD_DEVICES
} = require('../constants/action-types');

function reloadDevices(){
  return {
    type: RELOAD_DEVICES,
    payload: {}
  };
}

module.exports = reloadDevices;
