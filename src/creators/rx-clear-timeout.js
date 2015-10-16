'use strict';

const {
  RX_CLEAR_TIMEOUT
} = require('../constants/action-types');

function rxClearTimeout(){
  return {
    type: RX_CLEAR_TIMEOUT,
    payload: {}
  };
}

module.exports = rxClearTimeout;
