'use strict';

const {
  ECHO_OFF
} = require('../constants/action-types');

function echoOff(){
  return {
    type: ECHO_OFF,
    payload: {}
  };
}

module.exports = echoOff;
