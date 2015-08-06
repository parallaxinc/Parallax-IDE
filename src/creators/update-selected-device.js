'use strict';

const {
  UPDATE_SELECTED_DEVICE
} = require('../constants/action-types');

function updateSelectedDevice(device){
  return {
    type: UPDATE_SELECTED_DEVICE,
    payload: {
      device
    }
  };
}

module.exports = updateSelectedDevice;
