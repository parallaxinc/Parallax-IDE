'use strict';

const {
  UPDATE_DEVICES
} = require('../constants/action-types');

function updateDevices(devices){
  return {
    type: UPDATE_DEVICES,
    payload: {
      devices
    }
  };
}

module.exports = updateDevices;
