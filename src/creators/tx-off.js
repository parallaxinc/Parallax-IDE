'use strict';

const {
  TX_OFF
} = require('../constants/action-types');

function txOff(){
  return {
    type: TX_OFF,
    payload: {}
  };
}

module.exports = txOff;
