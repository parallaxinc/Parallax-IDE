'use strict';

const {
  RX_OFF
} = require('../constants/action-types');

function rxOff(){
  return {
    type: RX_OFF,
    payload: {}
  };
}

module.exports = rxOff;
