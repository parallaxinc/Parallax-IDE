'use strict';

const {
  TX_ON
} = require('../constants/action-types');

function txOn(timeout){
  return {
    type: TX_ON,
    payload: {
      timeout
    }
  };
}

module.exports = txOn;
