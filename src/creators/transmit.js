'use strict';

const {
  TRANSMIT
} = require('../constants/action-types');

function transmit(input){
  return {
    type: TRANSMIT,
    payload: {
      input
    }
  };
}

module.exports = transmit;
