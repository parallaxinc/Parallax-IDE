'use strict';

const {
  TRANSMIT
} = require('../constants/action-types');

function transmit(text){
  return {
    type: TRANSMIT,
    payload: {
      text
    }
  };
}

module.exports = transmit;
