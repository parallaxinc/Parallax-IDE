'use strict';

const {
  TX_CLEAR_TIMEOUT
} = require('../constants/action-types');

function txClearTimeout(){
  return {
    type: TX_CLEAR_TIMEOUT,
    payload: {}
  };
}

module.exports = txClearTimeout;
