'use strict';

const {
  DISCONNECT
} = require('../constants/action-types');

function disconnect(){
  return {
    type: DISCONNECT,
    payload: {}
  };
}

module.exports = disconnect;
