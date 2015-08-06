'use strict';

const {
  RECEIVE
} = require('../constants/action-types');

function receive(output){
  return {
    type: RECEIVE,
    payload: {
      output
    }
  };
}

module.exports = receive;
