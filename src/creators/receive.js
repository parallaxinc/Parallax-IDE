'use strict';

const {
  RECEIVE
} = require('../constants/action-types');

function receive(output, offset){
  return {
    type: RECEIVE,
    payload: {
      output,
      offset
    }
  };
}

module.exports = receive;
