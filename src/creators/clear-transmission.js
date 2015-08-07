'use strict';

const {
  CLEAR_TRANSMISSION
} = require('../constants/action-types');

function clearTransmission(){
  return {
    type: CLEAR_TRANSMISSION,
    payload: {}
  };
}

module.exports = clearTransmission;
