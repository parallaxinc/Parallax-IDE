'use strict';

const {
  RX_ON
} = require('../constants/action-types');

function rxOn(timeout){
  return {
    type: RX_ON,
    payload: {
      timeout
    }
  };
}

module.exports = rxOn;
